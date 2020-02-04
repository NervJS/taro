---
title: Taro.getSelectedTextRange(option)
sidebar_label: getSelectedTextRange
---

在input、textarea等focus之后，获取输入框的光标位置。注意：只有在focus的时候调用此接口才有效。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/keyboard/wx.getSelectedTextRange.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| end | `number` | 输入框光标结束位置 |
| start | `number` | 输入框光标起始位置 |
| errMsg | `string` | 调用结果 |

## 示例代码

```tsx
Taro.getSelectedTextRange({
  complete: res => {
    console.log('getSelectedTextRange res', res.start, res.end)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getSelectedTextRange | ✔️ |  |  |
