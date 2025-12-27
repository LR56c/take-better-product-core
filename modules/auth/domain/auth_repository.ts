import { LoginRequest }  from "./login_request"
import { Either }        from "fp-ts/Either"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { PasswordDTO }   from "../../shared/domain/value_objects/password"
import { UserResponse }  from "../../user/application/user_response"

export abstract class AuthRepository {
  abstract login( dto: LoginRequest ): Promise<Either<BaseException, UserResponse>>
  abstract register( dto: UserResponse, password: PasswordDTO ): Promise<Either<BaseException, UserResponse>>
}
