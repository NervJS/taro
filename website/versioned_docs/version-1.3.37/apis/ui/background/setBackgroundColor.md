---
title: Taro.setBackgroundColor(option)
sidebar_label: setBackgroundColor
id: version-1.3.37-setBackgroundColor
original_id: setBackgroundColor
---

动态设置窗口的背景色

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/background/wx.setBackgroundColor.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| backgroundColor | `string` | 否 | 窗口的背景色，必须为十六进制颜色值 |
| backgroundColorBottom | `string` | 否 | 底部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持 |
| backgroundColorTop | `string` | 否 | 顶部窗口的背景色，必须为十六进制颜色值，仅 iOS 支持 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.setBackgroundColor({
  backgroundColor: '#ffffff', // 窗口的背景色为白色
})
Taro.setBackgroundColor({
  backgroundColorTop: '#ffffff', // 顶部窗口的背景色为白色
  backgroundColorBottom: '#ffffff', // 底部窗口的背景色为白色
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setBackgroundColor | ✔️ |  |  |
