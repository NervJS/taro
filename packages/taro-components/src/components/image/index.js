import 'weui'
import Nerv from 'nervjs'
import classNames from 'classnames'
import './style/index.scss'

class Image extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.state = {
      isLoaded: false
    }
    this.imageOnLoad = this.imageOnLoad.bind(this)
    this._handleScroll = this._handleScroll.bind(this)
    this.handleScroll = this.throttle(this._handleScroll, 100)
  }

  componentDidMount () {
    if (this.props.lazyLoad) {
      window.addEventListener('scroll', this.handleScroll)
      window.addEventListener('resize', this.handleScroll)
      this._handleScroll()
    }
  }

  componentWillUnMount () {
    if (this.props.lazyLoad) {
      window.removeEventListener('scroll', this.handleScroll)
      window.removeEventListener('resize', this.handleScroll)
    }
  }

  getClientHeight () {
    let clientHeight = 0
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight = Math.min(
        document.body.clientHeight,
        document.documentElement.clientHeight
      )
    } else {
      clientHeight = Math.max(
        document.body.clientHeight,
        document.documentElement.clientHeight
      )
    }
    return clientHeight
  }

  getScrollTop () {
    let scrollTop = 0
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop
    } else if (document.body) {
      scrollTop = document.body.scrollTop
    } else {
      scrollTop = window.scrollY || window.pageYOffset
    }

    return scrollTop
  }

  throttle (fn, delay) {
    let timer = null

    return function () {
      let context = this
      let args = arguments
      clearTimeout(timer)
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }

  _handleScroll () {
    const { offset = 0 } = this.props // 偏移量

    const { nodeTop, nodeBottom } = this.getNodeTop()

    const viewTop = this.getScrollTop()
    const viewBottom = viewTop + this.getClientHeight()

    // 当图片出现在视野范围内,设置真正的图片，同时移除监听
    if (nodeBottom + offset >= viewTop && nodeTop - offset <= viewBottom) {
      this.setState(
        {
          isLoaded: true
        },
        () => {
          Nerv.findDOMNode(this).children[0].src = this.props.src
        }
      )
      window.removeEventListener('scroll', this.handleScroll)
      window.removeEventListener('resize', this.handleScroll)
    }
  }

  getNodeTop () {
    const viewTop = this.getScrollTop()

    const img = Nerv.findDOMNode(this) // 当前节点
    const nodeTop = img.getBoundingClientRect().top + viewTop
    const nodeBottom = nodeTop + img.offsetHeight
    return {
      nodeTop: nodeTop,
      nodeBottom: nodeBottom
    }
  }

  imageOnLoad (e) {
    const { onLoad } = this.props
    Object.defineProperty(e, 'detail', {
      enumerable: true,
      value: {
        width: this.imgRef.width,
        height: this.imgRef.height 
      }
    })
    onLoad && onLoad(e)
  }

  render () {
    const {
      className,
      src,
      style,
      mode,
      onError,
      lazyLoad,
      ...reset
    } = this.props
    const cls = classNames(
      'taro-img',
      {
        'taro-img__widthfix': mode === 'widthFix'
      },
      className
    )
    const imgCls = classNames(
      'taro-img__mode-' +
        (mode || 'scaleToFill').toLowerCase().replace(/\s/g, '')
    )

    let currenSrc = src

    if (lazyLoad) {
      const { isLoaded } = this.state
      currenSrc = isLoaded ? src : ''
    }

    return (
      <div className={cls} style={style} {...reset}>
        {lazyLoad ? (
          <img
            ref={img => this.imgRef = img}
            className={imgCls}
            data-src={currenSrc}
            onLoad={this.imageOnLoad}
            onError={onError}
          />
        ) : (
          <img
            ref={img => this.imgRef = img}
            className={imgCls}
            src={currenSrc}
            onLoad={this.imageOnLoad}
            onError={onError}
          />
        )}
      </div>
    )
  }
}

export default Image
