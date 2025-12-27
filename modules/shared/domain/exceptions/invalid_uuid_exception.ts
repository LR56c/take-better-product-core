import { DomainException } from "./domain_exception"

export class InvalidUUIDException extends DomainException {
  constructor( message?: string ) {
    super( "Invalid uuid" + ( message ? `: ${message}` : "" ) )
    this.name = "InvalidUUIDException"
  }
}
