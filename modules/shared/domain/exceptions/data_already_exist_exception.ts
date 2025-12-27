import { InfrastructureException } from "./infrastructure_exception"

export class DataAlreadyExistException extends InfrastructureException {
  constructor( message?: string ) {
    super( "Data already exist" + ( message ? `: ${message}` : "" ) )
    this.name = "DataAlreadyExistException"
  }
}
