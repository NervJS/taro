---
title: Taro.setEnableDebug(res)
sidebar_label: setEnableDebug
---

设置是否打开调试开关，此开关对正式版也能生效。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/base/debug/wx.setEnableDebug.html)

## 类型

```tsx
(res: Option) => Promise<Promised>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| enableDebug | `boolean` | 是 | 是否打开调试 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### Promised

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| errMsg | `string` | 调用结果 |

## 示例代码

```tsx
// 打开调试
Taro.setEnableDebug({
    enableDebug: true
})
// 关闭调试
Taro.setEnableDebug({
    enableDebug: false
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.setEnableDebug | ✔️ |  |  |
