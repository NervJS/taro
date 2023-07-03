export default defineAppConfig({
  pages: [
    'pages/index/index',
  ].map(item => item),
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
