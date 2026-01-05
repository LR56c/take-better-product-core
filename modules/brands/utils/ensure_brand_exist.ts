import { type Either, isLeft, left, right } from "fp-ts/Either"
import { BrandDAO }                         from "../domain/brand_dao"
import { Brand }                            from "../domain/brand"
import {
  BaseException
}                                           from "../../shared/domain/exceptions/base_exception"
import {
  ValidInteger
}                                           from "../../shared/domain/value_objects/valid_integer"
import {
  DataNotFoundException
}                                           from "../../shared/domain/exceptions/data_not_found_exception"

export const ensureBrandExist = async ( dao: BrandDAO,
  brandId: string ): Promise<Either<BaseException[], Brand>> => {

  const country = await dao.search({
    id: brandId
  }, ValidInteger.from(1))

  if ( isLeft(country) ) {
    return left(country.left)
  }

  if ( country.right.items.length > 0 && country.right.items[0]!.id.value !== brandId ) {
    return left( [new DataNotFoundException()] )
  }

  return right(country.right.items[0])
}