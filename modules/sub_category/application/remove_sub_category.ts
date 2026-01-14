import { type Either, isLeft, left, right } from "fp-ts/lib/Either.js"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { SubCategoryDAO }                   from "../domain/sub_category_dao"
import {
  ensureSubCategoryExist
}                                           from "../utils/ensure_sub_category_exist"

export class RemoveSubCategory {
  constructor( private readonly dao: SubCategoryDAO ) {
  }

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {

    const exist = await ensureSubCategoryExist( this.dao, id )

    if ( isLeft( exist ) ) {
      return left( exist.left )
    }

    const result = await this.dao.remove( exist.right.id )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }

}