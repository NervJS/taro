---
title: Use CSS Modules
---

> Supported since version 1.2.0, React Native is compatible

There is built-in support for [CSS Modules](https://github.com/css-modules/css-modules) in Taro, but it is turned off by default, so if you need to turn it on, please add the following configuration to [compile-config](./config-detail.md).

 Open on the mini program :

```js title="config/index.js"
weapp: {
  module: {
    postcss: {
      // css modules  function switches and related configurations
      cssModules: {
        enable: true, // Default is false, if you want to use the css modules function, set it to true
        config: {
          namingPattern: 'module', // The conversion mode, which takes the value global/module, is explained in detail below
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}
```

 Open on the H5:

```js title="config/index.js"
h5: {
  module: {
    postcss: {
      // css modules: function switches and related configurations
      cssModules: {
        enable: true, // Default is false, if you want to use the css modules function, set it to true
        config: {
          namingPattern: 'module', // The conversion mode, which takes the value global/module, is explained in detail below
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}
```

It is worth noting that there are two modes of using CSS Modules in Taro, namely global conversion and partial custom conversion, which are controlled by the `namingPattern` configuration

The `namingPattern` configuration takes the following values.
- `global`, which means that all style files will be converted by CSS Modules, except for those with `.global.` in the file name
- `module`, which means custom conversion, only style files with `.module.` in their filenames will be converted by CSS Modules


`generateScopedName` supports passing in strings and functions.

- `String` in the format of [https://github.com/webpack/loader-utils#interpolatename](https://github.com/webpack/loader-utils#interpolatename), it is worth It is worth pointing out that `[local]` can be used to take its original class name
- `function`, whose type is defined as `(localName: string, absoluteFilePath: string) => string`, where `localName` is the original class name and `absoluteFilePath` is the absolute path to the file, and the return value will be the new class name

**It is recommended to use custom conversion mode, so that the style of some third-party libraries will not be affected**

CSS Modules are used in the following ways

Component Style

```scss
.test {
  color: red;
  .txt {
    font-size: 36px;
  }
}
```

Using Styles in Component JS

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

## Related Reading

[Open Source Plugin weapp-css-modules - The ultimate pursuit to reduce the code package of the  mini program by 10%](https://taro-club.jd.com/topic/2264/%E6%9E%81%E8%87%B4%E8%BF%BD%E6%B1%82-%E8%AE%A9%E5%B0%8F%E7%A8%8B%E5%BA%8F%E4%BB%A3%E7%A0%81%E5%8C%85%E7%AB%8B%E5%87%8F-10-%E7%9A%84%E6%8F%92%E4%BB%B6-weapp-css-modules)