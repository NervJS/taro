import Taro from '../../index'

declare module '../../index' {
  namespace downloadPackage {
    interface Option {
      /** 预下载的小程序的 appKey */
      appKey: string
      /** 预下载的小程序的 pageUrl ，默认值为小程序的首页页面 */
      pageUrl?: string
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => any
      /** 接口调用失败的回调函数 */
      fail?: (err: TaroGeneral.CallbackResult) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => any
    }
  }

  namespace downloadPackages {
    interface Option {
      /** 预下载的小程序的列表。 */
      pageList: IPageItem[]
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => any
      /** 接口调用失败的回调函数 */
      fail?: (err: TaroGeneral.CallbackResult) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => any
    }
    interface IPageItem {
      /** 预下载的小程序的 appKey */
      appKey: string
      /** 页面路径 */
      pages: string[]
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 小程序包预下载结果回调 */
      [key: string]: IAppKeyResult[]
    }
    interface IAppKeyResult {
      /** 页面路径 */
      pageUrl: string
      /** 预下载能力调用结果。值为 "0" 时是成功，非 "0" 时是失败 */
      status: string
      /** 预下载结果信息 */
      message: string
    }
  }

  namespace loadSubPackage {
    interface Option {
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => any
      /** 接口调用失败的回调函数 */
      fail?: (err: TaroGeneral.CallbackResult) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => any
    }
  }

  interface TaroStatic {
    /** 针对在小程序中调用其他小程序的场景，预下载其他小程序的包内容。
     * Web 态说明：Web 态不支持预下载的能力。
     * @supported swan
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-downloadPackage/
     */
    downloadPackage(option: downloadPackage.Option): void
    /** 针对在小程序中调用其他小程序的场景，预下载其他小程序的包内容。
     * Web 态说明：Web 态不支持预下载的能力。
     * @supported swan
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-downloadPackages/
     */
    downloadPackages(option: downloadPackages.Option): void
    /** 提前下载好子包的资源，目录结构配置参考[分包加载](https://smartprogram.baidu.com/docs/develop/framework/subpackages/)。
     * @supported swan
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-loadSubPackage/
     */
    loadSubPackage(option: loadSubPackage.Option): void
  }
}