import { Category }      from "../domain/category"
import { CategoryDAO }        from "../domain/category_dao"
import { type Either, right } from "fp-ts/Either"
import { BaseException }      from "../../shared/domain/exceptions/base_exception"
import { Errors }        from "../../shared/domain/exceptions/errors"
import { isLeft, left } from "fp-ts/lib/Either"
import { containError }  from "../../shared/utils/contain_error"
import {
  DataNotFoundException
}                        from "../../shared/domain/exceptions/data_not_found_exception"
import { ensureCategoryExist } from "../utils/ensure_category_exist"
import { CategoryResponse } from "./category_response"
import { SubCategory } from "../../sub_category/domain/sub_category"

export class AddCategory {
  constructor( private dao: CategoryDAO ) {}

  async run(
    dto : CategoryResponse
  ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureCategoryExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const subCategories : SubCategory[] = []
    if ( dto.sub_categories ) {
      for ( const subCategory of dto.sub_categories ) {
        const mapped = SubCategory.create(
          subCategory.id,
          subCategory.category_id,
          subCategory.name
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        subCategories.push( mapped )
      }
    }

    const category = Category.create(
      dto.id,
      dto.name,
      dto.slug,
      subCategories
    )

    if ( category instanceof Errors ) {
      return left( category.values )
    }

    const result = await this.dao.add( category )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }
    return right( true )
  }
}
