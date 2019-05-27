---
title: API 说明
---

Taro 的 API 包括 Taro 内置提供的 API 以及对小程序的端能力 API 的封装。

其中对小程序的端能力 API 的封装，主要会基于微信小程序的 API 规范，对于其他小程序类似的 API，会在 Taro 中适配为小程序 API 的规范格式，并且都挂载在 `Taro` 命名空间下。

例如，支付宝小程序中，`my.alert` 用于弹出一个警告的模态框，而微信小程序中没有这一 API，与之类似的有 `wx.showModal`，所以在 Taro 中会将支付宝的 `my.alert` 统一为 `Taro.showModal`，从而减少一些跨平台兼容代码的书写。

而对于微信小程序中没有，而某些小程序平台特有的 API，可以先尝试用 `Taro.` + API 名称来进行调用，如果出现未定义，则使用对应小程序平台的命名空间（如 `my`、`swan`、`tt` 等）来进行调用，并反馈给我们。

当然，由于各个小程序平台的迭代非常快速，Taro 要不断跟进小程序的更新，有时候难免有些 API 没有加入 Taro 适配，你可以通过提 PR 或者 issue，来获得帮助。

同时，为了方便代码书写，Taro 默认对小程序的异步 API 进行了 `promisify` 化，你可以像使用 Promise 那样进行调用，例如

```js
import Taro from '@tarojs/taro'

Taro.request(url).then(function (res) {
  console.log(res)
})
```



