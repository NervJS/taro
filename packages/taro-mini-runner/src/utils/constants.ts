export const CSS_EXT: string[] = ['.css', '.scss', '.sass', '.less', '.styl', '.wxss', '.acss']
export const SCSS_EXT: string[] = ['.scss']
export const JS_EXT: string[] = ['.js', '.jsx']
export const TS_EXT: string[] = ['.ts', '.tsx']

export const REG_SCRIPT: RegExp = /\.(js|jsx)(\?.*)?$/
export const REG_TYPESCRIPT: RegExp = /\.(tsx|ts)(\?.*)?$/
export const REG_SCRIPTS: RegExp = /\.[tj]sx?$/i

export const enum BUILD_TYPES {
  WEAPP = 'weapp',
  SWAN ='swan',
  ALIPAY ='alipay',
  TT ='tt',
  UI ='ui',
  PLUGIN = 'plugin',
  QUICKAPP = 'quickapp',
  QQ = 'qq'
}

export const CONFIG_MAP = {
  [BUILD_TYPES.WEAPP]: {
    navigationBarTitleText: 'navigationBarTitleText',
    navigationBarBackgroundColor: 'navigationBarBackgroundColor',
    enablePullDownRefresh: 'enablePullDownRefresh',
    list: 'list',
    text: 'text',
    iconPath: 'iconPath',
    selectedIconPath: 'selectedIconPath',
    color: 'color'
  },
  [BUILD_TYPES.SWAN]: {
    navigationBarTitleText: 'navigationBarTitleText',
    navigationBarBackgroundColor: 'navigationBarBackgroundColor',
    enablePullDownRefresh: 'enablePullDownRefresh',
    list: 'list',
    text: 'text',
    iconPath: 'iconPath',
    selectedIconPath: 'selectedIconPath',
    color: 'color'
  },
  [BUILD_TYPES.TT]: {
    navigationBarTitleText: 'navigationBarTitleText',
    navigationBarBackgroundColor: 'navigationBarBackgroundColor',
    enablePullDownRefresh: 'enablePullDownRefresh',
    list: 'list',
    text: 'text',
    iconPath: 'iconPath',
    selectedIconPath: 'selectedIconPath',
    color: 'color'
  },
  [BUILD_TYPES.ALIPAY]: {
    navigationBarTitleText: 'defaultTitle',
    navigationBarBackgroundColor: 'titleBarColor',
    enablePullDownRefresh: 'pullRefresh',
    list: 'items',
    text: 'name',
    iconPath: 'icon',
    selectedIconPath: 'activeIcon',
    color: 'textColor'
  },
  [BUILD_TYPES.QUICKAPP]: {
    navigationBarTitleText: 'titleBarText',
    navigationBarBackgroundColor: 'titleBarBackgroundColor',
    navigationBarTextStyle: 'titleBarTextColor',
    pageOrientation: 'orientation',
    backgroundTextStyle: false,
    list: false,
    text: false,
    iconPath: false,
    selectedIconPath: false,
    onReachBottomDistance: false,
    backgroundColorBottom: false,
    backgroundColorTop: false,
    navigationStyle: false
  },
  [BUILD_TYPES.QQ]: {
    navigationBarTitleText: 'navigationBarTitleText',
    navigationBarBackgroundColor: 'navigationBarBackgroundColor',
    enablePullDownRefresh: 'enablePullDownRefresh',
    list: 'list',
    text: 'text',
    iconPath: 'iconPath',
    selectedIconPath: 'selectedIconPath'
  }
}
