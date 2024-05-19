import stylelint from 'stylelint'

import { log, nameSpace, report, taroDocsUrl } from '../../utils/index.ts'

import type { Rule } from 'stylelint'

export const ruleName = nameSpace('no-nested-selectors')

export const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (selector, platfrom) => log(`"${selector}" 仅能使用单个class选择器，受限端 "${platfrom}"`)
})

const meta = {
  // TODO： 使用Taro文档的规则
  url: taroDocsUrl('no-nested-selectors'),
}

const rule: Rule = (primary) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primary
    })
    if (!validOptions) {
      return
    }
    const platform = ['harmony', 'rn']

    root.walkRules(ruleNode => {
      const selector = ruleNode.selector
      if (!/^[.#]?[a-zA-Z0-9_-]+$/.test(selector)) {
        report({
          ruleName,
          result,
          node: ruleNode,
          message: messages.rejected(selector, platform.join(', ')),
        })
      }
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta

export default rule
