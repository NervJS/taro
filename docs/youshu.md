---
title: 接入腾讯有数无痕埋点能力
sidebar_label: 腾讯有数无痕埋点能力
---

Taro 引入了腾讯有数的微信小程序无痕埋点能力，为Taro 的开发者提供真·零开发的 8 大无痕埋点能力以及自定义埋点能力，包含**小程序启动、显示、隐藏、页面浏览、页面离开、分享、下拉刷新、上拉触底**等**八大自动化埋点能力**以及搜索、商品归因等**定制化埋点**，以及经营分析、直播分析、导购分析等能力。 

## 腾讯有数简介

 [腾讯有数](https://youshu.tencent.com/)是由[腾讯智慧零售](https://lingshou.tencent.com)推出，为品牌商、零售商打造的数据分析与管理平台，融合腾讯数据、技术与生态优势，提供全链路经营数据分析、消费者洞察、精准营销等能力，让企业经营更“有数”。

更多介绍请关注：[https://mp.zhls.qq.com/youshu-docs/start/youshu_intro.html](https://mp.zhls.qq.com/youshu-docs/start/youshu_intro.html)

## 功能介绍

腾讯有数 & Taro 合作开发的微信小程序模板，可以快速的通过 `taro init myApp` 选择 `default-youshu` 模板即可快速拥有无痕埋点能力，无需任何开发即可拥有小程序启动、显示、隐藏、页面浏览、页面离开、分享、下拉刷新、上拉触底等八大自动化埋点能力。

## 零开发快速体验指南

> 需要升级 Taro 到 2.x 或 3.x

1. `taro init myApp`
2. 选择`default-youshu`模板
3. `npm run dev:weapp`
4. 微信小程序开发者工具控制台即可看到8大行为日志上报
5. 访问 [https://docs.qq.com/form/fill/DUkZHalR0RUJCVkVj#/fill](https://docs.qq.com/form/fill/DUkZHalR0RUJCVkVj#/fill)  申请有数数据查看权限

> 通过上述流程已经让你的微信小程序拥有了8大用户行为埋点的体验能力，体验完成后，只需要更换有数的Token和微信小程序appid，即可拥有有数的正式版功能。正式账号获取路径：https://docs.qq.com/form/fill/DUkZHalR0RUJCVkVj#/fill

## 现存小程序的有数SDK接入

### 1. 安装

  * 通过npm安装SDK
`npm i sr-sdk-wxapp`
  * 在 app.jsx 中通过 import 引入 SDK
`import sr from 'sr-sdk-wxapp'`

### 2. 添加可信域名

登录[微信公众平台](https://mp.weixin.qq.com/)，进入<开发><开发设置><服务器域名>，将 `https://zhls.qq.com` 添加为 request 合法域名。


> 在开发环境中还有SDK版本检查，所以会提示 `https://sr-home-1257214331.cos.ap-guangzhou.myqcloud.com 不在以下 request 合法域名列表中` , 可以通过设置不校验域名来处理。

### 3. init 初始化

`init(options: object)`

配置接口，用来调整SDK的基础机制。应该在`App()`调用之前调用。

首次调用初始化SDK，再次调用覆盖之前传入的配置，可多次调用。 

| 名称   | 类型   | 必填   | 描述   | 
|:----|:----|:----|:----|
| appid   | string   | Y   | 微信小程序appId   | 
| token   | string   | Y   | 通过接入申请后，有数提供的凭证字符串   | 
| usePlugin   | bool   |    | 是否使用了小程序插件，默认是：false   | 
| debug   | bool   |    | 是否打印日志，默认是：false   | 
| openSdkShareDepth   | bool   |    | 是否打开分享链路记录功能，默认值为false，打开后，将记录用户分享链路A->B->C->D   | 
| serverUrl   | string   |    | 传入自定义的后台上报接口，若传入则token将无意义， 默认是：'https://zhls.qq.com/api/report'   | 
| trackApp   | bool   |    | 是否开启自动跟踪APP的曝光事件（APP相关预置事件，如 APP - onLuanch），默认是：true   | 
| proxyPage   | bool   |    | 是否开启自动代理 Page，默认是：false。SDK 负责上报页面的 browse 、leave、share 等事件可以使用 sr.page 代替 Page(sr.page(options))   | 
| autoStart   | bool   |    | 是否开启自动开始上报，默认是：false，open_id 无法自动获取，一般在 login 业务之后手动调用 sr.startReport 方法开启上报   | 

### 4. 示例

``` javascript
import sr from 'sr-sdk-wxapp'
sr.init({
  /**
   * 有数 - ka‘接入测试用’ 分配的 app_id，对应的业务接口人负责
   */
  token: 'bi72fccc7184ef4xxx',
  /**
   * 微信小程序appID，以wx开头
   */
  appid: 'wx195745e8e342bxxx',
  /**
   * 如果使用了小程序插件，需要设置为 true
   */
  usePlugin: false,
  /**
   * 开启打印调试信息， 默认 false
   */
  debug: true,
  /**
   * 建议开启-开启自动代理 Page， 默认 false
   * sdk 负责上报页面的 browse 、leave、share 等事件
   * 可以使用 sr.page 代替 Page(sr.page(options))
   * 元素事件跟踪，需要配合 autoTrack: true
   */
  proxyPage: true,
  /**
   * 建议开启-开启组件自动代理， 默认 false
   * sdk 负责上报页面的 browse 、leave、share 等事件
   */
  proxyComponent: true,
  // 建议开启-是否开启页面分享链路自动跟踪
  openSdkShareDepth: true,
  // 建议开启-元素事件跟踪，自动上报元素事件，入tap、change、longpress、confirm
  autoTrack: true,
})
```

 

