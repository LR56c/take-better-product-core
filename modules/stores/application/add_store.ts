import { Store }         from "../domain/store"
import { StoreDAO }           from "../domain/store_dao"
import { type Either, right } from "fp-ts/Either"
import { BaseException }      from "../../shared/domain/exceptions/base_exception"
import { Errors }        from "../../shared/domain/exceptions/errors"
import { StoreResponse } from "./store_response"
import {
  ensureCountryExist
}                        from "../../countries/utils/ensure_country_exist"
import { isLeft, left } from "fp-ts/lib/Either"
import { containError }  from "../../shared/utils/contain_error"
import {
  DataNotFoundException
}                        from "../../shared/domain/exceptions/data_not_found_exception"
import { ensureStoreExist } from "../utils/ensure_store_exist"

export class AddStore {
  constructor( private dao: StoreDAO ) {}

  async run(
    dto: StoreResponse
  ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureStoreExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const countryExist = await ensureCountryExist( this.dao, dto.country.id )

    if ( isLeft( countryExist ) ) {
      return left( countryExist.left )
    }

    const store = Store.create(
      dto.id,
      countryExist.right,
      dto.name,
      dto.url,
      dto.thumbnail,
      dto.type
    )

    if ( store instanceof Errors ) {
      return left( store.values )
    }

    const result = await this.dao.add( store )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )

  }
}
