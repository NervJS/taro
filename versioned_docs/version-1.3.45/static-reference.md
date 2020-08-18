---
title: 静态资源引用
---

在 Taro 中可以像使用 [Webpack](https://webpack.js.org/) 那样自由地引用静态资源，而且不需要安装任何 Loaders。

## 引用样式文件

可以直接通过 ES6 的 `import` 语法来引用样式文件

例如引用 CSS 文件

```jsx
import './css/path/name.css'
```

引用 SCSS 文件

```jsx
import './css/path/name.scss'
```

## 引用 JS 文件

可以直接通过 ES6 的 `import` 语法来引用 JS 文件

```jsx
import { functionName } from './css/path/name.js'

import defaultExportName from './css/path/name.js'
```

## 引用图片、音频、字体等文件

可以直接通过 ES6 的 `import` 语法来引用此类文件，拿到文件引用后直接在 JSX 中进行使用

```jsx

// 引用文件
import namedPng from '../../images/path/named.png'

// 使用
<View>
  <Image src={namedPng} />
</View>
```

## 引用 JSON 文件

可以直接通过 ES6 的 `import` 语法来引用此类文件，拿到 JSON 文件输出的 JSON 数据

```jsx
// 引用 json 文件
/**
* named.json
* {
*   x: 1
* }
**/
import namedJson from '../../json/path/named.json'

console.log(namedJson.x)
```

## 小程序样式中引用本地资源

在小程序的样式中，默认不能直接引用本地资源，只能通过网络地址、Base64 的方式来进行资源引用，为了方便开发，Taro 提供了直接在样式文件中引用本地资源的方式，其原理是通过 `PostCSS` 的 [`postcss-url`](https://github.com/postcss/postcss-url) 插件将样式中本地资源引用转换成 Base64 格式，从而能正常加载。

Taro 默认会对 `10kb` 大小以下的资源进行转换，如果需要修改配置，可以在 `config/index.js` 中进行修改，配置位于 [`weapp.module.postcss`](./config-detail.html#weappmodulepostcss)。

具体配置如下

```javascript
// 小程序端样式引用本地资源内联
url: {
  enable: true,
  config: {
    limit: 10240 // 设定转换尺寸上限
  }
}
```
