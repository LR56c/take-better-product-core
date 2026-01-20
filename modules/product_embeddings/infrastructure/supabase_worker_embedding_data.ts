import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  SupabaseClient
}                                      from "@supabase/supabase-js"
import {
  ProductEmbeddingAI
}                                      from "../domain/product_embedding_ai"
import {
  ProductEmbeddingRepository,
  VectorSearchResult
}                                      from "../domain/product_embedding_repository"
import {
  UUID
}                                      from "../../shared/domain/value_objects/uuid"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                                      from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                      from "../../shared/domain/value_objects/valid_string"
import {
  ProductEmbedding
}                                      from "../domain/product_embedding"
import {
  InfrastructureException
}                                      from "../../shared/domain/exceptions/infrastructure_exception"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"

export class SupabaseWorkerEmbeddingData
  implements ProductEmbeddingRepository {
  constructor(
    private readonly ai: ProductEmbeddingAI,
    private readonly client: SupabaseClient
  )
  {
  }

  async remove( ids: UUID[] ): Promise<Either<BaseException, boolean>> {
    return left(new InfrastructureException())
  }

  async search( query: Record<string, any>, limit?: ValidInteger, skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], ProductEmbedding[]>> {
    const vector = await this.ai.generate( query.content )

    if ( isLeft( vector ) ) {
      return left( [vector.left] )
    }

    const { data, error } = await this.client.rpc( "match_worker_vector", {
      query_embedding     : vector.right,
      match_threshold     : 0.65,
      match_count         : limit?.value ?? 5,
    } )
    if ( error ) {
      return left( [new InfrastructureException()] )
    }

    const embeddings: ProductEmbedding[] = []
    for ( const json of data ) {
      const mapped = ProductEmbedding.fromPrimitives(
        json.id,
        json.productId,
        json.content,
        json.vector,
        json.created_at,
        json.updated_at
      )
      if ( mapped instanceof Errors ) {
        return left( mapped.values )
      }
      embeddings.push( mapped )
    }
    return right( embeddings )
  }

  async similarity( vector: number[], threshold: number,
    limit?: ValidInteger ): Promise<Either<BaseException, VectorSearchResult[]>> {
    return left(new InfrastructureException())
  }

  async upsert( embed: ProductEmbedding ): Promise<Either<BaseException, boolean>> {
    return left(new InfrastructureException())
  }


}