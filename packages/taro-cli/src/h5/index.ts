import { PageConfig } from '@tarojs/taro'
import * as wxTransformer from '@tarojs/transformer-wx'
import * as babel from 'babel-core'
import traverse, { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import generate from 'better-babel-generator'
import * as chokidar from 'chokidar'
import * as fs from 'fs-extra'
import * as klaw from 'klaw'
import { findLastIndex, merge } from 'lodash'
import * as path from 'path'

import CONFIG from '../config'
import {
  isAliasPath,
  isNpmPkg,
  mergeVisitors,
  printLog,
  promoteRelativePath,
  recursiveMerge,
  replaceAliasPath,
  resolveScriptPath
} from '../util'
import {
  convertAstExpressionToVariable as toVar,
  convertObjectToAstExpression as objToAst,
  convertSourceStringToAstExpression as toAst
} from '../util/astConvert'
import { BUILD_TYPES, processTypeEnum, PROJECT_CONFIG, REG_SCRIPTS, REG_TYPESCRIPT } from '../util/constants'
import * as npmProcess from '../util/npm'
import { IBuildConfig } from '../util/types'
import {
  APIS_NEED_TO_APPEND_THIS,
  deviceRatioConfigName,
  FILE_TYPE,
  MAP_FROM_COMPONENTNAME_TO_ID,
  nervJsImportDefaultName,
  providerComponentName,
  setStoreFuncName,
  tabBarComponentName,
  tabBarConfigName,
  tabBarContainerComponentName,
  tabBarPanelComponentName
} from './constants'
import {
  addLeadingSlash,
  createRoute,
  isUnderSubPackages,
  pRimraf,
  removeLeadingSlash,
  resetTSClassProperty,
  stripTrailingSlash
} from './helper'

class Compiler {
  projectConfig
  h5Config
  routerConfig
  appPath: string
  routerMode: string
  customRoutes: {
    [key: string]: string
  }
  routerBasename: string
  sourceRoot: string
  sourcePath: string
  outputPath: string
  outputDir: string
  tempDir: string
  tempPath: string
  entryFilePath: string
  entryFileName: string
  pxTransformConfig
  pathAlias
  pages: string[] = []

  constructor (appPath) {
    const projectConfig = recursiveMerge({
      h5: {
        router: {
          mode: 'hash',
          customRoutes: {}
        }
      }
    }, require(path.join(appPath, PROJECT_CONFIG))(merge))
    this.projectConfig = projectConfig
    const sourceDir = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
    this.sourceRoot = sourceDir
    const outputDir = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
    this.outputDir = outputDir
    this.h5Config = projectConfig.h5
    const routerConfig = this.h5Config.router

    this.appPath = appPath
    this.routerMode = routerConfig.mode
    this.customRoutes = routerConfig.customRoutes
    this.routerBasename = addLeadingSlash(stripTrailingSlash(routerConfig.basename || '/'))
    this.sourcePath = path.join(appPath, sourceDir)
    this.outputPath = path.join(appPath, outputDir)
    this.tempDir = CONFIG.TEMP_DIR
    this.tempPath = path.join(appPath, this.tempDir)
    this.entryFilePath = resolveScriptPath(path.join(this.sourcePath, CONFIG.ENTRY))
    this.entryFileName = path.basename(this.entryFilePath)
    this.pathAlias = projectConfig.alias || {}
    this.pxTransformConfig = { designWidth: projectConfig.designWidth || 750 }
    if (projectConfig.hasOwnProperty(deviceRatioConfigName)) {
      this.pxTransformConfig.deviceRatio = projectConfig.deviceRatio
    }
  }

  async clean () {
    const tempPath = this.tempPath
    const outputPath = this.outputPath
    try {
      await pRimraf(tempPath)
      await pRimraf(outputPath)
    } catch (e) {
      console.log(e)
    }
  }

  copyFiles () {}

  classifyFiles (filename) {
    const pages = this.pages
    const appPath = this.appPath
    const entryFilePath = this.entryFilePath

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
      return false
    })

    if (isPage) {
      return FILE_TYPE.PAGE
    } else {
      return FILE_TYPE.NORMAL
    }
  }

  buildTemp () {
    const tempPath = this.tempPath
    const sourcePath = this.sourcePath
    const appPath = this.appPath

    fs.ensureDirSync(tempPath)
    return new Promise((resolve, reject) => {
      klaw(sourcePath)
        .on('data', file => {
          const relativePath = path.relative(appPath, file.path)
          if (!file.stats.isDirectory()) {
            printLog(processTypeEnum.CREATE, '发现文件', relativePath)
            this.processFiles(file.path)
          }
        })
        .on('end', () => {
          resolve()
        })
    })
  }

  async buildDist ({ watch, port }: IBuildConfig) {
    const entryFileName = this.entryFileName
    const projectConfig = this.projectConfig
    const h5Config = this.h5Config
    const outputDir = this.outputDir
    const sourceRoot = this.sourceRoot
    const tempPath = this.tempPath

    const entryFile = path.basename(entryFileName, path.extname(entryFileName)) + '.js'
    // const sourceRoot = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
    if (projectConfig.deviceRatio) {
      h5Config.deviceRatio = projectConfig.deviceRatio
    }
    if (projectConfig.env) {
      h5Config.env = projectConfig.env
    }
    recursiveMerge(h5Config, {
      copy: projectConfig.copy,
      defineConstants: projectConfig.defineConstants,
      designWidth: projectConfig.designWidth,
      entry: {
        app: [path.join(tempPath, entryFile)]
      },
      env: {
        TARO_ENV: JSON.stringify(BUILD_TYPES.H5)
      },
      isWatch: !!watch,
      outputRoot: outputDir,
      plugins: projectConfig.plugins,
      port,
      sourceRoot
    })

    const webpackRunner = await npmProcess.getNpmPkg('@tarojs/webpack-runner', this.appPath)
    webpackRunner(this.appPath, h5Config)
  }

  watchFiles () {
    const sourcePath = this.sourcePath
    const appPath = this.appPath
    const watcher = chokidar.watch(path.join(sourcePath), {
      ignored: /(^|[/\\])\../,
      persistent: true,
      ignoreInitial: true
    })
    watcher
      .on('add', filePath => {
        const relativePath = path.relative(appPath, filePath)
        printLog(processTypeEnum.CREATE, '添加文件', relativePath)
        this.processFiles(filePath)
      })
      .on('change', filePath => {
        const relativePath = path.relative(appPath, filePath)
        printLog(processTypeEnum.MODIFY, '文件变动', relativePath)
        this.processFiles(filePath)
      })
      .on('unlink', filePath => {
        const relativePath = path.relative(appPath, filePath)
        const extname = path.extname(relativePath)
        const distDirname = this.getTempDir(filePath)
        const isScriptFile = REG_SCRIPTS.test(extname)
        const dist = this.getDist(distDirname, filePath, isScriptFile)
        printLog(processTypeEnum.UNLINK, '删除文件', relativePath)
        fs.unlinkSync(dist)
      })
  }

  processEntry (code, filePath) {
    const pages = this.pages
    const routerMode = this.routerMode
    const routerBasename = this.routerBasename
    const customRoutes = this.customRoutes
    const pathAlias = this.pathAlias
    const pxTransformConfig = this.pxTransformConfig

    let ast = wxTransformer({
      code,
      sourcePath: filePath,
      isNormal: true,
      isTyped: REG_TYPESCRIPT.test(filePath),
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
    let hasNerv = false
    let stateNode: t.ClassProperty

    const initPxTransformNode = toAst(`Taro.initPxTransform(${JSON.stringify(pxTransformConfig)})`)
    const additionalConstructorNode = toAst(`Taro._$app = this`)
    const callComponentDidShowNode = toAst(`this.componentDidShow()`)
    const callComponentDidHideNode = toAst(`this.componentDidHide()`)
    const initTabbarApiNode = toAst(`Taro.initTabBarApis(this, Taro)`)

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
        exit (astPath: NodePath<t.ClassMethod>) {
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
                      tabbarPos={'top'} />

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
            node.body.body.push(initTabbarApiNode)
          }

          if (hasConstructor && isConstructor) {
            node.body.body.push(additionalConstructorNode)
          }

          if (hasComponentDidShow && isComponentDidMount) {
            node.body.body.push(callComponentDidShowNode)
          }

          if (hasComponentDidHide && isComponentWillUnmount) {
            node.body.body.unshift(callComponentDidHideNode)
          }
        }
      },
      ClassBody: {
        exit (astPath: NodePath<t.ClassBody>) {
          const node = astPath.node
          if (hasComponentDidShow && !hasComponentDidMount) {
            node.body.push(t.classMethod(
              'method', t.identifier('componentDidMount'), [],
              t.blockStatement([callComponentDidShowNode]), false, false))
          }
          if (hasComponentDidHide && !hasComponentWillUnmount) {
            node.body.push(t.classMethod(
              'method', t.identifier('componentWillUnmount'), [],
              t.blockStatement([callComponentDidHideNode]), false, false))
          }
          if (!hasConstructor) {
            node.body.push(t.classMethod(
              'method', t.identifier('constructor'), [t.identifier('props'), t.identifier('context')],
              t.blockStatement([toAst('super(props, context)'), additionalConstructorNode] as t.Statement[]), false, false))
          }
          if (tabBar) {
            if (!hasComponentWillMount) {
              node.body.push(t.classMethod(
                'method', t.identifier('componentWillMount'), [],
                t.blockStatement([initTabbarApiNode]), false, false))
            }
            if (!stateNode) {
              stateNode = t.classProperty(
                t.identifier('state'),
                t.objectExpression([])
              )
              node.body.unshift(stateNode)
            }
            if (t.isObjectExpression(stateNode.value)) {
              stateNode.value.properties.push(t.objectProperty(
                t.identifier(tabBarConfigName),
                tabBar
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
      ObjectProperty (astPath: NodePath<t.ObjectProperty>) {
        const node = astPath.node
        const key = node.key
        const value = node.value
        const keyName = toVar(key)
        if (keyName === 'pages' && t.isArrayExpression(value)) {
          const subPackageParent = astPath.findParent(isUnderSubPackages)
          let root = ''
          if (subPackageParent) {
            /* 在subPackages属性下，说明是分包页面，需要处理root属性 */
            const parent = astPath.parent as t.ObjectExpression
            const rootNode = parent.properties.find(v => {
              if (t.isSpreadProperty(v)) return false
              return toVar(v.key) === 'root'
            }) as t.ObjectProperty
            root = rootNode ? toVar(rootNode.value) : ''
          }
          (value.elements as t.StringLiteral[]).forEach(v => {
            const pagePath = `${root}/${v.value}`.replace(/\/{2,}/g, '/')
            pages.push(removeLeadingSlash(pagePath))
            v.value = addLeadingSlash(v.value)
          })
        } else if (keyName === 'tabBar' && t.isObjectExpression(value)) {
          // tabBar相关处理
          tabBar = value
          value.properties.forEach((node) => {
            if (t.isSpreadProperty(node)) return
            switch (toVar(node.key)) {
              case 'position':
                tabbarPos = toVar(node.value)
                break
              case 'list':
                t.isArrayExpression(node.value) && node.value.elements.forEach(v => {
                  if (!t.isObjectExpression(v)) return
                  v.properties.forEach(property => {
                    if (!t.isObjectProperty(property)) return
                    switch (toVar(property.key)) {
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
                        property.value = t.stringLiteral(addLeadingSlash(toVar(property.value)))
                        break
                    }
                  })
                })
            }
          })
          value.properties.push(t.objectProperty(
            t.identifier('mode'),
            t.stringLiteral(routerMode)
          ))
          value.properties.push(t.objectProperty(
            t.identifier('basename'),
            t.stringLiteral(routerBasename)
          ))
          value.properties.push(t.objectProperty(
            t.identifier('customRoutes'),
            t.objectExpression(objToAst(customRoutes))
          ))
        }
      }
    }

    // require('fs').writeFileSync('./ast.json', JSON.stringify(ast, null, 2))
    traverse(ast, {
      ClassExpression: ClassDeclarationOrExpression,
      ClassDeclaration: ClassDeclarationOrExpression,
      ClassProperty: {
        enter (astPath: NodePath<t.ClassProperty>) {
          const node = astPath.node
          const key = node.key
          const keyName = toVar(key)

          if (keyName === 'state') {
            stateNode = node
          } else if (keyName === 'config') {
            // appConfig = toVar(node.value)
            astPath.traverse(classPropertyVisitor)
          }
        }
      },
      ImportDeclaration: {
        enter (astPath: NodePath<t.ImportDeclaration>) {
          const node = astPath.node
          const source = node.source
          const specifiers = node.specifiers
          let value = source.value
          if (isAliasPath(value, pathAlias)) {
            source.value = value = replaceAliasPath(filePath, value, pathAlias)
          }
          if (!isNpmPkg(value)) {
            if (value.indexOf('.') === 0) {
              const pathArr = value.split('/')
              if (pathArr.indexOf('pages') >= 0) {
                astPath.remove()
              } else if (REG_SCRIPTS.test(value) || path.extname(value) === '') {
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
          if (value === '@tarojs/taro') {
            source.value = '@tarojs/taro-h5'
            const specifier = specifiers.find(item => t.isImportDefaultSpecifier(item))
            if (specifier) {
              taroImportDefaultName = toVar(specifier.local)
            }
          } else if (value === '@tarojs/redux') {
            const specifier = specifiers.find(item => {
              return t.isImportSpecifier(item) && item.imported.name === providerComponentName
            })
            if (specifier) {
              providorImportName = specifier.local.name
            } else {
              providorImportName = providerComponentName
              specifiers.push(t.importSpecifier(t.identifier(providerComponentName), t.identifier(providerComponentName)))
            }
            source.value = '@tarojs/redux-h5'
          } else if (value === '@tarojs/mobx') {
            const specifier = specifiers.find(item => {
              return t.isImportSpecifier(item) && item.imported.name === providerComponentName
            })
            if (specifier) {
              providorImportName = specifier.local.name
            } else {
              providorImportName = providerComponentName
              specifiers.push(t.importSpecifier(t.identifier(providerComponentName), t.identifier(providerComponentName)))
            }
            source.value = '@tarojs/mobx-h5'
          } else if (value === 'nervjs') {
            hasNerv = true
            const defaultSpecifier = specifiers.find(item => t.isImportDefaultSpecifier(item))
            if (!defaultSpecifier) {
              specifiers.unshift(
                t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
              )
            }
          }
        }
      },
      CallExpression: {
        enter (astPath: NodePath<t.CallExpression>) {
          const node = astPath.node
          const callee = node.callee
          const calleeName = toVar(callee)
          const parentPath = astPath.parentPath

          if (t.isMemberExpression(callee)) {
            const object = callee.object as t.Identifier
            const property = callee.property as t.Identifier
            if (object.name === taroImportDefaultName && property.name === 'render') {
              object.name = nervJsImportDefaultName
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
        exit (astPath: NodePath<t.ClassMethod>) {
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
      JSXOpeningElement: {
        enter (astPath: NodePath<t.JSXOpeningElement>) {
          const node = astPath.node
          if (toVar(node.name) === 'Provider') {
            for (const v of node.attributes) {
              if (v.name.name !== 'store') continue
              if (!t.isJSXExpressionContainer(v.value)) return
              storeName = toVar(v.value.expression)
              break
            }
          }
        }
      },
      Program: {
        exit (astPath: NodePath<t.Program>) {
          const node = astPath.node
          const importRouterNode = toAst(`import { Router, createHistory, mountApis } from '${'@tarojs/router'}'`)
          const importComponentNode = toAst(`import { View, ${tabBarComponentName}, ${tabBarContainerComponentName}, ${tabBarPanelComponentName}} from '${'@tarojs/components'}'`)
          const lastImportIndex = findLastIndex(astPath.node.body, t.isImportDeclaration)
          const lastImportNode = astPath.get(`body.${lastImportIndex > -1 ? lastImportIndex : 0}`) as NodePath<babel.types.Node>
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

          /* Taro.render(<App />) 会被移除，导致hasJSX判断错误 */
          if (!hasNerv) {
            extraNodes.unshift(
              t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))],
                t.stringLiteral('nervjs')
              )
            )
          }
          if (tabBar) {
            extraNodes.unshift(importComponentNode)
          }

          lastImportNode.insertAfter(extraNodes)
          if (renderCallCode) {
            const renderCallNode = toAst(renderCallCode)
            node.body.push(renderCallNode)
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

  processOthers (code, filePath, fileType) {
    const pathAlias = this.pathAlias

    const componentnameMap = new Map()
    const taroapiMap = new Map()
    const isPage = fileType === FILE_TYPE.PAGE
    let ast = wxTransformer({
      code,
      sourcePath: filePath,
      isNormal: true,
      isTyped: REG_TYPESCRIPT.test(filePath),
      adapter: 'h5'
    }).ast
    let taroImportDefaultName
    let hasJSX = false
    let hasOnPageScroll = false
    let hasOnReachBottom = false
    let hasOnPullDownRefresh = false
    let pageConfig: PageConfig = {}
    let componentDidMountNode: t.ClassMethod
    let componentDidShowNode: t.ClassMethod
    let componentDidHideNode: t.ClassMethod
    let importTaroComponentNode: t.ImportDeclaration
    let importNervNode: t.ImportDeclaration
    let importTaroNode: t.ImportDeclaration
    let renderClassMethodNode: t.ClassMethod

    const renderReturnStatementPaths: NodePath<t.ReturnStatement>[] = []

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

    const getComponentId = (componentName: string, node: t.JSXOpeningElement) => {
      const idAttrName = MAP_FROM_COMPONENTNAME_TO_ID.get(componentName)
      return node.attributes.reduce((prev, attribute) => {
        if (prev) return prev
        const attrName = toVar(attribute.name)
        if (attrName === idAttrName) return toVar(attribute.value)
        else return false
      }, false)
    }
    const getComponentRef = (node: t.JSXOpeningElement) => {
      return node.attributes.find(attribute => {
        return toVar(attribute.name) === 'ref'
      })
    }
    const createRefFunc = (componentId: string) => {
      return t.arrowFunctionExpression(
        [t.identifier('ref')],
        t.blockStatement([
          toAst(`this['__taroref_${componentId}'] = ref`) as t.Statement
        ])
      )
    }

    const defaultVisitor = {
      ClassExpression: ClassDeclarationOrExpression,
      ClassDeclaration: ClassDeclarationOrExpression,
      ImportDeclaration: {
        enter (astPath: NodePath<t.ImportDeclaration>) {
          const node = astPath.node
          const source = node.source
          let value = source.value
          const specifiers = node.specifiers
          if (isAliasPath(value, pathAlias)) {
            source.value = value = replaceAliasPath(filePath, value, pathAlias)
          }
          if (!isNpmPkg(value)) {
            if (REG_SCRIPTS.test(value) || path.extname(value) === '') {
              const absolutePath = path.resolve(filePath, '..', value)
              const dirname = path.dirname(absolutePath)
              const extname = path.extname(absolutePath)
              const realFilePath = resolveScriptPath(path.join(dirname, path.basename(absolutePath, extname)))
              const removeExtPath = realFilePath.replace(path.extname(realFilePath), '')
              node.source = t.stringLiteral(promoteRelativePath(path.relative(filePath, removeExtPath)).replace(/\\/g, '/'))
            }
          } else if (value === '@tarojs/taro') {
            importTaroNode = node
            source.value = '@tarojs/taro-h5'
            specifiers.forEach(specifier => {
              if (t.isImportDefaultSpecifier(specifier)) {
                taroImportDefaultName = toVar(specifier.local)
              } else if (t.isImportSpecifier(specifier)) {
                taroapiMap.set(toVar(specifier.local), toVar(specifier.imported))
              }
            })
          } else if (value === '@tarojs/redux') {
            source.value = '@tarojs/redux-h5'
          } else if (value === '@tarojs/mobx') {
            source.value = '@tarojs/mobx-h5'
          } else if (value === '@tarojs/components') {
            importTaroComponentNode = node
            node.specifiers.forEach((specifier) => {
              if (!t.isImportSpecifier(specifier)) return
              componentnameMap.set(toVar(specifier.local), toVar(specifier.imported))
            })
          } else if (value === 'nervjs') {
            importNervNode = node
          }
        }
      },
      JSXElement: {
        exit (astPath: NodePath<t.JSXElement>) {
          hasJSX = true
        }
      },
      JSXOpeningElement: {
        exit (astPath: NodePath<t.JSXOpeningElement>) {
          const node = astPath.node
          const componentName = componentnameMap.get(toVar(node.name))
          const componentId = getComponentId(componentName, node)
          const componentRef = getComponentRef(node)

          if (!componentId) return
          const refFunc = createRefFunc(componentId)

          if (componentRef) {
            const expression = (componentRef.value as t.JSXExpressionContainer).expression;
            (refFunc.body as t.BlockStatement).body.unshift(
              t.expressionStatement(
                t.callExpression(expression, [t.identifier('ref')])
              )
            );
            (componentRef.value as t.JSXExpressionContainer).expression = refFunc
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
        exit (astPath: NodePath<t.CallExpression>) {
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
            if (thisOrder && !node.arguments[thisOrder]) {
              node.arguments[thisOrder] = t.thisExpression()
            }
          }
        }
      },
      Program: {
        exit (astPath: NodePath<t.Program>) {
          const node = astPath.node
          if (hasJSX) {
            if (!importNervNode) {
              importNervNode = t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))],
                t.stringLiteral('nervjs')
              )
              const specifiers = importNervNode.specifiers
              const defaultSpecifier = specifiers.find(item => t.isImportDefaultSpecifier(item))
              if (!defaultSpecifier) {
                specifiers.unshift(
                  t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
                )
              }
              node.body.unshift(importNervNode)
            }
            if (!importTaroNode) {
              importTaroNode = t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier('Taro'))],
                t.stringLiteral('@tarojs/taro-h5')
              )
              node.body.unshift(importTaroNode)
            }
          }
        }
      }
    }

    const pageVisitor = {
      ClassProperty: {
        enter (astPath: NodePath<t.ClassProperty>) {
          const node = astPath.node
          const key = toVar(node.key)
          if (key === 'config') {
            pageConfig = toVar(node.value)
          }
        }
      },
      ClassMethod: {
        exit (astPath: NodePath<t.ClassMethod>) {
          const node = astPath.node
          const key = node.key
          const keyName = toVar(key)
          if (keyName === 'componentDidMount') {
            componentDidMountNode = node
          } else if (keyName === 'componentDidShow') {
            componentDidShowNode = node
          } else if (keyName === 'componentDidHide') {
            componentDidHideNode = node
          } else if (keyName === 'onPageScroll') {
            hasOnPageScroll = true
          } else if (keyName === 'onReachBottom') {
            hasOnReachBottom = true
          } else if (keyName === 'onPullDownRefresh') {
            hasOnPullDownRefresh = true
          } else if (keyName === 'render') {
            renderReturnStatementPaths.length = 0
            renderClassMethodNode = node
            astPath.traverse({
              ReturnStatement: {
                exit (returnAstPath: NodePath<t.ReturnStatement>) {
                  renderReturnStatementPaths.push(returnAstPath)
                }
              }
            })
          }
        }
      },
      ClassBody: {
        exit (astPath: NodePath<t.ClassBody>) {
          const node = astPath.node
          if (!componentDidMountNode) {
            componentDidMountNode = t.classMethod('method', t.identifier('componentDidMount'), [],
              t.blockStatement([
                toAst('super.componentDidMount && super.componentDidMount()') as t.Statement
              ]), false, false)
            node.body.push(componentDidMountNode)
          }
          if (!componentDidShowNode) {
            componentDidShowNode = t.classMethod('method', t.identifier('componentDidShow'), [],
              t.blockStatement([
                toAst('super.componentDidShow && super.componentDidShow()') as t.Statement
              ]), false, false)
            node.body.push(componentDidShowNode)
          }
          if (!componentDidHideNode) {
            componentDidHideNode = t.classMethod('method', t.identifier('componentDidHide'), [],
              t.blockStatement([
                toAst('super.componentDidHide && super.componentDidHide()') as t.Statement
              ]), false, false)
            node.body.push(componentDidHideNode)
          }
          if (hasOnReachBottom) {
            componentDidShowNode.body.body.push(
              toAst(`
                this._offReachBottom = Taro.onReachBottom({
                  callback: this.onReachBottom,
                  ctx: this,
                  onReachBottomDistance: ${JSON.stringify(pageConfig.onReachBottomDistance)}
                })
              `)
            )
            componentDidHideNode.body.body.push(
              toAst('this._offReachBottom && this._offReachBottom()')
            )
          }
          if (hasOnPageScroll) {
            componentDidShowNode.body.body.push(
              toAst('this._offPageScroll = Taro.onPageScroll({ callback: this.onPageScroll, ctx: this })')
            )
            componentDidHideNode.body.body.push(
              toAst('this._offPageScroll && this._offPageScroll()')
            )
          }
          if (hasOnPullDownRefresh) {
            componentDidShowNode.body.body.push(
              toAst(`
                this.pullDownRefreshRef && this.pullDownRefreshRef.bindEvent()
              `)
            )
            componentDidHideNode.body.body.push(
              toAst(`
                this.pullDownRefreshRef && this.pullDownRefreshRef.unbindEvent()
              `)
            )
          }
        }
      },
      Program: {
        exit (astPath: NodePath<t.Program>) {
          if (hasOnPullDownRefresh) {
            // 增加PullDownRefresh组件
            if (!importTaroComponentNode) {
              importTaroComponentNode = t.importDeclaration(
                [],
                t.stringLiteral('@tarojs/components')
              )
              astPath.node.body.unshift(importTaroComponentNode)
            }
            const specifiers = importTaroComponentNode.specifiers
            const pos = importTaroComponentNode.specifiers.findIndex(specifier => {
              if (!t.isImportSpecifier(specifier)) return false
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
            const returnStatement = renderReturnStatementPaths.filter(renderReturnStatementPath => {
              const funcParentPath: NodePath = renderReturnStatementPath.getFunctionParent()
              return funcParentPath.node === renderClassMethodNode
            })
            returnStatement.forEach(returnAstPath => {
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
              statement.argument = (toAst(`
                <PullDownRefresh
                  onRefresh={this.onPullDownRefresh && this.onPullDownRefresh.bind(this)}
                  ref={ref => {
                    if (ref) this.pullDownRefreshRef = ref
                }}>{${varName}}</PullDownRefresh>`) as t.ExpressionStatement).expression
              })
          }
        }
      }
    }

    const visitor = mergeVisitors({}, defaultVisitor, isPage ? pageVisitor : {})

    traverse(ast, visitor)

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

  getTempDir (filePath) {
    const appPath = this.appPath
    const sourcePath = this.sourcePath
    const tempDir = this.tempDir

    const dirname = path.dirname(filePath)
    const relPath = path.relative(sourcePath, dirname)

    return path.resolve(appPath, tempDir, relPath)
  }

  processFiles (filePath) {
    const file = fs.readFileSync(filePath)
    const extname = path.extname(filePath)
    const distDirname = this.getTempDir(filePath)
    const isScriptFile = REG_SCRIPTS.test(extname)
    const distPath = this.getDist(distDirname, filePath, isScriptFile)

    try {
      if (isScriptFile) {
        // 脚本文件 处理一下
        const fileType = this.classifyFiles(filePath)
        const content = file.toString()
        let transformResult
        if (fileType === FILE_TYPE.ENTRY) {
          this.pages = []
          transformResult = this.processEntry(content, filePath)
        } else {
          transformResult = this.processOthers(content, filePath, fileType)
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

  getDist (distDirname, filename, isScriptFile) {
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
}

export { Compiler }

export async function build (appPath: string, buildConfig: IBuildConfig) {
  process.env.TARO_ENV = BUILD_TYPES.H5
  const compiler = new Compiler(appPath)
  await compiler.clean()
  await compiler.buildTemp()
  await compiler.buildDist(buildConfig)
  if (buildConfig.watch) {
    compiler.watchFiles()
  }
}
