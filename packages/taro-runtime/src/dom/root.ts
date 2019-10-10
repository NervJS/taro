import { TaroElement } from './element'
import { NodeType } from './node_types'
import { MpInstance, hydrate } from '../render'

export class TaroRootElement extends TaroElement {
  private pendingUpdate = false

  public ctx: null | MpInstance = null

  public constructor () {
    super(NodeType.ELEMENT_NODE, 'root')
  }

  public performUpdate () {
    if (this.pendingUpdate || this.ctx === null) {
      return
    }

    this.pendingUpdate = true
    const ctx = this.ctx

    setTimeout(() => {
      ctx.setData(
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          root: hydrate(this as any)
        },
        () => {
          this.pendingUpdate = false
        }
      )
    }, 1)
  }
}
