import { UUID }                      from "../../shared/domain/value_objects/uuid"
import {
  ValidString
}                                    from "../../shared/domain/value_objects/valid_string"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"
import {
  Errors
}                                    from "../../shared/domain/exceptions/errors"
import { wrapType } from "../../shared/utils/wrap_type"
import {
  BaseException
}                                    from "../../shared/domain/exceptions/base_exception"

export class ProductEmbedding {
  private constructor(
    readonly id: UUID,
    readonly productId: UUID,
    readonly content: ValidString,
    readonly vector: number[],
    readonly createdAt: ValidDate,
    readonly updatedAt?: ValidDate,
  )
  {
  }

  static create(
    id: string,
    productId: string,
    content: string,
    vector: number[],
  ): ProductEmbedding | Errors {
    return ProductEmbedding.fromPrimitives(
      id, productId, content, vector,
      ValidDate.nowUTC(), undefined
    )
  }

  static fromPrimitives(
    id: string,
    productId: string,
    content: string,
    vector: number[],
    createdAt: Date | string,
    updatedAt?: Date | string,
  ): ProductEmbedding | Errors {
    const errors = []

    const idVO = wrapType(
      () => UUID.from( id ) )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const productIdValue = wrapType(
      () => UUID.from( id ) )

    if ( productIdValue instanceof BaseException ) {
      errors.push( productIdValue )
    }

    const contentVO = wrapType(
      () => ValidString.from( content ) )

    if ( contentVO instanceof BaseException ) {
      errors.push( contentVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )

    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    const updated = updatedAt != undefined ? wrapType(
      () => ValidDate.from( updatedAt ) ) : undefined

    if ( updated instanceof BaseException ) {
      errors.push( updated )
    }

    if ( errors.length ) {
      return new Errors( errors )
    }


    return new ProductEmbedding(
      idVO as UUID,
      productIdValue as UUID,
      contentVO as ValidString,
      vector,
      createdAtVO as ValidDate,
      updated as ValidDate | undefined,
    )
  }
}