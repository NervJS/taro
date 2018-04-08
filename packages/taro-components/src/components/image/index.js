import Nerv from 'nervjs'
import classNames from 'classnames'
import './style'

class Image extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const { className, src, style, mode, onLoad, onError } = this.props
    const cls = classNames('taro-img', {}, className)
    const imgCls =
      'taro-img__mode-' +
      (mode || 'scaleToFill').toLowerCase().replace(/\s/g, '')

    return (
      <div className={cls} style={style}>
        <img className={imgCls} src={src} onLoad={onLoad} onError={onError} />
      </div>
    )
  }
}

export default Image
