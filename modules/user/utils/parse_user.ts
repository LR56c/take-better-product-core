import { User } from "../domain/user"
import { Errors } from "../../shared/domain/exceptions/errors"

export function parseUser( u: any ): User | Errors {
  return User.fromPrimitives(
    u.id,
    u.role,
    u.username,
    u.createdAt,
  )
}
