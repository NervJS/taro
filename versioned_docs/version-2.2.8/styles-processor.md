---
title: CSS 预处理器
---

自 Taro 2.2.8 开始，Taro 默认只能处理 CSS 为后缀的样式文件，当然，Taro 也提供了使用 Sass、Less 等 CSS 预处理器的方式，但是需要用户额外引入相关插件或者通过 Taro 的 webpackChain 配置来实现对这些 CSS 与处理器的支持。

Taro 官方提供了 `@tarojs/plugin-sass`、`@tarojs/plugin-less`、`@tarojs/plugin-stylus` 这三个插件，来分别实现对 Sass、Less、Stylus 的支持，可以按照如下方式进行引入。

首先需要安装插件，以 sass 处理插件 `@tarojs/plugin-sass` 为例

```bash
$ npm i --D @tarojs/plugin-sass
```

然后，在项目的 [`plugins`](./config-detail/#plugins) 配置中引入插件

```js
// config/index
const config = {
  plugins: [
    '@tarojs/plugin-sass'
  ]
}
```

这样，就能顺利在项目中使用 sass 了，而 less/stylus 支持也同理。

> 在 Taro 2.2.8 版本中我们对 webpack 的默认配置进行了拆分，将 CSS 预处理器的支持抽离出来了，这样做是一为了减小用户需要安装的依赖包大小，因为之前对 sass/less/stylus 的配置都写死的在 webpack 的配置中，这样的话用户无论如何都会安装这三个预处理器，即使项目中根本没有用到；二是为了方便扩展，开发者可以按照自己的需要去自定义更多的样式预处理器，同时也能开发自己的插件切换预处理器的编译工具，例如 `@tarojs/plugin-sass` 中的 sass 处理用的是 `node-sass`，开发者可以自己写一个插件使用 `sass` 包，来代替官方的 `@tarojs/plugin-sass` 插件。