import { isString } from '@tarojs/shared'

interface SpecialMaps {
  mapName: string | SpecialMaps.MapNameFn
  mapNameCondition?: string[]
  mapAttr?: SpecialMaps.MapAttrFn
}

export namespace SpecialMaps {
  export interface MapNameFn {
    (props: Record<string, any>): string
  }
  export interface MapAttrFn {
    (key: string, value: any, props: Record<string, any>): [string, any]
  }
}

function genAttrMapFnFromDir (dir: Record<string, string | [string, Record<string, any>]>): SpecialMaps.MapAttrFn {
  const fn: SpecialMaps.MapAttrFn = function (key, value) {
    key = key.toLowerCase()
    if (key in dir) {
      const res = dir[key]
      if (isString(res)) {
        key = res
      } else {
        key = res[0]
        value = res[1][value] || value
      }
    }
    return [key, value]
  }
  return fn
}

export const inlineElements = new Set<string>([])
export const blockElements = new Set<string>([])
export const specialElements = new Map<string, string | SpecialMaps>([
  ['slot', 'slot'],
  ['form', 'form'],
  ['iframe', 'web-view'],
  ['img', 'image'],
  ['audio', 'audio'],
  ['video', 'video'],
  ['canvas', 'canvas'],
  ['a', {
    mapName (props) {
      return !props.href || (/^javascript/.test(props.href)) ? 'view' : 'navigator'
    },
    mapNameCondition: ['href'],
    mapAttr: genAttrMapFnFromDir({
      href: 'url',
      target: ['openType', {
        _blank: 'navigate',
        _self: 'redirect'
      }]
    })
  }],
  ['input', {
    mapName (props) {
      if (props.type === 'checkbox') {
        return 'checkbox'
      } else if (props.type === 'radio') {
        return 'radio'
      }
      return 'input'
    },
    mapNameCondition: ['type'],
    mapAttr (key, value, props) {
      key = key.toLowerCase()
      if (key === 'autofocus') {
        key = 'focus'
      } else if (key === 'readonly') {
        if (props.disabled === true) {
          value = true
        }
        key = 'disabled'
      } else if (key === 'type') {
        if (value === 'password') {
          key = 'password'
          value = true
        } else if (value === 'tel') {
          value = 'number'
        }
      }
      return [key, value]
    }
  }],
  ['label', {
    mapName: 'label',
    mapAttr: genAttrMapFnFromDir({
      htmlfor: 'for'
    })
  }],
  ['textarea', {
    mapName: 'textarea',
    mapAttr: genAttrMapFnFromDir({
      autofocus: 'focus',
      readonly: 'disabled'
    })
  }],
  ['progress', {
    mapName: 'progress',
    mapAttr (key, value, props) {
      if (key === 'value') {
        const max = props.max || 1
        key = 'percent'
        value = Math.round(value / max * 100)
      }
      return [key, value]
    }
  }],
  ['button', {
    mapName: 'button',
    mapAttr (key, value) {
      if (key === 'type' && (value === 'submit' || value === 'reset')) {
        key = 'formType'
      }
      return [key, value]
    }
  }]
])
