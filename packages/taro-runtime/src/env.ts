import { EMPTY_OBJ } from '@tarojs/shared'

import type { TaroDocument } from './dom/document'

interface Env {
  window
  document: TaroDocument
}

const env: Env = {
  window: process.env.TARO_ENV === 'h5' ? window : EMPTY_OBJ,
  document: process.env.TARO_ENV === 'h5' ? document : EMPTY_OBJ
}

export default env
