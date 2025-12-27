import { BaseException } from "./base_exception.js"

export class Errors {
  constructor( readonly values: BaseException[] ) {
  }
}
