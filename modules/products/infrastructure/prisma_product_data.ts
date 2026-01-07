import { ProductDAO }          from "../domain/product_dao"
import { Product }                  from "../domain/product"
import { type Either, left, right } from "fp-ts/Either"
import { BaseException }            from "../../shared/domain/exceptions/base_exception"
import { PaginatedResult }     from "../../shared/domain/paginated_result"
import { ValidInteger }        from "../../shared/domain/value_objects/valid_integer"
import { ValidString }         from "../../shared/domain/value_objects/valid_string"
import { UUID }                from "../../shared/domain/value_objects/uuid"
import { Errors }              from "../../shared/domain/exceptions/errors"
import { PrismaClient } from "@prisma/client"
import {
  InfrastructureException
} from "../../shared/domain/exceptions/infrastructure_exception"

export class PrismaProductData extends ProductDAO {
  constructor( private client: PrismaClient ) {
    super()
  }

  async search(
    query: Record<string, any>,
    limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString
  ): Promise<Either<BaseException[], PaginatedResult<Product>>> {
    const where : any = {}
    if ( query.id ) {
      where["id"] = {
        equals: query.id
      }
    }
    if ( query.storeId ) {
      where["storeId"] = {
        equals: query.storeId
      }
    }
    if ( query.brandId ) {
      where["brandId"] = {
        equals: query.brandId
      }
    }
    if ( query.categoryId ) {
      where["categoryId"] = {
        equals: query.categoryId
      }
    }
    if ( query.externalId ) {
      where["externalId"] = {
        contains: query.externalId
      }
    }
    if ( query.url ) {
      where["url"] = {
        contains: query.url
      }
    }
    if ( query.title ) {
      where["title"] = {
        contains: query.title
      }
    }
    if ( query.description ) {
      where["description"] = {
        contains: query.description
      }
    }
    if ( query.price ) {
      where["price"] = {
        equals: query.price
      }
    }
    if ( query.currency ) {
      where["currency"] = {
        equals: query.currency
      }
    }

    const orderBy: any = {}
    if ( sortBy ) {
      const key    = sortBy.value
      orderBy[key] = sortType ? sortType.value : "desc"
    }

    const offset  = skip ? parseInt( skip.value ) : 0
    const results = await this.client.$transaction( [
      this.client.product.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value
      } ),
      this.client.product.count( {
        where: where
      } )
    ] )

    const [response, totalCount] = results
    const products: Product[]    = []

    for ( const product of response ) {
      const mapped = Product.fromPrimitives(
        product.id,
        product.storeId,
        product.brandId,
        product.categoryId,
        product.externalId,
        product.url,
        product.title,
        product.description,
        product.price,
        product.currency,
        product.additionalData,
        product.createdAt
      )

      if ( mapped instanceof Errors ) {
        return left( mapped.values )
      }
      products.push( mapped )
    }

    return right( {
      items: products,
      total: totalCount
    } )
  }

  async add( product: Product ): Promise<Either<BaseException, boolean>> {
    try {
      await this.client.product.create( {
        data: {
          id            : product.id.toString(),
          storeId       : product.storeId.toString(),
          brandId       : product.brandId?.toString(),
          categoryId    : product.categoryId?.toString(),
          externalId    : product.externalId.value,
          url           : product.url.value,
          title         : product.title.value,
          description   : product.description?.value,
          price         : product.price.value,
          currency      : product.currency.value,
          additionalData: product.additionalData
        }
      } )
      return right( true )
    } catch ( e: any ) {
      return left( new InfrastructureException( e.message ) )
    }
  }

  async update( product: Product ): Promise<Either<BaseException, boolean>> {
    try {
      await this.client.product.update( {
        where: {
          id: product.id.toString()
        },
        data : {
          storeId       : product.storeId.toString(),
          brandId       : product.brandId?.toString(),
          categoryId    : product.categoryId?.toString(),
          externalId    : product.externalId.value,
          url           : product.url.value,
          title         : product.title.value,
          description   : product.description?.value,
          price         : product.price.value,
          currency      : product.currency.value,
          additionalData: product.additionalData
        }
      } )
      return right( true )
    } catch ( e: any ) {
      return left( new InfrastructureException( e.message ) )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.client.product.delete( {
        where: {
          id: id.toString()
        }
      } )
      return right( true )
    } catch ( e: any ) {
      return left( new InfrastructureException( e.message ) )
    }
  }
}
