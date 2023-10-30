import Taro from '@tarojs/api'
import { Current, TaroElement } from '@tarojs/runtime'

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
        this._observerNodes.forEach(n => {
          // @ts-ignore
          n.instance?.visableChange = null
          // TODO：若不清除，则ets其实还是会监听，但是在业务层面，不会触发回调
          // n.instance?.thresholds = []
        })
      } else {
        // @ts-ignore
        this._observerNodes.instance?.visableChange = null
        // TODO：若不清除，则ets其实还是会监听，但是在业务层面，不会触发回调
        // this._observerNodes.instance?.thresholds = []
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
            n.instance?.visableChange = (isVisible: boolean, currentRatio: number) => {
              callback(this.handleResult(isVisible, currentRatio))
            }
            // @ts-ignore
            n.instance?.thresholds = thresholds
          })
        })
      } else {
        // @ts-ignore
        node.awaitAppear.then(() => {
          // @ts-ignore
          node.instance?.visableChange = (isVisible: boolean, currentRatio: number) => {
            callback(this.handleResult(isVisible, currentRatio))
          }
          // @ts-ignore
          node.instance?.thresholds = thresholds
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
