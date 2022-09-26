// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'vue3',
      ts: true
    }]
  ],
  plugins: [
    [
      "import",
      {
        "libraryName": "@nutui/nutui-taro",
        "libraryDirectory": "dist/packages/_es",
        // customName自定义兼容国际化使用
        "customName": (name, file) => {
          if (name == 'Locale') {
            return '@nutui/nutui-taro/dist/packages/locale/lang';
          } else {
            return `@nutui/nutui-taro/dist/packages/_es/${name}`;
          }
        },
        "style": (name, file) => name.toLowerCase().replace('_es/', '') + '/index.scss',
        "camel2DashComponentName": false
      },
      'nutui3-taro'
    ]
  ]
}
