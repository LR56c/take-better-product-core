import { type Either, isLeft, left, right } from "fp-ts/lib/Either.js"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { containError }                from "../../shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "../../shared/domain/exceptions/data_not_found_exception"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"
import { SubCategoryDAO }                   from "../domain/sub_category_dao"
import { SubCategoryDTO } from "./sub_category_dto"
import { SubCategory } from "../domain/sub_category"
import { ensureSubCategoryExist } from "../utils/ensure_sub_category_exist"

export class AddSubCategory {
  constructor(
    private readonly dao: SubCategoryDAO
  )
  {
  }

  async execute( dto: SubCategoryDTO ): Promise<Either<BaseException[], SubCategory>> {

    const existResult = await ensureSubCategoryExist( this.dao, dto.id )

    if ( isLeft( existResult ) ) {
      if ( !containError( existResult.left, new DataNotFoundException() ) ) {
        return left( existResult.left )
      }
    }

    const categoryToAdd = SubCategory.create(
      dto.id,
      dto.clinic_id,
      dto.category_id,
      dto.name,
    )

    if ( categoryToAdd instanceof Errors ) {
      return left( categoryToAdd.values )
    }

    const result = await this.dao.add( categoryToAdd )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( categoryToAdd )
  }

}