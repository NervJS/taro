import { EMPTY_OBJ } from '@tarojs/shared'

import type { TaroDocument } from './dom/document'

interface Env {
  window
  document: TaroDocument
}

// `typeof` guards are required: H5 config loading evaluates this module in Node
// while `TARO_PLATFORM === 'web'`, and a bare `window`/`document` access throws.
// See https://github.com/NervJS/taro/issues/19031
const env: Env = {
  window: process.env.TARO_PLATFORM === 'web'
    ? (typeof window !== 'undefined' ? window : EMPTY_OBJ)
    : EMPTY_OBJ,
  document: process.env.TARO_PLATFORM === 'web'
    ? (typeof document !== 'undefined' ? document : EMPTY_OBJ)
    : EMPTY_OBJ
}

export default env
