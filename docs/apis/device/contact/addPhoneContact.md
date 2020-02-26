---
title: Taro.addPhoneContact(option)
sidebar_label: addPhoneContact
---

添加手机通讯录联系人。用户可以选择将该表单以「新增联系人」或「添加到已有联系人」的方式，写入手机系统通讯录。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/contact/wx.addPhoneContact.html)

## 类型

```tsx
(option: Option) => Promise<CallbackResult>
```

## 参数

### Option

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| firstName | `string` | 是 | 名字 |
| addressCity | `string` | 否 | 联系地址城市 |
| addressCountry | `string` | 否 | 联系地址国家 |
| addressPostalCode | `string` | 否 | 联系地址邮政编码 |
| addressState | `string` | 否 | 联系地址省份 |
| addressStreet | `string` | 否 | 联系地址街道 |
| complete | `(res: CallbackResult) => void` | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |
| email | `string` | 否 | 电子邮件 |
| fail | `(res: CallbackResult) => void` | 否 | 接口调用失败的回调函数 |
| homeAddressCity | `string` | 否 | 住宅地址城市 |
| homeAddressCountry | `string` | 否 | 住宅地址国家 |
| homeAddressPostalCode | `string` | 否 | 住宅地址邮政编码 |
| homeAddressState | `string` | 否 | 住宅地址省份 |
| homeAddressStreet | `string` | 否 | 住宅地址街道 |
| homeFaxNumber | `string` | 否 | 住宅传真 |
| homePhoneNumber | `string` | 否 | 住宅电话 |
| hostNumber | `string` | 否 | 公司电话 |
| lastName | `string` | 否 | 姓氏 |
| middleName | `string` | 否 | 中间名 |
| mobilePhoneNumber | `string` | 否 | 手机号 |
| nickName | `string` | 否 | 昵称 |
| organization | `string` | 否 | 公司 |
| photoFilePath | `string` | 否 | 头像本地文件路径 |
| remark | `string` | 否 | 备注 |
| success | `(res: CallbackResult) => void` | 否 | 接口调用成功的回调函数 |
| title | `string` | 否 | 职位 |
| url | `string` | 否 | 网站 |
| weChatNumber | `string` | 否 | 微信号 |
| workAddressCity | `string` | 否 | 工作地址城市 |
| workAddressCountry | `string` | 否 | 工作地址国家 |
| workAddressPostalCode | `string` | 否 | 工作地址邮政编码 |
| workAddressState | `string` | 否 | 工作地址省份 |
| workAddressStreet | `string` | 否 | 工作地址街道 |
| workFaxNumber | `string` | 否 | 工作传真 |
| workPhoneNumber | `string` | 否 | 工作电话 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.addPhoneContact | ✔️ |  |  |
