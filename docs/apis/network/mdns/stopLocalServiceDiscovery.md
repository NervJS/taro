---
title: Taro.stopLocalServiceDiscovery(option)
sidebar_label: stopLocalServiceDiscovery
---

停止搜索 mDNS 服务

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.stopLocalServiceDiscovery.html)

## 类型

```tsx
(option?: Option) => void
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: FailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### FailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'task not found': 在当前没有处在搜索服务中的情况下调用 stopLocalServiceDiscovery; |
