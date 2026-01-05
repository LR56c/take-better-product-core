import { StoreDAO }            from "../domain/store_dao"
import { type Either }         from "fp-ts/Either"
import {
  BaseException
}                              from "../../shared/domain/exceptions/base_exception"
import { Store }               from "../domain/store"
import { Errors }              from "../../shared/domain/exceptions/errors"
import { isLeft, left, right } from "fp-ts/lib/Either"
import { StoreResponse }       from "./store_response"
import { ensureStoreExist }    from "../utils/ensure_store_exist"

export class UpdateStore {
  constructor( private dao: StoreDAO ) {}

  async execute( dto: StoreResponse ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureStoreExist( this.dao, dto.id )


    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const newStore = Store.fromPrimitives(
      exist.right.id.toString(),
      exist.right.country,
      dto.name,
      dto.url,
      dto.thumbnail,
      dto.type,
      exist.right.createdAt.toString()
    )

    if ( newStore instanceof Errors ) {
      return left( newStore.values )
    }

    const result = await this.dao.update( newStore )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}
