import { CategoryDAO }         from "../domain/category_dao"
import { type Either }         from "fp-ts/Either"
import {
  BaseException
}                              from "../../shared/domain/exceptions/base_exception"
import { PaginatedResult }     from "../../shared/domain/paginated_result"
import { genericEnsureSearch } from "../../shared/utils/generic_ensure_search"
import { isLeft, left }        from "fp-ts/lib/Either"
import { Category }            from "../domain/category"

export class SearchCategory {
  constructor( private dao: CategoryDAO ) {}

  async execute( query: Record<string, any>, limit ?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<Category>>> {
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
