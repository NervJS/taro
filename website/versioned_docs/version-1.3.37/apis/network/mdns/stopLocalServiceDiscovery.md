---
title: Taro.stopLocalServiceDiscovery(option)
sidebar_label: stopLocalServiceDiscovery
id: version-1.3.37-stopLocalServiceDiscovery
original_id: stopLocalServiceDiscovery
---

停止搜索 mDNS 服务

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.stopLocalServiceDiscovery.html)

## 类型

```tsx
(option?: Option) => void
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(result: FailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### FailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息<br /><br />可选值：<br />- 'task not found': 在当前没有处在搜索服务中的情况下调用 stopLocalServiceDiscovery; |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.stopLocalServiceDiscovery | ✔️ |  |  |
