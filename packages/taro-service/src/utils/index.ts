import { merge } from 'lodash'

import { PluginItem } from '@tarojs/taro/types/compile'

import { presetOrPluginPrefixReg, PluginType, PluginNamePrefix } from './constants'

export function convertPluginsToObject (items: PluginItem[]) {
  return (type: PluginType) => {
    const obj = {}
    items.forEach(item => {
      if (typeof item === 'string') {
        const name = presetOrPluginPrefixReg.test(item) ? item : `${PluginNamePrefix[type]}${item}`
        obj[name] = null
      } else if (Array.isArray(item)) {
        const name = presetOrPluginPrefixReg.test(item[0]) ? item[0] : `${PluginNamePrefix[type]}${item[0]}`
        obj[name] = item[1]
      }
    })
    return obj
  }
}

export function mergePlugins (dist: PluginItem[], src: PluginItem[]) {
  return (type: PluginType) => {
    const srcObj = convertPluginsToObject(src)(type)
    const distObj = convertPluginsToObject(dist)(type)
    return merge(srcObj, distObj)
  }
}
