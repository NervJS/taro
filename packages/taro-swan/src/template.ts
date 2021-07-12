import { RecursiveTemplate, isArray, Shortcuts } from '@tarojs/shared'

const swanSpecialAttrs = {
  'scroll-view': ['scrollTop', 'scrollLeft', 'scrollIntoView'],
  'movable-view': ['x', 'y'],
  slider: ['value'],
  input: ['value'],
  textarea: ['value']
}

export class Template extends RecursiveTemplate {
  supportXS = true
  Adapter = {
    if: 's-if',
    else: 's-else',
    elseif: 's-elif',
    for: 's-for',
    forItem: 's-for-item',
    forIndex: 's-for-index',
    key: 's-key',
    xs: 'sjs',
    type: 'swan'
  }

  buildXsTemplate () {
    return '<import-sjs module="xs" src="./utils.sjs" />'
  }

  dataKeymap (keymap: string) {
    return `{ ${keymap} }`
  }

  getAttrValue (value: string, key: string, nodeName: string) {
    if (isArray(swanSpecialAttrs[nodeName]) && swanSpecialAttrs[nodeName].includes(key)) {
      return `= ${value} =`
    }

    return `{ ${value} }`
  }

  modifyLoopBody = (child: string, nodeName: string) => {
    if (nodeName === 'text' || nodeName === 'static-text') {
      return `<block>{{ i.${Shortcuts.Childnodes}[index].${Shortcuts.Text} }}</block>`
    }

    if (nodeName === 'picker-view') {
      return `<picker-view-column name="{{ item.name }}" style="{{ item.st }}" class="{{ item.cl }}" bindtap="eh"  id="{{item.uid}}">
        <block s-for="{{item.cn}}" s-key="uid">
          ${child}
        </block>
      </picker-view-column>`
    }

    if (nodeName === 'video') {
      const adComponent = this.miniComponents.ad

      const attributesStr = Object.keys(adComponent)
        .map(k => `${k}="${k.startsWith('bind') || k.startsWith('on') || k.startsWith('catch') ? adComponent[k] : `{{${adComponent[k].replace('i.', 'item.')}}}`}" `)
        .join('')
      return `<ad s-if={{item.nn==='ad'}} ${attributesStr} id="{{item.uid}}"></ad>
          <template s-if={{item.nn!='ad'}} is="{{xs.e(0)}}" data="{{{ i:item }}}" />`
    }

    return child
  }

  modifyTemplateResult = (res: string, nodeName: string) => {
    if (nodeName === 'picker-view-column') return ''
    if (nodeName === 'input') {
      return res.replace(/ id="{{i.uid}}"/g, 'id="{{xs.f(i.uid)}}"')
    }
    return res
  }
}
