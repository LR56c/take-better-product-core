import { z } from "zod"
import {
  InvalidEmbeddingStatusException
}            from "./exceptions/invalid_embedding_status_exception"

export enum EmbeddingStatusEnum {
  NEW                = "NEW",
  PROCESSED_NO_MATCH = "PROCESSED_NO_MATCH",
  PENDING_REVIEW     = "PENDING_REVIEW",
  AUTO_MERGED        = "AUTO_MERGED",
  PROCESSED = "PROCESSED",
}

export class EmbeddingStatus {

  readonly value: EmbeddingStatusEnum

  private constructor( value: EmbeddingStatusEnum ) {
    this.value = value
  }

  static create( value: EmbeddingStatusEnum ): EmbeddingStatus {
    return new EmbeddingStatus( value )
  }

  static from( value: string ): EmbeddingStatus {
    const result = z.enum( EmbeddingStatusEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidEmbeddingStatusException()
    }
    return new EmbeddingStatus( result.data )
  }

  static fromOrNull( value: string ): EmbeddingStatus | undefined {
    try {
      return EmbeddingStatus.from( value )
    }
    catch {
      return undefined
    }
  }
}
