const fs = require('fs-extra')
const path = require('path')
const chokidar = require('chokidar')
const wxTransformer = require('@tarojs/transformer-wx')
const klaw = require('klaw')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const babel = require('babel-core')
const generate = require('better-babel-generator').default
const _ = require('lodash')
const rimraf = require('rimraf')
const { promisify } = require('util')
const minimatch = require('minimatch')

const Util = require('./util')
const npmProcess = require('./util/npm')
const CONFIG = require('./config')
const { source: toAst, getObjKey } = require('./util/ast_convert')

const appPath = process.cwd()
const projectConfig = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
const h5Config = projectConfig.h5 || {}
const routerConfig = h5Config.router || {}
const routerMode = routerConfig.mode === 'browser' ? 'browser' : 'hash'
const customRoutes = routerConfig.customRoutes || {}
const routerBasename = routerConfig.basename || '/'
const sourceDir = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
const sourcePath = path.join(appPath, sourceDir)
const outputDir = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
const outputPath = path.join(appPath, outputDir)
const tempDir = CONFIG.TEMP_DIR
const tempPath = path.join(appPath, tempDir)
const entryFilePath = Util.resolveScriptPath(path.join(sourcePath, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)
let pxTransformConfig = { designWidth: projectConfig.designWidth || 750 }
const pathAlias = projectConfig.alias || {}

const PACKAGES = {
  '@tarojs/taro': '@tarojs/taro',
  '@tarojs/taro-h5': '@tarojs/taro-h5',
  '@tarojs/redux': '@tarojs/redux',
  '@tarojs/redux-h5': '@tarojs/redux-h5',
  '@tarojs/mobx': '@tarojs/mobx',
  '@tarojs/mobx-h5': '@tarojs/mobx-h5',
  '@tarojs/router': `@tarojs/router`,
  '@tarojs/components': '@tarojs/components',
  'nervjs': 'nervjs',
  'nerv-redux': 'nerv-redux'
}

const taroApis = [
  'Component',
  'getEnv',
  'ENV_TYPE',
  'eventCenter',
  'Events',
  'internal_safe_get',
  'internal_dynamic_recursive'
]
const nervJsImportDefaultName = 'Nerv'
const tabBarComponentName = 'Tabbar'
const tabBarContainerComponentName = 'TabbarContainer'
const tabBarPanelComponentName = 'TabbarPanel'
const providerComponentName = 'Provider'
const setStoreFuncName = 'setStore'
const tabBarConfigName = '__tabs'
const DEVICE_RATIO = 'deviceRatio'

if (projectConfig.hasOwnProperty(DEVICE_RATIO)) {
  pxTransformConfig[DEVICE_RATIO] = projectConfig.deviceRatio
}

let pages = []
let tabBar
let tabbarPos

const FILE_TYPE = {
  ENTRY: 'ENTRY',
  PAGE: 'PAGE',
  COMPONENT: 'COMPONENT',
  NORMAL: 'NORMAL'
}

const addLeadingSlash = path => path.charAt(0) === '/' ? path : '/' + path
const stripTrailingSlash = path => path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path

const isUnderSubPackages = (parentPath) => (parentPath.isObjectProperty() && /subPackages|subpackages/i.test(getObjKey(parentPath.node.key)))

const publicPath = h5Config.publicPath
  ? stripTrailingSlash(addLeadingSlash(h5Config.publicPath || ''))
  : ''

function createRoute ({ absPagename, relPagename, isIndex, chunkName = '' }) {
  const chunkNameComment = chunkName ? `/* webpackChunkName: "${chunkName}" */` : ''
  return `{
    path: '${absPagename}',
    componentLoader: () => import(${chunkNameComment}'${relPagename}'),
    isIndex: ${isIndex}
  }`
}

function processEntry (code, filePath) {
  let ast = wxTransformer({
    code,
    sourcePath: filePath,
    isNormal: true,
    isTyped: Util.REG_TYPESCRIPT.test(filePath),
    adapter: 'h5'
  }).ast
  let taroImportDefaultName
  let providorImportName
  let storeName
  let renderCallCode

  let hasAddNervJsImportDefaultName = false
  let hasConstructor = false
  let hasComponentWillMount = false
  let hasComponentDidMount = false
  let hasComponentDidShow = false
  let hasComponentDidHide = false
  let hasComponentWillUnmount = false
  let hasJSX = false
  let hasState = false

  const initPxTransformNode = toAst(`Taro.initPxTransform(${JSON.stringify(pxTransformConfig)})`)
  const additionalConstructorNode = toAst(`Taro._set$app(this)`)

  ast = babel.transformFromAst(ast, '', {
    plugins: [
      [require('babel-plugin-danger-remove-unused-import'), { ignore: ['@tarojs/taro', 'react', 'nervjs'] }]
    ]
  }).ast

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
          astPath.replaceWith(
            t.classExpression(
              t.identifier(renameComponentClassName),
              node.superClass,
              node.body,
              node.decorators || []
            )
          )
        }
      } else if (node.superClass.name === 'Component') {
        resetTSClassProperty(node.body.body)
        if (node.id === null) {
          const renameComponentClassName = '_TaroComponentClass'
          astPath.replaceWith(
            t.classExpression(
              t.identifier(renameComponentClassName),
              node.superClass,
              node.body,
              node.decorators || []
            )
          )
        }
      }
    }
  }

  /**
   * ProgramExit使用的visitor
   * 负责修改render函数的内容，在componentDidMount中增加componentDidShow调用，在componentWillUnmount中增加componentDidHide调用。
   */
  const programExitVisitor = {
    ClassMethod: {
      exit (astPath) {
        const node = astPath.node
        const key = node.key
        const keyName = getObjKey(key)
        let funcBody

        const isRender = keyName === 'render'
        const isComponentWillMount = keyName === 'componentWillMount'
        const isComponentDidMount = keyName === 'componentDidMount'
        const isComponentWillUnmount = keyName === 'componentWillUnmount'
        const isConstructor = keyName === 'constructor'
        const basename = JSON.stringify(addLeadingSlash(stripTrailingSlash(routerBasename)))

        if (isRender) {
          const routes = pages.map((v, k) => {
            const absPagename = addLeadingSlash(v)
            const relPagename = `.${absPagename}`
            const chunkName = relPagename.split('/').filter(v => !/^(pages|\.)$/i.test(v)).join('_')
            return createRoute({
              absPagename,
              relPagename,
              chunkName,
              isIndex: k === 0
            })
          })

          funcBody = `<Router
            mode={${JSON.stringify(routerMode)}}
            publicPath={${JSON.stringify(routerMode === 'hash' ? '/' : publicPath)}}
            routes={[${routes.join(',')}]}
            customRoutes={${JSON.stringify(customRoutes)}}
            basename={${basename}}
          />`

          /* 插入Tabbar */
          if (tabBar) {
            const homePage = pages[0] || ''
            if (tabbarPos === 'top') {
              funcBody = `
                <${tabBarContainerComponentName}>
                  <${tabBarComponentName} conf={${tabBarConfigName}} homePage="${homePage}" router={${taroImportDefaultName}}/>
                  <${tabBarPanelComponentName}>
                    ${funcBody}
                  </${tabBarPanelComponentName}>
                </${tabBarContainerComponentName}>`
            } else {
              funcBody = `
                <${tabBarContainerComponentName}>

                  <${tabBarPanelComponentName}>
                    ${funcBody}
                  </${tabBarPanelComponentName}>

                  <${tabBarComponentName}
                    mode={${JSON.stringify(routerMode)}}
                    conf={this.state.${tabBarConfigName}}
                    homePage="${homePage}"
                    router={${taroImportDefaultName}}
                    basename={${basename}} />

                </${tabBarContainerComponentName}>`
            }
          }

          /* 插入<Provider /> */
          if (providerComponentName && storeName) {
            // 使用redux 或 mobx
            funcBody = `
              <${providorImportName} store={${storeName}}>
                ${funcBody}
              </${providorImportName}>`
          }

          /* 插入<Router /> */
          node.body = toAst(`{return (${funcBody});}`, { preserveComments: true })
        }

        if (tabBar && isComponentWillMount) {
          const initTabBarApisCallNode = toAst(`Taro.initTabBarApis(this, Taro)`)
          astPath.get('body').pushContainer('body', initTabBarApisCallNode)
        }

        if (hasConstructor && isConstructor) {
          astPath.get('body').pushContainer('body', additionalConstructorNode)
        }

        if (hasComponentDidShow && isComponentDidMount) {
          const componentDidShowCallNode = toAst(`this.componentDidShow()`)
          astPath.get('body').pushContainer('body', componentDidShowCallNode)
        }

        if (hasComponentDidHide && isComponentWillUnmount) {
          const componentDidHideCallNode = toAst(`this.componentDidHide()`)
          astPath.get('body').unshiftContainer('body', componentDidHideCallNode)
        }
      }
    },
    ClassProperty: {
      exit (astPath) {
        const node = astPath.node
        const key = node.key
        const value = node.value
        if (key.name !== 'state' || !t.isObjectExpression(value)) return
        astPath.node.value.properties.push(t.objectProperty(
          t.identifier(tabBarConfigName),
          tabBar
        ))
      }
    },
    ClassBody: {
      exit (astPath) {
        if (hasComponentDidShow && !hasComponentDidMount) {
          astPath.pushContainer('body', t.classMethod(
            'method', t.identifier('componentDidMount'), [],
            t.blockStatement([]), false, false))
        }
        if (hasComponentDidHide && !hasComponentWillUnmount) {
          astPath.pushContainer('body', t.classMethod(
            'method', t.identifier('componentWillUnmount'), [],
            t.blockStatement([]), false, false))
        }
        if (!hasConstructor) {
          astPath.pushContainer('body', t.classMethod(
            'method', t.identifier('constructor'), [t.identifier('props'), t.identifier('context')],
            t.blockStatement([toAst('super(props, context)'), additionalConstructorNode]), false, false))
        }
        if (tabBar) {
          if (!hasComponentWillMount) {
            astPath.pushContainer('body', t.classMethod(
              'method', t.identifier('componentWillMount'), [],
              t.blockStatement([]), false, false))
          }
          if (!hasState) {
            astPath.unshiftContainer('body', t.classProperty(
              t.identifier('state'),
              t.objectExpression([])
            ))
          }
        }
      }
    }
  }

  /**
   * ClassProperty使用的visitor
   * 负责收集config中的pages，收集tabbar的position，替换icon。
   */
  const classPropertyVisitor = {
    ObjectProperty (astPath) {
      const node = astPath.node
      const key = node.key
      const value = node.value
      const keyName = getObjKey(key)
      if (keyName === 'pages' && t.isArrayExpression(value)) {
        const subPackageParent = astPath.findParent(isUnderSubPackages)
        let root = ''
        if (subPackageParent) {
          /* 在subPackages属性下，说明是分包页面，需要处理root属性 */
          const rootNode = astPath.parent.properties.find(v => {
            return getObjKey(v.key) === 'root'
          })
          root = rootNode ? rootNode.value.value : ''
        }
        value.elements.forEach(v => {
          const pagePath = `${root}/${v.value}`.replace(/\/{2,}/g, '/')
          pages.push(pagePath.replace(/^\//, ''))
        })
      } else if (keyName === 'tabBar' && t.isObjectExpression(value)) {
        // tabBar
        tabBar = value
        value.properties.forEach(node => {
          if (node.keyName === 'position') tabbarPos = node.value.value
        })
      } else if ((keyName === 'iconPath' || keyName === 'selectedIconPath') && t.isStringLiteral(value)) {
        astPath.replaceWith(
          t.objectProperty(t.stringLiteral(keyName), t.callExpression(t.identifier('require'), [t.stringLiteral(`./${value.value}`)]))
        )
      }
    }
  }

  traverse(ast, {
    ClassExpression: ClassDeclarationOrExpression,
    ClassDeclaration: ClassDeclarationOrExpression,
    ClassProperty: {
      enter (astPath) {
        const node = astPath.node
        const key = node.key
        const value = node.value
        const keyName = getObjKey(key)

        if (keyName === 'state') hasState = true
        if (keyName !== 'config' || !t.isObjectExpression(value)) return
        astPath.traverse(classPropertyVisitor)
      }
    },
    ImportDeclaration: {
      enter (astPath) {
        const node = astPath.node
        const source = node.source
        const specifiers = node.specifiers
        let value = source.value
        if (Util.isAliasPath(value, pathAlias)) {
          source.value = value = Util.replaceAliasPath(filePath, value, pathAlias)
        }
        if (!Util.isNpmPkg(value)) {
          if (value.indexOf('.') === 0) {
            const pathArr = value.split('/')
            if (pathArr.indexOf('pages') >= 0) {
              astPath.remove()
            } else if (Util.REG_SCRIPTS.test(value)) {
              const realPath = path.resolve(filePath, '..', value)
              const dirname = path.dirname(realPath)
              const extname = path.extname(realPath)
              const removeExtPath = path.join(dirname, path.basename(realPath, extname))
              node.source = t.stringLiteral(Util.promoteRelativePath(path.relative(filePath, removeExtPath)).replace(/\\/g, '/'))
            }
          }
          return
        }
        if (value === PACKAGES['@tarojs/taro']) {
          let specifier = specifiers.find(item => item.type === 'ImportDefaultSpecifier')
          if (specifier) {
            hasAddNervJsImportDefaultName = true
            taroImportDefaultName = specifier.local.name
            specifier.local.name = nervJsImportDefaultName
          } else if (!hasAddNervJsImportDefaultName) {
            hasAddNervJsImportDefaultName = true
            node.specifiers.unshift(
              t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
            )
          }
          const taroApisSpecifiers = []
          const deletedIdx = []
          specifiers.forEach((item, index) => {
            if (item.imported && taroApis.indexOf(item.imported.name) >= 0) {
              taroApisSpecifiers.push(t.importSpecifier(t.identifier(item.local.name), t.identifier(item.imported.name)))
              deletedIdx.push(index)
            }
          })
          _.pullAt(specifiers, deletedIdx)
          source.value = PACKAGES['nervjs']

          if (taroApisSpecifiers.length) {
            astPath.insertBefore(t.importDeclaration(taroApisSpecifiers, t.stringLiteral(PACKAGES['@tarojs/taro-h5'])))
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
          source.value = PACKAGES['@tarojs/redux-h5']
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
          source.value = PACKAGES['@tarojs/mobx-h5']
        }
      }
    },
    CallExpression: {
      enter (astPath) {
        const node = astPath.node
        const callee = node.callee
        const calleeName = callee.name
        const parentPath = astPath.parentPath

        if (t.isMemberExpression(callee)) {
          if (callee.object.name === taroImportDefaultName && callee.property.name === 'render') {
            callee.object.name = nervJsImportDefaultName
            renderCallCode = generate(astPath.node).code
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
    },
    ClassMethod: {
      exit (astPath) {
        const node = astPath.node
        const key = node.key
        const keyName = getObjKey(key)
        if (keyName === 'constructor') {
          hasConstructor = true
        } else if (keyName === 'componentWillMount') {
          hasComponentWillMount = true
        } else if (keyName === 'componentDidMount') {
          hasComponentDidMount = true
        } else if (keyName === 'componentDidShow') {
          hasComponentDidShow = true
        } else if (keyName === 'componentDidHide') {
          hasComponentDidHide = true
        } else if (keyName === 'componentWillUnmount') {
          hasComponentWillUnmount = true
        }
      }
    },
    JSXElement: {
      enter (astPath) {
        hasJSX = true
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
        const importNervjsNode = t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
        const importRouterNode = toAst(`import { Router } from '${PACKAGES['@tarojs/router']}'`)
        const importTaroH5Node = toAst(`import ${taroImportDefaultName} from '${PACKAGES['@tarojs/taro-h5']}'`)
        const importComponentNode = toAst(`import { View, ${tabBarComponentName}, ${tabBarContainerComponentName}, ${tabBarPanelComponentName}} from '${PACKAGES['@tarojs/components']}'`)
        const lastImportIndex = _.findLastIndex(astPath.node.body, t.isImportDeclaration)
        const lastImportNode = astPath.get(`body.${lastImportIndex > -1 ? lastImportIndex : 0}`)
        const extraNodes = [
          importTaroH5Node,
          importRouterNode,
          initPxTransformNode
        ]

        astPath.traverse(programExitVisitor)

        if (hasJSX && !hasAddNervJsImportDefaultName) {
          extraNodes.unshift(importNervjsNode)
        }
        if (tabBar) {
          extraNodes.unshift(importComponentNode)
        }

        lastImportNode.insertAfter(extraNodes)
        if (renderCallCode) {
          const renderCallNode = toAst(renderCallCode)
          astPath.pushContainer('body', renderCallNode)
        }
      }
    }
  })
  const generateCode = generate(ast, {
    jsescOption: {
      minimal: true
    }
  }).code
  return {
    code: generateCode,
    ast
  }
}

function processOthers (code, filePath, fileType) {
  let ast = wxTransformer({
    code,
    sourcePath: filePath,
    isNormal: true,
    isTyped: Util.REG_TYPESCRIPT.test(filePath),
    adapter: 'h5'
  }).ast
  let taroImportDefaultName
  let hasAddNervJsImportDefaultName = false
  let hasJSX = false
  let isPage = fileType === FILE_TYPE.PAGE
  let hasComponentDidMount = false
  let hasComponentDidShow = false

  ast = babel.transformFromAst(ast, '', {
    plugins: [
      [require('babel-plugin-danger-remove-unused-import'), { ignore: ['@tarojs/taro', 'react', 'nervjs'] }]
    ]
  }).ast

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
          astPath.replaceWith(
            t.classExpression(
              t.identifier(renameComponentClassName),
              node.superClass,
              node.body,
              node.decorators || []
            )
          )
        }
      } else if (node.superClass.name === 'Component') {
        resetTSClassProperty(node.body.body)
        if (node.id === null) {
          const renameComponentClassName = '_TaroComponentClass'
          astPath.replaceWith(
            t.classExpression(
              t.identifier(renameComponentClassName),
              node.superClass,
              node.body,
              node.decorators || []
            )
          )
        }
      }
    }
  }

  const programExitVisitor = {
    ClassBody: {
      exit (astPath) {
        if (!hasComponentDidMount) {
          astPath.pushContainer('body', t.classMethod(
            'method', t.identifier('componentDidMount'), [],
            t.blockStatement([]), false, false))
        }
        if (!hasComponentDidShow) {
          astPath.pushContainer('body', t.classMethod(
            'method', t.identifier('componentDidShow'), [],
            t.blockStatement([]), false, false))
        }
      }
    }
  }

  traverse(ast, {
    ClassExpression: ClassDeclarationOrExpression,
    ClassDeclaration: ClassDeclarationOrExpression,
    ClassMethod: isPage ? {
      exit (astPath) {
        const node = astPath.node
        const key = node.key
        const keyName = getObjKey(key)
        if (keyName === 'componentDidMount') {
          hasComponentDidMount = true
        } else if (keyName === 'componentDidShow') {
          hasComponentDidShow = true
        }
      }
    } : {},
    ImportDeclaration: {
      enter (astPath) {
        const node = astPath.node
        const source = node.source
        let value = source.value
        const specifiers = node.specifiers
        if (Util.isAliasPath(value, pathAlias)) {
          source.value = value = Util.replaceAliasPath(filePath, value, pathAlias)
        }
        if (!Util.isNpmPkg(value)) {
          if (Util.REG_SCRIPTS.test(value)) {
            const realPath = path.resolve(filePath, '..', value)
            const dirname = path.dirname(realPath)
            const extname = path.extname(realPath)
            const removeExtPath = path.join(dirname, path.basename(realPath, extname))
            node.source = t.stringLiteral(Util.promoteRelativePath(path.relative(filePath, removeExtPath)).replace(/\\/g, '/'))
          }
        } else if (value === PACKAGES['@tarojs/taro']) {
          let specifier = specifiers.find(item => item.type === 'ImportDefaultSpecifier')
          if (specifier) {
            hasAddNervJsImportDefaultName = true
            taroImportDefaultName = specifier.local.name
            specifier.local.name = nervJsImportDefaultName
          } else if (!hasAddNervJsImportDefaultName) {
            hasAddNervJsImportDefaultName = true
            node.specifiers.unshift(
              t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
            )
          }
          const taroApisSpecifiers = []
          const deletedIdx = []
          specifiers.forEach((item, index) => {
            if (item.imported && taroApis.indexOf(item.imported.name) >= 0) {
              taroApisSpecifiers.push(t.importSpecifier(t.identifier(item.local.name), t.identifier(item.imported.name)))
              deletedIdx.push(index)
            }
          })
          _.pullAt(specifiers, deletedIdx)
          source.value = PACKAGES['nervjs']

          if (taroApisSpecifiers.length) {
            astPath.insertBefore(t.importDeclaration(taroApisSpecifiers, t.stringLiteral(PACKAGES['@tarojs/taro-h5'])))
          }
          if (!specifiers.length) {
            astPath.remove()
          }
        } else if (value === PACKAGES['@tarojs/redux']) {
          source.value = PACKAGES['@tarojs/redux-h5']
        } else if (value === PACKAGES['@tarojs/mobx']) {
          source.value = PACKAGES['@tarojs/mobx-h5']
        }
      }
    },
    JSXElement: {
      enter (astPath) {
        hasJSX = true
      }
    },
    Program: {
      exit (astPath) {
        if (isPage) {
          astPath.traverse(programExitVisitor)
        }
        const node = astPath.node
        if (hasJSX && !hasAddNervJsImportDefaultName) {
          node.body.unshift(
            t.importDeclaration([
              t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
            ], t.stringLiteral(PACKAGES['nervjs']))
          )
        }
        if (taroImportDefaultName) {
          const importTaro = toAst(`import ${taroImportDefaultName} from '${PACKAGES['@tarojs/taro-h5']}'`)
          node.body.unshift(importTaro)
        }
      }
    }
  })
  const generateCode = generate(ast, {
    jsescOption: {
      minimal: true
    }
  }).code
  return {
    code: generateCode,
    ast
  }
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
          const { left, right } = expr
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

function classifyFiles (filename) {
  const relPath = path.normalize(
    path.relative(appPath, filename)
  )
  if (path.relative(filename, entryFilePath) === '') return FILE_TYPE.ENTRY

  let relSrcPath = path.relative('src', relPath)
  relSrcPath = path.format({
    dir: path.dirname(relSrcPath),
    base: path.basename(relSrcPath, path.extname(relSrcPath))
  })

  const isPage = pages.some(page => {
    const relPage = path.normalize(
      path.relative(appPath, page)
    )
    if (path.relative(relPage, relSrcPath) === '') return true
  })

  if (isPage) {
    return FILE_TYPE.PAGE
  } else {
    return FILE_TYPE.NORMAL
  }
}

function getDist (filename, isScriptFile) {
  const dirname = path.dirname(filename)
  const distDirname = dirname.replace(sourcePath, tempDir)
  return isScriptFile
    ? path.format({
      dir: distDirname,
      ext: '.js',
      name: path.basename(filename, path.extname(filename))
    })
    : path.format({
      dir: distDirname,
      base: path.basename(filename)
    })
}

function processFiles (filePath) {
  const file = fs.readFileSync(filePath)
  const dirname = path.dirname(filePath)
  const extname = path.extname(filePath)
  const distDirname = dirname.replace(sourcePath, tempDir)
  const isScriptFile = Util.REG_SCRIPTS.test(extname)
  const distPath = getDist(filePath, isScriptFile)

  try {
    if (isScriptFile) {
      // 脚本文件 处理一下
      const fileType = classifyFiles(filePath)
      const content = file.toString()
      const transformResult = fileType === FILE_TYPE.ENTRY
        ? processEntry(content, filePath)
        : processOthers(content, filePath, fileType)
      const jsCode = transformResult.code
      fs.ensureDirSync(distDirname)
      fs.writeFileSync(distPath, Buffer.from(jsCode))
    } else {
      // 其他 直接复制
      fs.ensureDirSync(distDirname)
      fs.copySync(filePath, distPath)
    }
  } catch (e) {
    console.log(e)
  }
}

function watchFiles () {
  const watcher = chokidar.watch(path.join(sourcePath), {
    ignored: /(^|[/\\])\../,
    persistent: true,
    ignoreInitial: true
  })
  watcher
    .on('add', filePath => {
      pages = []
      const relativePath = path.relative(appPath, filePath)
      Util.printLog(Util.pocessTypeEnum.CREATE, '添加文件', relativePath)
      processFiles(filePath)
    })
    .on('change', filePath => {
      pages = []
      const relativePath = path.relative(appPath, filePath)
      Util.printLog(Util.pocessTypeEnum.MODIFY, '文件变动', relativePath)
      processFiles(filePath)
    })
    .on('unlink', filePath => {
      const relativePath = path.relative(appPath, filePath)
      const extname = path.extname(relativePath)
      const isScriptFile = Util.REG_SCRIPTS.test(extname)
      const dist = getDist(filePath, isScriptFile)
      Util.printLog(Util.pocessTypeEnum.UNLINK, '删除文件', relativePath)
      fs.unlinkSync(dist)
    })
}

function buildTemp () {
  fs.ensureDirSync(tempPath)
  return new Promise((resolve, reject) => {
    klaw(sourcePath)
      .on('data', file => {
        const relativePath = path.relative(appPath, file.path)
        if (!file.stats.isDirectory()) {
          Util.printLog(Util.pocessTypeEnum.CREATE, '发现文件', relativePath)
          processFiles(file.path)
        }
      })
      .on('end', () => {
        resolve()
      })
  })
}

async function buildDist (buildConfig) {
  const { watch } = buildConfig
  const entryFile = path.basename(entryFileName, path.extname(entryFileName)) + '.js'
  const sourceRoot = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
  h5Config.env = projectConfig.env
  Object.assign(h5Config.env, {
    TARO_ENV: JSON.stringify(Util.BUILD_TYPES.H5)
  })
  h5Config.defineConstants = projectConfig.defineConstants
  h5Config.plugins = projectConfig.plugins
  h5Config.designWidth = projectConfig.designWidth
  if (projectConfig.deviceRatio) {
    h5Config.deviceRatio = projectConfig.deviceRatio
  }
  h5Config.sourceRoot = sourceRoot
  h5Config.outputRoot = outputDir
  h5Config.entry = Object.assign({
    app: [path.join(tempPath, entryFile)]
  }, h5Config.entry)
  if (watch) {
    h5Config.isWatch = true
  }
  const webpackRunner = await npmProcess.getNpmPkg('@tarojs/webpack-runner')
  webpackRunner(h5Config)
}

const pRimraf = promisify(rimraf)

async function clean () {
  try {
    await pRimraf(tempPath)
    await pRimraf(outputPath)
  } catch (e) {
    console.log(e)
  }
}

function copyFileSync (from, to, options) {
  const filename = path.basename(from)
  if (fs.statSync(from).isFile() && !path.extname(to)) {
    fs.ensureDir(to)
    return fs.copySync(from, path.join(to, filename), options)
  }
  fs.ensureDir(path.dirname(to))
  return fs.copySync(from, to, options)
}

function copyFiles () {
  const copyConfig = projectConfig.copy || { patterns: [], options: {} }
  if (copyConfig.patterns && copyConfig.patterns.length) {
    copyConfig.options = copyConfig.options || {}
    const globalIgnore = copyConfig.options.ignore
    const projectDir = appPath
    copyConfig.patterns.forEach(pattern => {
      if (typeof pattern === 'object' && pattern.from && pattern.to) {
        const from = path.join(projectDir, pattern.from)
        const to = path.join(projectDir, pattern.to)
        let ignore = pattern.ignore || globalIgnore
        if (fs.existsSync(from)) {
          const copyOptions = {}
          if (ignore) {
            ignore = Array.isArray(ignore) ? ignore : [ignore]
            copyOptions.filter = src => {
              let isMatch = false
              ignore.forEach(iPa => {
                if (minimatch(path.basename(src), iPa)) {
                  isMatch = true
                }
              })
              return !isMatch
            }
          }
          copyFileSync(from, to, copyOptions)
        } else {
          Util.printLog(Util.pocessTypeEnum.ERROR, '拷贝失败', `${pattern.from} 文件不存在！`)
        }
      }
    })
  }
}

async function build (buildConfig) {
  process.env.TARO_ENV = Util.BUILD_TYPES.H5
  await clean()
  copyFiles()
  await buildTemp(buildConfig)
  await buildDist(buildConfig)
  if (buildConfig.watch) {
    watchFiles()
  }
}

module.exports = {
  build,
  buildTemp,
  processFiles
}
