---
title: 微信小程序独立分包
---

Taro 支持使用微信小程序的独立分包功能，配置方法和微信小程序中一致，请参考[《微信小程序插件开发文档》s](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html)。

## 示例

- [weapp-independent-subpackages](https://github.com/NervJS/taro/tree/next/examples/weapp-independent-subpackages)

## 配置方法

假设小程序目录结构如下：

    ├── config
    ├── src
    |   ├── pages
    |   |   └── index
    |   ├── moduleA
    |   |   └── pages
    |   |       ├── rabbit
    |   |       └── squirrel
    |   ├── moduleB
    |   |   └── pages
    |   |       ├── pear
    |   |       └── pineapple
    |   ├── app.css
    |   ├── app.json
    |   └── app.js
    └── package.json


开发者通过在 `app.json` 的 `subpackages` 字段中，给对应的分包配置项中定义的 `independent` 字段声明对应分包为独立分包：

```js title="app.json" {18}
{
  "pages": [
    "pages/index"
  ],
  "subpackages": [
    {
      "root": "moduleA",
      "pages": [
        "pages/rabbit",
        "pages/squirrel"
      ]
    }, {
      "root": "moduleB",
      "pages": [
        "pages/pear",
        "pages/pineapple"
      ],
      "independent": true
    }
  ]
}
```
