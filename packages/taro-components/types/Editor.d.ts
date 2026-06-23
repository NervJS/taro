import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface EditorProps extends StandardProps {
  /** 设置编辑器为只读
   * @default false
   * @supported weapp, jd
   */
  readOnly?: boolean
  /** 提示信息
   * @supported weapp, jd
   */
  placeholder?: string
  /** 点击图片时显示图片大小控件
   * @default false
   * @supported weapp, jd
   */
  showImgSize?: boolean
  /** 点击图片时显示工具栏控件
   * @default false
   * @supported weapp, jd
   */
  showImgToolbar?: boolean
  /** 点击图片时显示修改尺寸控件
   * @default false
   * @supported weapp, jd
   */
  showImgResize?: boolean
  /** 编辑器初始化完成时触发
   * @supported weapp, jd
   */
  onReady?: CommonEventFunction
  /** 编辑器聚焦时触发
   * @supported weapp, jd
   */
  onFocus?: CommonEventFunction<EditorProps.editorEventDetail>
  /** 编辑器失去焦点时触发
   * detail = { html, text, delta }
   * @supported weapp, jd
   */
  onBlur?: CommonEventFunction<EditorProps.editorEventDetail>
  /** 编辑器内容改变时触发
   * detail = { html, text, delta }
   * @supported weapp, jd
   */
  onInput?: CommonEventFunction<EditorProps.editorEventDetail>
  /** 通过 Context 方法改变编辑器内样式时触发，返回选区已设置的样式
   * @supported weapp, jd
   */
  onStatusChange?: CommonEventFunction
}
declare namespace EditorProps {
  interface editorEventDetail {
    html
    text
    delta
  }
}
/** 富文本编辑器，可以对图片、文字进行编辑。
 *
 * 编辑器导出内容支持带标签的 html和纯文本的 text，编辑器内部采用 delta 格式进行存储。
 *
 * 通过 setContents 接口设置内容时，解析插入的 html 可能会由于一些非法标签导致解析错误，建议开发者在小程序内使用时通过 delta 进行插入。
 *
 * 富文本组件内部引入了一些基本的样式使得内容可以正确的展示，开发时可以进行覆盖。需要注意的是，在其它组件或环境中使用富文本组件导出的 html 时，需要额外引入 这段样式，并维护 `<ql-container><ql-editor></ql-editor></ql-container>` 的结构。
 *
 * 图片控件仅初始化时设置有效。
 *
 * *编辑器内支持部分 HTML 标签和内联样式，不支持 **class** 和 **id***
 * @classification forms
 * @supported weapp, jd
 * @example_react
 * ```tsx
 * class App extends Components {
 *   state = {
 *     placeholder: '来，输入隔壁的名字试试...'
 *   }
 *
 *   editorReady = e => {
 *     Taro.createSelectorQuery().select('#editor').context((res) => {
 *       this.editorCtx = res.context
 *     }).exec()
 *   }
 *
 *   undo = e => {
 *     this.editorCtx.undo()
 *   }
 *
 *   render () {
 *     return (
 *       <View>
 *         <Editor id='editor' className='editor' placeholder={this.state.placeholder} onReady={this.editorReady}></Editor>
 *         <Button type='warn' onClick={this.undo}>撤销</Button>
 *       </View>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <view class="container">
 *     <editor id="editor" class="editor" :placeholder="placeholder" `@ready="editorReady"></editor>
 *     <button type="warn" `@tap="undo">撤销</button>
 *   </view>
 * </template>
 *
 * <script>
 *   import Taro from '@tarojs/taro'
 *   export default {
 *     data() {
 *       return {
 *         placeholder: '来，输入隔壁的名字试试...'
 *       }
 *     },
 *     methods: {
 *       editorReady() {
 *         Taro.createSelectorQuery().select('#editor').context((res) => {
 *           this.editorCtx = res.context
 *         }).exec()
 *       },
 *       undo() {
 *         this.editorCtx.undo()
 *       }
 *     }
 *   }
 * </script>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/editor.html
 */
declare const Editor: ComponentType<EditorProps>
export { Editor, EditorProps }
