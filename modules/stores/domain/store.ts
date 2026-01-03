import { UUID }          from "../../shared/domain/value_objects/uuid.js"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date.js"
import { wrapType }      from "../../shared/utils/wrap_type.js"
import { BaseException } from "../../shared/domain/exceptions/base_exception.js"
import { Errors }        from "../../shared/domain/exceptions/errors.js"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { User }          from "../../user/domain/user"
import { Country }       from "../../countries/domain/country"

export class Store {
  private constructor(
    readonly id: UUID,
    readonly country: Country,
    readonly name: ValidString,
    readonly url: ValidString,
    readonly thumbnail: ValidString,
    readonly type: ValidString,
    readonly createdAt: ValidDate
  )
  {
  }


  static create(
    id: string,
    type: string,
    // countryId: string,
    country: User | Collection,
    kind: string,
    title: string,
    value: string
  ): Store | Errors {
    return Store.fromPrimitives(
      id,
      type,
      country,
      kind,
      title,
      value,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    type: string,
    country: User | Collection,
    kind: string,
    title: string,
    value: string,
    createdAt: Date | string
  ): Store {
    return new Store(
      UUID.from( id ),
      StoreType.from( type ),
      country,
      ValidString.from( kind ),
      ValidString.from( title ),
      ValidString.from( value ),
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    type: string,
    country: User | Collection,
    kind: string,
    title: string,
    value: string,
    createdAt: Date | string
  ): Store | Errors {
    const errors = []

    const idValue = wrapType(
      () => UUID.from( id ) )

    if ( idValue instanceof BaseException ) {
      errors.push( idValue )
    }

    const typeValue = wrapType(
      () => StoreType.from( type ) )

    if ( typeValue instanceof BaseException ) {
      errors.push( typeValue )
    }

    const vkind = wrapType(
      () => ValidString.from( kind ) )

    if ( vkind instanceof BaseException ) {
      errors.push( vkind )
    }

    const vtitle = wrapType(
      () => ValidString.from( title ) )

    if ( vtitle instanceof BaseException ) {
      errors.push( vtitle )
    }

    const vvalue = wrapType(
      () => ValidString.from( value ) )

    if ( vvalue instanceof BaseException ) {
      errors.push( vvalue )
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
      typeValue as StoreType,
      country,
      vkind as ValidString,
      vtitle as ValidString,
      vvalue as ValidString,
      createdAtValue as ValidDate
    )
  }
}