import * as t from '@babel/types'
import { decode } from 'html-entities'

import { getCreateTemplate, transformNode } from './transform'
import { filterChildren, trimWhitespace } from './utils'

export default function transformFragmentChildren(children, results, config) {
  const filteredChildren = filterChildren(children)
  const childNodes = filteredChildren.reduce((memo, path) => {
    if (t.isJSXText(path.node)) {
      const v = decode(trimWhitespace(path.node.extra.raw))
      if (v.length) memo.push(t.stringLiteral(v))
    } else {
      const child = transformNode(path, { topLevel: true, fragmentChild: true, lastElement: true })
      memo.push(getCreateTemplate(config, path, child)(path, child, true))
    }
    return memo
  }, [])
  results.exprs.push(childNodes.length === 1 ? childNodes[0] : t.arrayExpression(childNodes))
}
