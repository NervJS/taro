import { RecursiveTemplate } from '@tarojs/shared/dist/template'

export class Template extends RecursiveTemplate {
  supportXS = false
  Adapter = {
    if: 'ks:if',
    else: 'ks:else',
    elseif: 'ks:elif',
    for: 'ks:for',
    forItem: 'ks:for-item',
    forIndex: 'ks:for-index',
    key: 'ks:key',
    type: 'ks'
  }

  modifyLoopContainer = () => {
    return ''
  }

  modifyLoopBody = () => {
    return ''
  }

  modifyTemplateResult = () => {
    return ''
  }

  buildBaseTemplate () {
    const Adapter = this.Adapter

    if (!this.miniComponents) {
      this.miniComponents = this.createMiniComponents(this.internalComponents)
    }

    const child = Object.keys(this.miniComponents).reduce((acc, item) => {
      let nodeName = ''
      switch (item) {
        case 'slot':
        case 'slot-view':
        case 'catch-view':
        case 'static-view':
        case 'pure-view':
          nodeName = 'view'
          break
        case 'static-text':
          nodeName = 'text'
          break
        case 'static-image':
          nodeName = 'image'
          break
        default:
          nodeName = item
          break
      }
      const componentRecord = this.miniComponents[item]

      const attributesStr = Object.keys(componentRecord)
        .map(item => `${item}="${item.startsWith('bind') || item.startsWith('on') || item.startsWith('catch') ? componentRecord[item] : `{{${componentRecord[item]}}}`}" `)
        .join('')

      if (nodeName === 'cover-view') {
        return `${acc}
        ${this.coverViewTemplate(5)}`
      }

      return `${acc}
      <${nodeName} ks:if="{{i.nn=='${item}'}}" ${attributesStr} id="{{i.uid}}">
       ${nodeName === 'input' ? '' : '<template is="taro_tmpl" data="{{root:i}}" />'}  
      </${nodeName}>`
    }, `<block ks:if="{{i.nn=='#text'}}">
      {{i.v}}
            </block>`)

    return `<template name="taro_tmpl">
              <block ${Adapter.for}="{{root.cn}}" ${Adapter.key}="uid" ks:for-item="i">
               ${child}
              </block>
            </template>`
  }

  /**
   * 解决 cover-view 无法包含 template
   *
   * 无法使用递归模版
   */
  coverViewTemplate (loop: number) {
    const itemContext = `cover${loop}`
    return `
    <cover-view ks:if="{{i.nn=='cover-view'}}" scroll-top="{{i.scrollTop===undefined?false:i.scrollTop}}" bindtouchstart="eh" bindtouchmove="eh" bindtouchend="eh" bindtouchcancel="eh" bindlongtap="eh" style="{{i.st}}" class="{{i.cl}}" bindtap="eh"  id="{{i.uid}}">
      <block ks:for="{{i.cn}}" ks:for-item="${itemContext}">
          <block ks:if="{{${itemContext}.nn=='#text'}}">
              {{${itemContext}.v}}
          </block>
          <cover-view id="{{${itemContext}.uid}}" ks:if="{{${itemContext}.nn=='cover-view'}}" ${this.buildNodeAttr('cover-view', itemContext)}>${loop > 0 ? this.createCoverViewLoopTemplate(loop - 1) : ''}</cover-view > 
          <cover-image id="{{${itemContext}.uid}}" ks:if="{{${itemContext}.nn=='cover-image'}}" ${this.buildNodeAttr('cover-image', itemContext)}> </cover-image > 
      </block>
    </cover-view>
    `
  }

  createCoverViewLoopTemplate (loop: number) {
    const preItemContext = `cover${loop + 1}`
    const itemContext = `cover${loop}`

    return `
    <block ks:for="{{${preItemContext}.cn}}" ks:for-item="${itemContext}">
        <block ks:if="{{${itemContext}.nn=='#text'}}">
            {{${itemContext}.v}}
        </block>
        <cover-view id="{{${itemContext}.uid}}" ks:if="{{${itemContext}.nn=='cover-view'}}" ${this.buildNodeAttr('cover-view', itemContext)}>${loop > 0 ? this.createCoverViewLoopTemplate(loop - 1) : ''}</cover-view > 
        <cover-image id="{{${itemContext}.uid}}" ks:if="{{${itemContext}.nn=='cover-image'}}" ${this.buildNodeAttr('cover-image', itemContext)}> </cover-image > 
    </block>
    `
  }

  /**
   * 默认返回 ```class="{{i.cl}}" style="{{i.sl}}"```
   *
   * @example itemContext='item'
   * class="{{i.cl}}" => class="{{item.cl}}"
   *
   */
  buildNodeAttr (nodeName: string, itemContext?: string) {
    if (!this.miniComponents) {
      this.miniComponents = this.createMiniComponents(this.internalComponents)
    }

    const componentRecord = this.miniComponents[nodeName]

    return Object.keys(componentRecord)
      .map(item => `${item}="${item.startsWith('bind') || item.startsWith('on') || item.startsWith('catch') ? componentRecord[item] : `{{${itemContext ? componentRecord[item].replaceAll('i.', `${itemContext}.`) : componentRecord[item]}}}`}" `)
      .join('')
  }
}
