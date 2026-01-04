import { Store }           from "../domain/store"
import { StoreDAO }          from "../domain/store_dao"
import { type Either }       from "fp-ts/Either"
import { BaseException }     from "../../shared/domain/exceptions/base_exception"
import { Errors }            from "../../shared/domain/exceptions/errors"

export class AddStore {
  constructor( private storeDAO: StoreDAO ) {}

  async run(
    id: string,
    countryId: string,
    name: string,
    url: string | null,
    thumbnail: string | null,
    type: string
  ): Promise<Either<BaseException, boolean>> {
    const store = Store.create( id, countryId, name, url, thumbnail, type )

    if ( store instanceof Errors ) {
      return { _tag: "Left", left: store }
    }

    return this.storeDAO.add( store )
  }
}
