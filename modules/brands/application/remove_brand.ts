import { BrandDAO }            from "../domain/brand_dao"
import { type Either }         from "fp-ts/Either"
import {
  BaseException
}                              from "../../shared/domain/exceptions/base_exception"
import { isLeft, left, right } from "fp-ts/lib/Either"
import { ensureBrandExist }    from "../utils/ensure_brand_exist"

export class RemoveBrand {
  constructor( private dao: BrandDAO ) {}

  async execute( id: string ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureBrandExist( this.dao, id )

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
