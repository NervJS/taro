export interface TabItemConfig {
  showRedDot?: boolean,
  tabBarBadge?: string | number,
  tabBarLabel?: string,
  iconPath?: string,
  selectedIconPath?: string,
}

// 设置全局的tabbar config 中的内容定义
export interface TaroTabBarConfig {
  needAnimate: boolean,
  tabBarVisible: boolean,
  tabStyle: {
    backgroundColor?: string,
    borderStyle?: string,
    color?: string,
    selectedColor?: string
  },
  tabItems: Record<number, TabItemConfig>,
}

export interface CallbackResult {
  errMsg: string
  eventChannel?: any
}

export interface BaseOption {
  success?: (res: CallbackResult) => void
  fail?: (res: CallbackResult) => void
  complete?: (res: CallbackResult) => void
}

export type OptionsFunc = (res: CallbackResult) => void
