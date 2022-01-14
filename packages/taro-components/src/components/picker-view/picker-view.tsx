// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host, Element, Prop, Event, EventEmitter, Listen } from '@stencil/core'

@Component({
  tag: 'taro-picker-view-core',
  styleUrl: './style/index.scss'
})

export class PickerView {
  private indicator: HTMLDivElement | undefined

  @Element() el: HTMLElement

  @Prop() indicatorStyle: string
  @Prop() indicatorClass: string

  @Prop() value: number[]

  @Prop() maskStyle: string
  @Prop() maskClass: string

  @Event({
    eventName: 'change'
  })
  onChange: EventEmitter

  @Event() onPickStart: EventEmitter
  @Event() onPickEnd: EventEmitter

  @Listen('col-select')
  function(e: CustomEvent<{ curIndex: string, selectedIndex: string }>) {
    e.stopPropagation()
    if ((e.target as Element).tagName !== 'TARO-PICKER-VIEW-COLUMN-CORE') return
    let _curIndex: number = +e.detail.curIndex
    let _selectedIndex = +e.detail.selectedIndex
    this.value[_curIndex] = _selectedIndex
    this.onChange.emit({ value: this.value })
  }
  componentDidLoad() {
    const childList = this.el.querySelectorAll('taro-picker-view-column-core')
    childList.forEach((element, index) => {
      element.setAttribute('tag', `${index}`)
      let selectindex = '0'
      if (!!this.value && this.value.length > index) {
        selectindex = `${this.value[index]}`
      }
      let indicatorHeight: number = this.indicator?.clientHeight || 0
      let paddingtop = (this.el.clientHeight - indicatorHeight) / 2.0
      element.setAttribute('initselectindex', `${selectindex}`)
      element.setAttribute('paddingtop', `${paddingtop}`)
    })
  }

  /// 过滤非PickerViewColumn组件
  componentDidRender() {
    this.el.childNodes.forEach(item => {
      let childEle = (item as Element)
      if ('TARO-PICKER-VIEW-COLUMN-CORE' !== childEle.tagName && childEle.className !== '_picker-view-mask-container') {
        this.el.removeChild(item)
      }
    })
  }
  render() {
    return (
      <Host class="_picker-view-container">
        <slot />
        <div class='_picker-view-mask-container'>
          <div class='_picker-view-mask-top' />
          <div class='_picker-view-mask-indicator' ref={indicator => this.indicator = indicator} />
          <div class='_picker-view-mask-bottom' />
        </div>
      </Host>
    )
  }
}
