import 'weui'
import Nerv, { useEffect, useRef } from 'nervjs'
import classNames from 'classnames'
import { isNumber, isBoolean, isString, isFunction, isDistanceUnit, parseDistanceUnit } from '../../utils/parse-type'

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
    borderRadius,
    fontSize,
    color,
    activeMode,
    duration,
    onActiveEnd
  } = props

  // 抛出错误信息
  const throwErrorMsg = type => {
    throw new TypeError(type)
  }
  if (percent) isNumber(percent) ? '' : throwErrorMsg('percent')
  if (showInfo) isBoolean(showInfo) ? '' : throwErrorMsg('showInfo')
  if (borderRadius) isDistanceUnit(borderRadius) ? '' : throwErrorMsg('borderRadius')
  if (fontSize) isDistanceUnit(fontSize) ? '' : throwErrorMsg('fontSize')
  if (strokeWidth) isDistanceUnit(strokeWidth) ? '' : throwErrorMsg('strokeWidth')
  if (color) isBoolean(color) ? '' : throwErrorMsg('color')
  if (activeColor) isString(activeColor) ? '' : throwErrorMsg('activeColor')
  if (backgroundColor) {
    isString(backgroundColor) ? '' : throwErrorMsg('backgroundColor')
  }
  if (active) isBoolean(active) ? '' : throwErrorMsg('active')
  if (activeMode) isString(activeMode) ? '' : throwErrorMsg('activeMode')
  if (duration) isNumber(duration) ? '' : throwErrorMsg('duration')
  if (onActiveEnd) isFunction(onActiveEnd) ? '' : throwErrorMsg('onActiveEnd')
}

function usePrevious (value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

const Progress = (props) => {
  parseType(props)
  const {
    className,
    percent = 0,
    showInfo = false,
    borderRadius = 0,
    fontSize = 16,
    strokeWidth = 6,
    color,
    activeColor = '#09BB07',
    backgroundColor = 'EBEBEB',
    active = false,
    activeMode = 'backwards',
    duration = 30,
    onActiveEnd
  } = props
  const prec = percent > 100 ? 100 : percent < 0 ? 0 : percent
  const prevPercent = usePrevious(prec)
  const innerBarRef = useRef()
  const diff = Math.abs(prec - prevPercent)

  useEffect(() => {
    if (innerBarRef.current && active) {
      if (activeMode !== 'forwards') {
        console.log(prevPercent)
        /** backwards 动画从头播 */
        innerBarRef.current.style.transitionDuration = '0ms'
        innerBarRef.current.style.width = 0
        setTimeout(() => {
          innerBarRef.current.style.transitionDuration = prec * duration + 'ms'
          innerBarRef.current.style.width = prec + '%'
        }, 0)
      } else {
        /** forwards 动画从上次结束点接着播 */
        innerBarRef.current.style.transitionDuration = diff * duration + 'ms'
        innerBarRef.current.style.width = prec + '%'
      }
    }
  }, [innerBarRef, prec, diff, duration])

  return (
    <div className={classNames('weui-progress', className)}>
      <div className='weui-progress__bar' style={{
        height: parseDistanceUnit(strokeWidth),
        borderRadius: parseDistanceUnit(borderRadius),
        backgroundColor
      }}>
        <div className='weui-progress__inner-bar' ref={innerBarRef} onTransitionEnd={onActiveEnd} style={{
          backgroundColor: activeColor || color,
          transitionTimingFunction: active ? 'linear' : 'none',
          transitionProperty: active ? 'width' : 'none'
        }}
        />
      </div>
      {showInfo ? (
        <div className='weui-progress__opr' style={{ fontSize: parseDistanceUnit(fontSize) }}>
          <span>{prec}%</span>
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
