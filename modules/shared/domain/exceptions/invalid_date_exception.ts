import { DomainException } from "./domain_exception"

export class InvalidDateException extends DomainException {
  constructor( message?: string ) {
    super( "Invalid date" + ( message ? `: ${message}` : "" ) )
    this.name = "InvalidDateException"
  }
}
