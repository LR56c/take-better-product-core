import { StoreDAO }      from "../domain/store_dao"
import { AddStore }        from "./add_store"
import { RemoveStore }     from "./remove_store"
import { SearchStore }     from "./search_store"
import { UpdateStore }     from "./update_store"

export class StoreAppService {
  readonly addStore: AddStore
  readonly removeStore: RemoveStore
  readonly searchStore: SearchStore
  readonly updateStore: UpdateStore

  constructor( storeDAO: StoreDAO ) {
    this.addStore    = new AddStore( storeDAO )
    this.removeStore = new RemoveStore( storeDAO )
    this.searchStore = new SearchStore( storeDAO )
    this.updateStore = new UpdateStore( storeDAO )
  }
}
