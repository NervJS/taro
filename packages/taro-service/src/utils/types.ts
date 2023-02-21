import type helper from '@tarojs/helper'
import type { IProjectConfig } from '@tarojs/taro/types/compile'
import type { IModifyWebpackChain } from '@tarojs/taro/types/compile/hooks'
import type joi from 'joi'
import type Webpack from 'webpack'
import type Chain from 'webpack-chain'
import type { PluginType } from './constants'

export interface IPaths {
  /**
   * 当前命令执行的目录，如果是 build 命令则为当前项目路径
   */
  appPath: string
  /**
   * 当前项目配置目录，如果 init 命令，则没有此路径
   */
  configPath: string
  /**
   * 当前项目源码路径
   */
  sourcePath: string
  /**
   * 当前项目输出代码路径
   */
  outputPath: string
  /**
   * 当前项目所用的 node_modules 路径
   */
  nodeModulesPath: string
}

export type Func = (...args: any[]) => any

export type IPluginsObject = Record<string, Record<any, any> | null>

export interface IPlugin {
  id: string
  path: string
  opts: any
  type: PluginType
  apply: Func
}

export type IPreset = IPlugin

export interface IHook {
  name: string
  plugin?: string
  fn: Func
  before?: string
  stage?: number
}

export interface ICommand extends IHook {
  alias?: string
  optionsMap?: {
    [key: string]: string
  }
  synopsisList?: string[]
}

export interface IFileType {
  templ: string
  style: string
  script: string
  config: string
}

export interface IPlatform extends IHook {
  useConfigName?: string
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
  helper: typeof helper
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
  registerMethod: (arg: (string | { name: string, fn?: Func }), fn?: Func) => void
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
  applyPlugins: (args: string | { name: string, initialVal?: any, opts?: any }) => Promise<any>
  /**
   * 为插件添加入参校验
   */
  addPluginOptsSchema: (fn: (joi: joi.Root) => void) => void
  /**
   * 编译开始
   */
  onBuildStart: (fn: Func) => void
  /**
   * 编译结束（保存代码每次编译结束后都会触发）
   */
  onBuildFinish: (fn: Func) => void
  /**
   * 编译完成（启动项目后首次编译结束后会触发一次）
   */
  onBuildComplete: (fn: Func) => void
  /**
   * 修改编译过程中的页面组件配置
   */
  onCompilerMake: (fn: (args: { compilation: Webpack.Compilation, compiler: Webpack.Compiler, plugin: any }) => void) => void
  /**
   * 编译中修改 webpack 配置，在这个钩子中，你可以对 webpackChain 作出想要的调整，等同于配置 [`webpackChain`](./config-detail.md#miniwebpackchain)
   */
  modifyWebpackChain: (fn: (args: { chain: Chain, webpack: typeof Webpack, data?: IModifyWebpackChain }) => void) => void
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

export declare type TConfig = Record<string, any>
