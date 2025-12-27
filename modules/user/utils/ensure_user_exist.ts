import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { wrapType }                    from "../../shared/utils/wrap_type"
import {
  ValidInteger
}                                      from "../../shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                      from "../../shared/domain/exceptions/data_not_found_exception"
import { User }                        from "../domain/user"
import { UserDAO }                     from "../domain/user_dao"
import {
  ValidString
}                                      from "../../shared/domain/value_objects/valid_string"

export const ensureUserExist = async ( dao : UserDAO, id: string): Promise<Either<BaseException[], User>> => {
  const _id = wrapType(()=>ValidString.from(id))

  if (_id instanceof BaseException) {
    return left( [_id] )
  }

  const user = await dao.search(
    { id: _id.toString() }, ValidInteger.from(1))

  if (isLeft(user)) {
    return left(user.left)
  }

  if (user.right.items.length === 0 || user.right.items[0].id.toString() !== id) {
    return left( [new DataNotFoundException()] )
  }


  return right( user.right.items[0] )
}

export const ensureUsernameExist = async ( dao : UserDAO, username: string): Promise<Either<BaseException[], User>> => {
  const _username = wrapType(()=>ValidString.from(username))

  if (_username instanceof BaseException) {
    return left( [_username] )
  }

  const address = await dao.search(
    { username: _username.toString() }, ValidInteger.from(1))

  if (isLeft(address)) {
    return left(address.left)
  }

  if(address.right.items[0].username.value !== username) {
    return left( [new DataNotFoundException()] )
  }


  return right( address.right.items[0] )
}