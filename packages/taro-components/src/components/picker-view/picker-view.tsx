// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, h, Host, Element, Prop, Event, EventEmitter, Listen } from '@stencil/core'
import classNames from 'classnames'
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

  @Listen('col-pick-start')
  colPickStart(e: CustomEvent<{ curIndex: string, selectedIndex: string }>) {
    e.stopPropagation()
    if ((e.target as Element).tagName !== 'TARO-PICKER-VIEW-COLUMN-CORE') return
    this.onPickStart.emit()
  }

  @Listen('col-pick-end')
  colPickEnd(e: CustomEvent<{ curIndex: string, selectedIndex: string }>) {
    e.stopPropagation()
    if ((e.target as Element).tagName !== 'TARO-PICKER-VIEW-COLUMN-CORE') return
    this.onPickEnd.emit()
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
      let paddingtop = (this.getPickerViewHeight() - indicatorHeight) / 2.0
      element.setAttribute('initselectindex', `${selectindex}`)
      element.setAttribute('paddingtop', `${paddingtop}`)
    })
  }

  // 获取控件的高度
  getPickerViewHeight(): number {
    return this.el.getBoundingClientRect().height;
  }

  // style字符串转map结构
  convertStyleToObject(style: string | undefined): { [key: string]: string | undefined; } | undefined {
    if (style) {
      let regex = /([\w-]*)\s*:\s*([^;]*)/g;
      let match;
      let properties: { [key: string]: string | undefined; } = {};
      while (match = regex.exec(style)) properties[`${match[1]}`] = match[2].trim();
      return properties
    }
  }

  // 过滤非PickerViewColumn组件
  componentDidRender() {
    this.el.childNodes.forEach(item => {
      let childEle = (item as Element)
      if ('TARO-PICKER-VIEW-COLUMN-CORE' !== childEle.tagName && childEle.className !== '_picker-view-mask-container') {
        this.el.removeChild(item)
      }
    })
  }

  /// 返回一个元素
  getCssStyleFrom(originClass: string, newClass: string | undefined, newStyle: string | undefined): [string, {
    [key: string]: string | undefined;
  } | undefined] {

    const params = {
      [`${originClass}`]: true,
    }
    if (!!newClass && newClass !== '') {
      params[`${newClass}`] = true
    }
    const cls = classNames(params)
    const style = this.convertStyleToObject(newStyle);

    return [cls, style];
  }

  render() {

    const indicatorStyle = this.getCssStyleFrom('_picker-view-mask-indicator', this.indicatorClass, this.indicatorStyle);
    const maskTopStyle = this.getCssStyleFrom('_picker-view-mask-top', this.maskClass, this.maskStyle);
    const maskBottomStyle = this.getCssStyleFrom('_picker-view-mask-bottom', this.maskClass, this.maskStyle);

    return (
      <Host class="_picker-view-container">
        <slot />
        <div class='_picker-view-mask-container'>
          <div class={maskTopStyle[0]} style={maskTopStyle[1]} />
          <div class={indicatorStyle[0]} style={indicatorStyle[1]} ref={indicator => this.indicator = indicator} />
          <div class={maskBottomStyle[0]} style={maskBottomStyle[1]} />
        </div>
      </Host>
    )
  }
}
