import { internalComponents, isString } from '@tarojs/shared'

export function makeMap (
  str: string,
  expectsLowerCase?: boolean
): (key: string) => boolean {
  const map: Record<string, boolean> = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val]
}

export const specialMiniElements = {
  img: 'image',
  iframe: 'web-view'
}

interface SpecialMap {
  mapName: (props: Record<string, string | boolean>) => string
}

const specialElements = new Map<string, SpecialMap>([
  ['a', {
    mapName (props) {
      if (props.as && isString(props.as)) return props.as.toLowerCase()
      return !props.href || isString(props.href) && (/^javascript/.test(props.href)) ? 'view' : 'navigator'
    }
  }],
])

export const getSpecialElementMapping = (tag: string, expectsLowerCase:boolean = true) => {
  tag = expectsLowerCase ? tag.toLowerCase() : tag
  return specialElements.get(tag)
}


const internalCompsList = Object.keys(internalComponents)
  .map(i => i.toLowerCase())
  .join(',')

// https://developers.weixin.qq.com/miniprogram/dev/component
export const isMiniElements = makeMap(internalCompsList, true)

// https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements
export const isInlineElements = makeMap('i,abbr,iframe,select,acronym,slot,small,span,bdi,kbd,strong,big,map,sub,sup,br,mark,mark,meter,template,canvas,textarea,cite,object,time,code,output,u,data,picture,tt,datalist,var,dfn,del,q,em,s,embed,samp,b', true)

// https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
export const isBlockElements = makeMap('address,fieldset,li,article,figcaption,main,aside,figure,nav,blockquote,footer,ol,details,form,p,dialog,h1,h2,h3,h4,h5,h6,pre,dd,header,section,div,hgroup,table,dl,hr,ul,dt', true)

// specialElements
export const isSpecialElements = makeMap('a', true)