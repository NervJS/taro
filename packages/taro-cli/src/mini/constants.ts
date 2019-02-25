import * as os from 'os'

export const taroJsFramework = '@tarojs/taro'
export const taroJsComponents = '@tarojs/components'
export const taroJsRedux = '@tarojs/redux'

export enum PARSE_AST_TYPE {
  ENTRY = 'ENTRY',
  PAGE = 'PAGE',
  COMPONENT = 'COMPONENT',
  NORMAL = 'NORMAL'
}

export const DEVICE_RATIO_NAME = 'deviceRatio'
export const isWindows = os.platform() === 'win32'
