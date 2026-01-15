import { CategoryDAO }              from "../domain/category_dao"
import { Category }                 from "../domain/category"
import { type Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                                   from "../../shared/domain/exceptions/base_exception"
import { PaginatedResult }          from "../../shared/domain/paginated_result"
import {
  ValidInteger
}                                   from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                                   from "../../shared/domain/value_objects/valid_string"
import {
  UUID
}                                   from "../../shared/domain/value_objects/uuid"
import { PrismaClient }             from "@prisma/client"
import {
  DataAlreadyExistException
}                                   from "../../shared/domain/exceptions/data_already_exist_exception"
import {
  InfrastructureException
}                                   from "../../shared/domain/exceptions/infrastructure_exception"
import * as changeCase              from "change-case"
import {
  SubCategory
}                                   from "../../sub_category/domain/sub_category"
import { Errors }                   from "../../shared/domain/exceptions/errors"

export class PrismaCategoryData extends CategoryDAO {
  constructor( private client: PrismaClient ) {
    super()
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


  async search(
    query: Record<string, any>,
    limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString
  ): Promise<Either<BaseException[], PaginatedResult<Category>>> {
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
      const results                = await this.client.$transaction( [
        this.client.category.findMany( {
          where  : where,
          orderBy: orderBy,
          cursor : cursor,
          skip: skip ? 1 : undefined,
          take: limit?.value,
          include:{
            subCategories: true
          }
        } ),
        this.client.category.count( {
          where: where
        } )
      ] )
      const [response, totalCount] = results
      const categories: Category[] = []
      for ( const item of response ) {
        const subCategories : SubCategory[] = []
        for ( const subCategory of item.subCategories ) {
          const mapped = SubCategory.fromPrimitives(
            subCategory.id,
            subCategory.categoryId,
            subCategory.name,
            subCategory.createdAt
          )
          if ( mapped instanceof Errors ) {
            return left( mapped.values )
          }
          subCategories.push( mapped )
        }

        const mapped = Category.fromPrimitives(
          item.id.toString(),
          item.name,
          item.slug,
          subCategories,
          item.createdAt
        )

        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        categories.push( mapped )
      }
      return right( {
        items: categories,
        total: totalCount
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }

  }

  async add( category: Category ): Promise<Either<BaseException, boolean>> {
    try {
      await this.client.$transaction( [
        this.client.category.create( {
          data: {
            id       : category.id.toString(),
            name     : category.name.value,
            slug     : category.slug.value,
            createdAt: category.createdAt.toString()
          }
        } ),
        this.client.subCategory.createMany( {
          data: category.subCategories.map( ( subCategory ) => {
            return {
              id        : subCategory.id.toString(),
              name      : subCategory.name.value,
              categoryId: subCategory.categoryId.toString(),
              createdAt : subCategory.createdAt.toString()
            }
          } )
        } )
      ] )
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

  async update( category: Category ): Promise<Either<BaseException, boolean>> {
    try {
      await this.client.$transaction( [
        this.client.category.update( {
          where: {
            id: category.id.toString()
          },
          data : {
            name: category.name.value,
            slug: category.slug.value
          }
        } ),
        this.client.subCategory.deleteMany( {
          where: {
            categoryId: category.id.toString()
          }
        } ),
        this.client.subCategory.createMany( {
          data: category.subCategories.map( ( subCategory ) => {
            return {
              id        : subCategory.id.toString(),
              name      : subCategory.name.value,
              categoryId: subCategory.categoryId.toString(),
              createdAt : subCategory.createdAt.toString()
            }
          } )
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }

  }

  async remove( id: UUID ): Promise<Either<BaseException, boolean>> {
    try {
      await this.client.category.delete( {
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
}
