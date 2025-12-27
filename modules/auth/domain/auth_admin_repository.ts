import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { type Either }   from "fp-ts/Either"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { User }          from "../../user/domain/user"
import { UUID }          from "../../shared/domain/value_objects/uuid"
import { Password }      from "../../shared/domain/value_objects/password"
import { Email }         from "../../shared/domain/value_objects/email"
import { AuthAdminResponse } from "./auth_admin_response"

export abstract class AuthAdminRepository {
  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>

  abstract register( auth: User, password: Password ): Promise<Either<BaseException[], AuthAdminResponse>>

  abstract update( user: User ): Promise<Either<BaseException[], boolean>>
  abstract getById( id: ValidString ): Promise<Either<BaseException[], User>>
  abstract getByEmail( email: Email ): Promise<Either<BaseException[], User>>
  abstract getByUsername( username: ValidString ): Promise<Either<BaseException[], User>>
}
