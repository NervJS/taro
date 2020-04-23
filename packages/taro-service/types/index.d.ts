import helper from '@tarojs/helper'
import { IProjectConfig } from '@tarojs/taro/types/compile'

import { IPlugin, IPaths, IHook, ICommand, IPlatform } from '../src/utils/types'

export { default as Kernel } from './Kernel'

export declare interface IPluginContext {
  /**
   * 获取当前所有挂载的插件
   */
  plugins: Map<string, IPlugin>
  /**
   * 包含当前执行命令的相关路径集合
   */
  paths: IPaths
  /**
   * 获取当前执行命令所带的参数
   */
  runOpts: Object
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
  registerMethod: (arg: (string | { name: string, fn?: Function }), fn?: Function) => void,
  /**
   * 注册一个自定义命令
   */
  registerCommand: (command: ICommand) => void
  /**
   * 注册一个自定义编译平台
   */
  registerPlatform: (platform: IPlatform) => void

  [key: string]: any
}
