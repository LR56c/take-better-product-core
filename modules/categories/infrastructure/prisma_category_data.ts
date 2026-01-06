import { CategoryDAO }         from "../domain/category_dao"
import { Category }            from "../domain/category"
import { type Either }         from "fp-ts/Either"
import { BaseException }       from "../../shared/domain/exceptions/base_exception"
import { PaginatedResult }     from "../../shared/domain/paginated_result"
import { ValidInteger }        from "../../shared/domain/value_objects/valid_integer"
import { ValidString }         from "../../shared/domain/value_objects/valid_string"
import { UUID }                from "../../shared/domain/value_objects/uuid"

export class PrismaCategoryData extends CategoryDAO {
  constructor( private client: any ) {
    super()
  }

  async search(
    query: Record<string, any>,
    limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString
  ): Promise<Either<BaseException[], PaginatedResult<Category>>> {
    throw new Error("Method not implemented.")
  }

  async add( category: Category ): Promise<Either<BaseException, boolean>> {
    throw new Error("Method not implemented.")
  }

  async update( category: Category ): Promise<Either<BaseException, boolean>> {
    throw new Error("Method not implemented.")
  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    throw new Error("Method not implemented.")
  }
}
