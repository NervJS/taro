---
title: API Introduction
---

Taro's APIs include the built-in APIs provided by Taro and the different APIs defined by each mini-program platform.

The encapsulation of the APIs defined by the mini-program platform will be based on the API specification of the WeChat mini-program. For the similar API in other platforms, it will be adapted to the standard format in Taro, and be mounted under the namespace `Taro`.

For example, in the Alipay mini-program, `my.alert` is used to pop up a warning modal, while there is no such API in the Wechat mini-program. Instead, it's called `wx.showModal` in the Wechat mini-program, so Alipay’s ` my.alert` is unified as `Taro.showModal`, thus reducing the redundant writing of cross-platform compatible codes.

For APIs that are not available in the WeChat mini-program and are unique to some mini-program platforms, you could first try to call them with `Taro.` + API name. If there is no definition, use the namespace of the corresponding mini-program platform (such as `my `, `swan`, `tt`, etc.) to call and feedback to us.

Due to the rapid iteration of each platform, Taro has to keep up with the update of them. Sometimes it is inevitable that the APIs are not adapted to Taro. You could get help by raising a PR or issue.

Meanwhile, to facilitate coding, Taro has “promisify” the asynchronous API of the mini-program. You could call it like a Promise, for example:

```js
import Taro from '@tarojs/taro'

Taro.request(url).then(function (res) {
  console.log(res)
})
```
