import { Component, h, ComponentInterface, Prop, Host } from '@stencil/core'

@Component({
  tag: 'taro-progress-core'
})
export class Progress implements ComponentInterface {
  @Prop() percent = 0
  @Prop() showInfo = false
  @Prop() borderRadius: number | string = 0
  @Prop() fontSize: number | string = 16
  @Prop() strokeWidth: number | string = 6
  @Prop() activeColor = '#09BB07'
  @Prop() backgroundColor = '#EBEBEB'
  @Prop() active = false

  render () {
    const {
      percent,
      showInfo,
      borderRadius,
      fontSize,
      strokeWidth,
      activeColor,
      backgroundColor,
      active
    } = this

    const pgPercent = percent > 100 ? 100 : percent < 0 ? 0 : percent
    const pgHeight = {
      height: strokeWidth + 'px',
      backgroundColor
    }
    const transition = active ? 'width 1s ease-in-out' : 'none'
    const pgWidth = {
      width: `${pgPercent}%`,
      transition,
      WebkitTransition: transition,
      backgroundColor: activeColor,
      borderRadius: borderRadius ? `${borderRadius}px` : '0px'
    }

    return (
      <Host class='weui-progress'>
        <div class='weui-progress__bar' style={pgHeight}>
          <div class='weui-progress__inner-bar' style={pgWidth} />
        </div>

        {showInfo && (
          <div class='weui-progress__opr' style={{ 'font-size': `${fontSize}px` }}>
            <span>{pgPercent}%</span>
          </div>
        )}
      </Host>
    )
  }
}
