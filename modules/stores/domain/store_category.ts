import { UUID }          from "../../shared/domain/value_objects/uuid"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date"
import { wrapType }      from "../../shared/utils/wrap_type"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { Errors }        from "../../shared/domain/exceptions/errors"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { ValidBool }     from "../../shared/domain/value_objects/valid_bool"

export class StoreCategory {
  private constructor(
    readonly id: UUID,
    readonly storeId: ValidString,
    readonly categoryId: ValidString,
    readonly url: ValidString | null,
    readonly isActive: ValidBool,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    storeId: string,
    categoryId: string,
    url: string | null,
    isActive: boolean
  ): StoreCategory | Errors {
    return StoreCategory.fromPrimitives(
      id,
      storeId,
      categoryId,
      url,
      isActive,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    storeId: string,
    categoryId: string,
    url: string | null,
    isActive: boolean,
    createdAt: Date | string
  ): StoreCategory {
    return new StoreCategory(
      UUID.from( id ),
      ValidString.from( storeId ),
      ValidString.from( categoryId ),
      url ? ValidString.from( url ) : null,
      ValidBool.from( isActive ),
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    storeId: string,
    categoryId: string,
    url: string | null,
    isActive: boolean,
    createdAt: Date | string
  ): StoreCategory | Errors {
    const errors = []

    const idValue = wrapType(
      () => UUID.from( id ) )

    if ( idValue instanceof BaseException ) {
      errors.push( idValue )
    }

    const storeIdValue = wrapType(
      () => ValidString.from( storeId ) )

    if ( storeIdValue instanceof BaseException ) {
      errors.push( storeIdValue )
    }

    const categoryIdValue = wrapType(
      () => ValidString.from( categoryId ) )

    if ( categoryIdValue instanceof BaseException ) {
      errors.push( categoryIdValue )
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

    const isActiveValue = wrapType(
      () => ValidBool.from( isActive ) )

    if ( isActiveValue instanceof BaseException ) {
      errors.push( isActiveValue )
    }

    const createdAtValue = wrapType(
      () => ValidDate.from( createdAt ) )

    if ( createdAtValue instanceof BaseException ) {
      errors.push( createdAtValue )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new StoreCategory(
      idValue as UUID,
      storeIdValue as ValidString,
      categoryIdValue as ValidString,
      urlValue,
      isActiveValue as ValidBool,
      createdAtValue as ValidDate
    )
  }
}
