---
title: 异步编程
---

Taro 支持使用 `async functions` 来让开发者获得不错的异步编程体验

在 **微信小程序/百度小程序/H5/React Native** 下均需要安装包 `@tarojs/async-await` 获得支持，而 **支付宝小程序** 则不需要，不过为了兼容多端，还是需要安装包 `@tarojs/async-await` 

```bash
$ yarn add @tarojs/async-await
# 或者使用 npm
$ npm install --save @tarojs/async-await
```

随后在项目入口文件 `app.js` 中最开始的位置进行引用，就可以开始使用 `async functions` 功能了

```jsx
// src/app.js
/* eslint-disable */
// 支付宝小程序不需要引用 @tarojs/async-await
if (process.env.TARO_ENV !== 'alipay') {
  require('@tarojs/async-await')
}
/* eslint-enable */
```

> 值得注意的事，使用 `@tarojs/async-await` 一定要记得按照[开发前注意](./before-dev-remind.md)中提示的内容进行操作，否则会出现报错
