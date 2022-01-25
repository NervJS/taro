---
title: Taro.scanCode(option)
sidebar_label: scanCode
---

调起客户端扫码界面，扫码成功后返回对应的结果

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/scan/wx.scanCode.html)

## 类型

```tsx
(option: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| onlyFromCamera | `boolean` | 否 | 是否只能从相机扫码，不允许从相册选择图片 |
| scanType | `(keyof ScanType)[]` | 否 | 扫码类型 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| charSet | `string` | 所扫码的字符集 |
| path | `string` | 当所扫的码为当前小程序二维码时，会返回此字段，内容为二维码携带的 path |
| rawData | `string` | 原始数据，base64编码 |
| result | `string` | 所扫码的内容 |
| scanType | `keyof QRType` | 所扫码的类型 |
| errMsg | `string` | 调用结果 |

### ScanType

扫码类型

| 参数 | 说明 |
| --- | --- |
| barCode | 一维码 |
| qrCode | 二维码 |
| datamatrix | Data Matrix 码 |
| pdf417 | PDF417 条码 |

### QRType

所扫码的类型

| 参数 | 说明 |
| --- | --- |
| QR_CODE | 二维码 |
| AZTEC | 一维码 |
| CODABAR | 一维码 |
| CODE_39 | 一维码 |
| CODE_93 | 一维码 |
| CODE_128 | 一维码 |
| DATA_MATRIX | 二维码 |
| EAN_8 | 一维码 |
| EAN_13 | 一维码 |
| ITF | 一维码 |
| MAXICODE | 一维码 |
| PDF_417 | 二维码 |
| RSS_14 | 一维码 |
| RSS_EXPANDED | 一维码 |
| UPC_A | 一维码 |
| UPC_E | 一维码 |
| UPC_EAN_EXTENSION | 一维码 |
| WX_CODE | 二维码 |
| CODE_25 | 一维码 |

## 示例代码

```tsx
// 允许从相机和相册扫码
Taro.scanCode({
  success: (res) => {
    console.log(res)
  }
})
      // 只允许从相机扫码
Taro.scanCode({
  onlyFromCamera: true,
  success: (res) => {
    console.log(res)
  }
})
```
