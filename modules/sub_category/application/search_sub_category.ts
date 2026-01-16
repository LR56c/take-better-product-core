import { type Either, isLeft, left } from "fp-ts/lib/Either"
import {
  BaseException
}                               from "../../shared/domain/exceptions/base_exception"
import { genericEnsureSearch }  from "../../shared/utils/generic_ensure_search"
import { type PaginatedResult }      from "../../shared/domain/paginated_result"
import { SubCategoryDAO }            from "../domain/sub_category_dao"
import { SubCategory }               from "../domain/sub_category"

export class SearchSubCategory {
  constructor( private readonly dao: SubCategoryDAO ) {
  }

  async execute( query: Record<string, any>, limit ?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<SubCategory>>> {
    const searchParamsResult = genericEnsureSearch( limit, skip, sortBy,
      sortType )

    if ( isLeft( searchParamsResult ) ) {
      return left( searchParamsResult.left )
    }

    const {
            validLimit,
            validSkip,
            validSortBy,
            validSortType
          } = searchParamsResult.right

    return this.dao.search( query, validLimit, validSkip, validSortBy,
      validSortType )
  }
}
