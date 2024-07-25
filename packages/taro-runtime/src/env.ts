import { EMPTY_OBJ, PLATFORM_TYPE } from '@tarojs/shared'

import type { TaroDocument } from './dom/document'

interface Env {
  window
  document: TaroDocument
}

const env: Env = {
  window: process.env.TARO_PLATFORM === PLATFORM_TYPE.WEB ? window : EMPTY_OBJ,
  document: process.env.TARO_PLATFORM === PLATFORM_TYPE.WEB ? document : EMPTY_OBJ
}

export default env
