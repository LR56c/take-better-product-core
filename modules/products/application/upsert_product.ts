import { Product }           from "../domain/product"
import { ProductDAO }          from "../domain/product_dao"
import { type Either }         from "fp-ts/Either"
import { BaseException }       from "../../shared/domain/exceptions/base_exception"
import { Errors }              from "../../shared/domain/exceptions/errors"

export class UpsertProduct {
  constructor( private productDAO: ProductDAO ) {}

  async run(
    id: string,
    storeId: string,
    brandId: string | null,
    categoryId: string | null,
    externalId: string,
    url: string,
    title: string,
    description: string | null,
    price: number,
    currency: string,
    additionalData: Record<string, any> | null
  ): Promise<Either<BaseException, boolean>> {
    const product = Product.create(
      id,
      storeId,
      brandId,
      categoryId,
      externalId,
      url,
      title,
      description,
      price,
      currency,
      additionalData
    )

    if ( product instanceof Errors ) {
      return { _tag: "Left", left: product }
    }

    return this.productDAO.upsert( product )
  }
}
