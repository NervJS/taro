import 'weui'
import Nerv from 'nervjs'
import classNames from 'classnames'
import './style/index.scss'

require('intersection-observer')

class Image extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.state = {
      isLoaded: false
    }
    this.imageOnLoad = this.imageOnLoad.bind(this)
  }

  componentDidMount () {
    if (this.props.lazyLoad) {
      const lazyImg = new IntersectionObserver((entries, observer) => {
        // 异步 api 关系
        if (entries[entries.length - 1].isIntersecting) {
          this.setState({ isLoaded: true }, () => {
            lazyImg.unobserve(this.imgRef)
            Nerv.findDOMNode(this).children[0].src = this.props.src
          })
        }
      }, {
        rootMargin: '300px 0px'
      })
      lazyImg.observe(this.imgRef)
    }
  }

  componentWillUnMount () {
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

    return (
      <div className={cls} style={style} {...reset}>
        {lazyLoad ? (
          <img
            ref={img => (this.imgRef = img)}
            className={imgCls}
            data-src={src}
            onLoad={this.imageOnLoad}
            onError={onError}
          />
        ) : (
          <img
            ref={img => (this.imgRef = img)}
            className={imgCls}
            src={src}
            onLoad={this.imageOnLoad}
            onError={onError}
          />
        )}
      </div>
    )
  }
}

export default Image
