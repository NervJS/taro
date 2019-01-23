import 'weui'
import Nerv from 'nervjs'
import classNames from 'classnames'
import './style/index.scss'

class Image extends Nerv.Component {
  constructor () {
    super(...arguments)
  }

  render () {
    const { className, src, style, mode, onLoad, onError, ...reset } = this.props
    const cls = classNames('taro-img', {
      'taro-img__widthfix': mode === 'widthFix'
    }, className)
    const imgCls =
      'taro-img__mode-' +
      (mode || 'scaleToFill').toLowerCase().replace(/\s/g, '')

    return (
      <div className={cls} style={style} {...reset}>
        <img className={imgCls} src={src} onLoad={onLoad} onError={onError} />
      </div>
    )
  }
}

export default Image
