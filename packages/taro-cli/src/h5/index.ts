import { PageConfig } from '@tarojs/taro'
import { IProjectConfig, IH5Config, IH5RouterConfig, IDeviceRatio } from '@tarojs/taro/types/compile'
import wxTransformer from '@tarojs/transformer-wx'
import * as babel from 'babel-core'
import traverse, { NodePath, TraverseOptions } from 'babel-traverse'
import * as t from 'babel-types'
import generate from 'better-babel-generator'
import * as chokidar from 'chokidar'
import * as fs from 'fs-extra'
import * as klaw from 'klaw'
import _, { compact, findLastIndex, first, fromPairs, get, identity, merge, transform } from 'lodash'
import { partial, pipe } from 'lodash/fp'
import * as path from 'path'
import * as resolve from 'resolve'

import CONFIG from '../config'
import {
  isAliasPath,
  isNpmPkg,
  mergeVisitors,
  printLog,
  promoteRelativePath,
  recursiveMerge,
  replaceAliasPath,
  resolveScriptPath,
  npm as npmProcess,
  processTypeEnum,
  PROJECT_CONFIG,
  REG_SCRIPTS,
  REG_TYPESCRIPT,
  createBabelRegister,
  getModuleDefaultExport
} from '@tarojs/helper'
import {
  convertAstExpressionToVariable as toVar,
  convertObjectToAstExpression as objToAst,
  convertSourceStringToAstExpression as toAst
} from '../util/astConvert'
import { checkCliAndFrameworkVersion } from '../util'
import { IBuildOptions, IOption, IBuildHooks } from '../util/types'
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
  isTaroClass,
  isUnderSubPackages,
  pRimraf,
  removeLeadingSlash,
  resetTSClassProperty,
  stripTrailingSlash
} from './helper'

const defaultH5Config: Partial<IH5Config> = {
  router: {
    mode: 'hash',
    customRoutes: {},
    basename: '/'
  }
}

type PageName = string
type FilePath = string

const BLOCK_TAG_NAME = 'Block'

class Compiler {
  projectConfig: IProjectConfig
  h5Config: IH5Config
  routerConfig: IH5RouterConfig
  sourceRoot: string
  sourcePath: string
  outputPath: string
  outputDir: string
  tempDir: string
  tempPath: string
  entryFilePath: string
  entryFileName: string
  pxTransformConfig
  pathAlias: {
    [key: string]: string
  }
  pages: [PageName, FilePath][] = []
  isUi: boolean

  constructor (public appPath: string, entryFile?: string, isUi?: boolean) {
    createBabelRegister({
      only: [
        filePath => filePath.indexOf(path.dirname(path.join(appPath, PROJECT_CONFIG))) >= 0
      ]
    })
    const projectConfig = recursiveMerge({
      h5: defaultH5Config
    }, getModuleDefaultExport(require(resolveScriptPath(path.join(appPath, PROJECT_CONFIG))))(merge))
    this.projectConfig = projectConfig
    const sourceDir = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
    this.sourceRoot = sourceDir
    const outputDir = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
    this.outputDir = outputDir
    this.h5Config = get(projectConfig, 'h5')
    this.routerConfig = get(projectConfig, 'h5.router', {})
    this.sourcePath = path.join(appPath, sourceDir)
    this.outputPath = path.join(appPath, outputDir)
    this.tempDir = CONFIG.TEMP_DIR
    this.tempPath = path.join(appPath, this.tempDir)
    this.entryFilePath = resolveScriptPath(path.join(this.sourcePath, entryFile || CONFIG.ENTRY))
    this.entryFileName = path.basename(this.entryFilePath)
    this.pathAlias = projectConfig.alias || {}
    this.pxTransformConfig = { designWidth: projectConfig.designWidth || 750 }
    if (projectConfig.hasOwnProperty(deviceRatioConfigName)) {
      this.pxTransformConfig.deviceRatio = projectConfig.deviceRatio
    }
    this.isUi = !!isUi
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

    let relSrcPath = path.relative(this.sourceRoot, relPath)
    relSrcPath = path.format({
      dir: path.dirname(relSrcPath),
      base: path.basename(relSrcPath, path.extname(relSrcPath))
    })

    const isPage = pages.some(([pageName, filePath]) => {
      const relPage = path.normalize(
        path.relative(appPath, pageName)
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
    const readPromises: any[] = []
    function readFiles (sourcePath, originalFilePath) {
      readPromises.push(new Promise((resolve, reject) => {
        klaw(sourcePath)
          .on('data', file => {
            const REG_IGNORE = /(\\|\/)\.(svn|git)\1/i;
            const relativePath = path.relative(appPath, file.path)
            if (file.stats.isSymbolicLink()) {
              let linkFile = fs.readlinkSync(file.path)
              if (!path.isAbsolute(linkFile)) {
                linkFile = path.resolve(file.path, '..', linkFile)
              }
              readFiles.call(this, linkFile, file.path)
            } else if (!file.stats.isDirectory() && !REG_IGNORE.test(relativePath)) {
              printLog(processTypeEnum.CREATE, '发现文件', relativePath)
              this.processFiles(file.path, originalFilePath)
            }
          })
          .on('end', () => {
            resolve()
          })
        }))
    }
    readFiles.call(this, sourcePath, sourcePath)
    return Promise.all(readPromises)
  }

  async buildDist ({ watch, port }: IBuildOptions, { modifyWebpackChain, modifyBuildAssets, onBuildFinish }: IBuildHooks) {
    const isMultiRouterMode = get(this.h5Config, 'router.mode') === 'multi'
    const entryFileName = this.entryFileName
    const projectConfig = this.projectConfig
    /** 不是真正意义上的IH5Config对象 */
    const h5Config: IH5Config & {
      deviceRatio?: IDeviceRatio
      env?: IOption
    } = this.h5Config
    const outputDir = this.outputDir
    const sourceRoot = this.sourceRoot
    const tempPath = this.tempPath
    const pathAlias = this.pathAlias

    const getEntryFile = (filename: string) => {
      return path.join(tempPath, filename)
    }

    const entryFile = path.basename(entryFileName, path.extname(entryFileName)) + '.js'
    const defaultEntry = isMultiRouterMode
      ? fromPairs(this.pages.map(([pagename, filePath]) => {
        return [filePath, [getEntryFile(filePath) + '.js']]
      }))
      : {
        app: [getEntryFile(entryFile)]
      }
    if (projectConfig.deviceRatio) {
      h5Config.deviceRatio = projectConfig.deviceRatio
    }
    if (projectConfig.env) {
      h5Config.env = projectConfig.env
    }
    recursiveMerge(h5Config, {
      alias: pathAlias,
      copy: projectConfig.copy,
      homePage: first(this.pages),
      defineConstants: projectConfig.defineConstants,
      designWidth: projectConfig.designWidth,
      entry: merge(defaultEntry, h5Config.entry),
      env: {
        TARO_ENV: JSON.stringify('h5')
      },
      isWatch: !!watch,
      outputRoot: outputDir,
      babel: projectConfig.babel,
      csso: projectConfig.csso,
      uglify: projectConfig.uglify,
      sass: projectConfig.sass,
      plugins: projectConfig.plugins,
      port,
      sourceRoot,
      modifyWebpackChain,
      modifyBuildAssets,
      onBuildFinish
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
        this.processFiles(filePath, filePath)
      })
      .on('change', filePath => {
        const relativePath = path.relative(appPath, filePath)
        printLog(processTypeEnum.MODIFY, '文件变动', relativePath)
        this.processFiles(filePath, filePath)
      })
      .on('unlink', filePath => {
        const relativePath = path.relative(appPath, filePath)
        const extname = path.extname(relativePath)
        const distDirname = this.getTempDir(filePath, filePath)
        const isScriptFile = REG_SCRIPTS.test(extname)
        const dist = this.getDist(distDirname, filePath, isScriptFile)
        printLog(processTypeEnum.UNLINK, '删除文件', relativePath)
        fs.unlinkSync(dist)
      })
  }

  processEntry (code, filePath): string | [PageName, string][] {
    const pages = this.pages

    const pathAlias = this.pathAlias
    const pxTransformConfig = this.pxTransformConfig
    const routerMode = this.routerConfig.mode
    const isMultiRouterMode = routerMode === 'multi'
    const routerLazyload = 'lazyload' in this.routerConfig
      ? this.routerConfig.lazyload
      : !isMultiRouterMode
    const customRoutes: Record<string, string> = isMultiRouterMode
      ? {}
      : get(this.h5Config, 'router.customRoutes', {})
    const routerBasename = isMultiRouterMode
      ? get(this.h5Config, 'publicPath', '/')
      : addLeadingSlash(stripTrailingSlash(get(this.h5Config, 'router.basename')))

    const renamePagename = get(this.h5Config, 'router.renamePagename', identity)
    const isUi = this.isUi

    let ast = wxTransformer({
      code,
      sourcePath: filePath,
      isNormal: true,
      isTyped: REG_TYPESCRIPT.test(filePath),
      adapter: 'h5'
    }).ast
    let taroImportDefaultName: string
    let providerImportName: string
    let storeName: string
    let renderCallCode: string

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

    const additionalConstructorNode = toAst(`Taro._$app = this`)
    const callComponentDidShowNode = toAst(`this.componentDidShow()`)
    const callComponentDidHideNode = toAst(`this.componentDidHide()`)
    const initTabbarApiNode = toAst(`Taro.initTabBarApis(this, Taro)`)

    ast = babel.transformFromAst(ast, '', {
      plugins: [
        [require('babel-plugin-preval')],
        [require('babel-plugin-danger-remove-unused-import'), { ignore: ['@tarojs/taro', 'react', 'nervjs'] }],
        [require('babel-plugin-transform-taroapi').default, {
          apis: require(resolve.sync('@tarojs/taro-h5/dist/taroApis', { basedir: this.appPath })),
          packageName: '@tarojs/taro-h5'
        }]
      ]
    }).ast

    const ClassDeclarationOrExpression = {
      enter (astPath: NodePath<t.ClassDeclaration> | NodePath<t.ClassExpression>) {
        const node = astPath.node
        if (!node.superClass) return
        if (isTaroClass(astPath)) {
          resetTSClassProperty(node.body.body)
        }
      }
    }

    const wrapWithTabbar = (currentPagename: string, funcBody: string) => {
      const firstPage = first(pages)
      const homePage = firstPage ? firstPage[0] : ''

      const panel = `
        <${tabBarPanelComponentName}>
          ${funcBody}
        </${tabBarPanelComponentName}>`

      const comp = `
        <${tabBarComponentName}
          conf={this.state.${tabBarConfigName}}
          homePage="${homePage}"
          ${currentPagename ? `currentPagename={'${currentPagename}'}` : ''}
          ${tabbarPos === 'top' ? `tabbarPos={'top'}` : ''} />`

      return `
        <${tabBarContainerComponentName}>
          ${tabbarPos === 'top' ? `${comp}${panel}` : `${panel}${comp}`}
        </${tabBarContainerComponentName}>`
    }

    const wrapWithProvider = (funcBody: string) => {
      return `
        <${providerImportName} store={${storeName}}>
          ${funcBody}
        </${providerImportName}>
      `
    }

    const wrapWithFuncBody = (funcBody: string) => {
      return `{return (${funcBody});}`
    }

    /**
     * ProgramExit使用的visitor
     * 负责修改render函数的内容，在componentDidMount中增加componentDidShow调用，在componentWillUnmount中增加componentDidHide调用。
     */
    const programExitVisitor = {
      ClassMethod: {
        exit (astPath: NodePath<t.ClassMethod>) {
          if (isMultiRouterMode) return

          const node = astPath.node
          const key = node.key
          const keyName = toVar(key)

          const isRender = keyName === 'render'
          const isComponentWillMount = keyName === 'componentWillMount'
          const isComponentDidMount = keyName === 'componentDidMount'
          const isComponentWillUnmount = keyName === 'componentWillUnmount'
          const isConstructor = keyName === 'constructor'

          if (isRender) {
            const createFuncBody = (pages: [PageName, FilePath][]) => {
              const routes = pages.map(([pageName, filePath], k) => {
                const shouldLazyloadPage = typeof routerLazyload === 'function'
                  ? routerLazyload(pageName)
                  : routerLazyload
                return createRoute({
                  pageName,
                  lazyload: shouldLazyloadPage,
                  isIndex: k === 0
                })
              })
              return `
                <Router
                  mode={${JSON.stringify(routerMode)}}
                  history={_taroHistory}
                  routes={[${routes.join(',')}]}
                  ${tabBar ? `tabBar={this.state.${tabBarConfigName}}` : ''}
                  customRoutes={${JSON.stringify(customRoutes)}} />
                `
            }

            const buildFuncBody = pipe(
              ...compact([
                createFuncBody,
                tabBar && partial(wrapWithTabbar, ['']),
                providerComponentName && storeName && wrapWithProvider,
                wrapWithFuncBody
              ])
            )

            node.body = toAst(buildFuncBody(pages), { preserveComments: true })
          } else {
            node.body.body = compact([
              hasComponentDidHide && isComponentWillUnmount && callComponentDidHideNode,
              ...node.body.body,
              tabBar && isComponentWillMount && initTabbarApiNode,
              hasConstructor && isConstructor && additionalConstructorNode,
              hasComponentDidShow && isComponentDidMount && callComponentDidShowNode
            ])
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
          if (subPackageParent) {
            /* 在subPackages属性下，说明是分包页面，需要处理root属性 */
            const parent = astPath.parent as t.ObjectExpression
            const rootNode = parent.properties.find(v => {
              if (t.isSpreadProperty(v)) return false
              return toVar(v.key) === 'root'
            }) as t.ObjectProperty
            const root = rootNode ? toVar(rootNode.value) : '';
            value.elements.forEach((v: t.StringLiteral) => {
              const pagePath = `${root}/${v.value}`.replace(/\/{2,}/g, '/')
              const pageName = removeLeadingSlash(pagePath)
              pages.push([pageName, renamePagename(pageName).replace(/\//g, '')])
              v.value = addLeadingSlash(v.value)
            })
          } else {
            value.elements.forEach((v: t.StringLiteral) => {
              const pagePath = v.value.replace(/\/{2,}/g, '/')
              const pageName = removeLeadingSlash(pagePath)
              pages.push([pageName, renamePagename(pageName).replace(/\//g, '')])
              v.value = addLeadingSlash(v.value)
            })
          }
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
            astPath.traverse(classPropertyVisitor)
            if (isMultiRouterMode) {
              merge(customRoutes, transform(pages, (res, [pageName, filePath], key) => {
                res[addLeadingSlash(pageName)] = addLeadingSlash(filePath)
              }, {}))
            }
          }
        }
      },
      ImportDeclaration: {
        enter: (astPath: NodePath<t.ImportDeclaration>) => {
          const node = astPath.node
          const source = node.source
          const specifiers = node.specifiers

          if (source.value === '@tarojs/taro') {
            const specifier = specifiers.find(item => t.isImportDefaultSpecifier(item))
            if (specifier) {
              taroImportDefaultName = toVar(specifier.local)
            }
            source.value = '@tarojs/taro-h5'
          } else if (source.value === '@tarojs/redux') {
            const specifier = specifiers.find(item => {
              return t.isImportSpecifier(item) && item.imported.name === providerComponentName
            })
            if (specifier) {
              providerImportName = specifier.local.name
            } else {
              providerImportName = providerComponentName
              specifiers.push(t.importSpecifier(t.identifier(providerComponentName), t.identifier(providerComponentName)))
            }
            source.value = '@tarojs/redux-h5'
          } else if (source.value === '@tarojs/mobx') {
            const specifier = specifiers.find(item => {
              return t.isImportSpecifier(item) && item.imported.name === providerComponentName
            })
            if (specifier) {
              providerImportName = specifier.local.name
            } else {
              providerImportName = providerComponentName
              specifiers.push(t.importSpecifier(t.identifier(providerComponentName), t.identifier(providerComponentName)))
            }
            source.value = '@tarojs/mobx-h5'
          } else if (source.value === 'nervjs') {
            hasNerv = true
            const defaultSpecifier = specifiers.find(item => t.isImportDefaultSpecifier(item))
            if (!defaultSpecifier) {
              specifiers.unshift(
                t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
              )
            }
          }

          if (isAliasPath(source.value, pathAlias)) {
            source.value = this.transformToTempDir(replaceAliasPath(filePath, source.value, pathAlias))
          }

          if (!isNpmPkg(source.value)) {
            if (source.value.indexOf('.') === 0) {
              const pathArr = source.value.split('/')

              /* FIXME: 会导致误删除 */
              if (pathArr.indexOf('pages') >= 0) {
                astPath.remove()
              } else if (REG_SCRIPTS.test(source.value) || path.extname(source.value) === '') {
                /* 移除后缀名 */
                const absolutePath = path.resolve(filePath, '..', source.value)
                const dirname = path.dirname(absolutePath)
                const extname = path.extname(absolutePath)
                const realFilePath = resolveScriptPath(path.join(dirname, path.basename(absolutePath, extname)))
                const removeExtPath = realFilePath.replace(path.extname(realFilePath), '')
                source.value = promoteRelativePath(path.relative(filePath, removeExtPath)).replace(/\\/g, '/')
              }
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
          const arg0 = node.arguments[0]

          if (calleeName === 'require' && t.isStringLiteral(arg0)) {
            const required = arg0.value
            if (required === '@tarojs/taro-h5') {
              arg0.value = `@tarojs/taro-h5/dist/index.cjs.js`
            }
          } else if (t.isMemberExpression(callee)) {
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
          const lastImportIndex = findLastIndex(astPath.node.body, t.isImportDeclaration)
          const lastImportNode = astPath.get(`body.${lastImportIndex > -1 ? lastImportIndex : 0}`) as NodePath<t.ImportDeclaration>
          const firstPage = first(pages)
          const routerConfigs = JSON.stringify({
            basename: routerBasename,
            customRoutes
          })

          const extraNodes: (t.Node | false)[] = [
            !hasNerv && toAst(`import ${nervJsImportDefaultName} from 'nervjs'`),
            tabBar && toAst(`import { View, ${tabBarComponentName}, ${tabBarContainerComponentName}, ${tabBarPanelComponentName}} from '@tarojs/components'`),
            toAst(`import { Router, createHistory, mountApis } from '@tarojs/router'`),
            toAst(`Taro.initPxTransform(${JSON.stringify(pxTransformConfig)})`),
            toAst(`
              const _taroHistory = createHistory({
                mode: "${routerMode}",
                basename: "${routerBasename}",
                customRoutes: ${JSON.stringify(customRoutes)},
                firstPagePath: "${addLeadingSlash(firstPage ? firstPage[0] : '')}"
              });
            `),
            isMultiRouterMode ? toAst(`mountApis(${routerConfigs});`) : toAst(`mountApis(${routerConfigs}, _taroHistory);`)
          ]
          astPath.traverse(programExitVisitor)
          if (!isUi) {
            lastImportNode.insertAfter(compact(extraNodes))
          }
          if (renderCallCode) {
            const renderCallNode = toAst(renderCallCode)
            node.body.push(renderCallNode)
          }
        }
      }
    })

    const generateCode = (ast) => {
      return generate(ast, {
        jsescOption: {
          minimal: true
        }
      }).code
    }

    if (isMultiRouterMode) {
      return this.pages.map(([pageName, filePath], k) => {
        const createFuncBody = () => {
          const shouldLazyloadPage = typeof routerLazyload === 'function'
            ? routerLazyload(pageName)
            : routerLazyload
          const route = createRoute({
            pageName,
            lazyload: shouldLazyloadPage,
            isIndex: k === 0
          })
          return `
            <Router
              mode={${JSON.stringify(routerMode)}}
              history={_taroHistory}
              routes={[${route}]}
              ${tabBar ? `tabBar={this.state.${tabBarConfigName}}` : ''}
              customRoutes={${JSON.stringify(customRoutes)}} />
            `
        }
        const replaceMultiRouterVisitor: TraverseOptions<t.Node> = {
          ClassMethod: {
            exit (astPath: NodePath<t.ClassMethod>) {
              const node = astPath.node
              const key = node.key
              const keyName = toVar(key)

              const isRender = keyName === 'render'
              const isComponentWillMount = keyName === 'componentWillMount'
              const isComponentDidMount = keyName === 'componentDidMount'
              const isComponentWillUnmount = keyName === 'componentWillUnmount'
              const isConstructor = keyName === 'constructor'

              if (isRender) {
                const buildFuncBody = pipe(
                  ...compact([
                    createFuncBody,
                    tabBar && partial(wrapWithTabbar, [addLeadingSlash(pageName)]),
                    providerComponentName && storeName && wrapWithProvider,
                    wrapWithFuncBody
                  ])
                )

                node.body = toAst(buildFuncBody(pages), { preserveComments: true })
              } else {
                node.body.body = compact([
                  hasComponentDidHide && isComponentWillUnmount && callComponentDidHideNode,
                  ...node.body.body,
                  tabBar && isComponentWillMount && initTabbarApiNode,
                  hasConstructor && isConstructor && additionalConstructorNode,
                  hasComponentDidShow && isComponentDidMount && callComponentDidShowNode
                ])
              }
            }
          },
          Program: {
            exit (astPath: NodePath<t.Program>) {
              const node = astPath.node
              node.body.forEach((bodyNode) => {
                if (t.isExpressionStatement(bodyNode)
                  && t.isCallExpression(bodyNode.expression)
                  && t.isIdentifier(bodyNode.expression.callee)
                  && bodyNode.expression.callee.name === 'mountApis') {
                  const mountApisOptNode = bodyNode.expression.arguments[0]
                  if (t.isObjectExpression(mountApisOptNode)) {
                    const valueNode = t.stringLiteral(addLeadingSlash(pageName))
                    let basenameNode = mountApisOptNode.properties.find((property: t.ObjectProperty) => {
                      return toVar<string>(property.key) === 'currentPagename'
                    }) as t.ObjectProperty | undefined
                    if (basenameNode) {
                      basenameNode.value = valueNode
                    } else {
                      basenameNode = t.objectProperty(t.stringLiteral('currentPagename'), valueNode)
                      mountApisOptNode.properties.push(basenameNode)
                    }
                  }
                }
              })
            }
          }
        }
        traverse(ast, replaceMultiRouterVisitor)
        return [filePath, generateCode(ast)]
      })
    } else {
      return generateCode(ast)
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
    let exportDefaultDeclarationNode: t.ExportDefaultDeclaration
    let exportNamedDeclarationPath: NodePath<t.ExportNamedDeclaration>
    let componentClassName
    let needSetConfigFromHooks
    let configFromHooks

    const renderReturnStatementPaths: NodePath<t.ReturnStatement>[] = []
    ast = babel.transformFromAst(ast, '', {
      plugins: [
        [require('babel-plugin-preval')],
        [require('babel-plugin-danger-remove-unused-import'), { ignore: ['@tarojs/taro', 'react', 'nervjs'] }],
        [require('babel-plugin-transform-taroapi').default, {
          apis: require(resolve.sync('@tarojs/taro-h5/dist/taroApis', { basedir: this.appPath })),
          packageName: '@tarojs/taro'
        }]
      ]
    }).ast

    const ClassDeclarationOrExpression = {
      enter (astPath: NodePath<t.ClassDeclaration> | NodePath<t.ClassExpression>) {
        const node = astPath.node
        if (!node.superClass) return
        if (isTaroClass(astPath)) {
          resetTSClassProperty(node.body.body)
          if (t.isClassDeclaration(astPath)) {
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
            } else {
              componentClassName = node.id.name
            }
          } else {
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
            } else {
              componentClassName = node.id.name
            }
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
      }, false as string | false)
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

    /**
     * 把namedExport换成defaultExport。应对情况：
     *
     *  - export function example () {}
     *  - export class example {}
     *  - export const example
     *  - export { example }
     */
    const replaceExportNamedToDefault = (astPath: NodePath<t.ExportNamedDeclaration>) => {
      if (!astPath) return

      const node = astPath.node
      if (t.isFunctionDeclaration(node.declaration)) {

        astPath.replaceWithMultiple([
          node.declaration,
          t.exportDefaultDeclaration(node.declaration.id)
        ])
      } else if (t.isClassDeclaration(node.declaration)) {
        astPath.replaceWithMultiple([
          node.declaration,
          t.exportDefaultDeclaration(node.declaration.id)
        ])
      } else if (t.isVariableDeclaration(node.declaration)) {
        const declarationId = node.declaration.declarations[0].id
        if (t.isIdentifier(declarationId)) {
          astPath.replaceWithMultiple([
            node.declaration,
            t.exportDefaultDeclaration(declarationId)
          ])
        }
      } else if (node.specifiers && node.specifiers.length) {
        astPath.replaceWithMultiple([
          t.exportDefaultDeclaration(node.specifiers[0].local)
        ])
      }
    }

    const defaultVisitor: TraverseOptions = {
      ClassExpression: ClassDeclarationOrExpression,
      ClassDeclaration: ClassDeclarationOrExpression,
      ImportDeclaration: {
        enter: (astPath: NodePath<t.ImportDeclaration>) => {
          const node = astPath.node
          const source = node.source
          const specifiers = node.specifiers

          if (source.value === '@tarojs/taro') {
            importTaroNode = node
            specifiers.forEach(specifier => {
              if (t.isImportDefaultSpecifier(specifier)) {
                taroImportDefaultName = toVar(specifier.local)
              } else if (t.isImportSpecifier(specifier)) {
                taroapiMap.set(toVar(specifier.local), toVar(specifier.imported))
              }
            })
            source.value = '@tarojs/taro-h5'
          } else if (source.value === '@tarojs/redux') {
            source.value = '@tarojs/redux-h5'
          } else if (source.value === '@tarojs/mobx') {
            source.value = '@tarojs/mobx-h5'
          } else if (source.value === '@tarojs/components') {
            importTaroComponentNode = node
            node.specifiers.forEach((specifier) => {
              if (!t.isImportSpecifier(specifier)) return
              componentnameMap.set(toVar(specifier.local), toVar(specifier.imported))
            })
          } else if (source.value === 'nervjs') {
            importNervNode = node
          }

          if (isAliasPath(source.value, pathAlias)) {
            source.value = this.transformToTempDir(replaceAliasPath(filePath, source.value, pathAlias))
          }

          if (!isNpmPkg(source.value)) {
            if (REG_SCRIPTS.test(source.value) || path.extname(source.value) === '') {
              const absolutePath = path.resolve(filePath, '..', source.value)
              const dirname = path.dirname(absolutePath)
              const extname = path.extname(absolutePath)
              const realFilePath = resolveScriptPath(path.join(dirname, path.basename(absolutePath, extname)))
              const removeExtPath = realFilePath.replace(path.extname(realFilePath), '')
              source.value = promoteRelativePath(path.relative(filePath, removeExtPath)).replace(/\\/g, '/')
            }
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
          const tagName = toVar(node.name)
          const componentName = componentnameMap.get(tagName)
          const componentId = getComponentId(componentName, node)
          const componentRef = getComponentRef(node)

          if (tagName === BLOCK_TAG_NAME) {
            node.name = t.jSXMemberExpression(
              t.jSXIdentifier('Nerv'),
              t.jSXIdentifier('Fragment')
            )
          }

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
      JSXClosingElement: {
        exit (astPath: NodePath<t.JSXClosingElement>) {
          const node = astPath.node
          const tagName = toVar(node.name)
          if (tagName === BLOCK_TAG_NAME) {
            node.name = t.jSXMemberExpression(
              t.jSXIdentifier('Nerv'),
              t.jSXIdentifier('Fragment')
            )
          }
        }
      },
      CallExpression: {
        exit (astPath: NodePath<t.CallExpression>) {
          const node = astPath.node
          const callee = node.callee
          const calleeName = toVar(callee)
          let needToAppendThis = false
          let funcName = ''

          const arg0 = node.arguments[0]

          if (calleeName === 'require' && t.isStringLiteral(arg0)) {
            const required = arg0.value
            if (required === '@tarojs/taro-h5') {
              arg0.value = `@tarojs/taro-h5/dist/index.cjs.js`
            }
          } else if (t.isMemberExpression(callee)) {
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
      AssignmentExpression (astPath) {
        const node = astPath.node
        const left = node.left
        if (t.isMemberExpression(left) && t.isIdentifier(left.object)) {
          if (left.object.name === componentClassName
              && t.isIdentifier(left.property)
              && left.property.name === 'config') {
            needSetConfigFromHooks = true
            configFromHooks = node.right
            pageConfig = toVar(node.right)
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
            astPath.traverse({
              ClassBody (astPath) {
                if (needSetConfigFromHooks) {
                  const classPath = astPath.findParent((p: NodePath<t.Node>) => p.isClassExpression() || p.isClassDeclaration()) as NodePath<t.ClassDeclaration>
                  classPath.node.body.body.unshift(
                    t.classProperty(
                      t.identifier('config'),
                      configFromHooks as t.ObjectExpression
                    )
                  )
                }
              }
            })
          }
        }
      }
    }

    const pageVisitor: TraverseOptions = {
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
      ExportDefaultDeclaration: {
        exit (astPath: NodePath<t.ExportDefaultDeclaration>) {
          exportDefaultDeclarationNode = astPath.node
        }
      },
      ExportNamedDeclaration: {
        exit (astPath: NodePath<t.ExportNamedDeclaration>) {
          exportNamedDeclarationPath = astPath
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

          if (!exportDefaultDeclarationNode && exportNamedDeclarationPath) {
            replaceExportNamedToDefault(exportNamedDeclarationPath)
          }
        }
      }
    }

    const visitor: TraverseOptions = mergeVisitors({}, defaultVisitor, isPage ? pageVisitor : {})

    traverse(ast, visitor)

    const generateCode = generate(ast, {
      jsescOption: {
        minimal: true
      }
    }).code
    return generateCode
  }

  getTempDir (filePath, originalFilePath) {
    const appPath = this.appPath
    const sourcePath = this.sourcePath
    const tempDir = this.tempDir
    let dirname = path.dirname(filePath)

    if (filePath.indexOf(sourcePath) < 0) {
      dirname = path.extname(originalFilePath) ? path.dirname(originalFilePath) : originalFilePath
    }
    const relPath = path.relative(sourcePath, dirname)

    return path.resolve(appPath, tempDir, relPath)
  }

  transformToTempDir (filePath: string) {
    const sourcePath = this.sourcePath
    const isAbsolute = path.isAbsolute(filePath)
    if (!isAbsolute) return filePath

    const relPath = path.relative(sourcePath, filePath)
    return relPath.startsWith('..')
      ? filePath
      : path.resolve(this.tempPath, relPath)
  }

  processFiles (filePath, originalFilePath) {
    const original = fs.readFileSync(filePath, { encoding: 'utf8' })
    const extname = path.extname(filePath)
    const distDirname = this.getTempDir(filePath, originalFilePath)
    const isScriptFile = REG_SCRIPTS.test(extname)
    const distPath = this.getDist(distDirname, filePath, isScriptFile)
    fs.ensureDirSync(distDirname)

    try {
      if (isScriptFile) {
        // 脚本文件 处理一下
        const fileType = this.classifyFiles(filePath)
        if (fileType === FILE_TYPE.ENTRY) {
          this.pages = []
          const result = this.processEntry(original, filePath)
          if (Array.isArray(result)) {
            result.forEach(([pageName, code]) => {
              fs.writeFileSync(
                path.join(distDirname, `${pageName}.js`),
                code
              )
            })
          } else {
            fs.writeFileSync(distPath, result)
          }
        } else {
          const code = this.processOthers(original, filePath, fileType)
          fs.writeFileSync(distPath, code)
        }
      } else {
        // 其他 直接复制
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

export async function build (appPath: string, buildConfig: IBuildOptions, buildHooks: IBuildHooks) {
  process.env.TARO_ENV = 'h5'
  await checkCliAndFrameworkVersion(appPath, 'h5')
  const compiler = new Compiler(appPath)
  await compiler.clean()
  await compiler.buildTemp()
  if (compiler.h5Config.transformOnly !== true) {
    await compiler.buildDist(buildConfig, buildHooks)
  }
  if (buildConfig.watch) {
    compiler.watchFiles()
  }
}
