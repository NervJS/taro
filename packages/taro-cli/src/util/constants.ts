import * as os from 'os'
import chalk, { Chalk } from 'chalk'

export const enum processTypeEnum {
  START = 'start',
  CREATE = 'create',
  COMPILE = 'compile',
  CONVERT = 'convert',
  COPY = 'copy',
  GENERATE = 'generate',
  MODIFY = 'modify',
  ERROR = 'error',
  WARNING = 'warning',
  UNLINK = 'unlink',
  REFERENCE = 'reference'
}

export interface IProcessTypeMap {
  [key: string] : {
    name: string,
    color: string | Chalk
  }
}

export const processTypeMap: IProcessTypeMap = {
  [processTypeEnum.CREATE]: {
    name: '创建',
    color: 'cyan'
  },
  [processTypeEnum.COMPILE]: {
    name: '编译',
    color: 'green'
  },
  [processTypeEnum.CONVERT]: {
    name: '转换',
    color: chalk.rgb(255, 136, 0)
  },
  [processTypeEnum.COPY]: {
    name: '拷贝',
    color: 'magenta'
  },
  [processTypeEnum.GENERATE]: {
    name: '生成',
    color: 'blue'
  },
  [processTypeEnum.MODIFY]: {
    name: '修改',
    color: 'yellow'
  },
  [processTypeEnum.ERROR]: {
    name: '错误',
    color: 'red'
  },
  [processTypeEnum.WARNING]: {
    name: '警告',
    color: 'yellowBright'
  },
  [processTypeEnum.UNLINK]: {
    name: '删除',
    color: 'magenta'
  },
  [processTypeEnum.START]: {
    name: '启动',
    color: 'green'
  },
  [processTypeEnum.REFERENCE]: {
    name: '引用',
    color: 'blue'
  }
}

export const CSS_EXT: string[] = ['.css', '.scss', '.sass', '.less', '.styl', '.wxss', '.acss']
export const SCSS_EXT: string[] = ['.scss']
export const JS_EXT: string[] = ['.js', '.jsx']
export const TS_EXT: string[] = ['.ts', '.tsx']

export const REG_JS: RegExp = /\.js(\?.*)?$/
export const REG_SCRIPT: RegExp = /\.(js|jsx)(\?.*)?$/
export const REG_TYPESCRIPT: RegExp = /\.(tsx|ts)(\?.*)?$/
export const REG_SCRIPTS: RegExp = /\.[tj]sx?$/i
export const REG_STYLE: RegExp = /\.(css|scss|sass|less|styl|wxss)(\?.*)?$/
export const REG_MEDIA: RegExp = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/
export const REG_IMAGE: RegExp = /\.(png|jpe?g|gif|bpm|svg|webp)(\?.*)?$/
export const REG_FONT: RegExp = /\.(woff2?|eot|ttf|otf)(\?.*)?$/
export const REG_JSON: RegExp = /\.json(\?.*)?$/
export const REG_WXML_IMPORT: RegExp = /<import(.*)?src=(?:(?:'([^']*)')|(?:"([^"]*)"))/gi
export const REG_URL: RegExp = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
export const CSS_IMPORT_REG: RegExp = /@import (["'])(.+?)\1;/g

export const NODE_MODULES = 'node_modules'
export const NODE_MODULES_REG = /(.*)node_modules/

export const enum BUILD_TYPES {
  WEAPP = 'weapp',
  H5 ='h5',
  RN ='rn',
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
    list: 'list',
    text: 'text',
    iconPath: 'iconPath',
    selectedIconPath: 'selectedIconPath',
    backgroundTextStyle: false,
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

export const PROJECT_CONFIG = 'config/index.js'

export const DEVICE_RATIO = {
  '640': 2.34 / 2,
  '750': 1,
  '828': 1.81 / 2
}

export const FILE_PROCESSOR_MAP = {
  '.js': 'babel',
  '.scss': 'sass',
  '.sass': 'sass',
  '.less': 'less',
  '.styl': 'stylus'
}

export const UPDATE_PACKAGE_LIST = [
  '@tarojs/taro',
  '@tarojs/async-await',
  '@tarojs/cli',
  '@tarojs/components',
  '@tarojs/components-rn',
  '@tarojs/components-qa',
  '@tarojs/taro-h5',
  '@tarojs/taro-tt',
  '@tarojs/taro-quickapp',
  '@tarojs/taro-swan',
  '@tarojs/taro-alipay',
  '@tarojs/plugin-babel',
  '@tarojs/plugin-csso',
  '@tarojs/plugin-sass',
  '@tarojs/plugin-less',
  '@tarojs/plugin-stylus',
  '@tarojs/plugin-uglifyjs',
  '@tarojs/redux',
  '@tarojs/redux-h5',
  '@tarojs/taro-redux-rn',
  '@tarojs/taro-router-rn',
  '@tarojs/taro-rn',
  '@tarojs/rn-runner',
  '@tarojs/router',
  '@tarojs/taro-weapp',
  '@tarojs/webpack-runner',
  'postcss-plugin-constparse',
  'eslint-config-taro',
  'eslint-plugin-taro',
  'taro-transformer-wx',
  'postcss-pxtransform',
  'babel-plugin-transform-jsx-to-stylesheet',
  '@tarojs/mobx',
  '@tarojs/mobx-h5',
  '@tarojs/mobx-rn',
  '@tarojs/mobx-common',
  'nervjs',
  'nerv-devtools'
]

export enum PARSE_AST_TYPE {
  ENTRY = 'ENTRY',
  PAGE = 'PAGE',
  COMPONENT = 'COMPONENT',
  NORMAL = 'NORMAL'
}

export const taroJsComponents = '@tarojs/components'
export const taroJsQuickAppComponents = '@tarojs/components-qa'
export const taroJsFramework = '@tarojs/taro'
export const taroJsRedux = '@tarojs/redux'

export const DEVICE_RATIO_NAME = 'deviceRatio'
export const isWindows = os.platform() === 'win32'
