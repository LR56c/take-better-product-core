import { Store }                         from "../domain/store"
import { type StoreResponse, StoreType } from "./store_response"
import {
  Errors
}                                        from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault }     from "../../shared/utils/wrap_type"
import {
  BaseException
}                                        from "../../shared/domain/exceptions/base_exception"
import {
  ValidString
}                                        from "../../shared/domain/value_objects/valid_string"
import {
  UUID
}                                        from "../../shared/domain/value_objects/uuid"
import {
  CountryMapper
}                                        from "../../countries/application/country_mapper"
import {
  CountryDTO
}                                        from "../../countries/application/country_dto"

export class StoreMapper {
  static toDTO( store: Store ): StoreResponse {
    return {
      id       : store.id.toString(),
      country  : CountryMapper.toDTO( store.country ),
      name     : store.name.value,
      url      : store.url?.value ?? null,
      thumbnail: store.thumbnail?.value ?? null,
      type     : store.type.value as StoreType
    }
  }

  static toJSON( store: StoreResponse ): Record<string, any> {
    return {
      id       : store.id,
      country  : CountryMapper.toJSON( store.country ),
      name     : store.name,
      url      : store.url,
      thumbnail: store.thumbnail,
      type     : store.type
    }
  }

  static fromJSON( store: Record<string, any> ): StoreResponse | Errors {
    const errors = []
    const id     = wrapType( () => UUID.from( store.id ) )
    if ( id instanceof BaseException ) errors.push( id )

    const countryId = wrapType( () => UUID.from( store.country_id ) )
    if ( countryId instanceof BaseException ) errors.push( countryId )

    const name = wrapType( () => ValidString.from( store.name ) )
    if ( name instanceof BaseException ) errors.push( name )

    const thumbnail = wrapTypeDefault( null,
      ( value ) => ValidString.from( value ), store.thumbnail )

    if ( thumbnail instanceof BaseException ) {
      errors.push( thumbnail )
    }

    const url = wrapTypeDefault( null, ( value ) => ValidString.from( value ),
      store.url )

    if ( url instanceof BaseException ) {
      errors.push( url )
    }

    const type = wrapType( () => ValidString.from( store.type ) )
    if ( type instanceof BaseException ) errors.push( type )

    const country = CountryMapper.fromJSON( store.country )

    if ( country instanceof Errors ) {
      errors.push( ...country.values )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id       : (
        id as UUID
      ).toString(),
      country  :  country as CountryDTO,
      name     : (
        name as ValidString
      ).value,
      url      : url instanceof ValidString ? url.value : null,
      thumbnail: thumbnail instanceof ValidString ? thumbnail.value : null,
      type     : (
        type as ValidString
      ).value as StoreType
    }
  }

  static toDomain( json: Record<string, any> ): Store | Errors {
    return Store.fromPrimitives(
      json.id,
      json.country_id,
      json.name,
      json.url,
      json.thumbnail,
      json.type,
      json.created_at
    )
  }
}
