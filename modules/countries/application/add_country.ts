import { Either, isLeft, left, right } from "fp-ts/Either"
import { CountryDTO }                  from "./country_dto"
import {
  BaseException
}                                      from "../../shared/domain/exceptions/base_exception"
import { Country }                     from "../domain/country"
import { ensureCountryExist }          from "../utils/ensure_country_exist"
import { containError }                from "../../shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "../../shared/domain/exceptions/data_not_found_exception"
import {
  Errors
}                                      from "../../shared/domain/exceptions/errors"
import { CountryDAO }                  from "../domain/country_dao"

export class AddCountry {
  constructor( private readonly dao: CountryDAO ) {
  }

  async execute( country: CountryDTO ): Promise<Either<BaseException[], Country>> {
    const exist = await ensureCountryExist( this.dao, country.id )

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const newCountry = Country.create(
      country.id,
      country.name,
      country.code,
      country.currency,
    )

    if ( newCountry instanceof Errors ) {
      return left( newCountry.values )
    }

    const result = await this.dao.add( newCountry )

    if ( isLeft( result ) ) {
      return left( [result.left] )
    }

    return right( newCountry )
  }
}