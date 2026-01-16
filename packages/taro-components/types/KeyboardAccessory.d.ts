import { ComponentType } from 'react'
import { StandardProps } from './common'

/** @ignore */
type KeyboardAccessoryProps = StandardProps

/** 设置 Input / Textarea 聚焦时键盘上方 CoverView / CoverImage 工具栏视图。需要配置 Taro 插件 `@tarojs/plugin-platform-weapp` 的 `enablekeyboardAccessory` 参数为 `true` 后才能使用，请参考：[#9548](https://github.com/NervJS/taro/issues/9548#issuecomment-891682216)。
 *
 * @classification forms
 * @supported weapp
 * @example
 * ```js
 * // config/index.js
 * {
 *   // ...
 *   plugins: [
 *     ['@tarojs/plugin-platform-weapp', {
 *       enablekeyboardAccessory: true
 *     }]
 *   ]
 * }
 * ```
 *
 * ```tsx
 * class App extends Component {
 *   render () {
 *     return (
 *       <Textarea holdKeyboard="{{true}}">
 *         <KeyboardAccessory className="container" style={{ height: 50 }} >
 *           <CoverView onClick={() => { TODO }} style={{ flex: 1, background: 'green' }}>1</CoverView>
 *           <CoverView onClick={() => { TODO }} style={{ flex: 1, background: 'red' }}>2</CoverView>
 *         </KeyboardAccessory>
 *       </Textarea>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/keyboard-accessory.html
 */
declare const KeyboardAccessory: ComponentType<KeyboardAccessoryProps>

export { KeyboardAccessory, KeyboardAccessoryProps }
