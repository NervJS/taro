---
title: Taro.setKeepScreenOn(option)
sidebar_label: setKeepScreenOn
id: version-1.3.37-setKeepScreenOn
original_id: setKeepScreenOn
---

设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/screen/wx.setKeepScreenOn.html)

## 类型

```tsx
(option: Option) => Promise<Promised>
```

## 参数

### Promised

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 调用结果 |

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| keepScreenOn | `boolean` | 是 | 是否保持屏幕常亮 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
// 保持屏幕常亮
Taro.setKeepScreenOn({
    keepScreenOn: true
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setKeepScreenOn | ✔️ |  |  |
