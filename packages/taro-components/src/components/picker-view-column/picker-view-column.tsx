// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host, Listen, Element, Event, EventEmitter, Prop } from '@stencil/core'

@Component({
  tag: 'taro-picker-view-column-core',
  styleUrl: './style/index.scss'
})
export class PickerViewColumn {

  // 当前ref
  @Element() el: HTMLElement

  // 标记属于pickver第几列
  @Prop() tag: string

  // 初始化的选中位置
  @Prop() initselectindex: string

  // 选中后的结果回调
  @Event({ eventName: 'col-select' }) onChange: EventEmitter

  @Event({ eventName: 'col-pick-start' }) colPickStart: EventEmitter
  @Event({ eventName: 'col-pick-end' }) colPickEnd: EventEmitter

  // 是否正在拖动
  private isMove: boolean = false

  // 滑动距离上下留白区域-通过父视图和indicator计算而来
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

  @Listen('touchstart')
  onTouchStart() {
    this.colPickStart.emit()
  }

  @Listen('touchend')
  onTouchEnd() {
    this.handleMoveEnd()
  }

  @Listen('touchcancel')
  onTouchCancel() {
    this.handleMoveEnd()
  }

  // 滚动结束自动回到合适的位置
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
    this.colPickEnd.emit()
  }

  /// 过滤非taro-view-core组件 - 目前pick-column-view内需要用View包一层
  componentWillLoad() {
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
      <Host class="_picker-view-column-container" style={{ 'paddingTop': `${paddingtop}px`, 'paddingBottom': `${paddingtop}px` }}>

      </Host>
    )
  }
}
