import * as path from 'path'

import { getOptions } from 'loader-utils'
import { transform, transformFromAst } from 'babel-core'
import * as t from 'babel-types'
import generate from 'better-babel-generator'
import traverse from 'babel-traverse'
import * as _ from 'lodash'

import {
  BUILD_TYPES,
  taroJsFramework,
  taroJsComponents,
  taroJsRedux,
  QUICKAPP_SPECIAL_COMPONENTS,
  PARSE_AST_TYPE,
  NODE_MODULES_REG
} from '../utils/constants'
import {
  isNpmPkg,
  isQuickAppPkg
} from '../utils'
import { convertSourceStringToAstExpression } from '../utils/astConvert'
import babylonConfig from '../config/babylon'

const template = require('babel-template')

const cannotRemoves = ['@tarojs/taro', 'react', 'nervjs']

const NON_WEBPACK_REQUIRE = '__non_webpack_require__'

function processAst (
  ast: t.File,
  buildAdapter: BUILD_TYPES,
  type: PARSE_AST_TYPE,
  designWidth: number,
  deviceRatio: number,
  sourceFilePath: string,
  sourceDir: string
) {
  const taroMiniAppFramework = `@tarojs/taro-${buildAdapter}`
  let componentClassName: string = ''
  let taroJsReduxConnect: string = ''
  let taroImportDefaultName
  let needExportDefault = false
  let exportTaroReduxConnected: string | null = null
  const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP
  const cannotRemoves = [taroJsFramework, 'react', 'nervjs']
  let hasComponentDidHide
  let hasComponentDidShow
  let hasComponentWillMount
  if (isQuickApp) {
    cannotRemoves.push(taroJsComponents)
  }
  const taroSelfComponents = new Set<string>()

  traverse(ast, {
    ClassDeclaration (astPath) {
      const node = astPath.node
      let hasCreateData = false
      if (node.superClass) {
        astPath.traverse({
          ClassMethod (astPath) {
            if (astPath.get('key').isIdentifier({ name: '_createData' })) {
              hasCreateData = true
            }
          }
        })
        if (hasCreateData) {
          needExportDefault = true
          if (node.id === null) {
            componentClassName = '_TaroComponentClass'
            astPath.replaceWith(
              t.classDeclaration(
                t.identifier(componentClassName),
                node.superClass as t.Expression,
                node.body as t.ClassBody,
                node.decorators as t.Decorator[] || []
              )
            )
          } else if (node.id.name === 'App') {
            componentClassName = '_App'
            astPath.replaceWith(
              t.classDeclaration(
                t.identifier(componentClassName),
                node.superClass as t.Expression,
                node.body as t.ClassBody,
                node.decorators as t.Decorator[] || []
              )
            )
          } else {
            componentClassName = node.id.name
          }
        }
      }
    },

    ClassExpression (astPath) {
      const node = astPath.node
      if (node.superClass) {
        let hasCreateData = false
        astPath.traverse({
          ClassMethod (astPath) {
            if (astPath.get('key').isIdentifier({ name: '_createData' })) {
              hasCreateData = true
            }
          }
        })
        if (hasCreateData) {
          needExportDefault = true
          if (node.id === null) {
            const parentNode = astPath.parentPath.node as any
            if (t.isVariableDeclarator(astPath.parentPath)) {
              componentClassName = parentNode.id.name
            } else {
              componentClassName = '_TaroComponentClass'
            }
            astPath.replaceWith(
              t.classExpression(
                t.identifier(componentClassName),
                node.superClass as t.Expression,
                node.body as t.ClassBody,
                node.decorators as t.Decorator[] || []
              )
            )
          } else if (node.id.name === 'App') {
            componentClassName = '_App'
            astPath.replaceWith(
              t.classExpression(
                t.identifier(componentClassName),
                node.superClass as t.Expression,
                node.body as t.ClassBody,
                node.decorators as t.Decorator[] || []
              )
            )
          } else {
            componentClassName = node.id.name
          }
        }
      }
    },

    ClassMethod (astPath) {
      const keyName = (astPath.get('key').node as t.Identifier).name
      if (keyName === 'componentWillMount') {
        hasComponentWillMount = true
      } else if (keyName === 'componentDidShow') {
        hasComponentDidShow = true
      } else if (keyName === 'componentDidHide') {
        hasComponentDidHide = true
      }
    },

    ClassProperty (astPath) {
      const node = astPath.node
      const keyName = node.key.name
      const valuePath = astPath.get('value')
      if (valuePath.isFunctionExpression() || valuePath.isArrowFunctionExpression()) {
        if (keyName === 'componentWillMount') {
          hasComponentWillMount = true
        } else if (keyName === 'componentDidShow') {
          hasComponentDidShow = true
        } else if (keyName === 'componentDidHide') {
          hasComponentDidHide = true
        }
      }
    },

    ImportDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      let value = source.value
      const specifiers = node.specifiers
      if (isQuickApp && isQuickAppPkg(value)) {
        let defaultSpecifier: string = 'LOCAL'
        specifiers.forEach(item => {
          if (item.type === 'ImportDefaultSpecifier') {
            defaultSpecifier = item.local.name
          }
        })
        astPath.replaceWith(
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(defaultSpecifier),
              t.callExpression(
                t.identifier(NON_WEBPACK_REQUIRE),[
                  t.stringLiteral(value)
                ]
              )
            )
          ])
        )
        return
      }
      if (NODE_MODULES_REG.test(sourceFilePath) && sourceFilePath.indexOf(taroMiniAppFramework) >= 0) {
        return
      }
      if (isNpmPkg(value)) {
        if (value === taroJsComponents) {
          if (isQuickApp) {
            specifiers.forEach(specifier => {
              const name = specifier.local.name
              if (!QUICKAPP_SPECIAL_COMPONENTS.has(name)) {
                taroSelfComponents.add(_.kebabCase(name))
              }
            })
            taroSelfComponents.add('taro-page')
          }
          astPath.remove()
        } else {
          const specifiers = node.specifiers
          if (value === taroJsFramework) {
            let defaultSpecifier: string | null = null
            specifiers.forEach(item => {
              if (item.type === 'ImportDefaultSpecifier') {
                defaultSpecifier = item.local.name
              }
            })
            if (defaultSpecifier) {
              taroImportDefaultName = defaultSpecifier
            }
            value = taroMiniAppFramework
          } else if (value === taroJsRedux) {
            specifiers.forEach(item => {
              if (item.type === 'ImportSpecifier') {
                const local = item.local
                if (local.type === 'Identifier' && local.name === 'connect') {
                  taroJsReduxConnect = item.imported.name
                }
              }
            })
          }
          source.value = value
        }
      }
    },

    CallExpression (astPath) {
      const node = astPath.node
      const callee = node.callee as (t.Identifier | t.MemberExpression)
      if (t.isMemberExpression(callee)) {
        if (taroImportDefaultName && (callee.object as t.Identifier).name === taroImportDefaultName && (callee.property as t.Identifier).name === 'render') {
          astPath.remove()
        }
      } else if (callee.name === 'require') {
        const args = node.arguments as t.StringLiteral[]
        let value = args[0].value
        const parentNode = astPath.parentPath.parentPath.node as t.VariableDeclaration
        if (isQuickApp && isQuickAppPkg(value)) {
          callee.name = NON_WEBPACK_REQUIRE
          return
        }
        if (NODE_MODULES_REG.test(sourceFilePath) && sourceFilePath.indexOf(taroMiniAppFramework) >= 0) {
          return
        }
        if (isNpmPkg(value)) {
          if (value === taroJsComponents) {
            if (isQuickApp) {
              if (parentNode.declarations.length === 1 && parentNode.declarations[0].init) {
                const id = parentNode.declarations[0].id
                if (id.type === 'ObjectPattern') {
                  const properties = id.properties as any
                  properties.forEach(p => {
                    if (p.type === 'ObjectProperty' && p.value.type === 'Identifier') {
                      taroSelfComponents.add(_.kebabCase(p.value.name))
                    }
                  })
                }
              }
            }
            astPath.remove()
          } else {
            if (t.isVariableDeclaration(astPath.parentPath.parentPath)) {
              if (parentNode.declarations.length === 1 && parentNode.declarations[0].init) {
                const id = parentNode.declarations[0].id
                if (value === taroJsFramework && id.type === 'Identifier') {
                  taroImportDefaultName = id.name
                  value = taroMiniAppFramework
                } else if (value === taroJsRedux) {
                  const declarations = parentNode.declarations
                  declarations.forEach(item => {
                    const id = item.id
                    if (id.type === 'ObjectPattern') {
                      const properties = id.properties as any
                      properties.forEach(p => {
                        if (p.type === 'ObjectProperty') {
                          if (p.value.type === 'Identifier' && p.value.name === 'connect') {
                            taroJsReduxConnect = p.key.name
                          }
                        }
                      })
                    }
                  })
                }
              }
            }
            args[0].value = value
          }
        }
      }
    },

    ExportDefaultDeclaration (astPath) {
      const node = astPath.node
      const declaration = node.declaration
      needExportDefault = false
      if (
        declaration &&
        (declaration.type === 'ClassDeclaration' || declaration.type === 'ClassExpression')
      ) {
        const superClass = declaration.superClass
        if (superClass) {
          let hasCreateData = false
          astPath.traverse({
            ClassMethod (astPath) {
              if (astPath.get('key').isIdentifier({ name: '_createData' })) {
                hasCreateData = true
              }
            }
          })
          if (hasCreateData) {
            needExportDefault = true
            if (declaration.id === null) {
              componentClassName = '_TaroComponentClass'
            } else if (declaration.id.name === 'App') {
              componentClassName = '_App'
            } else {
              componentClassName = declaration.id.name
            }
            const isClassDcl = declaration.type === 'ClassDeclaration'
            const classDclProps = [t.identifier(componentClassName), superClass, declaration.body, declaration.decorators || []]
            astPath.replaceWith(isClassDcl ? t.classDeclaration.apply(null, classDclProps) : t.classExpression.apply(null, classDclProps))
          }
        }
      } else if (declaration.type === 'CallExpression') {
        const callee = declaration.callee
        if (callee && callee.type === 'CallExpression') {
          const subCallee = callee.callee
          if (subCallee.type === 'Identifier' && subCallee.name === taroJsReduxConnect) {
            const args = declaration.arguments as t.Identifier[]
            if (args.length === 1 && args[0].name === componentClassName) {
              needExportDefault = true
              exportTaroReduxConnected = `${componentClassName}__Connected`
              astPath.replaceWith(t.variableDeclaration('const', [t.variableDeclarator(t.identifier(`${componentClassName}__Connected`), t.callExpression(declaration.callee as t.Expression, declaration.arguments as Array<t.Expression | t.SpreadElement>))]))
            }
          }
        }
      } else if (declaration.type === 'Identifier') {
        const name = declaration.name
        if (name === componentClassName || name === exportTaroReduxConnected) {
          needExportDefault = true
          astPath.remove()
        }
      }
    },

    Program: {
      exit (astPath) {
        astPath.traverse({
          ClassBody (astPath) {
            if (isQuickApp) {
              const node = astPath.node
              if (!hasComponentWillMount) {
                node.body.push(t.classMethod(
                  'method', t.identifier('componentWillMount'), [],
                  t.blockStatement([]), false, false))
              }
              if (!hasComponentDidShow) {
                node.body.push(t.classMethod(
                  'method', t.identifier('componentDidShow'), [],
                  t.blockStatement([]), false, false))
              }
              if (!hasComponentDidHide) {
                node.body.push(t.classMethod(
                  'method', t.identifier('componentDidHide'), [],
                  t.blockStatement([]), false, false))
              }
              node.body.push(t.classMethod(
                'method', t.identifier('__listenToSetNavigationBarEvent'), [],
                t.blockStatement([convertSourceStringToAstExpression(
                  `if (!Taro.eventCenter.callbacks['TaroEvent:setNavigationBar']) {
                    Taro.eventCenter.on('TaroEvent:setNavigationBar', params => {
                      if (params.title) {
                        this.$scope.$page.setTitleBar({ text: params.title })
                      }
                      if (params.frontColor) {
                        this.$scope.$page.setTitleBar({ textColor: params.frontColor })
                      }
                      if (params.backgroundColor) {
                        this.$scope.$page.setTitleBar({ backgroundColor: params.backgroundColor })
                      }
                    })
                  }`
                )]), false, false))
              node.body.push(t.classMethod(
                'method', t.identifier('__offListenToSetNavigationBarEvent'), [],
                t.blockStatement([convertSourceStringToAstExpression(
                  `Taro.eventCenter.off('TaroEvent:setNavigationBar')`
              )]), false, false))
            }
          },
          ClassMethod (astPath) {
            if (isQuickApp) {
              const node = astPath.node
              const keyName = (node.key as t.Identifier).name
              if (keyName === 'componentDidShow' || keyName === 'componentWillMount') {
                node.body.body.unshift(convertSourceStringToAstExpression(`this.__listenToSetNavigationBarEvent()`))
              } else if (keyName === 'componentDidHide') {
                node.body.body.unshift(convertSourceStringToAstExpression(`this.__offListenToSetNavigationBarEvent()`))
              }
            }
          }
        })
        const node = astPath.node as t.Program
        const exportVariableName = exportTaroReduxConnected || componentClassName
        if (needExportDefault && !isQuickApp) {
          const exportDefault = template(`export default ${exportVariableName}`, babylonConfig as any)()
          node.body.push(exportDefault as any)
        }
        switch (type) {
          case PARSE_AST_TYPE.ENTRY:
            const pxTransformConfig = {
              designWidth: designWidth || 750
            }
            if (deviceRatio) {
              pxTransformConfig['deviceRatio'] = deviceRatio
            }
            if (isQuickApp) {
              if (!taroImportDefaultName) {
                node.body.unshift(
                  template(`import Taro from '${taroMiniAppFramework}'`, babylonConfig as any)() as any
                )
              }
              node.body.push(template(`exportRes = require('${taroMiniAppFramework}').default.createApp(${exportVariableName})`, babylonConfig as any)() as any)
              node.body.push(template(`export default exportRes`, babylonConfig as any)() as any)
            } else {
              node.body.push(template(`App(require('${taroMiniAppFramework}').default.createApp(${exportVariableName}))`, babylonConfig as any)() as any)
            }
            node.body.push(template(`Taro.initPxTransform(${JSON.stringify(pxTransformConfig)})`, babylonConfig as any)() as any)
            break
          case PARSE_AST_TYPE.PAGE:
            if (buildAdapter === BUILD_TYPES.WEAPP || buildAdapter === BUILD_TYPES.QQ) {
              node.body.push(template(`Component(require('${taroMiniAppFramework}').default.createComponent(${exportVariableName}, true))`, babylonConfig as any)() as any)
            } else if (isQuickApp) {
              const pagePath = sourceFilePath.replace(sourceDir, '').replace(/\\/g, '/').replace(path.extname(sourceFilePath), '')
              if (!taroImportDefaultName) {
                node.body.unshift(
                  template(`import Taro from '${taroMiniAppFramework}'`, babylonConfig as any)() as any
                )
              }
              node.body.push(template(`exportRes = require('${taroMiniAppFramework}').default.createComponent(${exportVariableName}, '${pagePath}')`, babylonConfig as any)() as any)
              node.body.push(template(`export default exportRes`, babylonConfig as any)() as any)
            } else {
              node.body.push(template(`Page(require('${taroMiniAppFramework}').default.createComponent(${exportVariableName}, true))`, babylonConfig as any)() as any)
            }
            break
          case PARSE_AST_TYPE.COMPONENT:
            if (isQuickApp) {
              if (!taroImportDefaultName) {
                node.body.unshift(
                  template(`import Taro from '${taroMiniAppFramework}'`, babylonConfig as any)() as any
                )
              }
              node.body.push(template(`exportRes = require('${taroMiniAppFramework}').default.createComponent(${exportVariableName})`, babylonConfig as any)() as any)
              node.body.push(template(`export default exportRes`, babylonConfig as any)() as any)
            } else {
              node.body.push(template(`Component(require('${taroMiniAppFramework}').default.createComponent(${exportVariableName}))`, babylonConfig as any)() as any)
            }
            break
          default:
            break
        }
      }
    }
  })

  return ast
}

export default function fileParseLoader (source, ast) {
  const {
    babel: babelConfig,
    constantsReplaceList,
    buildAdapter,
    designWidth,
    deviceRatio,
    sourceDir
  } = getOptions(this)
  const filePath = this.resourcePath
  const newAst = transformFromAst(ast, '', {
    plugins: [
      [require('babel-plugin-danger-remove-unused-import'), { ignore: cannotRemoves }],
      [require('babel-plugin-transform-define').default, constantsReplaceList]
    ]
  }).ast as t.File
  const miniType = this._module.miniType || PARSE_AST_TYPE.NORMAL
  const result = processAst(newAst, buildAdapter, miniType, designWidth, deviceRatio, filePath, sourceDir)
  const code = generate(result).code
  const res = transform(code, babelConfig)
  return res.code
}
