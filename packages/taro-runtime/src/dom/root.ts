import { TaroElement } from './element'
import { NodeType } from './node_types'
import { MpInstance } from '../render'
import { UpdatePayload } from './node'
import { isFunction, Shortcuts } from '@tarojs/shared'

export class TaroRootElement extends TaroElement {
  private pendingUpdate = false

  private updatePayloads: UpdatePayload[] = []

  public ctx: null | MpInstance = null

  public constructor () {
    super(NodeType.ELEMENT_NODE, 'root')
  }

  public get _path () {
    return 'root'
  }

  protected get _root () {
    return this
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
      const resetPaths = new Set<string>()
      while (this.updatePayloads.length > 0) {
        const { path, value } = this.updatePayloads.shift()!
        if (path.endsWith(Shortcuts.Childnodes)) {
          resetPaths.add(path)
        }
        data[path] = value
      }

      for (const path in data) {
        resetPaths.forEach(p => {
          // 已经重置了数组，就不需要分别再设置了
          if (path.includes(p) && path !== p) {
            delete data[path]
          }
        })

        const value = data[path]
        if (isFunction(value)) {
          data[path] = value()
        }
      }

      ctx.setData(data, () => {
        this.pendingUpdate = false
      })
    }, 1)
  }
}
