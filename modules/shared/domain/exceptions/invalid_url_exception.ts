import { BaseException } from "./base_exception"

export class InvalidURLException extends BaseException {
  constructor( message?: string )
  {
    super( "Invalid url" + ( message ? `: ${message}` : "" ) )
    this.name = "InvalidURLException"
  }
}

