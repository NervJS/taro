import path from 'path'

console.log('process.env.TARO_ENV', path.resolve(__dirname, '../__mocks__/app.config.ts'))

export default {
  pages: [
    'pages/index/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
