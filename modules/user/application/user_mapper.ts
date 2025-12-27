import { Errors }        from "../../shared/domain/exceptions/errors.js"
import { User }          from "../domain/user"
import { UserResponse }  from "./user_response"
import { wrapType }      from "../../shared/utils/wrap_type"
import { UUID }          from "../../shared/domain/value_objects/uuid"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { Email }         from "../../shared/domain/value_objects/email"

export class UserMapper {

  static toDTO( user: User ): UserResponse {
    return {
      id      : user.id.toString(),
      name: user.name.value,
      email   : user.email.value
    }
  }

  static toJSON( dto: UserResponse ): Record<string, any> {
    return {
      id      : dto.id,
      name: dto.name,
      email: dto.email,
    }
  }


  static fromJSON( json: Record<string, any> ): UserResponse | Errors {
    const errors = []

    const id = wrapType( () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const name = wrapType( () => ValidString.from( json.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const email = wrapType( () => Email.from( json.email ) )

    if ( email instanceof BaseException ) {
      errors.push( email )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id      : (
        id as UUID
      ).toString(),
      email: (
        email as Email
      ).value,
      name: (
        name as ValidString
      ).value
    }
  }

  static toDomain( json: Record<string, any> ): User | Errors {
    return User.fromPrimitives(
      json.id,
      json.email,
      json.role,
      json.name,
      json.created_at
    )
  }

}