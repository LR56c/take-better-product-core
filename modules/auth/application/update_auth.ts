import { Either, isLeft, left, right } from "fp-ts/Either"
import { AuthAdminRepository }         from "../domain/auth_admin_repository"
import {
  UserUpdateDTO
}                                      from "../../user/application/user_update_dto"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { wrapType }                    from "../../shared/utils/wrap_type"
import { User }                        from "../../user/domain/user"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"
import {
  ValidString
}                                      from "../../shared/domain/value_objects/valid_string"

export class UpdateAuth {
  constructor( private readonly repo: AuthAdminRepository ) {
  }

  async execute( auth: UserUpdateDTO,
    role: string ): Promise<Either<BaseException[], User>> {
    const vid = wrapType( () => ValidString.from( auth.id ) )

    if ( vid instanceof BaseException ) {
      return left( [vid] )
    }

    const exist = await this.repo.getById( vid )
    if ( isLeft( exist ) ) {
      return left( exist.left )
    }


    const updatedUser = User.fromPrimitives(
      exist.right.id.toString(),
      exist.right.email.value,
      role ? role : exist.right.role.value,
      exist.right.username.value,
      exist.right.createdAt.toString()
    )

    if ( updatedUser instanceof Errors ) {
      return left( updatedUser.values )
    }

    const result = await this.repo.update( updatedUser )

    if ( isLeft( result ) ) {
      return left( result.left )
    }

    return right( updatedUser )
  }
}