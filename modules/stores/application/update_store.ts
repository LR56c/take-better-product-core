import { StoreDAO }      from "../domain/store_dao"
import { type Either }     from "fp-ts/Either"
import { BaseException }   from "../../shared/domain/exceptions/base_exception"
import { Store }           from "../domain/store"
import { Errors }          from "../../shared/domain/exceptions/errors"

export class UpdateStore {
  constructor( private storeDAO: StoreDAO ) {}

  async run(
    id: string,
    countryId: string,
    name: string,
    url: string | null,
    thumbnail: string | null,
    type: string,
    createdAt: string
  ): Promise<Either<BaseException, boolean>> {
    const store = Store.fromPrimitives(
      id,
      countryId,
      name,
      url,
      thumbnail,
      type,
      createdAt
    )

    if ( store instanceof Errors ) {
      return { _tag: "Left", left: store }
    }

    return this.storeDAO.update( store )
  }
}
