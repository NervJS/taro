---
title: JS 代码压缩
---

自 Taro 2.2.8 开始，Taro 将 JS 代码压缩处理抽离成了 Taro 插件，Taro 自身默认不具备代码压缩能力，需要使用安装相应插件才行。

Taro 提供了 2 个 JS 压缩插件，分别为 `@tarojs/plugin-uglify`、`@tarojs/plugin-terser`。

- `@tarojs/plugin-uglify`，使用 [`uglifyjs-webpack-plugin`](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) 来压缩 JS 代码
- `@tarojs/plugin-terser`，使用 [`terser-webpack-plugin`](https://github.com/webpack-contrib/terser-webpack-plugin) 来压缩 JS 代码

使用方式如下：

首先需要安装插件，以 `@tarojs/plugin-terser` 为例

```bash
$ npm i --D @tarojs/plugin-terser
```

然后，在项目的 [`plugins`](./config-detail/#plugins) 配置中引入插件

```js
// config/index
const config = {
  plugins: [
    '@tarojs/plugin-terser'
  ]
}
```

引入插件之后，就能通过编译配置中的 [`terser`](./config-detail/#terser) 进行配置了。
