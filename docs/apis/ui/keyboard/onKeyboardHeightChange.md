---
title: Taro.onKeyboardHeightChange(callback)
sidebar_label: onKeyboardHeightChange
---

监听键盘高度变化

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/keyboard/wx.onKeyboardHeightChange.html)

## 类型

```tsx
(callback: Callback) => void
```

## 参数

### Callback

```tsx
(result: CallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `CallbackResult` |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| height | `number` | 键盘高度 |

## 示例代码

```tsx
Taro.onKeyboardHeightChange(res => {
  console.log(res.height)
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.onKeyboardHeightChange | ✔️ |  |  |
