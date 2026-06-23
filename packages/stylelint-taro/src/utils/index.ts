import stylelint from 'stylelint'

import type { Problem } from 'stylelint'

export function taroDocsUrl(_: string) {
  return `https://taro-docs.jd.com/docs/`
}

export function nameSpace(ruleName: string) {
  // 前缀视个人情况而定
  return `taro/${ruleName}`
}
export function newMessage(ruleName: string, options) {
  return stylelint.utils.ruleMessages(ruleName, options)
}

export function report(problem: Problem) {
  return stylelint.utils.report(problem)
}

export function log(text: string) {
  // vscode下不添加颜色
  if (!process.env.TARO_ENV) {
    return text
  }
  return text
  // return highlightQuotaValue(text)
}

export function findIntersection(data) {
  const keys = Object.keys(data)
  let intersection = {}

  if (keys.length > 1) {
    const firstKey = keys[0]
    const firstProps = data[firstKey]

    for (const prop in firstProps) {
      const firstValues = firstProps[prop]
      let commonValues = firstValues || []

      for (let i = 1; i < keys.length; i++) {
        const currentKey = keys[i]
        const currentProps = data[currentKey]
        const currentValues = currentProps[prop]

        if (Array.isArray(commonValues)) {
          if (Array.isArray(currentValues)) {
            commonValues = commonValues.filter(value => currentValues.includes(value))
          } else if (currentValues) {
            commonValues = commonValues.filter(value => currentValues === true || currentValues.includes(value))
          }
        } else if (commonValues === true) {
          commonValues = currentValues || []
        } else {
          commonValues = []
        }
      }

      if (commonValues.length > 0) {
        intersection[prop] = commonValues
      }
    }
  } else {
    intersection = data[keys[0]]
  }

  return { intersection }
}
