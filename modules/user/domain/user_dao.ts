import { Either }          from "fp-ts/Either"
import {
  ValidInteger
}                          from "../../shared/domain/value_objects/valid_integer"
import { ValidString }     from "../../shared/domain/value_objects/valid_string"
import { BaseException }   from "../../shared/domain/exceptions/base_exception"
import { User }            from "./user"
import { UUID }            from "../../shared/domain/value_objects/uuid"
import { PaginatedResult } from "../../shared/domain/paginated_result"

export abstract class UserDAO {
  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<User>>>

  abstract add(user : User): Promise<Either<BaseException, boolean>>

  abstract update( user : User ): Promise<Either<BaseException, boolean>>

  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>
}