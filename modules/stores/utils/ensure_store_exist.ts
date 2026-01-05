import { type Either, isLeft, left, right } from "fp-ts/Either"
import { StoreDAO }                         from "../domain/store_dao"
import {
  BaseException
}                                           from "../../shared/domain/exceptions/base_exception"
import { Store }                            from "../domain/store"
import {
  ValidInteger
}                                           from "../../shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                           from "../../shared/domain/exceptions/data_not_found_exception"

export const ensureStoreExist = async ( dao: StoreDAO,
  storeId: string ): Promise<Either<BaseException[], Store>> => {

  const store = await dao.search({
    id: storeId
  }, ValidInteger.from(1))

  if ( isLeft(store) ) {
    return left(store.left)
  }

  if ( store.right.items.length > 0 && store.right.items[0]!.id.value !== storeId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(store.right.items[0])
}