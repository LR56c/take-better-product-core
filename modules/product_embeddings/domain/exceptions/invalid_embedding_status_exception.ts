import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidEmbeddingStatusException extends DomainException {
  constructor( message?: string ) {
    super( "Invalid embedding status" + ( message ? `: ${message}` : "" ) )
    this.name = "InvalidEmbeddingStatusException"
  }
}
