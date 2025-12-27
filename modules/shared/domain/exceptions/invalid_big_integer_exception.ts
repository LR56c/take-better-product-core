import { DomainException } from "./domain_exception"

export class InvalidBigIntegerException extends DomainException {
  constructor( message?: string ) {
    super( "Invalid big integer" + ( message ? `: ${message}` : "" ) )
    this.name = "InvalidBigIntegerException"
  }
}
