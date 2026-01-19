import { Either, isLeft, left, right } from "fp-ts/lib/Either"
import { BaseException } from "../domain/exceptions/base_exception"
import { wrapType } from "./wrap_type"
import { ValidString } from "../domain/value_objects/valid_string"
import {
  DataNotFoundException
} from "../domain/exceptions/data_not_found_exception"
import { Brand }                       from "../../brands/domain/brand"
import {
  SearchBrand
}                                      from "../../brands/application/search_brand"

export const checkSearchBrand = async ( search: SearchBrand,
  id: string ): Promise<Either<BaseException[], Brand>> => {
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

