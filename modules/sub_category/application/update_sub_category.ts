import { type Either, isLeft, left, right } from "fp-ts/lib/Either"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"
import { SubCategoryDAO }                   from "../domain/sub_category_dao"
import { SubCategoryDTO }                   from "./sub_category_dto"
import { SubCategory }                      from "../domain/sub_category"
import {
  ensureSubCategoryExist
}                                           from "../utils/ensure_sub_category_exist"

export class UpdateSubCategory {
  constructor(
    private readonly dao: SubCategoryDAO
  )
  {
  }

  async execute( dto: SubCategoryDTO ): Promise<Either<BaseException[], SubCategory>> {


    const existResult = await ensureSubCategoryExist( this.dao, dto.id )

    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    const categoryToUpdate = SubCategory.fromPrimitives(
      existResult.right.id.toString(),
      dto.clinic_id,
      dto.category_id,
      dto.name,
      existResult.right.createdAt.toString(),
    )

    if ( categoryToUpdate instanceof Errors ) {
      return left( categoryToUpdate.values )
    }

    const result = await this.dao.update( categoryToUpdate )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( categoryToUpdate )
  }

}