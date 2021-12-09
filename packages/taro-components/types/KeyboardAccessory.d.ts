import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

type KeyboardAccessoryProps = StandardProps

/** 设置 input / textarea 聚焦时键盘上方 cover-view / cover-image 工具栏视图
 *
 * @classification forms
 * @supported weapp
 * @example
 * ```tsx
 * class App extends Component {
 *   render () {
 *     return (
 *         <Textarea holdKeyboard="{{true}}">
 *           <KeyboardAccessory className="container" style={{ height: 50 }} >
 *             <CoverView onClick={() => { TODO }} style={{ flex: 1, background: 'green' }}>1</CoverView>
 *             <CoverView onClick={() => { TODO }} style={{ flex: 1, background: 'red' }}>2</CoverView>
 *           </KeyboardAccessory>
 *         </Textarea>
 *     )
 *   }
 * }
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/keyboard-accessory.html
 */
declare const KeyboardAccessory: ComponentType<KeyboardAccessoryProps>

export { KeyboardAccessory, KeyboardAccessoryProps }
