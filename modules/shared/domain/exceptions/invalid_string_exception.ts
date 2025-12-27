import { DomainException } from "./domain_exception"

export class InvalidStringException extends DomainException {
  constructor( message?: string ) {
    super( "Invalid string" + ( message ? `: ${message}` : "" ) )
    this.name = "InvalidStringException"
  }
}

