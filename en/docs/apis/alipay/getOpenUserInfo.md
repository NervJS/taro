---
title: Taro.getOpenUserInfo()
sidebar_label: getOpenUserInfo
---

此接口可获取支付宝会员的基础信息（头像图片地址、昵称、性别、国家码、省份、所在市区），接入方法请参考 获取会员基础信息介绍。This interface allows you to obtain basic information about your Alipay members (avatar image address, nickname, gender, country code, province and city), see [details](https://docs.alipay.com/mini/api/ch8chh).To obtain the Alipay member ID (user_id), please call `my.getAuthCode` and `alipay.system.oauth.token` interfaces.

> [Reference](https://docs.alipay.com/mini/api/ch8chh)

## Type

```tsx
() => Promise<string>
```

## Parameters

## API Support

|         API          | WeChat Mini-Program | Alipay Mini-Program | H5 | React Native |
|:--------------------:|:-------------------:|:-------------------:|:--:|:------------:|
| Taro.getOpenUserInfo |                     |         ✔️          |    |              |
