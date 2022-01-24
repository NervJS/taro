---
title: Taro.chooseInvoiceTitle(option)
sidebar_label: chooseInvoiceTitle
---

选择用户的发票抬头。当前小程序必须关联一个公众号，且这个公众号是完成了[微信认证](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1496554031_RD4xe)的，才能调用 chooseInvoiceTitle。

支持情况：<img title="微信小程序" src={require('@site/static/img/platform/weapp.png').default} className="icon_platform" width="25px"/> <img title="H5" src={require('@site/static/img/platform/h5.png').default} className="icon_platform icon_platform--not-support" width="25px"/> <img title="React Native" src={require('@site/static/img/platform/rn.png').default} className="icon_platform icon_platform--not-support" width="25px"/>

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/invoice/wx.chooseInvoiceTitle.html)

## 类型

```tsx
(option?: Option) => Promise<SuccessCallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| complete | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| fail | `(res: TaroGeneral.CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| success | `(result: SuccessCallbackResult) => void` | 否 | 接口调用成功的回调函数 |

### SuccessCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| bankAccount | `string` | 银行账号 |
| bankName | `string` | 银行名称 |
| companyAddress | `string` | 单位地址 |
| errMsg | `string` | 错误信息 |
| taxNumber | `string` | 抬头税号 |
| telephone | `string` | 手机号码 |
| title | `string` | 抬头名称 |
| type | `keyof invoice_type` | 抬头类型 |

### invoice_type

抬头类型

| 参数 | 类型 |
| --- | --- |
| 0 | `"单位"` |
| 1 | `"个人"` |

## 示例代码

```tsx
Taro.chooseInvoiceTitle({
  success: function(res) {}
})
```
