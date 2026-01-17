import { Either }        from "fp-ts/Either"
import { ValidString }   from "../../shared/domain/value_objects/valid_string"
import { BaseException } from "../../shared/domain/exceptions/base_exception"


export abstract class ProductEmbeddingAI {
  abstract generate( rawContent : ValidString ): Promise<Either<BaseException, number[]>>
}
