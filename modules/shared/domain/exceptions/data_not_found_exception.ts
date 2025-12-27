import { InfrastructureException } from "./infrastructure_exception"

export class DataNotFoundException extends InfrastructureException {
  constructor( message?: string ) {
    super( "Data not found" + ( message ? `: ${message}` : "" ) )
    this.name = "DataNotFoundException"
  }
}
