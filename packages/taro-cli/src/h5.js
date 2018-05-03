const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const chokidar = require('chokidar')
const babylon = require('babylon')
const vfs = require('vinyl-fs')
const through2 = require('through2')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generate = require('babel-generator').default
const template = require('babel-template')
const _ = require('lodash')
const rimraf = require('rimraf')

const npmProcess = require('./npm')
const Util = require('./util')
const CONFIG = require('./config')
const babylonConfig = require('./config/babylon')

const PACKAGES = {
  '@tarojs/taro': '@tarojs/taro',
  '@tarojs/taro-h5': '@tarojs/taro-h5',
  '@tarojs/redux': '@tarojs/redux',
  '@tarojs/router': '@tarojs/router',
  '@tarojs/components': '@tarojs/components',
  'nervjs': 'nervjs',
  'nerv-redux': 'nerv-redux'
}
const nervJsImportDefaultName = 'Nerv'
const routerImportDefaultName = 'TaroRouter'
const tabBarComponentName = 'Tabbar'
const providerComponentName = 'Provider'
const configStoreFuncName = 'configStore'
const setStoreFuncName = 'setStore'
const tabBarConfigName = '__tabs'
const tempDir = '.temp'

const appPath = process.cwd()
const projectConfig = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
// const outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
const sourceDir = path.join(appPath, sourceDirName)
// const outputDir = path.join(appPath, outputDirName)
const tempPath = path.join(appPath, tempDir)
const entryFilePath = path.join(sourceDir, CONFIG.ENTRY)

let pages = []
let tabBar

// let isBuildingScripts = {}
// let isBuildingStyles = {}
// let isCopyingFiles = {}

const FILE_TYPE = {
  ENTRY: 'ENTRY',
  PAGE: 'PAGE',
  COMPONENT: 'COMPONENT',
  NORMAL: 'NORMAL'
}

function processEntry (code) {
  const ast = babylon.parse(code, babylonConfig)
  let taroImportDefaultName
  let componentClassName
  let providorImportName
  let storeName

  traverse(ast, {
    enter (astPath) {
      astPath.traverse({
        ClassDeclaration (astPath) {
          const node = astPath.node
          if (!node.superClass) return
          if (
            node.superClass.type === 'MemberExpression' &&
            node.superClass.object.name === taroImportDefaultName
          ) {
            node.superClass.object.name = nervJsImportDefaultName
            if (node.id === null) {
              const renameComponentClassName = '_TaroComponentClass'
              astPath.replaceWith(
                t.classDeclaration(
                  t.identifier(renameComponentClassName),
                  node.superClass,
                  node.body,
                  node.decorators || []
                )
              )
              componentClassName = renameComponentClassName
            } else {
              componentClassName = node.id.name
            }
          } else if (node.superClass.name === 'Component') {
            if (node.id === null) {
              const renameComponentClassName = '_TaroComponentClass'
              astPath.replaceWith(
                t.classDeclaration(
                  t.identifier(renameComponentClassName),
                  node.superClass,
                  node.body,
                  node.decorators || []
                )
              )
              componentClassName = renameComponentClassName
            } else {
              componentClassName = node.id.name
            }
          }
        },
        ClassProperty (astPath) {
          const node = astPath.node
          const key = node.key
          const value = node.value
          if (key.name !== 'config' || !t.isObjectExpression(value)) return
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
              } else if (key.name === 'tabBar' && t.isObjectExpression(value)) {
                // tabBar
                tabBar = value
              }
            }
          })
          astPath.remove()
        },
        ImportDeclaration (astPath) {
          const node = astPath.node
          const source = node.source
          const value = source.value
          const specifiers = node.specifiers

          if (!Util.isNpmPkg(value)) return

          if (value === PACKAGES['@tarojs/taro']) {
            let specifier = specifiers.find(item => item.type === 'ImportDefaultSpecifier')
            if (specifier) {
              taroImportDefaultName = specifier.local.name
              specifier.local.name = nervJsImportDefaultName
            } else {
              node.specifiers.unshift(
                t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
              )
            }
            source.value = PACKAGES['nervjs']
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
            source.value = PACKAGES['nerv-redux']
          }
        },
        CallExpression (astPath) {
          const node = astPath.node
          const calleeName = node.callee.name
          const parentPath = astPath.parentPath

          if (calleeName === configStoreFuncName) {
            if (parentPath.isAssignmentExpression()) {
              storeName = parentPath.node.left.name
            } else if (parentPath.isVariableDeclarator()) {
              storeName = parentPath.node.id.name
            } else {
              storeName = 'store'
            }
          } else if (calleeName === setStoreFuncName) {
            if (parentPath.isAssignmentExpression() ||
              parentPath.isExpressionStatement() ||
              parentPath.isVariableDeclarator()) {
              parentPath.remove()
            }
          }
        }
      })
    },
    exit (astPath) {
      astPath.traverse({
        ClassMethod (astPath) {
          const node = astPath.node
          const key = node.key
          let funcBody
          if (key.name !== 'render') return
          funcBody = `<${routerImportDefaultName}.Router />`

          if (tabBar) {
            funcBody = `
              <View>
                ${funcBody}
                <${tabBarComponentName} conf={${tabBarConfigName}}/>
              </View>`

            astPath
              .get('body')
              .unshiftContainer('body', [
                t.variableDeclaration('const', [
                  t.variableDeclarator(t.identifier(tabBarConfigName), tabBar)
                ])
              ])
          }

          if (providerComponentName && storeName) {
            // 使用redux
            funcBody = `
              <${providorImportName} store={${storeName}}>
                ${funcBody}
              </${providorImportName}>`
          }

          node.body = template(`{return (${funcBody});}`, babylonConfig)()
        }
      })
    },
    Program: {
      exit (astPath) {
        const node = astPath.node
        const routerPages = pages
          .map(v => {
            const pageName = v.startsWith('/') ? v : `/${v}`
            return `['${pageName}', () => import('.${pageName}.js')]`
          })
          .join(',')

        const importTaro = template(
          `import ${taroImportDefaultName} from '${PACKAGES['@tarojs/taro']}'`,
          babylonConfig
        )()
        const importTaroRouter = template(
          `import ${routerImportDefaultName} from '${PACKAGES['@tarojs/router']}'`,
          babylonConfig
        )()
        const importComponents = template(
          `import { View, ${tabBarComponentName}} from '${PACKAGES['@tarojs/components']}'`,
          babylonConfig
        )()
        const initRouter = template(
          `${routerImportDefaultName}.initRouter([${routerPages}], ${taroImportDefaultName})`,
          babylonConfig
        )()
        const initNativeApi = template(
          `${taroImportDefaultName}.initNativeApi(${taroImportDefaultName})`,
          babylonConfig
        )()
        const renderApp = template(
          `${nervJsImportDefaultName}.render(<${componentClassName} />, document.getElementById('app'))`,
          babylonConfig
        )()

        node.body.unshift(importTaro)
        node.body.unshift(importTaroRouter)
        tabBar && node.body.unshift(importComponents)
        node.body.push(initNativeApi)
        node.body.push(initRouter)
        node.body.push(renderApp)
      }
    }
  })

  return {
    code: generate(ast).code
  }
}

function processOthers (code) {
  const ast = babylon.parse(code, babylonConfig)
  let taroImportDefaultName

  traverse(ast, {
    enter (astPath) {
      astPath.traverse({
        ClassDeclaration (astPath) {
          const node = astPath.node
          if (!node.superClass) return
          if (
            node.superClass.type === 'MemberExpression' &&
            node.superClass.object.name === taroImportDefaultName
          ) {
            node.superClass.object.name = nervJsImportDefaultName
            if (node.id === null) {
              const renameComponentClassName = '_TaroComponentClass'
              astPath.replaceWith(
                t.classDeclaration(
                  t.identifier(renameComponentClassName),
                  node.superClass,
                  node.body,
                  node.decorators || []
                )
              )
            }
          } else if (node.superClass.name === 'Component') {
            if (node.id === null) {
              const renameComponentClassName = '_TaroComponentClass'
              astPath.replaceWith(
                t.classDeclaration(
                  t.identifier(renameComponentClassName),
                  node.superClass,
                  node.body,
                  node.decorators || []
                )
              )
            }
          }
        },
        ImportDeclaration (astPath) {
          const node = astPath.node
          const source = node.source
          const value = source.value
          const specifiers = node.specifiers
          if (!Util.isNpmPkg(value)) return
          if (value === PACKAGES['@tarojs/taro']) {
            let specifier = specifiers.find(item => item.type === 'ImportDefaultSpecifier')
            if (specifier) {
              taroImportDefaultName = specifier.local.name
              specifier.local.name = nervJsImportDefaultName
            } else {
              node.specifiers.unshift(
                t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
              )
            }
            source.value = PACKAGES['nervjs']
          } else if (value === PACKAGES['@tarojs/redux']) {
            source.value = PACKAGES['nerv-redux']
          }
        }
      })
    },
    Program: {
      exit (astPath) {
        if (!taroImportDefaultName) return
        const node = astPath.node
        const importTaro = template(`
          import ${taroImportDefaultName} from '${PACKAGES['@tarojs/taro']}'
        `, babylonConfig)
        node.body.unshift(importTaro())
      }
    }
  })

  return {
    code: generate(ast).code
  }
}

function classifyFiles (filename) {
  if (filename.indexOf(CONFIG.ENTRY) >= 0) return FILE_TYPE.ENTRY

  if (pages.some(page => {
    if (filename.indexOf(page) >= 0) return true
  })) {
    return FILE_TYPE.PAGE
  } else {
    return FILE_TYPE.NORMAL
  }
}

function watchFiles () {
  console.log(chalk.gray('\n监听文件修改中...\n'))
  // isBuildingScripts = {}
  // isBuildingStyles = {}
  // isCopyingFiles = {}
  const watcher = chokidar.watch(path.join(sourceDir), {
    ignored: /(^|[/\\])\../,
    persistent: true,
    ignoreInitial: true
  })
  watcher
    .on('addDir', dirPath => {
      console.log(dirPath)
    })
    .on('add', filePath => {
      console.log(filePath)
    })
    .on('change', async filePath => {
      const extname = path.extname(filePath)
      const fileType = classifyFiles(filePath)
      let transformResult
      pages = []

      let modifySource = filePath.replace(appPath + path.sep, '')
      modifySource = modifySource.split(path.sep).join('/')
      Util.printLog(Util.pocessTypeEnum.MODIFY, '文件变动', modifySource)

      if (Util.REG_SCRIPT.test(extname)) {
        // 脚本文件
        const code = fs.readFileSync(filePath).toString()
        if (fileType === FILE_TYPE.ENTRY) {
          transformResult = processEntry(code)
        } else {
          transformResult = processOthers(code)
        }
        fs.writeFileSync(filePath.replace(sourceDir, tempDir), transformResult.code)
      } else {
        // 其他
        vfs.src([modifySource]).pipe(vfs.dest(tempPath))
      }
      // isBuildingScripts = {}
      // isBuildingStyles = {}
      // isCopyingFiles = {}
    })
}

function buildTemp () {
  fs.ensureDirSync(tempPath)
  return new Promise((resolve, reject) => {
    vfs
      .src(path.join(sourceDir, '**'))
      .pipe(
        through2.obj(function (file, enc, cb) {
          if (file.isNull() || file.isStream()) {
            return cb(null, file)
          }
          const filePath = file.path
          const content = file.contents.toString()
          if (entryFilePath === filePath) {
            const transformResult = processEntry(content)
            const jsCode = transformResult.code
            file.contents = Buffer.from(jsCode)
          } else if (Util.JS_EXT.indexOf(path.extname(filePath)) >= 0) {
            const transformResult = processOthers(content)
            let jsCode = transformResult.code
            file.contents = Buffer.from(jsCode)
          }
          this.push(file)
          cb()
        })
      )
      .pipe(vfs.dest(path.join(tempPath)))
      .on('end', () => {
        resolve()
      })
  })
}

async function buildDist ({ watch }) {
  const entry = {
    app: path.join(tempPath, CONFIG.ENTRY)
  }
  const h5Config = projectConfig.h5 || {}
  h5Config.env = projectConfig.env
  h5Config.defineConstants = projectConfig.defineConstants
  h5Config.designWidth = projectConfig.designWidth
  h5Config.sourceRoot = projectConfig.sourceRoot
  h5Config.outputRoot = projectConfig.outputRoot
  h5Config.entry = entry
  if (watch) {
    h5Config.isWatch = true
  }
  const webpackRunner = await npmProcess.getNpmPkg('@tarojs/webpack-runner')
  webpackRunner(h5Config)
}

function clean () {
  return new Promise((resolve, reject) => {
    rimraf(tempPath, () => {
      resolve()
    })
  })
}

async function build ({ watch }) {
  await clean()
  await buildTemp()
  await buildDist({ watch })
  if (watch) {
    watchFiles()
  }
}

module.exports = {
  build
}
