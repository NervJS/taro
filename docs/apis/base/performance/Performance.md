---
title: Performance
sidebar_label: Performance
---

Performance 对象，用于获取性能数据及创建性能监听器

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/Performance.html)

## 方法

### createObserver

创建全局性能事件监听器

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/Performance.createObserver.html)

```tsx
(callback: Function) => PerformanceObserver
```

| 参数 | 类型 |
| --- | --- |
| callback | `Function` |

### getEntries

该方法返回当前缓冲区中的所有性能数据

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/Performance.getEntries.html)

```tsx
() => PerformanceEntry[]
```

### getEntriesByName

获取当前缓冲区中所有名称为 [name] 且类型为 [entryType] 的性能数据

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/Performance.getEntriesByName.html)

```tsx
(name: string, entryType: string) => PerformanceEntry[]
```

| 参数 | 类型 |
| --- | --- |
| name | `string` |
| entryType | `string` |

### getEntriesByType

获取当前缓冲区中所有类型为 [entryType] 的性能数据

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/Performance.getEntriesByType.html)

```tsx
(entryType: string) => PerformanceEntry[]
```

| 参数 | 类型 |
| --- | --- |
| entryType | `string` |

### setBufferSize

设置缓冲区大小，默认缓冲 30 条性能数据

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/Performance.setBufferSize.html)

```tsx
(size: number) => void
```

| 参数 | 类型 |
| --- | --- |
| size | `number` |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Performance | ✔️ |  |  |
| Performance.createObserver | ✔️ |  |  |
| Performance.getEntries | ✔️ |  |  |
| Performance.getEntriesByName | ✔️ |  |  |
| Performance.getEntriesByType | ✔️ |  |  |
| Performance.setBufferSize | ✔️ |  |  |
