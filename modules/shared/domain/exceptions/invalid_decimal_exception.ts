import { DomainException } from "./domain_exception"

export class InvalidDecimalException extends DomainException {
  constructor( message?: string ) {
    super( "Invalid decimal" + ( message ? `: ${message}` : "" ) )
    this.name = "InvalidDecimalException"
  }
}
