import { BrandDAO } from "../domain/brand_dao"
import { type Either, right } from "fp-ts/Either"
import {
  BaseException
} from "../../shared/domain/exceptions/base_exception"
import { BrandResponse } from "./brand_response"
import { ensureBrandExist } from "../utils/ensure_brand_exist"
import { isLeft, left } from "fp-ts/lib/Either"
import { containError } from "../../shared/utils/contain_error"
import {
  DataNotFoundException
} from "../../shared/domain/exceptions/data_not_found_exception"
import { Brand } from "../domain/brand"
import { Errors } from "../../shared/domain/exceptions/errors"

export class AddBrand {
  constructor( private brandDAO: BrandDAO ) {
  }

  async execute( dto: BrandResponse ): Promise<Either<BaseException[], boolean>> {

    const exist = await ensureBrandExist( this.brandDAO, dto.id )


    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const newBrand = Brand.create(
      dto.id,
      dto.name
    )

    if ( newBrand instanceof Errors ) {
      return left( newBrand.values )
    }

    const result = await this.brandDAO.add( newBrand )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( true )
  }
}
