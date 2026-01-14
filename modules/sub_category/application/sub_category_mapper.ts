import { Errors }        from "../../shared/domain/exceptions/errors"
import { wrapType }      from "../../shared/utils/wrap_type"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { BaseException } from "../../shared/domain/exceptions/base_exception"
import { UUID }          from "../../shared/domain/value_objects/uuid"
import { SubCategory } from "../domain/sub_category"
import { SubCategoryDTO } from "./sub_category_dto"

export class SubCategoryMapper {

  static toDTO( subSubCategory: SubCategory ): SubCategoryDTO {
    return {
      id        : subSubCategory.id.toString(),
      clinic_id : subSubCategory.clinicId.toString(),
      category_id: subSubCategory.categoryId.toString(),
      name      : subSubCategory.name.value,
      created_at: subSubCategory.createdAt.toString()
    }
  }

  static toJSON( dto: SubCategoryDTO ): Record<string, any> {
    return {
      id        : dto.id,
      clinic_id : dto.clinic_id,
      category_id: dto.category_id,
      name      : dto.name,
      created_at: dto.created_at
    }
  }

  static fromJSON( json: Record<string, any> ): SubCategoryDTO | Errors {
    const errors = []

    const id = wrapType( () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const clinicId = wrapType( () => UUID.from( json.clinic_id ) )

    if ( clinicId instanceof BaseException ) {
      errors.push( clinicId )
    }

    const name = wrapType( () => ValidString.from( json.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const categoryId = wrapType( () => UUID.from( json.category_id ) )

    if ( categoryId instanceof BaseException ) {
      errors.push( categoryId )
    }

    const createdAt = wrapType( () => ValidString.from( json.created_at ) )

    if ( createdAt instanceof BaseException ) {
      errors.push( createdAt )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id        : (
        id as UUID
      ).toString(),
      clinic_id : (
        clinicId as UUID
      ).toString(),
      category_id: (
        categoryId as UUID
      ).toString(),
      name      : (
        name as ValidString
      ).value,
      created_at: (
        createdAt as ValidString
      ).toString()
    }
  }

  static toDomain( json: Record<string, any> ): SubCategory | Errors {
    return SubCategory.fromPrimitives(
      json.id,
      json.clinic_id,
      json.category_id,
      json.name,
      json.created_at
    )
  }
}