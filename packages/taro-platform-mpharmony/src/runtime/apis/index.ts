import definition from '@tarojs/plugin-platform-mpharmony/dist/definition.json'
import isMatchWith from 'lodash-es/isMatchWith'
import setWith from 'lodash-es/setWith'

import Taro from './taro'

export * from './taro'
export * from './taro-h5'

let list: Record<string, unknown> | null = null
export function canIUse (scheme = '') {
  /** Note: 此处方法仅作适配使用，用于避免 babel 无法识别的情况，比如通过变量传递的 scheme 等等
   * 同时，此处的 scheme 不包括在编译时写入的 hooks 等方法，故而不支持相关判断
   */
  if (list === null) {
    list = {
      ...definition.apis,
      ...definition.components,
      // canIUse: '*'
    } as Exclude<typeof list, null>
  }
  if (!scheme) return false
  const o = setWith({}, scheme, true, Object)
  return isMatchWith(list, o, (a, b) => {
    if (a === '*' || b === true) return true
  })
}

export default Taro
