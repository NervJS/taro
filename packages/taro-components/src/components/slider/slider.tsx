// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, ComponentInterface, Prop, Event, EventEmitter, State, Watch, Host, Element } from '@stencil/core'

@Component({
  tag: 'taro-slider-core'
})
export class Slider implements ComponentInterface {
  private sliderInsRef: HTMLDivElement
  private handler: HTMLDivElement

  @Element() el: HTMLElement

  @Prop() min = 0
  @Prop() max = 100
  @Prop() step = 1
  @Prop() disabled = false
  @Prop({ mutable: true }) value: number | null = 0
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
  function (newVal) {
    const { max, min } = this
    if (newVal !== null && newVal !== this.val) {
      const val = Math.max(min, Math.min(newVal, max))
      this.updateByStep(val)
    }
  }

  componentDidLoad () {
    Object.defineProperty(this.el, 'value', {
      get: () => this.val,
      set: value => (this.value = value),
      configurable: true
    })

    // 在自动化测试时，如果通过 JSX 绑定 touch 事件，
    // 模拟的 touch 事件只会在浏览器的 device mode 下触发，Karma 跑的测试就会跪。
    // 因此改为 didLoad 后 addEventListener 的形式。
    this.handler.addEventListener('touchstart', this.handleTouchStart)
    this.handler.addEventListener('touchmove', this.handleTouchMove)
    this.handler.addEventListener('touchend', this.handleTouchEnd)
  }

  componentDidUpdate () {
    this.value = null
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
    if (value === null) return

    const val = Math.max(min, Math.min(value, max))
    this.updateByStep(val)
  }

  handleTouchStart = (e: TouchEvent) => {
    if (this.touching || this.disabled) return

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
      touchId,
      totalWidth,
      max,
      min,
      ogX,
      ogPercent
    } = this
    if (!touching || disabled) return
    if (e.targetTouches[0].identifier !== touchId) return

    // 阻止默认事件
    e.preventDefault()

    const pageX = e.targetTouches[0].pageX
    const diffX = pageX - ogX

    let percent = diffX / totalWidth * 100 + ogPercent
    percent = Math.max(0, Math.min(percent, 100))
    const val = min + percent * 0.01 * (max - min)

    this.updateByStep(val)

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
    this.touchId = null
    this.ogX = 0
    this.ogPercent = 0
  }

  // 根据步长 step 修改 value
  updateByStep (value: number) {
    const { max, min, step } = this
    const steps = Math.floor((max - min) / step)
    for (let i = 0; i <= steps; i++) {
      const current = min + step * i
      const next = i === steps ? null : min + step * (i + 1)

      if (value === current) break

      if (!next && value > current) {
        // step 不能被 max - min 整除
        value = current
      }

      if (next && value > current && value < next) {
        if (value - current < step / 2) {
          value = current
        } else {
          value = next
        }
        break
      }
    }

    const percent = (value - min) / (max - min) * 100

    this.val = value
    this.percent = percent
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
              ref={dom => {
                if (dom) this.handler = dom
              }}
              style={handlerStyles}
            />
            <input type='hidden' name={name} value={val} />
          </div>
        </div>
        {showValue && <div class='weui-slider-box__value'>{val}</div>}
      </Host>
    )
  }
}
