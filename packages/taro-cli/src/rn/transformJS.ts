import * as path from 'path'
import * as babel from 'babel-core'
import traverse, { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import * as _ from 'lodash'
import generate from 'babel-generator'
import wxTransformer from '@tarojs/transformer-wx'
import {
  isAliasPath,
  replaceAliasPath,
  resolveStylePath,
  resolveScriptPath,
  promoteRelativePath,
  isNpmPkg,
  generateEnvList,
  generateConstantsList,
  REG_STYLE,
  REG_TYPESCRIPT,
  REG_SCRIPTS
} from '@tarojs/helper'

import babylonConfig from '../config/babylon'
import { convertSourceStringToAstExpression as toAst, convertAstExpressionToVariable as toVar } from '../util/astConvert'

const template = require('babel-template')

const reactImportDefaultName = 'React'
let taroImportDefaultName // import default from @tarojs/taro
let componentClassName // get app.js class name
const providerComponentName = 'Provider'
const taroComponentsRNProviderName = 'TCRNProvider'
const setStoreFuncName = 'setStore'
const routerImportDefaultName = 'TaroRouter'
const DEVICE_RATIO = 'deviceRatio'

const taroApis = [
  'getEnv',
  'ENV_TYPE',
  'eventCenter',
  'Events',
  'internal_safe_get',
  'internal_dynamic_recursive'
]

const PACKAGES = {
  '@tarojs/taro': '@tarojs/taro',
  '@tarojs/taro-rn': '@tarojs/taro-rn',
  '@tarojs/taro-router-rn': '@tarojs/taro-router-rn',
  '@tarojs/redux': '@tarojs/redux',
  '@tarojs/components': '@tarojs/components',
  '@tarojs/components-rn': '@tarojs/components-rn',
  'react': 'react',
  'react-native': 'react-native',
  'react-redux-rn': '@tarojs/taro-redux-rn',
  '@tarojs/mobx': '@tarojs/mobx',
  '@tarojs/mobx-rn': '@tarojs/mobx-rn'
}

const additionalConstructorNode = toAst(`Taro._$app = this`)
const superNode = t.expressionStatement(
  t.callExpression(
    // @ts-ignore
    t.super(),
    [
      t.identifier('props'),
      t.identifier('context')
    ]
  )
)

function getInitPxTransformNode (projectConfig) {
  const pxTransformConfig = {designWidth: projectConfig.designWidth || 750}

  if (projectConfig.hasOwnProperty(DEVICE_RATIO)) {
    pxTransformConfig[DEVICE_RATIO] = projectConfig.deviceRatio
  }
  const initPxTransformNode = toAst(`Taro.initPxTransform(${JSON.stringify(pxTransformConfig)})`)
  return initPxTransformNode
}

function getClassPropertyVisitor ({filePath, pages, iconPaths, isEntryFile}) {
  return (astPath) => {
    const node = astPath.node
    const key = node.key
    const value = node.value
    if (key.name !== 'config' || !t.isObjectExpression(value)) return
    // 入口文件的 config ，与页面的分开处理
    if (isEntryFile) {
      // 读取 config 配置
      astPath.traverse({
        ObjectProperty (astPath) {
          const node = astPath.node
          const key = node.key
          const value = node.value
          // if (key.name !== 'pages' || !t.isArrayExpression(value)) return
          if (key.name === 'pages' && t.isArrayExpression(value)) {
            // 分包
            let root = ''
            const rootNode = astPath.parent.properties.find(v => {
              return v.key.name === 'root'
            })
            root = rootNode ? rootNode.value.value : ''

            value.elements.forEach(v => {
              if (t.isStringLiteral(v)) {
                const pagePath = `${root}/${v.value}`.replace(/\/{2,}/g, '/')
                pages.push(pagePath.replace(/^\//, ''))
              }
            })
            astPath.remove()
          }
          // window
          if (key.name === 'window' && t.isObjectExpression(value)) {
            return
          }
          if (key.name === 'tabBar' && t.isObjectExpression(value)) {
            astPath.traverse({
              ObjectProperty (astPath) {
                const node = astPath.node as any
                const value = node.value.value
                if (node.key.name === 'iconPath' ||
                  node.key.value === 'iconPath' ||
                  node.key.name === 'selectedIconPath' ||
                  node.key.value === 'selectedIconPath'
                ) {
                  if (typeof value !== 'string') return
                  const iconName = _.camelCase(value)
                  if (iconPaths.indexOf(value) === -1) {
                    iconPaths.push(value)
                  }
                  astPath.insertAfter(t.objectProperty(
                    t.identifier(node.key.name || node.key.value),
                    t.identifier(iconName)
                  ))
                  astPath.remove()
                }
              }
            })
          }
        }
      })
    }
    astPath.node.static = 'true'
  }
}

function getJSAst (code, filePath) {
  return wxTransformer({
    code,
    sourcePath: filePath,
    isNormal: true,
    isTyped: REG_TYPESCRIPT.test(filePath),
    adapter: 'rn'
  }).ast
}

/**
 * TS 编译器会把 class property 移到构造器，
 * 而小程序要求 `config` 和所有函数在初始化(after new Class)之后就收集到所有的函数和 config 信息，
 * 所以当如构造器里有 this.func = () => {...} 的形式，就给他转换成普通的 classProperty function
 * 如果有 config 就给他还原
 */
function resetTSClassProperty (body) {
  for (const method of body) {
    if (t.isClassMethod(method) && method.kind === 'constructor') {
      for (const statement of _.cloneDeep(method.body.body)) {
        if (t.isExpressionStatement(statement) && t.isAssignmentExpression(statement.expression)) {
          const expr = statement.expression
          const {left, right} = expr
          if (
            t.isMemberExpression(left) &&
            t.isThisExpression(left.object) &&
            t.isIdentifier(left.property)
          ) {
            if (
              (t.isArrowFunctionExpression(right) || t.isFunctionExpression(right)) ||
              (left.property.name === 'config' && t.isObjectExpression(right))
            ) {
              body.push(
                t.classProperty(left.property, right)
              )
              _.remove(method.body.body, statement)
            }
          }
        }
      }
    }
  }
}

const ClassDeclarationOrExpression = {
  enter (astPath) {
    const node = astPath.node
    if (!node.superClass) return
    if (
      node.superClass.type === 'MemberExpression' &&
      node.superClass.object.name === taroImportDefaultName
    ) {
      node.superClass.object.name = taroImportDefaultName
      if (node.id === null) {
        const renameComponentClassName = '_TaroComponentClass'
        componentClassName = renameComponentClassName
        astPath.replaceWith(
          t.classDeclaration(
            t.identifier(renameComponentClassName),
            node.superClass,
            node.body,
            node.decorators || []
          )
        )
      } else {
        componentClassName = node.id.name
      }
    } else if (node.superClass.name === 'Component' || node.superClass.name === 'PureComponent') {
      resetTSClassProperty(node.body.body)
      if (node.id === null) {
        const renameComponentClassName = '_TaroComponentClass'
        componentClassName = renameComponentClassName
        astPath.replaceWith(
          t.classDeclaration(
            t.identifier(renameComponentClassName),
            node.superClass,
            node.body,
            node.decorators || []
          )
        )
      } else {
        componentClassName = node.id.name
      }
    }
  }
}

export function parseJSCode ({code, filePath, isEntryFile, projectConfig}) {
  let ast
  try {
    ast = getJSAst(code, filePath)
  } catch (e) {
    throw e
  }
  const styleFiles: string[] = []
  const pages: string[] = [] // app.js 里面的config 配置里面的 pages
  const iconPaths: string[] = [] // app.js 里面的config 配置里面的需要引入的 iconPath
  let hasAddReactImportDefaultName = false
  let providorImportName
  let storeName
  let hasAppExportDefault
  let classRenderReturnJSX

  let hasConstructor = false
  let hasComponentDidMount = false
  let hasComponentDidShow = false
  let hasComponentDidHide = false
  let hasComponentWillUnmount = false
  let hasJSX = false

  traverse(ast, {
    ClassExpression: ClassDeclarationOrExpression,
    ClassDeclaration: ClassDeclarationOrExpression,
    ExpressionStatement (astPath) {
      const node = astPath.node as t.ExpressionStatement
      const expression = node.expression as t.CallExpression
      const callee = expression.callee as t.Identifier
      if (callee && callee.name === 'require') {
        const argument = expression.arguments[0] as t.StringLiteral
        const value = argument.value
        const valueExtname = path.extname(value)
        if (REG_STYLE.test(valueExtname)) {
          astPath.replaceWith(t.importDeclaration([], t.stringLiteral(value)))
        }
      }
    },
    ImportDeclaration (astPath) {
      const node = astPath.node as t.ImportDeclaration
      const source = node.source
      let value = source.value
      const valueExtname = path.extname(value)
      const specifiers = node.specifiers
      const pathAlias = projectConfig.alias || {}
      if (isAliasPath(value, pathAlias)) {
        source.value = value = replaceAliasPath(filePath, value, pathAlias)
      }
      // 引入的包为非 npm 包
      if (!isNpmPkg(value)) {
        // import 样式处理
        if (REG_STYLE.test(valueExtname)) {
          const stylePath = path.resolve(path.dirname(filePath), value)
          if (styleFiles.indexOf(stylePath) < 0) {
            // 样式条件文件编译 .rn.scss
            const realStylePath = resolveStylePath(stylePath)
            styleFiles.push(realStylePath)
          }
        }
        if (value.indexOf('.') === 0) {
          // const pathArr = value.split('/')
          // if (pathArr.indexOf('pages') >= 0) {
          //   astPath.remove()
          // } else
          if (REG_SCRIPTS.test(value) || path.extname(value) === '') {
            const absolutePath = path.resolve(filePath, '..', value)
            const dirname = path.dirname(absolutePath)
            const extname = path.extname(absolutePath)
            const realFilePath = resolveScriptPath(path.join(dirname, path.basename(absolutePath, extname)))
            const removeExtPath = realFilePath.replace(path.extname(realFilePath), '')
            node.source = t.stringLiteral(promoteRelativePath(path.relative(filePath, removeExtPath)).replace(/\\/g, '/'))
          }
        }
        return
      }
      if (value === PACKAGES['@tarojs/taro']) {
        const specifier = specifiers.find(item => item.type === 'ImportDefaultSpecifier')
        if (specifier) {
          hasAddReactImportDefaultName = true
          taroImportDefaultName = specifier.local.name
          specifier.local.name = reactImportDefaultName
        } else if (!hasAddReactImportDefaultName) {
          hasAddReactImportDefaultName = true
          node.specifiers.unshift(
            t.importDefaultSpecifier(t.identifier(reactImportDefaultName))
          )
        }
        // 删除从@tarojs/taro引入的 React
        specifiers.forEach((item, index) => {
          if (item.type === 'ImportDefaultSpecifier') {
            specifiers.splice(index, 1)
          }
        })
        const taroApisSpecifiers: t.ImportSpecifier[] = []
        specifiers.forEach((item, index) => {
          if ((item as t.ImportSpecifier).imported && taroApis.indexOf((item as t.ImportSpecifier).imported.name) >= 0) {
            taroApisSpecifiers.push(
              t.importSpecifier(t.identifier((item as t.ImportSpecifier).local.name), t.identifier((item as t.ImportSpecifier).imported.name)))
            specifiers.splice(index, 1)
          }
        })
        source.value = PACKAGES['@tarojs/taro-rn']

        if (taroApisSpecifiers.length) {
          astPath.insertBefore(t.importDeclaration(taroApisSpecifiers, t.stringLiteral(PACKAGES['@tarojs/taro-rn'])))
        }
        if (!specifiers.length) {
          astPath.remove()
        }
      } else if (value === PACKAGES['@tarojs/redux']) {
        const specifier = specifiers.find(item => {
          return t.isImportSpecifier(item) && item.imported.name === providerComponentName
        })
        if (specifier) {
          providorImportName = specifier.local.name
        } else {
          providorImportName = providerComponentName
          specifiers.push(t.importSpecifier(t.identifier(providerComponentName), t.identifier(providerComponentName)))
        }
        source.value = PACKAGES['react-redux-rn']
      } else if (value === PACKAGES['@tarojs/mobx']) {
        const specifier = specifiers.find(item => {
          return t.isImportSpecifier(item) && item.imported.name === providerComponentName
        })
        if (specifier) {
          providorImportName = specifier.local.name
        } else {
          providorImportName = providerComponentName
          specifiers.push(t.importSpecifier(t.identifier(providerComponentName), t.identifier(providerComponentName)))
        }
        source.value = PACKAGES['@tarojs/mobx-rn']
      } else if (value === PACKAGES['@tarojs/components']) {
        source.value = PACKAGES['@tarojs/components-rn']
      }
    },
    ClassProperty: getClassPropertyVisitor({filePath, pages, iconPaths, isEntryFile}),
    ClassMethod: {
      enter (astPath: NodePath<t.ClassMethod>) {
        const node = astPath.node
        const key = node.key
        const keyName = toVar(key)
        // 仅关注 app.js
        if (!isEntryFile) return
        // 初始化 生命周期函数判断
        if (keyName === 'constructor') {
          hasConstructor = true
        } else if (keyName === 'componentDidMount') {
          hasComponentDidMount = true
        } else if (keyName === 'componentDidShow') {
          hasComponentDidShow = true
        } else if (keyName === 'componentDidHide') {
          hasComponentDidHide = true
        } else if (keyName === 'componentWillUnmount') {
          hasComponentWillUnmount = true
        }
        // 获取 app.js 的 classRenderReturnJSX
        if (keyName === 'render') {
          astPath.traverse({
            BlockStatement (astPath) {
              if (astPath.parent === node) {
                const node = astPath.node
                astPath.traverse({
                  ReturnStatement (astPath) {
                    if (astPath.parent === node) {
                      astPath.traverse({
                        JSXElement (astPath) {
                          classRenderReturnJSX = generate(astPath.node).code
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    },

    ExportDefaultDeclaration () {
      if (isEntryFile) {
        hasAppExportDefault = true
      }
    },
    JSXElement: {
      exit (astPath: NodePath<t.JSXElement>) {
        hasJSX = true
      }
    },
    JSXOpeningElement: {
      enter (astPath) {
        const node = astPath.node as t.JSXOpeningElement
        if ((node.name as any).name === 'Provider') {
          for (const v of node.attributes) {
            if (v.name.name !== 'store') continue
            storeName = (v.value as any).expression.name
            break
          }
        }
      }
    },
    Program: {
      exit (astPath) {
        const node = astPath.node as t.Program
        astPath.traverse({
          ClassMethod (astPath) {
            const node = astPath.node
            const key = node.key as t.Identifier

            const keyName = toVar(key)
            const isComponentDidMount = keyName === 'componentDidMount'
            const isComponentWillUnmount = keyName === 'componentWillUnmount'
            const isConstructor = keyName === 'constructor'

            if (!isEntryFile) return

            if (hasConstructor && isConstructor) {
              node.body.body.push(additionalConstructorNode)
            }

            if (hasComponentDidShow && isComponentDidMount) {
              const componentDidShowCallNode = toAst(`this.componentDidShow()`)
              node.body.body.push(componentDidShowCallNode)
            }

            if (hasComponentDidHide && isComponentWillUnmount) {
              const componentDidHideCallNode = toAst(`this.componentDidHide()`)
              node.body.body.unshift(componentDidHideCallNode)
            }

            if (key.name === 'render') {
              let funcBody = `
              <${taroComponentsRNProviderName}>
                ${classRenderReturnJSX}
              </${taroComponentsRNProviderName}>`

              if (pages.length > 0) {
                funcBody = `
                <${taroComponentsRNProviderName}>
                  <RootStack/>
                </${taroComponentsRNProviderName}>`
              }

              if (providerComponentName && storeName) {
                // 使用redux 或 mobx
                funcBody = `
                <${providorImportName} store={${storeName}}>
                  ${funcBody}
                </${providorImportName}>`
              }
              node.body = template(`{return (${funcBody});}`, babylonConfig as any)() as any
            }
          },

          ClassBody: {
            exit (astPath: NodePath<t.ClassBody>) {
              if (!isEntryFile) return
              const node = astPath.node
              if (hasComponentDidShow && !hasComponentDidMount) {
                node.body.push(t.classMethod(
                  'method', t.identifier('componentDidMount'), [],
                  t.blockStatement([
                    toAst('this.componentDidShow && this.componentDidShow()') as t.Statement
                  ]), false, false))
              }
              if (hasComponentDidHide && !hasComponentWillUnmount) {
                node.body.push(t.classMethod(
                  'method', t.identifier('componentWillUnmount'), [],
                  t.blockStatement([
                    toAst('this.componentDidHide && this.componentDidHide()') as t.Statement
                  ]), false, false))
              }
              if (!hasConstructor) {
                node.body.unshift(
                  t.classMethod(
                    'constructor',
                    t.identifier('constructor'),
                    [t.identifier('props'), t.identifier('context')],
                    t.blockStatement([superNode, additionalConstructorNode] as t.Statement[]),
                    false,
                    false
                  )
                )
              }
            }
          },
          CallExpression (astPath) {
            const node = astPath.node
            const callee = node.callee as t.Identifier
            const calleeName = callee.name
            const parentPath = astPath.parentPath

            if (t.isMemberExpression(callee)) {
              const object = callee.object as t.Identifier
              const property = callee.property as t.Identifier
              if (object.name === taroImportDefaultName && property.name === 'render') {
                astPath.remove()
              }
            } else {
              if (calleeName === setStoreFuncName) {
                if (parentPath.isAssignmentExpression() ||
                  parentPath.isExpressionStatement() ||
                  parentPath.isVariableDeclarator()) {
                  parentPath.remove()
                }
              }
            }
          }
        })
        // insert React
        if (hasJSX) {
          node.body.unshift(template(`import React from 'react'`, babylonConfig as any)())
        }
        // import Taro from @tarojs/taro-rn
        if (taroImportDefaultName) {
          const importTaro = template(
            `import ${taroImportDefaultName} from '${PACKAGES['@tarojs/taro-rn']}'`,
            babylonConfig as any
          )()
          node.body.unshift(importTaro as any)
        }

        if (isEntryFile) {
          // 注入 import page from 'XXX'
          pages.forEach(item => {
            const pagePath = item.startsWith('/') ? item : `/${item}`
            // 1. Get Resolved Page Relative Path
            const absolutePath = path.resolve(filePath, '..', pagePath.substr(1))
            const dirname = path.dirname(absolutePath)
            const extname = path.extname(absolutePath)
            const realFilePath = resolveScriptPath(path.join(dirname, path.basename(absolutePath, extname)))
            const removeExtPath = realFilePath.replace(path.extname(realFilePath), '')
            const resolvedPagePath = promoteRelativePath(path.relative(filePath, removeExtPath)).replace(/\\/g, '/')
            // 2. Inject import ${screenName} from '.${resolvedPagePath}'
            const screenName = _.camelCase(pagePath)
            const importScreen = template(
              `import ${screenName} from '${resolvedPagePath}'`,
              babylonConfig as any
            )()
            node.body.unshift(importScreen as any)
          })

          // import tabBar icon
          iconPaths.forEach(item => {
            const iconPath = item.startsWith('/') ? item : `/${item}`
            const iconName = _.camelCase(iconPath)
            const importIcon = template(
              `import ${iconName} from '.${iconPath}'`,
              babylonConfig as any
            )()
            node.body.unshift(importIcon as any)
          })

          // Taro.initRouter  生成 RootStack
          const routerPages = pages
            .map(item => {
              const pagePath = item.startsWith('/') ? item : `/${item}`
              const screenName = _.camelCase(pagePath)
              return `['${item}',${screenName}]`
            })
            .join(',')
          node.body.push(template(
            `const RootStack = ${routerImportDefaultName}.initRouter(
            [${routerPages}],
            ${taroImportDefaultName},
            App.config
            )`,
            babylonConfig as any
          )() as any)
          // initNativeApi
          const initNativeApi = template(
            `${taroImportDefaultName}.initNativeApi(${taroImportDefaultName})`,
            babylonConfig as any
          )()
          node.body.push(initNativeApi as any)

          // import @tarojs/taro-router-rn
          const importTaroRouter = template(
            `import TaroRouter from '${PACKAGES['@tarojs/taro-router-rn']}'`,
            babylonConfig as any
          )()
          node.body.unshift(importTaroRouter as any)

          // 根节点嵌套组件提供的 provider
          const importTCRNProvider = template(
            `import { Provider as ${taroComponentsRNProviderName} } from '${PACKAGES['@tarojs/components-rn']}'`,
            babylonConfig
          )()
          node.body.unshift(importTCRNProvider)

          // Taro.initPxTransform
          node.body.push(getInitPxTransformNode(projectConfig) as any)

          // export default App
          if (!hasAppExportDefault) {
            const appExportDefault = template(
              `export default ${componentClassName}`,
              babylonConfig as any
            )()
            node.body.push(appExportDefault as any)
          }
        }
      }
    }
  })
  try {
    const constantsReplaceList = Object.assign({
      'process.env.TARO_ENV': 'rn'
    }, generateEnvList(projectConfig.env || {}), generateConstantsList(projectConfig.defineConstants || {}))
    // TODO 使用 babel-plugin-transform-jsx-to-stylesheet 处理 JSX 里面样式的处理，删除无效的样式引入待优化

    const plugins = [
      [require('babel-plugin-transform-jsx-to-stylesheet'), {filePath}],
      require('babel-plugin-transform-class-properties'),
      require('babel-plugin-transform-decorators-legacy').default,
      [require('babel-plugin-danger-remove-unused-import'), {ignore: ['@tarojs/taro', 'react', 'react-native', 'nervjs']}],
      [require('babel-plugin-transform-define').default, constantsReplaceList]
    ]

    // const babelConfig = projectConfig.plugins.babel
    // const plugins = babelConfig.plugins.concat(extraBabelPlugins)
    const newBabelConfig = Object.assign({}, {plugins})

    ast = babel.transformFromAst(ast, code, newBabelConfig).ast
  } catch (e) {
    throw e
  }

  return {
    code: unescape(generate(ast).code.replace(/\\u/g, '%u')),
    styleFiles
  }
}
