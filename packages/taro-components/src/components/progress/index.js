import 'weui'
import Nerv from 'nervjs'
import classNames from 'classnames'
import { isNumber, isBoolean, isString } from '../../utils/parse-type'

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
    active,
    borderRadius
  } = props

  // 抛出错误信息
  const throwErrorMsg = type => {
    throw new TypeError(type)
  }
  if (showInfo) isBoolean(showInfo) ? '' : throwErrorMsg('showInfo')
  if (active) isBoolean(active) ? '' : throwErrorMsg('active')

  if (percent) isNumber(percent) ? '' : throwErrorMsg('percent')
  if (strokeWidth) isNumber(strokeWidth) ? '' : throwErrorMsg('strokeWidth')

  if (activeColor) isString(activeColor) ? '' : throwErrorMsg('activeColor')
  if (backgroundColor) {
    isString(backgroundColor) ? '' : throwErrorMsg('backgroundColor')
  }

  if (borderRadius) isString(borderRadius) ? '' : throwErrorMsg('borderRadius')
}

const Progress = (props) => {
  parseType(props)
  const {
    className,
    showInfo,
    strokeWidth,
    activeColor,
    backgroundColor,
    active,
    percent,
    borderRadius
  } = props
  let pgPercent = percent > 100 ? 100 : percent < 0 ? 0 : percent
  const cls = classNames('weui-progress', className)
  let pgWdith = {
    width: pgPercent + '%',
    backgroundColor: activeColor,
    WebkitTransition: active ? `width 1s ease-in-out` : 'none',
    transition: active ? `width 1s ease-in-out` : 'none',
    borderRadius: borderRadius ? `${borderRadius}px` : 0
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
          <span>{pgPercent}%</span>
        </div>
      ) : (
        false
      )}
    </div>
  )
}

export default Progress

Progress.defaultProps = {
  percent: 0,
  showInfo: false
}
