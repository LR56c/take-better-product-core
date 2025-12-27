import { BaseException } from "./base_exception"

export class InfrastructureException extends BaseException {
  constructor( message?: string ) {
    super( "Infrastructure error" + ( message ? `: ${message}` : "" ) )
    this.name = "InfrastructureException"
  }
}
