export default {
  pages: [
    'pages/index/index',
    'pages/about/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    backgroundColor: '#fff',
    selectedColor: '#dc0032',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/view.png',
        selectedIconPath: 'assets/view_red.png'
      },
      {
        pagePath: 'pages/about/index',
        text: '关于',
        iconPath: 'assets/nav.png',
        selectedIconPath: 'assets/nav_red.png'
      }
    ]
  }
}
