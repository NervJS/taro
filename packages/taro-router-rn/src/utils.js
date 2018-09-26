export const HEADER_CONFIG_MAP = {
  navigationBarTitleText: 'title', // 导航栏标题文字内容
  navigationBarTextStyle: 'headerTintColor', // 导航栏标题颜色，仅支持 black/white
  navigationBarBackgroundColor: 'backgroundColor', // 导航栏背景颜色
  enablePullDownRefresh: 'enablePullDownRefresh', // 是否全局开启下拉刷新，暂时放这里吧
  navigationStyle: 'navigationStyle' // 导航栏样式，仅支持以下值：default 默认样式 custom 自定义导航栏，只保留右上角胶囊按钮
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
