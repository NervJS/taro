---
title: Taro.getHCEState(option)
sidebar_label: getHCEState
id: version-1.3.37-getHCEState
original_id: getHCEState
---

判断当前设备是否支持 HCE 能力。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/nfc/wx.getHCEState.html)

## 类型

```tsx
(option?: Option) => Promise<NFCError>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: NFCError) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: NFCError) => void` | 否 | 接口调用失败的回调函数 |
| success | `(res: NFCError) => void` | 否 | 接口调用成功的回调函数 |

## 示例代码

```tsx
Taro.getHCEState({
  success: function (res) {
    console.log(res.errCode)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.getHCEState | ✔️ |  |  |
