import Taro from '@tarojs/api'
import { Current } from '@tarojs/runtime'

import { findDOM } from '../../utils'

type TElement = Document | HTMLElement | Element

type TListener = {
  element: Element
  callback: Taro.IntersectionObserver.ObserveCallback
}

export class TaroH5IntersectionObserver implements Taro.IntersectionObserver {
  // 自定义组件实例
  private _component: TaroGeneral.IAnyObject
  // 选项
  private _options = {
    thresholds: [0],
    initialRatio: 0,
    observeAll: false
  }

  // Observer实例
  private _observerInst?: IntersectionObserver
  // 监控中的选择器
  private _listeners: TListener[] = []
  // 参照区域
  private _root: Element | null
  // 用来扩展（或收缩）参照节点布局区域的边界
  private _rootMargin: Taro.IntersectionObserver.RelativeToViewportMargins = {}
  // 是否已初始化
  private _isInited = false

  // selector 的容器节点
  protected get container () {
    const container: TElement = (
      this._component !== null
        ? (findDOM(this._component) as HTMLElement || document)
        : document
    )
    return container
  }

  constructor (component: TaroGeneral.IAnyObject, options: Taro.createIntersectionObserver.Option = {}) {
    this._component = component
    Object.assign(this._options, options)
  }

  private createInst () {
    // 去除原本的实例
    this.disconnect()

    const { left = 0, top = 0, bottom = 0, right = 0 } = this._rootMargin
    return new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const _callback = this._getCallbackByElement(entry.target)
        const target = entry.target as HTMLElement
        const result = {
          boundingClientRect: entry.boundingClientRect,
          intersectionRatio: entry.intersectionRatio,
          intersectionRect: entry.intersectionRect,
          relativeRect: entry.rootBounds || { left: 0, right: 0, top: 0, bottom: 0 },
          // 使用时间戳而不是entry.time，跟微信小程序一致
          time: Date.now(),
          id: target.id || undefined,
          dataset: 'dataset' in target ? target.dataset : undefined,
        }
        // web端会默认首次触发
        if (!this._isInited) {
          // 初始的相交比例，如果调用时检测到的相交比例与这个值不相等且达到阈值，则会触发一次监听器的回调函数。
          const [min, max] = [Math.min(this._options.initialRatio, entry.intersectionRatio), Math.max(this._options.initialRatio, entry.intersectionRatio)]
          if (this._options.initialRatio === entry.intersectionRatio || !this._options.thresholds.some(value => value >= min && value <= max)) {
            return
          }
        }
        _callback && _callback.call(this, result)
      })
      this._isInited = true
    }, {
      root: this._root,
      rootMargin: [`${top}px`, `${right}px`, `${bottom}px`, `${left}px`].join(' '),
      threshold: this._options.thresholds
    })
  }

  public disconnect (): void {
    if (this._observerInst) {
      let listener
      while ((listener = this._listeners.pop())) {
        this._observerInst.unobserve(listener.element)
      }
      this._observerInst.disconnect()
      // 置空，防止 disconnect 后 pending 的 observe 回调复活观察（原生 IO 允许 disconnect 后再次 observe）
      this._observerInst = undefined
      this._isInited = false
    }
  }

  public observe (targetSelector: string, callback: Taro.IntersectionObserver.ObserveCallback): void {
    // 同wx小程序效果一致，每个实例监听一个Selector
    if (this._listeners.length) return
    // 监听前没有设置关联的节点
    if (!this._observerInst) {
      console.warn('Intersection observer will be ignored because no relative nodes are found.')
      return
    }

    Taro.nextTick(() => {
      // 已 disconnect（或 relativeTo 重建）时不再观察
      if (!this._observerInst || this._listeners.length) return

      const container = this.container
      const nodeList: (Element | null)[] = this._options.observeAll
        ? Array.from(container.querySelectorAll(targetSelector))
        : [container.querySelector(targetSelector)]

      // 特殊处理 - 选自己（同 SelectorQuery，querySelector 只查后代、不含容器自身）
      if (container !== document) {
        const $nodeList = container.parentNode?.querySelectorAll(targetSelector)
        if ($nodeList) {
          for (let i = 0, len = $nodeList.length; i < len; ++i) {
            if (container === $nodeList[i]) {
              nodeList.push(container as Element)
              break
            }
          }
        }
      }

      // 查询时机已推迟到下一 tick，仍可能查不到（懒渲染等），或节点已脱离文档（页面被切走）
      const elements = nodeList.filter((element): element is Element => !!element && document.contains(element))
      if (!elements.length) {
        console.warn(`IntersectionObserver.observe:fail cannot find the node for selector "${targetSelector}"`)
        return
      }
      elements.forEach(element => {
        this._observerInst?.observe(element)
        this._listeners.push({ element, callback })
      })
    })
  }

  public relativeTo (selector: string, margins?: Taro.IntersectionObserver.RelativeToMargins | undefined): Taro.IntersectionObserver {
    // 已设置observe监听后，重新关联节点
    if (this._listeners.length) {
      console.error('Relative nodes cannot be added after "observe" call in IntersectionObserver')
      return this
    }
    const root = this.container.querySelector(selector)
    if (!root) {
      console.warn(`IntersectionObserver.relativeTo:fail cannot find the node for selector "${selector}"`)
    }
    this._root = root || null
    if (margins) {
      this._rootMargin = margins
    }
    this._observerInst = this.createInst()
    return this
  }

  public relativeToViewport (margins?: Taro.IntersectionObserver.RelativeToViewportMargins | undefined): Taro.IntersectionObserver {
    // 已设置observe监听后，重新关联节点
    if (this._listeners.length) {
      console.error('Relative nodes cannot be added after "observe" call in IntersectionObserver')
      return this
    }

    // 微信小程序语义：参照「页面显示区域」。
    // 默认（容器滚动）模式参照当前页 .taro_page；usingWindowScroll 下 .taro_page 不是滚动容器，
    // 参照节点与目标随文档同滚、相交比永不变化，必须参照浏览器视口（root 为 null）。
    // 注意直接用 document 级查询：旧实现 relativeTo('.taro_page') 在 container 作用域内查，
    // 多页栈时会命中首个已隐藏的 .taro_page（旧页不卸载、display:none），导致恒不可见。
    const id = Current.page?.path?.replace(/([^a-z0-9\u00a0-\uffff_-])/ig, '\\$1')
    let pageEl: Element | null = id ? document.querySelector(`.taro_page#${id}`) : null
    if (!pageEl) {
      // 当前页 = 最后一个非 shade 的已 show 页面（旧页保留 taro_page_show，被切走时追加 taro_page_shade）
      const $pages = document.querySelectorAll('.taro_router > .taro_page.taro_page_show:not(.taro_page_shade)')
      pageEl = $pages.length ? $pages[$pages.length - 1] : null
    }

    // __taroAppConfig.usingWindowScroll 是页面级配置、mount 时按页写入，切换瞬间可能滞后，用当前页样式二次确认
    const usingWindowScroll = (window as any).__taroAppConfig?.usingWindowScroll === true ||
      (!!pageEl && !/scroll|auto/.test(getComputedStyle(pageEl).overflowY))

    if (usingWindowScroll) {
      this._root = null
    } else if (pageEl) {
      this._root = pageEl
    } else {
      console.warn('IntersectionObserver.relativeToViewport:fail cannot find current page element')
      this._root = null
    }

    if (margins) {
      this._rootMargin = margins
    }
    this._observerInst = this.createInst()
    return this
  }

  private _getCallbackByElement (element: Element) {
    const listener = this._listeners.find(listener => listener.element === element)
    return listener ? listener.callback : null
  }
}
