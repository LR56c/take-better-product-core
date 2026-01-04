import { StoreDAO }          from "../domain/store_dao"
import { type Either }         from "fp-ts/Either"
import { BaseException }       from "../../shared/domain/exceptions/base_exception"
import { PaginatedResult }     from "../../shared/domain/paginated_result"
import { Store }               from "../domain/store"
import { ValidInteger }        from "../../shared/domain/value_objects/valid_integer"
import { ValidString }         from "../../shared/domain/value_objects/valid_string"
import { wrapType }            from "../../shared/utils/wrap_type"
import { Errors }              from "../../shared/domain/exceptions/errors"

export class SearchStore {
  constructor( private storeDAO: StoreDAO ) {}

  async run(
    query: Record<string, any>,
    limit: number = 10,
    skip: string = "",
    sortBy: string = "createdAt",
    sortType: string = "desc"
  ): Promise<Either<BaseException[], PaginatedResult<Store>>> {
    const errors: BaseException[] = []

    const vLimit = wrapType( () => ValidInteger.from( limit ) )
    if ( vLimit instanceof BaseException ) errors.push( vLimit )

    const vSkip = wrapType( () => ValidString.from( skip ) )
    if ( vSkip instanceof BaseException ) errors.push( vSkip )

    const vSortBy = wrapType( () => ValidString.from( sortBy ) )
    if ( vSortBy instanceof BaseException ) errors.push( vSortBy )

    const vSortType = wrapType( () => ValidString.from( sortType ) )
    if ( vSortType instanceof BaseException ) errors.push( vSortType )

    if ( errors.length > 0 ) {
      return { _tag: "Left", left: errors }
    }

    return this.storeDAO.search(
      query,
      vLimit as ValidInteger,
      vSkip as ValidString,
      vSortBy as ValidString,
      vSortType as ValidString
    )
  }
}
