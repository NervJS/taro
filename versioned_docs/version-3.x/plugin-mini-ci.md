---
title: 支持CI(持续集成)插件(小程序端构建后)
---


# `@taro/plugin-mini-ci`

> Taro 小程序端构建后支持CI（持续集成）的插件， 支持构建完毕后自动打开小程序开发这个工具、上传作为体验版、生成预览二维码. 目前暂时仅支持微信小程序和字节小程序

## 使用

### 安装
```
npm i @tarojs/plugin-mini-ci -D
```

### 使用插件
`/config/index.js`

```js
// 示例
const config = {
  plugins: [
    [
        "@tarojs/plugin-mini-ci",
        {
            weapp: {
                appid: "微信小程戏appid",
                privateKeyPath: "密钥文件相对项目根目录的相对路径，例如 key/private.appid.key"
            },
            tt: {
                email: "字节小程序邮箱",
                password: "字节小程序密码"
            },
            // 版本号
            version: "1.0.0",
            // 版本发布描述
            desc: "版本描述"
        }
    ],
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
打开开发者工具
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
| version | string | 上传版本号，不传时默认读取package.json下的taroConfig下的version字段 |
| desc | string | 上传时的描述信息，不传时默认读取package.json下的taroConfig下的desc字段 |

### 微信小程序CI配置
| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| appid | string | 小程序/小游戏项目的 appid |
| privateKeyPath | string | 私钥文件在项目中的相对路径，在获取项目属性和上传时用于鉴权使用|
| devToolsInstallPath | string | 微信开发者工具安装路径，如果你安装微信开发者工具时选的默认路径，则不需要传入此参数 |
| projectPath | string | 上传的小程序的路径（默认取的 outputPath ） |
| ignores | string[] | 上传需要排除的目录 |

### 头条小程序CI配置

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| email | string | 字节小程序邮箱 |
| password | string | 字节小程序密码 |

### ts 接口描述
```ts
export interface IOptions {
  version?: string
  desc?: string;
  weapp?: WeappConfig,
  tt?: TTConfig
}

/** 微信小程序配置 */
export interface WeappConfig {
  /** 小程序/小游戏项目的 appid */
  appid: string,
  /** 私钥，在获取项目属性和上传时用于鉴权使用(必填) */
  privateKeyPath: string,
  /** 微信开发者工具安装路径 */
  devToolsInstallPath?: string;
  /** 上传的小程序的路径（默认 outputPath ） */
  projectPath?: string,
  /** 类型，默认miniProgram 小程序 */
  type?: ProjectType
  /** 上传需要排除的目录 */
  ignores?: Array<string>
}

/** 头条小程序配置 */
export interface TTConfig {
  email: string;
  password: string;
}
```

