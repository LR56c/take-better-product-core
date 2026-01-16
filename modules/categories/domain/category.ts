import { UUID }          from "../../shared/domain/value_objects/uuid"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date"
import { wrapType }      from "../../shared/utils/wrap_type"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { Errors }        from "../../shared/domain/exceptions/errors"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { SubCategory }   from "../../sub_category/domain/sub_category"

export class Category {
  private constructor(
    readonly id: UUID,
    readonly name: ValidString,
    readonly slug: ValidString,
    readonly subCategories: SubCategory[],
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    name: string,
    slug: string,
    subCategories: SubCategory[]
  ): Category | Errors {
    return Category.fromPrimitives(
      id,
      name,
      slug,
      subCategories,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    name: string,
    slug: string,
    subCategories: SubCategory[],
    createdAt: Date | string
  ): Category {
    return new Category(
      UUID.from( id ),
      ValidString.from( name ),
      ValidString.from( slug ),
      subCategories,
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    name: string,
    slug: string,
    subCategories: SubCategory[],
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
      subCategories,
      createdAtValue as ValidDate
    )
  }
}
