export const HEADER_CONFIG_MAP = {
  navigationBarTitleText: 'title', // 导航栏标题文字内容
  navigationBarTextStyle: 'headerTintColor', // 导航栏标题颜色，仅支持 black/white
  navigationBarBackgroundColor: 'backgroundColor', // 导航栏背景颜色
  enablePullDownRefresh: 'enablePullDownRefresh' // 是否全局开启下拉刷新，暂时放这里吧
}

export function getNavigationOptions (config) {
  let navigationOptions = {}
  Object.keys(config).forEach(function (key) {
    if (key in HEADER_CONFIG_MAP) {
      navigationOptions[HEADER_CONFIG_MAP[key]] = config[key]
    }
  })
  return navigationOptions
}
