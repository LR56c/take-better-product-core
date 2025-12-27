import { DomainException } from "./domain_exception"

export class InvalidImageException extends DomainException {
  constructor( message?: string ) {
    super( "Invalid image" + ( message ? `: ${message}` : "" ) )
    this.name = "InvalidImageException"
  }
}
