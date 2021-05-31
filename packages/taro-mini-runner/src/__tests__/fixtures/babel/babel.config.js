// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  plugins: ['@babel/plugin-proposal-do-expressions'],
  presets: [
    ['taro', {
      framework: 'react',
      ts: false,
      reactJsxRuntime: 'classic'
    }]
  ]
}
