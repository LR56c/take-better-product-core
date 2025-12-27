import { BaseException } from "./base_exception"

export class DomainException extends BaseException {
  constructor( message?: string ) {
    super( "Domain error" + ( message ? `: ${message}` : "" ) )
    this.name = "DomainException"
  }
}
