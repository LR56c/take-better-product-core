import { Product }           from "../domain/product"
import { type ProductResponse } from "./ProductResponse"
import { Errors }            from "../../shared/domain/exceptions/errors"
import { wrapType }          from "../../shared/utils/wrap_type"
import {
  BaseException
}                            from "../../shared/domain/exceptions/base_exception"
import {
  ValidString
}                            from "../../shared/domain/value_objects/valid_string"
import { UUID }              from "../../shared/domain/value_objects/uuid"
import { ValidNumber }       from "../../shared/domain/value_objects/valid_number"

export class ProductMapper {
  static toDTO( product: Product ): ProductResponse {
    return {
      id             : product.id.toString(),
      store_id       : product.storeId.toString(),
      brand_id       : product.brandId?.toString() ?? null,
      category_id    : product.categoryId?.toString() ?? null,
      external_id    : product.externalId.value,
      url            : product.url.value,
      title          : product.title.value,
      description    : product.description?.value ?? null,
      price          : product.price.value,
      currency       : product.currency.value,
      additional_data: product.additionalData
    }
  }

  static toJSON( product: ProductResponse ): Record<string, any> {
    return {
      id             : product.id,
      store_id       : product.store_id,
      brand_id       : product.brand_id,
      category_id    : product.category_id,
      external_id    : product.external_id,
      url            : product.url,
      title          : product.title,
      description    : product.description,
      price          : product.price,
      currency       : product.currency,
      additional_data: product.additional_data
    }
  }

  static fromJSON( product: Record<string, any> ): ProductResponse | Errors {
    const errors = []
    const id = wrapType( () => UUID.from( product.id ) )
    if ( id instanceof BaseException ) errors.push( id )

    const storeId = wrapType( () => UUID.from( product.store_id ) )
    if ( storeId instanceof BaseException ) errors.push( storeId )

    if ( product.brand_id ) {
      const brandId = wrapType( () => UUID.from( product.brand_id ) )
      if ( brandId instanceof BaseException ) errors.push( brandId )
    }

    if ( product.category_id ) {
      const categoryId = wrapType( () => UUID.from( product.category_id ) )
      if ( categoryId instanceof BaseException ) errors.push( categoryId )
    }

    const externalId = wrapType( () => ValidString.from( product.external_id ) )
    if ( externalId instanceof BaseException ) errors.push( externalId )

    const url = wrapType( () => ValidString.from( product.url ) )
    if ( url instanceof BaseException ) errors.push( url )

    const title = wrapType( () => ValidString.from( product.title ) )
    if ( title instanceof BaseException ) errors.push( title )

    if ( product.description ) {
      const description = wrapType( () => ValidString.from( product.description ) )
      if ( description instanceof BaseException ) errors.push( description )
    }

    const price = wrapType( () => ValidNumber.from( product.price ) )
    if ( price instanceof BaseException ) errors.push( price )

    const currency = wrapType( () => ValidString.from( product.currency ) )
    if ( currency instanceof BaseException ) errors.push( currency )

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id             : product.id,
      store_id       : product.store_id,
      brand_id       : product.brand_id,
      category_id    : product.category_id,
      external_id    : product.external_id,
      url            : product.url,
      title          : product.title,
      description    : product.description,
      price          : product.price,
      currency       : product.currency,
      additional_data: product.additional_data
    }
  }

  static toDomain( json: Record<string, any> ): Product | Errors {
    return Product.fromPrimitives(
      json.id,
      json.store_id,
      json.brand_id,
      json.category_id,
      json.external_id,
      json.url,
      json.title,
      json.description,
      json.price,
      json.currency,
      json.additional_data,
      json.created_at,
      json.updated_at
    )
  }
}
