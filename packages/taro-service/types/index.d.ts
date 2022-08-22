import helper from '@tarojs/helper'
import { IProjectConfig } from '@tarojs/taro/types/compile'
import joi from 'joi'

import { IPlugin, IPaths, IHook, ICommand, IPlatform } from '../src/utils/types'

export { default as Kernel } from './Kernel'

export { TaroPlatformBase } from './platform-plugin-base'

interface IModifyWebpackChain {
  componentConfig?: {
    includes: Set<string>
    exclude: Set<string>
    thirdPartyComponents: Map<Tagname, Attrs>
    includeAll: boolean
  }
}

export declare interface IPluginContext {
  /**
   * 获取当前所有挂载的插件
   */
  plugins: Map<string, IPlugin>
  /**
   * 获取当前所有挂载的平台
   */
  platforms: Map<string, IPlatform>
  /**
   * 包含当前执行命令的相关路径集合
   */
  paths: IPaths
  /**
   * 获取当前执行命令所带的参数
   */
  runOpts: any
  /**
   * 为包 @tarojs/helper 的快捷使用方式，包含其所有 API
   */
  helper: helper
  /**
   * 项目配置
   */
  initialConfig: IProjectConfig
  /**
   * 注册一个可供其他插件调用的钩子，接收一个参数，即 Hook 对象
   */
  register: (hook: IHook) => void
  /**
   * 向 ctx 上挂载一个方法可供其他插件直接调用
   */
  registerMethod: (arg: (string | { name: string, fn?: Function }), fn?: Function) => void
  /**
   * 注册一个自定义命令
   */
  registerCommand: (command: ICommand) => void
  /**
   * 注册一个自定义编译平台
   */
  registerPlatform: (platform: IPlatform) => void
  /**
   * 触发注册的钩子（使用`ctx.register`方法注册的钩子），传入钩子名和钩子所需参数
   */
  applyPlugins:(args: string | { name: string; initialVal?: any; opts?: any; })=> Promise<any>
  /**
   * 为插件添加入参校验
   */
  addPluginOptsSchema: (fn: (joi: joi.Root) => void) => void
  /**
   * 编译开始
   */
  onBuildStart: (fn: Function) => void
  /**
   * 编译结束（保存代码每次编译结束后都会触发）
   */
  onBuildFinish: (fn: Function) => void
  /**
   * 编译完成（启动项目后首次编译结束后会触发一次）
   */
  onBuildComplete: (fn: Function) => void
  /**
   * 编译中修改 webpack 配置，在这个钩子中，你可以对 webpackChain 作出想要的调整，等同于配置 [`webpackChain`](./config-detail.md#miniwebpackchain)
   */
  modifyWebpackChain: (fn: (args: { chain: any, webpack: any, data?: IModifyWebpackChain }) => void) => void
  /**
   * 修改编译后的结果
   */
  modifyBuildAssets: (fn: (args: { assets: any, miniPlugin: any }) => void) => void
  /**
   * 修改编译过程中的页面组件配置
   */
  modifyMiniConfigs: (fn: (args: { configMap: any }) => void) => void

  [key: string]: any
}
