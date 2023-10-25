import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'
interface FormProps extends StandardProps {
  /** 是否返回 `formId` 用于发送模板消息。
   * @default false
   * @supported weapp, alipay, swan, qq, jd, h5
   */
  reportSubmit?: boolean
  /** 等待一段时间（毫秒数）以确认 `formId` 是否生效。
   * 如果未指定这个参数，`formId` 有很小的概率是无效的（如遇到网络失败的情况）。
   * 指定这个参数将可以检测 `formId` 是否有效，
   * 以这个参数的时间作为这项检测的超时时间。
   * 如果失败，将返回 `requestFormId:fail` 开头的 `formId`。
   * @default 0
   * @supported weapp
   */
  reportSubmitTimeout?: number
  /** 模板消息的类型，report-submit 为 true 时填写有效
   * 取值：default / subscribe
   * @default 'default'
   * @supported swan
   */
  reportType?: string
  /** 发送订阅类模板消息所用的模板库标题 ID ，可通过 getTemplateLibraryList 获取
   * 当参数类型为 Array 时，可传递 1~3 个模板库标题 ID （注：此处填写模板库id。示例：BD0001）
   * @supported swan
   */
  templateId?: string | Array<string>
  /** 发送订阅类模板消息时所使用的唯一标识符，内容由开发者自定义，用来标识订阅场景
   * 注意：同一用户在同一 subscribe-id 下的多次授权不累积下发权限，只能下发一条。若要订阅多条，需要不同 subscribe-id
   * @supported swan
   */
  subscribeId?: string
  /** 用于分发目的。取值：0 或 1，其中 0 表示默认，1 表示留资目标，需要和留资分发配置一起使用，详情见留资分发配置
   * @supported tt
   * @default 0
   */
  conversionTarget?: number
  /** 用于分发目的。开发者在【小程序开发者后台 -> 进入目标小程序 -> 运营 -> 流量配置 -> 抖音 -> 留资分发配置】复制创建的配置 ID，需要和留资分发配置一起使用，详情见留资分发配置
   *
   * @supported tt
   * @default ""
   */
  clueComponentId?: string
  /** 携带 form 中的数据触发 submit 事件
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  onSubmit?: CommonEventFunction<FormProps.onSubmitEventDetail>
  /** 表单重置时会触发 reset 事件
   * @supported weapp, alipay, swan, tt, qq, jd, h5, rn
   */
  onReset?: CommonEventFunction
}
declare namespace FormProps {
  interface onSubmitEventDetail {
    /** 当点击 `<form>` 表单中 `form-type` 为 `submit` 的 `<button>` 组件时，
     * 会将表单组件中的 `value` 值进行提交，
     * 需要在表单组件中加上 `name` 来作为 `key`。
     */
    value?: {
      [formItemName: string]: any
    }
    /** 当 `reportSubmit` 为 `true` 时，返回 `formId` 用于发送模板消息。
     */
    formId?: string
  }
}
/** 表单。将组件内的用户输入的 switch input checkbox slider radio picker 提交。
 *
 * 当点击 form 表单中 form-type 为 submit 的 button 组件时，会将表单组件中的 value 值进行提交，需要在表单组件中加上 name 来作为 key。
 * @classification forms
 * @supported weapp, alipay, swan, tt, qq, jd, h5, rn, harmony
 * @example_react
 * ```tsx
 * class App extends Component {
 *
 *   formSubmit = e => {
 *     console.log(e)
 *   }
 *
 *   formReset = e => {
 *     console.log(e)
 *   }
 *
 *   render () {
 *     return (
 *       <Form onSubmit={this.formSubmit} onReset={this.formReset} >
 *         <View className='example-body'>
 *           <Switch name='switch' className='form-switch'></Switch>
 *         </View>
 *       </Form>
 *     )
 *   }
 * }
 * ```
 * @example_vue
 * ```html
 * <template>
 *   <form `@submit="formSubmit" `@reset="formReset" >
 *       <view class="taro-example-body">
 *         <switch name="switch" class="form-switch"></Switch>
 *       </view>
 *       <view class="taro-example-btns">
 *         <button form-type="submit">Submit</button>
 *         <button type="default" form-type="reset">Reset</button>
 *     </view>
 *   </form>
 * </template>
 *
 * <script>
 * export default {
 *   data() {
 *     return {}
 *   },
 *   methods: {
 *     formSubmit (e) {
 *       console.log(e)
 *     },
 *
 *     formReset (e) {
 *       console.log(e)
 *     }
 *   }
 * }
 * </script>
 * ```
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/form.html
 */
declare const Form: ComponentType<FormProps>
export { Form, FormProps }
