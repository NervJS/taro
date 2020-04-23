import * as css from 'css'
import rewriteRule from './style'

interface StyleLog {
  line: number;
  column: number;
  reason: string;
}

export default function rewriter (code, isProduction?) {
  const logs: StyleLog[] = []
  const ast = css.parse(code, {
    silent: true
  })
  // catch syntax error
  if (ast.stylesheet.parsingErrors && ast.stylesheet.parsingErrors.length) {
    ast.stylesheet.parsingErrors.forEach(function (error) {
      logs.push({
        line: error.line,
        column: error.column,
        reason: error.toString()
      })
    })
  }
  // 针对快应用样式进行转换
  if (ast && ast.type === 'stylesheet' && ast.stylesheet &&
        ast.stylesheet.rules && ast.stylesheet.rules.length) {
    const rules: any = []
    ast.stylesheet.rules.forEach(function (rule) {
      const type = rule.type
      if (type === 'rule') {
        const newRule = rewriteRule(rule, {
          logs: logs
        })
        if (newRule) {
          rules.push(newRule)
        }
      } else {
        rules.push(rule)
      }
    })
    ast.stylesheet.rules = rules
  }
  if (!ast) {
    return ''
  }
  // 输出转换结果
  try {
    const resContent = css.stringify(ast, {
      compress: !!isProduction
    })
    return resContent
  } catch (e) {
    return ''
  }
}
