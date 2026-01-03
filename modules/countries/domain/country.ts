import { ValidString } from "../../shared/domain/value_objects/valid_string"
import {
  ValidDate
}                      from "../../shared/domain/value_objects/valid_date"
import { Errors }      from "../../shared/domain/exceptions/errors"
import {
  BaseException
}                      from "../../shared/domain/exceptions/base_exception"
import {
  InvalidDateException
}                      from "../../shared/domain/exceptions/invalid_date_exception"
import { wrapType }    from "../../shared/utils/wrap_type"
import { UUID }        from "../../shared/domain/value_objects/uuid"

export class Country {
  private constructor(
    readonly id: UUID,
    readonly name: ValidString,
    readonly code: ValidString,
    readonly currency: ValidString,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    name: string,
    code: string,
    currency: string,
  ): Country | Errors {
    return Country.fromPrimitives(
      id,
      name,
      code,
      currency,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    name: string,
    code: string,
    currency: string,
    createdAt: Date
  ): Country {
    return new Country(
      UUID.from( id ),
      ValidString.from( name ),
      ValidString.from( code ),
      ValidString.from( currency ),
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    name: string,
    code: string,
    currency: string,
    createdAt: Date | string
  ): Country | Errors {
    const errors = []

    const vid = wrapType(
      () => UUID.from( id ) )

    if ( vid instanceof BaseException ) {
      errors.push( vid )
    }

    const vname = wrapType(
      () => ValidString.from( name ) )

    if ( vname instanceof BaseException ) {
      errors.push( vname )
    }

    const vcode = wrapType(
      () => ValidString.from( code ) )

    if ( vcode instanceof BaseException ) {
      errors.push( vcode )
    }

    const vcurrency = wrapType(
      () => ValidString.from( code ) )

    if ( vcurrency instanceof BaseException ) {
      errors.push( vcurrency )
    }

    const vcreatedAt = wrapType<ValidDate, InvalidDateException>(
      () => ValidDate.from( createdAt ) )

    if ( vcreatedAt instanceof BaseException ) {
      errors.push( vcreatedAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Country(
      vid as UUID,
      vname as ValidString,
      vcode as ValidString,
      vcurrency as ValidString,
      vcreatedAt as ValidDate
    )
  }
}
