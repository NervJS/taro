/* 这个入口提供给使用require的用户 */

import Taro from './taro/index'
import * as TaroApis from './api/index'

export * from './taro/index'
export * from './api/index'

Object.assign(Taro, TaroApis)

export default Taro
