---
title: Taro.stopBeaconDiscovery(option)
sidebar_label: stopBeaconDiscovery
---

停止搜索附近的 iBeacon 设备

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.stopBeaconDiscovery.html)

## 类型

```tsx
(option?: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: IBeaconError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: IBeaconError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: IBeaconError) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.stopBeaconDiscovery(params).then(...)
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.stopBeaconDiscovery | ✔️ |  |  |
