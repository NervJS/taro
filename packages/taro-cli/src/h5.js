const fs = require('fs-extra')
const path = require('path')
const babylon = require('babylon')
const vfs = require('vinyl-fs')
const through2 = require('through2')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generate = require('babel-generator').default
const template = require('babel-template')

const npmProcess = require('./npm')
const Util = require('./util')
const CONFIG = require('./config')

const taroJsFramework = '@tarojs/taro'
const nervJsFramework = 'nervjs'
const nervJsImportDefaultName = 'Nerv'
const routerComponentName = 'Router'
const tempDir = '.temp'

const appPath = process.cwd()
const sourceDir = path.join(appPath, CONFIG.SOURCE_DIR)
const tempPath = path.join(appPath, tempDir)
const entryFilePath = path.join(sourceDir, CONFIG.ENTRY)

const projectConfig = require(path.join(appPath, Util.PROJECT_CONFIG))

const babylonConfig = {
  sourceType: 'module',
  plugins: [
    'typescript',
    'classProperties',
    'jsx',
    'trailingFunctionCommas',
    'asyncFunctions',
    'exponentiationOperator',
    'asyncGenerators',
    'objectRestSpread',
    'decorators',
    'dynamicImport'
  ]
}
const pages = []

function processEntry (code) {
  const styleFiles = []
  const ast = babylon.parse(code, babylonConfig)
  let taroImportDefaultName
  let componentClassName

  traverse(ast, {
    enter (astPath) {
      astPath.traverse({
        ClassDeclaration (astPath) {
          const node = astPath.node
          if (!node.superClass) return
          if (node.superClass.type === 'MemberExpression' &&
            node.superClass.object.name === taroImportDefaultName) {
            node.superClass.object.name = nervJsImportDefaultName
            if (node.id === null) {
              const renameComponentClassName = '_TaroComponentClass'
              astPath.replaceWith(t.classDeclaration(t.identifier(renameComponentClassName), node.superClass, node.body, node.decorators || []))
              componentClassName = renameComponentClassName
            } else {
              componentClassName = node.id.name
            }
          } else if (node.superClass.name === 'Component') {
            if (node.id === null) {
              const renameComponentClassName = '_TaroComponentClass'
              astPath.replaceWith(t.classDeclaration(t.identifier(renameComponentClassName), node.superClass, node.body, node.decorators || []))
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
              if (key.name !== 'pages' || !t.isArrayExpression(value)) return
              value.elements.forEach(v => {
                pages.push(v.value)
              })
            }
          })
          astPath.remove()
        },
        ImportDeclaration (astPath) {
          const node = astPath.node
          const source = node.source
          const value = source.value
          if (Util.isNpmPkg(value)) {
            if (value !== taroJsFramework) return
            const specifiers = node.specifiers
            let defaultSpecifier = null
            let idx = -1
            specifiers.forEach((item, index) => {
              if (item.type === 'ImportDefaultSpecifier') {
                defaultSpecifier = item.local.name
                idx = index
              }
            })
            if (!defaultSpecifier) {
              node.specifiers.unshift(t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName)))
            } else {
              taroImportDefaultName = defaultSpecifier
              node.specifiers[idx].local.name = nervJsImportDefaultName
            }
            source.value = nervJsFramework
            astPath.replaceWith(t.importDeclaration(node.specifiers, source))
          } else if (Util.CSS_EXT.indexOf(path.extname(value)) >= 0) {
            if (styleFiles.indexOf(value) < 0) {
              styleFiles.push(value)
            }
          }
        },
        ClassMethod (astPath) {
          const node = astPath.node
          const key = node.key
          if (key.name !== 'render') return
          node.body = template(`{
            return <Router />
          }`, babylonConfig)()
        }
      })
    },
    Program: {
      exit (astPath) {
        const node = astPath.node
        const routerPages = pages.map(v => {
          const pageName = v.startsWith('/') ? v : `/${v}`
          return `'${pageName}': () => import('.${pageName}.js')`
        }).join(',')

        const importTaro = template(`import ${taroImportDefaultName}, { ${routerComponentName} } from '${taroJsFramework}'`, babylonConfig)()
        const initRouter = template(`Taro.initRouter({${routerPages}})`, babylonConfig)()
        const initNativeApi = template(`${taroImportDefaultName}.initNativeApi(${taroImportDefaultName})`, babylonConfig)()
        const renderApp = template(`${nervJsImportDefaultName}.render(<${componentClassName} />, document.getElementById('app'))`, babylonConfig)()

        node.body.unshift(importTaro)
        node.body.push(initRouter)
        node.body.push(initNativeApi)
        node.body.push(renderApp)
      }
    }
  })

  return {
    code: generate(ast).code,
    styleFiles
  }
}

function processOthers (code) {
  const styleFiles = []
  const ast = babylon.parse(code, babylonConfig)
  let taroImportDefaultName

  traverse(ast, {
    enter (astPath) {
      astPath.traverse({
        ClassDeclaration (astPath) {
          const node = astPath.node
          if (!node.superClass) return
          if (node.superClass.type === 'MemberExpression' &&
            node.superClass.object.name === taroImportDefaultName) {
            node.superClass.object.name = nervJsImportDefaultName
            if (node.id === null) {
              const renameComponentClassName = '_TaroComponentClass'
              astPath.replaceWith(t.classDeclaration(t.identifier(renameComponentClassName), node.superClass, node.body, node.decorators || []))
            }
          } else if (node.superClass.name === 'Component') {
            if (node.id === null) {
              const renameComponentClassName = '_TaroComponentClass'
              astPath.replaceWith(t.classDeclaration(t.identifier(renameComponentClassName), node.superClass, node.body, node.decorators || []))
            }
          }
        },
        ImportDeclaration (astPath) {
          const node = astPath.node
          const source = node.source
          const value = source.value
          if (Util.isNpmPkg(value)) {
            if (value !== taroJsFramework) return
            const specifiers = node.specifiers
            let defaultSpecifier = null
            let idx = -1
            specifiers.forEach((item, index) => {
              if (item.type === 'ImportDefaultSpecifier') {
                defaultSpecifier = item.local.name
                idx = index
              }
            })
            if (!defaultSpecifier) {
              node.specifiers.unshift(t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName)))
            } else {
              taroImportDefaultName = defaultSpecifier
              node.specifiers[idx].local.name = nervJsImportDefaultName
            }
            source.value = nervJsFramework
            astPath.replaceWith(t.importDeclaration(node.specifiers, source))
          } else if (Util.CSS_EXT.indexOf(path.extname(value)) >= 0) {
            if (styleFiles.indexOf(value) < 0) {
              styleFiles.push(value)
            }
          }
        }
      })
    },
    Program: {
      exit (astPath) {
        astPath.traverse({
          Program (astPath) {
            const node = astPath.node
            const importTaro = template(`
              import ${taroImportDefaultName} from '${taroJsFramework}'
            `, babylonConfig)
            node.body.unshift(importTaro())
          }
        })
      }
    }
  })

  return {
    code: generate(ast).code,
    styleFiles
  }
}

function build () {
  fs.ensureDirSync(tempPath)
  vfs.src(path.join(sourceDir, '**'))
    .pipe(through2.obj(function (file, enc, cb) {
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
        if (transformResult.taroImportDefaultName) {
          jsCode = `import ${transformResult.taroImportDefaultName} from '${taroJsFramework}'\n${jsCode}`
        }
        file.contents = Buffer.from(jsCode)
      }
      this.push(file)
      cb()
    }))
    .pipe(vfs.dest(path.join(tempPath)))
    .on('end', async () => {
      const entry = {
        'app': path.join(tempPath, CONFIG.ENTRY)
      }
      const h5Config = projectConfig.h5 || {}
      h5Config.designWidth = projectConfig.designWidth
      h5Config.entry = entry
      const webpackRunner = await npmProcess.getNpmPkg('taro-webpack-runner')
      webpackRunner(h5Config)
    })
}

module.exports = {
  build
}
