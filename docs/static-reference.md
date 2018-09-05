---
title: 静态资源引用
---

在 Taro 中可以像使用 [webpack](https://webpack.js.org/) 那样自由地引用静态资源，而且不需要安装任何loader。

## 引用样式文件

可以直接通过 ES6 的 `import` 语法来引用样式文件

例如引用 CSS 文件

```javascript
import './css/path/name.css'
```

引用 SCSS 文件

```javascript
import './css/path/name.scss'
```

## 引用JS文件

可以直接通过 ES6 的 `import` 语法来引用JS文件

```javascript
import { functionName } from './css/path/name.js'

import defaultExportName from './css/path/name.js'
```

## 引用图片、音频、字体等文件

可以直接通过 ES6 的 `import` 语法来引用此类文件，拿到文件引用后直接在 JSX 中进行使用

```javascript

// 引用文件
import namedPng from '../../images/path/named.png'

// 使用
<View>
  <Image src={namedPng} />
</View>
```

## 引用JSON文件

可以直接通过 ES6 的 `import` 语法来引用此类文件，拿到JSON文件输出的JSON数据

```javascript
// 引用json文件
/**
* named.json
* {
*   x: 1
* }
**/
import namedJson from '../../json/path/named.json'

console.log(namedJson.x)
```
