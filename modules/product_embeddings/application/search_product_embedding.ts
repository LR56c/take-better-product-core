import { type Either, isLeft, left } from "fp-ts/lib/Either.js"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"
import {
  genericEnsureSearch
}                                    from "../../shared/utils/generic_ensure_search"
import { ProductEmbedding }          from "../domain/product_embedding"
import {
  ProductEmbeddingRepository
} from "../domain/product_embedding_repository"

export class SearchProductEmbedding {
  constructor(
    private readonly dao: ProductEmbeddingRepository,
  )
  {
  }

  async execute( query: Record<string, any>, limit ?: number,
    skip ?: string, sortBy ?: string,
    sortType ?: string ): Promise<Either<BaseException[], ProductEmbedding[]>>
  {
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

    return await this.dao.search( query, validLimit, validSkip,
      validSortBy,
      validSortType )
  }
}
