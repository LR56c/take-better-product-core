import { Either, isLeft, left, right } from "fp-ts/Either"
import { CountryDAO }                  from "../domain/country_dao"
import { CountryDTO }                  from "./country_dto"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { Country }                     from "../domain/country"
import { ensureCountryExist }          from "../utils/ensure_country_exist"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"

export class UpdateCountry {
  constructor(private readonly dao : CountryDAO) {
  }

  async execute( country: CountryDTO ): Promise<Either<BaseException[], Country>>{
    const exist = await ensureCountryExist(this.dao, country.id)

    if ( isLeft(exist) ) {
      return left(exist.left)
    }

    const updatedCountry = Country.fromPrimitives(
      country.id,
      country.name,
      country.code,
      country.currency,
      exist.right.createdAt.toString()
    )

    if( updatedCountry instanceof Errors ) {
      return left(updatedCountry.values)
    }

    const result = await this.dao.update(updatedCountry)

    if ( isLeft(result) ) {
      return left([result.left])
    }

    return right(updatedCountry)
  }
}