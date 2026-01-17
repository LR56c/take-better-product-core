import { type Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                           from "../../shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                                           from "../../shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                           from "../../shared/domain/exceptions/data_not_found_exception"
import { ProductEmbedding }                 from "../domain/product_embedding"
import {
  ProductEmbeddingRepository
}                                           from "../domain/product_embedding_repository"

export const ensureProductEmbeddingsEmbeddingsExist = async ( dao: ProductEmbeddingRepository,
  embedId: string ): Promise<Either<BaseException[], ProductEmbedding>> => {

  const product = await dao.search({
    id: embedId
  }, ValidInteger.from(1))

  if ( isLeft(product) ) {
    return left(product.left)
  }

  if ( product.right.items.length > 0 && product.right.items[0]!.id.value !== embedId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(product.right.items[0])
}