import { BrandDAO }          from "../domain/brand_dao"
import { Brand }               from "../domain/brand"
import { type Either }         from "fp-ts/Either"
import { BaseException }       from "../../shared/domain/exceptions/base_exception"
import { PaginatedResult }     from "../../shared/domain/paginated_result"
import { ValidInteger }        from "../../shared/domain/value_objects/valid_integer"
import { ValidString }         from "../../shared/domain/value_objects/valid_string"
import { UUID }        from "../../shared/domain/value_objects/uuid"
import { left, right } from "fp-ts/lib/Either"
import {
  InfrastructureException
} from "../../shared/domain/exceptions/infrastructure_exception"
import { PrismaClient }        from "@prisma/client"
import { Errors }              from "../../shared/domain/exceptions/errors"

export class PrismaBrandData extends BrandDAO {
  constructor( private client: PrismaClient ) {
    super()
  }

  async search(
    query: Record<string, any>,
    limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString
  ): Promise<Either<BaseException[], PaginatedResult<Brand>>> {
    const where: any = {}
    if ( query.id ) {
      where["id"] = {
        equals: query.id
      }
    }
    if ( query.name ) {
      where["name"] = {
        contains: query.name
      }
    }

    const orderBy: any = {}
    if ( sortBy ) {
      const key    = sortBy.value
      orderBy[key] = sortType ? sortType.value : "desc"
    }

    const offset  = skip ? parseInt( skip.value ) : 0
    const results = await this.client.$transaction( [
      this.client.brand.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value
      } ),
      this.client.brand.count( {
        where: where
      } )
    ] )

    const [response, totalCount] = results
    const brands: Brand[]        = []

    for ( const brand of response ) {
      const mapped = Brand.fromPrimitives(
        brand.id,
        brand.name,
        brand.createdAt
      )

      if ( mapped instanceof Errors ) {
        return left( mapped.values )
      }
      brands.push( mapped )
    }

    return right( {
      items: brands,
      total: totalCount
    } )
  }

  async add( brand: Brand ): Promise<Either<BaseException, boolean>> {
    try {
      await this.client.brand.create( {
        data: {
          id  : brand.id.toString(),
          name: brand.name.value
        }
      } )
      return right( true )
    } catch ( e: any ) {
      return left( new InfrastructureException( "Error adding store" ) )
    }

  }

  async update( brand: Brand ): Promise<Either<BaseException, boolean>> {
    try {
      await this.client.brand.update( {
        where: {
          id: brand.id.toString()
        },
        data : {
          name: brand.name.value
        }
      } )
      return right( true )
    } catch ( e: any ) {
      return left( new InfrastructureException( "Error updating brand" ) )
    }

  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.client.brand.delete( {
        where: {
          id: id.toString()
        }
      } )
      return right( true )
    } catch ( e: any ) {
      return left( new InfrastructureException( "Error removing brand" ) )
    }

  }
}
