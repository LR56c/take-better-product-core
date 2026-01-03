import {
  ValidInteger
}                          from "../../shared/domain/value_objects/valid_integer.js"
import {
  ValidString
}                          from "../../shared/domain/value_objects/valid_string.js"
import { type Either }          from "fp-ts/lib/Either.js"
import {
  BaseException
}                          from "../../shared/domain/exceptions/base_exception.js"
import { type PaginatedResult } from "../../shared/domain/paginated_result.js"
import { UUID }            from "../../shared/domain/value_objects/uuid.js"
import { ExtraData }       from "./extra_data.js"

export abstract class ExtraDataDAO {
  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<ExtraData>>>

  abstract add( data: ExtraData ): Promise<Either<BaseException, boolean>>

  abstract update( data: ExtraData ): Promise<Either<BaseException, boolean>>

  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>
}