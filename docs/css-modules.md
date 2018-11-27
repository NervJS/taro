---
title: CSS Modules 的使用
---

> 1.2.0-beta.3 版本开始支持，RN 端尚未支持

Taro 中内置了 [CSS Modules](https://github.com/css-modules/css-modules) 的支持，但默认是关闭的，如果需要开启使用，请先在[编译配置](./config-detail.md)中添加如下配置。

小程序端开启

```js
weapp: {
  module: {
    postcss: {
      // css modules 功能开关与相关配置
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}
```

H5 端开启

```js
h5: {
  module: {
    postcss: {
      // css modules 功能开关与相关配置
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}
```

在开启之后，你就可以在 Taro 中使用 CSS Modules 功能了，例如

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

import styles from './Test.scss'

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
