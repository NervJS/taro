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

// https://developers.weixin.qq.com/miniprogram/dev/component
export const isMiniElements = makeMap('input,canvas,progress,video,audio,form', true)

// https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements
export const isInlineElements = makeMap('a,i,abbr,iframe,select,acronym,slot,small,bdi,kbd,strong,big,map,sup,br,mark,mark,meter,template,canvas,textarea,cite,object,time,code,output,u,data,picture,tt,datalist,var,dfn,del,q,em,s,embed,samp', true)

// https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements
export const isBlockElements = makeMap('address,fieldset,li,article,figcaption,main,aside,figure,nav,blockquote,footer,ol,details,form,p,dialog,h1,h2,h3,h4,h5,h6,pre,dd,header,section,div,hgroup,table,dl,hr,ul,dt', true)
