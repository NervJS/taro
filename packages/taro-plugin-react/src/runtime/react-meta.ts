import { EMPTY_OBJ } from '@tarojs/shared'
import { createContext } from 'solid-js'

import type React from 'react'
import type Solid from 'solid-js'

interface ReactMeta {
  PageContext: React.Context<string>
  R: typeof React
}

interface SolidMeta {
  PageContext: Solid.Context<string>
}

export const reactMeta: ReactMeta = {
  PageContext: EMPTY_OBJ,
  R: EMPTY_OBJ,
}

export const solidMeta: SolidMeta = {
  PageContext: createContext(''),
}
