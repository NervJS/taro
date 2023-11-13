// @ts-nocheck
import Taro from '@tarojs/api'
import { Current, disconnectEvent, setNodeEventCallbackAndTriggerComponentUpdate, TaroElement, VISIBLE_CHANGE_EVENT_NAME } from '@tarojs/runtime'

import { findChildNodeWithDFS, unsupport } from '../utils'

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
    const currentPage = (page.node instanceof Array) ? page.node[page.currentIndex] : page.node
    this._component = component || currentPage
    Object.assign(this._options, options)
  }

  public disconnect (): void {
    if (this._observerNodes) {
      if (this._observerNodes instanceof Array) {
        this._observerNodes.forEach((n: TaroElement & any) => {
          disconnectEvent(n, VISIBLE_CHANGE_EVENT_NAME)
          if (n._instance) {
            n._instance.thresholds = null
          }
        })
      } else {
        disconnectEvent(this._observerNodes, VISIBLE_CHANGE_EVENT_NAME)
        // @ts-ignore
        if (this._observerNodes._instance) {
          // @ts-ignore
          this._observerNodes._instance.thresholds = null
        }
      }
    }
  }

  public observe (targetSelector: string, callback: Taro.IntersectionObserver.ObserveCallback): void {
    const { observeAll, thresholds } = this._options
    const node = findChildNodeWithDFS(this._component, targetSelector, observeAll)
    this._observerNodes = node


    if (node) {
      if (node instanceof Array) {
        node.forEach(n => {
          // @ts-ignore
          n.awaitAppear.then(() => {
            // @ts-ignore
            n._instance?.thresholds = thresholds

            setNodeEventCallbackAndTriggerComponentUpdate(n, VISIBLE_CHANGE_EVENT_NAME, (isVisible: boolean, currentRatio: number) => {
              callback(this.handleResult(isVisible, currentRatio))
            })
          })
        })
      } else {
        // @ts-ignore
        node.awaitAppear.then(() => {
          // @ts-ignore
          node._instance?.thresholds = thresholds

          setNodeEventCallbackAndTriggerComponentUpdate(node, VISIBLE_CHANGE_EVENT_NAME, (isVisible: boolean, currentRatio: number) => {
            callback(this.handleResult(isVisible, currentRatio))
          })
        })
      }
    }
  }

  public relativeTo (): Taro.IntersectionObserver {
    process.env.NODE_ENV !== 'production' && unsupport('relativeTo')
    return this
  }

  public relativeToViewport (): Taro.IntersectionObserver {
    process.env.NODE_ENV !== 'production' && unsupport('relativeToViewport')
    return this
  }

  // @ts-ignore
  private handleResult (isVisible: boolean, currentRatio: number): Taro.IntersectionObserver.ObserveCallbackResult {
    const result = {
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
