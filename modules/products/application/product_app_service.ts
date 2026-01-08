import { ProductDAO }        from "../domain/product_dao"
import { AddProduct }          from "./add_product"
import { RemoveProduct }       from "./remove_product"
import { SearchProduct }       from "./search_product"
import { UpdateProduct }       from "./update_product"
import { UpsertProduct }       from "./upsert_product"

export class ProductAppService {
  readonly addProduct: AddProduct
  readonly removeProduct: RemoveProduct
  readonly searchProduct: SearchProduct
  readonly updateProduct: UpdateProduct
  readonly upsertProduct: UpsertProduct

  constructor( productDAO: ProductDAO ) {
    this.addProduct    = new AddProduct( productDAO )
    this.removeProduct = new RemoveProduct( productDAO )
    this.searchProduct = new SearchProduct( productDAO )
    this.updateProduct = new UpdateProduct( productDAO )
    this.upsertProduct = new UpsertProduct( productDAO )
  }
}
