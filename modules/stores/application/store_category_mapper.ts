import { StoreCategory } from "../domain/store_category"
import { StoreCategoryDTO } from "./store_category_dto"
import { Errors } from "../../shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "../../shared/utils/wrap_type"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { ValidString } from "../../shared/domain/value_objects/valid_string"
import { UUID } from "../../shared/domain/value_objects/uuid"
import { ValidBool } from "../../shared/domain/value_objects/valid_bool"

export class StoreCategoryMapper {
  static toDTO( storeCategory: StoreCategory ): StoreCategoryDTO {
    return {
      id: storeCategory.id.toString(),
      storeId: storeCategory.storeId.value,
      categoryId: storeCategory.categoryId.value,
      url: storeCategory.url?.value ?? null,
      isActive: storeCategory.isActive.value
    }
  }

  static toJSON( storeCategory: StoreCategoryDTO ): Record<string, any> {
    return {
      id: storeCategory.id,
      store_id: storeCategory.storeId,
      category_id: storeCategory.categoryId,
      url: storeCategory.url,
      is_active: storeCategory.isActive
    }
  }

  static fromJSON( storeCategory: Record<string, any> ): StoreCategoryDTO | Errors {
    const errors = []
    const id = wrapType( () => UUID.from( storeCategory.id ) )
    if ( id instanceof BaseException ) errors.push( id )

    const storeId = wrapType( () => ValidString.from( storeCategory.store_id ) )
    if ( storeId instanceof BaseException ) errors.push( storeId )

    const categoryId = wrapType( () => ValidString.from( storeCategory.category_id ) )
    if ( categoryId instanceof BaseException ) errors.push( categoryId )

    const url = wrapTypeDefault( null, ( value ) => ValidString.from( value ),
      storeCategory.url )

    if ( url instanceof BaseException ) {
      errors.push( url )
    }

    const isActive = wrapType( () => ValidBool.from( storeCategory.is_active ) )
    if ( isActive instanceof BaseException ) errors.push( isActive )

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id: (id as UUID).toString(),
      storeId: (storeId as ValidString).value,
      categoryId: (categoryId as ValidString).value,
      url: url instanceof ValidString ? url.value : null,
      isActive: (isActive as ValidBool).value
    }
  }

  static toDomain( json: Record<string, any> ): StoreCategory | Errors {
    return StoreCategory.fromPrimitives(
      json.id,
      json.store_id,
      json.category_id,
      json.url,
      json.is_active,
      json.created_at
    )
  }
}
