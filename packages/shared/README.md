# `@tarojs/shared`

Taro 内部使用的 utils。包含了常用的类型判断、错误断言、组件类型/声明/参数等。`@tarojs/shared` 会跨 node/浏览器/小程序/React Native 使用，不得使用平台特有特性。

引入此包的必须采用 ES6 引用单个模块语法，且打包配置 external 不得包括此包。
