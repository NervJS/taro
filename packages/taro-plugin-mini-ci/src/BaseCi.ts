import { IPluginContext } from '@tarojs/service'
import * as path from 'path'

export type ProjectType = 'miniProgram' | 'miniGame' | 'miniProgramPlugin' | 'miniGamePlugin';

/** 微信小程序配置 */
export interface WeappConfig {
  /** 小程序/小游戏项目的 appid */
  appid: string;
  /** 私钥，在获取项目属性和上传时用于鉴权使用(必填) */
  privateKeyPath: string;
  /** 微信开发者工具安装路径 */
  devToolsInstallPath?: string;
  /** 上传的小程序的路径（默认 outputPath ） */
  projectPath?: string;
  /** 类型，默认miniProgram 小程序 */
  type?: ProjectType;
  /** 上传需要排除的目录 */
  ignores?: Array<string>;
}

/** 头条小程序配置 */
export interface TTConfig {
  /** 绑定的邮箱账号 */
  email: string;
  /** 密码 */
  password: string;
}

/** 终端类型 */
export type ClientType =
/** 支付宝 */'alipay' |
/** AMPE */'ampe' |
/** 高德 */'amap' |
/** 天猫精灵 */'genie'|
/** ALIOS */ 'alios'|
/** UC */'uc'|
/** 夸克 */ 'quark'|
/** 淘宝 */ 'taobao'|
/** 口碑 */'koubei' |
/** loT */'alipayiot'|
/** 菜鸟 */'cainiao' |
/** 阿里健康 */ 'alihealth'

/** 支付宝系列小程序配置 */
export interface AlipayConfig {
  /** 小程序appId */
  appId: string;
  /** 工具id */
  toolId: string;
  /** 私钥相对路径 */
  privateKeyPath: string;
  /** 服务代理地址（可选） */
  proxy?: string;
  /** 上传的终端, 默认alipay */
  clientType?: ClientType;
}

/** 百度小程序配置 */
export interface SwanConfig {
  /** 有该小程序发布权限的登录密钥 */
  token: string;
  /** 最低基础库版本, 不传默认为 3.350.6 */
  minSwanVersion?: string;
}

export interface CIOptions {
  /** 发布版本号，默认取 package.json 文件的 taroConfig.version 字段 */
  version: string;
  /** 版本发布描述， 默认取 package.json 文件的 taroConfig.desc 字段 */
  desc: string;
  /** 微信小程序CI配置, 官方文档地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html */
  weapp?: WeappConfig;
  /** 头条小程序配置, 官方文档地址：https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/developer-instrument/development-assistance/ide-order-instrument */
  tt?: TTConfig;
  /** 支付宝系列小程序配置，官方文档地址： https://opendocs.alipay.com/mini/miniu/api */
  alipay?: AlipayConfig;
  /** 百度小程序配置, 官方文档地址：https://smartprogram.baidu.com/docs/develop/devtools/commandtool/ */
  swan?: SwanConfig;
}

export default abstract class BaseCI {
  /** taro 插件上下文 */
  protected ctx: IPluginContext

  /** 传入的插件选项 */
  protected pluginOpts: CIOptions

  /** 当前要发布的版本号 */
  protected version: string

  /** 当前发布内容的描述 */
  protected desc: string

  constructor (ctx: IPluginContext, pluginOpts: CIOptions) {
    this.ctx = ctx
    this.pluginOpts = pluginOpts

    const { appPath } = ctx.paths
    const { fs } = ctx.helper
    const packageInfo = JSON.parse(
      fs.readFileSync(path.join(appPath, 'package.json'), {
        encoding: 'utf8'
      })
    )
    this.version = pluginOpts.version || packageInfo.taroConfig?.version || '1.0.0'
    this.desc = pluginOpts.desc || packageInfo.taroConfig?.desc || `CI构建自动构建于${new Date().toLocaleTimeString()}`

    this._init()
  }

  /** 初始化函数，会被构造函数调用 */
  protected abstract _init():void;

  /** 打开小程序项目 */
  abstract open();

  /** 上传小程序 */
  abstract upload();

  /** 预览小程序 */
  abstract preview();
}
