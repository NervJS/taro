import * as t from '@babel/types'

import { buildTemplate } from './utils'

export function parseJSON (json?: string) {
  if (!json) {
    return
  }
  return buildTemplate(`(${json})`) as t.ObjectExpression
}
