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
import { ProductDAO }                       from "../domain/product_dao"
import { Product }                          from "../domain/product"

export const ensureProductExist = async ( dao: ProductDAO,
  productId: string ): Promise<Either<BaseException[], Product>> => {

  const product = await dao.search({
    id: productId
  }, ValidInteger.from(1))

  if ( isLeft(product) ) {
    return left(product.left)
  }

  if ( product.right.items.length > 0 && product.right.items[0]!.id.value !== productId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(product.right.items[0])
}