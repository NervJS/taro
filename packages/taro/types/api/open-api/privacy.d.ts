import Taro from '../../index'

declare module '../../index' {
  namespace getPrivacySetting {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 是否需要用户授权隐私协议（如果开发者没有在[mp后台-设置-服务内容声明-用户隐私保护指引]中声明隐私收集类型则会返回false；如果开发者声明了隐私收集，且用户之前同意过隐私协议则会返回false；如果开发者声明了隐私收集，且用户还没同意过则返回true；如果用户之前同意过、但后来小程序又新增了隐私收集类型也会返回true） */
      needAuthorization: boolean
      /** 隐私授权协议的名称 */
      privacyContractName: string
    }
  }

  namespace requirePrivacyAuthorize {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: TaroGeneral.CallbackResult) => void
    }
  }

  namespace openPrivacyContract {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: TaroGeneral.CallbackResult) => void
    }
  }

  namespace onNeedPrivacyAuthorization {
    /**
     * resolve 是 onNeedPrivacyAuthorization 的回调参数，是一个接口函数。
     * 当触发 needPrivacyAuthorization 事件时，触发该事件的隐私接口或组件会处于 pending 状态。
     * 如果调用 resolve({ buttonId: 'disagree-btn'， event:'agree' })，则触发当前 needPrivacyAuthorization 事件的原隐私接口或组件会继续执行。其中 buttonId 为隐私同意授权按钮的id，为确保用户有同意的操作，基础库会检查对应的同意按钮是否被点击过。
     * 如果调用 resolve({ event: 'disagree' })，则触发当前 needPrivacyAuthorization 事件的原隐私接口或组件会失败并返回 API:fail privacy permission is not authorized 的错误信息。
     * 在调用 resolve({ event: 'agree'/'disagree' }) 之前，开发者可以调用 resolve({ event: 'exposureAuthorization' }) 把隐私弹窗曝光告知平台。
     */
    interface ResolveOption {
      /** 用户操作类型 */
      event: 'exposureAuthorization' | 'agree' | 'disagree'
      /** 同意授权按钮的id （仅event=agree时必填） */
      buttonId?: string
    }
    /**
     * 触发本次 onNeedPrivacyAuthorization 事件的关联信息
     */
    interface EventInfo {
      referrer: string
    }

    /** 隐私授权监听函数 */
    type Listener = (
      /** 事件回调函数 */
      resolve: (option: ResolveOption) => void,
      /** 关联事件信息 */
      eventInfo: EventInfo
    ) => void
  }

  interface TaroStatic {
    /**
     * 查询隐私授权情况。隐私合规开发指南详情可见《小程序隐私协议开发指南》
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/privacy/wx.getPrivacySetting.html
     */
    getPrivacySetting(option?: getPrivacySetting.Option): void
    /**
     * 跳转至隐私协议页面。隐私合规开发指南详情可见《小程序隐私协议开发指南》
     * @supported weapp
     * @example
     * ```tsx
     * Taro.openPrivacyContract({
     *   success: () => {}, // 打开成功
     *   fail: () => {}, // 打开失败
     *   complete: () => {}
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/privacy/wx.openPrivacyContract.html
     */
    openPrivacyContract(option?: openPrivacyContract.Option): void
    /**
     * 模拟隐私接口调用，并触发隐私弹窗逻辑。隐私合规开发指南详情可见《小程序隐私协议开发指南》
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/privacy/wx.requirePrivacyAuthorize.html
     */
    requirePrivacyAuthorize(option?: requirePrivacyAuthorize.Option): void
    /**
     * 监听隐私接口需要用户授权事件。当需要用户进行隐私授权时会触发。触发该事件时，开发者需要弹出隐私协议说明，并在用户同意或拒绝授权后调用回调接口 resolve 触发原隐私接口或组件继续执行。隐私合规开发指南详情可见《小程序隐私协议开发指南》
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/open-api/privacy/wx.onNeedPrivacyAuthorization.html
     */
    onNeedPrivacyAuthorization(listener: onNeedPrivacyAuthorization.Listener): void
  }
}
