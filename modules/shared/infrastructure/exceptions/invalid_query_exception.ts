import {
  InfrastructureException
} from "../../domain/exceptions/infrastructure_exception"

export class InvalidQueryException extends InfrastructureException {
  constructor( message?: string ) {
    super( "Invalid query" + ( message ? `: ${message}` : "" ) )
    this.name = "InvalidQueryException"
  }
}
