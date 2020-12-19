import get from 'lodash-es/get'
import { TaroElement } from './element'
import { NodeType } from './node_types'
import { MpInstance, HydratedData } from '../hydrate'
import { UpdatePayload, UpdatePayloadValue } from './node'
import { isFunction, Shortcuts } from '@tarojs/shared'
import { perf } from '../perf'
import { SET_DATA, PAGE_INIT } from '../constants'
import { CurrentReconciler } from '../reconciler'
import { eventCenter } from '../emitter/emitter'
import { incrementId } from '../utils'

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
        const customWrapperUpdate: { ctx: any, data: object }[] = []
        const normalUpdate = {}
        if (!initRender) {
          for (const p in data) {
            const dataPathArr = p.split('.')
            let hasCustomWrapper = false
            for (let i = dataPathArr.length; i > 0; i--) {
              const allPath = dataPathArr.slice(0, i).join('.')
              const getData = get(ctx.__data__, allPath)
              if (getData && getData.nn && getData.nn === 'custom-wrapper') {
                const customWrapperId = getData.uid
                const customWrapper = ctx.selectComponent(`#${customWrapperId}`)
                const splitedPath = dataPathArr.slice(i).join('.')
                if (customWrapper) {
                  hasCustomWrapper = true
                  customWrapperUpdate.push({
                    ctx: ctx.selectComponent(`#${customWrapperId}`),
                    data: {
                      [`i.${splitedPath}`]: data[p]
                    }
                  })
                }
                break
              }
            }
            if (!hasCustomWrapper) {
              normalUpdate[p] = data[p]
            }
          }
        }
        const updateArrLen = customWrapperUpdate.length
        if (updateArrLen) {
          const eventId = `${this._path}_update_${incrementId()}`
          let executeTime = 0
          eventCenter.once(eventId, () => {
            executeTime++
            if (executeTime === updateArrLen + 1) {
              perf.stop(SET_DATA)
              if (!this.pendingFlush) {
                this.flushUpdateCallback()
              }
              if (initRender) {
                perf.stop(PAGE_INIT)
              }
            }
          }, eventCenter)
          customWrapperUpdate.forEach(item => {
            item.ctx.setData(item.data, () => {
              eventCenter.trigger(eventId)
            })
          })
          ctx.setData(normalUpdate, () => {
            eventCenter.trigger(eventId)
          })
        } else {
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
      }
    }, 0)
  }

  public enqueueUpdateCallback (cb: Function, ctx?: Record<string, any>) {
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
