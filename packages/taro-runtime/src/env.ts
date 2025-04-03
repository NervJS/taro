import { EMPTY_OBJ, isUndefined } from '@tarojs/shared'

import type { TaroDocument } from './dom/document'

interface Env {
  window
  document: TaroDocument
}

const env: Env = {
  window: process.env.TARO_PLATFORM === 'web' && !isUndefined(window) ? window : EMPTY_OBJ,
  document: process.env.TARO_PLATFORM === 'web' && !isUndefined(document) ? document : EMPTY_OBJ,
}

export default env
