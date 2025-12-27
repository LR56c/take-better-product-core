import { BaseException } from "./base_exception"


export abstract class InvalidPasswordException extends BaseException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidPasswordException"
  }
}

export class PasswordInsufficientLowercaseException
  extends InvalidPasswordException {
  constructor( message?: string ) {
    super( message )
    this.name = "PasswordInsufficientLowercaseException"
  }
}

export class PasswordInsufficientUppercaseException
  extends InvalidPasswordException {
  constructor( message?: string ) {
    super( "Password does not contain enough uppercase characters" + ( message ? `: ${message}` : "" ) )
    this.name = "PasswordInsufficientUppercaseException"
  }
}

export class PasswordInsufficientNumberException
  extends InvalidPasswordException {
  constructor( message?: string ) {
    super( "Password does not contain enough numeric characters" + ( message ? `: ${message}` : "" ) )
    this.name = "PasswordInsufficientNumberException"
  }
}

export class PasswordInsufficientCharacterException
  extends InvalidPasswordException {
  constructor( message?: string ) {
    super( "Password does not contain enough special characters" + ( message ? `: ${message}` : "" ) )
    this.name = "PasswordInsufficientCharacterException"
  }
}

export class PasswordInsufficientLengthException
  extends InvalidPasswordException {
  constructor( message?: string ) {
    super( "Password does not meet minimum length requirements" + ( message ? `: ${message}` : "" ) )
    this.name = "PasswordInsufficientLengthException"
  }
}
