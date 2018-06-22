const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const chokidar = require('chokidar')
const babel = require('babel-core')
const vfs = require('vinyl-fs')
const through2 = require('through2')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generate = require('babel-generator').default
const template = require('babel-template')
const _ = require('lodash')
const rimraf = require('rimraf')

const Util = require('./util')
const npmProcess = require('./util/npm')
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
const routerImportDefaultName = 'TaroRouter'
const tabBarComponentName = 'Tabbar'
const tabBarContainerComponentName = 'TabbarContainer'
const tabBarPanelComponentName = 'TabbarPanel'
const providerComponentName = 'Provider'
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
const entryFilePath = Util.resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)

let pages = []
let tabBar
let tabbarPos

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
  const ast = babel.transform(code, {
    parserOpts: babylonConfig
  }).ast
  let taroImportDefaultName
  let providorImportName
  let storeName
  let hasAddNervJsImportDefaultName = false
  let renderCallCode

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
                value.properties.forEach(node => {
                  if (node.key.name === 'position') tabbarPos = node.value.value
                })
              } else if ((key.name === 'iconPath' || key.name === 'selectedIconPath') && t.isStringLiteral(value)) {
                astPath.replaceWith(
                  t.objectProperty(t.stringLiteral(key.name), t.callExpression(t.identifier('require'), [t.stringLiteral(`./${value.value}`)]))
                )
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

          if (!Util.isNpmPkg(value)) {
            if (value.indexOf('.') === 0) {
              const pathArr = value.split('/')
              if (pathArr.indexOf('pages') >= 0) {
                astPath.remove()
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
            source.value = PACKAGES['nerv-redux']
          }
        },
        CallExpression (astPath) {
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
        },
        JSXOpeningElement (astPath) {
          if (astPath.node.name.name === 'Provider') {
            for (let v of astPath.node.attributes) {
              if (v.name.name !== 'store') continue
              storeName = v.value.expression.name
              break
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
                  <${tabBarComponentName} conf={${tabBarConfigName}} homePage="${homePage}" router={${taroImportDefaultName}}/>
                </${tabBarContainerComponentName}>`
            }
          }

          /* 插入<Provider /> */
          if (providerComponentName && storeName) {
            // 使用redux
            funcBody = `
              <${providorImportName} store={${storeName}}>
                ${funcBody}
              </${providorImportName}>`
          }

          /* 插入<TaroRouter.Router /> */
          node.body = template(`{return (${funcBody});}`, babylonConfig)()

          if (tabBar) {
            astPath
              .get('body')
              .unshiftContainer('body', [
                t.variableDeclaration('const', [
                  t.variableDeclarator(t.identifier(tabBarConfigName), tabBar)
                ])
              ])
          }
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
          `import ${taroImportDefaultName} from '${PACKAGES['@tarojs/taro-h5']}'`,
          babylonConfig
        )()
        const importTaroRouter = template(
          `import ${routerImportDefaultName} from '${PACKAGES['@tarojs/router']}'`,
          babylonConfig
        )()
        const importComponents = template(
          `import { View, ${tabBarComponentName}, ${tabBarContainerComponentName}, ${tabBarPanelComponentName}} from '${PACKAGES['@tarojs/components']}'`,
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

        node.body.unshift(importTaro)
        node.body.unshift(importTaroRouter)
        tabBar && node.body.unshift(importComponents)
        node.body.push(initNativeApi)
        node.body.push(initRouter)
        node.body.push(template(renderCallCode, babylonConfig)())
      }
    }
  })

  return {
    code: generate(ast).code
  }
}

function processOthers (code) {
  const ast = babel.transform(code, {
    parserOpts: babylonConfig
  }).ast
  let taroImportDefaultName
  let hasAddNervJsImportDefaultName = false

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
          import ${taroImportDefaultName} from '${PACKAGES['@tarojs/taro-h5']}'
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
  if (filename.indexOf(entryFileName) >= 0) return FILE_TYPE.ENTRY

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
        const destDir = path.dirname(filePath.replace(sourceDir, tempDir))
        vfs.src([modifySource]).pipe(vfs.dest(destDir))
      }
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
            let jsCode = unescape(transformResult.code.replace(/\\u/g, '%u'))
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

async function buildDist (buildConfig) {
  const { watch, h5 } = buildConfig
  const webpackConf = h5 && h5.webpack
  const entry = {
    app: path.join(tempPath, entryFileName)
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
  webpackRunner(h5Config, webpackConf)
}

function clean () {
  return new Promise((resolve, reject) => {
    rimraf(tempPath, () => {
      resolve()
    })
  })
}

async function build (buildConfig) {
  await clean()
  await buildTemp(buildConfig)
  await buildDist(buildConfig)
  if (buildConfig.watch) {
    watchFiles()
  }
}

module.exports = { build }
