import { UUID }          from "../../shared/domain/value_objects/uuid.js"
import { ValidDate }     from "../../shared/domain/value_objects/valid_date.js"
import { wrapType }      from "../../shared/utils/wrap_type.js"
import { BaseException } from "../../shared/domain/exceptions/base_exception.js"
import { Errors }        from "../../shared/domain/exceptions/errors.js"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { ValidDecimal }  from "../../shared/domain/value_objects/valid_decimal"

export class Product {
  private constructor(
    readonly id: UUID,
    readonly storeId: UUID,
    readonly brandId: UUID | null,
    readonly categoryId: UUID | null,
    readonly externalId: ValidString,
    readonly url: ValidString,
    readonly title: ValidString,
    readonly description: ValidString | null,
    readonly price: ValidDecimal,
    readonly currency: ValidString,
    readonly additionalData: Record<string, any> | null,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    storeId: string,
    brandId: string | null,
    categoryId: string | null,
    externalId: string,
    url: string,
    title: string,
    description: string | null,
    price: number,
    currency: string,
    additionalData: Record<string, any> | null
  ): Product | Errors {
    return Product.fromPrimitives(
      id,
      storeId,
      brandId,
      categoryId,
      externalId,
      url,
      title,
      description,
      price,
      currency,
      additionalData,
      ValidDate.nowUTC()
    )
  }

  static fromPrimitivesThrow(
    id: string,
    storeId: string,
    brandId: string | null,
    categoryId: string | null,
    externalId: string,
    url: string,
    title: string,
    description: string | null,
    price: number,
    currency: string,
    additionalData: Record<string, any> | null,
    createdAt: Date | string
  ): Product {
    return new Product(
      UUID.from( id ),
      UUID.from( storeId ),
      brandId ? UUID.from( brandId ) : null,
      categoryId ? UUID.from( categoryId ) : null,
      ValidString.from( externalId ),
      ValidString.from( url ),
      ValidString.from( title ),
      description ? ValidString.from( description ) : null,
      ValidDecimal.from( price ),
      ValidString.from( currency ),
      additionalData,
      ValidDate.from( createdAt )
    )
  }

  static fromPrimitives(
    id: string,
    storeId: string,
    brandId: string | null,
    categoryId: string | null,
    externalId: string,
    url: string,
    title: string,
    description: string | null,
    price: number,
    currency: string,
    additionalData: Record<string, any> | null,
    createdAt: Date | string
  ): Product | Errors {
    const errors = []

    const idValue = wrapType(
      () => UUID.from( id ) )

    if ( idValue instanceof BaseException ) {
      errors.push( idValue )
    }

    const storeIdValue = wrapType(
      () => UUID.from( storeId ) )

    if ( storeIdValue instanceof BaseException ) {
      errors.push( storeIdValue )
    }

    let brandIdValue: UUID | null = null
    if ( brandId ) {
      const result = wrapType( () => UUID.from( brandId ) )
      if ( result instanceof BaseException ) {
        errors.push( result )
      } else {
        brandIdValue = result as UUID
      }
    }

    let categoryIdValue: UUID | null = null
    if ( categoryId ) {
      const result = wrapType( () => UUID.from( categoryId ) )
      if ( result instanceof BaseException ) {
        errors.push( result )
      } else {
        categoryIdValue = result as UUID
      }
    }

    const externalIdValue = wrapType(
      () => ValidString.from( externalId ) )

    if ( externalIdValue instanceof BaseException ) {
      errors.push( externalIdValue )
    }

    const urlValue = wrapType(
      () => ValidString.from( url ) )

    if ( urlValue instanceof BaseException ) {
      errors.push( urlValue )
    }

    const titleValue = wrapType(
      () => ValidString.from( title ) )

    if ( titleValue instanceof BaseException ) {
      errors.push( titleValue )
    }

    let descriptionValue: ValidString | null = null
    if ( description ) {
      const result = wrapType( () => ValidString.from( description ) )
      if ( result instanceof BaseException ) {
        errors.push( result )
      } else {
        descriptionValue = result as ValidString
      }
    }

    const priceValue = wrapType(
      () => ValidDecimal.from( price ) )

    if ( priceValue instanceof BaseException ) {
      errors.push( priceValue )
    }

    const currencyValue = wrapType(
      () => ValidString.from( currency ) )

    if ( currencyValue instanceof BaseException ) {
      errors.push( currencyValue )
    }

    const createdAtValue = wrapType(
      () => ValidDate.from( createdAt ) )

    if ( createdAtValue instanceof BaseException ) {
      errors.push( createdAtValue )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Product(
      idValue as UUID,
      storeIdValue as UUID,
      brandIdValue,
      categoryIdValue,
      externalIdValue as ValidString,
      urlValue as ValidString,
      titleValue as ValidString,
      descriptionValue,
      priceValue as ValidDecimal,
      currencyValue as ValidString,
      additionalData,
      createdAtValue as ValidDate
    )
  }
}
