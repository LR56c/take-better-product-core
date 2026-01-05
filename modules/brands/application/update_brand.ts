import { BrandDAO }                         from "../domain/brand_dao"
import { type Either, isLeft, left, right } from "fp-ts/Either"
import { BaseException }                    from "../../shared/domain/exceptions/base_exception"
import { Brand }           from "../domain/brand"
import { Errors }          from "../../shared/domain/exceptions/errors"
import { BrandResponse } from "./brand_response"
import { ensureBrandExist } from "../utils/ensure_brand_exist"

export class UpdateBrand {
  constructor( private brandDAO: BrandDAO ) {}

  async execute( dto: BrandResponse ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureBrandExist( this.brandDAO, dto.id )


    if ( isLeft( exist ) ) {
        return left( exist.left )
    }

    const newBrand = Brand.fromPrimitives(
      exist.right.id.toString(),
      dto.name,
      exist.right.createdAt.toString(),
    )

    if ( newBrand instanceof Errors ) {
      return left( newBrand.values )
    }

    const result = await this.brandDAO.update( newBrand )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}
