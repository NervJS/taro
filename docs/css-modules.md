---
title: 使用 CSS Modules
---

> 1.2.0 版本开始支持，RN 端已兼容

Taro 中内置了 [CSS Modules](https://github.com/css-modules/css-modules) 的支持，但默认是关闭的，如果需要开启使用，请先在[编译配置](./config-detail.md)中添加如下配置。

小程序端开启

```js
mini: {
  postcss: {
    // css modules 功能开关与相关配置
    cssModules: {
      enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
      config: {
        namingPattern: 'module', // 转换模式，取值为 global/module，下文详细说明
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      }
    }
  }
}
```

H5 端开启

```js
h5: {
  postcss: {
    // css modules 功能开关与相关配置
    cssModules: {
      enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
      config: {
        namingPattern: 'module', // 转换模式，取值为 global/module，下文详细说明
        generateScopedName: '[name]__[local]___[hash:base64:5]'
      }
    }
  }
}
```

在开启之后，你就可以在 Taro 中使用 CSS Modules 功能了，值得注意的是，Taro 中使用 CSS Modules 有两种模式，分别为全局转换及部分自定义转换模式，通过 `namingPattern` 配置进行控制

`namingPattern` 配置取值分别如下：
- `global`，表示全局转换，所有样式文件都会经过 CSS Modules 转换处理，除了文件名中包含 `.global.` 的样式文件
- `module`，表示自定义转换，只有文件名中包含 `.module.` 的样式文件会经过 CSS Modules 转换处理

`generateScopedName` 支持传入字符串和函数：

- `字符串`，其格式见：[https://github.com/webpack/loader-utils#interpolatename](https://github.com/webpack/loader-utils#interpolatename)，值得指出的是，可使用 `[local]` 取其原类名
- `函数`，其类型定义为 `(localName: string, absoluteFilePath: string) => string`，其中 `localName` 为原类名，`absoluteFilePath` 为文件的绝对路径，返回值将作为新的类名

**推荐使用自定义转换模式，这样的话就不会影响到一些第三方库的样式了**

CSS Modules 使用方式如下

组件样式

```scss
.test {
  color: red;
  .txt {
    font-size: 36px;
  }
}
```

组件 JS 中使用样式

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import styles from './Test.module.scss'

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  render () {
    return (
      <View className={styles.test}>
        <Text className={styles.txt}>Hello world!</Text>
      </View>
    )
  }
}
```
