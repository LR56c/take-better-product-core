import { Either, left }        from "fp-ts/Either"
import { AuthAdminRepository } from "../domain/auth_admin_repository"
import { BaseException }       from "../../shared/domain/exceptions/base_exception"
import { User }           from "../../user/domain/user"
import { wrapType }       from "../../shared/utils/wrap_type"
import { Email }          from "../../shared/domain/value_objects/email"

export class GetAuthByEmail {
  constructor( private readonly repo: AuthAdminRepository ) {
  }

  async execute( email: string ): Promise<Either<BaseException[], User>> {
    const userEmail = wrapType( () => Email.from( email ) )

    if ( userEmail instanceof BaseException ) {
      return left( [userEmail] )
    }

    return this.repo.getByEmail( userEmail )
  }

}