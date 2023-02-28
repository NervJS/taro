import { Component, h, Host, Listen, Element, Event, EventEmitter, Prop, State } from '@stencil/core'

import { debounce } from '../../utils'

@Component({
  tag: 'taro-picker-view-column-core',
  styleUrl: './style/column.scss'
})
export class PickerViewColumn {
  // 当前 ref
  @Element() el: HTMLElement

  // 标记属于 picker 第几列
  @Prop() col: string

  // 初始化的选中位置
  @Prop({ attribute: 'initial-position' }) initialPosition = '0'

  // 滑动距离上下留白区域-通过父视图和 indicator 计算而来
  @Prop({ attribute: 'padding-vertical' }) paddingVertical = 0

  @State()
  isInit: boolean = false

  @State()
  isMove: boolean = false

  // 选中后的结果回调
  @Event({ eventName: 'onselect' }) onChange: EventEmitter
  @Event({ eventName: 'onselectstart' }) onSelectStart: EventEmitter
  @Event({ eventName: 'onselectend' }) onSelectEnd: EventEmitter

  @Listen('scroll')
  onScroll(_event: UIEvent) {
    if (!this.isMove) {
      this.isMove = true
      this.onSelectStart.emit()
    }
    this.handleSelected()
  }

  @Listen('mouseup')
  @Listen('mouseout')
  @Listen('mouseleave')
  onMouseEnd() {
    if (!this.isMove) return
    this.isMove = false
    this.handleSelected()
  }

  @Listen('touchend')
  onTouchEnd() {
    this.isMove = false
    this.handleSelected()
  }

  componentDidUpdate() {
    if (!this.isInit) {
      this.isInit = true
      const childList = this.el.childNodes
      let idx = 0
      let sum = 0
      for (const index in childList) {
        const item = childList[index] as HTMLElement
        if (this.initialPosition === index || !item || typeof item.offsetHeight !== 'number') {
          break
        }
        sum += item.offsetHeight
        idx++
      }
      this.el.scrollTo({ top: sum })
      if (idx >= childList.length) {
        this.onChange.emit({
          curIndex: this.col,
          selectedIndex: idx - 1
        })
      }
    }
  }

  // 滚动结束自动回到合适的位置
  handleSelected = debounce(() => {
    const childList = this.el.childNodes
    let sum = 0
    let selectedIndex: string = '0'
    for (const index in childList) {
      const item = childList[index] as HTMLElement
      const itemHeight = item.offsetHeight
      if (sum + itemHeight / 2.0 > this.el.scrollTop) {
        selectedIndex = index
        break
      }
      sum += itemHeight
    }

    this.el.scrollTo({
      top: sum,
      behavior: 'smooth'
    })
    this.onChange.emit({
      curIndex: this.col,
      selectedIndex: selectedIndex
    })
    this.onSelectEnd.emit()
  }, 500)

  render() {
    const { paddingVertical = 0 } = this
    return (
      <Host
        class="taro-picker-view-column-container"
        style={{ 'padding-top': `${paddingVertical}px`, 'padding-bottom': `${paddingVertical}px` }}
      />
    )
  }
}
