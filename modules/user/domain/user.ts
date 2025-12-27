import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date"
import { Errors }        from "../../shared/domain/exceptions/errors"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { wrapType }      from "../../shared/utils/wrap_type"
import { UUID }          from "../../shared/domain/value_objects/uuid"
import { Email }         from "../../shared/domain/value_objects/email"

export class User {
  private constructor(
    readonly id: UUID,
    readonly email: Email,
    readonly role: ValidString,
    readonly name: ValidString,
    readonly createdAt: ValidDate,
  )
  {
  }

  static create(
    id: string,
    email: string,
    role: string,
    name: string,
  ): User | Errors {
    return User.fromPrimitives(
      id,
      email,
      role,
      name,
      ValidDate.nowUTC(),
    )
  }

  static fromPrimitiveThrow(
    id: string,
    email: string,
    role: string,
    name: string,
    createdAt: Date | string,
  ): User {
    return new User(
      UUID.from( id ),
      Email.from( email ),
      ValidString.from( role ),
      ValidString.from( name ),
      ValidDate.from( createdAt ),
    )
  }

  static fromPrimitives(
    id: string,
    email: string,
    role: string,
    name: string,
    createdAt: Date | string,
  ): User | Errors {
    const errors = []

    const vid = wrapType( () => UUID.from( id ) )
    if ( vid instanceof BaseException ) {
      errors.push( vid )
    }

    const vrole = wrapType( () => ValidString.from( role ) )
    if ( vrole instanceof BaseException ) {
      errors.push( vrole )
    }

    const vemail = wrapType( () => Email.from( email ) )
    if ( vemail instanceof BaseException ) {
      errors.push( vemail )
    }

    const vname = wrapType( () => ValidString.from( name ) )
    if ( vname instanceof BaseException ) {
      errors.push( vname )
    }

    const vcreatedAt = wrapType( () => ValidDate.from( createdAt ) )
    if ( vcreatedAt instanceof BaseException ) {
      errors.push( vcreatedAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new User(
      vid as UUID,
      vemail as Email,
      vrole as ValidString,
      vname as ValidString,
      vcreatedAt as ValidDate,
    )
  }
}

