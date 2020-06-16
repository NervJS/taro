import { TaroElement } from './element'
import { NodeType } from './node_types'
import { MpInstance, HydratedData } from '../hydrate'
import { UpdatePayload, UpdatePayloadValue } from './node'
import { isFunction, Shortcuts } from '@tarojs/shared'
import { perf } from '../perf'
import { SET_DATA, PAGE_INIT } from '../constants'
import { CurrentReconciler } from '../reconciler'

export class TaroRootElement extends TaroElement {
  private pendingUpdate = false

  private updatePayloads: UpdatePayload[] = []

  private pendingFlush = false

  private updateCallbacks: Function[]= []

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

  public performUpdate (initRender = false, prerender?: Function) {
    this.pendingUpdate = true
    const ctx = this.ctx!

    setTimeout(() => {
      perf.start(SET_DATA)
      const data: Record<string, UpdatePayloadValue | ReturnType<HydratedData>> = Object.create(null)
      const resetPaths = new Set<string>(
        initRender
          ? ['root.cn.[0]', 'root.cn[0]']
          : []
      )

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

      CurrentReconciler.prepareUpdateData?.(data, this)

      if (initRender) {
        CurrentReconciler.appendInitialPage?.(data, this)
      }

      if (isFunction(prerender)) {
        prerender(data)
      } else {
        this.pendingUpdate = false
        ctx.setData(data, () => {
          perf.stop(SET_DATA)
          if (!this.pendingFlush) {
            this.flushUpdateCallback()
          }
          if (initRender) {
            perf.stop(PAGE_INIT)
          }
        })
      }
    }, 0)
  }

  public enqueueUpdateCallbak (cb: Function, ctx?: Record<string, any>) {
    this.updateCallbacks.push(() => {
      ctx ? cb.call(ctx) : cb()
    })
  }

  public flushUpdateCallback () {
    this.pendingFlush = false
    const copies = this.updateCallbacks.slice(0)
    this.updateCallbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }
}
