---
title: Taro.getBLEMTU(option)
sidebar_label: getBLEMTU
---

获取蓝牙低功耗的最大传输单元。需在 [Taro.createBLEConnection](/docs/apis/device/bluetooth-ble/createBLEConnection) 调用成功后调用。

注意:
- 小程序中 MTU 为 ATT_MTU，包含 Op-Code 和 Attribute Handle 的长度，实际可以传输的数据长度为 ATT_MTU - 3
- iOS 系统中 MTU 为固定值；安卓系统中，MTU 会在系统协商成功之后发生改变，建议使用 [Taro.onBLEMTUChange](/docs/apis/device/bluetooth-ble/onBLEMTUChange) 监听。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-ble/wx.getBLEMTU.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| deviceId | `string` |  | 是 | 蓝牙设备 id |
| writeType | `keyof writeType` | `"write"` | 是 | 写模式 （iOS 特有参数） |
| complete | `(res: TaroGeneral.BluetoothError) => void` |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.BluetoothError) => void` |  | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` |  | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| mtu | `number` | 最大传输单元 |

### writeType

写模式合法值

| 参数 | 说明 |
| --- | --- |
| write | 有回复写 |
| writeNoResponse | 无回复写 |

## 示例代码

```tsx
Taro.getBLEMTU({
  deviceId: '',
  writeType: 'write',
  success (res) {
    console.log(res)
  }
})
```
