Page({
  onLoad() {
    console.log('原生入口页面加载')
  },

  onOpenSub1() {
    wx.navigateTo({
      url: '/pages/order/pages/sub1/index',
    })
  },

  onOpenSub2() {
    wx.navigateTo({
      url: '/pages/order/pages/sub2/index',
    })
  },
})
