---
title: 异步编程
---

自 Taro 2.0 开始，使用 async-await 时不再需要 `@tarojs/async-await`，详情请参考[针对 Taro 2.x 版本](#针对%20Taro%202.x%20版本)一节。

## 针对 Taro 1.x 版本

Taro 支持使用 `async functions` 来让开发者获得不错的异步编程体验，开启 `async functions` 支持需要安装包 `@tarojs/async-await`

```bash
$ yarn add babel-plugin-transform-runtime --dev
$ yarn add babel-runtime
```

随后修改项目 [`babel` 配置](./config-detail.md#babel)，增加插件 `babel-plugin-transform-runtime`

```js
babel: {
  sourceMap: true,
  presets: [
    [
      'env',
      {
        modules: false
      }
    ]
  ],
  plugins: [
    'transform-decorators-legacy',
    'transform-class-properties',
    'transform-object-rest-spread',
    ['transform-runtime', {
      "helpers": false,
      "polyfill": false,
      "regenerator": true,
      "moduleName": 'babel-runtime'
    }]
  ]
}
```

> 值得注意的事，使用 `@tarojs/async-await` 一定要记得按照[开发前注意](./before-dev-remind.md)中提示的内容进行操作，否则会出现报错

## 针对 Taro 2.x 版本

Taro 2.x 版本中使用 `async-await` 不再需要 `@tarojs/async-await`。

请在项目中分别安装 `babel-plugin-transform-runtime` 和 `babel-runtime` 两个包。

```bash
$ yarn add babel-plugin-transform-runtime --dev
$ yarn add babel-runtime
```

然后在项目 `config/index.js` 的 `babel` 配置中增加 `babel-plugin-transform-runtime` 插件配置：

```bash
babel: {
  sourceMap: true,
  presets: [
    [
      'env',
      {
        modules: false
      }
    ]
  ],
  plugins: [
    'transform-decorators-legacy',
    'transform-class-properties',
    'transform-object-rest-spread',
    ['transform-runtime', {
      "helpers": false,
      "polyfill": false,
      "regenerator": true,
      "moduleName": 'babel-runtime'
    }]
  ]
}
```
