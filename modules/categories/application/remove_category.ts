import { CategoryDAO }         from "../domain/category_dao"
import { type Either }         from "fp-ts/Either"
import {
  BaseException
}                              from "../../shared/domain/exceptions/base_exception"
import { isLeft, left, right } from "fp-ts/lib/Either"
import { ensureCategoryExist } from "../utils/ensure_category_exist"

export class RemoveCategory {
  constructor( private dao: CategoryDAO ) {}

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureCategoryExist( this.dao, id )

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
