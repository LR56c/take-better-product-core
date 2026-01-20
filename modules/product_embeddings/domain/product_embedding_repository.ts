import { Either }           from "fp-ts/Either"
import { ProductEmbedding } from "./product_embedding"
import { BaseException }    from "../../shared/domain/exceptions/base_exception"
import { UUID }             from "../../shared/domain/value_objects/uuid"
import {
  ValidInteger
}                           from "../../shared/domain/value_objects/valid_integer"
import {
  ValidString
}                           from "../../shared/domain/value_objects/valid_string"

export interface VectorSearchResult {
  productId: string;
  similarity: number;
}

export abstract class ProductEmbeddingRepository {
  abstract upsert( embed: ProductEmbedding ): Promise<Either<BaseException, boolean>>

  abstract remove( ids: UUID[] ): Promise<Either<BaseException, boolean>>

  abstract similarity( vector: number[], threshold: number, limit?: ValidInteger  ): Promise<Either<BaseException, VectorSearchResult[]>>

  abstract search( query: Record<string, any>, limit?: ValidInteger,
    skip ?: ValidString, sortBy ?: ValidString,
    sortType ?: ValidString ): Promise<Either<BaseException[], ProductEmbedding[]>>
}
