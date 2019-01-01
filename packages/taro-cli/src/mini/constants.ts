import * as os from 'os'

export const taroJsFramework = '@tarojs/taro'
export const taroJsComponents = '@tarojs/components'
export const taroJsRedux = '@tarojs/redux'

export const NODE_MODULES = 'node_modules'
export const NODE_MODULES_REG = /(.*)node_modules/

export enum PARSE_AST_TYPE {
  ENTRY = 'ENTRY',
  PAGE = 'PAGE',
  COMPONENT = 'COMPONENT',
  NORMAL = 'NORMAL'
}

export const DEVICE_RATIO_NAME = 'deviceRatio'
export const isWindows = os.platform() === 'win32'
