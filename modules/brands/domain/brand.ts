import { UUID }          from "../../shared/domain/value_objects/uuid.js"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date.js"
import { wrapType }      from "../../shared/utils/wrap_type.js"
import { BaseException } from "../../shared/domain/exceptions/base_exception.js"
import { Errors }        from "../../shared/domain/exceptions/errors.js"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"

export class Brand {
  private constructor(
    readonly id: UUID,
    readonly name: ValidString,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    name: string
  ): Brand | Errors {
    return Brand.fromPrimitives(
      id,
      name,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    name: string,
    createdAt: Date | string
  ): Brand {
    return new Brand(
      UUID.from( id ),
      ValidString.from( name ),
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    name: string,
    createdAt: Date | string
  ): Brand | Errors {
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

    const createdAtValue = wrapType(
      () => ValidDate.from( createdAt ) )

    if ( createdAtValue instanceof BaseException ) {
      errors.push( createdAtValue )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Brand(
      idValue as UUID,
      nameValue as ValidString,
      createdAtValue as ValidDate
    )
  }
}
