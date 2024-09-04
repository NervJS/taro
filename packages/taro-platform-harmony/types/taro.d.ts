import Taro from '@tarojs/taro'

declare module '@tarojs/taro' {
  interface TaroStatic {
    pxTransformHelper(size: number, unit?: string, isNumber?: boolean): number | string
  }
}
