import { EMPTY_OBJ } from '@tarojs/shared'

import type { TaroDocument } from './dom/document'

interface Env {
  window
  document: TaroDocument
}

const env: Env = {
  window: process.env.TARO_PLATFORM === 'web' ? window : EMPTY_OBJ,
  document: process.env.TARO_PLATFORM === 'web' ? document : EMPTY_OBJ
}

export default env
