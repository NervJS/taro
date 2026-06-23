import Taro from '../../index'

declare module '../../index' {
  namespace setPageInfo {
    interface Option {
      /** 页面标题 */
      title: string
      /** 页面关键字 */
      keywords: string
      /** 页面描述信息 */
      description: string
      /** 原始发布时间(年-月-日 时:分:秒 带有前导零） */
      releaseDate?: string
      /** 文章(内容)标题(适用于当前页面是图文、视频类的展示形式，文章标题需要准确标识当前文章的主要信息点；至少6个字，不可以全英文。) */
      articleTitle?: string
      /** 图片线上地址，用于信息流投放后的封面显示，最多3张，单图片最大2M；封面图建议尺寸：高>=210px & 宽>=375px；最小尺寸：高>=146px & 宽>=218px。多张图时，用数组表示 */
      image?: string | Array<string>
      /** 视频信息，多个视频时，用数组表示 */
      video?: Video
      /** 浏览信息 */
      visit?: Visit
      /** 点赞量，若页面未统计可为空 */
      likes?: string
      /** 评论量，若页面未统计可为空 */
      comments?: string
      /** 收藏量，若页面未统计可为空 */
      collects?: string
      /** 分享量，若页面未统计可为空 */
      shares?: string
      /** 关注量，若页面未统计可为空 */
      followers?: string
      /** 接口调用成功的回调函数 */
      success?: () => any
      /** 接口调用失败的回调函数 */
      fail?: (err: any) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => any
    }
    type Video = {
      /** 视频地址 */
      url: string
      /** 视频时长(单位为秒) */
      duration: string
      /** 视频封面图 */
      image: string
    }
    type Visit = {
      /** 页面的浏览量(不去重用户） */
      pv?: string
      /** 页面的点击量（去重用户） */
      uv?: string
      /** 页面的用户人均停留时长，以秒为单位。 */
      sessionDuration?: string
    }
  }

  namespace setMetaDescription {
    interface Option {
      /** 需要设置的 description 内容 */
      content: string
      /** 接口调用成功的回调函数 */
      success?: (res: any) => any
      /** 接口调用失败的回调函数 */
      fail?: (err: any) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: any) => any
    }
  }

  namespace setMetaKeywords {
    interface Option {
      /** 需要设置的 keywords 内容 */
      content: string
      /** 接口调用成功的回调函数 */
      success?: (res: any) => any
      /** 接口调用失败的回调函数 */
      fail?: (err: any) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: any) => any
    }
  }

  namespace setDocumentTitle {
    interface Option {
      /** 页面中 title 标签中的内容 */
      title: string
      /** 接口调用成功的回调函数 */
      success?: (res: any) => any
      /** 接口调用失败的回调函数 */
      fail?: (err: any) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: any) => any
    }
  }

  namespace getSystemRiskInfo {
    interface Option {
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => any
      /** 接口调用失败的回调函数 */
      fail?: (err: any) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: any) => any
    }
    interface SuccessCallbackResult {
      /** 用于获取风控信息的加密信息对象。
       * 要获取风控信息，需要和[风控检测](https://smartprogram.baidu.com/docs/develop/serverapi/open_risk_power/#detectrisk/)接口联合使用，并作为风控检测接口的 xtoken 参数传入。
       */
      content: Object
    }
    interface IContent {
      key: string
      value: string
    }
  }

  namespace getFavorStatus {
    interface Option {
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => any
      /** 接口调用失败的回调函数 */
      fail?: (err: any) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: any) => any
    }
    interface SuccessCallbackResult {
      /** 用户关注关注状态，1表示已关注，0表示未关注 */
      isFavor: string
    }
  }

  namespace getTopStatus {
    interface Option {
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => any
      /** 接口调用失败的回调函数 */
      fail?: (err: any) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: any) => any
    }
    interface SuccessCallbackResult {
      /** 置顶状态 */
      isTop: boolean
    }
  }

  namespace openBdboxWebview {
    interface Option {
      /** 跳转百度 App 特定页面的 scheme 的 module */
      module?: string
      /** 跳转百度 App 特定页面的 scheme 的 action */
      action?: string
      /** 跳转百度 App 特定页面的 scheme 的 path */
      path?: string
      /** 跳转百度 App 特定页面的 scheme 的 authority */
      authority?: string
      /** 跳转百度 App 特定页面的 scheme 的参数 */
      parameters?: Object
      /** 接口调用成功的回调函数 */
      success?: (res: any) => any
      /** 接口调用失败的回调函数 */
      fail?: (err: any) => any
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: any) => any
    }
  }
  interface TaroStatic {
    /**
     * 百度智能小程序可接入百度搜索和百度 App，setPageInfo 负责为小程序设置各类页面基础信息，包括标题、关键字、页面描述以及图片信息、视频信息等。开发者为智能小程序设置完备的页面基础信息，有助于智能小程序在搜索引擎和信息流中得到更加有效的展示和分发。
     * @supported swan
     * @example
     * ```tsx
     * Taro.setPageInfo({
     *   title: '晒元宵节活动红包，爱奇艺60张年卡、600张季卡等你拿！-百度贴吧',
     *   keywords: '百度,百度贴吧,好运中国年,60,晒元,宵节',
     *   description: '晒元宵节活动红包，爱..昨天的百度APP元宵节活动中，共发出2亿现金红包、含151万个手气现金大奖和240辆红旗轿车，谁是好运锦鲤，快来分享！马上惊喜升级~摇中红包的锦鲤们即刻晒出红包金额截图，我们将会抽取660位好运锦鲤',
     *   articleTitle: '晒元宵节活动红包，爱奇艺60张年卡、600张季卡等你拿！',
     *   releaseDate: '2019-01-02 12:01:30',
     *   image: [
     *       'https://c.hiphotos.baidu.com/forum/w%3D480/sign=73c62dda83b1cb133e693d1bed5456da/f33725109313b07e8dee163d02d7912396dd8cfe.jpg',
     *       'https://hiphotos.baidu.com/fex/%70%69%63/item/43a7d933c895d143e7b745607ef082025baf07ab.jpg'
     *   ],
     *   video: [{
     *       url: 'https://www.baidu.com/mx/v12.mp4',
     *       duration: '100',
     *       image: 'https://smartprogram.baidu.com/docs/img/image-scaleToFill.png'
     *   }],
     *   visit: {
     *       pv: '1000',
     *       uv: '100',
     *       sessionDuration: '130'
     *   },
     *   likes: '75',
     *   comments: '13',
     *   collects: '23',
     *   shares: '8',
     *   followers: '35',
     *   success: res => {
     *       console.log('setPageInfo success');
     *   },
     *   fail: err => {
     *       console.log('setPageInfo fail', err);
     *   }
     * })
     * ```
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-setPageInfo/
     */
    setPageInfo(option: setPageInfo.Option): void
    /** 设置 web 版小程序 description meta 信息。此方法为 web 版小程序专用方法，使用前需判断方法是否存在。
     * @supported swan
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-setMetaDescription/
     */
    setMetaDescription(option: setMetaDescription.Option): void
    /** 设置 web 版小程序 keywords meta 信息。此方法为 web 版小程序专用方法，使用前需判断方法是否存在。
     * @supported swan
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-setMetaKeywords/
     */
    setMetaKeywords(option: setMetaKeywords.Option): void
    /** 动态设置当前页面的标题。此方法为 web 版小程序专用方法，使用前需判断方法是否存在。
     * @supported swan
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-setDocumentTitle/
     */
    setDocumentTitle(option: setDocumentTitle.Option): void
    /** 获取用于得到风控信息的加密信息对象。更多小程序风控能力参见[风控服务](https://smartprogram.baidu.com/docs/develop/serverapi/open_risk_power/)。
     * Web 态说明：Web 态小程序暂不支持获取用于得到风控信息的加密信息对象。
     * @supported swan
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-getSystemRiskInfo/
     */
    getSystemRiskInfo(option: getSystemRiskInfo.Option): void
    /** 获取小程序用户关注状态。
     * Web 态说明：Web 态小程序暂不支持关注小程序。
     * @supported swan
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-getFavorStatus/
     */
    getFavorStatus(option: getFavorStatus.Option): void
    /** 获取小程序用户置顶状态。
     * Web 态说明：Web 态小程序暂不支持获取置顶状态，降级调起百度 App。
     * @supported swan
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-getTopStatus/
     */
    getTopStatus(option: getTopStatus.Option): void
    /** 小程序跳转百度 App 内特定页面。接入本 API 的开发者，需要了解跳转页面的 scheme，并根据文档调用 API 完成跳转。可在百度 App 中，通过将跳转页面 scheme 生成对应二维码，并使用百度 APP 相机扫描二维码调起的方式，来确保 scheme 是否正确。
     *  Web 态说明：
     *   1.由于浏览器的限制，Web 态暂时无法准确获取跳转百度 App 成功 / 失败状态，会执行失败回调；
     *   2.在用户未安装手百、部分第三方浏览器封禁百度 App 的情况下，Web 态会尝试降级调起应用商店。
     * @supported swan
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-openBdboxWebview/
     */
    openBdboxWebview(option: openBdboxWebview.Option): void
  }
}
