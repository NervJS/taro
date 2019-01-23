const path = require('path')
const babel = require('babel-core')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const _ = require('lodash')
const generate = require('babel-generator').default
const template = require('babel-template')
const wxTransformer = require('@tarojs/transformer-wx')
const Util = require('../util')
const babylonConfig = require('../config/babylon')
const {source: toAst} = require('../util/ast_convert')

const reactImportDefaultName = 'React'
let taroImportDefaultName // import default from @tarojs/taro
let componentClassName // get app.js class name
const providerComponentName = 'Provider'
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

function getInitPxTransformNode (projectConfig) {
  let pxTransformConfig = {designWidth: projectConfig.designWidth || 750}

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
              const pagePath = `${root}/${v.value}`.replace(/\/{2,}/g, '/')
              pages.push(pagePath.replace(/^\//, ''))
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
                let node = astPath.node
                let value = node.value.value
                if (node.key.name === 'iconPath' ||
                  node.key.value === 'iconPath' ||
                  node.key.name === 'selectedIconPath' ||
                  node.key.value === 'selectedIconPath'
                ) {
                  if (typeof value !== 'string') return
                  let iconName = _.camelCase(value.split('/'))
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
    isTyped: Util.REG_TYPESCRIPT.test(filePath),
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
    } else if (node.superClass.name === 'Component') {
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

function parseJSCode ({code, filePath, isEntryFile, projectConfig}) {
  let ast
  try {
    ast = getJSAst(code, filePath)
  } catch (e) {
    throw e
  }
  const styleFiles = []
  let pages = [] // app.js 里面的config 配置里面的 pages
  let iconPaths = [] // app.js 里面的config 配置里面的需要引入的 iconPath
  let hasAddReactImportDefaultName = false
  let providorImportName
  let storeName
  let hasAppExportDefault
  let classRenderReturnJSX

  traverse(ast, {
    ClassExpression: ClassDeclarationOrExpression,
    ClassDeclaration: ClassDeclarationOrExpression,
    ImportDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      let value = source.value
      const valueExtname = path.extname(value)
      const specifiers = node.specifiers
      const pathAlias = projectConfig.alias || {}
      if (Util.isAliasPath(value, pathAlias)) {
        source.value = value = Util.replaceAliasPath(filePath, value, pathAlias)
      }
      // 引入的包为 npm 包
      if (!Util.isNpmPkg(value)) {
        // import 样式处理
        if (Util.REG_STYLE.test(valueExtname)) {
          const stylePath = path.resolve(path.dirname(filePath), value)
          if (styleFiles.indexOf(stylePath) < 0) {
            styleFiles.push(stylePath)
          }
        }
        return
      }
      if (value === PACKAGES['@tarojs/taro']) {
        let specifier = specifiers.find(item => item.type === 'ImportDefaultSpecifier')
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
        const taroApisSpecifiers = []
        specifiers.forEach((item, index) => {
          if (item.imported && taroApis.indexOf(item.imported.name) >= 0) {
            taroApisSpecifiers.push(t.importSpecifier(t.identifier(item.local.name), t.identifier(item.imported.name)))
            specifiers.splice(index, 1)
          }
        })
        source.value = PACKAGES['@tarojs/taro-rn']
        // insert React
        astPath.insertBefore(template(`import React from 'react'`, babylonConfig)())

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
    // 获取 classRenderReturnJSX
    ClassMethod (astPath) {
      let node = astPath.node
      const key = node.key
      if (key.name !== 'render' || !isEntryFile) return
      astPath.traverse({
        BlockStatement (astPath) {
          if (astPath.parent === node) {
            node = astPath.node
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
    },

    ExportDefaultDeclaration () {
      if (isEntryFile) {
        hasAppExportDefault = true
      }
    },
    JSXOpeningElement: {
      enter (astPath) {
        if (astPath.node.name.name === 'Provider') {
          for (let v of astPath.node.attributes) {
            if (v.name.name !== 'store') continue
            storeName = v.value.expression.name
            break
          }
        }
      }
    },
    Program: {
      exit (astPath) {
        const node = astPath.node
        astPath.traverse({
          ClassMethod (astPath) {
            const node = astPath.node
            const key = node.key
            if (key.name !== 'render' || !isEntryFile) return
            let funcBody = classRenderReturnJSX
            if (pages.length > 0) {
              funcBody = `<RootStack/>`
            }
            if (providerComponentName && storeName) {
              // 使用redux 或 mobx
              funcBody = `
                <${providorImportName} store={${storeName}}>
                  ${funcBody}
                </${providorImportName}>`
            }
            node.body = template(`{return (${funcBody});}`, babylonConfig)()
          },

          CallExpression (astPath) {
            const node = astPath.node
            const callee = node.callee
            const calleeName = callee.name
            const parentPath = astPath.parentPath

            if (t.isMemberExpression(callee)) {
              if (callee.object.name === taroImportDefaultName && callee.property.name === 'render') {
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
        // import Taro from @tarojs/taro-rn
        if (taroImportDefaultName) {
          const importTaro = template(
            `import ${taroImportDefaultName} from '${PACKAGES['@tarojs/taro-rn']}'`,
            babylonConfig
          )()
          node.body.unshift(importTaro)
        }

        if (isEntryFile) {
          // 注入 import page from 'XXX'
          pages.forEach(item => {
            const pagePath = item.startsWith('/') ? item : `/${item}`
            const screenName = _.camelCase(pagePath.split('/'), {pascalCase: true})
            const importScreen = template(
              `import ${screenName} from '.${pagePath}'`,
              babylonConfig
            )()
            node.body.unshift(importScreen)
          })
          iconPaths.forEach(item => {
            const iconPath = item.startsWith('/') ? item : `/${item}`
            const iconName = _.camelCase(iconPath.split('/'))
            const importIcon = template(
              `import ${iconName} from '.${iconPath}'`,
              babylonConfig
            )()
            node.body.unshift(importIcon)
          })
          // Taro.initRouter  生成 RootStack
          const routerPages = pages
            .map(item => {
              const pagePath = item.startsWith('/') ? item : `/${item}`
              const screenName = _.camelCase(pagePath.split('/'), {pascalCase: true})
              return `['${item}',${screenName}]`
            })
            .join(',')
          node.body.push(template(
            `const RootStack = ${routerImportDefaultName}.initRouter(
            [${routerPages}],
            ${taroImportDefaultName},
            App.config
            )`,
            babylonConfig
          )())
          // initNativeApi
          const initNativeApi = template(
            `${taroImportDefaultName}.initNativeApi(${taroImportDefaultName})`,
            babylonConfig
          )()
          node.body.push(initNativeApi)

          // import @tarojs/taro-router-rn
          const importTaroRouter = template(
            `import TaroRouter from '${PACKAGES['@tarojs/taro-router-rn']}'`,
            babylonConfig
          )()
          node.body.unshift(importTaroRouter)

          // Taro.initPxTransform
          node.body.push(getInitPxTransformNode(projectConfig))

          // export default App
          if (!hasAppExportDefault) {
            const appExportDefault = template(
              `export default ${componentClassName}`,
              babylonConfig
            )()
            node.body.push(appExportDefault)
          }
        }
      }
    }
  })
  try {
    const constantsReplaceList = Object.assign({
      'process.env.TARO_ENV': Util.BUILD_TYPES.RN
    }, Util.generateEnvList(projectConfig.env || {}), Util.generateConstantsList(projectConfig.defineConstants || {}))
    // TODO 使用 babel-plugin-transform-jsx-to-stylesheet 处理 JSX 里面样式的处理，删除无效的样式引入待优化
    ast = babel.transformFromAst(ast, code, {
      plugins: [
        [require('babel-plugin-transform-jsx-to-stylesheet'), {filePath}],
        require('babel-plugin-transform-decorators-legacy').default,
        require('babel-plugin-transform-class-properties'),
        [require('babel-plugin-danger-remove-unused-import'), {ignore: ['@tarojs/taro', 'react', 'react-native', 'nervjs']}],
        [require('babel-plugin-transform-define').default, constantsReplaceList]
      ]
    }).ast
  } catch (e) {
    throw e
  }

  return {
    code: unescape(generate(ast).code.replace(/\\u/g, '%u')),
    styleFiles
  }
}

module.exports = {transformJSCode: parseJSCode}
