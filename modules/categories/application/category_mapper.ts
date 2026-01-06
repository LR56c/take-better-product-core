import { Category }          from "../domain/category"
import { Errors }            from "../../shared/domain/exceptions/errors"
import { wrapType }          from "../../shared/utils/wrap_type"
import {
  BaseException
}                            from "../../shared/domain/exceptions/base_exception"
import {
  ValidString
}                            from "../../shared/domain/value_objects/valid_string"
import { UUID }              from "../../shared/domain/value_objects/uuid"
import { CategoryResponse }  from "./category_response"

export class CategoryMapper {
  static toDTO( category: Category ): CategoryResponse {
    return {
      id       : category.id.toString(),
      name     : category.name.value,
      slug     : category.slug.value,
      parent_id: category.parentId?.toString() ?? null
    }
  }

  static toJSON( category: CategoryResponse ): Record<string, any> {
    return {
      id       : category.id,
      name     : category.name,
      slug     : category.slug,
      parent_id: category.parent_id
    }
  }

  static fromJSON( category: Record<string, any> ): CategoryResponse | Errors {
    const errors = []
    const id = wrapType( () => UUID.from( category.id ) )
    if ( id instanceof BaseException ) errors.push( id )

    const name = wrapType( () => ValidString.from( category.name ) )
    if ( name instanceof BaseException ) errors.push( name )

    const slug = wrapType( () => ValidString.from( category.slug ) )
    if ( slug instanceof BaseException ) errors.push( slug )

    if ( category.parent_id ) {
      const parentId = wrapType( () => UUID.from( category.parent_id ) )
      if ( parentId instanceof BaseException ) errors.push( parentId )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id       : category.id,
      name     : category.name,
      slug     : category.slug,
      parent_id: category.parent_id
    }
  }

  static toDomain( json: Record<string, any> ): Category | Errors {
    return Category.fromPrimitives(
      json.id,
      json.name,
      json.slug,
      json.parent_id,
      json.created_at
    )
  }
}
