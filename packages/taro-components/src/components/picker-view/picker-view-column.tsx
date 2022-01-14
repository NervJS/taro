// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host, Listen, Element, Event, EventEmitter, Prop } from '@stencil/core'

@Component({
  tag: 'taro-picker-view-column-core',
  styleUrl: './style/index.scss'
})
export class PickerViewColumn {

  @Element() el: HTMLElement

  @Prop() tag: string

  @Prop() initselectindex: string

  @Event({ eventName: 'col-select' }) onChange: EventEmitter

  private isMove: boolean = false

  @Prop() paddingtop: string

  @Listen('mousedown')
  onMouseDown() {
    this.isMove = true
  }

  @Listen('mouseleave')
  onMouseMoveEnd() {
    if (!this.isMove) return

    this.isMove = false
    this.handleMoveEnd()
  }

  @Listen('touchend')
  onTouchEnd() {
    this.handleMoveEnd()
  }

  handleMoveEnd() {
    const childList = this.el.querySelectorAll('taro-view-core')
    let element = this.el
    let scrollTop = element.scrollTop
    let sum = 0
    let selectedIndex: string = '0'
    for (const index in childList) {
      let item = element.childNodes[index];
      let itemElm = item as Element
      let itemHeight = itemElm.clientHeight
      if ((sum + itemHeight / 2.0) > scrollTop) {
        selectedIndex = index
        break
      }
      sum += itemHeight
    }
    element.scrollTo({
      top: sum,
      behavior: 'smooth'
    })
    this.onChange.emit({
      curIndex: this.tag,
      selectedIndex: selectedIndex
    })
  }
  /// 过滤非PickerViewColumn组件
  componentDidRender() {
    if (!!this.initselectindex) {
      const childList = this.el.querySelectorAll('taro-view-core')
      let element = this.el
      let sum = 0
      for (const index in childList) {
        let item = element.childNodes[index];
        let itemElm = item as Element
        let itemHeight = itemElm.clientHeight
        if (this.initselectindex === index) {
          break
        }
        sum += itemHeight
      }
      element.scrollTo({ top: sum })
    }
  }

  render() {
    const { paddingtop } = this;
    return (
      <Host class="_picker-view-column-container" style={{ 'paddingTop': `${paddingtop}px` }} />
    )
  }
}
