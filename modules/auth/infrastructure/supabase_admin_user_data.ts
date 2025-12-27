import { SupabaseClient }      from "@supabase/supabase-js"
import { Either, left, right } from "fp-ts/Either"
import { AuthAdminRepository } from "../domain/auth_admin_repository"
import {
  ValidString
}                              from "../../shared/domain/value_objects/valid_string"
import {
  InfrastructureException
}                              from "../../shared/domain/exceptions/infrastructure_exception"
import {
  BaseException
}                              from "../../shared/domain/exceptions/base_exception"
import { User }                from "../../user/domain/user"
import { Errors }              from "../../shared/domain/exceptions/errors"
import {
  Password
}                              from "../../shared/domain/value_objects/password"
import {
  Email
}                              from "../../shared/domain/value_objects/email"
import { AuthResponse }        from "../domain/auth_response"


export class SupabaseAdminUserData implements AuthAdminRepository {
  constructor( private readonly client: SupabaseClient ) {
  }

  async getById( id: ValidString ): Promise<Either<BaseException[], User>> {
    const { data, error } = await this.client.rpc( "get_user_by_id", {
      user_id: id.toString()
    } ).single()
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }
    const result = data as any
    const user   = this.parseUser( result, result.raw_user_meta_data )
    if ( user instanceof Errors ) {
      return left( user.values )
    }
    return right( user )
  }


  async remove( id: ValidString ): Promise<Either<BaseException, boolean>> {
    const { error } = await this.client.auth.admin.deleteUser( id.value )
    if ( error ) {
      return left( new InfrastructureException( error.message ) )
    }
    return right( true )
  }

  private parseUser( item: any, metadata: any ): Errors | User {
    return User.fromPrimitives(
      item.id,
      item.email,
      metadata.permission,
      metadata.username,
      item.created_at,
    )
  }


  async getByUsername( username: ValidString ): Promise<Either<BaseException[], User>> {
    const { data, error } = await this.client.rpc( "get_by_username", {
      p_username: username.value
    } ).single()
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }
    const metadata = (
      data as any
    ).raw_user_meta_data
    const user     = this.parseUser( data, metadata )
    if ( user instanceof Errors ) {
      return left( user.values )
    }
    return right( user )
  }


  async register( auth: User,
    password: Password,
  ): Promise<Either<BaseException[], AuthResponse>> {
    const { data, error } = await this.client.auth.admin.createUser( {
      email        : auth.email.value,
      password     : password.value,
      email_confirm: true,
      user_metadata: {
        username  : auth.username.value,
        permission: auth.role.value,
      }
    } )
    if ( error ) {
      console.log( "err", error )
      return left( [new InfrastructureException( error.message )] )
    }
    const user = this.parseUser( data.user, data.user.user_metadata )
    if ( user instanceof Errors ) {
      return left( user.values )
    }
    const {
            data : udata,
            error: uerror
          } = await this.client.auth.admin.generateLink( {
      type : "magiclink",
      email: auth.email.value
    } )

    if ( uerror ) {
      return left( [new InfrastructureException( uerror.message )] )
    }
    return right( {
      id   : user.id.toString(),
      token: udata!.properties.action_link
    } )
  }

  async update( auth: User ): Promise<Either<BaseException[], boolean>> {
    const { error } = await this.client.auth.admin.updateUserById(
      auth.id.toString(), {
        user_metadata: {
          permission: auth.role.value,
          username  : auth.username.value,
        }
      }
    )
    if ( error ) {
      console.log( "supabase update err", error )
      return left( [new InfrastructureException( error.message )] )
    }
    return right( true )
  }

  async getByEmail( email: Email ): Promise<Either<BaseException[], User>> {
    const { data, error } = await this.client.rpc( "get_by_email", {
      p_email: email.value
    } ).single()
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }
    const d    = data as any
    const user = this.parseUser( d.user, d.user.user_metadata )
    if ( user instanceof Errors ) {
      return left( user.values )
    }
    return right( user )
  }
}