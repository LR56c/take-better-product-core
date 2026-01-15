import { Category }         from "../domain/category"
import { Errors }           from "../../shared/domain/exceptions/errors"
import { wrapType }         from "../../shared/utils/wrap_type"
import {
  BaseException
}                           from "../../shared/domain/exceptions/base_exception"
import {
  ValidString
}                           from "../../shared/domain/value_objects/valid_string"
import { UUID }             from "../../shared/domain/value_objects/uuid"
import { CategoryResponse } from "./category_response"
import {
  SubCategoryMapper
}                           from "../../sub_category/application/sub_category_mapper"
import {
  SubCategoryDTO
}                           from "../../sub_category/application/sub_category_dto"
import { ValidDate }        from "../../shared/domain/value_objects/valid_date"
import { SubCategory }      from "../../sub_category/domain/sub_category"

export class CategoryMapper {
  static toDTO( category: Category ): CategoryResponse {
    return {
      id            : category.id.toString(),
      name          : category.name.value,
      slug          : category.slug.value,
      sub_categories: category.subCategories.map( SubCategoryMapper.toDTO ),
      created_at    : category.createdAt.toString()
    }
  }

  static toJSON( category: CategoryResponse ): Record<string, any> {
    return {
      id            : category.id,
      name          : category.name,
      slug          : category.slug,
      sub_categories: category.sub_categories.map( SubCategoryMapper.toJSON ),
      created_at    : category.created_at
    }
  }

  static fromJSON( category: Record<string, any> ): CategoryResponse | Errors {
    const errors = []
    const id     = wrapType( () => UUID.from( category.id ) )
    if ( id instanceof BaseException ) errors.push( id )

    const name = wrapType( () => ValidString.from( category.name ) )
    if ( name instanceof BaseException ) errors.push( name )

    const slug = wrapType( () => ValidString.from( category.slug ) )
    if ( slug instanceof BaseException ) errors.push( slug )

    if ( category.parent_id ) {
      const parentId = wrapType( () => UUID.from( category.parent_id ) )
      if ( parentId instanceof BaseException ) errors.push( parentId )
    }

    const subCategories: SubCategoryDTO[] = []
    if ( category.sub_categories ) {
      for ( const subCategory of category.sub_categories ) {
        const mapped = SubCategoryMapper.fromJSON( subCategory )
        if ( mapped instanceof Errors ) {
          errors.push( ...mapped.values )
        }
        else {
          subCategories.push( mapped )
        }
      }
    }

    const createdAt = wrapType( () => ValidDate.from( category.created_at ) )
    if ( createdAt instanceof BaseException ) errors.push( createdAt )

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id            : category.id,
      name          : category.name,
      slug          : category.slug,
      sub_categories: subCategories,
      created_at    : category.created_at
    }
  }

  static toDomain( json: Record<string, any> ): Category | Errors {
    const subCategories : SubCategory[] = []
    if ( json.sub_categories ) {
      for ( const subCategory of json.sub_categories ) {
        const mapped = SubCategoryMapper.toDomain( subCategory )
        if ( mapped instanceof Errors ) {
          return mapped
        }
        else {
          subCategories.push( mapped )
        }
      }
    }

    return Category.fromPrimitives(
      json.id,
      json.name,
      json.slug,
      subCategories,
      json.created_at
    )
  }
}
