import { ComponentType } from 'react'

import { StandardProps } from './common'

interface ScriptProps extends StandardProps {
  /** xs 文件的相对路径
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  src: string
  /** xs 模块名
   * @supported weapp, alipay, swan, tt, qq, jd
   */
  module: string
}

/** script 类似微信小程序的 wxs 标签，支持引用各种小程序的 xs 文件
 * 只能在 CompileMode 中使用
 * @classification viewContainer
 * @supported weapp, swan, alipay, tt, jd, qq
 * @example_react
 * ```tsx
 * import { Component } from 'react'
 * import { View, Script } from '@tarojs/components'
 *
 * export function Index () {
 *   return (
 *     <View compileMode>
 *       <Script src="./logic.wxs" module="logic"></Script>
 *       <Text>Hello, {logic.name}!</Text>
 *     </View>
 *   )
 * }
 * ```
 */
declare const Script: ComponentType<ScriptProps>

export { Script, ScriptProps }
