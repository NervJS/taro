const fs = require('fs-extra')
const path = require('path')
const babylon = require('babylon')
const vfs = require('vinyl-fs')
const through2 = require('through2')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generate = require('babel-generator').default

const npmProcess = require('./npm')
const Util = require('./util')
const CONFIG = require('./config')

const taroJsFramework = '@taro/taro'
const nervJsFramework = 'nervjs'
const nervJsImportDefaultName = 'Nerv'
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
    'decorators'
  ]
}

function parseAst (code) {
  const styleFiles = []
  const ast = babylon.parse(code, babylonConfig)
  let taroImportDefaultName
  let componentClassName
  traverse(ast, {
    enter (astPath) {
      const node = astPath.node
      if (node.type === 'ClassProperty' && node.key.name === 'config') {
        astPath.remove()
      } else if (node.type === 'ImportDeclaration') {
        const source = node.source
        const value = source.value
        if (Util.isNpmPkg(value)) {
          if (value === taroJsFramework) {
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
          }
        } else if (Util.CSS_EXT.indexOf(path.extname(value)) >= 0) {
          if (styleFiles.indexOf(value) < 0) {
            styleFiles.push(value)
          }
        }
      } else if (node.type === 'ClassDeclaration' && node.superClass) {
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
      }
    }
  })
  return {
    code: generate(ast).code,
    taroImportDefaultName,
    componentClassName,
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
        const transformResult = parseAst(content)
        let jsCode = transformResult.code
        jsCode = `import ${transformResult.taroImportDefaultName} from '${taroJsFramework}'\n${jsCode}`
        jsCode += `\n${transformResult.taroImportDefaultName}.initNativeApi(${transformResult.taroImportDefaultName})\n`
        jsCode += `\n${nervJsImportDefaultName}.render(<${transformResult.componentClassName} />, document.getElementById('app'))`
        file.contents = Buffer.from(jsCode)
      } else if (Util.JS_EXT.indexOf(path.extname(filePath)) >= 0) {
        const transformResult = parseAst(content)
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
