---
title: Taro.getSystemSetting()
sidebar_label: getSystemSetting
---

获取设备设置

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getSystemSetting.html)

## 类型

```tsx
() => Result
```

## 参数

### Result

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| bluetoothEnabled | `boolean` | 否 | 蓝牙的系统开关 |
| locationEnabled | `boolean` | 否 | 地理位置的系统开关 |
| wifiEnabled | `boolean` | 否 | Wi-Fi 的系统开关 |
| deviceOrientation | `keyof DeviceOrientation` | 否 | 设备方向 |

### DeviceOrientation

设备方向合法值

| 参数 | 说明 |
| --- | --- |
| portrait | 竖屏 |
| landscape | 横屏 |

## 示例代码

```tsx
const systemSetting = Taro.getSystemSetting()

console.log(systemSetting.bluetoothEnabled)
console.log(systemSetting.deviceOrientation)
console.log(systemSetting.locationEnabled)
console.log(systemSetting.wifiEnabled)
```
