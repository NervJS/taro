# `babel-preset-taro`

给 Taro 项目使用的 babel preset。

## Usege

```javascript
// babel.config.js
module.exports = {
  presets: [
    // 已经填上的参数是默认值
    ['taro', {
      // 框架：`nerv`, `react`, `vue` 三选一
      framework: 'react',
      // 是否使用 TypeScript，当值为 true 时，使用 `@babel/preset-typescript` 编译
      ts: true,
      // 以下参数为 @babel/preset-env 的参数：
      // https://babeljs.io/docs/en/babel-preset-env
      loose: false,
      useBuiltIns: false,
      targets: {
        ios: '9',
        android: '5'
      }
    }]
  ]
}
```
