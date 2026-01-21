import { Either, left, right }  from "fp-ts/Either"
import OpenAI                   from "openai"
import { ProductEmbeddingAI }   from "../domain/product_embedding_ai"
import {
  ValidString
}                               from "../../shared/domain/value_objects/valid_string"
import {
  BaseException
}                               from "../../shared/domain/exceptions/base_exception"
import {
  InfrastructureException
} from "../../shared/domain/exceptions/infrastructure_exception"

export class OpenaiWorkerEmbeddingData implements ProductEmbeddingAI {
  constructor(
    private readonly ai: OpenAI
  )
  {
  }

  async generate( rawContent: ValidString ): Promise<Either<BaseException, number[]>> {
    try {
      const generateEmbedding = await this.ai.embeddings.create( {
        model: "text-embedding-3-small",
        input: rawContent.value
      } )
      return right( generateEmbedding.data[0].embedding )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}