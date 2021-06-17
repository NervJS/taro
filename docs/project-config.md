---
title: 项目配置
---

各类小程序平台均有自己的项目配置文件，例如：

* 微信小程序，[project.config.json](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html?search-key=%E9%A1%B9%E7%9B%AE%E9%85%8D%E7%BD%AE)
* 百度小程序，[project.swan.json](https://smartprogram.baidu.com/docs/develop/devtools/projectconfig/)
* 字节跳动小程序，[project.config.json](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/basic-reference/catalog-structure/#projectconfigjson-%E9%85%8D%E7%BD%AE%E4%BB%8B%E7%BB%8D)
* QQ 小程序，project.config.json
* 支付宝小程序，[mini.project.json](https://opendocs.alipay.com/mini/framework/project)
* 京东小程序，暂无发现

为了能够适配不同小程序平台的配置文件不同的情况，Taro 支持为各个小程序平台添加各自的项目配置文件。

通过 Taro 模板创建的项目都会默认拥有 `project.config.json` 这一项目配置文件，这个文件 **只能用于微信小程序**，若要兼容到其他小程序平台，请按如下对应规则来增加相应平台的配置文件，其配置与各自小程序平台要求的一致：

| 小程序平台 | 添加配置文件 |
| --- | --- |
| 微信小程序 | project.config.json |
| 百度小程序 | project.swan.json |
| 字节跳动小程序 | project.tt.json |
| QQ小程序 | project.qq.json |
| 支付宝小程序 | project.alipay.json |
