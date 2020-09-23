/* 拆出这个文件的原因是 import 和 module.exports 不能一起使用
 * 使用 module.exports = taro 的原因是希望用户可以这样调用：
 *   import { request } from '@tarojs/taro'
 * request 是 initNativeApi 动态加入的，只能利用 module.exports = taro 实现
 * 不用 require 是为了 runtime 包可以被 tree shaking
 **/

import { CurrentReconciler } from '@tarojs/runtime'
import taro from './dist/index.esm'

if (typeof CurrentReconciler.initNativeApi === 'function') {
  CurrentReconciler.initNativeApi(taro)
}

export default taro
