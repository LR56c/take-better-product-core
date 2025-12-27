import { Either, left }        from "fp-ts/Either"
import { AuthAdminRepository } from "../domain/auth_admin_repository"
import { BaseException }       from "../../shared/domain/exceptions/base_exception"
import { wrapType }       from "../../shared/utils/wrap_type"
import { UUID }           from "../../shared/domain/value_objects/uuid"

export class RemoveAuth {
  constructor( private readonly repo: AuthAdminRepository ) {
  }

  async execute( id: string ): Promise<Either<BaseException, boolean>> {
    const vid = wrapType( () => UUID.from( id ) )

    if ( vid instanceof BaseException ) {
      return left( vid )
    }
    return this.repo.remove( vid )
  }

}