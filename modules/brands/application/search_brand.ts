import { BrandDAO }            from "../domain/brand_dao"
import { type Either }         from "fp-ts/Either"
import { BaseException }       from "../../shared/domain/exceptions/base_exception"
import { PaginatedResult }     from "../../shared/domain/paginated_result"
import { genericEnsureSearch } from "../../shared/utils/generic_ensure_search"
import { isLeft, left } from "fp-ts/lib/Either"
import { Brand }               from "../domain/brand"

export class SearchBrand {
  constructor( private readonly dao: BrandDAO ) {
  }

  async execute( query: Record<string, any>, limit ?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], PaginatedResult<Brand>>> {
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