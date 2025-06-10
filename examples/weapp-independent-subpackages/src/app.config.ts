export default {
  pages: [
    'pages/index/index'
  ],
  subPackages: [
    {
      root: 'pages/sub',
      pages: ['sub-one/index'],
      independent: true,
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
