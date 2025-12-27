import { Either, left }        from "fp-ts/Either"
import { AuthAdminRepository } from "../domain/auth_admin_repository"
import { BaseException }       from "../../shared/domain/exceptions/base_exception"
import { User }           from "../../user/domain/user"
import { wrapType }       from "../../shared/utils/wrap_type"
import { ValidString }    from "../../shared/domain/value_objects/valid_string"

export class GetAuthByUsername {
  constructor( private readonly repo: AuthAdminRepository ) {
  }

  async execute( username: string ): Promise<Either<BaseException[], User>> {
    const vusername = wrapType( () => ValidString.from( username ) )

    if ( vusername instanceof BaseException ) {
      return left( [vusername] )
    }

    return this.repo.getByUsername( vusername )
  }

}