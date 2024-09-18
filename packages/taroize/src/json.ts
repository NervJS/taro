import { buildTemplate } from './utils'

import type * as t from '@babel/types'

export function parseJSON (json?: string) {
  if (!json) {
    return
  }
  return buildTemplate(`(${json})`) as t.ObjectExpression
}
