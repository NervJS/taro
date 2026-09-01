Page({
  onLoad() {
    console.log('原生入口页面加载')
  },

  onClickPage() {
    wx.navigateTo({
      url: '/pages/shared-runtime/pages/index/index',
    })
  },

  onClickComp() {
    wx.navigateTo({
      url: '/pages/comp-host/index',
    })
  },
})
