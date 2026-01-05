import { StoreResponse } from "./store_response"

export abstract class StoreAppService {

  abstract search(queryUrl: string): Promise<StoreResponse[]>
  abstract add( store: StoreResponse ): Promise<void>
  abstract update( store: StoreResponse ): Promise<void>
  abstract remove( id: string ): Promise<void>
}
