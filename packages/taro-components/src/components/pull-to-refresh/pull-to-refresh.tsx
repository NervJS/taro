/*
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*/

import { Component, Prop, h, ComponentInterface, Host, State, Event, EventEmitter, Watch, Element } from '@stencil/core'
import Taro from '@tarojs/taro'
import classNames from 'classnames'

function setTransform (nodeStyle, value) {
  nodeStyle.transform = value
  nodeStyle.webkitTransform = value
  nodeStyle.MozTransform = value
}

const isWebView = typeof navigator !== 'undefined' &&
  /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)

const INDICATOR = {
  activate: 'release',
  deactivate: 'pull',
  release: 'loading',
  finish: 'finish'
}

let supportsPassive = false
try {
  const opts = Object.defineProperty({}, 'passive', {
    get () {
      supportsPassive = true
    }
  })
  window.addEventListener('cancel', () => ({}), opts)
} catch (e) { }

const willPreventDefault = supportsPassive ? { passive: false } : false

@Component({
  tag: 'taro-pull-to-refresh',
  styleUrl: './style/index.scss'
})
export class PullToRefresh implements ComponentInterface {
  @Prop() prefixCls = 'rmc-pull-to-refresh'
  @Prop() distanceToRefresh = 50
  @Prop() damping = 100
  @Prop() indicator = INDICATOR

  @State() currSt: 'activate' | 'deactivate' | 'release' | 'finish' = 'deactivate'
  @State() dragOnEdge = false
  @Element() el: HTMLElement;

  @Event({
    eventName: 'refresh'
  }) onRefresh: EventEmitter

  private contentRef: HTMLElement;
  private _to: Record<string, EventListener>
  private _ScreenY = 0;
  private _startScreenY = 0;
  private _lastScreenY = 0;

  private _isMounted = false;

  private get scrollContainer () {
    return this.el.parentElement ||
      this.el.closest('.taro_page_stationed') ||
      document.querySelector('.taro_page_stationed') ||
      document.querySelector('.taro_page') ||
      document.querySelector('.taro_router') ||
      document.querySelector('.taro-tabbar__panel') ||
      document.body
  }

  @Watch('currSt')
  statusChange () {
    const pageEl: any = this.scrollContainer
    switch (this.currSt) {
      case 'release':
        pageEl?.__page?.onPullDownRefresh?.()
        break
      case 'deactivate':
        pageEl?.__page?.onPullIntercept?.()
    }
  }

  disconnectedCallback () {
    this.destroy()
  }

  componentDidLoad () {
    this.init()
    this._isMounted = true
    Taro.eventCenter.on('__taroStartPullDownRefresh', ({ successHandler, errorHandler }) => {
      try {
        this.triggerPullDownRefresh(true)
        successHandler({
          errMsg: 'startPullDownRefresh: ok'
        })
      } catch (e) {
        errorHandler({
          errMsg: 'startPullDownRefresh: fail'
        })
      }
    })

    Taro.eventCenter.on('__taroStopPullDownRefresh', ({ successHandler, errorHandler }) => {
      try {
        this.triggerPullDownRefresh(false)
        successHandler({
          errMsg: 'stopPullDownRefresh: ok'
        })
      } catch (e) {
        errorHandler({
          errMsg: 'stopPullDownRefresh: fail'
        })
      }
    })
  }

  triggerPullDownRefresh = (flag: boolean) => {
    // 在初始化时、用代码 自动 触发 pullDownRefresh
    // 添加this._isMounted的判断，否则组建一实例化，currSt就会是finish
    if (!this.dragOnEdge && this._isMounted) {
      if (flag) {
        this._lastScreenY = this.distanceToRefresh + 1
        // change dom need after setState
        this.currSt = 'release'
        this.setContentStyle(this._lastScreenY)
      } else {
        this.currSt = 'finish'
        this.reset()
      }
    }
  }

  init = () => {
    const ele = this.scrollContainer
    const child = this.el.querySelector('rmc-pull-to-refresh-content')
    this.el.appendChild = child?.appendChild.bind(child)
    this.el.insertBefore = child?.insertBefore.bind(child)
    this.el.replaceChild = child?.replaceChild.bind(child)
    this.el.removeChild = child?.removeChild.bind(child)
    this._to = {
      touchstart: this.onTouchStart.bind(this, ele),
      touchmove: this.onTouchMove.bind(this, ele),
      touchend: this.onTouchEnd.bind(this, ele),
      touchcancel: this.onTouchEnd.bind(this, ele)
    }
    Object.keys(this._to).forEach(key => {
      ele.addEventListener(key, this._to[key], willPreventDefault)
    })
  }

  destroy = () => {
    const ele = this.scrollContainer
    Object.keys(this._to).forEach(key => {
      ele.removeEventListener(key, this._to[key])
    })
  }

  onTouchStart = (_, e: TouchEvent) => {
    this._ScreenY = this._startScreenY = e.touches[0].screenY
    // 一开始 refreshing 为 true 时 this._lastScreenY 有值
    this._lastScreenY = this._lastScreenY || 0
  }

  isEdge = (ele: HTMLElement) => {
    const container = this.scrollContainer
    if (container && container === document.body) {
      // In chrome61 `document.body.scrollTop` is invalid
      const scrollNode = document.scrollingElement ? document.scrollingElement : document.body
      return scrollNode.scrollTop <= 0
    }
    return ele.scrollTop <= 0
  }

  damp = (dy: number) => {
    if (Math.abs(this._lastScreenY) > this.damping) {
      return 0
    }

    const ratio = Math.abs(this._ScreenY - this._startScreenY) / window.screen.height
    dy *= (1 - ratio) * 0.6

    return dy
  }

  onTouchMove = (ele: HTMLElement, e: TouchEvent) => {
    // 使用 pageY 对比有问题
    const _screenY = e.touches[0].screenY

    // 拖动方向不符合的不处理
    if (this._startScreenY > _screenY) {
      return
    }

    if (this.isEdge(ele)) {
      if (!this.dragOnEdge) {
        // 当用户开始往上滑的时候isEdge还是false的话，会导致this._ScreenY不是想要的，只有当isEdge为true时，再上滑，才有意义
        // 下面这行代码解决了上面这个问题
        this._ScreenY = this._startScreenY = e.touches[0].screenY
        this.dragOnEdge = true
      }
      if (e.cancelable) {
        e.preventDefault()
      }
      // add stopPropagation with fastclick will trigger content onClick event. why?
      // ref https://github.com/ant-design/ant-design-mobile/issues/2141
      // e.stopPropagation();

      const _diff = Math.round(_screenY - this._ScreenY)
      this._ScreenY = _screenY
      this._lastScreenY += this.damp(_diff)

      this.setContentStyle(this._lastScreenY)

      if (Math.abs(this._lastScreenY) < this.distanceToRefresh) {
        if (this.currSt !== 'deactivate') {
          // console.log('back to the distance');
          this.currSt = 'deactivate'
        }
      } else {
        if (this.currSt === 'deactivate') {
          // console.log('reach to the distance');
          this.currSt = 'activate'
        }
      }

      // https://github.com/ant-design/ant-design-mobile/issues/573#issuecomment-339560829
      // iOS UIWebView issue, It seems no problem in WKWebView
      if (isWebView && e.changedTouches[0].clientY < 0) {
        this.onTouchEnd()
      }
    }
  }

  onTouchEnd = () => {
    if (this.dragOnEdge) {
      this.dragOnEdge = false
    }
    if (this.currSt === 'activate') {
      this.currSt = 'release'
      this.onRefresh.emit(this)
      this._lastScreenY = this.distanceToRefresh + 1
      this.setContentStyle(this._lastScreenY)
    } else if (this.currSt === 'release') {
      this._lastScreenY = this.distanceToRefresh + 1
      this.setContentStyle(this._lastScreenY)
    } else {
      this.reset()
    }
  }

  reset = () => {
    this._lastScreenY = 0
    this.setContentStyle(0)
  }

  setContentStyle = (ty: number) => {
    // TODO: Why sometimes do not have `this.contentRef` ?
    if (this.contentRef) {
      // translate3d 不清理 会影响内部元素 定位
      if (ty) {
        setTransform(this.contentRef.style, `translate3d(0px,${ty}px,0)`)
      } else {
        setTransform(this.contentRef.style, '')
      }
    }
  }

  render () {
    const renderRefresh = (cls: string) => {
      const { currSt, dragOnEdge, prefixCls } = this
      const cla = classNames(cls, !dragOnEdge && `${prefixCls}-transition`)
      const showIndicator = currSt === 'activate' || currSt === 'release'
      return (
        <div class={`${prefixCls}-content-wrapper`}>
          <div
            class={cla}
            ref={el => {
              this.contentRef = el!
            }}>
            {showIndicator && (
              <div class={`${prefixCls}-indicator`}>
                <div />
                <div />
                <div />
              </div>
            )}
            <slot />
          </div>
        </div>
      )
    }

    if (this.scrollContainer) {
      return renderRefresh(`${this.prefixCls}-content ${this.prefixCls}-down`)
    }
    return (
      <Host
        class={classNames(this.prefixCls, `${this.prefixCls}-down`)}
      >
        {renderRefresh(`${this.prefixCls}-content`)}
      </Host>
    )
  }
}
