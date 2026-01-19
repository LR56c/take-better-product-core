import { Either, isLeft, left, right } from "fp-ts/Either"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { wrapType } from "../../shared/utils/wrap_type"
import { DataNotFoundException } from "../../shared/domain/exceptions/data_not_found_exception"
import { Store } from "../../stores/domain/store"
import { ValidString } from "../domain/value_objects/valid_string"
import { SearchStore } from "../../stores/application/search_store"

export const checkSearchStore = async ( search: SearchStore,
  id: string ): Promise<Either<BaseException[], Store>> => {
  const _id = wrapType( () => ValidString.from( id ) )

  if ( _id instanceof BaseException ) {
    return left( [_id] )
  }

  const result = await search.execute( { id: _id.toString() }, 1 )

  if ( isLeft( result ) ) {
    return left( result.left )
  }

  if ( result.right.items.length === 0 || result.right.items[0].id.toString() !== id ) {
    return left( [new DataNotFoundException()] )
  }

  return right( result.right.items[0] )
}

