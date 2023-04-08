import { EMPTY_OBJ, isWebPlatform } from '@tarojs/shared'

import type { TaroDocument } from './dom/document'

interface Env {
  window
  document: TaroDocument
}

const isWeb = isWebPlatform()
const env: Env = {
  window: isWeb ? window : EMPTY_OBJ,
  document: isWeb ? document : EMPTY_OBJ
}

export default env
