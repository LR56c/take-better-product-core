import { StoreDAO }                 from "../domain/store_dao"
import { Store }                    from "../domain/store"
import { type Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                                   from "../../shared/domain/exceptions/base_exception"
import { PaginatedResult }          from "../../shared/domain/paginated_result"
import {
  ValidInteger
}                                   from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                   from "../../shared/domain/value_objects/valid_string"
import {
  UUID
}                                   from "../../shared/domain/value_objects/uuid"
import { PrismaClient }             from "@prisma/client"
import {
  InfrastructureException
}                                   from "../../shared/domain/exceptions/infrastructure_exception"
import { Country }                  from "../../countries/domain/country"
import { Errors }                   from "../../shared/domain/exceptions/errors"


export class PrismaStoreData implements StoreDAO {
  constructor( private readonly client: PrismaClient ) {
  }

  async search(
    query: Record<string, any>,
    limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString
  ): Promise<Either<BaseException[], PaginatedResult<Store>>> {
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
    if ( query.countryId ) {
      where["countryId"] = {
        equals: query.countryId
      }
    }
    if ( query.type ) {
      where["type"] = {
        equals: query.type
      }
    }

    const orderBy: any = {}
    if ( sortBy ) {
      const key    = sortBy.value
      orderBy[key] = sortType ? sortType.value : "desc"
    }

    const offset  = skip ? parseInt( skip.value ) : 0
    const results = await this.client.$transaction( [
      this.client.store.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value,
        include: {
          country: true
        }
      } ),
      this.client.store.count( {
        where: where
      } )
    ] )

    const [response, totalCount] = results
    const stores: Store[]        = []

    for ( const store of response ) {
      const mappedCountry = Country.fromPrimitives(
        store.country.id,
        store.country.name,
        store.country.code,
        store.country.currency,
        store.country.createdAt
      )

      if ( mappedCountry instanceof Errors ) {
        return left( mappedCountry.values )
      }

      const mapped = Store.fromPrimitives(
        store.id,
        mappedCountry,
        store.name,
        store.url,
        store.thumbnail,
        store.type,
        store.createdAt
      )

      if ( mapped instanceof Errors ) {
        return left( mapped.values )
      }
      stores.push( mapped )
    }

    return right( {
      items: stores,
      total: totalCount
    } )

  }

  async add( store: Store ): Promise<Either<BaseException, boolean>> {
    try {
      await this.client.store.create( {
        data: {
          id       : store.id.toString(),
          name     : store.name.value,
          url      : store.url?.value,
          thumbnail: store.thumbnail?.value,
          type     : store.type.value,
          countryId: store.country.id.toString(),
          createdAt: store.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException( "Error adding store" ) )
    }
  }

  async update( store: Store ): Promise<Either<BaseException, boolean>> {
    try {
      await this.client.store.update( {
        where: {
          id: store.id.toString()
        },
        data : {
          name     : store.name.value,
          url      : store.url?.value,
          thumbnail: store.thumbnail?.value,
          type     : store.type.value,
          countryId: store.country.id.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException( "Error updating store" ) )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.client.store.delete( {
        where: {
          id: id.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException( "Error removing store" ) )
    }
  }
}
