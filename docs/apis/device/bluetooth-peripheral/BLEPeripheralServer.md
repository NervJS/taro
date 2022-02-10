---
title: BLEPeripheralServer
sidebar_label: BLEPeripheralServer
---

外围设备的服务端

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.html)

## 方法

| 参数 | 说明 |
| --- | --- |
| addService | 添加服务<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.addService.html) |
| offCharacteristicReadRequest | 取消监听已连接的设备请求读当前外围设备的特征值事件<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicReadRequest.html) |
| offCharacteristicSubscribed | 取消监听特征订阅事件<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicSubscribed.html) |
| offCharacteristicUnsubscribed | 取消监听取消特征订阅事件<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicUnsubscribed.html) |
| offCharacteristicWriteRequest | 取消监听已连接的设备请求写当前外围设备的特征值事件<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.offCharacteristicWriteRequest.html) |
| onCharacteristicReadRequest | 监听已连接的设备请求读当前外围设备的特征值事件<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicReadRequest.html) |
| onCharacteristicSubscribed | 监听特征订阅事件，仅 iOS 支持<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicSubscribed.html) |
| onCharacteristicUnsubscribed | 监听取消特征订阅事件，仅 iOS 支持<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicUnsubscribed.html) |
| onCharacteristicWriteRequest | 监听已连接的设备请求写当前外围设备的特征值事件<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.onCharacteristicWriteRequest.html) |
| removeService | 移除服务<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.removeService.html) |
| startAdvertising | 开始广播本地创建的外围设备<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.startAdvertising.html) |
| stopAdvertising | 停止广播<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.stopAdvertising.html) |
| writeCharacteristicValue | 往指定特征写入二进制数据值，并通知已连接的主机，从机的特征值已发生变化，该接口会处理是走回包还是走订阅<br />API 支持度: weapp<br />[参考地址](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.writeCharacteristicValue.html) |

### close

关闭当前服务端

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth-peripheral/BLEPeripheralServer.close.html)

```tsx
(option: CloseOption) => void
```

| 参数 | 类型 |
| --- | --- |
| option | `CloseOption` |

## 参数

### CloseOption

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| BLEPeripheralServer | ✔️ |  |  |
| BLEPeripheralServer.addService | ✔️ |  |  |
| BLEPeripheralServer.close | ✔️ |  |  |
| BLEPeripheralServer.offCharacteristicReadRequest | ✔️ |  |  |
| BLEPeripheralServer.offCharacteristicSubscribed | ✔️ |  |  |
| BLEPeripheralServer.offCharacteristicUnsubscribed | ✔️ |  |  |
| BLEPeripheralServer.offCharacteristicWriteRequest | ✔️ |  |  |
| BLEPeripheralServer.onCharacteristicReadRequest | ✔️ |  |  |
| BLEPeripheralServer.onCharacteristicSubscribed | ✔️ |  |  |
| BLEPeripheralServer.onCharacteristicUnsubscribed | ✔️ |  |  |
| BLEPeripheralServer.onCharacteristicWriteRequest | ✔️ |  |  |
| BLEPeripheralServer.removeService | ✔️ |  |  |
| BLEPeripheralServer.startAdvertising | ✔️ |  |  |
| BLEPeripheralServer.stopAdvertising | ✔️ |  |  |
| BLEPeripheralServer.writeCharacteristicValue | ✔️ |  |  |
