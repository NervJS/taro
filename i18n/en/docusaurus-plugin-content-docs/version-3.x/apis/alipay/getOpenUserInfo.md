---
title: Taro.getOpenUserInfo()
sidebar_label: getOpenUserInfo
---

This interface allows you to obtain basic information about your Alipay members (avatar image address, nickname, gender, country code, province and city), see [details](https://docs.alipay.com/mini/api/ch8chh).To obtain the Alipay member ID (user_id), please call `my.getAuthCode` and `alipay.system.oauth.token` interfaces.

> [Reference](https://docs.alipay.com/mini/api/ch8chh)

## Type

```tsx
() => Promise<string>
```

## Parameters

## API Support

| API | WeChat Mini-Program | Alipay Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: |
| Taro.getOpenUserInfo |  | ✔️ |  |  |
