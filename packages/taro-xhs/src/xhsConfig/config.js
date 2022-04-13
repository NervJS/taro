module.exports = {
  app: {
    entryPagePath: true,
    pages: true,
    window: {
      navigationBarBackgroundColor: true,
      navigationBarTextStyle: true,
      navigationBarTitleText: true,
      navigationStyle: true,
      default: true,
      custom: true,
      backgroundColor: true,
      enablePullDownRefresh: true,
      onReachBottomDistance: true
    },
    tabBar: {
      color: true,
      selectedColor: true,
      backgroundColor: true,
      borderStyle: true,
      list: true
    },
    networkTimeout: {
      request: true
    },
    permission: true,
    usingComponents: true
  },
  window: {
    navigationBarBackgroundColor: true,
    navigationBarTextStyle: true,
    navigationBarTitleText: true,
    navigationStyle: true,
    backgroundColor: true,
    enablePullDownRefresh: true,
    onReachBottomDistance: true,
    pageOrientation: true,
    disableScroll: true,
    usingComponents: true
  }
}
