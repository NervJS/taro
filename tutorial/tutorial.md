---
title: 教程
---

Taro 支持使用 `async functions` 来让开发者获得不错的异步编程体验，开启 `async functions` 支持需要安装包 `@tarojs/async-await`

```bash
$ yarn add @tarojs/async-await
# 或者使用 npm
$ npm install --save @tarojs/async-await
```

随后在项目入口文件 `app.js` 中直接 `import` ，就可以开始使用 `async functions` 功能了

```javascript
// src/app.js
import '@tarojs/async-await'
```

> 值得注意的事，使用 `@tarojs/async-await` 一定要记得按照[开发前注意](./before-dev-remind.md)中提示的内容进行操作，否则会出现报错
