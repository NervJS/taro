---
title: Use CSS Modules
---

## Usage

Built-in Taro supports [CSS Modules](https://github.com/css-modules/css-modules) but is closed by default, if you need to enable it, first[compile configuration](./config-detail.md)add the following configuration.

### On Applet

```js title="config/index.js"
weapp: {
  module: {
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
}
```

### On H5 Ends

```js title="config/index.js"
h5: {
  module: {
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
}
```

### Set transformation mode

> Use custom transformation mode is recommended. This will not affect the style of some third-party libraries.

When enabled, you can use CSS Modules in Taro. Notably, there are two modes using CSS Modules in Taro that are**global conversion**and**partial customization**, controlled by `namingPattern` configuration

`namingPattern` config values below：
- `global`for global conversion, all style files will be processed through CSS Modules with the exception of file names containing `.global.`
- `module`indicates custom conversion, only filename contains `.module.` style files will be processed by CSS Modules

`GenerateScopedName` supports incoming strings and functions：

- `string`in format see：[https://github.com/webpack/loader-utils#interpolatename](https://github.com/webpack/loader-utils#interpolatename)It is worth noting that it can be used `[local]` to get its original class name
- `Function`is defined as `(localName: string, absoluteFilePath: string) => string`, where `localName` is original class,`absoluteFilePath` is the absolute path to the file. Return value will be the new class name

### Usage Example

CSS Modules used below：

```scss title="组件样式"
.test Jean-Marie
  color: red;
  .txt L-
    font-size: 36px;
  }
}
```

```jsx title="组件 JS 中使用样式"
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'

import styles from './Test.module.scss'

export default class Test extends Component {
  render () {
    return (
      <View className={styles.test}>
        <Text className={styles.txt}>Hello world!</Text>
      </View>
    )
  }
}
```

## Related Reads

[Open source plugin weapp-css-modules - very much pursued, less than 10% for applet package](https://taro-club.jd.com/topic/2264/%E6%9E%81%E8%87%B4%E8%BF%BD%E6%B1%82-%E8%AE%A9%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%BB%A3%E7%A0%81%E5%8C%85%E7%AB%8B%E5%87%8F-10-%E7%9A%84%E6%8F%92%E4%BB%B6-weapp-css-modules)
