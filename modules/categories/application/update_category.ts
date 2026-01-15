import { CategoryDAO }         from "../domain/category_dao"
import { type Either, right }  from "fp-ts/Either"
import {
  BaseException
}                              from "../../shared/domain/exceptions/base_exception"
import { Category }            from "../domain/category"
import { Errors }              from "../../shared/domain/exceptions/errors"
import { CategoryResponse }    from "./category_response"
import { isLeft, left }        from "fp-ts/lib/Either"
import { ensureCategoryExist } from "../utils/ensure_category_exist"
import { SubCategory }         from "../../sub_category/domain/sub_category"

export class UpdateCategory {
  constructor( private dao: CategoryDAO ) {
  }

  async run(
    dto: CategoryResponse
  ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureCategoryExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const subCategories : SubCategory[] = []
    if ( dto.sub_categories ) {
      for ( const subCategory of dto.sub_categories ) {
        const mapped = SubCategory.fromPrimitives(
          subCategory.id,
          subCategory.category_id,
          subCategory.name,
          subCategory.created_at
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        subCategories.push( mapped )
      }
    }


    const category = Category.fromPrimitives(
      dto.id,
      dto.name,
      dto.slug,
      subCategories,
      exist.right.createdAt.toString()
    )

    if ( category instanceof Errors ) {
      return left( category.values )
    }

    const result = await this.dao.update( category )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }
    return right( true )

  }
}
