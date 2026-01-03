import { type Either, isLeft, left } from "fp-ts/Either"
import { CountryDAO }                from "../domain/country_dao"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import { PaginatedResult }           from "../../shared/domain/paginated_result"
import { Country }                   from "../domain/country"
import {
  genericEnsureSearch
}                                    from "../../shared/utils/generic_ensure_search"

export class SearchCountry {
  constructor( private readonly dao: CountryDAO ) {
  }

  async execute( query: Record<string, any>, limit ?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<Country>>> {
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
