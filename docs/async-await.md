---
title: 异步编程
---

Taro 支持使用 `async functions` 来让开发者获得不错的异步编程体验

开启 `async functions` 支持有两种形式

### generator 支持

这是默认的支持形式

需要安装包 `@tarojs/async-await`

```bash
$ yarn add @tarojs/async-await
# 或者使用 npm
$ npm install --save @tarojs/async-await
```

随后在项目入口文件 `app.js` 中直接 `import` ，就可以开始使用 `async functions` 功能了

```jsx
// src/app.js
import '@tarojs/async-await'
```

> 值得注意的事，使用 `@tarojs/async-await` 一定要记得按照[开发前注意](./before-dev-remind.md)中提示的内容进行操作，否则会出现报错

> 同时，由于支付宝小程序不支持访问 `global` 全局对象，所以如果要编译到支付宝小程序，需要采用第二种支持方式

### Promise 支持

需要安装 babel 的 [fast-async](https://github.com/MatAtBread/fast-async) 插件，同时修改 `config/index.js` 里的 babel 配置

```javascript
babel: {
  sourceMap: true,
  presets: [
    ['env', {
      exclude: [
        'transform-regenerator',
        'transform-async-to-generator'
      ]
    }]
  ],
  plugins: [
    'transform-class-properties',
    'transform-decorators-legacy',
    'transform-object-rest-spread',
    'fast-async'
  ]
}
```

这种方式不要安装 `@tarojs/async-await`，但是缺点是会造成代码冗余，这也是一个妥协的方案。
