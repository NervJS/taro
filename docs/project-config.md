---
title: 项目配置
---

各类小程序平台均有自己的项目配置文件，例如

* 微信小程序，[project.config.json](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html?search-key=%E9%A1%B9%E7%9B%AE%E9%85%8D%E7%BD%AE)
* 百度智能小程序，[project.swan.json](https://smartprogram.baidu.com/docs/develop/devtools/projectconfig/)
* 头条小程序，project.config.json，文档暂无，大部分字段与微信小程序一致
* 支付宝小程序，暂无发现
* 快应用，[manifest.json](https://doc.quickapp.cn/framework/manifest.html)

为了能够适配到各个小程序平台，满足不同小程序平台配置文件不同的情况，在 Taro 支持为各个小程序平台添加不同的项目配置文件。

通过 Taro 模板创建的项目都会默认拥有 `project.config.json` 这一项目配置文件，这个文件 **只能用于微信小程序**，若要兼容到其他小程序平台，请按如下对应规则来增加相应平台的配置文件，其配置与各自小程序平台要求的一致

| 小程序平台 | 添加配置文件 | 说明 |
| --- | --- | --- |
| 微信小程序 | project.config.json | |
| 百度智能小程序 | project.swan.json | |
| 头条小程序 | project.tt.json | |
| 快应用 | project.quickapp.json | 配置文件中请勿配置 `router` 与 `display`，这两个配置将由 Taro 生成 |

> 注意：快应用的 `project.quickapp.json` 配置请参考[文件](https://github.com/NervJS/taro/blob/master/packages/taro-cli/src/config/manifest.default.json)
