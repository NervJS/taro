// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Event, EventEmitter, State, Watch, Host } from '@stencil/core'

@Component({
  tag: 'taro-slider'
})
export class Slider implements ComponentInterface {
  private sliderInsRef: HTMLDivElement

  @Prop() min = 0
  @Prop() max = 100
  @Prop() step = 1
  @Prop() disabled = false
  @Prop() value = 0
  @Prop() activeColor = '#1aad19'
  @Prop() backgroundColor = '#e9e9e9'
  @Prop() blockSize = 28
  @Prop() blockColor = '#ffffff'
  @Prop() showValue = false
  @Prop() name = ''

  @State() val: number
  @State() totalWidth = 0
  @State() touching = false
  @State() ogX = 0
  @State() touchId: number | null = null
  @State() percent = 0
  @State() ogPercent: number

  @Watch('value')
  function (newVal, oldVal) {
    const { max, min } = this
    if (newVal !== oldVal) {
      const val = newVal > max ? max : newVal < min ? min : newVal
      const percent = val / (max - min) * 100
      this.val = val
      this.percent = percent
      this.updateValue()
    }
  }

  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  @Event({
    eventName: 'changing'
  })
  onChanging: EventEmitter

  componentWillLoad () {
    const { value, max, min } = this
    const val = value > max ? max : value

    this.val = val
    this.percent = val / (max - min) * 100

    this.updateValue()
  }

  handleTouchStart = (e: TouchEvent) => {
    const { touching, disabled } = this
    if (touching || disabled) return

    this.touching = true
    this.touchId = e.targetTouches[0].identifier
    this.totalWidth = this.sliderInsRef.clientWidth
    this.ogX = e.targetTouches[0].pageX
    this.ogPercent = this.percent
  }

  handleTouchMove = (e: TouchEvent) => {
    const {
      disabled,
      touching,
      ogX,
      ogPercent,
      totalWidth,
      touchId
    } = this
    if (!touching || disabled) return
    if (e.targetTouches[0].identifier !== touchId) return

    // 阻止默认事件
    e.preventDefault()

    const pageX = e.targetTouches[0].pageX
    const diffX = pageX - ogX

    let percent = diffX / totalWidth * 100 + ogPercent
    percent = percent < 0 ? 0 : percent > 100 ? 100 : percent

    this.percent = percent

    this.updateValue()

    this.onChanging.emit({
      detail: e.detail,
      value: this.val
    })
  }

  handleTouchEnd = (e: TouchEvent) => {
    const { disabled, touching } = this
    if (!touching || disabled) return

    if (this.percent !== this.ogPercent) {
      this.onChange.emit({
        detail: e.detail,
        value: this.val
      })
    }

    this.touching = false
    this.ogX = 0
    this.touchId = null
    this.ogPercent = 0
  }

  // 根据步长 step 修改 value
  updateValue = () => {
    const { min, max, step, percent } = this
    const steps = (max - min) / step // 总步数
    const per = 100 / steps
    const perPercent = per < 1 ? 1 : per // 每步所占 slider 宽度的百分比
    let _value = 0

    if (percent === 100) {
      _value = max
    } else if (percent === 0) {
      _value = min
    } else {
      for (let i = 0; i < steps; i++) {
        if (percent > i * perPercent && percent <= (i + 1) * perPercent) {
          const higherThenMiddle = percent - i * perPercent > perPercent / 2
          _value = higherThenMiddle
            ? (i + 1) * step + min
            : i * step + min
          this.percent = higherThenMiddle ? (i + 1) * perPercent : i * perPercent
        }
      }
    }
    if (_value !== this.val) {
      this.val = _value
    }
  }

  render () {
    const {
      showValue,
      backgroundColor,
      activeColor,
      blockColor,
      name,
      percent,
      val
    } = this
    let blockSize = this.blockSize

    const innerStyles = { backgroundColor }
    const percentage = percent > 100 ? 100 : percent
    const trackStyles = {
      width: `${percentage}%`,
      backgroundColor: activeColor
    }

    if (blockSize < 12) {
      blockSize = 12
    }
    if (blockSize > 28) {
      blockSize = 28
    }

    const handlerStyles = {
      left: `${percentage}%`,
      width: `${blockSize}px`,
      height: `${blockSize}px`,
      backgroundColor: blockColor,
      marginTop: `-${Math.floor(blockSize / 2)}px`,
      marginLeft: `-${Math.floor(blockSize / 2)}px`
    }
    return (
      <Host class='weui-slider-box'>
        <div class='weui-slider'>
          <div class='weui-slider__inner' style={innerStyles} ref={c => (this.sliderInsRef = c!)}>
            <div style={trackStyles} class='weui-slider__track' />
            <div
              class='weui-slider__handler'
              style={handlerStyles}
              onTouchStart={this.handleTouchStart}
              onTouchMove={this.handleTouchMove}
              onTouchEnd={this.handleTouchEnd}
            />
            <input type='hidden' name={name} value={val} />
          </div>
        </div>
        {showValue && <div class='weui-slider-box__value'>{val}</div>}
      </Host>
    )
  }
}
