import { Errors }                   from "../../shared/domain/exceptions/errors"
import { ProductEmbedding }         from "../domain/product_embedding"
import { ProductEmbeddingResponse }  from "./product_embedding_response"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import {
  UUID
}                                    from "../../shared/domain/value_objects/uuid"
import {
  BaseException
}                                   from "../../shared/domain/exceptions/base_exception"
import {
  ValidString
}                                   from "../../shared/domain/value_objects/valid_string"
import {
  ValidDate
}                                    from "../../shared/domain/value_objects/valid_date"

export class ProductEmbeddingMapper {

  static toDTO( embed: ProductEmbedding ): ProductEmbeddingResponse {
    return {
      id        : embed.id.toString(),
      product_id   : embed.productId.toString(),
      content   : embed.content.value,
      updated_at: embed.updatedAt?.toString(),
      created_at: embed.createdAt.toString()
    }
  }


  static toJSON( embed: ProductEmbeddingResponse ): Record<string, any> {
    return {
      id        : embed.id,
      product_id: embed.product_id,
      content   : embed.content,
      updated_at: embed.updated_at,
      created_at: embed.created_at
    }
  }

  static fromJSON( json: Record<string, any> ): ProductEmbeddingResponse | Errors {
    const errors = []

    const id = wrapType( () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const content = wrapType( () => ValidString.from( json.content ) )

    if ( content instanceof BaseException ) {
      errors.push( content )
    }

    const createdAt = wrapType(() => ValidDate.from( json.createdAt ) )

    if ( createdAt instanceof BaseException ) {
      errors.push( createdAt )
    }

    const updatedAt = wrapTypeDefault(undefined, (value) => ValidDate.from( value ),json.updatedAt )

    if ( updatedAt instanceof BaseException ) {
      errors.push( updatedAt )
    }

    const productId = wrapType( () => UUID.from( json.id ) )

    if ( productId instanceof BaseException ) {
      errors.push( productId )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id             : (
        id as UUID
      ).toString(),
      content        : (
        content as ValidString
      ).value,
      product_id: (
        productId as UUID
      ).toString(),
      created_at     : (
        createdAt as ValidDate
      ).toString(),
      updated_at     : (
        updatedAt as ValidDate
      ).toString()
    }
  }


  static toDomain( json: Record<string, any> ): ProductEmbedding | Errors {

    return ProductEmbedding.fromPrimitives(
      json.id,
      json.product_id,
      json.content,
      json.vector ?? [],
      json.created_at,
      json.updated_at,
    )
  }

}