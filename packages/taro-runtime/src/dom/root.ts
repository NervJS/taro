import { inject, injectable } from 'inversify'
import { isFunction, Shortcuts } from '@tarojs/shared'
import get from 'lodash-es/get'
import SERVICE_IDENTIFIER from '../constants/identifiers'
import { TaroElement } from './element'
import { incrementId } from '../utils'
import { perf } from '../perf'
import { options } from '../options'
import {
  SET_DATA,
  PAGE_INIT,
  ROOT_STR,
  CUSTOM_WRAPPER
} from '../constants'

import type { Func, UpdatePayload, UpdatePayloadValue, InstanceNamedFactory, MpInstance, HydratedData } from '../interface'
import type { TaroNodeImpl } from '../dom-external/node-impl'
import type { TaroElementImpl } from '../dom-external/element-impl'
import type { Hooks } from '../hooks'
import type { Events } from '../emitter/emitter'

const eventIncrementId = incrementId()

@injectable()
export class TaroRootElement extends TaroElement {
  private pendingUpdate = false
  private pendingFlush = false
  private updatePayloads: UpdatePayload[] = []
  private updateCallbacks: Func[]= []
  private eventCenter: Events
  public ctx: null | MpInstance = null

  public constructor (// eslint-disable-next-line @typescript-eslint/indent
    @inject(SERVICE_IDENTIFIER.TaroNodeImpl) nodeImpl: TaroNodeImpl,
    @inject(SERVICE_IDENTIFIER.TaroElementFactory) getElement: InstanceNamedFactory,
    @inject(SERVICE_IDENTIFIER.Hooks) hooks: Hooks,
    @inject(SERVICE_IDENTIFIER.TaroElementImpl) elementImpl: TaroElementImpl,
    @inject(SERVICE_IDENTIFIER.eventCenter) eventCenter: Events
  ) {
    super(nodeImpl, getElement, hooks, elementImpl)
    this.nodeName = ROOT_STR
    this.eventCenter = eventCenter
  }

  public get _path (): string {
    return ROOT_STR
  }

  protected get _root (): TaroRootElement {
    return this
  }

  public enqueueUpdate (payload: UpdatePayload): void {
    this.updatePayloads.push(payload)

    if (!this.pendingUpdate && this.ctx !== null) {
      this.performUpdate()
    }
  }

  public performUpdate (initRender = false, prerender?: Func) {
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

      if (isFunction(prerender)) {
        prerender(data)
      } else {
        this.pendingUpdate = false
        const customWrapperUpdate: { ctx: any, data: Record<string, any> }[] = []
        const normalUpdate = {}
        if (!initRender) {
          for (const p in data) {
            const dataPathArr = p.split('.')
            let hasCustomWrapper = false
            for (let i = dataPathArr.length; i > 0; i--) {
              const allPath = dataPathArr.slice(0, i).join('.')
              const getData = get(ctx.__data__ || ctx.data, allPath)
              if (getData && getData.nn && getData.nn === CUSTOM_WRAPPER) {
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
          const eventId = `${this._path}_update_${eventIncrementId()}`
          const eventCenter = this.eventCenter
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
            if (process.env.NODE_ENV !== 'production' && options.debug) {
              // eslint-disable-next-line no-console
              console.log('custom wrapper setData: ', item.data)
            }
            item.ctx.setData(item.data, () => {
              eventCenter.trigger(eventId)
            })
          })
          if (Object.keys(normalUpdate).length) {
            if (process.env.NODE_ENV !== 'production' && options.debug) {
              // eslint-disable-next-line no-console
              console.log('setData:', normalUpdate)
            }
            ctx.setData(normalUpdate, () => {
              eventCenter.trigger(eventId)
            })
          }
        } else {
          if (process.env.NODE_ENV !== 'production' && options.debug) {
            // eslint-disable-next-line no-console
            console.log('setData:', data)
          }
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

  public enqueueUpdateCallback (cb: Func, ctx?: Record<string, any>) {
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
