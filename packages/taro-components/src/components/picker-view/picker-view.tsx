import { Component, h, Host, Element, Prop, Event, EventEmitter, Listen } from '@stencil/core'
import classNames from 'classnames'

import { convertStyle } from '../../utils'

@Component({
  tag: 'taro-picker-view-core',
  styleUrl: './style/index.scss'
})
export class PickerView {
  private indicator: HTMLDivElement | undefined
  // 当前ref
  @Element() el: HTMLElement
  // 指示标的样式
  @Prop() indicatorStyle: string
  @Prop() indicatorClass: string

  // 初始化的数据
  @Prop() value: number[]

  // 蒙层特效
  @Prop() maskStyle: string

  // 蒙层特效
  @Prop() maskClass: string

  // 外部回调
  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  @Event({
    eventName: 'pickstart'
  })
  onPickStart: EventEmitter

  @Event({
    eventName: 'pickend'
  })
  onPickEnd: EventEmitter

  @Listen('onselect')
  onSelect(e: CustomEvent<{ curIndex: string; selectedIndex: string }>) {
    e.stopPropagation()
    if ((e.target as Element).tagName !== 'TARO-PICKER-VIEW-COLUMN-CORE') return
    let _curIndex: number = +e.detail.curIndex
    let _selectedIndex = +e.detail.selectedIndex
    this.value[_curIndex] = _selectedIndex
    this.onChange.emit({ value: this.value })
  }

  @Listen('onselectstart')
  onSelectStart(e: CustomEvent<{ curIndex: string; selectedIndex: string }>) {
    e.stopPropagation()
    if ((e.target as Element).tagName !== 'TARO-PICKER-VIEW-COLUMN-CORE') return
    this.onPickStart.emit()
  }

  @Listen('onselectend')
  onPickerColEnd(e: CustomEvent<{ curIndex: string; selectedIndex: string }>) {
    e.stopPropagation()
    if ((e.target as Element).tagName !== 'TARO-PICKER-VIEW-COLUMN-CORE') return
    this.onPickEnd.emit()
  }

  componentDidLoad() {
    const childList = this.el.querySelectorAll('taro-picker-view-column-core')
    childList.forEach((element, index) => {
      element.setAttribute('col', `${index}`)
      let selectIndex = '0'
      if (!!this.value && this.value.length > index) {
        selectIndex = `${this.value[index]}`
      }
      const pickerHeight = this.el.getBoundingClientRect().height
      const indicatorHeight = this.indicator?.offsetHeight || 0
      const paddingVertical = (pickerHeight - indicatorHeight) / 2.0
      element.setAttribute('initial-position', `${selectIndex}`)
      element.setAttribute('padding-vertical', `${paddingVertical}`)
    })
  }

  // 过滤非 PickerViewColumn 组件
  componentDidRender() {
    this.el.childNodes.forEach(item => {
      const childEle = item as HTMLElement
      if (
        'TARO-PICKER-VIEW-COLUMN-CORE' !== childEle.tagName &&
        childEle.className !== 'taro-picker-view-mask-container'
      ) {
        this.el.removeChild(item)
      }
    })
  }

  render() {
    const indicatorCls = classNames('taro-picker-view-mask-indicator', this.indicatorClass)
    const maskTopCls = classNames('taro-picker-view-mask-top', this.maskClass)
    const maskBtmCls = classNames('taro-picker-view-mask-bottom', this.maskClass)
    const indicatorStyle = convertStyle(this.indicatorStyle)
    const maskTopStyle = convertStyle(this.maskStyle)
    const maskBottomStyle = convertStyle(this.maskStyle)

    return (
      <Host class="taro-picker-view-container">
        <slot />
        <div class="taro-picker-view-mask-container">
          <div class={maskTopCls} style={maskTopStyle} />
          <div class={indicatorCls} style={indicatorStyle} ref={indicator => (this.indicator = indicator)} />
          <div class={maskBtmCls} style={maskBottomStyle} />
        </div>
      </Host>
    )
  }
}
