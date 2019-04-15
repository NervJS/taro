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
const { source: toAst, obj: objToAst, toVariable: toVar } = require('./util/ast_convert')

const addLeadingSlash = path => path.charAt(0) === '/' ? path : '/' + path
const removeLeadingSlash = path => path.replace(/^\.?\//, '')
const stripTrailingSlash = path => path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path

const appPath = process.cwd()
const projectConfig = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
const h5Config = projectConfig.h5 || {}
const routerConfig = h5Config.router || {}
const routerMode = routerConfig.mode === 'browser' ? 'browser' : 'hash'
const customRoutes = routerConfig.customRoutes || {}
const routerBasename = addLeadingSlash(stripTrailingSlash(routerConfig.basename || '/'))
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

// const taroApis = [
//   'Component',
//   'PureComponent',
//   'getEnv',
//   'ENV_TYPE',
//   'eventCenter',
//   'Events',
//   'internal_safe_get',
//   'internal_dynamic_recursive'
// ]
const nervJsImportDefaultName = 'Nerv'
const tabBarComponentName = 'Tabbar'
const tabBarContainerComponentName = 'TabbarContainer'
const tabBarPanelComponentName = 'TabbarPanel'
const providerComponentName = 'Provider'
const setStoreFuncName = 'setStore'
const tabBarConfigName = '__tabs'
const DEVICE_RATIO = 'deviceRatio'

const MAP_FROM_COMPONENTNAME_TO_ID = new Map([
  ['Video', 'id'],
  ['Canvas', 'canvasId']
])
const APIS_NEED_TO_APPEND_THIS = new Map([
  ['createVideoContext', 1],
  ['createCanvasContext', 1],
  ['canvasGetImageData', 1],
  ['canvasPutImageData', 1],
  ['canvasToTempFilePath', 1]
])

if (projectConfig.hasOwnProperty(DEVICE_RATIO)) {
  pxTransformConfig[DEVICE_RATIO] = projectConfig.deviceRatio
}

let pages = []
// let appConfig = {}

const FILE_TYPE = {
  ENTRY: 'ENTRY',
  PAGE: 'PAGE',
  COMPONENT: 'COMPONENT',
  NORMAL: 'NORMAL'
}

const isUnderSubPackages = (parentPath) => (parentPath.isObjectProperty() && /subPackages|subpackages/i.test(toVar(parentPath.node.key)))

function createRoute ({ absPagename, relPagename, isIndex, chunkName = '' }) {
  const chunkNameComment = chunkName ? `/* webpackChunkName: "${chunkName}" */` : ''
  return `{
    path: '${absPagename}',
    componentLoader: () => import(${chunkNameComment}'${relPagename}'),
    isIndex: ${isIndex}
  }`
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

  let tabBar
  let tabbarPos
  let hasConstructor = false
  let hasComponentWillMount = false
  let hasComponentDidMount = false
  let hasComponentDidShow = false
  let hasComponentDidHide = false
  let hasComponentWillUnmount = false
  let hasJSX = false
  let hasNerv = false
  let hasState = false

  const initPxTransformNode = toAst(`Taro.initPxTransform(${JSON.stringify(pxTransformConfig)})`)
  const additionalConstructorNode = toAst(`Taro._$app = this`)

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
        node.superClass.object.name === taroImportDefaultName &&
        (node.superClass.property.name === 'Component' ||
        node.superClass.property.name === 'PureComponent')
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
      } else if (node.superClass.name === 'Component' ||
        node.superClass.name === 'PureComponent') {
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
        const keyName = toVar(key)
        let funcBody

        const isRender = keyName === 'render'
        const isComponentWillMount = keyName === 'componentWillMount'
        const isComponentDidMount = keyName === 'componentDidMount'
        const isComponentWillUnmount = keyName === 'componentWillUnmount'
        const isConstructor = keyName === 'constructor'

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

          funcBody = `
            <Router
              history={_taroHistory}
              routes={[${routes.join(',')}]}
              customRoutes={${JSON.stringify(customRoutes)}} />
            `

          /* 插入Tabbar */
          if (tabBar) {
            const homePage = pages[0] || ''
            if (tabbarPos === 'top') {
              funcBody = `
                <${tabBarContainerComponentName}>

                  <${tabBarComponentName}
                    conf={this.state.${tabBarConfigName}}
                    homePage="${homePage}"
                    tabbarPos={'top'}
                    router={${taroImportDefaultName}} />

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
                    conf={this.state.${tabBarConfigName}}
                    homePage="${homePage}"
                    router={${taroImportDefaultName}} />

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
            t.blockStatement([
              toAst('super.componentDidMount && super.componentDidMount()')
            ]), false, false))
        }
        if (hasComponentDidHide && !hasComponentWillUnmount) {
          astPath.pushContainer('body', t.classMethod(
            'method', t.identifier('componentWillUnmount'), [],
            t.blockStatement([
              toAst('super.componentWillUnmount && super.componentWillUnmount()')
            ]), false, false))
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
              t.blockStatement([
                toAst('super.componentWillMount && super.componentWillMount()')
              ]), false, false))
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
      const keyName = toVar(key)
      if (keyName === 'pages' && t.isArrayExpression(value)) {
        const subPackageParent = astPath.findParent(isUnderSubPackages)
        let root = ''
        if (subPackageParent) {
          /* 在subPackages属性下，说明是分包页面，需要处理root属性 */
          const rootNode = astPath.parent.properties.find(v => {
            return toVar(v.key) === 'root'
          })
          root = rootNode ? rootNode.value.value : ''
        }
        value.elements.forEach(v => {
          const pagePath = `${root}/${v.value}`.replace(/\/{2,}/g, '/')
          pages.push(removeLeadingSlash(pagePath))
          v.value = addLeadingSlash(v.value)
        })
      } else if (keyName === 'tabBar' && t.isObjectExpression(value)) {
        // tabBar相关处理
        tabBar = value
        value.properties.forEach(node => {
          switch (node.key.name) {
            case 'position':
              tabbarPos = node.value.value
              break
            case 'list':
              t.isArrayExpression(node.value) && node.value.elements.forEach(v => {
                v.properties.forEach(property => {
                  switch (property.key.name) {
                    case 'iconPath':
                    case 'selectedIconPath':
                      if (t.isStringLiteral(property.value)) {
                        property.value = t.callExpression(
                          t.identifier('require'),
                          [t.stringLiteral(`./${property.value.value}`)]
                        )
                      }
                      break
                    case 'pagePath':
                      property.value.value = addLeadingSlash(property.value.value)
                      break
                  }
                })
              })
          }
        })
        value.properties.push(t.ObjectProperty(
          t.identifier('mode'),
          t.stringLiteral(routerMode)
        ))
        value.properties.push(t.ObjectProperty(
          t.identifier('basename'),
          t.stringLiteral(routerBasename)
        ))
        value.properties.push(t.ObjectProperty(
          t.identifier('customRoutes'),
          t.objectExpression(objToAst(customRoutes))
        ))
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
        const keyName = toVar(key)

        if (keyName === 'state') {
          hasState = true
        } else if (keyName === 'config') {
          // appConfig = toVar(node.value)
          astPath.traverse(classPropertyVisitor)
        }
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
            } else if (Util.REG_SCRIPTS.test(value) || path.extname(value) === '') {
              const absolutePath = path.resolve(filePath, '..', value)
              const dirname = path.dirname(absolutePath)
              const extname = path.extname(absolutePath)
              const realFilePath = Util.resolveScriptPath(path.join(dirname, path.basename(absolutePath, extname)))
              const removeExtPath = realFilePath.replace(path.extname(realFilePath), '')
              node.source = t.stringLiteral(Util.promoteRelativePath(path.relative(filePath, removeExtPath)).replace(/\\/g, '/'))
            }
          }
          return
        }
        if (value === PACKAGES['@tarojs/taro']) {
          source.value = PACKAGES['@tarojs/taro-h5']
          const specifier = specifiers.find(item => t.isImportDefaultSpecifier(item))
          if (specifier) {
            taroImportDefaultName = toVar(specifier.local)
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
        } else if (value === PACKAGES['nervjs']) {
          hasNerv = true
          let defaultSpecifier = specifiers.find(item => t.isImportDefaultSpecifier(item))
          if (!defaultSpecifier) {
            specifiers.unshift(
              t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
            )
          }
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
        const keyName = toVar(key)
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
        const importRouterNode = toAst(`import { Router, createHistory, mountApis } from '${PACKAGES['@tarojs/router']}'`)
        const importComponentNode = toAst(`import { View, ${tabBarComponentName}, ${tabBarContainerComponentName}, ${tabBarPanelComponentName}} from '${PACKAGES['@tarojs/components']}'`)
        const lastImportIndex = _.findLastIndex(astPath.node.body, t.isImportDeclaration)
        const lastImportNode = astPath.get(`body.${lastImportIndex > -1 ? lastImportIndex : 0}`)
        const createHistoryNode = toAst(`
          const _taroHistory = createHistory({
            mode: "${routerMode}",
            basename: "${routerBasename}",
            customRoutes: ${JSON.stringify(customRoutes)},
            firstPagePath: "${addLeadingSlash(pages[0])}"
          });
        `)
        const mountApisNode = toAst(`mountApis(_taroHistory);`)
        const extraNodes = [
          importRouterNode,
          initPxTransformNode,
          createHistoryNode,
          mountApisNode
        ]

        astPath.traverse(programExitVisitor)

        if (hasJSX && !hasNerv) {
          extraNodes.unshift(
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))],
              t.stringLiteral(PACKAGES['nervjs'])
            )
          )
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
  const componentnameMap = new Map()
  const taroapiMap = new Map()
  let ast = wxTransformer({
    code,
    sourcePath: filePath,
    isNormal: true,
    isTyped: Util.REG_TYPESCRIPT.test(filePath),
    adapter: 'h5'
  }).ast
  let taroImportDefaultName
  let hasJSX = false
  let hasNerv = false
  let isPage = fileType === FILE_TYPE.PAGE
  let hasComponentDidMount = false
  let hasComponentDidShow = false
  let hasComponentDidHide = false
  let hasOnPageScroll = false
  let hasOnReachBottom = false
  let hasOnPullDownRefresh = false
  let pageConfig = {}

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
        node.superClass.object.name === taroImportDefaultName &&
        (node.superClass.property.name === 'Component' ||
        node.superClass.property.name === 'PureComponent')
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
      } else if (node.superClass.name === 'Component' ||
        node.superClass.name === 'PureComponent') {
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
    ImportDeclaration: {
      exit (astPath) {
        const node = astPath.node
        const specifiers = node.specifiers
        if (toVar(node.source) !== PACKAGES['@tarojs/components']) return
        if (hasOnPullDownRefresh) {
          const pos = specifiers.findIndex(specifier => {
            if (!specifier.imported) return false
            const importedComponent = toVar(specifier.imported)
            return importedComponent === 'PullDownRefresh'
          })
          if (pos === -1) {
            specifiers.push(
              t.importSpecifier(
                t.identifier('PullDownRefresh'),
                t.identifier('PullDownRefresh')
              )
            )
          }
        }
      }
    },
    ClassBody: {
      exit (astPath) {
        if (!hasComponentDidMount) {
          astPath.pushContainer('body', t.classMethod(
            'method', t.identifier('componentDidMount'), [],
            t.blockStatement([
              toAst('super.componentDidMount && super.componentDidMount()')
            ]), false, false))
        }
        if (!hasComponentDidShow) {
          astPath.pushContainer('body', t.classMethod(
            'method', t.identifier('componentDidShow'), [],
            t.blockStatement([
              toAst('super.componentDidShow && super.componentDidShow()')
            ]), false, false))
        }
        if (!hasComponentDidHide) {
          astPath.pushContainer('body', t.classMethod(
            'method', t.identifier('componentDidHide'), [],
            t.blockStatement([
              toAst('super.componentDidHide && super.componentDidHide()')
            ]), false, false))
        }
      }
    },
    ClassMethod: {
      exit (astPath) {
        const node = astPath.node
        const key = node.key
        const keyName = toVar(key)
        if (hasOnReachBottom) {
          if (keyName === 'componentDidShow') {
            node.body.body.push(
              toAst(`
                this._offReachBottom = Taro.onReachBottom({
                  callback: this.onReachBottom,
                  ctx: this,
                  onReachBottomDistance: ${JSON.stringify(pageConfig.onReachBottomDistance)}
                })
              `)
            )
          } else if (keyName === 'componentDidHide') {
            node.body.body.push(
              toAst('this._offReachBottom && this._offReachBottom()')
            )
          }
        }
        if (hasOnPageScroll) {
          if (keyName === 'componentDidShow') {
            node.body.body.push(
              toAst('this._offPageScroll = Taro.onPageScroll({ callback: this.onPageScroll, ctx: this })')
            )
          } else if (keyName === 'componentDidHide') {
            node.body.body.push(
              toAst('this._offPageScroll && this._offPageScroll()')
            )
          }
        }
        if (hasOnPullDownRefresh) {
          if (keyName === 'componentDidShow') {
            node.body.body.push(
              toAst(`
                this.pullDownRefreshRef && this.pullDownRefreshRef.bindEvent()
              `)
            )
          }
          if (keyName === 'componentDidHide') {
            node.body.body.push(
              toAst(`
                this.pullDownRefreshRef && this.pullDownRefreshRef.unbindEvent()
              `)
            )
          }
          if (keyName === 'render') {
            astPath.traverse({
              ReturnStatement: {
                exit (returnAstPath) {
                  const statement = returnAstPath.node
                  const varName = returnAstPath.scope.generateUid()
                  const returnValue = statement.argument
                  const pullDownRefreshNode = t.variableDeclaration(
                    'const',
                    [t.variableDeclarator(
                      t.identifier(varName),
                      returnValue
                    )]
                  )
                  returnAstPath.insertBefore(pullDownRefreshNode)
                  statement.argument = toAst(`
                    <PullDownRefresh
                      onRefresh={this.onPullDownRefresh && this.onPullDownRefresh.bind(this)}
                      ref={ref => {
                        if (ref) this.pullDownRefreshRef = ref
                    }}>{${varName}}</PullDownRefresh>`).expression
                }
              }
            })
          }
        }
      }
    }
  }

  const getComponentId = (componentName, node) => {
    const idAttrName = MAP_FROM_COMPONENTNAME_TO_ID.get(componentName)
    return node.attributes.reduce((prev, attribute) => {
      if (prev) return prev
      const attrName = toVar(attribute.name)
      if (attrName === idAttrName) return toVar(attribute.value)
      else return false
    }, false)
  }
  const getComponentRef = node => {
    return node.attributes.find(attribute => {
      return toVar(attribute.name) === 'ref'
    })
  }
  const createRefFunc = componentId => {
    return t.arrowFunctionExpression(
      [t.identifier('ref')],
      t.blockStatement([
        toAst(`this['__taroref_${componentId}'] = ref`)
      ])
    )
  }

  traverse(ast, {
    ClassExpression: ClassDeclarationOrExpression,
    ClassDeclaration: ClassDeclarationOrExpression,
    ClassProperty: isPage ? {
      enter (astPath) {
        const node = astPath.node
        const key = toVar(node.key)
        if (key === 'config') {
          pageConfig = toVar(node.value)
        }
      }
    } : {},
    ClassMethod: isPage ? {
      exit (astPath) {
        const node = astPath.node
        const key = node.key
        const keyName = toVar(key)
        if (keyName === 'componentDidMount') {
          hasComponentDidMount = true
        } else if (keyName === 'componentDidShow') {
          hasComponentDidShow = true
        } else if (keyName === 'componentDidHide') {
          hasComponentDidHide = true
        } else if (keyName === 'onPageScroll') {
          hasOnPageScroll = true
        } else if (keyName === 'onReachBottom') {
          hasOnReachBottom = true
        } else if (keyName === 'onPullDownRefresh') {
          hasOnPullDownRefresh = true
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
          if (Util.REG_SCRIPTS.test(value) || path.extname(value) === '') {
            const absolutePath = path.resolve(filePath, '..', value)
            const dirname = path.dirname(absolutePath)
            const extname = path.extname(absolutePath)
            const realFilePath = Util.resolveScriptPath(path.join(dirname, path.basename(absolutePath, extname)))
            const removeExtPath = realFilePath.replace(path.extname(realFilePath), '')
            node.source = t.stringLiteral(Util.promoteRelativePath(path.relative(filePath, removeExtPath)).replace(/\\/g, '/'))
          }
        } else if (value === PACKAGES['@tarojs/taro']) {
          source.value = PACKAGES['@tarojs/taro-h5']
          specifiers.forEach(specifier => {
            if (t.isImportDefaultSpecifier(specifier)) {
              taroImportDefaultName = toVar(specifier.local)
            } else if (t.isImportSpecifier(specifier)) {
              taroapiMap.set(toVar(specifier.local), toVar(specifier.imported))
            }
          })
        } else if (value === PACKAGES['@tarojs/redux']) {
          source.value = PACKAGES['@tarojs/redux-h5']
        } else if (value === PACKAGES['@tarojs/mobx']) {
          source.value = PACKAGES['@tarojs/mobx-h5']
        } else if (value === PACKAGES['@tarojs/components']) {
          node.specifiers.forEach(specifier => {
            if (t.isImportDefaultSpecifier(specifier)) return
            componentnameMap.set(toVar(specifier.local), toVar(specifier.imported))
          })
        } else if (value === PACKAGES['nervjs']) {
          hasNerv = true
          let defaultSpecifier = specifiers.find(item => t.isImportDefaultSpecifier(item))
          if (!defaultSpecifier) {
            specifiers.unshift(
              t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
            )
          }
        }
      }
    },
    JSXOpeningElement: {
      exit (astPath) {
        hasJSX = true
        const node = astPath.node
        const componentName = componentnameMap.get(toVar(node.name))
        const componentId = getComponentId(componentName, node)
        const componentRef = getComponentRef(node)

        if (!componentId) return
        const refFunc = createRefFunc(componentId)

        if (componentRef) {
          const expression = componentRef.value.expression
          refFunc.body.body.unshift(
            t.callExpression(expression, [t.identifier('ref')])
          )
          componentRef.value.expression = refFunc
        } else {
          node.attributes.push(
            t.jSXAttribute(
              t.jSXIdentifier('ref'),
              t.jSXExpressionContainer(refFunc)
            )
          )
        }
      }
    },
    CallExpression: {
      exit (astPath) {
        const node = astPath.node
        const callee = node.callee
        let needToAppendThis = false
        let funcName = ''
        if (t.isMemberExpression(callee)) {
          const objName = toVar(callee.object)
          const tmpFuncName = toVar(callee.property)
          if (objName === taroImportDefaultName && APIS_NEED_TO_APPEND_THIS.has(tmpFuncName)) {
            needToAppendThis = true
            funcName = tmpFuncName
          }
        } else if (t.isIdentifier(callee)) {
          const tmpFuncName = toVar(callee)
          const oriFuncName = taroapiMap.get(tmpFuncName)
          if (APIS_NEED_TO_APPEND_THIS.has(oriFuncName)) {
            needToAppendThis = true
            funcName = oriFuncName
          }
        }
        if (needToAppendThis) {
          const thisOrder = APIS_NEED_TO_APPEND_THIS.get(funcName)
          if (!node.arguments[thisOrder]) {
            node.arguments[thisOrder] = t.thisExpression()
          }
        }
      }
    },
    Program: {
      exit (astPath) {
        if (isPage) {
          astPath.traverse(programExitVisitor)
        }
        const node = astPath.node
        if (hasJSX && !hasNerv) {
          node.body.unshift(
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))],
              t.stringLiteral(PACKAGES['nervjs'])
            )
          )
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
      let transformResult
      if (fileType === FILE_TYPE.ENTRY) {
        pages = []
        transformResult = processEntry(content, filePath)
      } else {
        transformResult = processOthers(content, filePath, fileType)
      }
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
      const relativePath = path.relative(appPath, filePath)
      Util.printLog(Util.pocessTypeEnum.CREATE, '添加文件', relativePath)
      processFiles(filePath)
    })
    .on('change', filePath => {
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
