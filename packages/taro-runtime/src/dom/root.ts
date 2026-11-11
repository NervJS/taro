import { hooks, isArray, isFunction, isUndefined, Shortcuts } from '@tarojs/shared'

import {
  CUSTOM_WRAPPER,
  PAGE_INIT,
  ROOT_STR,
  SET_DATA
} from '../constants'
import { options } from '../options'
import { perf } from '../perf'
import { customWrapperCache, isComment } from '../utils'
import { TaroElement } from './element'

import type { HydratedData, MpInstance, TFunc, UpdatePayload, UpdatePayloadValue } from '../interface'

interface CustomWrapperInPath {
  node: TaroElement
  // CustomWrapper 节点在完整 dataPath 中的位置
  pathIndex: number
}

interface CustomWrapperUpdateTarget extends CustomWrapperInPath {
  ctx: Record<string, any>
  chainIndex: number
  relativePath: string
}

interface CustomWrapperPathInfo {
  wrapperChain: CustomWrapperInPath[]
  updateTarget?: CustomWrapperUpdateTarget
}

function isChildNodesPath (relativePath: string): boolean {
  return relativePath === Shortcuts.Childnodes || relativePath.startsWith(`${Shortcuts.Childnodes}.`)
}

function resolveCustomWrapperPath (root: TaroRootElement, dataPath: string[]): CustomWrapperPathInfo | undefined {
  let currentData: any = root
  let updateTarget: CustomWrapperUpdateTarget | undefined
  const wrapperChain: CustomWrapperInPath[] = []

  // 跳过 root，收集更新路径经过的每一层 CustomWrapper
  for (let pathIndex = 1; pathIndex < dataPath.length; pathIndex++) {
    const key = dataPath[pathIndex]
      // '[0]' => '0'
      .replace(/^\[(.+)\]$/, '$1')
      // 'cn' => 'childNodes'
      .replace(/\bcn\b/g, 'childNodes')

    currentData = currentData[key]

    if (isArray(currentData)) {
      currentData = currentData.filter(el => !isComment(el))
    }

    if (isUndefined(currentData)) break

    if (currentData.nodeName === CUSTOM_WRAPPER) {
      const wrapper = { node: currentData, pathIndex }
      const ctx = customWrapperCache.get(currentData.sid)
      const chainIndex = wrapperChain.length
      const relativePath = dataPath.slice(pathIndex + 1).join('.')
      wrapperChain.push(wrapper)

      // 持续覆盖更新目标，最终由路径中最深且实际持有此子节点数据的已 attached CustomWrapper 执行 setData
      if (ctx && isChildNodesPath(relativePath)) {
        updateTarget = { ...wrapper, ctx, chainIndex, relativePath }
      }
    }
  }

  if (!wrapperChain.length) return

  return { wrapperChain, updateTarget }
}

export class TaroRootElement extends TaroElement {
  private updatePayloads: UpdatePayload[] = []

  private updateCallbacks: TFunc[] = []

  public pendingUpdate = false

  public updateBatchId = 0

  public ctx: null | MpInstance = null

  public nearestCtxEpoch = 0

  public constructor () {
    super()
    this.nodeName = ROOT_STR
    this.tagName = ROOT_STR.toUpperCase()
  }

  public get _path (): string {
    return ROOT_STR
  }

  public get _root (): TaroRootElement {
    return this
  }

  public bumpNearestCtxEpoch () {
    this.nearestCtxEpoch++
  }

  public scheduleTask(fn: TFunc) {
    // 这里若使用微任务可略微提前setData的执行时机，但在部分场景下可能会出现连续setData两次，造成更大的性能问题
    setTimeout(fn)
  }

  public enqueueUpdate(payload: UpdatePayload): void {
    // 入队时保存受影响的 CustomWrapper 节点引用，避免执行前列表结构变化导致旧路径指向其他节点。
    // 执行批次时通过这些引用更新节点批次号，确保新内容携带对应的新版本。
    const customWrapperNodes = (() => {
      const dataPath = payload.path.split('.')

      const { wrapperChain = [] } = resolveCustomWrapperPath(this, dataPath) || {}

      const includesWrapper = wrapperChain.filter((wrapper) => {
        const relativePath = dataPath.slice(wrapper.pathIndex + 1).join('.')
        // 空路径表示更新整个 Wrapper，cn 路径表示更新其子节点；两者都需要更新批次号。
        // Wrapper 自身属性的更新不在其内部渲染数据域中，不在这里推进批次号。
        return relativePath === '' || isChildNodesPath(relativePath)
      })

      return includesWrapper.map((wrapper) => wrapper.node)
    })()

    this.updatePayloads.push({ ...payload, customWrapperNodes })

    if (!this.pendingUpdate && this.ctx) {
      this.performUpdate()
    }
  }

  public performUpdate (initRender = false, prerender?: TFunc) {
    this.pendingUpdate = true

    const ctx = hooks.call('proxyToRaw', this.ctx)!

    this.scheduleTask(() => {
      const updateBatchId = ++this.updateBatchId
      const setDataMark = `${SET_DATA} 开始时间戳 ${Date.now()}`
      perf.start(setDataMark)
      const data: Record<string, UpdatePayloadValue | ReturnType<HydratedData>> = Object.create(null)
      const resetPaths = new Set<string>(initRender ? ['root.cn.[0]', 'root.cn[0]'] : [])

      while (this.updatePayloads.length > 0) {
        const { path, value, customWrapperNodes } = this.updatePayloads.shift()!
        customWrapperNodes?.forEach((node) => {
          if (node._root !== this) return
          node.updateBatchId = updateBatchId
        })
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

      // 预渲染
      if (isFunction(prerender)) return prerender(data)

      // 正常渲染
      this.pendingUpdate = false
      let normalUpdate = {}
      const customWrapperUpdates: Map<Record<any, any>, Record<string, any>> = new Map()

      if (initRender) {
        // 初次渲染，使用页面级别的 setData
        normalUpdate = data
      } else {
        // 更新渲染，区分 CustomWrapper 与页面级别的 setData
        for (const p in data) {
          const dataPath = p.split('.')
          const pathInfo = resolveCustomWrapperPath(this, dataPath)
          if (pathInfo?.updateTarget) {
            // 此项数据使用 CustomWrapper 去更新
            const { updateTarget, wrapperChain } = pathInfo
            const { ctx: customWrapper, relativePath } = updateTarget
            const update: Record<string, any> = {
              ...(customWrapperUpdates.get(customWrapper) || {}),
              [`rd.${relativePath}`]: data[p],
              'rd.ubid': updateTarget.node.updateBatchId
            }

            // 未 attached 的内层 CustomWrapper 会通过当前更新目标接收数据。
            // 只有更新进入其子节点数据域时，才需要传递对应的批次号。
            wrapperChain.slice(updateTarget.chainIndex + 1).forEach((nestedWrapper) => {
              const nestedRelativePath = dataPath.slice(nestedWrapper.pathIndex + 1).join('.')

              if (!isChildNodesPath(nestedRelativePath)) return

              const nestedWrapperPath = dataPath.slice(updateTarget.pathIndex + 1, nestedWrapper.pathIndex + 1).join('.')

              update[`rd.${nestedWrapperPath}.ubid`] = nestedWrapper.node.updateBatchId
            })

            // 合并同一个 customWrapper 的相关更新到一次 setData 中
            customWrapperUpdates.set(customWrapper, update)
          } else {
            // 此项数据使用页面去更新
            normalUpdate[p] = data[p]
            pathInfo?.wrapperChain.forEach((wrapper) => {
              const relativePath = dataPath.slice(wrapper.pathIndex + 1).join('.')

              if (!isChildNodesPath(relativePath)) return

              normalUpdate[`${wrapper.node._path}.ubid`] = wrapper.node.updateBatchId
            })
          }
        }
      }

      const customWrapperCount = customWrapperUpdates.size
      const isNeedNormalUpdate = Object.keys(normalUpdate).length > 0
      const updateArrLen = customWrapperCount + (isNeedNormalUpdate ? 1 : 0)
      let executeTime = 0

      const cb = () => {
        if (++executeTime === updateArrLen) {
          perf.stop(setDataMark)
          this.flushUpdateCallback()
          initRender && perf.stop(PAGE_INIT)
        }
      }

      // custom-wrapper setData
      if (customWrapperCount) {
        customWrapperUpdates.forEach((data, ctx) => {
          if (process.env.NODE_ENV !== 'production' && options.debug) {
            // eslint-disable-next-line no-console
            console.log('custom wrapper setData: ', data)
          }
          ctx.setData(data, cb)
        })
      }

      // page setData
      if (isNeedNormalUpdate) {
        if (process.env.NODE_ENV !== 'production' && options.debug) {
          // eslint-disable-next-line no-console
          console.log('page setData:', normalUpdate)
        }
        ctx.setData(normalUpdate, cb)
      }
    })
  }

  public enqueueUpdateCallback (cb: TFunc, ctx?: Record<string, any>) {
    this.updateCallbacks.push(() => {
      ctx ? cb.call(ctx) : cb()
    })
  }

  public flushUpdateCallback () {
    const updateCallbacks = this.updateCallbacks
    if (!updateCallbacks.length) return

    const copies = updateCallbacks.slice(0)
    this.updateCallbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }
}
