import { PaginatedResult } from "../../shared/domain/paginated_result"
import { BrandResponse }   from "./brand_response"

export abstract class BrandAppService {
  abstract search(queryUrl: string): Promise<PaginatedResult<BrandResponse>>

  abstract add( brand: BrandResponse ): Promise<void>

  abstract update( brand: BrandResponse ): Promise<void>

  abstract remove( id: string ): Promise<void>
}
