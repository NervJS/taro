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
      // 需要配置 copy，复制 my-export.js 到 miniprogram/miniprogram
      export: 'my-export.js'
    }
  }
}
