import { ProductResponse } from "./product_response"

export abstract class ProductAppService {
  abstract search(queryUrl : string): Promise<ProductResponse[]>
  abstract add( product: ProductResponse ): Promise<void>
  abstract update( product: ProductResponse ): Promise<void>
  abstract upsert( product: ProductResponse ): Promise<void>
  abstract remove( id: string ): Promise<void>
}
