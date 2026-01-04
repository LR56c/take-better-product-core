import { StoreDAO }      from "../domain/store_dao"
import { type Either }     from "fp-ts/Either"
import { BaseException }   from "../../shared/domain/exceptions/base_exception"
import { UUID }            from "../../shared/domain/value_objects/uuid"
import { wrapType }        from "../../shared/utils/wrap_type"

export class RemoveStore {
  constructor( private storeDAO: StoreDAO ) {}

  async run( id: string ): Promise<Either<BaseException, boolean>> {
    const uuid = wrapType( () => UUID.from( id ) )

    if ( uuid instanceof BaseException ) {
      return { _tag: "Left", left: uuid }
    }

    return this.storeDAO.remove( uuid as UUID )
  }
}
