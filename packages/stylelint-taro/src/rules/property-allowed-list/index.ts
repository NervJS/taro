import _ from 'lodash'
import stylelint from 'stylelint'
import isCustomProperty from 'stylelint/lib/utils/isCustomProperty.mjs'
import isStandardSyntaxProperty from 'stylelint/lib/utils/isStandardSyntaxProperty.mjs'
import matchesStringOrRegExp from 'stylelint/lib/utils/matchesStringOrRegExp.mjs'
import validateObjectWithArrayProps from 'stylelint/lib/utils/validateObjectWithArrayProps.mjs'
import validateOptions from 'stylelint/lib/utils/validateOptions.mjs'
import { isBoolean, isRegExp, isString } from 'stylelint/lib/utils/validateTypes.mjs'
import vendor from 'stylelint/lib/utils/vendor.mjs'

import { log, nameSpace, report, taroDocsUrl } from '../../utils/index.ts'

import type { Rule } from 'stylelint'

export const ruleName = nameSpace('property-allowed-list')

export const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (property, platfrom) => log(`"${property}" 暂不支持该属性，受限端 "${platfrom}"`)
})

const meta = {
  // TODO： 使用Taro文档的规则
  url: taroDocsUrl('property-allowed-list'),
}

const rule: Rule = (primary) => {
  return (root, result) => {
    const validOptions = Object.keys(primary).every((key) => {
      if (primary[key]) {
        return validateOptions(result, ruleName, {
          actual: primary[key],
          possible: [validateObjectWithArrayProps(isString, isRegExp, isBoolean)],
        })
      }
      return true
    })

    if (!validOptions) {
      return
    }

    const _arr: string[] = []
    Object.keys(primary).forEach(key => {
      _arr.push(...Object.keys(primary[key]))
    })
    const intersectionKeys = _.intersection(_arr)

    // 在这里可以添加额外的逻辑
    root.walkDecls(decl => {
      const prop = decl.prop

      if (!isStandardSyntaxProperty(prop)) {
        return
      }

      if (isCustomProperty(prop)) {
        return
      }

      // either the prefix or unprefixed version is in the list
      if (matchesStringOrRegExp([prop, vendor.unprefixed(prop)], intersectionKeys)) {
        return
      }

      const platform: string[] = []
      Object.keys(primary).forEach(key => {
        if (primary[key]) {
          const platformKeys = Object.keys(primary[key])
          if (platformKeys.length > 0) {
            if (!platformKeys.includes(prop)) {
              platform.push(key)
            }
          }
        }
      })

      report({
        message: messages.rejected(prop, platform.join(', ')),
        word: prop,
        node: decl,
        result,
        ruleName,
      })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
rule.meta = meta

export default rule
