import stylelint from 'stylelint'
import declarationValueIndex from 'stylelint/lib/utils/declarationValueIndex.cjs'

import { namespace } from '../../utils/index.js'

export const ruleName = namespace('line-height-no-value-without-unit')

export const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (height) =>
    `Unexpected line-height "${height}", expect a value with units`
})

const lengthRe = /^(0$|(?:[+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?)(?=px|PX|rem$))/
const viewportUnitRe = /^([+-]?[0-9.]+)(vh|vw|vmin|vmax)$/

export default function (actual) {
  return function (root, result) {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual
    })

    if (!validOptions) {
      return
    }

    root.walkDecls(/^line-height$/i, (decl) => {
      if (lengthRe.test(decl.value) || viewportUnitRe.test(decl.value)) {
        return
      }

      const valueOffset = decl.value.indexOf(decl.value)
      const index = declarationValueIndex(decl) + valueOffset

      stylelint.utils.report({
        message: messages.rejected(decl.value),
        node: decl,
        result,
        ruleName,
        index
      })
    })
  }
}
