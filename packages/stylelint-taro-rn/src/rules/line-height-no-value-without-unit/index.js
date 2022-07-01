import { utils } from 'stylelint'

import { namespace } from '../../utils'

const declarationValueIndex = require('stylelint/lib/utils/declarationValueIndex')

export const ruleName = namespace('line-height-no-value-without-unit')

export const messages = utils.ruleMessages(ruleName, {
  rejected: (height) =>
    `Unexpected line-height "${height}", expect a value with units`
})

const lengthRe = /^(0$|(?:[+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?)(?=px|PX|rem$))/
const viewportUnitRe = /^([+-]?[0-9.]+)(vh|vw|vmin|vmax)$/

export default function (actual) {
  return function (root, result) {
    const validOptions = utils.validateOptions(result, ruleName, {
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

      utils.report({
        message: messages.rejected(decl.value),
        node: decl,
        result,
        ruleName,
        index
      })
    })
  }
}
