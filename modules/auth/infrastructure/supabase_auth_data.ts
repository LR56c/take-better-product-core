import { AuthRepository }      from "../domain/auth_repository"
import { LoginRequest }        from "../domain/login_request"
import { AuthResponse }        from "../domain/auth_response"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "../../shared/domain/exceptions/base_exception"
import {
  InfrastructureException
}                              from "../../shared/domain/exceptions/infrastructure_exception"
import { SupabaseClient }      from "@supabase/supabase-js"
import { PasswordDTO }         from "../../shared/domain/value_objects/password"
import { UserResponse }        from "../../user/application/user_response"

export class SupabaseAuthData implements AuthRepository {

  constructor( private readonly client: SupabaseClient ) {
  }

  async register( dto: UserResponse, password: PasswordDTO ): Promise<Either<BaseException, AuthResponse>> {
    const {data, error} = await this.client.auth.signUp({
      email   : dto.email,
      password: password,
      options:{
        data:{
          username: dto.username,
          permission: 'user',
        }
      }
    })
    if ( error ) {
      console.log("register err", error)
      return left( new InfrastructureException() )
    }
    return right( {
      id: data.user!.id,
      token: data.session!.access_token
    } )
  }
  async login( dto: LoginRequest ): Promise<Either<BaseException, AuthResponse>> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword( {
        email   : dto.email,
        password: dto.password
      } )
      if ( error ) {
        console.log( "login err", error )
        return left( new InfrastructureException() )
      }
      return right( {
        id   : data.user.id,
        token: data.session.access_token
      } )
    }
    catch ( e ) {
      console.log( "login err catch", e )
      return left( new InfrastructureException() )
    }
  }

}