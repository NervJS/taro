export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/detail/index'
  ],
  components: [
    'pages/detail/index',
    'components/picker/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
