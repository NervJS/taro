import Nerv from 'nervjs'
import classNames from 'classnames'
import _ from 'lodash'

/**
 * props 类型检测
 *
 * @param {Object} props
 */

function parseType (props) {
  const {
    showInfo,
    percent,
    strokeWidth,
    activeColor,
    backgroundColor,
    active
  } = props

  // 抛出错误信息
  const throwErrorMsg = type => {
    throw new TypeError(type)
  }
  if (showInfo) _.isBoolean(showInfo) ? '' : throwErrorMsg('showInfo')
  if (active) _.isBoolean(active) ? '' : throwErrorMsg('active')

  if (percent) _.isNumber(percent) ? '' : throwErrorMsg('percent')
  if (strokeWidth) _.isNumber(strokeWidth) ? '' : throwErrorMsg('strokeWidth')

  if (activeColor) _.isString(activeColor) ? '' : throwErrorMsg('activeColor')
  if (backgroundColor) {
    _.isString(backgroundColor) ? '' : throwErrorMsg('backgroundColor')
  }
}
class Progress extends Nerv.Component {
  constructor () {
    super(...arguments)
    parseType(this.props)
  }

  componentDidMount () {
    const { percent } = this.props
    this.setState({
      pgPercent: percent > 100 ? 100 : percent < 0 ? 0 : percent
    })
  }

  render () {
    const {
      className,
      showInfo,
      strokeWidth,
      activeColor,
      backgroundColor,
      active
    } = this.props
    const cls = classNames('weui-progress', className)
    let pgWdith = {
      width: this.state.pgPercent + '%',
      backgroundColor: activeColor,
      WebkitTransition: active ? `width 1s ease-in-out` : 'none',
      transition: active ? `width 1s ease-in-out` : 'none'
    }
    let pgHeight = {
      height: strokeWidth + 'px',
      backgroundColor
    }

    return (
      <div className={cls}>
        <div className='weui-progress__bar' style={pgHeight}>
          <div className='weui-progress__inner-bar' style={pgWdith} />
        </div>

        {showInfo ? (
          <div className='weui-progress__opr' style='font-size: inherit'>
            <span>{this.state.pgPercent}%</span>
          </div>
        ) : (
          false
        )}
      </div>
    )
  }
}

export default Progress

Progress.defaultProps = {
  percent: 0,
  showInfo: false
}
