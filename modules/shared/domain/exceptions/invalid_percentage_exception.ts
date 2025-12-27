import { BaseException } from "./base_exception"

export class InvalidPercentageException extends BaseException {
  constructor( message?: string )
  {
    super( "Invalid percentage" + ( message ? `: ${message}` : "" ) )
    this.name = "InvalidPercentageException"
  }
}
