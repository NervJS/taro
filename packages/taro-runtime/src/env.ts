import { EMPTY_OBJ } from '@tarojs/shared'

export const isBrowser = typeof document !== 'undefined' && !!document.scripts
export const doc: Document = isBrowser ? document : EMPTY_OBJ
export const win: Window = isBrowser ? window : EMPTY_OBJ
