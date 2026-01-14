import { type Either, isLeft, left, right } from "fp-ts/lib/Either.js"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { wrapType }                    from "../../shared/utils/wrap_type"
import {
  UUID
}                                      from "../../shared/domain/value_objects/uuid"
import {
  ValidInteger
}                                      from "../../shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                      from "../../shared/domain/exceptions/data_not_found_exception"
import { SubCategoryDAO }              from "../domain/sub_category_dao"
import { SubCategory }                 from "../domain/sub_category"

export const ensureSubCategoryExist = async ( dao: SubCategoryDAO,
  id: string ): Promise<Either<BaseException[], SubCategory>> => {
  const _id = wrapType( () => UUID.from( id ) )

  if ( _id instanceof BaseException ) {
    return left( [_id] )
  }

  const b = await dao.search(
    { id: _id.toString() }, ValidInteger.from( 1 ) )

  if ( isLeft( b ) ) {
    return left( b.left )
  }

  if ( b.right.items.length === 0 || b.right.items[0].id.toString() !== id ) {
    return left( [new DataNotFoundException()] )
  }


  return right( b.right.items[0] )
}