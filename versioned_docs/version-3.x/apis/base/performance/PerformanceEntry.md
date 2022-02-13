---
title: PerformanceEntry
sidebar_label: PerformanceEntry
---

单条性能数据

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/PerformanceEntry.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| entryType | `keyof EntryType` | 指标类型 |
| name | `keyof EntryName` | 指标名称 |
| startTime | `number` | 开始时间，不同指标的具体含义会有差异 |
| duration | `number` | 耗时 ms。仅对于表示阶段的指标有效。 |
| path | `string` | 页面路径。仅 render 和 navigation 类型指标有效。 |
| navigationStart | `number` | 路由真正响应开始时间。仅 navigation 类型指标有效。 |
| navigationType | `string` | 路由详细类型，与小程序路由方法对应。仅 navigation 类型指标有效。 |
| moduleName | `string` | 分包名，主包表示为 APP。仅 evaluateScript 指标有效。 |
| fileList | `string[]` | 注入文件列表。仅 evaluateScript 指标有效。 |
| viewLayerReadyTime | `number` | 渲染层代码注入完成时间。仅 firstRender 指标有效。 |
| initDataSendTime | `number` | 首次渲染参数从逻辑层发出的时间。仅 firstRender 指标有效。 |
| initDataRecvTime | `number` | 首次渲染参数在渲染层收到的时间。仅 firstRender 指标有效。 |
| viewLayerRenderStartTime | `number` | 渲染层执行渲染开始时间。仅 firstRender 指标有效。 |
| viewLayerRenderEndTime | `number` | 渲染层执行渲染结束时间。仅 firstRender 指标有效。 |

## 参数

### EntryType

entryType 的合法值

| 参数 | 说明 |
| --- | --- |
| navigation | 路由 |
| render | 渲染 |
| script | 脚本 |

### EntryName

name 的合法值

| 参数 | 说明 |
| --- | --- |
| appLaunch | 小程序启动耗时。起点为用户点击小程序图标，或小程序被拉起的时间；终点为首页 onReady。(entryType: navigation) |
| route | 路由处理耗时。(entryType: navigation) |
| firstRender | 页面首次渲染耗时。起点为逻辑层收到路由事件，包括逻辑层页面与组件初始化、VD 同步、渲染层执行渲染的时间；终点为首页 onReady。(entryType: render) |
| firstPaint | [页面首次绘制](https://developer.mozilla.org/en-US/docs/Glossary/First_paint)。第一个像素渲染到屏幕上所用的时间。(entryType: render) |
| firstContentfulPaint | [页面首次内容绘制](https://developer.mozilla.org/en-US/docs/Glossary/First_contentful_paint)。第一块内容渲染到屏幕上所用的时间。(entryType: render) |
| evaluateScript | 逻辑层 JS 代码注入耗时。(entryType: script) |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PerformanceEntry | ✔️ |  |  |
