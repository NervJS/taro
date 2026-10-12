Page({
  onLoad() {
    console.log('原生入口页面加载')
  },

  onClick() {
    wx.navigateTo({
      url: '/pages/order/pages/index/index',
    })
  },
})
