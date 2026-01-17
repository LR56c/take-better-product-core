import { Prisma, PrismaClient } from "@prisma/client"
import {
  type Either,
  left,
  right
}                               from "fp-ts/lib/Either.js"
import {
  BaseException
}                               from "../../shared/domain/exceptions/base_exception"
import {
  ProductEmbeddingRepository,
  VectorSearchResult
}                               from "../domain/product_embedding_repository"
import {
  ProductEmbedding
}                               from "../domain/product_embedding"
import {
  UUID
}                               from "../../shared/domain/value_objects/uuid"
import {
  ValidInteger
}                               from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                               from "../../shared/domain/value_objects/valid_string"
import {
  PaginatedResult
}                               from "../../shared/domain/paginated_result"
import {
  InfrastructureException
}                               from "../../shared/domain/exceptions/infrastructure_exception"
import {
  Errors
}                               from "../../shared/domain/exceptions/errors"
import * as changeCase          from "change-case"

export class PrismaProductEmbeddingData
  implements ProductEmbeddingRepository {
  constructor(
    private readonly db: PrismaClient,
  ) {
  }

  async upsert( embed: ProductEmbedding ): Promise<Either<BaseException, boolean>> {
    try {
      const vectorString = `[${ embed.vector.join( "," ) }]`

      await this.db.$executeRaw`
          INSERT INTO product_embedding (id, product_id, content, embedding, created_at,
                                         updated_at)
          VALUES (${ embed.id.toString() }::uuid,
                  ${ embed.product.id.toString() }::uuid,
                  ${ embed.content.value },  ${ vectorString }::vector, NOW(),
                  NOW()) ON CONFLICT (product_id) DO
          UPDATE SET
              content = EXCLUDED.content,
              embedding = EXCLUDED.embedding,
              updated_at = NOW();
      `
      return right( true )
    }
    catch ( e ) {
      console.log("upsert e", e)
      return left( new InfrastructureException( (
        e as Error
      ).message ) )
    }
  }

  async remove( ids: UUID[] ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.productEmbedding.deleteMany( {
        where: {
          id: {
            in: ids.map( id => id.toString() )
          }
        }
      } )
      return right( true )
    }
    catch ( e ) {
      console.log("remove e", e)
      return left( new InfrastructureException( (
        e as Error
      ).message ) )
    }
  }

  async similarity( vector: number[], threshold: number, limit?: ValidInteger): Promise<Either<BaseException, VectorSearchResult[]>> {
    try {
      const result: VectorSearchResult[] = await this.db.$queryRaw`
          SELECT product_id                              as "productId",
                 1 - (embedding <=> ${ vector }::vector) as similarity
          FROM product_embedding
          WHERE 1 - (embedding <=> ${ vector }::vector) > ${ threshold}
          ORDER BY similarity DESC
              LIMIT ${ limit?.value ?? 10 };
      `
      return right( result )
    }
    catch ( e ) {
      console.log("similarity e", e)

      return left( new InfrastructureException( (
        e as Error
      ).message ) )
    }
  }

  async mapQuery( query: Record<string, any>): Promise<{
    query: Record<string, any>,
  }>
  {
    const where: Record<string, any>   = {}
    if ( query.id ) where["id"] = { equals: query.id }
    if ( query.ids ) {
      const arr: string[] = query.ids.split( "," )
      where["id"]         = {
        in: arr
      }
    }
    return {
      query : where,
    }
  }


  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString, sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<ProductEmbedding>>> {
    try {
      const { query: where } = await this.mapQuery( query)
      const orderField     = sortBy
        ? changeCase.camelCase( sortBy.value )
        : "createdAt"
      const orderDirection = sortType ? sortType.value : "desc"
      const orderBy        = { [orderField]: orderDirection }

      let cursor: any | undefined
      if ( skip ) {
        cursor = { id: skip.value }
      }

      const [response, totalCount] = await this.db.$transaction( [
        this.db.productEmbedding.findMany( {
          where,
          orderBy,
          cursor,
          skip   : skip ? 1 : undefined,
          take   : limit?.value,
          include: {
            product          : {
              include: {
                stores: true
              }
            },
          }
        } ),
        this.db.productEmbedding.count( { where } )
      ] )

      const embeddingIds = response.map(embed => embed.id);
      const vectors: any[] = embeddingIds.length > 0 ? await this.db.$queryRaw`
        SELECT id, embedding::text as vector FROM product_embedding WHERE id::text IN (${Prisma.join(embeddingIds)})
      ` : [];

      const vectorMap = new Map(vectors.map(v => [v.id, v.vector]));

      const embeds: ProductEmbedding[] = []
      for ( const embed of response ) {
        // @ts-ignore
        const mappedProduct = parseProduct( embed.product )
        if ( mappedProduct instanceof Errors ) {
          return left( mappedProduct.values )
        }

        const vectorString = vectorMap.get(embed.id) || '[]';
        const vector = JSON.parse(vectorString);

        const embedding = ProductEmbedding.fromPrimitives(
          embed.id,
          mappedProduct,
          embed.content,
          vector,
          embed.createdAt,
          embed.updatedAt ?? undefined,
        )
        if ( embedding instanceof Errors ) {
          return left( embedding.values )
        }
        embeds.push( embedding )
      }
      console.log('embeds',embeds)

      return right( {
        items: embeds,
        total: totalCount
      } )
    }
    catch ( e ) {
      console.log("search e", e)
      return left( [
        new InfrastructureException( (
          e as Error
        ).message )
      ] )
    }
  }
}