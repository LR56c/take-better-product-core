import { DomainException } from "./domain_exception"

export class InvalidIntegerException extends DomainException {
  constructor( message?: string ) {
    super( "Invalid integer" + ( message ? `: ${message}` : "" ) )
    this.name = "InvalidIntegerException"
  }
}
