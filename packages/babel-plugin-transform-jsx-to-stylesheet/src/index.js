const path = require('path')

const STYLE_SHEET_NAME = '_styleSheet'
const GET_STYLE_FUNC_NAME = '_getStyle'
const MERGE_STYLES_FUNC_NAME = '_mergeStyles'
const GET_CLS_NAME_FUNC_NAME = '_getClassName'
const NAME_SUFFIX = 'StyleSheet'
const cssSuffixs = ['.css', '.scss', '.sass', '.less', '.styl']
let styleNames = [] // css module 写法中 import 的 Identifier

module.exports = function ({types: t, template}) {
  const mergeStylesFunctionTemplate = template(`
function ${MERGE_STYLES_FUNC_NAME}() {
  var newTarget = {};

  for (var index = 0; index < arguments.length; index++) {
    var target = arguments[index];

    for (var key in target) {
      newTarget[key] = Object.assign(newTarget[key] || {}, target[key]);
    }
  }

  return newTarget;
}
  `)
  const getClassNameFunctionTemplate = template(`
function ${GET_CLS_NAME_FUNC_NAME}() {
  var className = [];
  var args = arguments[0];
  var type = Object.prototype.toString.call(args).slice(8, -1).toLowerCase();

  if (type === 'string') {
    args = args.trim();
    args && className.push(args);
  } else if (type === 'array') {
    args.forEach(function (cls) {
      cls = ${GET_CLS_NAME_FUNC_NAME}(cls).trim();
      cls && className.push(cls);
    });
  } else if (type === 'object') {
    for (var k in args) {
      k = k.trim();
      if (k && args.hasOwnProperty(k) && args[k]) {
        className.push(k);
      }
    }
  }

  return className.join(' ').trim();
}
  `)
  const getStyleFunctionTemplete = template(`
function ${GET_STYLE_FUNC_NAME}(classNameExpression) { 
  var className = ${GET_CLS_NAME_FUNC_NAME}(classNameExpression);
  var classNameArr = className.split(/\\s+/);

  var style = [];
  if (classNameArr.length === 1) {
    style.push(${STYLE_SHEET_NAME}[classNameArr[0].trim()]);
  } else {
      classNameArr.forEach(function(cls) {
      style.push(${STYLE_SHEET_NAME}[cls.trim()]);
    });
  }

  return style;
}
  `)

  const getClassNameFunctionAst = getClassNameFunctionTemplate()
  const mergeStylesFunctionAst = mergeStylesFunctionTemplate()
  const getStyleFunctionAst = getStyleFunctionTemplete()

  function getArrayExpression (value) {
    let expression
    let str

    if (!value || value.value === '') {
      // className
      // className=""
      return []
    } else if (value.type === 'JSXExpressionContainer' && value.expression && typeof value.expression.value !== 'string') {
      // className={{ container: true }}
      // className={['container wrapper', { scroll: false }]}
      return [t.callExpression(t.identifier(GET_STYLE_FUNC_NAME), [value.expression])]
    } else {
      // className="container"
      // className={'container'}
      str = (value.expression ? value.expression.value : value.value).trim()
    }

    return str === '' ? [] : str.split(/\s+/).map((className) => {
      return template(`${STYLE_SHEET_NAME}["${className}"]`)().expression
    })
  }

  function findLastImportIndex (body) {
    const bodyReverse = body.slice(0).reverse()
    let _index = 0

    bodyReverse.some((node, index) => {
      if (node.type === 'ImportDeclaration') {
        _index = body.length - index - 1
        return true
      }
      return false
    })

    return _index
  }

  return {
    visitor: {
      Program: {
        exit (astPath, {file}) {
          const node = astPath.node
          // const cssFileCount = file.get('cssFileCount')
          const injectGetStyle = file.get('injectGetStyle')
          const lastImportIndex = findLastImportIndex(node.body)
          let cssParamIdentifiers = file.get('cssParamIdentifiers')
          let callExpression

          if (cssParamIdentifiers) {
            // only one css file，由于样式文件合并，永远只有一个
            if (cssParamIdentifiers.length === 1) {
              callExpression = t.variableDeclaration('var', [t.variableDeclarator(t.identifier(STYLE_SHEET_NAME), cssParamIdentifiers[0])])
            } else if (cssParamIdentifiers.length > 1) {
              const objectAssignExpression = t.callExpression(t.identifier(MERGE_STYLES_FUNC_NAME), cssParamIdentifiers)
              callExpression = t.variableDeclaration('var', [t.variableDeclarator(t.identifier(STYLE_SHEET_NAME), objectAssignExpression)])
            }

            node.body.splice(lastImportIndex + 1, 0, callExpression)

            if (injectGetStyle) {
              node.body.splice(lastImportIndex + 2, 0, getClassNameFunctionAst)
              node.body.splice(lastImportIndex + 3, 0, getStyleFunctionAst)
            }
          }

          // 全部合并成一个，也就不需要 mergeStylesFunctionAst 了
          // if (cssFileCount > 1) {
          //   node.body.unshift(mergeStylesFunctionAst)
          // }

          // 将 css modules 的 styles 替换为 _styleSheet
          astPath.traverse({
            JSXOpeningElement (astPath) {
              astPath.traverse({
                JSXAttribute ({node}) {
                  if (node.name && node.name.name === 'style') {
                    astPath.traverse({
                      MemberExpression ({node}) {
                        if (node.object.type === 'Identifier' && styleNames.indexOf(node.object.name) > -1) {
                          node.object.name = STYLE_SHEET_NAME
                        }
                      }
                    })
                  }
                }
              })
            }
          })
          // 清除该 js 文件的 styleNames
          styleNames = []
        }
      },
      JSXOpeningElement ({container}, {file}) {
        const cssFileCount = file.get('cssFileCount') || 0
        if (cssFileCount < 1) {
          return
        }

        // Check if has "style"
        let hasStyleAttribute = false
        let styleAttribute
        let hasClassName = false
        let classNameAttribute

        const attributes = container.openingElement.attributes
        for (let i = 0; i < attributes.length; i++) {
          const name = attributes[i].name
          if (name) {
            if (!hasStyleAttribute) {
              hasStyleAttribute = name.name === 'style'
              styleAttribute = hasStyleAttribute && attributes[i]
            }

            if (!hasClassName) {
              hasClassName = name.name === 'className'
              classNameAttribute = hasClassName && attributes[i]
            }
          }
        }

        if (hasClassName) {
          // Remove origin className
          attributes.splice(attributes.indexOf(classNameAttribute), 1)

          if (
            classNameAttribute.value &&
            classNameAttribute.value.type === 'JSXExpressionContainer' &&
            typeof classNameAttribute.value.expression.value !== 'string' // not like className={'container'}
          ) {
            file.set('injectGetStyle', true)
          }

          const arrayExpression = getArrayExpression(classNameAttribute.value)

          if (arrayExpression.length === 0) {
            return
          }

          if (hasStyleAttribute && styleAttribute.value) {
            let expression = styleAttribute.value.expression
            let expressionType = expression.type

            // style={[styles.a, styles.b]} ArrayExpression
            if (expressionType === 'ArrayExpression') {
              expression.elements = arrayExpression.concat(expression.elements)
              // style={styles.a} MemberExpression
              // style={{ height: 100 }} ObjectExpression
              // style={{ ...custom }} ObjectExpression
              // style={custom} Identifier
              // style={getStyle()} CallExpression
              // style={this.props.useCustom ? custom : null} ConditionalExpression
              // style={custom || other} LogicalExpression
            } else {
              styleAttribute.value.expression = t.arrayExpression(arrayExpression.concat(expression))
            }
          } else {
            let expression = arrayExpression.length === 1 ? arrayExpression[0] : t.arrayExpression(arrayExpression)
            attributes.push(t.jSXAttribute(t.jSXIdentifier('style'), t.jSXExpressionContainer(expression)))
          }
        }
      },
      // 由于目前 js 引入的文件样式默认会全部合并，故进插入一个就好，其余的全部 remove
      ImportDeclaration (astPath, state) {
        const {file} = state
        const node = astPath.node
        const sourceValue = node.source.value
        const specifiers = node.specifiers
        const jsFilePath = state.opts.filePath // 传进来的文件的 filePath ,Babel6 file.opts.filaname 为unknown
        const extname = path.extname(sourceValue)
        const cssIndex = cssSuffixs.indexOf(extname)
        let cssFileCount = file.get('cssFileCount') || 0
        let cssParamIdentifiers = file.get('cssParamIdentifiers') || []

        if (cssIndex > -1) {
          // `import styles from './foo.css'` kind
          if (node.importKind === 'value' && specifiers.length > 0) {
            styleNames.push(specifiers[0].local.name)
          }
          // 第一个引入的样式文件
          if (cssFileCount === 0) {
            const cssFileBaseName = path.basename(jsFilePath, path.extname(jsFilePath))
            // 引入样式对应的变量名
            const styleSheetIdentifierValue = `${cssFileBaseName.replace(/[-.]/g, '_') + NAME_SUFFIX}`
            const styleSheetIdentifierPath = `./${cssFileBaseName}_styles`
            const styleSheetIdentifier = t.identifier(styleSheetIdentifierValue)

            node.specifiers = [t.importDefaultSpecifier(styleSheetIdentifier)]
            node.source = t.stringLiteral(styleSheetIdentifierPath)
            cssParamIdentifiers.push(styleSheetIdentifier)
          } else {
            astPath.remove()
          }
          cssFileCount++

          file.set('cssParamIdentifiers', cssParamIdentifiers)
          file.set('cssFileCount', cssFileCount)
        }
      }
    }
  }
}
