export default {
  pages: [
    'pages/index/index',
    'pages/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: "#000000",
    selectedColor: "#000000",
    backgroundColor: "#000000",
    list: [{
      pagePath: "pages/index/index",
      text: "首页",
      iconPath: 'assets/view.png',
      selectedIconPath: 'assets/view_red.png'
    }, {
      pagePath: "pages/detail/index",
      text: "详情页",
      iconPath: 'assets/nav.png',
      selectedIconPath: 'assets/nav_red.png'
    }]
  },
  usingComponents: {}
}
