Page({
  onLoad() {
    console.log('原生入口页面加载')
  },

  onClick() {
    wx.navigateTo({
      url: '/taro/pages/index/index',
    })
  },
})
