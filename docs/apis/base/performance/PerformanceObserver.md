---
title: PerformanceObserver
sidebar_label: PerformanceObserver
---

PerformanceObserver 对象，用于监听性能相关事件

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/PerformanceObserver.html)

## 方法

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| supportedEntryTypes | `PerformanceEntry[]` | 获取当前支持的所有性能指标类型 |

### disconnect

停止监听

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/PerformanceObserver.disconnect.html)

```tsx
() => void
```

### observe

开始监听

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/PerformanceObserver.observe.html)

```tsx
(option: Option) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

## 参数

### observe

#### Option

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| type | `keyof EntryType` | 指标类型。不能和 entryTypes 同时使用 |
| entryTypes | `(keyof EntryType)[]` | 指标类型列表。不能和 type 同时使用。 |

#### EntryType

| 参数 | 说明 |
| --- | --- |
| navigation | 路由 |
| render | 渲染 |
| script | 脚本 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| PerformanceObserver | ✔️ |  |  |
| PerformanceObserver.disconnect | ✔️ |  |  |
| PerformanceObserver.observe | ✔️ |  |  |
