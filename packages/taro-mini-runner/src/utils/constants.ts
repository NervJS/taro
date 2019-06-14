import * as os from 'os'

export const CSS_EXT: string[] = ['.css', '.scss', '.sass', '.less', '.styl', '.wxss', '.acss']
export const SCSS_EXT: string[] = ['.scss']
export const JS_EXT: string[] = ['.js', '.jsx']
export const TS_EXT: string[] = ['.ts', '.tsx']

export const REG_SCRIPT: RegExp = /\.(js|jsx)(\?.*)?$/
export const REG_TYPESCRIPT: RegExp = /\.(tsx|ts)(\?.*)?$/
export const REG_SCRIPTS: RegExp = /\.[tj]sx?$/i

export const NODE_MODULES = 'node_modules'
export const NODE_MODULES_REG = /(.*)node_modules/

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

export const enum TEMPLATE_TYPES {
  WEAPP = '.wxml',
  SWAN = '.swan',
  ALIPAY = '.axml',
  TT = '.ttml',
  QUICKAPP = '.ux',
  QQ = '.qml'
}

export const enum STYLE_TYPES {
  WEAPP = '.wxss',
  SWAN = '.css',
  ALIPAY = '.acss',
  TT = '.ttss',
  QUICKAPP = '.css',
  QQ = '.qss'
}

export const enum SCRIPT_TYPES {
  WEAPP = '.js',
  SWAN = '.js',
  ALIPAY = '.js',
  TT = '.js',
  QUICKAPP = '.js',
  QQ = '.js'
}

export const enum CONFIG_TYPES {
  WEAPP = '.json',
  SWAN = '.json',
  ALIPAY = '.json',
  TT = '.json',
  QUICKAPP = '.json',
  QQ = '.json'
}

export type IMINI_APP_FILE_TYPE = {
  TEMPL: TEMPLATE_TYPES,
  STYLE: STYLE_TYPES,
  SCRIPT: SCRIPT_TYPES,
  CONFIG: CONFIG_TYPES
}

export type IMINI_APP_FILES = {
  [key: string]: IMINI_APP_FILE_TYPE
}
export const MINI_APP_FILES: IMINI_APP_FILES = {
  [BUILD_TYPES.WEAPP]: {
    TEMPL: TEMPLATE_TYPES.WEAPP,
    STYLE: STYLE_TYPES.WEAPP,
    SCRIPT: SCRIPT_TYPES.WEAPP,
    CONFIG: CONFIG_TYPES.WEAPP
  },
  [BUILD_TYPES.SWAN]: {
    TEMPL: TEMPLATE_TYPES.SWAN,
    STYLE: STYLE_TYPES.SWAN,
    SCRIPT: SCRIPT_TYPES.SWAN,
    CONFIG: CONFIG_TYPES.SWAN
  },
  [BUILD_TYPES.ALIPAY]: {
    TEMPL: TEMPLATE_TYPES.ALIPAY,
    STYLE: STYLE_TYPES.ALIPAY,
    SCRIPT: SCRIPT_TYPES.ALIPAY,
    CONFIG: CONFIG_TYPES.ALIPAY
  },
  [BUILD_TYPES.TT]: {
    TEMPL: TEMPLATE_TYPES.TT,
    STYLE: STYLE_TYPES.TT,
    SCRIPT: SCRIPT_TYPES.TT,
    CONFIG: CONFIG_TYPES.TT
  },
  [BUILD_TYPES.QUICKAPP]: {
    TEMPL: TEMPLATE_TYPES.QUICKAPP,
    STYLE: STYLE_TYPES.QUICKAPP,
    SCRIPT: SCRIPT_TYPES.QUICKAPP,
    CONFIG: CONFIG_TYPES.QUICKAPP
  },
  [BUILD_TYPES.QQ]: {
    TEMPL: TEMPLATE_TYPES.QQ,
    STYLE: STYLE_TYPES.QQ,
    SCRIPT: SCRIPT_TYPES.QQ,
    CONFIG: CONFIG_TYPES.QQ
  }
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


export const taroJsComponents = '@tarojs/components'
export const taroJsQuickAppComponents = '@tarojs/components-qa'
export const taroJsFramework = '@tarojs/taro'
export const taroJsRedux = '@tarojs/redux'

export const DEVICE_RATIO_NAME = 'deviceRatio'
export const isWindows = os.platform() === 'win32'

export const QUICKAPP_SPECIAL_COMPONENTS = new Set<string>([
  'View',
  'Text'
])

export enum PARSE_AST_TYPE {
  ENTRY = 'ENTRY',
  PAGE = 'PAGE',
  COMPONENT = 'COMPONENT',
  NORMAL = 'NORMAL'
}
