---
title: Taro.getExtConfigSync()
sidebar_label: getExtConfigSync
---

Taro.getExtConfig 的同步版本。

**Tips**
1. 本接口暂时无法通过 Taro.canIUse 判断是否兼容，开发者需要自行判断 Taro.getExtConfigSync 是否存在来兼容

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ext/wx.getExtConfigSync.html)

## 类型

```tsx
() => ExtInfo
```

## 参数

### ExtInfo

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| extConfig | `Record<string, any>` | 第三方平台自定义的数据 |

## 示例代码

```tsx
let extConfig = Taro.getExtConfigSync? Taro.getExtConfigSync(): {}

console.log(extConfig)
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | QQ 小程序 | H5 | React Native | 快应用 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Taro.getExtConfigSync | ✔️ |  |  |  |  |  |  |  |
