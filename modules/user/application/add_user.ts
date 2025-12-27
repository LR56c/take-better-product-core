import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { containError }                from "../../shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "../../shared/domain/exceptions/data_not_found_exception"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"
import { UserDAO }                     from "../domain/user_dao"
import { ensureUserExist }             from "../utils/ensure_user_exist"
import { User }                        from "../domain/user"
import {
  UUID
}                                      from "../../shared/domain/value_objects/uuid"
import { UserResponse }                from "./user_response"

export class AddUser {
  constructor(
    private readonly dao: UserDAO
  )
  {
  }

  async execute( dto: UserResponse, role: string ): Promise<Either<BaseException[], User>> {

    if ( dto.id ) {
      const existResult = await ensureUserExist( this.dao, dto.id )
      if ( isLeft( existResult ) ) {
        if ( !containError( existResult.left, new DataNotFoundException() ) ) {
          return left( existResult.left )
        }
      }
    }

    const vid = dto.id ?? UUID.create().toString()

    const userToAdd = User.create(
      vid,
      dto.email,
      role,
      dto.username,
    )

    if ( userToAdd instanceof Errors ) {
      return left( userToAdd.values )
    }

    const result = await this.dao.add( userToAdd )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( userToAdd )
  }

}