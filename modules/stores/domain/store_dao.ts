import { Store }           from "./store"
import { type Either }       from "fp-ts/Either"
import {
  ValidInteger
}                            from "../../shared/domain/value_objects/valid_integer"
import { ValidString }       from "../../shared/domain/value_objects/valid_string"
import { BaseException }     from "../../shared/domain/exceptions/base_exception"
import { PaginatedResult }   from "../../shared/domain/paginated_result"
import { UUID }              from "../../shared/domain/value_objects/uuid"

export abstract class StoreDAO {

  abstract search( query: Record<string, any>, limit ?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Store>>>
  abstract add( store: Store ): Promise<Either<BaseException, boolean>>
  abstract update( store: Store ): Promise<Either<BaseException, boolean>>
  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>
}
