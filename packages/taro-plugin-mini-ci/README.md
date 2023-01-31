# @tarojs/plugin-mini-ci

> Taro 小程序端构建后支持CI（持续集成）的插件， 支持构建完毕后自动打开小程序开发工具、上传作为体验版、生成预览二维码. 目前暂时仅支持微信、字节、支付宝、百度小程序

## 使用

### 安装
```
npm i @tarojs/plugin-mini-ci -D
```

### 使用插件
`/config/index.js`

```js
// 示例, 如果你使用 `vs code` 作为开发工具， 你还可以使用注释的语法引入插件包含的声明文件，可获得类似于typescript的友好提示
/**
 * @typedef { import("@tarojs/plugin-mini-ci").CIOptions } CIOptions
 * @type {CIOptions}
 */
const CIPluginOpt = {
    weapp: {
        appid: "微信小程序appid",
        privateKeyPath: "密钥文件相对项目根目录的相对路径，例如 key/private.appid.key"
    },
    tt: {
        email: "字节小程序邮箱",
        password: "字节小程序密码"
    },
    alipay: {
      appId: "支付宝小程序appId",
      toolId: "工具id",
      privateKeyPath: "密钥文件相对项目根目录的相对路径，例如 key/pkcs8-private-pem"
    },
    swan: {
      token: "鉴权需要的token令牌"
    },
    // 版本号
    version: "1.0.0",
    // 版本发布描述
    desc: "版本描述"
}
const config = {
  plugins: [
    [ "@tarojs/plugin-mini-ci", CIPluginOpt ]
  ]
}
```

### 配置命令

`package.json` 的 `scripts` 字段使用命令参数

```json
{
    "scripts": {
            //  构建完后自动 “打开开发者工具”
           "build:weapp": "taro build --type weapp --open",
            //  构建完后自动“上传代码作为体验版”
           "build:weapp:upload": "taro build --type weapp --upload",
            //  构建完后自动 “上传代码作为开发版并生成预览二维码”     
           "build:weapp:preview": "taro build --type weapp --preview"
    },
    "taroConfig": {
        "version": "1.0.0",
        "desc": "上传描述"
    }
}
```
由上面的示例可知，插件为taro cli命令扩展了3个选项：

- --open
打开开发者工具，类似于网页开发中自动打开谷歌浏览器
- --upload
上传代码作为体验版
- --preview
上传代码作为开发版并生成预览二维码

此3个选项在一条命令里不能同时使用

## API


### 插件配置

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| weapp | Object | 微信小程序CI配置 |
| tt | Object | 头条小程序配置 |
| alipay | Object | 支付宝小程序配置 |
| swan | Object | 百度小程序配置 |
| version | string | 上传版本号，不传时默认读取package.json下的taroConfig下的version字段 |
| desc | string | 上传时的描述信息，不传时默认读取package.json下的taroConfig下的desc字段 |

### 微信小程序CI配置
| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| appid | string | 小程序/小游戏项目的 appid |
| privateKeyPath | string | 私钥文件在项目中的相对路径，在获取项目属性和上传时用于鉴权使用|
| devToolsInstallPath | string | 微信开发者工具安装路径，如果你安装微信开发者工具时选的默认路径，则不需要传入此参数 |
| projectPath | string | 上传的小程序的路径（默认取的 outputPath ） |
| ignores | string[] | 上传需要排除的目录(选填) |

官方CI文档[点这里](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)

### 头条小程序CI配置

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| email | string | 字节小程序邮箱 |
| password | string | 字节小程序密码 |

官方CI文档[点这里](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/developer-instrument/development-assistance/ide-order-instrument)

### 支付宝小程序CI配置

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| appId | string | 小程序appId |
| toolId | string | 工具id，生成方式[查看这里](https://opendocs.alipay.com/mini/miniu/api#%E5%88%9D%E5%A7%8B%E5%8C%96%E9%85%8D%E7%BD%AE%EF%BC%88%E4%B9%8B%E5%89%8D%E7%9A%84%E6%96%B9%E5%BC%8F%EF%BC%8C%E6%8E%A8%E8%8D%90%E4%BD%BF%E7%94%A8%20miniu%20login%EF%BC%89) |
| privateKeyPath | string | 密钥文件相对项目根目录的相对路径, 支付宝生产的私钥文件名一般是 pkcs8-private-pem |
| clientType | string | 上传的终端,终端类型见下表（默认值alipay） |

```
终端类型值及其含义：

alipay: 支付宝

ampe：AMPE

amap：高德

genie：天猫精灵

alios：ALIOS

uc：UC

quark：夸克

taobao：淘宝

koubei：口碑

alipayiot：IoT

cainiao：菜鸟

alihealth：阿里健康
```

官方CI文档[点这里](https://opendocs.alipay.com/mini/miniu/api)

### 百度小程序CI配置

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| token | string | 有该小程序发布权限的登录密钥 |
| minSwanVersion | string | 最低基础库版本, 不传默认为 3.350.6  |

官方CI文档[点这里](https://smartprogram.baidu.com/docs/develop/devtools/commandtool/)

### ts 接口描述
```ts
export interface IOptions {
  version?: string;
  desc?: string;
  weapp?: WeappConfig;
  tt?: TTConfig;
  alipay?: AlipayConfig;
  swan?: SwanConfig;
}

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
  email: string;
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
  /** 工具私钥 */
  privateKey: string;
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
```
