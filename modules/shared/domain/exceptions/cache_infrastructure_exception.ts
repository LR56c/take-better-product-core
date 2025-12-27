import { InfrastructureException } from "./infrastructure_exception"

export class CacheInfrastructureException extends InfrastructureException {
  constructor( message?: string ) {
    super( "Cache infrastructure error" + ( message ? `: ${message}` : "" ) )
    this.name = "CacheInfrastructureException"
  }
}
