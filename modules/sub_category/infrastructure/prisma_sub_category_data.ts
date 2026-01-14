import { BaseException }       from "../../shared/domain/exceptions/base_exception"
import { UUID }                from "../../shared/domain/value_objects/uuid"
import {
  ValidInteger
}                              from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                              from "../../shared/domain/value_objects/valid_string"
import { type PaginatedResult }     from "../../shared/domain/paginated_result"
import { type Either, left, right } from "fp-ts/lib/Either.js"
import * as changeCase         from "change-case"
import {
  InfrastructureException
}                              from "../../shared/domain/exceptions/infrastructure_exception"
import { Errors }              from "../../shared/domain/exceptions/errors"
import {
  DataAlreadyExistException
}                              from "../../shared/domain/exceptions/data_already_exist_exception"
import { PrismaClient }        from "@prisma/client"
import { SubCategoryDAO }           from "../domain/sub_category_dao"
import { SubCategory }              from "../domain/sub_category"

export class PrismaSubCategoryData implements SubCategoryDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  async update( subCategory: SubCategory ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.subCategory.update( {
        where: {
          id: subCategory.id.toString()
        },
        data : {
          name      : subCategory.name.value,
          categoryId: subCategory.categoryId.value,
          clinicId  : subCategory.clinicId.toString(),
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }


  async add( subCategory: SubCategory ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.subCategory.create( {
        data: {
          id       : subCategory.id.toString(),
          name     : subCategory.name.value,
          categoryId: subCategory.categoryId.value,
          clinicId : subCategory.clinicId.toString(),
          createdAt: subCategory.createdAt.toString()
        }
      } )
      return right( true )
    }
    catch ( e: any ) {
      const code = e.code
      if ( code ) {
        if ( code === "P2002" ) {
          return left( new DataAlreadyExistException() )
        }
      }
      return left( new InfrastructureException() )
    }

  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.subCategory.delete( {
        where: {
          id: id.toString()
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  mapQuery( query: Record<string, any> ): Record<string, any> {
    const where: Record<string, any> = {}
    if ( query.id ) {
      where["id"] = {
        equals: query.id
      }
    }
    return where
  }


  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<SubCategory>>> {
    try {
      const where          = this.mapQuery( query )
      const orderField     = sortBy
        ? changeCase.camelCase( sortBy.value )
        : "createdAt"
      const orderDirection = sortType ? sortType.value : "desc"
      const orderBy        = { [orderField]: orderDirection }

      let cursor: any | undefined
      const cursorBy = sortBy && sortBy.value === "created_at"
        ? "createdAt"
        : "id"
      if ( skip ) {
        cursor = { [cursorBy]: skip.value }
      }
      const results                = await this.db.$transaction( [
        this.db.subCategory.findMany( {
          where  : where,
          orderBy: orderBy,
          cursor : cursor,
          skip: skip ? 1 : undefined,
          take: limit?.value,
        } ),
        this.db.category.count( {
          where: where
        } )
      ] )
      const [response, totalCount] = results
      const subCategories: SubCategory[] = []
      for ( const item of response ) {
        const mapped = SubCategory.fromPrimitives(
          item.id.toString(),
          item.clinicId.toString(),
          item.categoryId.toString(),
          item.name,
          item.createdAt,
        )

        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        subCategories.push( mapped )
      }
      return right( {
        items: subCategories,
        total: totalCount
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

}