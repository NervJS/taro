import { ComponentType } from 'react'
import { StandardProps } from './common'

interface MatchMediaProps extends StandardProps {
  /** 页面最小宽度（ px 为单位）
   * @supported weapp
   */
  minWidth?:	number

  /** 页面最大宽度（ px 为单位）
   * @supported weapp
   */
  maxWidth?: number

  /** 页面宽度（ px 为单位）
   * @supported weapp
   */
  width?: number

  /** 页面最小高度（ px 为单位）
   * @supported weapp
   */
  minHeight?: number

  /** 页面最大高度（ px 为单位）
   * @supported weapp
   */
  maxHeight?: number

  /** 页面高度（ px 为单位）
   * @supported weapp
   */
  height?: number

  /** 屏幕方向（ landscape 或 portrait ）
   * @supported weapp
   */
  orientation?: string
}

/** media query 匹配检测节点。可以指定一组 media query 规则，满足时，这个节点才会被展示。
 * 通过这个节点可以实现“页面宽高在某个范围时才展示某个区域”这样的效果。
 * 基础库 2.11.1 开始支持。
 * @supported weapp
 * @example
 * ```tsx
 * class App extends Components {
 *   render () {
 *     return (
 *        <MatchMedia minWidth='400'>
            <View>title</View>
          </MatchMedia>
 *     )
 *   }
 * }
 * ```
 */
declare const MatchMedia: ComponentType<MatchMediaProps>

export { MatchMedia, MatchMediaProps }
