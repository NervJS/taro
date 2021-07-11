import * as css from 'css'
import * as cssWhat from 'css-what'

interface StyleLog {
  line: number;
  column: number;
  reason: string;
}

const textProperties = [
  'color', 'font-size', 'font-style', 'font-weight', 'font-family',
  'text-decoration', 'text-align', 'text-indent', 'line-height', 'text-overflow'
]

export default function rewriter(code, isProduction?) {
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
        const allDeclarations = rule.declarations.filter(declaration =>
          declaration.type === 'declaration');

        const textDeclarations = allDeclarations.filter(declaration =>
          textProperties.includes(declaration.property)
        );

        if (textDeclarations.length) {
          const parts: cssWhat.Selector[][] = rule.selectors.map(selector => cssWhat.parse(selector)[0])

          // 新增一个 `.class text` 选择器来继承css文本属性
          const newRule = { ...rule }
          newRule.selectors = parts.map(part => {
            part = part.slice()
            part.push({ type: 'descendant' }, { type: 'tag', name: 'text' })
            return cssWhat.stringify([part])
          })
          newRule.declarations = textDeclarations;

          rules.push(newRule)

          // 为了维持选择器优先级不变，在原选择器前面加上id
          rule.selectors = parts.map(part => {
            part = part.slice()
            return '#taro-page ' + cssWhat.stringify([part]) // 无语，没有id和class类型的
          })
        }

        // 处理display
        if (!allDeclarations.some(declaration => declaration.property === 'display')) {
          rule.declarations.push(
            { type: 'declaration', property: 'display', value: 'flex' },
            { type: 'declaration', property: 'flex-direction', value: 'column' }
          );

          if (allDeclarations.some(declaration => declaration.property === 'text-align' && declaration.value === 'center')) {
            rule.declarations.push({ type: 'declaration', property: 'align-items', value: 'center' });
          }
        }
      }

      rules.push(rule)
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
