import { ComponentConfig, Attributes, UnRecursiveTemplate } from '@tarojs/shared/dist/template'
import { components as internalComponents } from './components'

export class Template extends UnRecursiveTemplate {
  Adapter = {
    if: 'if',
    else: 'else',
    elseif: 'elif',
    for: 'for',
    forItem: '',
    forIndex: '',
    key: 'tid',
    xs: '',
    type: 'quickapp'
  }

  protected replacePropName (name, value) {
    name = name.toLowerCase()
    if (name === 'bindlongtap') return 'onlongpress'
    if (value === 'eh') return name.toLowerCase().replace('bind', 'on')
    return name
  }

  protected getEvents () {
    return {
      onclick: 'eh',
      ontouchstart: 'eh',
      ontouchmove: 'eh',
      ontouchend: 'eh',
      ontouchcancel: 'eh',
      onlongpress: 'eh'
    }
  }

  private buildCompTempl (mergedAttributes: Attributes) {
    const Adapter = this.Adapter

    // 给文本标签用
    if (!mergedAttributes.value) {
      mergedAttributes.value = 'i.v'
    }

    const buildAttributesStr = (iName: string) => {
      return Object.keys(mergedAttributes)
        .map(k => {
          if (k === 'value') {
            return `${k}="{{${iName}.v || (${mergedAttributes[k].replace(/i\./g, `${iName}.`)})}}"`
          }
          return `${k}="${k.startsWith('bind') || k.startsWith('on') || k.startsWith('catch') ? mergedAttributes[k] : `{{${mergedAttributes[k].replace(/i\./g, `${iName}.`)}}}`}"`
        })
        .join(' ')
    }

    let templ = ''

    for (let i = 0; i < this.baseLevel; i++) {
      const thisIName = i === 0 ? 'i' : `i${i}`
      const childIName = `i${i + 1}`
      const parentNN = i === 0 ? 'nn' : i === 1 ? 'i.nn' : `i${i - 1}.nn`
      const nodeNameStr = `[${thisIName}.nn, ${parentNN}] | nodeName`
      templ += `
      <component is="{{${nodeNameStr}}}" id="{{${thisIName}.uid}}" ${buildAttributesStr(thisIName)}>
        <block ${Adapter.for}="{{${childIName} in ${thisIName}.cn}}" ${Adapter.key}="uid">`

      if (i === this.baseLevel - 1) {
        templ += `<base i="{{${childIName}}}" nn="{{${thisIName}.nn}}"></base>`
      }
    }
    for (let i = 0; i < this.baseLevel; i++) {
      templ += `
      </block>
    </component>`
    }

    return templ
  }

  public buildTemplate = (componentConfig: ComponentConfig) => {
    if (!this.miniComponents) {
      this.miniComponents = this.createMiniComponents(internalComponents)
    }
    const components = Object.keys(this.miniComponents)
      .filter(c => componentConfig.includes.size && !componentConfig.includeAll ? componentConfig.includes.has(c) : true)

    const mergedAttributes = components.reduce<Attributes>((current, nodeName) => {
      const attributes = this.miniComponents[nodeName]
      return Object.assign(current, attributes)
    }, {})

    const template = `
<import name="base" src="./base"></import>
<template>
${this.buildCompTempl(mergedAttributes)}
</template>
`

    return template
  }

  public buildPageTemplate = (_baseTempPath: string) => {
    const Adapter = this.Adapter

    const template = `
<import name="base" src="./base"></import>
<template>
  <div id="taro-page" style="flex-direction: column;">
    <block ${Adapter.for}="{{root.cn}}" ${Adapter.key}="uid">
      <base i="{{$item}}"></base>
    </block>
  </div>
</template>
`

    return template
  }

  public buildCustomComponentTemplate = (_: string) => {
    throw new Error('快应用不需要生成custom-wrapper')
  }
}
