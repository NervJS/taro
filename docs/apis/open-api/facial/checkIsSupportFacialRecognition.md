---
title: Taro.checkIsSupportFacialRecognition(option)
sidebar_label: checkIsSupportFacialRecognition
---

检查是否支持面部识别

## 类型

```tsx
(option?: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| checkAliveType | `number` | 否 | 交互方式 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### CallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 错误信息 |
| errCode | `number` | 错误码 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.checkIsSupportFacialRecognition | ✔️ |  |  |
