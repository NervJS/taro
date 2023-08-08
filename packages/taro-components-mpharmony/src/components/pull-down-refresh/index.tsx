import './style/index.css'

import Taro from '@tarojs/taro'
import classNames from 'classnames'
import React from 'react'

function setTransform (nodeStyle, value) {
  nodeStyle.transform = value
  nodeStyle.webkitTransform = value
  nodeStyle.MozTransform = value
}

const isWebView =
  typeof navigator !== 'undefined' && /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)

enum PullDownState {
  activate = 'activate',
  deactivate = 'deactivate',
  release = 'release',
  finish = 'finish'
}

enum INDICATOR {
  activate = 'release',
  deactivate = 'pull',
  release = 'loading',
  finish = 'finish'
}

let supportsPassive = false
try {
  const opts = Object.defineProperty({}, 'passive', {
    get () {
      supportsPassive = true
    }
  })
  window.addEventListener('cancel', () => ({}), opts)
} catch (e) {} // eslint-disable-line no-empty

const willPreventDefault = supportsPassive ? { passive: false } : false

interface IProps extends React.HTMLAttributes<HTMLBaseElement> {
  prefixCls: string
  distanceToRefresh: number
  damping: number
  indicator: INDICATOR
  onRefresh?: () => void
}

interface IState {
  currSt: PullDownState
  dragOnEdge: boolean
}

class PullDownRefresh extends React.Component<IProps, IState> {
  static defaultProps = {
    prefixCls: 'rmc-pull-to-refresh',
    distanceToRefresh: 50,
    damping: 100,
    indicator: INDICATOR
  }

  // https://github.com/yiminghe/zscroller/blob/2d97973287135745818a0537712235a39a6a62a1/src/Scroller.js#L355
  // currSt: `activate` / `deactivate` / `release` / `finish`
  state = {
    currSt: PullDownState.deactivate,
    dragOnEdge: false
  }

  containerRef: HTMLElement | null
  contentRef: HTMLDivElement | null
  _to: Record<string, EventListener>
  _ScreenY = 0
  _startScreenY = 0
  _lastScreenY = 0
  _isMounted = false
  listeners: [string, (...args: any[]) => void][] = []

  get scrollContainer () {
    return (
      this.containerRef?.parentElement ||
      this.containerRef?.closest('.taro_page_stationed') ||
      document.querySelector('.taro_page_stationed') ||
      document.querySelector('.taro_page') ||
      document.querySelector('.taro_router') ||
      document.querySelector('.taro-tabbar__panel') ||
      document.body
    )
  }

  componentDidMount () {
    this.init()
    this._isMounted = true
    this.listeners = [
      [
        '__taroStartPullDownRefresh',
        ({ successHandler, errorHandler }) => {
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
        }
      ],
      [
        '__taroStopPullDownRefresh',
        ({ successHandler, errorHandler }) => {
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
        }
      ]
    ]
    this.listeners.forEach(([evtName, callback]) => {
      Taro.eventCenter.on(evtName, callback)
    })
  }

  componentWillUnmount () {
    this.destroy()
    this.listeners.forEach(([evtName, callback]) => {
      Taro.eventCenter.off(evtName, callback)
    })
  }

  componentDidUpdate (_, prevState: IState) {
    if (prevState.currSt !== this.state.currSt) {
      const pageEl: any = this.scrollContainer
      switch (this.state.currSt) {
        case PullDownState.release:
          pageEl?.__page?.onPullDownRefresh?.()
          break
        case PullDownState.deactivate:
          pageEl?.__page?.onPullIntercept?.()
      }
    }
  }

  triggerPullDownRefresh = (flag: boolean) => {
    // 在初始化时、用代码 自动 触发 pullDownRefresh
    // 添加this._isMounted的判断，否则组建一实例化，currSt就会是finish
    if (!this.state.dragOnEdge && this._isMounted) {
      if (flag) {
        this._lastScreenY = this.props.distanceToRefresh + 1
        // change dom need after setState
        this.setState({ currSt: PullDownState.release }, () => this.setContentStyle(this._lastScreenY))
      } else {
        this.setState({ currSt: PullDownState.finish }, () => this.reset())
      }
    }
  }

  init = () => {
    const ele = this.scrollContainer
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
    if (!e || !e.touches) {
      return
    }
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

  damping = (dy: number) => {
    if (Math.abs(this._lastScreenY) > this.props.damping) {
      return 0
    }

    const ratio = Math.abs(this._ScreenY - this._startScreenY) / window.screen.height
    dy *= (1 - ratio) * 0.6

    return dy
  }

  onTouchMove = (ele: HTMLElement, e: TouchEvent) => {
    if (!e || !e.touches) {
      return
    }
    // 使用 pageY 对比有问题
    const _screenY = e.touches[0].screenY
    // 拖动方向不符合的不处理
    if (this._startScreenY > _screenY) {
      return
    }

    if (this.isEdge(ele)) {
      if (!this.state.dragOnEdge) {
        // 当用户开始往上滑的时候isEdge还是false的话，会导致this._ScreenY不是想要的，只有当isEdge为true时，再上滑，才有意义
        // 下面这行代码解决了上面这个问题
        this._ScreenY = this._startScreenY = e.touches[0].screenY
        this.setState({ dragOnEdge: true })
      }
      if (e.cancelable) {
        e.preventDefault()
      }
      // add stopPropagation with fastclick will trigger content onClick event. why?
      // ref https://github.com/ant-design/ant-design-mobile/issues/2141
      // e.stopPropagation();

      const _diff = Math.round(_screenY - this._ScreenY)
      this._ScreenY = _screenY
      this._lastScreenY += this.damping(_diff)

      this.setContentStyle(this._lastScreenY)

      if (Math.abs(this._lastScreenY) < this.props.distanceToRefresh) {
        if (this.state.currSt !== PullDownState.deactivate) {
          // console.log('back to the distance');
          this.setState({ currSt: PullDownState.deactivate })
        }
      } else {
        if (this.state.currSt === PullDownState.deactivate) {
          // console.log('reach to the distance');
          this.setState({ currSt: PullDownState.activate })
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
    if (this.state.dragOnEdge) {
      this.setState({ dragOnEdge: false })
    }
    if (this.state.currSt === PullDownState.activate) {
      this.setState({ currSt: PullDownState.release })
      this.props.onRefresh?.()
      this._lastScreenY = this.props.distanceToRefresh + 1
      this.setContentStyle(this._lastScreenY)
    } else if (this.state.currSt === 'release') {
      this._lastScreenY = this.props.distanceToRefresh + 1
      this.setContentStyle(this._lastScreenY)
    } else {
      this.reset()
    }
  }

  reset = () => {
    this._lastScreenY = 0
    this.setContentStyle(0)
  }

  setContentStyle = ty => {
    // TODO: Why sometimes do not have `this.contentRef` ?
    if (this.contentRef) {
      // translate3d 不清理 会影响内部元素定位
      if (ty) {
        setTransform(this.contentRef.style, `translate3d(0px,${ty}px,0)`)
      } else {
        setTransform(this.contentRef.style, '')
      }
    }
  }

  render () {
    const props: Partial<IProps> & {
      children?: React.ReactNode
    } = { ...this.props }
    delete props.damping
    delete props.indicator
    delete props.distanceToRefresh
    delete props.onRefresh

    const { className, prefixCls, children, ...restProps } = props

    const renderRefresh = (cls: string) => {
      const { currSt, dragOnEdge } = this.state
      const cla = classNames(cls, !dragOnEdge && `${prefixCls}-transition`)
      const showIndicator = currSt === 'activate' || currSt === 'release'
      return (
        <div className={`${prefixCls}-content-wrapper`}>
          <div
            className={cla}
            ref={el => {
              this.contentRef = el
            }}
          >
            {showIndicator && (
              <div className={`${prefixCls}-indicator`}>
                <div />
                <div />
                <div />
              </div>
            )}
            {children}
          </div>
        </div>
      )
    }

    // if (this.scrollContainer) {
    //   return renderRefresh(`${prefixCls}-content ${prefixCls}-down`)
    // }
    return (
      <pull-down-refresh
        ref={el => {
          this.containerRef = el
        }}
        className={classNames(className, prefixCls, `${prefixCls}-down`)}
        {...restProps}
      >
        {renderRefresh(`${prefixCls}-content`)}
      </pull-down-refresh>
    )
  }
}

export default PullDownRefresh
