---
title: Taro.getOpenUserInfo()
sidebar_label: getOpenUserInfo
---

此接口可获取支付宝会员的基础信息（头像图片地址、昵称、性别、国家码、省份、所在市区），接入方法请参考 获取会员基础信息介绍。如需获取支付宝会员标识（user_id），请调用 my.getAuthCode 和 alipay.system.oauth.token 接口。

> [参考文档](https://docs.alipay.com/mini/api/ch8chh)

## 类型

```tsx
() => Promise<string>
```

## 参数

## API 支持度

| API | 微信小程序 | 支付宝小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| Taro.getOpenUserInfo |  | ✔️ |  |  |
