import { type Either, isLeft, left, right } from "fp-ts/Either"
import {
  DataNotFoundException
}                                           from "../../shared/domain/exceptions/data_not_found_exception"
import { CategoryDAO }                      from "../domain/category_dao"
import {
  BaseException
}                                           from "../../shared/domain/exceptions/base_exception"
import { Category }                         from "../domain/category"
import {
  ValidInteger
}                                           from "../../shared/domain/value_objects/valid_integer"

export const ensureCategoryExist = async ( dao: CategoryDAO,
  categoryId: string ): Promise<Either<BaseException[], Category>> => {

  const category = await dao.search({
    id: categoryId
  }, ValidInteger.from(1))

  if ( isLeft(category) ) {
    return left(category.left)
  }

  if ( category.right.items.length > 0 && category.right.items[0]!.id.value !== categoryId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(category.right.items[0])
}