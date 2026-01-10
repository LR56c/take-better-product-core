import { Product }            from "../domain/product"
import { ProductDAO }         from "../domain/product_dao"
import { type Either, right } from "fp-ts/Either"
import {
  BaseException
}                             from "../../shared/domain/exceptions/base_exception"
import { Errors }             from "../../shared/domain/exceptions/errors"
import { ProductResponse }    from "./product_response"
import { isLeft, left }       from "fp-ts/lib/Either"
import { containError }       from "../../shared/utils/contain_error"
import {
  DataNotFoundException
}                             from "../../shared/domain/exceptions/data_not_found_exception"
import { ensureProductExist } from "../utils/ensure_product_exist"

export class AddProduct {
  constructor( private dao: ProductDAO ) {}

  async run(
    dto : ProductResponse
  ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureProductExist( this.dao, dto.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const product = Product.create(
      dto.id,
      dto.store_id,
      dto.brand_id,
      dto.category_id,
      dto.external_id,
      dto.url,
      dto.title,
      dto.description,
      dto.price,
      dto.currency,
      dto.additional_data
    )

    if ( product instanceof Errors ) {
      return left( product.values )
    }

    const result = await this.dao.add( product )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }
    return right( true )

  }
}
