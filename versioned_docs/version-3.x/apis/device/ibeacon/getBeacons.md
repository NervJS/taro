---
title: Taro.getBeacons(option)
sidebar_label: getBeacons
---

获取所有已搜索到的 iBeacon 设备

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/ibeacon/wx.getBeacons.html)

## 类型

```tsx
(option?: Option) => Promise<CallbackResult>
```

## 参数

| 参数 | 类型 |
| --- | --- |
| option | `Option` |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.IBeaconError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.IBeaconError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| beacons | `IBeaconInfo[]` | iBeacon 设备列表 |
| errMsg | `string` | 调用结果 |
