import { EMPTY_OBJ } from '@tarojs/shared'

export const doc: Document = process.env.TARO_ENV === 'h5' ? document : EMPTY_OBJ
export const win: Window = process.env.TARO_ENV === 'h5' ? window : EMPTY_OBJ
