import { DomainException } from "./domain_exception"

export class UnknownException extends DomainException {
  constructor( message?: string ) {
    super( "Unknown error" + ( message ? `: ${message}` : "" ) )
    this.name = "UnknownException"
  }
}
