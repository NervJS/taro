---
title: Taro.chooseAddress(option)
sidebar_label: chooseAddress
---

获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html)

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
| cityName | `string` | 国标收货地址第二级地址 |
| countyName | `string` | 国标收货地址第三级地址 |
| detailInfo | `string` | 详细收货地址信息 |
| errMsg | `string` | 错误信息 |
| nationalCode | `string` | 收货地址国家码 |
| postalCode | `string` | 邮编 |
| provinceName | `string` | 国标收货地址第一级地址 |
| telNumber | `string` | 收货人手机号码 |
| userName | `string` | 收货人姓名 |

## 示例代码

```tsx
Taro.chooseAddress({
  success: function (res) {
    console.log(res.userName)
    console.log(res.postalCode)
    console.log(res.provinceName)
    console.log(res.cityName)
    console.log(res.countyName)
    console.log(res.detailInfo)
    console.log(res.nationalCode)
    console.log(res.telNumber)
  }
})
```

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.chooseAddress | ✔️ |  |  |
