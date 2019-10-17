import classNames from 'classnames'
import Nerv from 'nervjs'
import Taro from '@tarojs/taro-h5'

import './style/index.css'

class StaticRenderer extends Nerv.Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.shouldUpdate
  }
  render () {
    return <div>{this.props.render()}</div>
  }
}

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
  window.addEventListener('test', null, opts)
} catch (e) {}

const willPreventDefault = supportsPassive ? { passive: false } : false
// const willNotPreventDefault = supportsPassive ? { passive: true } : false;

class PullToRefresh extends Nerv.Component {
  static defaultProps = {
    prefixCls: 'rmc-pull-to-refresh',
    distanceToRefresh: 50,
    damping: 100,
    indicator: INDICATOR
  };

  // https://github.com/yiminghe/zscroller/blob/2d97973287135745818a0537712235a39a6a62a1/src/Scroller.js#L355
  // currSt: `activate` / `deactivate` / `release` / `finish`
  state = {
    currSt: 'deactivate',
    dragOnEdge: false
  };

  containerRef = null;
  contentRef = null;
  _to = null;
  _ScreenY = null;
  _startScreenY = null;
  _lastScreenY = null;

  _isMounted = false;

  shouldUpdateChildren = false;

  scrollContainer = document.querySelector('.taro-tabbar__panel') || document.body

  shouldComponentUpdate (nextProps) {
    this.shouldUpdateChildren = this.props.children !== nextProps.children
    return true
  }

  componentDidUpdate (prevProps) {
    if (prevProps === this.props || prevProps.refreshing === this.props.refreshing) {
      return
    }
    // triggerPullDownRefresh 需要尽可能减少 setState 次数
    this.triggerPullDownRefresh()
  }

  componentDidMount () {
    // this.init()
    this.triggerPullDownRefresh()
    this._isMounted = true
  }

  componentWillUnmount () {
    // Should have no setTimeout here!
    // this.destroy(this.scrollContainer)
  }

  triggerPullDownRefresh = () => {
    // 在初始化时、用代码 自动 触发 pullDownRefresh
    // 添加this._isMounted的判断，否则组建一实例化，currSt就会是finish
    if (!this.state.dragOnEdge && this._isMounted) {
      if (this.props.refreshing) {
        this._lastScreenY = this.props.distanceToRefresh + 1
        // change dom need after setState
        this.setState({ currSt: 'release' }, () => this.setContentStyle(this._lastScreenY))
      } else {
        this.setState({ currSt: 'finish' }, () => this.reset())
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

  onTouchStart = (_ele, e) => {
    this._ScreenY = this._startScreenY = e.touches[0].screenY
    // 一开始 refreshing 为 true 时 this._lastScreenY 有值
    this._lastScreenY = this._lastScreenY || 0
  }

  isEdge = (ele) => {
    const container = this.scrollContainer
    if (container && container === document.body) {
      // In chrome61 `document.body.scrollTop` is invalid
      const scrollNode = document.scrollingElement ? document.scrollingElement : document.body
      return scrollNode.scrollTop <= 0
    }
    return ele.scrollTop <= 0
  }

  damping = (dy) => {
    if (Math.abs(this._lastScreenY) > this.props.damping) {
      return 0
    }

    const ratio = Math.abs(this._ScreenY - this._startScreenY) / window.screen.height
    dy *= (1 - ratio) * 0.6

    return dy
  }

  onTouchMove = (ele, e) => {
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
        if (this.state.currSt !== 'deactivate') {
          // console.log('back to the distance');
          this.setState({ currSt: 'deactivate' })
        }
      } else {
        if (this.state.currSt === 'deactivate') {
          // console.log('reach to the distance');
          this.setState({ currSt: 'activate' })
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
    if (this.state.currSt === 'activate') {
      this.setState({ currSt: 'release' })
      this.props.onRefresh()
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

  setContentStyle = (ty) => {
    // todos: Why sometimes do not have `this.contentRef` ?
    if (this.contentRef) {
      setTransform(this.contentRef.style, `translate3d(0px,${ty}px,0)`)
    }
  }

  render () {
    const props = { ...this.props }

    delete props.damping

    const {
      className, prefixCls, children,
      onRefresh, refreshing, indicator, distanceToRefresh, ...restProps
    } = props

    const renderChildren = (
      <StaticRenderer
        shouldUpdate={this.shouldUpdateChildren}
        render={() => children} />
    )

    const renderRefresh = cls => {
      const { currSt, dragOnEdge } = this.state
      const cla = classNames(cls, !dragOnEdge && `${prefixCls}-transition`)
      const showIndicator = currSt === 'activate' || currSt === 'release'
      return (
        <div className={`${prefixCls}-content-wrapper`}>
          <div
            className={cla}
            ref={el => {
              this.contentRef = el
            }}>
            {showIndicator && (
              <div className={`${prefixCls}-indicator`}>
                <div />
                <div />
                <div />
              </div>
            )}
            {renderChildren}
          </div>
        </div>
      )
    }

    if (this.scrollContainer) {
      return renderRefresh(`${prefixCls}-content ${prefixCls}-down`)
    }
    return (
      <div
        ref={el => {
          this.containerRef = el
        }}
        className={classNames(className, prefixCls, `${prefixCls}-down`)}
        {...restProps}
      >
        {renderRefresh(`${prefixCls}-content`)}
      </div>
    )
  }
}

class PullDownRefresh extends Nerv.Component {
  state = {
    refreshing: false
  }
  isBound = false
  listeners = []
  startPullDownRefresh = () => {
    this.props.onRefresh()
    this.setState({
      refreshing: true
    })
  }
  stopPullDownRefresh = () => {
    this.setState({
      refreshing: false
    })
  }
  getPtrRef = ref => {
    this.ptrRef = ref
  }
  bindEvent = () => {
    if (this.isBound) return
    this.isBound = true
    this.ptrRef && this.ptrRef.init()
    this.listeners = [
      ['__taroStartPullDownRefresh', ({ successHandler, errorHandler }) => {
        try {
          this.startPullDownRefresh()
          successHandler({
            errMsg: `startPullDownRefresh: ok`
          })
        } catch (e) {
          errorHandler({
            errMsg: `startPullDownRefresh: fail`
          })
        }
      }],
      ['__taroStopPullDownRefresh', ({ successHandler, errorHandler }) => {
        try {
          this.stopPullDownRefresh()
          successHandler({
            errMsg: `stopPullDownRefresh: ok`
          })
        } catch (e) {
          errorHandler({
            errMsg: `stopPullDownRefresh: fail`
          })
        }
      }]
    ]
    this.listeners.forEach(([evtName, callback]) => {
      Taro.eventCenter.on(evtName, callback)
    })
  }

  unbindEvent = () => {
    this.isBound = false
    this.ptrRef && this.ptrRef.destroy()
    this.listeners.forEach(([evtName, callback]) => {
      Taro.eventCenter.off(evtName, callback)
    })
  }
  componentDidMount () {
    this.bindEvent()
  }
  componentWillUnmount () {
    this.unbindEvent()
  }
  render () {
    const props = {
      distanceToRefresh: 100,
      damping: 200,
      refreshing: this.state.refreshing,
      onRefresh: this.startPullDownRefresh,
      ref: this.getPtrRef
    }
    return (
      <PullToRefresh {...props}>
        {this.props.children}
      </PullToRefresh>
    )
  }
}

export default PullDownRefresh
