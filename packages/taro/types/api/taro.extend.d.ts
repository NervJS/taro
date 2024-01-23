import React from 'react'

import Taro from '../index'

declare module '../index' {
  namespace getAppInfo {
    /** 应用信息 */
    interface AppInfo {
      platform: string
      taroVersion: string
      designWidth: number | ((size?: string | number) => number)
    }
  }

  namespace getCurrentInstance {
    interface Current {
      app: AppInstance | null
      router: RouterInfo | null
      page: PageInstance | null
      onReady: string
      onHide: string
      onShow: string
      preloadData?: Record<any, any>
      /**
       * RN 私有对象navigationRef，用于使用底层接口控制路由
       */
      rnNavigationRef?: React.RefObject<any>
    }
  }

  namespace setGlobalDataPlugin {
    /** Vue3 插件，用于设置 `getApp()` 中的全局变量 */
    interface Plugin {
      install(app: any, data: any): void
    }
  }

  /** @ignore */
  interface TARO_ENV_TYPE {
    [TaroGeneral.ENV_TYPE.WEAPP]: TaroGeneral.ENV_TYPE.WEAPP
    [TaroGeneral.ENV_TYPE.WEB]: TaroGeneral.ENV_TYPE.WEB
    [TaroGeneral.ENV_TYPE.RN]: TaroGeneral.ENV_TYPE.RN
    [TaroGeneral.ENV_TYPE.SWAN]: TaroGeneral.ENV_TYPE.SWAN
    [TaroGeneral.ENV_TYPE.ALIPAY]: TaroGeneral.ENV_TYPE.ALIPAY
    [TaroGeneral.ENV_TYPE.TT]: TaroGeneral.ENV_TYPE.TT
    [TaroGeneral.ENV_TYPE.QQ]: TaroGeneral.ENV_TYPE.QQ
    [TaroGeneral.ENV_TYPE.JD]: TaroGeneral.ENV_TYPE.JD
    [TaroGeneral.ENV_TYPE.HARMONYHYBRID]: TaroGeneral.ENV_TYPE.HARMONYHYBRID
  }

  namespace interceptorify {
    type promiseifyApi<T, R> = (requestParams: T) => Promise<R>
    interface InterceptorifyChain<T, R> {
      requestParams: T
      proceed: promiseifyApi<T, R>
    }
    type InterceptorifyInterceptor<T, R> = (chain: InterceptorifyChain<T, R>) => Promise<R>
    interface Interceptorify<T, R> {
      request(requestParams: T): Promise<R>
      addInterceptor(interceptor: InterceptorifyInterceptor<T, R>): void
      cleanInterceptors(): void
    }
  }

  interface TaroStatic {
    /** @ignore */
    Events: {
      new (): TaroGeneral.Events
    }

    /** 事件中心
     * @supported global
     */
    eventCenter: TaroGeneral.Events

    /** @ignore */
    ENV_TYPE: TARO_ENV_TYPE

    /** 获取环境变量
     * @supported global
     */
    getEnv(): TaroGeneral.ENV_TYPE

    /** 尺寸转换
     * @supported global
     */
    pxTransform(size: number): string

    /** 尺寸转换初始化
     * @supported global
     */
    initPxTransform(config: {
      baseFontSize?: number
      deviceRatio?: TaroGeneral.TDeviceRatio
      designWidth?: number | ((size?: string | number) => number)
      targetUnit?: string
      unitPrecision?: number
    }): void

    /** 小程序获取和 Taro 相关的 App 信息
     * @supported weapp, alipay, jd, qq, swan, tt, h5, harmony_hybrid
     */
    getAppInfo(): getAppInfo.AppInfo

    getEnvInfoSync(): {
      /** 小程序信息 */
      microapp: {
        /** 小程序版本号 */
        mpVersion: string
        /** 小程序环境 */
        envType: string
        /** 小程序appId */
        appId: string
      }
      /** 插件信息 */
      plugin: Record<string, unknown>
      /** 通用参数 */
      common: {
        /** 用户数据存储的路径 */
        USER_DATA_PATH: string
        /** 校验白名单属性中的appInfoLaunchFrom后返回额外信息 */
        location: string | undefined
        launchFrom: string | undefined
        schema: string | undefined
      }
    }

    /** 小程序引用插件 JS 接口
     * @supported weapp, alipay, h5, rn, jd, qq, swan, tt, quickapp
     */
    requirePlugin: {
      (pluginName: string): any
      /** @supported weapp */
      (pluginName: string, success?: (mod: any) => any, error?: (e: { mod: any; errMsg: string }) => any): any;
      /** @supported weapp */
      async?: (pluginName: string) => Promise<any>
    }

    /** 获取当前页面实例
     * @supported global
     */
    getCurrentInstance(): getCurrentInstance.Current

    /** @ignore */
    Current: getCurrentInstance.Current

    /** Vue3 插件，用于设置 `getApp()` 中的全局变量
     * @supported weapp, alipay, h5, rn, jd, qq, swan, tt, quickapp, harmony_hybrid
     * @example
     * ```js
     * // 使用插件
     * const App = createApp(...)
     * App.use(setGlobalDataPlugin, {
     *   xxx: 999
     * })
     * // 获取全局变量
     * Taro.getApp().xxx
     * ```
     */
    setGlobalDataPlugin: setGlobalDataPlugin.Plugin

    /** 获取自定义 TabBar 对应的 React 或 Vue 组件实例
     * @supported weapp, jd
     * @param page 小程序页面对象，可以通过 Taro.getCurrentInstance().page 获取
     */
    getTabBar<T>(page: getCurrentInstance.Current['page']): T | undefined

    /** 获取当前页面渲染引擎类型
     * @supported weapp
     */
    getRenderer(): 'webview' | 'skyline'

    /**
     * 包裹 promiseify api 的洋葱圈模型
     * @supported global
     * @param promiseifyApi
     * @example
     * ```tsx
     * // 创建实例
     * const modalInterceptorify = interceptorify(taro.showModal)
     * // 添加拦截器
     * modalInterceptorify.addInterceptor(async function (chain) {
     *   const res = await chain.proceed({
     *     ...chain.requestParams,
     *     title: 'interceptor1'
     *   })
     *   return res
     * })
     * modalInterceptorify.addInterceptor(async function (chain) {
     *   const res = await chain.proceed({
     *     ...chain.requestParams,
     *     content: 'interceptor2'
     *   })
     *   return res
     * })
     * // 使用
     * modalInterceptorify.request({})
     * ```
     * @example
     * ```tsx
     * // 创建实例
     * const fetchDataInterceptorify = interceptorify(taro.request)
     * // 添加拦截器
     * fetchDataInterceptorify.addInterceptor(async function (chain) {
     *   taro.showLoading({
     *     title: 'Loading...'
     *   })
     *   const res = await chain.proceed(chain.requestParams)
     *   taro.hideLoading()
     *   return res
     * })
     * fetchDataInterceptorify.addInterceptor(async function (chain) {
     *   const params = chain.requestParams
     *   const res = await chain.proceed({
     *     url: 'http://httpbin.org' + params.url,
     *   })
     *   return res.data
     * })
     * // 使用
     * fetchDataInterceptorify.request({
     *   url: '/ip'
     * }).then((res) => {
     *   // log my ip
     *   console.log(res.origin)
     * })
     * ```
     */
    interceptorify<T, R>(promiseifyApi: interceptorify.promiseifyApi<T, R>): interceptorify.Interceptorify<T, R>
  }
}
