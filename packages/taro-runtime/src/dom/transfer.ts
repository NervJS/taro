import { TaroElement } from './element'

export class TransferElement extends TaroElement {
  public isTransferElement = true

  constructor (public dataName: string) {
    super()
  }

  public get _path () {
    return this.dataName
  }
}
