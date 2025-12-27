import { InfrastructureException } from "./infrastructure_exception"

export class DataNotMatchException extends InfrastructureException {
  constructor( message?: string ) {
    super( "Data not match" + ( message ? `: ${message}` : "" ) )
    this.name = "DataNotMatchException"
  }
}
