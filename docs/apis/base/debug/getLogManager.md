---
title: Taro.getLogManager(res)
sidebar_label: getLogManager
---

获取日志管理器对象。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.getLogManager.html)

## 类型

```tsx
(res?: Option) => LogManager
```

## 参数

| 参数 | 类型 |
| --- | --- |
| res | `Option` |

### Option

| 参数 | 类型 | 默认值 | 必填 |
| --- | --- | :---: | :---: |
| level | `keyof level` | `0` | 否 |

### level

| 参数 | 说明 |
| --- | --- |
| 0 | 表示会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志 |
| 1 | 表示不会把 App、Page 的生命周期函数和 wx 命名空间下的函数调用写入日志 |

## 示例代码

```tsx
const logger = Taro.getLogManager({level: 1})

logger.log({str: 'hello world'}, 'basic log', 100, [1, 2, 3])
logger.info({str: 'hello world'}, 'info log', 100, [1, 2, 3])
logger.debug({str: 'hello world'}, 'debug log', 100, [1, 2, 3])
logger.warn({str: 'hello world'}, 'warn log', 100, [1, 2, 3])
```
