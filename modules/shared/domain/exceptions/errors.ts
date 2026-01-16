import { BaseException } from "./base_exception"

export class Errors {
  constructor( readonly values: BaseException[] ) {
  }
}
