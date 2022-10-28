export default {
  pages: [
    'pages/index/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  plugins: {
    myPlugin: {
      version: 'dev',
      provider: 'wxa9abf43f10a7bdb0',
      genericsImplementation: {
        list: {
          'mp-comp': 'component/comp'
        }
      },
      // 自动编译输出
      export: 'plugin-export'
    }
  }
}
