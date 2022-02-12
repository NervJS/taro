---
title: Taro.makeBluetoothPair(option)
sidebar_label: makeBluetoothPair
---

蓝牙配对接口，仅安卓支持

通常情况下（需要指定 pin 码或者密码时）系统会接管配对流程，直接调用 [Taro.createBLEConnection](/docs/apis/device/bluetooth-ble/createBLEConnection) 即可。该接口只应当在开发者不想让用户手动输入 pin 码且真机验证确认可以正常生效情况下用。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.makeBluetoothPair.html)

## 类型

```tsx
(option: Option) => Promise<TaroGeneral.CallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| deviceId | `string` |  | 是 | 蓝牙设备 id |
| pin | `string` |  | 是 | pin 码，Base64 格式 |
| timeout | `string` | `20000` | 否 | 超时时间，单位 ms |
| complete | `(res: TaroGeneral.CallbackResult) => void` |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` |  | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` |  | 否 | 接口调用成功的回调函数 |
