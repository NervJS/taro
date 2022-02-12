---
title: Taro.setBLEMTU(option)
sidebar_label: setBLEMTU
---

协商设置蓝牙低功耗的最大传输单元 (Maximum Transmission Unit, MTU)

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.setBLEMTU.html)

## 类型

```tsx
(option: Option) => Promise<Promised>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Promised

```tsx
FailCallbackResult | SuccessCallbackResult
```

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| deviceId | `string` | 是 | 蓝牙设备 id |
| mtu | `number` | 是 | 最大传输单元。设置范围为 (22,512) 区间内，单位 bytes |
| complete | `(res: Promised) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: FailCallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### FailCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| mtu | `string` | 最终协商的 MTU 值。如果协商失败则无此参数。安卓客户端 8.0.9 开始支持。 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| mtu | `string` | 最终协商的 MTU 值，与传入参数一致。安卓客户端 8.0.9 开始支持。 |
