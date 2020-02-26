---
title: RealtimeLogManager
sidebar_label: RealtimeLogManager
---

实时日志管理器实例，可以通过 Taro.getRealtimeLogManager 获取。

使用说明
为帮助小程序开发者快捷地排查小程序漏洞、定位问题，我们推出了实时日志功能。从基础库2.7.1开始，开发者可通过提供的接口打印日志，日志汇聚并实时上报到小程序后台。
开发者可从小程序管理后台“开发->运维中心->实时日志”进入日志查询页面，查看开发者打印的日志信息。

## 方法

### addFilterMsg

添加过滤关键字

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.addFilterMsg.html)

```tsx
(msg: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| msg | `string` | 是 setFilterMsg 的添加接口。用于设置多个过滤关键字。 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.addFilterMsg | ✔️ |  |  |

### error

写 error 日志

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.error.html)

```tsx
(...args: any[]) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| args | `any[]` | 日志内容，可以有任意多个。每次调用的参数的总大小不超过5Kb |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.error | ✔️ |  |  |

### in

设置实时日志page参数所在的页面

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.in.html)

```tsx
(pageInstance: any) => void
```

| 参数 | 说明 |
| --- | --- |
| pageInstance | page 实例 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.in | ✔️ |  |  |

### info

写 info 日志

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.info.html)

```tsx
(...args: any[]) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| args | `any[]` | 日志内容，可以有任意多个。每次调用的参数的总大小不超过5Kb |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.info | ✔️ |  |  |

### setFilterMsg

设置过滤关键字

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.setFilterMsg.html)

```tsx
(msg: string) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| msg | `string` | 过滤关键字，最多不超过1Kb，可以在小程序管理后台根据设置的内容搜索得到对应的日志。 |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.setFilterMsg | ✔️ |  |  |

### warn

写 warn 日志

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/RealtimeLogManager.warn.html)

```tsx
(...args: any[]) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| args | `any[]` | 日志内容，可以有任意多个。每次调用的参数的总大小不超过5Kb |

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.warn | ✔️ |  |  |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RealtimeLogManager.addFilterMsg | ✔️ |  |  |
| RealtimeLogManager.error | ✔️ |  |  |
| RealtimeLogManager.in | ✔️ |  |  |
| RealtimeLogManager.info | ✔️ |  |  |
| RealtimeLogManager.setFilterMsg | ✔️ |  |  |
| RealtimeLogManager.warn | ✔️ |  |  |
