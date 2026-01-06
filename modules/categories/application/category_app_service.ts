import { CategoryResponse } from "./category_response"

export abstract class CategoryAppService {
  abstract search(queryUrl : string): Promise<CategoryResponse[]>
  abstract add( category: CategoryResponse ): Promise<void>
  abstract update( category: CategoryResponse ): Promise<void>
  abstract remove( id: string ): Promise<void>
}
