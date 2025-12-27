import { Either }        from "fp-ts/Either"
import { BaseException } from "../../shared/domain/exceptions/base_exception"

export abstract class JWTRepository {
  abstract verify( token : string ): Promise<Either<BaseException, any>>
}
