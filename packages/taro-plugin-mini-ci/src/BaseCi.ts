import * as path from 'path'
import * as process from 'process'

import { ON_PREVIEW_COMPLETE, ON_UPLOAD_COMPLETE } from './hooks'

import type { IPluginContext } from '@tarojs/service'

export type ProjectType = 'miniProgram' | 'miniGame' | 'miniProgramPlugin' | 'miniGamePlugin';

/** 微信小程序配置 */
export interface WeappConfig {
  /** 小程序/小游戏项目的 appid */
  appid: string
  /** 私钥文件路径，在获取项目属性和上传时用于鉴权使用 */
  privateKeyPath: string
  /** 微信开发者工具安装路径 */
  devToolsInstallPath?: string
  /** 类型，默认miniProgram 小程序 */
  type?: ProjectType
  /** 上传需要排除的目录 */
  ignores?: Array<string>
  /** 指定使用哪一个 ci 机器人，可选值：1 ~ 30 */
  robot?: number
  /** 预览和上传时的编译设置 */
  setting?: {
    /** 对应于微信开发者工具的 "es6 转 es5" */
    es6: boolean
    /** 对应于微信开发者工具的 "增强编译" */
    es7: boolean
    /** "增强编译" 开启时，是否禁用JS文件严格模式，默认为false */
    disableUseStrict: boolean
    /** 上传时压缩 JS 代码 */
    minifyJS: boolean
    /** 上传时压缩 WXML 代码 */
    minifyWXML: boolean
    /** 上传时压缩 WXSS 代码 */
    minifyWXSS: boolean
    /** 上传时压缩所有代码，对应于微信开发者工具的 "上传时压缩代码" */
    minify: boolean
    /** 对应于微信开发者工具的 "上传时进行代码保护" */
    codeProtect: boolean
    /** 对应于微信开发者工具的 "上传时样式自动补全" */
    autoPrefixWXSS: boolean
  }
}

/** 头条小程序配置 */
export interface TTConfig {
  /** 绑定的邮箱账号 */
  email: string
  /** 密码 */
  password: string
}

/** 终端类型 */
export type AlipayClientType =
/** 支付宝 */'alipay' |
/** AMPE */'ampe' |
/** 高德 */'amap' |
/** 天猫精灵 */'genie'|
/** ALIOS */ 'alios'|
/** UC */'uc'|
/** 夸克 */ 'quark'|
/** 口碑 */'koubei' |
/** loT */'alipayiot'|
/** 菜鸟 */'cainiao' |
/** 阿里健康(医蝶谷) */ 'alihealth'|
/** 阿里医院 */ 'health'

/** 支付宝系列小程序配置 */
export interface AlipayConfig {
  /** 小程序appid */
  appid: string
  /** 工具id */
  toolId: string
  /** 私钥文件路径，在获取项目属性和上传时用于鉴权使用(privateKeyPath和privateKey之间必须要填写其中一个) */
  privateKeyPath: string
  /** 私钥文本内容，在获取项目属性和上传时用于鉴权使用(privateKeyPath和privateKey之间必须要填写其中一个) */
  privateKey: string
  /** 小程序开发者工具安装路径 */
  devToolsInstallPath?: string
  /** 上传的终端, 默认alipay */
  clientType?: AlipayClientType
}

export type DingtalkProjectType =
/** 第三方个人应用 */
'dingtalk-personal'|
/** 第三方企业应用 */
'dingtalk-biz-isv'|
/** 企业内部应用 */
'dingtalk-biz'|
/** 企业定制应用 */
'dingtalk-biz-custom'|
/** 工作台组件 */
'dingtalk-biz-worktab-plugin'
export interface DingtalkConfig {
  /** 钉钉小程序appid,即钉钉开放平台后台应用管理的 MiniAppId 选项（必填） */
  appid: string
  /** 令牌，从钉钉后台获取 */
  token: string
  /** 小程序开发者工具安装路径 */
  devToolsInstallPath?: string
  /** 钉钉应用类型， 默认为:'dingtalk-biz' (企业内部应用) */
  projectType?: DingtalkProjectType
}

/** 百度小程序配置 */
export interface SwanConfig {
  /** 有该小程序发布权限的登录密钥 */
  token: string
  /** 最低基础库版本, 不传默认为 3.350.6 */
  minSwanVersion?: string
  /** 小程序开发者工具安装路径 */
  devToolsInstallPath?: string
}

export interface JdConfig {
  privateKey: string
}

export interface CIOptions {
  /** 发布版本号，默认取 package.json 文件的 taroConfig.version 字段 */
  version?: string
  /** 版本发布描述， 默认取 package.json 文件的 taroConfig.desc 字段 */
  desc?: string
  /** 目标项目目录，对所有小程序生效（不传默认取 outputRoot 字段 ） */
  projectPath?: string
  /** 微信小程序CI配置, 官方文档地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html */
  weapp?: WeappConfig
  /** 头条小程序配置, 官方文档地址：https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/developer-instrument/development-assistance/ide-order-instrument */
  tt?: TTConfig
  /** 支付宝系列小程序配置，官方文档地址： https://opendocs.alipay.com/mini/miniu/api */
  alipay?: AlipayConfig
  /** 钉钉小程序配置 */
  dd?: DingtalkConfig
  /** 百度小程序配置, 官方文档地址：https://smartprogram.baidu.com/docs/develop/devtools/smartapp_cli_function/ */
  swan?: SwanConfig
  /** 京东小程序配置, 官方文档地址：https://mp-docs.jd.com/doc/dev/devtools/1597 */
  jd?: JdConfig
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

  /** 命令要操作的项目目录 */
  protected projectPath: string

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

  }

  setProjectPath (path: string) {
    this.projectPath = path
  }

  /** 执行预览命令后触发 */
  async triggerPreviewHooks (content: {
    success: boolean
    data: { platform: string, qrCodeLocalPath: string, qrCodeContent: string }
    error?: Error
  }) {
    const { success, data, error } = content
    await this.ctx.applyPlugins({
      name: ON_PREVIEW_COMPLETE,
      opts: {
        success,
        data: {
          version: this.version,
          desc: this.desc,
          projectPath: this.projectPath,
          ...data
        },
        error
      },
    })

    if(!success) {
      process.exit(1)
    }
  }

  /** 执行上传命令后触发 */
  async triggerUploadHooks (content: {
    success: boolean
    data: { platform: string, qrCodeLocalPath: string, qrCodeContent: string }
    error?: Error
  }) {
    const { success, data, error } = content
    await this.ctx.applyPlugins({
      name: ON_UPLOAD_COMPLETE,
      opts: {
        success,
        data: {
          version: this.version,
          desc: this.desc,
          projectPath: this.projectPath,
          ...data
        },
        error
      },
    })

    if(!success) {
      process.exit(1)
    }
  }

  /** 初始化函数，new实例化后会被立即调用一次 */
  abstract init(): void

  /** 打开小程序项目 */
  abstract open()

  /** 上传小程序 */
  abstract upload()

  /** 预览小程序 */
  abstract preview()
}
