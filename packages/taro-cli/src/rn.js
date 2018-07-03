const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const vfs = require('vinyl-fs')
const Vinyl = require('vinyl')
const through2 = require('through2')
const babel = require('babel-core')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generate = require('babel-generator').default
const template = require('babel-template')
const _ = require('lodash')
const transformCSS = require('css-to-react-native-transform').default
const shelljs = require('shelljs')

const Util = require('./util')
const npmProcess = require('./util/npm')
const CONFIG = require('./config')
const babylonConfig = require('./config/babylon')

const appPath = process.cwd()
const projectConfig = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
const sourceDir = path.join(appPath, sourceDirName)
const tempDir = '.temp'
const tempPath = path.join(appPath, tempDir)
const entryFilePath = Util.resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)
const pluginsConfig = projectConfig.plugins || {}

const isBuildingStyles = {}
const styleDenpendencyTree = {}

const reactImportDefaultName = 'React'
const providerComponentName = 'Provider'
const configStoreFuncName = 'configStore'
const setStoreFuncName = 'setStore'

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
  '@tarojs/redux': '@tarojs/redux',
  '@tarojs/components': '@tarojs/components',
  '@tarojs/components-rn': '@tarojs/components-rn',
  'react': 'react',
  'react-native': 'react-native',
  'react-redux': 'react-redux'
}

function parseJSCode (code, filePath) {
  const ast = babel.transform(code, {
    parserOpts: babylonConfig
  }).ast
  const styleFiles = []
  let taroImportDefaultName
  let hasAddReactImportDefaultName = false
  let providorImportName
  let storeName
  let hasAppExportDefault
  let componentClassName
  let classRenderReturnJSX
  let importStyleName

  traverse(ast, {
    ImportDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      const value = source.value
      const valueExtname = path.extname(value)
      const specifiers = node.specifiers

      if (!Util.isNpmPkg(value)) {
        if (Util.REG_STYLE.test(valueExtname)) {
          const basename = path.basename(value, valueExtname)
          const stylePath = path.resolve(path.dirname(filePath), value)
          if (styleFiles.indexOf(stylePath) < 0) {
            styleFiles.push(stylePath)
          }
          importStyleName = _.camelCase(`${basename}_styles`)
          const importSpecifiers = [t.importDefaultSpecifier(t.identifier(importStyleName))]
          astPath.replaceWith(t.importDeclaration(
            importSpecifiers,
            t.stringLiteral(`${path.dirname(value)}/${basename}_styles`))
          )
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
        const taroApisSpecifiers = []
        specifiers.forEach((item, index) => {
          if (item.imported && taroApis.indexOf(item.imported.name) >= 0) {
            taroApisSpecifiers.push(t.importSpecifier(t.identifier(item.local.name), t.identifier(item.imported.name)))
            specifiers.splice(index, 1)
          }
        })
        source.value = PACKAGES['react']

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
        source.value = PACKAGES['react-redux']
      } else if (value === PACKAGES['@tarojs/components']) {
        source.value = PACKAGES['@tarojs/components-rn']
      }
    },
    JSXElement (astPath) {
      const node = astPath.node
      const openingElement = node.openingElement
      if (openingElement && openingElement.attributes.length) {
        const attributes = openingElement.attributes
        const newAttributes = []
        let styleAttrs = []
        attributes.forEach(attr => {
          const name = attr.name
          if (name.name === 'className' || name.name === 'id') {
            if (attr.value) {
              styleAttrs = styleAttrs.concat(attr.value.value.split(' '))
            }
          } else {
            newAttributes.push(attr)
          }
        })
        if (styleAttrs.length) {
          styleAttrs = _.uniq(styleAttrs)
          const styleArr = styleAttrs.map(item => {
            const styleName = `${importStyleName}.${item}`
            return t.identifier(styleName)
          })
          newAttributes.push(
            t.jSXAttribute(t.jSXIdentifier('style'), t.jSXExpressionContainer(t.arrayExpression(styleArr)))
          )
        }
        openingElement.attributes = newAttributes
      }
    },

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

    Program: {
      exit (astPath) {
        const node = astPath.node
        astPath.traverse({
          ClassDeclaration (astPath) {
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
            if (providerComponentName && storeName) {
              // 使用redux
              funcBody = `
                <${providorImportName} store={${storeName}}>
                  ${funcBody}
                </${providorImportName}>`
            }
            // node.body = template(`{return (${funcBody});}`, babylonConfig)()
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
          }
        })
        const importTaro = template(
          `import ${taroImportDefaultName} from '${PACKAGES['@tarojs/taro-rn']}'`,
          babylonConfig
        )()
        node.body.unshift(importTaro)
        if (filePath === entryFilePath) {
          const initNativeApi = template(
            `${taroImportDefaultName}.initNativeApi(${taroImportDefaultName})`,
            babylonConfig
          )()
          node.body.push(initNativeApi)
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
  return {
    code: generate(ast).code,
    styleFiles
  }
}

function compileDepStyles (filePath, styleFiles) {
  if (isBuildingStyles[filePath]) {
    return Promise.resolve({})
  }
  isBuildingStyles[filePath] = true
  return Promise.all(styleFiles.map(async p => {
    const filePath = path.join(p)
    const fileExt = path.extname(filePath)
    const pluginName = Util.FILE_PROCESSOR_MAP[fileExt]
    if (pluginName) {
      return npmProcess.callPlugin(pluginName, null, filePath, pluginsConfig[pluginName] || {})
    }
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, content) => {
        if (err) {
          return reject(err)
        }
        resolve({
          css: content
        })
      })
    })
  })).then(async resList => {
    let resContent = resList.map(res => res.css.toString()).join('\n')
    try {
      // 处理css文件
      let tempFilePath = filePath.replace(sourceDir, tempPath)
      const basename = path.basename(tempFilePath, path.extname(tempFilePath))
      tempFilePath = path.join(path.dirname(tempFilePath), `${basename}_styles.js`)
      let styleObject = {}
      if (resContent) {
        styleObject = transformCSS(resContent)
      }
      const styleObjectStr = JSON.stringify(styleObject, null, 2)
      styleDenpendencyTree[filePath] = {
        styleFiles,
        styleObject
      }
      const fileContent = `import { StyleSheet } from 'react-native'\n\nexport default StyleSheet.create(${styleObjectStr})`
      fs.ensureDirSync(path.dirname(tempFilePath))
      fs.writeFileSync(tempFilePath, fileContent)
    } catch (err) {
      console.log(err)
    }
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
          let transformResult = parseJSCode(content, filePath)
          const jsCode = transformResult.code
          const styleFiles = transformResult.styleFiles
          await compileDepStyles(filePath, styleFiles)
          file.contents = Buffer.from(jsCode)
        }
        this.push(file)
        cb()
      }, function (cb) {
        const appJson = new Vinyl({
          path: 'app.json',
          contents: Buffer.from(JSON.stringify({
            expo: {
              sdkVersion: '27.0.0'
            }
          }, null, 2))
        })
        const pkg = new Vinyl({
          path: 'package.json',
          contents: Buffer.from(JSON.stringify({
            name: projectConfig.projectName,
            main: './bin/crna-entry.js',
            dependencies: {
              '@tarojs/components-rn': `^${Util.getPkgVersion()}`,
              '@tarojs/taro-rn': `^${Util.getPkgVersion()}`,
              'expo': '^27.0.1',
              'react': '16.3.1',
              'react-native': '~0.55.2'
            }
          }, null, 2))
        })
        const crnaEntryPath = path.join(path.dirname(npmProcess.resolveNpmSync('@tarojs/rn-runner')), 'src/bin/crna-entry.js')
        const crnaEntryCode = fs.readFileSync(crnaEntryPath).toString()
        const crnaEntry = new Vinyl({
          path: 'bin/crna-entry.js',
          contents: Buffer.from(crnaEntryCode)
        })
        this.push(appJson)
        this.push(pkg)
        this.push(crnaEntry)
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
          shelljs.exec(command, { silent: false })
        }
        resolve()
      })
  })
}

async function buildDist ({ watch }) {
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

function watchFiles () {

}

async function build ({ watch }) {
  fs.ensureDirSync(tempPath)
  await buildTemp()
  await buildDist({ watch })
  if (watch) {
    watchFiles()
  }
}

module.exports = {
  build
}
