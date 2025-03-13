import { Current, document, TaroElement } from '@tarojs/runtime'

import { temporarilyNotSupport } from '../utils'

export class IntersectionObserver {
  // 自定义组件实例
  private _component: any
  // 监听的nodes
  private _observerNodes: TaroElement[] | TaroElement | null
  // 选项
  private _timer

  _options = {
    thresholds: [0],
    initialRatio: 0,
    observeAll: false,
  }

  _viewportMargins = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }

  constructor(component, options = {}) {
    const taro = Current.taro
    const page = taro.getCurrentInstance().page

    // 兼容小程序原本的 getCurrentInstance()?.page 的写法
    if (component && component.page === page && component.node) {
      this._component = component.node
    } else {
      this._component = component || page?.getPageElement()
    }

    Object.assign(this._options, options)
  }

  disconnect () {
    if (this._observerNodes && this._component) {
      if (this._observerNodes instanceof Array) {
        this._observerNodes.forEach((n) => {
          nativeUIManager.disconnectObserve(n)
        })
      } else {
        nativeUIManager.disconnectObserve(this._observerNodes)
      }

      if (this._timer) {
        clearTimeout(this._timer)
      }

      this._observerNodes = null
    }
  }

  observe (targetSelector, callback) {
    if (!this._component) return

    const { observeAll, thresholds, initialRatio } = this._options
    const querySelectName = observeAll ? 'querySelectorAll' : 'querySelector'
    const isComponentHaveSelectFunction = !!this._component[querySelectName]
    const querySelector = isComponentHaveSelectFunction ? this._component[querySelectName].bind(this._component) : document[querySelectName].bind(document)
    const node = querySelector(targetSelector)
    this._observerNodes = node

    if (!node) {
      callback({
        errMsg: 'IntersectionObserver.observe:fail cannot find the node for selector.'
      })
      return
    }

    const list = node instanceof Array ? node : [node]
    list.forEach((item) => {
      nativeUIManager.createObserve(item, this._viewportMargins, thresholds, initialRatio, (data) => {
        this._timer = setTimeout(() => {
          callback({
            id: item.id,
            dataset: item.dataset,
            time: new Date().getTime(),
            ...data
          })
        }, 20)
      })
    })
  }

  relativeTo () {
    temporarilyNotSupport('relativeTo')()
    return this
  }

  relativeToViewport (option) {
    this._viewportMargins = Object.assign(this._viewportMargins, option)

    return this
  }
}
