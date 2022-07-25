import { EMPTY_OBJ } from '@tarojs/shared'
import type * as React from 'react'

interface ReactMeta {
  PageContext: React.Context<string>
  R: typeof React
}

export const reactMeta: ReactMeta = {
  PageContext: EMPTY_OBJ,
  R: EMPTY_OBJ
}
