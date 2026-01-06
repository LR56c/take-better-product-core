import { UUID }          from "../../shared/domain/value_objects/uuid.js"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date.js"
import { wrapType }      from "../../shared/utils/wrap_type.js"
import { BaseException } from "../../shared/domain/exceptions/base_exception.js"
import { Errors }        from "../../shared/domain/exceptions/errors.js"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"

export class Category {
  private constructor(
    readonly id: UUID,
    readonly name: ValidString,
    readonly slug: ValidString,
    readonly parentId: UUID | null,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    name: string,
    slug: string,
    parentId: string | null
  ): Category | Errors {
    return Category.fromPrimitives(
      id,
      name,
      slug,
      parentId,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    name: string,
    slug: string,
    parentId: string | null,
    createdAt: Date | string
  ): Category {
    return new Category(
      UUID.from( id ),
      ValidString.from( name ),
      ValidString.from( slug ),
      parentId ? UUID.from( parentId ) : null,
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    name: string,
    slug: string,
    parentId: string | null,
    createdAt: Date | string
  ): Category | Errors {
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

    const slugValue = wrapType(
      () => ValidString.from( slug ) )

    if ( slugValue instanceof BaseException ) {
      errors.push( slugValue )
    }

    let parentIdValue: UUID | null = null
    if ( parentId ) {
      const result = wrapType( () => UUID.from( parentId ) )
      if ( result instanceof BaseException ) {
        errors.push( result )
      } else {
        parentIdValue = result as UUID
      }
    }

    const createdAtValue = wrapType(
      () => ValidDate.from( createdAt ) )

    if ( createdAtValue instanceof BaseException ) {
      errors.push( createdAtValue )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Category(
      idValue as UUID,
      nameValue as ValidString,
      slugValue as ValidString,
      parentIdValue,
      createdAtValue as ValidDate
    )
  }
}
