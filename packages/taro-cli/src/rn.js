const fs = require('fs-extra')
const path = require('path')
const {performance} = require('perf_hooks')
const chokidar = require('chokidar')
const chalk = require('chalk')
const vfs = require('vinyl-fs')
const ejs = require('ejs')
const Vinyl = require('vinyl')
const through2 = require('through2')
const babel = require('babel-core')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generate = require('babel-generator').default
const template = require('babel-template')
const _ = require('lodash')
const shelljs = require('shelljs')

const Util = require('./util')
const npmProcess = require('./util/npm')
const CONFIG = require('./config')
const babylonConfig = require('./config/babylon')
const AstConvert = require('./util/ast_convert')
const {getPkgVersion} = require('./util')
const StyleProcess = require('./rn/styleProcess')

const appPath = process.cwd()
const projectConfig = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
const sourceDir = path.join(appPath, sourceDirName)
const tempDir = '.rn_temp'
const tempPath = path.join(appPath, tempDir)
const entryFilePath = Util.resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)
const pluginsConfig = projectConfig.plugins || {}

const pkgPath = path.join(__dirname, './rn/pkg')

let isBuildingStyles = {}
const styleDenpendencyTree = {}

const reactImportDefaultName = 'React'
const providerComponentName = 'Provider'
const setStoreFuncName = 'setStore'
const routerImportDefaultName = 'TaroRouter'

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
  'react-redux-rn': '@tarojs/taro-redux-rn'
}

function getJSAst (code) {
  return babel.transform(code, {
    parserOpts: babylonConfig,
    plugins: ['transform-decorators-legacy']
  }).ast
}

function parseJSCode (code, filePath) {
  let ast
  try {
    ast = getJSAst(code)
  } catch (e) {
    if (e.name === 'ReferenceError') {
      npmProcess.getNpmPkgSync('babel-plugin-transform-decorators-legacy')
      ast = getJSAst(code)
    } else {
      throw e
    }
  }
  const styleFiles = []
  let pages = [] // app.js 里面的config 配置里面的 pages
  let iconPaths = [] // app.js 里面的config 配置里面的需要引入的 iconPath
  const isEntryFile = path.basename(filePath) === entryFileName
  let taroImportDefaultName // import default from @tarojs/taro
  let hasAddReactImportDefaultName = false
  let providorImportName
  let storeName
  let hasAppExportDefault
  let componentClassName
  let classRenderReturnJSX

  traverse(ast, {
    ImportDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      const value = source.value
      const valueExtname = path.extname(value)
      const specifiers = node.specifiers

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
      } else if (value === PACKAGES['@tarojs/components']) {
        source.value = PACKAGES['@tarojs/components-rn']
      }
    },
    ClassProperty: {
      enter (astPath) {
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
                value.elements.forEach(v => {
                  pages.push(v.value)
                })
                astPath.remove()
              }
              // window
              if (key.name === 'window' && t.isObjectExpression(value)) {
                let navigationOptions = {}
                astPath.traverse({
                  ObjectProperty (astPath) {
                    const node = astPath.node
                    // 导航栏标题文字内容
                    if (node.key.name === 'navigationBarTitleText' || node.key.value === 'navigationBarTitleText') {
                      navigationOptions['title'] = node.value.value
                    }
                    // 导航栏标题颜色，仅支持 black/white
                    if (node.key.name === 'navigationBarTextStyle' || node.key.value === 'navigationBarTextStyle') {
                      navigationOptions['headerTintColor'] = node.value.value
                    }
                    // 导航栏背景颜色
                    if (node.key.name === 'navigationBarBackgroundColor' || node.key.value === 'navigationBarBackgroundColor') {
                      navigationOptions['headerStyle'] = {backgroundColor: node.value.value}
                    }
                    // 开启下拉刷新
                    if (node.key.name === 'enablePullDownRefresh' || node.key.value === 'enablePullDownRefresh') {
                      navigationOptions['enablePullDownRefresh'] = node.value.value
                    }
                  }
                })
                astPath.replaceWith(t.objectProperty(
                  t.identifier('navigationOptions'),
                  t.objectExpression(AstConvert.obj(navigationOptions))
                ))
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
                      iconPaths.push(value)
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
          astPath.node.static = 'true'
        } else {
          let navigationOptions = {}
          astPath.traverse({
            ObjectProperty (astPath) {
              const node = astPath.node
              // 导航栏标题文字内容
              if (node.key.name === 'navigationBarTitleText' || node.key.value === 'navigationBarTitleText') {
                navigationOptions['title'] = node.value.value
              }
              // 导航栏标题颜色，仅支持 black/white
              if (node.key.name === 'navigationBarTextStyle' || node.key.value === 'navigationBarTextStyle') {
                navigationOptions['headerTintColor'] = node.value.value
              }
              // 导航栏背景颜色
              if (node.key.name === 'navigationBarBackgroundColor' || node.key.value === 'navigationBarBackgroundColor') {
                navigationOptions['headerStyle'] = {backgroundColor: node.value.value}
              }
              // 开启下拉刷新
              if (node.key.name === 'enablePullDownRefresh' || node.key.value === 'enablePullDownRefresh') {
                navigationOptions['enablePullDownRefresh'] = node.value.value
              }
            }
          })
          astPath.replaceWith(t.classProperty(
            t.identifier('navigationOptions'),
            t.objectExpression(AstConvert.obj(navigationOptions))
          ))
          astPath.node.static = 'true'
        }
      }
    },
    // 获取 classRenderReturnJSX
    ClassMethod (astPath) {
      let node = astPath.node
      const key = node.key
      if (key.name !== 'render' || filePath !== entryFilePath) return
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
      if (filePath === entryFilePath) {
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
          /**
           * babel-plugin-transform-decorators-legacy 插件将 ClassDeclaration (class XXX { })
           * 改写成了 ClassExpression （let XXX = class XXX { }）的形式。
           */
          ClassExpression (astPath) {
            const node = astPath.node
            if (!node.superClass) {
              return
            }
            if (node.superClass.type === 'MemberExpression' &&
              node.superClass.object.name === taroImportDefaultName) {
              node.superClass.object.name = reactImportDefaultName
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
          },

          ClassMethod (astPath) {
            const node = astPath.node
            const key = node.key
            if (key.name !== 'render' || filePath !== entryFilePath) return
            let funcBody = classRenderReturnJSX
            if (pages.length > 0) {
              funcBody = `<RootStack/>`
            }
            if (providerComponentName && storeName) {
              // 使用redux
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
          if (isEntryFile) {
            const importTaroRouter = template(
              `import TaroRouter from '${PACKAGES['@tarojs/taro-router-rn']}'`,
              babylonConfig
            )()
            node.body.unshift(importTaroRouter)
          }
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
    ast = babel.transformFromAst(ast, code, {
      plugins: ['babel-plugin-transform-jsx-to-stylesheet']
    }).ast
  } catch (e) {
    if (e.name === 'ReferenceError') {
      npmProcess.getNpmPkgSync('babel-plugin-transform-jsx-to-stylesheet')
      ast = babel.transformFromAst(ast, code, {
        plugins: ['babel-plugin-transform-jsx-to-stylesheet']
      }).ast
    } else {
      throw e
    }
  }

  return {
    code: unescape(generate(ast).code.replace(/\\u/g, '%u')),
    styleFiles
  }
}

function compileDepStyles (filePath, styleFiles) {
  if (isBuildingStyles[filePath] || styleFiles.length === 0) {
    return Promise.resolve({})
  }
  isBuildingStyles[filePath] = true
  return Promise.all(styleFiles.map(async p => { // to css string
    const filePath = path.join(p)
    const fileExt = path.extname(filePath)
    Util.printLog(Util.pocessTypeEnum.COMPILE, _.camelCase(fileExt).toUpperCase(), filePath)
    return StyleProcess.loadStyle({filePath, pluginsConfig})
  })).then(resList => { // postcss
    return Promise.all(resList.map(item => {
      return StyleProcess.postCSS({...item, projectConfig})
    }))
  }).then(resList => {
    let styleObjectEntire = {}
    resList.forEach(item => {
      let styleObject = StyleProcess.getStyleObject(item.css)
      // validate styleObject
      StyleProcess.validateStyle({styleObject, filePath: item.filePath})

      Object.assign(styleObjectEntire, styleObject)
      if (filePath !== entryFilePath) { // 非入口文件，合并全局样式
        Object.assign(styleObjectEntire, _.get(styleDenpendencyTree, [entryFilePath, 'styleObjectEntire'], {}))
      }
      styleDenpendencyTree[filePath] = {
        styleFiles,
        styleObjectEntire
      }
    })
    return JSON.stringify(styleObjectEntire, null, 2)
  }).then(css => {
    let tempFilePath = filePath.replace(sourceDir, tempPath)
    const basename = path.basename(tempFilePath, path.extname(tempFilePath))
    tempFilePath = path.join(path.dirname(tempFilePath), `${basename}_styles.js`)

    StyleProcess.writeStyleFile({css, tempFilePath})
  }).catch((e) => {
    throw new Error(e)
  })
}

function buildTemp () {
  // fs.emptyDirSync(tempPath)
  fs.ensureDirSync(path.join(tempPath, 'bin'))
  return new Promise((resolve, reject) => {
    vfs.src(path.join(sourceDir, '**'))
      .pipe(through2.obj(async function (file, enc, cb) {
        if (file.isNull() || file.isStream()) {
          return cb(null, file)
        }
        const filePath = file.path
        const content = file.contents.toString()
        if (Util.REG_STYLE.test(filePath)) {
          return cb()
        }
        if (Util.REG_SCRIPT.test(filePath)) {
          Util.printLog(Util.pocessTypeEnum.COMPILE, 'JS', filePath)
          // parseJSCode
          let transformResult = parseJSCode(content, filePath)
          const jsCode = transformResult.code
          const styleFiles = transformResult.styleFiles
          // compileDepStyles
          await compileDepStyles(filePath, styleFiles)
          file.contents = Buffer.from(jsCode)
        }
        this.push(file)
        cb()
      }, function (cb) {
        // generator app.json
        const appJson = new Vinyl({
          path: 'app.json',
          contents: Buffer.from(JSON.stringify({
            expo: {
              sdkVersion: '27.0.0'
            }
          }, null, 2))
        })
        // generator .${tempPath}/package.json TODO JSON.parse 这种写法可能会有隐患
        const pkgTempObj = JSON.parse(
          ejs.render(
            fs.readFileSync(pkgPath, 'utf-8'), {
              projectName: projectConfig.projectName,
              version: getPkgVersion()
            }
          ).replace(/(\r\n|\n|\r|\s+)/gm, '')
        )
        const dependencies = require(path.join(process.cwd(), 'package.json')).dependencies
        pkgTempObj.dependencies = Object.assign({}, pkgTempObj.dependencies, dependencies)
        const pkg = new Vinyl({
          path: 'package.json',
          contents: Buffer.from(JSON.stringify(pkgTempObj, null, 2))
        })
        // Copy bin/crna-entry.js ?
        const crnaEntryPath = path.join(path.dirname(npmProcess.resolveNpmSync('@tarojs/rn-runner')), 'src/bin/crna-entry.js')
        const crnaEntryCode = fs.readFileSync(crnaEntryPath).toString()
        const crnaEntry = new Vinyl({
          path: 'bin/crna-entry.js',
          contents: Buffer.from(crnaEntryCode)
        })
        this.push(appJson)
        Util.printLog(Util.pocessTypeEnum.GENERATE, 'app.json', path.join(tempPath, 'app.json'))
        this.push(pkg)
        Util.printLog(Util.pocessTypeEnum.GENERATE, 'package.json', path.join(tempPath, 'package.json'))
        this.push(crnaEntry)
        Util.printLog(Util.pocessTypeEnum.COPY, 'crna-entry.js', path.join(tempPath, 'bin/crna-entry.js'))
        cb()
      }))
      .pipe(vfs.dest(path.join(tempPath)))
      .on('end', () => {
        if (!fs.existsSync(path.join(tempPath, 'node_modules'))) {
          console.log()
          console.log(chalk.yellow('开始安装依赖~'))
          process.chdir(tempPath)
          let command
          if (Util.shouldUseYarn()) {
            command = 'yarn'
          } else if (Util.shouldUseCnpm()) {
            command = 'cnpm install'
          } else {
            command = 'npm install'
          }
          shelljs.exec(command, {silent: false})
        }
        resolve()
      })
  }).catch(e => {
    throw e
  })
}

async function buildDist ({watch}) {
  const entry = {
    app: path.join(tempPath, entryFileName)
  }
  const rnConfig = projectConfig.rn || {}
  rnConfig.env = projectConfig.env
  rnConfig.defineConstants = projectConfig.defineConstants
  rnConfig.designWidth = projectConfig.designWidth
  rnConfig.entry = entry
  if (watch) {
    rnConfig.isWatch = true
  }
  rnConfig.projectDir = tempPath
  const rnRunner = await npmProcess.getNpmPkg('@tarojs/rn-runner')
  rnRunner(rnConfig)
}

async function processFiles (filePath) {
  isBuildingStyles = {} // 清空
  // 后期可以优化，不编译全部
  let t0 = performance.now()
  await buildTemp()
  let t1 = performance.now()
  Util.printLog(Util.pocessTypeEnum.COMPILE, `编译完成，花费${Math.round(t1 - t0)} ms`)
}

function watchFiles () {
  const watcher = chokidar.watch(path.join(sourceDir), {
    ignored: /(^|[/\\])\../,
    persistent: true,
    ignoreInitial: true
  })

  watcher
    .on('ready', () => {
      console.log()
      console.log(chalk.gray('初始化完毕，监听文件修改中...'))
      console.log()
    })
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
      Util.printLog(Util.pocessTypeEnum.UNLINK, '删除文件', relativePath)
      processFiles(filePath)
    })
    .on('error', error => console.log(`Watcher error: ${error}`))
}

async function build ({watch}) {
  fs.ensureDirSync(tempPath)
  let t0 = performance.now()
  await buildTemp()
  let t1 = performance.now()
  Util.printLog(Util.pocessTypeEnum.COMPILE, `编译完成，花费${Math.round(t1 - t0)} ms`)
  await buildDist({watch})
  if (watch) {
    watchFiles()
  }
}

module.exports = {
  build
}
