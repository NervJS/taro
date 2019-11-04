import { TaroElement } from './element'
import { NodeType } from './node_types'
import { MpInstance } from '../render'
import { UpdatePayload } from './node'
import { isFunction } from '@tarojs/shared'

export class TaroRootElement extends TaroElement {
  private pendingUpdate = false

  private updatePayloads: UpdatePayload[] = []

  public ctx: null | MpInstance = null

  public constructor () {
    super(NodeType.ELEMENT_NODE, 'root')
    this._root = this
    this._path = 'root'
  }

  public enqueueUpdate (payload: UpdatePayload) {
    this.updatePayloads.push(payload)

    if (this.pendingUpdate || this.ctx === null) {
      return
    }

    this.performUpdate()
  }

  public performUpdate () {
    this.pendingUpdate = true
    const ctx = this.ctx!

    setTimeout(() => {
      const data = Object.create(null)
      while (this.updatePayloads.length > 0) {
        const { path, value } = this.updatePayloads.shift()!
        data[path] = isFunction(value) ? value() : value
      }

      ctx.setData(data, () => {
        this.pendingUpdate = false
      })
    }, 1)
  }
}
