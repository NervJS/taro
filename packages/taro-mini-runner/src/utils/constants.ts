import * as os from 'os'

import chalk, { Chalk } from 'chalk'

export const CSS_EXT: string[] = ['.css', '.scss', '.sass', '.less', '.styl', '.wxss', '.acss', '.ttss', '.qss', 'jxss']
export const SCSS_EXT: string[] = ['.scss']
export const JS_EXT: string[] = ['.js', '.jsx']
export const TS_EXT: string[] = ['.ts', '.tsx']
export const UX_EXT: string[] = ['.ux']

export const REG_JS: RegExp = /\.js(\?.*)?$/
export const REG_SCRIPT: RegExp = /\.(js|jsx)(\?.*)?$/
export const REG_TYPESCRIPT: RegExp = /\.(tsx|ts)(\?.*)?$/
export const REG_SCRIPTS: RegExp = /\.[tj]sx?$/i
export const REG_SASS: RegExp = /\.(s[ac]ss)$/
export const REG_LESS: RegExp = /\.less$/
export const REG_STYLUS: RegExp = /\.styl$/
export const REG_STYLE: RegExp = /\.(css|scss|sass|less|styl|wxss|acss|ttss|jxss|qss)(\?.*)?$/
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

export const taroJsComponents = '@tarojs/components'
export const taroJsQuickAppComponents = '@tarojs/components-qa'
export const taroJsFramework = '@tarojs/taro'
export const taroJsRedux = '@tarojs/redux'
export const taroJsMobx = '@tarojs/mobx'
export const taroJsMobxCommon = '@tarojs/mobx-common'

export const DEVICE_RATIO_NAME = 'deviceRatio'
export const isWindows = os.platform() === 'win32'

export const QUICKAPP_SPECIAL_COMPONENTS = new Set<string>([
  'View',
  'Text',
  'Block'
])

export enum PARSE_AST_TYPE {
  ENTRY = 'ENTRY',
  PAGE = 'PAGE',
  COMPONENT = 'COMPONENT',
  NORMAL = 'NORMAL',
  STATIC = 'STATIC',
  EXPORTS = 'EXPORTS'
}

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

export const excludeReplaceTaroFrameworkPkgs = new Set([taroJsRedux, taroJsMobx, taroJsMobxCommon])

export const GLOBAL_PROPS = '{Function: Function,Boolean: Boolean,Object: Object,Number: Number,Array: Array,Date: Date,String: String,Symbol: Symbol,Error: Error,TypeError: TypeError,Map: Map,Set: Set,WeakMap: WeakMap,WeakSet: WeakSet,ArrayBuffer: ArrayBuffer,Math: Math,Promise: Promise,RegExp: RegExp,DataView: DataView,isFinite: isFinite,parseInt: parseInt,parseFloat: parseFloat,Float32Array: Float32Array,Float64Array: Float64Array,Int8Array: Int8Array,Int16Array: Int16Array,Int32Array: Int32Array,Uint8Array: Uint8Array,Uint16Array: Uint16Array,Uint32Array: Uint32Array,Uint8ClampedArray: Uint8ClampedArray,setTimeout: setTimeout,clearTimeout: clearTimeout,setInterval: setInterval,clearInterval: clearInterval}'
