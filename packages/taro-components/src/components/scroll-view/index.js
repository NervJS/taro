import 'weui'
import Nerv from 'nervjs'
import omit from 'omit.js'
import classNames from 'classnames'
import './style/index.scss'

function easeOutScroll(from, to, callback) {
  if (from === to || typeof from !== 'number') {
    return
  }
  let change = to - from
  const dur = 500
  const sTime = +new Date()
  function linear(t, b, c, d) {
    return c * t / d + b
  }
  const isLarger = to >= from

  function step() {
    from = linear(+new Date() - sTime, from, change, dur)
    if ((isLarger && from >= to) || (!isLarger && to >= from)) {
      callback(to)
      return
    }
    callback(from)
    requestAnimationFrame(step)
  }
  step()
}
function throttle(fn, delay) {
  let timer = null
  return function () {
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn()
    }, delay)
  }
}
class ScrollView extends Nerv.Component {
  constructor() {
    super(...arguments)
    this.state = {
      headerStyle: { //下拉刷新的样式
        height: 0 + 'px'
      },
      headerText: '下拉刷新',
      footerStyle: { //上拉图标样式
        height: 0 + 'px'
      },
      footerText: '上拉加载更多',
      startPoint: {},
      // scrollY: true,
      RefreshStatus: 0 //刷新状态 0不做操作 1刷新 -1加载更多
    };
  }
  onTouchMove = (e) => {
    let movePoint = e.touches[0], //移动时的位置
      deviationX = 0.30, //左右偏移量(超过这个偏移量不执行下拉操作)
      deviationY = 40, //拉动长度（低于这个值的时候不执行）
      maxY = 50; //拉动的最大高度

    let startPointX = this.state.startPoint.clientX,
      startPointY = this.state.startPoint.clientY,
      movePointX = movePoint.clientX,
      movePointY = movePoint.clientY;
    //得到偏移数值
    let offset = Math.abs(movePointX - startPointX) / Math.abs(movePointY - startPointY);
    if (offset < deviationX) { //当偏移数值大于设置的偏移数值时则不执行操作
      let dragRatio = Math.abs(movePointY - startPointY) / 3.5; //拖动倍率（使拖动的时候有粘滞的感觉--试了很多次 这个倍率刚好）
      if (movePointY - startPointY > 0) { //下拉操作
        if (dragRatio >= deviationY) {
          this.setState({
            RefreshStatus: 1,
            headerText: '释放刷新'
          });
        } else {
          this.setState({
            RefreshStatus: 0,
            headerText: '下拉刷新'
          });
        }
        if (dragRatio >= maxY) {
          dragRatio = maxY;
        }
        this.setState({
          headerStyle: {
            height: dragRatio + 'px'
          },
          scrollY: false //拖动的时候禁用
        });
      }
      if (startPointY - movePointY > 0) { //上拉操作
        if (dragRatio >= deviationY) {
          this.setState({
            RefreshStatus: -1,
            footerText: '释放加载更多'
          });
        } else {
          this.setState({
            RefreshStatus: 0,
            footerText: '上拉加载更多'
          })
        }
        if (dragRatio >= maxY) {
          dragRatio = maxY
        }
        this.setState({
          footerStyle: {
            height: dragRatio + 'px'
          },
          scrollY: false //拖动的时候禁用
        })
      }

    }
  }
  onTouchEnd = (e) => {
    let self = this;
    const {
      onScrollToUpper,
      onScrollToLower
    } = this.props
    if (this.state.RefreshStatus === 1) {
      let onScrollUpper = new Promise((resolve, reject) => {
        onScrollToUpper && onScrollToUpper();
        resolve();
      })
      onScrollUpper.then(result => {
        let date = new Date();
        let value = "最后更新时间 今天";
        value += date.getHours() + ':' + date.getMinutes();
        this.setState({
          headerText: value
        })
        setTimeout(function () {
          self.reduction()
        }, 1000);
      })
    } else if (this.state.RefreshStatus === -1) {
      let onScrollLower = new Promise((resolve, reject) => {
        onScrollToLower && onScrollToLower();
        resolve();
      })
      onScrollLower.then(result => {
        this.reduction()
      })
    } else {
      self.reduction()
    }
  }
  reduction = (e) => { //还原初始设置
    // return;
    const time = 0.5;
    this.setState({
      footerStyle: { //上拉图标样式
        height: 0 + 'px',
        transition: `all ${time}s`
      },
      RefreshStatus: 0,
      headerStyle: {
        height: 0 + 'px',
        transition: `all ${time}s`
      },
      scrollY: true
    })
    setTimeout(() => {
      this.setState({
        footerStyle: { //上拉图标样式
          height: 0 + 'px'
        },
        footerText: '上拉加载更多',
        headerText: '下拉刷新'
      })
    }, time * 1000);
  }
  onTouchStart = (e) => {
    let self = this;
    self.setState({
      startPoint: e.touches[0]
    })
  }

  // onTouchMove = e => {
  //   e.stopPropagation();
  // }

  componentDidMount() {
    setTimeout(() => {
      const props = this.props
      if (props.scrollY && typeof props.scrollTop === 'number') {
        if ('scrollWithAnimation' in props) {
          easeOutScroll(0, props.scrollTop, pos => {
            this.container.scrollTop = pos
          })
        } else {
          this.container.scrollTop = props.scrollTop
        }
        this._scrollTop = props.scrollTop
      }
      if (props.scrollX && typeof props.scrollLeft === 'number') {
        if ('scrollWithAnimation' in props) {
          easeOutScroll(0, props.scrollLeft, pos => {
            this.container.scrollLeft = pos
          })
        } else {
          this.container.scrollLeft = props.scrollLeft
        }
        this._scrollLeft = props.scrollLeft
      }
    }, 10)
  }

  componentWillReceiveProps(nextProps) {
    const props = this.props
    // Y 轴滚动
    if (
      nextProps.scrollY &&
      typeof nextProps.scrollTop === 'number' &&
      nextProps.scrollTop !== this._scrollTop
    ) {
      if ('scrollWithAnimation' in nextProps) {
        easeOutScroll(this._scrollTop, nextProps.scrollTop, pos => {
          this.container.scrollTop = pos
        })
      } else {
        this.container.scrollTop = nextProps.scrollTop
      }
      this._scrollTop = nextProps.scrollTop
    }
    // X 轴滚动
    if (
      nextProps.scrollX &&
      typeof props.scrollLeft === 'number' &&
      nextProps.scrollLeft !== this._scrollLeft
    ) {
      if ('scrollWithAnimation' in nextProps) {
        easeOutScroll(this._scrollLeft, nextProps.scrollLeft, pos => {
          this.container.scrollLeft = pos
        })
      } else {
        this.container.scrollLeft = nextProps.scrollLeft
      }
      this._scrollLeft = nextProps.scrollLeft
    }
  }

  render() {
    const {
      className,
      onScroll,
      onScrollToUpper,
      onScrollToLower,
      onTouchMove,
      onTouchEnd,
      onTouchStart,
      scrollX,
      scrollY
    } = this.props
    let {
      upperThreshold = 50, lowerThreshold = 50
    } = this.props
    let headerStyle = this.state.headerStyle;
    let footerStyle = this.state.footerStyle;
    const cls = classNames(
      'taro-scroll', {
        [`taro-scroll-view__scroll-x`]: scrollX,
        [`taro-scroll-view__scroll-y`]: scrollY
      },
      className
    )
    upperThreshold = parseInt(upperThreshold)
    lowerThreshold = parseInt(lowerThreshold)
    const uperAndLower = () => {
      const {
        offsetWidth,
        offsetHeight,
        scrollLeft,
        scrollTop,
        scrollHeight,
        scrollWidth
      } = this.container
      if (
        onScrollToLower &&
        ((scrollY &&
          offsetHeight + scrollTop + lowerThreshold >= scrollHeight) ||
          (scrollX &&
            offsetWidth + scrollLeft + lowerThreshold >= scrollWidth))
      ) {
        onScrollToLower()
      }
      if (
        onScrollToUpper &&
        ((scrollY && scrollTop <= upperThreshold) ||
          (scrollX && scrollLeft <= upperThreshold))
      ) {
        onScrollToUpper()
      }
    }
    const uperAndLowerThrottle = throttle(uperAndLower, 200)
    const _onScroll = e => {
      const {
        scrollLeft,
        scrollTop,
        scrollHeight,
        scrollWidth
      } = this.container
      this._scrollLeft = scrollLeft
      this._scrollTop = scrollTop
      e.detail = {
        scrollLeft,
        scrollTop,
        scrollHeight,
        scrollWidth
      }
      uperAndLowerThrottle()
      onScroll && onScroll(e)
    }
    const _onTouchMove = e => {
      onTouchMove ? onTouchMove(e) : this.onTouchMove(e)
    }
    const _onTouchEnd = e => {
      onTouchEnd ? onTouchEnd(e) : this.onTouchEnd(e)
    }
    const _onTouchStart = e => {
      onTouchStart ? onTouchStart(e) : this.onTouchStart(e)
    }
    return (
      <div>
        <div className="scroll-header-view" style={headerStyle}>
          <span className='taro-text scroll-header-text'>{this.state.headerText}</span>
        </div>
        <div ref={container => {
            this.container = container
          }} {
          ...omit(this.props, ['className', 'scrollTop', 'scrollLeft'])
          }
          className={
            cls
          }
          onScroll={
            _onScroll
          }
          onTouchMove={
            _onTouchMove
          }
          onTouchEnd={
            _onTouchEnd
          }
          onTouchStart={
            _onTouchStart
          } > {
            this.props.children
          } 
        </div>
        <div className="scroll-footer-view"
          style={
            footerStyle
          } >
          <span className='taro-text scroll-header-text' > {
            this.state.footerText
          } < /span>
        </div>
      </div>
    )
  }
}
    
    export default ScrollView
