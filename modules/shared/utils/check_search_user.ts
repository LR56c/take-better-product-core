import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { wrapType }                    from "../../shared/utils/wrap_type"
import {
  DataNotFoundException
}                                      from "../../shared/domain/exceptions/data_not_found_exception"
import { User }                        from "../../user/domain/user"
import {
  SearchAdminUser
}                                      from "../../user/application/search_admin_user"
import {
  ValidString
}                                      from "../domain/value_objects/valid_string"

export const checkSearchUser = async ( search: SearchAdminUser,
  id: string ): Promise<Either<BaseException[], User>> => {
  const _id = wrapType( () => ValidString.from( id ) )

  if ( _id instanceof BaseException ) {
    return left( [_id] )
  }

  const user = await search.execute( { id: _id.toString(), is_active: true },
    1 )

  if ( isLeft( user ) ) {
    return left( user.left )
  }

  if ( user.right.items.length === 0 || user.right.items[0].id.toString() !==
    id )
  {
    return left( [new DataNotFoundException()] )
  }


  return right( user.right.items[0] )
}