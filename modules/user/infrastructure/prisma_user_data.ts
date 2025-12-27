import { BaseException }       from "../../shared/domain/exceptions/base_exception"
import { UUID }                from "../../shared/domain/value_objects/uuid"
import {
  ValidInteger
}                              from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                              from "../../shared/domain/value_objects/valid_string"
import { PaginatedResult }     from "../../shared/domain/paginated_result"
import { Either, left, right } from "fp-ts/Either"
import * as changeCase         from "change-case"
import {
  InfrastructureException
}                              from "../../shared/domain/exceptions/infrastructure_exception"
import { PrismaClient }        from "@prisma/client"
import { Errors }              from "../../shared/domain/exceptions/errors"
import { UserDAO }             from "../domain/user_dao"
import { User }                from "../domain/user"
import {
  DataAlreadyExistException
}                              from "../../shared/domain/exceptions/data_already_exist_exception"
import { parseUser }           from "../utils/parse_user"

export class PrismaUserData implements UserDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async add( user: User ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.user.create( {
        data: {
          id       : user.id.toString(),
          role     : user.role.value,
          username : user.username.value,
          createdAt: user.createdAt.toString(),
        }
      } )
      return right( true )
    }
    catch ( e: any ) {
      const code = e.code
      if ( code ) {
        if ( code === "P2002" ) {
          return left( new DataAlreadyExistException() )
        }
      }
      return left( new InfrastructureException() )
    }
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.user.delete( {
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

  mapQuery( query: Record<string, any> ): {
    query: Record<string, any>,
    count: number | undefined
  }
  {
    const where: Record<string, any> = {}
    let idsCount                     = undefined
    if ( query.id ) {
      where["id"] = {
        equals: query.id
      }
    }
    if ( query.ids ) {
      const arr   = query.ids.split( "," )
      idsCount    = arr.length
      where["id"] = {
        in: arr
      }
    }

    if ( query.role ) {
      where["role"] = {
        equals: query.role
      }
    }
    if ( query.username ) {
      where["username"] = {
        contains: query.username,
        mode    : "insensitive"
      }
    }
    return {
      query: where,
      count: idsCount
    }
  }


  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<User>>> {
    try {
      const whereResult          = this.mapQuery( query )
      const where          = whereResult.query
      const idsCount       = whereResult.count
      const orderField     = sortBy
        ? changeCase.camelCase( sortBy.value )
        : "createdAt"
      const orderDirection = sortType ? sortType.value : "desc"
      const orderBy        = { [orderField]: orderDirection }

      let cursor: any | undefined
      const cursorBy = sortBy && sortBy.value === "created_at"
        ? "createdAt"
        : "id"
      if ( skip ) {
        cursor = { [cursorBy]: skip.value }
      }
      // const offset                    = skip ? parseInt( skip.value ) : 0
      const results                = await this.db.$transaction( [
        this.db.user.findMany( {
          where  : where,
          orderBy: orderBy,
          cursor : cursor,
          // skip   : offset,
          skip: skip ? 1 : undefined,
          take: limit?.value
        } ),
        this.db.user.count( {
          where: where
        } )
      ] )
      const [response, totalCount] = results
      if ( idsCount && response.length !== idsCount ) {
        return left(
          [new InfrastructureException( "Not all users found" )] )
      }
      const users: User[]      = []
      for ( const item of response ) {
        const mapped = parseUser( item )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        users.push( mapped )
      }
      return right( {
        items: users,
        total: totalCount
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async update( user: User ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.user.update( {
        where: {
          id: user.id.toString()
        },
        data : {
          role     : user.role.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }


}