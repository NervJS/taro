import type { options } from '@tarojs/runtime'

import Taro from './index'

declare module './index' {
  interface TaroStatic {
    options: typeof options
  }
}
