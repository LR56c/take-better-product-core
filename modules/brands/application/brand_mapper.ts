import { Brand }              from "../domain/brand"
import { type BrandResponse } from "./brand_response"
import { Errors }             from "../../shared/domain/exceptions/errors"
import { wrapType }          from "../../shared/utils/wrap_type"
import {
  BaseException
}                            from "../../shared/domain/exceptions/base_exception"
import {
  ValidString
}                            from "../../shared/domain/value_objects/valid_string"
import { UUID }              from "../../shared/domain/value_objects/uuid"

export class BrandMapper {
  static toDTO( brand: Brand ): BrandResponse {
    return {
      id  : brand.id.toString(),
      name: brand.name.value
    }
  }

  static toJSON( brand: BrandResponse ): Record<string, any> {
    return {
      id  : brand.id,
      name: brand.name
    }
  }

  static fromJSON( brand: Record<string, any> ): BrandResponse | Errors {
    const errors = []
    const id = wrapType( () => UUID.from( brand.id ) )
    if ( id instanceof BaseException ) errors.push( id )

    const name = wrapType( () => ValidString.from( brand.name ) )
    if ( name instanceof BaseException ) errors.push( name )

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id  : brand.id,
      name: brand.name
    }
  }

  static toDomain( json: Record<string, any> ): Brand | Errors {
    return Brand.fromPrimitives(
      json.id,
      json.name,
      json.created_at
    )
  }
}
