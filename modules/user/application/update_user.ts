import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"
import { UserDAO }                     from "../domain/user_dao"
import { UserUpdateDTO }               from "./user_update_dto"
import {
  ensureUserExist
}                                      from "../utils/ensure_user_exist"
import { User }                        from "../domain/user"

export class UpdateUser {
  constructor(
    private readonly dao: UserDAO
  )
  {
  }

  async execute( dto: UserUpdateDTO,
    role?: string ): Promise<Either<BaseException[], User>> {

    const existResult = await ensureUserExist( this.dao, dto.id )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    const userToUpdate = User.fromPrimitives(
      existResult.right.id.toString(),
      role ? role : existResult.right.role.value,
      existResult.right.name.value,
      existResult.right.createdAt.toString(),
    )

    if ( userToUpdate instanceof Errors ) {
      return left( userToUpdate.values )
    }

    const result = await this.dao.update( userToUpdate )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( userToUpdate )
  }

}