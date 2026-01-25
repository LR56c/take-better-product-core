import { UUID }          from "../../shared/domain/value_objects/uuid"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date"
import { wrapType }      from "../../shared/utils/wrap_type"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { Errors }        from "../../shared/domain/exceptions/errors"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { Country }       from "../../countries/domain/country"
import { StoreCategory } from "./store_category"

export class Store {
  private constructor(
    readonly id: UUID,
    readonly country: Country,
    readonly name: ValidString,
    readonly url: ValidString | null,
    readonly thumbnail: ValidString | null,
    readonly type: ValidString,
    readonly storesCategories: StoreCategory[],
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    country: Country,
    name: string,
    url: string | null,
    thumbnail: string | null,
    type: string,
    storesCategories: StoreCategory[]
  ): Store | Errors {
    return Store.fromPrimitives(
      id,
      country,
      name,
      url,
      thumbnail,
      type,
      storesCategories,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    country: Country,
    name: string,
    url: string | null,
    thumbnail: string | null,
    type: string,
    storesCategories: StoreCategory[],
    createdAt: Date | string
  ): Store {
    return new Store(
      UUID.from( id ),
      country,
      ValidString.from( name ),
      url ? ValidString.from( url ) : null,
      thumbnail ? ValidString.from( thumbnail ) : null,
      ValidString.from( type ),
      storesCategories,
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    country: Country,
    name: string,
    url: string | null,
    thumbnail: string | null,
    type: string,
    storesCategories: StoreCategory[],
    createdAt: Date | string
  ): Store | Errors {
    const errors = []

    const idValue = wrapType(
      () => UUID.from( id ) )

    if ( idValue instanceof BaseException ) {
      errors.push( idValue )
    }

    const nameValue = wrapType(
      () => ValidString.from( name ) )

    if ( nameValue instanceof BaseException ) {
      errors.push( nameValue )
    }

    let urlValue: ValidString | null = null
    if ( url ) {
      const result = wrapType( () => ValidString.from( url ) )
      if ( result instanceof BaseException ) {
        errors.push( result )
      } else {
        urlValue = result as ValidString
      }
    }

    let thumbnailValue: ValidString | null = null
    if ( thumbnail ) {
      const result = wrapType( () => ValidString.from( thumbnail ) )
      if ( result instanceof BaseException ) {
        errors.push( result )
      } else {
        thumbnailValue = result as ValidString
      }
    }

    const typeValue = wrapType(
      () => ValidString.from( type ) )

    if ( typeValue instanceof BaseException ) {
      errors.push( typeValue )
    }

    const createdAtValue = wrapType(
      () => ValidDate.from( createdAt ) )

    if ( createdAtValue instanceof BaseException ) {
      errors.push( createdAtValue )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Store(
      idValue as UUID,
      country,
      nameValue as ValidString,
      urlValue,
      thumbnailValue,
      typeValue as ValidString,
      storesCategories,
      createdAtValue as ValidDate
    )
  }
}
