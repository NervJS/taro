# `babel-preset-taro`

给 Taro 项目使用的 babel preset。

## Usege

```javascript
// babel.config.js
module.exports = {
  presets: [
    // 已经填上的参数是默认值
    ['taro', {
      // 框架：`nerv`, `react`, `vue`, `vue3` 四选一
      framework: 'react',
      // 是否使用 TypeScript，当值为 true 时，使用 `@babel/preset-typescript` 编译
      ts: true,
      // 是否使用 `@vue/babel-preset-jsx` (当`framework`为`vue`时) 
      // 或 `@vue/babel-plugin-jsx` （当`framework`为`vue3`时）来支持`jsx`编译
      // 该参数配置方式同 `@vue/babel-preset-app`的`jsx`参数
      // https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/babel-preset-app/README.md#jsx
      vueJsx: true,
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
