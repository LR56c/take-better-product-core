import { Product }            from "../domain/product"
import { ProductDAO }         from "../domain/product_dao"
import { type Either }        from "fp-ts/Either"
import {
  BaseException
}                             from "../../shared/domain/exceptions/base_exception"
import { Errors }             from "../../shared/domain/exceptions/errors"
import { ProductResponse }    from "./product_response"
import { ensureProductExist } from "../utils/ensure_product_exist"
import { isLeft, left }       from "fp-ts/lib/Either"

export class UpsertProduct {
  constructor( private dao: ProductDAO ) {
  }

  async run(
    dto: ProductResponse
  ): Promise<Either<BaseException[], boolean>> {
    const exist = await ensureProductExist( this.dao, dto.id )

    let product: Product | Errors
    if ( isLeft( exist ) ) {
      product = Product.create(
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
        dto.additional_data as Record<string, any>
      )
    }
    else {
      product = Product.fromPrimitives(
        exist.right.id.value,
        dto.store_id,
        dto.brand_id,
        dto.category_id,
        dto.external_id,
        dto.url,
        dto.title,
        dto.description,
        dto.price,
        dto.currency,
        dto.additional_data as Record<string, any>,
        exist.right.createdAt.value,
        exist.right.updatedAt.value
      )
    }

    if ( product instanceof Errors ) {
      return left( product.values )
    }

    const result = await this.dao.upsert( product )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }
    return result

  }
}
