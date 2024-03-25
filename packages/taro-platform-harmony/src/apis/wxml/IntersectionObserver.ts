import { Current, disconnectEvent, findChildNodeWithDFS, getPageScrollerOrNode, setNodeEventCallbackAndTriggerComponentUpdate, TaroElement, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import { temporarilyNotSupport } from '../utils'

import type Taro from '@tarojs/taro/types'

export class IntersectionObserver implements Taro.IntersectionObserver {
  // 自定义组件实例
  private _component: any
  // 监听的nodes
  private _observerNodes: TaroElement[] | TaroElement | null
  // 选项
  private _options = {
    thresholds: [0],
    initialRatio: 0,
    observeAll: false
  }

  constructor(component: any, options: Taro.createIntersectionObserver.Option = {}) {
    const taro = (Current as any).taro
    const page = taro.getCurrentInstance().page

    this._component = component || getPageScrollerOrNode(page?.node, page)
    Object.assign(this._options, options)
  }

  public disconnect (): void {
    if (this._observerNodes && this._component) {
      if (this._observerNodes instanceof Array) {
        this._observerNodes.forEach((n: TaroElement & any) => {
          disconnectEvent(n, VISIBLE_CHANGE_EVENT_NAME)
          // @ts-ignore
          n._nodeInfo.thresholds = null
        })
      } else {
        disconnectEvent(this._observerNodes, VISIBLE_CHANGE_EVENT_NAME)
        // @ts-ignore
        if (this._observerNodes._nodeInfo) {
          // @ts-ignore
          this._observerNodes._nodeInfo.thresholds = null
        }
      }
    }
  }

  public observe (targetSelector: string, callback: Taro.IntersectionObserver.ObserveCallback): void {
    if (!this._component) return

    const { observeAll, thresholds } = this._options
    const node = findChildNodeWithDFS(this._component, targetSelector, observeAll)
    this._observerNodes = node

    if (node) {
      if (node instanceof Array) {
        node.forEach(n => {
          // @ts-ignore
          n._nodeInfo.thresholds = thresholds

          setNodeEventCallbackAndTriggerComponentUpdate(n, VISIBLE_CHANGE_EVENT_NAME, (isVisible: boolean, currentRatio: number) => {
            callback(this.handleResult(isVisible, currentRatio, n))
          })
        })
      } else {
        // @ts-ignore
        node._nodeInfo.thresholds = thresholds

        setNodeEventCallbackAndTriggerComponentUpdate(node, VISIBLE_CHANGE_EVENT_NAME, (isVisible: boolean, currentRatio: number) => {
          callback(this.handleResult(isVisible, currentRatio, node))
        })
      }
    } else {
      callback({
        errMsg: 'IntersectionObserver.observe:fail cannot find the node for selector.'
      })
    }
  }

  public relativeTo (): Taro.IntersectionObserver {
    temporarilyNotSupport('relativeTo')()
    return this
  }

  public relativeToViewport (): Taro.IntersectionObserver {
    temporarilyNotSupport('relativeToViewport')()
    return this
  }

  // @ts-ignore
  private handleResult (isVisible: boolean, currentRatio: number, node: TaroElement): Taro.IntersectionObserver.ObserveCallbackResult {
    const result = {
      id: node.id,
      dataset: node.dataset,
      intersectionRatio: currentRatio,
      // TODO 未做，等待能拿到element的info信息
      boundingClientRect: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: 0,
        width: 0
      },
      // TODO 未做，等待能拿到element和监听_component的info信息做运算
      intersectionRect: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: 0,
        width: 0
      },
      // TODO 未做，等待能拿到element和监听_component的info信息做运算
      relativeRect: { left: 0, right: 0, top: 0, bottom: 0 },
      time: new Date().getTime()
    }
    return result
  }
}
