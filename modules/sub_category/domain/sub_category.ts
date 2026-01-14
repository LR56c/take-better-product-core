import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date"
import { wrapType }      from "../../shared/utils/wrap_type"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { Errors }        from "../../shared/domain/exceptions/errors"
import { UUID }          from "../../shared/domain/value_objects/uuid"

export class SubCategory {
  private constructor(
    readonly id: UUID,
    readonly clinicId: UUID,
    readonly categoryId: UUID,
    readonly name: ValidString,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    clinicId: string,
    categoryId: string,
    name: string
  ): SubCategory | Errors {
    return SubCategory.fromPrimitives(
      id,
      clinicId,
      categoryId,
      name,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    clinicId: string,
    categoryId: string,
    name: string,
    createdAt: Date | string
  ): SubCategory {
    return new SubCategory(
      UUID.from( id ),
      UUID.from( clinicId ),
      UUID.from( categoryId ),
      ValidString.from( name ),
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    clinicId: string,
    categoryId: string,
    name: string,
    createdAt: Date | string
  ): SubCategory | Errors {
    const errors = []

    const idValue = wrapType(
      () => UUID.from( id ) )

    if ( idValue instanceof BaseException ) {
      errors.push( idValue )
    }

    const clinicIdValue = wrapType(
      () => UUID.from( clinicId ) )

    if ( clinicIdValue instanceof BaseException ) {
      errors.push( clinicIdValue )
    }

    const categoryIdValue = wrapType(
      () => UUID.from( categoryId ) )

    if ( categoryIdValue instanceof BaseException ) {
      errors.push( categoryIdValue )
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

    return new SubCategory(
      idValue as UUID,
      clinicIdValue as UUID,
      categoryIdValue as UUID,
      nameValue as ValidString,
      createdAtValue as ValidDate
    )
  }
}