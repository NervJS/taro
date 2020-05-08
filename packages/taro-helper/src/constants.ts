import * as os from 'os'
import * as chalk from 'chalk'

export const PLATFORMS = {}

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
  REFERENCE = 'reference',
  REMIND = 'remind'
}

export interface IProcessTypeMap {
  [key: string] : {
    name: string,
    color: string | chalk.Chalk
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
  },
  [processTypeEnum.REMIND]: {
    name: '提示',
    color: 'green'
  }
}

export const CSS_EXT: string[] = ['.css', '.scss', '.sass', '.less', '.styl', '.wxss', '.acss']
export const SCSS_EXT: string[] = ['.scss']
export const JS_EXT: string[] = ['.js', '.jsx']
export const TS_EXT: string[] = ['.ts', '.tsx']
export const UX_EXT: string[] = ['.ux']
export const SCRIPT_EXT: string[] = JS_EXT.concat(TS_EXT)
export const VUE_EXT: string[] = ['.vue']

export const REG_JS: RegExp = /\.js(\?.*)?$/
export const REG_SCRIPT: RegExp = /\.(js|jsx)(\?.*)?$/
export const REG_TYPESCRIPT: RegExp = /\.(tsx|ts)(\?.*)?$/
export const REG_SCRIPTS: RegExp = /\.[tj]sx?$/i
export const REG_VUE = /\.vue$/i
export const REG_SASS: RegExp = /\.(s[ac]ss)$/
export const REG_LESS: RegExp = /\.less$/
export const REG_STYLUS: RegExp = /\.styl$/
export const REG_STYLE: RegExp = /\.(css|scss|sass|less|styl|wxss|acss|ttss|jxss)(\?.*)?$/
export const REG_CSS = /\.(css|wxss|acss|ttss)(\?.*)?$/
export const REG_MEDIA: RegExp = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/
export const REG_IMAGE: RegExp = /\.(png|jpe?g|gif|bpm|svg|webp)(\?.*)?$/
export const REG_FONT: RegExp = /\.(woff2?|eot|ttf|otf)(\?.*)?$/
export const REG_JSON: RegExp = /\.json(\?.*)?$/
export const REG_UX: RegExp = /\.ux(\?.*)?$/
export const REG_TEMPLATE: RegExp = /\.(wxml|axml|ttml|qml|swan|jxml)(\?.*)?$/
export const REG_WXML_IMPORT: RegExp = /<import(.*)?src=(?:(?:'([^']*)')|(?:"([^"]*)"))/gi
export const REG_URL: RegExp = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
export const CSS_IMPORT_REG: RegExp = /@import (["'])(.+?)\1;/g

export const NODE_MODULES = 'node_modules'
export const NODE_MODULES_REG = /(.*)node_modules/

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
  '@tarojs/taro-qq',
  '@tarojs/taro-jd',
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
  'nerv-devtools',
  'stylelint-config-taro-rn',
  'stylelint-taro-rn'
]

export enum META_TYPE {
  ENTRY = 'ENTRY',
  PAGE = 'PAGE',
  COMPONENT = 'COMPONENT',
  NORMAL = 'NORMAL',
  STATIC = 'STATIC',
  CONFIG = 'CONFIG',
  EXPORTS = 'EXPORTS'
}

export const taroJsComponents = '@tarojs/components'
export const taroJsQuickAppComponents = '@tarojs/components-qa'
export const taroJsFramework = '@tarojs/taro'
export const taroJsRedux = '@tarojs/redux'
export const taroJsMobx = '@tarojs/mobx'
export const taroJsMobxCommon = '@tarojs/mobx-common'

export const DEVICE_RATIO_NAME = 'deviceRatio'
export const isWindows = os.platform() === 'win32'

export const DEFAULT_TEMPLATE_SRC = 'github:NervJS/taro-project-templates#v3'
export const TARO_CONFIG_FLODER = '.taro3'
export const TARO_BASE_CONFIG = 'index.json'

export const OUTPUT_DIR = 'dist'
export const SOURCE_DIR = 'src'
export const TEMP_DIR = '.temp'
export const NPM_DIR = 'npm'
export const ENTRY = 'app'

export enum FRAMEWORK_MAP {
  VUE = 'vue',
  REACT = 'react',
  NERV = 'nerv'
}
