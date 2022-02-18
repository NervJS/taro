---
title: Taro.getWindowInfo()
sidebar_label: getWindowInfo
---

获取窗口信息

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> H5: 不支持 statusBarHeight、safeArea

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getWindowInfo.html)

## 类型

```tsx
() => Result
```

## 参数

### Result

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| pixelRatio | `number` | 是 | 设备像素比 |
| screenWidth | `number` | 是 | 屏幕宽度，单位px |
| screenHeight | `number` | 是 | 屏幕高度，单位px |
| windowWidth | `number` | 是 | 可使用窗口宽度，单位px |
| windowHeight | `number` | 是 | 可使用窗口高度，单位px |
| statusBarHeight | `number` | 否 | 状态栏的高度，单位px |
| safeArea | `TaroGeneral.SafeAreaResult` | 否 | 在竖屏正方向下的安全区域 |

## 示例代码

```tsx
const windowInfo = Taro.getWindowInfo()

console.log(windowInfo.pixelRatio)
console.log(windowInfo.screenWidth)
console.log(windowInfo.screenHeight)
console.log(windowInfo.windowWidth)
console.log(windowInfo.windowHeight)
console.log(windowInfo.statusBarHeight)
console.log(windowInfo.safeArea)
console.log(windowInfo.screenTop)
```
