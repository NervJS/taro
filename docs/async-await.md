---
title: 异步编程
---

Taro 支持使用 `async functions` 来让开发者获得不错的异步编程体验，开启 `async functions` 支持需要使用到 `babel-plugin-transform-runtime` 插件，请按如下操作

首先需要在项目中分别安装 `babel-plugin-transform-runtime` 和 `babel-runtime` 两个包

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

这样就能直接在项目中使用 `async functions` 了。
