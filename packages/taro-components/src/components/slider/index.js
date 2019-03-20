import 'weui'
import Nerv from 'nervjs'
import { isNumber, isBoolean, isString, isFunction } from '../../utils/parse-type'
import classNames from 'classnames'

/**
 * props 类型检测
 *
 * @param {Object} props
 */
function parseType (props) {
  const {
    min,
    max,
    step,
    disabled,
    value,
    backgroundColor,
    activeColor,
    blockSize,
    blockColor,
    showValue,
    onChange,
    onChanging
  } = props

  // 抛出错误信息
  const throwErrorMsg = type => {
    throw new TypeError(type)
  }

  if (min) isNumber(min) ? '' : throwErrorMsg('min')
  if (max) isNumber(max) ? '' : throwErrorMsg('max')
  if (step) isNumber(step) ? '' : throwErrorMsg('step')
  if (value) isNumber(value) ? '' : throwErrorMsg('value')
  if (blockSize) isNumber(blockSize) ? '' : throwErrorMsg('blockSize')

  if (disabled) isBoolean(disabled) ? '' : throwErrorMsg('disabled')
  if (showValue) isBoolean(showValue) ? '' : throwErrorMsg('showValue')

  if (backgroundColor) {
    isString(backgroundColor) ? '' : throwErrorMsg('backgroundColor')
  }

  if (activeColor) isString(activeColor) ? '' : throwErrorMsg('activeColor')
  if (blockColor) isString(blockColor) ? '' : throwErrorMsg('blockColor')

  if (onChange) isFunction(onChange) ? '' : throwErrorMsg('onChange')
  if (onChanging) isFunction(onChanging) ? '' : throwErrorMsg('onChanging')
}

class Slider extends Nerv.Component {
  constructor () {
    super(...arguments)

    parseType(this.props)

    this.sliderInsRef = ''

    if (this.props.value) {
      if (this.props.value > this.props.max) {
        this.props.value = this.props.max
      }
    }

    this.state = {
      value: this.props.value,
      controlled: typeof this.props.value !== 'undefined',
      totalWidth: 0,
      touching: false,
      ogX: 0,
      touchID: false,
      percent: this.props.value
        ? parseInt(this.props.value / (this.props.max - this.props.min) * 100)
        : 0
    }
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    this.updateValue = this.updateValue.bind(this)
  }

  componentDidMount () {
    if (this.state.value === 0) this.updateValue()
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.controlled) {
      if (
        nextProps.value <= this.props.max &&
        nextProps.value >= this.props.min
      ) {
        let percent = parseInt(
          nextProps.value / (this.props.max - this.props.min) * 100
        )
        this.setState({ value: nextProps.value, percent })
      }
    }
  }

  updateValue () {
    let value = 0
    let percent = this.state.percent
    let { min, max, step } = this.props
    let steps = parseInt((max - min) / step)
    let per = 100 / steps
    if (per < 1) per = 1
    let perPercent = parseInt(per)

    if (percent === 100) {
      value = max
    } else if (percent === 0) {
      value = min
    } else {
      for (let i = 0; i < steps; i++) {
        if (percent > i * perPercent && percent <= (i + 1) * perPercent) {
          value =
            percent - i * perPercent > perPercent / 2
              ? (i + 1) * step + min
              : i * step + min
        }
      }
    }
    if (value !== this.state.value) {
      this.setState({ value })
      return true
    }
    return false
  }

  handleTouchStart (e) {
    if (this.state.touching || this.props.disabled) return
    let barDOM = Nerv.findDOMNode(this.sliderInsRef)
    this.setState({
      touching: true,
      touchId: e.targetTouches[0].identifier,
      totalWidth: barDOM.clientWidth,
      ogX: e.targetTouches[0].pageX,
      ogPercent: this.state.percent
    })
  }

  handleTouchMove (e) {
    let { onChanging } = this.props
    if (!this.state.touching || this.props.disabled) return
    if (e.targetTouches[0].identifier !== this.state.touchId) return

    // 阻止默认事件
    e.preventDefault()

    const pageX = e.targetTouches[0].pageX
    const diffX = pageX - this.state.ogX

    let percent =
      parseInt(diffX / this.state.totalWidth * 100) + this.state.ogPercent
    percent = percent < 0 ? 0 : percent > 100 ? 100 : percent

    this.setState(
      {
        percent
      },
      () => {
        let updateValueFlag = this.updateValue()
        // 数据变化才更新
        if (updateValueFlag) {
          Object.defineProperty(e, 'detail', {
            enumerable: true,
            value: {
              detail: e.detail,
              value: this.state.value
            }
          })
          if (onChanging) onChanging(e)
        }
      }
    )
  }
  handleTouchEnd (e) {
    if (!this.state.touching || this.props.disabled) {
      return
    }

    let { onChange } = this.props

    this.setState({
      touching: false,
      ogX: 0,
      touchId: false,
      ogPercent: 0
    }, () => {
      Object.defineProperty(e, 'detail', {
        enumerable: true,
        value: {
          detail: e.detail,
          value: this.state.value
        }
      })
      if (onChange) onChange(e)
    })
  }

  render () {
    const {
      className,
      showValue,
      backgroundColor,
      activeColor,
      blockColor
    } = this.props
    let blockSize = this.props.blockSize
    let cls = classNames('weui-slider-box', className)

    let innerStyles = {
      backgroundColor: backgroundColor
    }

    const percent = this.state.percent > 100 ? 100 : this.state.percent
    let trackStyles = {
      width: `${percent}%`,
      backgroundColor: activeColor
    }

    if (blockSize < 12) {
      blockSize = 28
    }
    if (blockSize > 28) {
      blockSize = 28
    }

    let handlerStyles = {
      left: `${percent}%`,
      width: `${blockSize}px`,
      height: `${blockSize}px`,
      backgroundColor: blockColor,
      marginTop: `-${Math.floor(blockSize / 2)}px`,
      marginLeft: `-${Math.floor(blockSize / 2)}px`
    }
    const { name = '' } = this.props
    return (
      <div className={cls}>
        <div className='weui-slider'>
          <div className='weui-slider__inner' style={innerStyles} ref={c => (this.sliderInsRef = c)}>
            <div style={trackStyles} className='weui-slider__track' />
            <div
              style={handlerStyles}
              onTouchStart={this.handleTouchStart}
              onTouchMove={this.handleTouchMove}
              onTouchEnd={this.handleTouchEnd}
              className='weui-slider__handler'
            />
            <input type='hidden' name={name} value={this.state.value} />
          </div>
        </div>
        {showValue ? (
          <div className='weui-slider-box__value'>{this.state.value}</div>
        ) : (
          false
        )}
      </div>
    )
  }
}

Slider.defaultProps = {
  max: 100,
  min: 0,
  step: 1,
  showValue: false,
  disabled: false,
  value: 0
}
export default Slider
