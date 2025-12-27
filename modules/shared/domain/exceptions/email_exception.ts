import { DomainException } from "./domain_exception"

export class EmailException extends DomainException {
  constructor( message?: string ) {
    super( "Email error" + ( message ? `: ${message}` : "" ) )
    this.name = "EmailException"
  }
}
