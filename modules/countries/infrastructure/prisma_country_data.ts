import { type Either, left, right } from "fp-ts/Either"
import * as changeCase              from "change-case"
import { PrismaClient }             from "@prisma/client"
import {
  InfrastructureException
}                                   from "../../shared/domain/exceptions/infrastructure_exception"
import {
  UUID
}                                   from "../../shared/domain/value_objects/uuid"
import {
  BaseException
}                                   from "../../shared/domain/exceptions/base_exception"
import { Country }                  from "../domain/country"
import {
  ValidInteger
}                                   from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                   from "../../shared/domain/value_objects/valid_string"
import { PaginatedResult }          from "../../shared/domain/paginated_result"
import { Errors }                   from "../../shared/domain/exceptions/errors"
import { CountryDAO }               from "../domain/country_dao"


export class PrismaCountryData implements CountryDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( country: Country ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.country.create( {
        data: {
          id       : country.id.toString(),
          name     : country.name.value,
          code     : country.code.value,
          createdAt: country.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.country.delete( {
        where: {
          id: id.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async update( country: Country ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.country.update( {
        where: {
          id: country.id.toString()
        },
        data : {
          name: country.name.value,
          code: country.code.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Country>>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id
        }
      }
      if ( query.name ) {
        // @ts-ignore
        where["name"] = {
          contains: query.name
        }
      }
      if ( query.code ) {
        // @ts-ignore
        where["code"] = {
          equals: query.code
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset                 = skip ? parseInt( skip.value ) : 0
      const results                = await this.db.$transaction( [
        this.db.country.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value
        } ),
        this.db.country.count( {
          where: where
        } )
      ] )
      const [response, totalCount] = results
      const countries: Country[]   = []
      for ( const country of response ) {
        const mapped = Country.fromPrimitives(
          country.id.toString(),
          country.name,
          country.code,
          country.currency,
          country.createdAt
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        countries.push( mapped )
      }
      return right( {
        items: countries,
        total: totalCount
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

}
