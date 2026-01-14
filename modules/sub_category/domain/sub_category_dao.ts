import {
  ValidInteger
}                          from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                          from "../../shared/domain/value_objects/valid_string"
import { type Either }          from "fp-ts/lib/Either"
import {
  BaseException
}                          from "../../shared/domain/exceptions/base_exception"
import { type PaginatedResult } from "../../shared/domain/paginated_result"
import { UUID }            from "../../shared/domain/value_objects/uuid"
import { SubCategory } from "./sub_category"

export abstract class SubCategoryDAO {
  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], PaginatedResult<SubCategory>>>

  abstract add(subcategory : SubCategory): Promise<Either<BaseException, boolean>>

  abstract update( subcategory : SubCategory ): Promise<Either<BaseException, boolean>>

  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>
}