import { DomainException } from "./domain_exception"

export class InvalidBooleanException extends DomainException {
  constructor( message?: string ) {
    super( "Invalid boolean" + ( message ? `: ${message}` : "" ) )
    this.name = "InvalidBooleanException"
  }
}
