import stylelint from 'stylelint'
import declarationValueIndex from 'stylelint/lib/utils/declarationValueIndex.cjs'
import matchesStringOrRegExp from 'stylelint/lib/utils/matchesStringOrRegExp.cjs'
import optionsMatches from 'stylelint/lib/utils/optionsMatches.cjs'
import validateObjectWithArrayProps from 'stylelint/lib/utils/validateObjectWithArrayProps.cjs'
import validateOptions from 'stylelint/lib/utils/validateOptions.cjs'
import { isBoolean, isRegExp, isString } from 'stylelint/lib/utils/validateTypes.cjs'
import vendor from 'stylelint/lib/utils/vendor.cjs'

import { findIntersection, log, nameSpace, report, taroDocsUrl } from '../../utils/index.ts'

import type { Rule } from 'stylelint'

export const ruleName = nameSpace('declaration-property-value-allowed-list')

export const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (property, value, platfrom) => log(`"${property}" 暂不支持值 "${value}"，受限端: "${platfrom}"`)
})

const meta = {
  // TODO： 使用Taro文档的规则
  url: taroDocsUrl('declaration-property-value-allowed-list'),
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

    const { intersection } = findIntersection(primary)

    Object.keys(intersection).forEach(key => {
      if (intersection[key] === true) {
        delete intersection[key]
      }
    })
    const propKeys = Object.keys(intersection)

    // 在这里可以添加额外的逻辑
    root.walkDecls(decl => {
      const { prop, value } = decl

      const unprefixedProp = vendor.unprefixed(prop)
      const propPatterns = propKeys.filter((key) => matchesStringOrRegExp(unprefixedProp, key))

      if (propPatterns.length === 0) {
        return
      }

      if (propPatterns.some((pattern) => optionsMatches(intersection, pattern, value))) {
        return
      }

      const platforms: string[] = []
      Object.keys(primary).forEach((platform) => {
        if (primary[platform]) {
          if (propPatterns.some((pattern) => {
            return optionsMatches(primary[platform], pattern, value) || primary[platform][pattern] === true
          })) {
            return
          }
          platforms.push(platform)
        }
      })

      const index = declarationValueIndex(decl)
      const endIndex = index + decl.value.length

      report({
        message: messages.rejected(prop, value, platforms.join(', ')),
        node: decl,
        index,
        endIndex,
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
