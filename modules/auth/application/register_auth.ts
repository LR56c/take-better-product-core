import { Either, isLeft, left, right } from "fp-ts/Either"
import { AuthAdminRepository }         from "../domain/auth_admin_repository"
import {
  Password, PasswordDTO
}                                      from "../../shared/domain/value_objects/password"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { User }                        from "../../user/domain/user"
import { wrapType }                    from "../../shared/utils/wrap_type"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"
import {
  UUID
}                                      from "../../shared/domain/value_objects/uuid"
import {
  DataNotFoundException
}                                      from "../../shared/domain/exceptions/data_not_found_exception"
import { AuthResponse }                from "../domain/auth_response"
import {
  ValidString
}                                      from "../../shared/domain/value_objects/valid_string"
import { containError }                from "../../shared/utils/contain_error"
import {
  UserResponse
}                                      from "../../user/application/user_response"

export class RegisterAuth {
  constructor(
    private readonly repo: AuthAdminRepository
  )
  {
  }


  async execute( dto: UserResponse,
    password: PasswordDTO, role: string ): Promise<Either<BaseException[], AuthResponse>> {

    if ( dto.id ) {
      const id = wrapType( () => ValidString.from( dto.id! ) )
      if ( id instanceof BaseException ) {
        return left( [id] )
      }
      const existResult = await this.repo.getById( id )

      if ( isLeft( existResult ) ) {
        if ( !containError( existResult.left, new DataNotFoundException() ) ) {
          return left( existResult.left )
        }
      }
    }

    const vpassword = wrapType( () => Password.from( password ) )

    if ( vpassword instanceof BaseException ) {
      return left( [vpassword] )
    }

    const vid = dto.id ?? UUID.create().toString()

    const user = User.create(
      vid,
      dto.email,
      role,
      dto.username,
    )

    if ( user instanceof Errors ) {
      return left( user.values )
    }

    const resultAuth = await this.repo.register( user, vpassword )

    if ( isLeft( resultAuth ) ) {
      return left( resultAuth.left )
    }

    return right( resultAuth.right )
  }
}