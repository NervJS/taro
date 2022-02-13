---
title: EntryList
sidebar_label: EntryList
---

EntryList 对象

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/EntryList.html)

## 方法

### getEntries

该方法返回当前列表中的所有性能数据

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/EntryList.getEntries.html)

```tsx
() => PerformanceEntry[]
```

### getEntriesByName

获取当前列表中所有名称为 [name] 且类型为 [entryType] 的性能数据

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/EntryList.getEntriesByName.html)

```tsx
(name: string, entryType: string) => PerformanceEntry[]
```

| 参数 | 类型 |
| --- | --- |
| name | `string` |
| entryType | `string` |

### getEntriesByType

获取当前列表中所有类型为 [entryType] 的性能数据

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/EntryList.getEntriesByType.html)

```tsx
(entryType: string) => PerformanceEntry[]
```

| 参数 | 类型 |
| --- | --- |
| entryType | `string` |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| EntryList | ✔️ |  |  |
| EntryList.getEntries | ✔️ |  |  |
| EntryList.getEntriesByName | ✔️ |  |  |
| EntryList.getEntriesByType | ✔️ |  |  |
