---
title: Taro.getDeviceInfo()
sidebar_label: getDeviceInfo
---

获取设备基础信息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> H5: 不支持 abi、benchmarkLevel

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getDeviceInfo.html)

## 类型

```tsx
() => Result
```

## 参数

### Result

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| abi | `string` | 否 | 应用二进制接口类型（仅 Android 支持） |
| benchmarkLevel | `number` | 是 | 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50） |
| brand | `string` | 是 | 设备品牌 |
| model | `string` | 是 | 设备型号 |
| system | `string` | 是 | 操作系统及版本 |
| platform | `string` | 是 | 客户端平台 |

## 示例代码

```tsx
const deviceInfo = Taro.getDeviceInfo()

console.log(deviceInfo.abi)
console.log(deviceInfo.benchmarkLevel)
console.log(deviceInfo.brand)
console.log(deviceInfo.model)
console.log(deviceInfo.platform)
console.log(deviceInfo.system)
```
