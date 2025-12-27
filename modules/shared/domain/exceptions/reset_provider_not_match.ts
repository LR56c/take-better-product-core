import { InfrastructureException } from "./infrastructure_exception"

export class ResetProviderNotMatch extends InfrastructureException {
  constructor( message?: string ) {
    super( "Invalid provider" + ( message ? `: ${message}` : "" ) )
    this.name = "ResetProviderNotMatch"
  }
}
