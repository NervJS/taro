const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const chalk = require('chalk')
const chokidar = require('chokidar')
const wxTransformer = require('@tarojs/transformer-wx')
const babel = require('babel-core')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generate = require('babel-generator').default
const template = require('babel-template')
const autoprefixer = require('autoprefixer')
const minimatch = require('minimatch')
const _ = require('lodash')

const postcss = require('postcss')
const pxtransform = require('postcss-pxtransform')
const cssUrlParse = require('postcss-url')
const Scope = require('postcss-modules-scope')
const Values = require('postcss-modules-values')
const genericNames = require('generic-names')
const LocalByDefault = require('postcss-modules-local-by-default')
const ExtractImports = require('postcss-modules-extract-imports')
const ResolveImports = require('postcss-modules-resolve-imports')

const Util = require('./util')
const CONFIG = require('./config')
const npmProcess = require('./util/npm')
const { resolveNpmFilesPath, resolveNpmPkgMainPath } = require('./util/resolve_npm_files')
const babylonConfig = require('./config/babylon')
const browserList = require('./config/browser_list')
const defaultUglifyConfig = require('./config/uglify')
const defaultBabelConfig = require('./config/babel')
const astConvert = require('./util/ast_convert')

const appPath = process.cwd()
const configDir = path.join(appPath, Util.PROJECT_CONFIG)
const projectConfig = require(configDir)(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
const outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
const sourceDir = path.join(appPath, sourceDirName)
const outputDir = path.join(appPath, outputDirName)
const entryFilePath = Util.resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)
const outputEntryFilePath = path.join(outputDir, entryFileName)
const watcherDirs = projectConfig.watcher || []
const pathAlias = projectConfig.alias || {}

const pluginsConfig = projectConfig.plugins || {}
const weappConf = projectConfig.weapp || {}
const weappNpmConfig = Object.assign({
  name: CONFIG.NPM_DIR,
  dir: null
}, weappConf.npm)
const appOutput = typeof weappConf.appOutput === 'boolean' ? weappConf.appOutput : true
const useCompileConf = Object.assign({}, weappConf.compile)
const compileInclude = useCompileConf.include || []

const notExistNpmList = []
const taroJsFramework = '@tarojs/taro'
const taroJsComponents = '@tarojs/components'
const taroJsRedux = '@tarojs/redux'
let appConfig = {}
const dependencyTree = {}
const depComponents = {}
const hasBeenBuiltComponents = []
const componentsBuildResult = {}
const componentsNamedMap = {}
const componentExportsMap = {}
const wxssDepTree = {}
let isBuildingScripts = {}
let isBuildingStyles = {}
let isCopyingFiles = {}
let isProduction = false
let buildAdapter = Util.BUILD_TYPES.WEAPP
let outputFilesTypes = Util.MINI_APP_FILES[buildAdapter]
let notTaroComponents = []

const NODE_MODULES = 'node_modules'
const NODE_MODULES_REG = /(.*)node_modules/

const nodeModulesPath = Util.recursiveFindNodeModules(path.join(appPath, NODE_MODULES))
let npmOutputDir

if (!weappNpmConfig.dir) {
  npmOutputDir = path.join(outputDir, weappNpmConfig.name)
} else {
  npmOutputDir = path.join(path.resolve(configDir, '..', weappNpmConfig.dir), weappNpmConfig.name)
}

const PARSE_AST_TYPE = {
  ENTRY: 'ENTRY',
  PAGE: 'PAGE',
  COMPONENT: 'COMPONENT',
  NORMAL: 'NORMAL'
}

const DEVICE_RATIO = 'deviceRatio'

const isWindows = os.platform() === 'win32'

let constantsReplaceList = Object.assign({}, Util.generateEnvList(projectConfig.env || {}), Util.generateConstantsList(projectConfig.defineConstants || {}))

function getExactedNpmFilePath (npmName, filePath) {
  try {
    const npmInfo = resolveNpmFilesPath(npmName, isProduction, weappNpmConfig, buildAdapter, appPath, compileInclude)
    const npmInfoMainPath = npmInfo.main
    let outputNpmPath
    if (Util.REG_STYLE.test(npmInfoMainPath)) {
      outputNpmPath = npmInfoMainPath
    } else {
      if (!weappNpmConfig.dir) {
        const cwdRelate2Npm = path.relative(npmInfoMainPath.slice(0, npmInfoMainPath.search('node_modules')), process.cwd())
        outputNpmPath = npmInfoMainPath.replace(NODE_MODULES, path.join(cwdRelate2Npm, outputDirName, weappNpmConfig.name))
        outputNpmPath = outputNpmPath.replace(/node_modules/g, weappNpmConfig.name)
      } else {
        let npmFilePath = npmInfoMainPath.match(/(?=(node_modules)).*/)[0]
        npmFilePath = npmFilePath.replace(/node_modules/g, weappNpmConfig.name)
        outputNpmPath = path.join(path.resolve(configDir, '..', weappNpmConfig.dir), npmFilePath)
      }
    }
    if (buildAdapter === Util.BUILD_TYPES.ALIPAY) {
      outputNpmPath = outputNpmPath.replace(/@/g, '_')
    }
    const relativePath = path.relative(filePath, outputNpmPath)
    return Util.promoteRelativePath(relativePath)
  } catch (err) {
    console.log(err)
    if (notExistNpmList.indexOf(npmName) < 0) {
      notExistNpmList.push(npmName)
    }
    return npmName
  }
}

function traverseObjectNode (node, obj) {
  if (node.type === 'ClassProperty' || node.type === 'ObjectProperty') {
    const properties = node.value.properties
    obj = {}
    properties.forEach(p => {
      let key = t.isIdentifier(p.key) ? p.key.name : p.key.value
      if (Util.CONFIG_MAP[buildAdapter][key]) {
        key = Util.CONFIG_MAP[buildAdapter][key]
      }
      obj[key] = traverseObjectNode(p.value)
    })
    return obj
  }
  if (node.type === 'ObjectExpression') {
    const properties = node.properties
    obj = {}
    properties.forEach(p => {
      let key = t.isIdentifier(p.key) ? p.key.name : p.key.value
      if (Util.CONFIG_MAP[buildAdapter][key]) {
        key = Util.CONFIG_MAP[buildAdapter][key]
      }
      obj[key] = traverseObjectNode(p.value)
    })
    return obj
  }
  if (node.type === 'ArrayExpression') {
    return node.elements.map(item => traverseObjectNode(item))
  }
  if (node.type === 'NullLiteral') {
    return null
  }
  return node.value
}

function analyzeImportUrl ({ astPath, value, depComponents, sourceFilePath, filePath, styleFiles, scriptFiles, jsonFiles, mediaFiles }) {
  const valueExtname = path.extname(value)
  const node = astPath.node
  if (value.indexOf('.') === 0) {
    let importPath = path.resolve(path.dirname(sourceFilePath), value)
    importPath = Util.resolveScriptPath(importPath)
    if (isFileToBePage(importPath)) {
      astPath.remove()
    } else {
      if (Util.REG_SCRIPT.test(valueExtname) || Util.REG_TYPESCRIPT.test(valueExtname)) {
        const vpath = path.resolve(sourceFilePath, '..', value)
        let fPath = value
        if (fs.existsSync(vpath) && vpath !== sourceFilePath) {
          fPath = vpath
        }
        if (scriptFiles.indexOf(fPath) < 0) {
          scriptFiles.push(fPath)
        }
      } else if (Util.REG_JSON.test(valueExtname)) {
        const vpath = path.resolve(sourceFilePath, '..', value)
        if (jsonFiles.indexOf(vpath) < 0) {
          jsonFiles.push(vpath)
        }
        if (fs.existsSync(vpath)) {
          const obj = JSON.parse(fs.readFileSync(vpath).toString())
          const specifiers = node.specifiers
          let defaultSpecifier = null
          specifiers.forEach(item => {
            if (item.type === 'ImportDefaultSpecifier') {
              defaultSpecifier = item.local.name
            }
          })
          if (defaultSpecifier) {
            let objArr = [t.nullLiteral()]
            if (Array.isArray(obj)) {
              objArr = t.arrayExpression(astConvert.array(obj))
            } else {
              objArr = t.objectExpression(astConvert.obj(obj))
            }
            astPath.replaceWith(t.variableDeclaration('const', [t.variableDeclarator(t.identifier(defaultSpecifier), objArr)]))
          }
        }
      } else if (Util.REG_FONT.test(valueExtname) || Util.REG_IMAGE.test(valueExtname) || Util.REG_MEDIA.test(valueExtname)) {
        const vpath = path.resolve(sourceFilePath, '..', value)
        if (!fs.existsSync(vpath)) {
          Util.printLog(Util.pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
          return
        }
        if (mediaFiles.indexOf(vpath) < 0) {
          mediaFiles.push(vpath)
        }
        const specifiers = node.specifiers
        let defaultSpecifier = null
        specifiers.forEach(item => {
          if (item.type === 'ImportDefaultSpecifier') {
            defaultSpecifier = item.local.name
          }
        })
        let sourceDirPath = sourceDir
        if (NODE_MODULES_REG.test(vpath)) {
          sourceDirPath = nodeModulesPath
        }

        if (defaultSpecifier) {
          astPath.replaceWith(t.variableDeclaration('const', [t.variableDeclarator(t.identifier(defaultSpecifier), t.stringLiteral(vpath.replace(sourceDirPath, '').replace(/\\/g, '/')))]))
        } else {
          astPath.remove()
        }
      } else if (Util.REG_STYLE.test(valueExtname)) {
        const stylePath = path.resolve(path.dirname(sourceFilePath), value)
        if (styleFiles.indexOf(stylePath) < 0) {
          styleFiles.push(stylePath)
        }
        astPath.remove()
      } else {
        let vpath = Util.resolveScriptPath(path.resolve(sourceFilePath, '..', value))
        let outputVpath
        if (NODE_MODULES_REG.test(vpath)) {
          outputVpath = vpath.replace(nodeModulesPath, npmOutputDir)
        } else {
          outputVpath = vpath.replace(sourceDir, outputDir)
        }
        let relativePath = path.relative(filePath, outputVpath)
        if (vpath && vpath !== sourceFilePath) {
          if (!fs.existsSync(vpath)) {
            Util.printLog(Util.pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
          } else {
            if (fs.lstatSync(vpath).isDirectory()) {
              if (fs.existsSync(path.join(vpath, 'index.js'))) {
                vpath = path.join(vpath, 'index.js')
                relativePath = path.join(relativePath, 'index.js')
              } else {
                Util.printLog(Util.pocessTypeEnum.ERROR, '引用目录', `文件 ${sourceFilePath} 中引用了目录 ${value}！`)
                return
              }
            }
            if (scriptFiles.indexOf(vpath) < 0) {
              scriptFiles.push(vpath)
            }
            relativePath = Util.promoteRelativePath(relativePath)
            relativePath = relativePath.replace(path.extname(relativePath), '.js')
            node.source.value = relativePath
          }
        }
      }
    }
  }
}

function parseAst (type, ast, depComponents, sourceFilePath, filePath, npmSkip = false) {
  const styleFiles = []
  const scriptFiles = []
  const jsonFiles = []
  const mediaFiles = []
  let configObj = {}
  let componentClassName = null
  let taroJsReduxConnect = null
  let taroMiniAppFramework = `@tarojs/taro-${buildAdapter}`
  let taroImportDefaultName
  let needExportDefault = false
  let exportTaroReduxConnected = null
  ast = babel.transformFromAst(ast, '', {
    plugins: [
      [require('babel-plugin-danger-remove-unused-import'), { ignore: ['@tarojs/taro', 'react', 'nervjs'] }],
      [require('babel-plugin-transform-define').default, constantsReplaceList]
    ]
  }).ast
  traverse(ast, {
    ClassDeclaration (astPath) {
      const node = astPath.node
      let hasCreateData = false
      if (node.superClass) {
        astPath.traverse({
          ClassMethod (astPath) {
            if (astPath.get('key').isIdentifier({ name: '_createData' })) {
              hasCreateData = true
            }
          }
        })
        if (hasCreateData) {
          needExportDefault = true
          astPath.traverse({
            ClassMethod (astPath) {
              const node = astPath.node
              if (node.kind === 'constructor') {
                astPath.traverse({
                  ExpressionStatement (astPath) {
                    const node = astPath.node
                    if (node.expression &&
                      node.expression.type === 'AssignmentExpression' &&
                      node.expression.operator === '=') {
                      const left = node.expression.left
                      if (left.type === 'MemberExpression' &&
                        left.object.type === 'ThisExpression' &&
                        left.property.type === 'Identifier' &&
                        left.property.name === 'config') {
                        configObj = traverseObjectNode(node.expression.right)
                      }
                    }
                  }
                })
              }
            }
          })
          if (node.id === null) {
            componentClassName = '_TaroComponentClass'
            astPath.replaceWith(t.classDeclaration(t.identifier(componentClassName), node.superClass, node.body, node.decorators || []))
          } else if (node.id.name === 'App') {
            componentClassName = '_App'
            astPath.replaceWith(t.classDeclaration(t.identifier(componentClassName), node.superClass, node.body, node.decorators || []))
          } else {
            componentClassName = node.id.name
          }
        }
      }
    },

    ClassExpression (astPath) {
      const node = astPath.node
      if (node.superClass) {
        let hasCreateData = false
        astPath.traverse({
          ClassMethod (astPath) {
            if (astPath.get('key').isIdentifier({ name: '_createData' })) {
              hasCreateData = true
            }
          }
        })
        if (hasCreateData) {
          needExportDefault = true
          if (node.id === null) {
            const parentNode = astPath.parentPath.node
            if (t.isVariableDeclarator(astPath.parentPath)) {
              componentClassName = parentNode.id.name
            } else {
              componentClassName = '_TaroComponentClass'
            }
            astPath.replaceWith(t.ClassExpression(t.identifier(componentClassName), node.superClass, node.body, node.decorators || []))
          } else if (node.id.name === 'App') {
            componentClassName = '_App'
            astPath.replaceWith(t.ClassExpression(t.identifier(componentClassName), node.superClass, node.body, node.decorators || []))
          } else {
            componentClassName = node.id.name
          }
        }
      }
    },

    ClassProperty (astPath) {
      const node = astPath.node
      if (node.key.name === 'config') {
        configObj = traverseObjectNode(node)
      }
    },

    ImportDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      let value = source.value
      const specifiers = node.specifiers
      // alias 替换
      if (Util.isAliasPath(value, pathAlias)) {
        value = Util.replaceAliasPath(sourceFilePath, value, pathAlias)
        source.value = value
      }
      if (Util.isNpmPkg(value) && notExistNpmList.indexOf(value) < 0) {
        if (value === taroJsComponents) {
          astPath.remove()
        } else {
          let isDepComponent = false
          if (depComponents && depComponents.length) {
            depComponents.forEach(item => {
              if (item.path === value) {
                isDepComponent = true
              }
            })
          }
          if (isDepComponent) {
            astPath.remove()
          } else {
            const specifiers = node.specifiers
            if (value === taroJsFramework) {
              let defaultSpecifier = null
              specifiers.forEach(item => {
                if (item.type === 'ImportDefaultSpecifier') {
                  defaultSpecifier = item.local.name
                }
              })
              if (defaultSpecifier) {
                taroImportDefaultName = defaultSpecifier
              }
              value = taroMiniAppFramework
            } else if (value === taroJsRedux) {
              specifiers.forEach(item => {
                if (item.type === 'ImportSpecifier') {
                  const local = item.local
                  if (local.type === 'Identifier' && local.name === 'connect') {
                    taroJsReduxConnect = item.imported.name
                  }
                }
              })
            }
            if (!npmSkip) {
              source.value = getExactedNpmFilePath(value, filePath)
            } else {
              source.value = value
            }
          }
        }
      } else if (Util.CSS_EXT.indexOf(path.extname(value)) !== -1 && specifiers.length > 0) { // 对 使用 import style from './style.css' 语法引入的做转化处理
        Util.printLog(Util.pocessTypeEnum.GENERATE, '替换代码', `为文件 ${sourceFilePath} 生成 css modules`)
        const styleFilePath = path.join(path.dirname(sourceFilePath), value)
        const styleCode = fs.readFileSync(styleFilePath).toString()
        const result = processStyleUseCssModule({
          css: styleCode,
          filePath: styleFilePath
        })
        const tokens = result.root.exports || {}
        const objectPropperties = []
        for (const key in tokens) {
          if (tokens.hasOwnProperty(key)) {
            let keyPath = key
            if (key.indexOf('-') >= 0) {
              keyPath = `'${key}'`
            }
            objectPropperties.push(t.objectProperty(t.identifier(keyPath), t.stringLiteral(tokens[key])))
          }
        }
        let defaultDeclator = null
        let normalDeclator = null
        let importItems = []
        specifiers.forEach(s => {
          if (t.isImportDefaultSpecifier(s)) {
            defaultDeclator = [t.variableDeclarator(t.identifier(s.local.name), t.objectExpression(objectPropperties))]
          } else {
            importItems.push(t.objectProperty(t.identifier(s.local.name), t.identifier(s.local.name)))
          }
        })
        normalDeclator = [t.variableDeclarator(t.objectPattern(importItems), t.objectExpression(objectPropperties))]
        if (defaultDeclator) {
          astPath.insertBefore(t.variableDeclaration('const', defaultDeclator))
        }
        if (normalDeclator) {
          astPath.insertBefore(t.variableDeclaration('const', normalDeclator))
        }
        astPath.remove()
        if (styleFiles.indexOf(styleFilePath) < 0) { // add this css file to queue
          styleFiles.push(styleFilePath)
        }
      } else if (path.isAbsolute(value)) {
        Util.printLog(Util.pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 是绝对路径！`)
      }
    },

    CallExpression (astPath) {
      const node = astPath.node
      const callee = node.callee
      if (t.isMemberExpression(callee)) {
        if (taroImportDefaultName && callee.object.name === taroImportDefaultName && callee.property.name === 'render') {
          astPath.remove()
        }
      } else if (callee.name === 'require') {
        const args = node.arguments
        let value = args[0].value
        if (Util.isAliasPath(value, pathAlias)) {
          value = Util.replaceAliasPath(sourceFilePath, value, pathAlias)
          args[0].value = value
        }
        if (Util.isNpmPkg(value) && notExistNpmList.indexOf(value) < 0) {
          if (value === taroJsComponents) {
            astPath.remove()
          } else {
            let isDepComponent = false
            if (depComponents && depComponents.length) {
              depComponents.forEach(item => {
                if (item.path === value) {
                  isDepComponent = true
                }
              })
            }
            if (isDepComponent) {
              astPath.remove()
            } else {
              if (t.isVariableDeclaration(astPath.parentPath.parentPath)) {
                const parentNode = astPath.parentPath.parentPath.node
                if (parentNode.declarations.length === 1 && parentNode.declarations[0].init) {
                  const id = parentNode.declarations[0].id
                  if (value === taroJsFramework && id.type === 'Identifier') {
                    taroImportDefaultName = id.name
                    value = taroMiniAppFramework
                  } else if (value === taroJsRedux) {
                    const declarations = parentNode.declarations
                    declarations.forEach(item => {
                      const id = item.id
                      if (id.type === 'ObjectPattern') {
                        const properties = id.properties
                        properties.forEach(p => {
                          if (p.type === 'ObjectProperty') {
                            if (p.value.type === 'Identifier' && p.value.name === 'connect') {
                              taroJsReduxConnect = p.key.name
                            }
                          }
                        })
                      }
                    })
                  }
                }
              }
              if (!npmSkip) {
                args[0].value = getExactedNpmFilePath(value, filePath)
              } else {
                args[0].value = value
              }
            }
          }
        } else if (Util.CSS_EXT.indexOf(path.extname(value)) !== -1 && t.isVariableDeclarator(astPath.parentPath)) { // 对 使用 const style = require('./style.css') 语法引入的做转化处理
          Util.printLog(Util.pocessTypeEnum.GENERATE, '替换代码', `为文件 ${sourceFilePath} 生成 css modules`)
          const styleFilePath = path.join(path.dirname(sourceFilePath), value)
          const styleCode = fs.readFileSync(styleFilePath).toString()
          const result = processStyleUseCssModule({
            css: styleCode,
            filePath: styleFilePath
          })
          const tokens = result.root.exports || {}
          const objectPropperties = []
          for (const key in tokens) {
            if (tokens.hasOwnProperty(key)) {
              objectPropperties.push(t.objectProperty(t.identifier(key), t.stringLiteral(tokens[key])))
            }
          }
          astPath.replaceWith(t.objectExpression(objectPropperties))
          if (styleFiles.indexOf(styleFilePath) < 0) { // add this css file to queue
            styleFiles.push(styleFilePath)
          }
        } else if (path.isAbsolute(value)) {
          Util.printLog(Util.pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 是绝对路径！`)
        }
      }
    },

    ExportDefaultDeclaration (astPath) {
      const node = astPath.node
      const declaration = node.declaration
      needExportDefault = false
      if (
        declaration &&
        (declaration.type === 'ClassDeclaration' || declaration.type === 'ClassExpression')
      ) {
        const superClass = declaration.superClass
        if (superClass) {
          let hasCreateData = false
          astPath.traverse({
            ClassMethod (astPath) {
              if (astPath.get('key').isIdentifier({ name: '_createData' })) {
                hasCreateData = true
              }
            }
          })
          if (hasCreateData) {
            needExportDefault = true
            if (declaration.id === null) {
              componentClassName = '_TaroComponentClass'
            } else if (declaration.id.name === 'App') {
              componentClassName = '_App'
            } else {
              componentClassName = declaration.id.name
            }
            const isClassDcl = declaration.type === 'ClassDeclaration'
            const classDclProps = [t.identifier(componentClassName), superClass, declaration.body, declaration.decorators || []]
            astPath.replaceWith(isClassDcl ? t.classDeclaration.apply(null, classDclProps) : t.classExpression.apply(null, classDclProps))
          }
        }
      } else if (declaration.type === 'CallExpression') {
        const callee = declaration.callee
        if (callee && callee.type === 'CallExpression') {
          const subCallee = callee.callee
          if (subCallee.type === 'Identifier' && subCallee.name === taroJsReduxConnect) {
            const args = declaration.arguments
            if (args.length === 1 && args[0].name === componentClassName) {
              needExportDefault = true
              exportTaroReduxConnected = `${componentClassName}__Connected`
              astPath.replaceWith(t.variableDeclaration('const', [t.variableDeclarator(t.identifier(`${componentClassName}__Connected`), t.CallExpression(declaration.callee, declaration.arguments))]))
            }
          }
        }
      }
    },

    ExportNamedDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      if (source && source.type === 'StringLiteral') {
        const value = source.value
        analyzeImportUrl({ astPath, value, depComponents, sourceFilePath, filePath, styleFiles, scriptFiles, jsonFiles, mediaFiles })
      }
    },

    ExportAllDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      if (source && source.type === 'StringLiteral') {
        const value = source.value
        analyzeImportUrl({ astPath, value, depComponents, sourceFilePath, filePath, styleFiles, scriptFiles, jsonFiles, mediaFiles })
      }
    },

    Program: {
      exit (astPath) {
        astPath.traverse({
          ImportDeclaration (astPath) {
            const node = astPath.node
            const source = node.source
            let value = source.value
            analyzeImportUrl({ astPath, value, depComponents, sourceFilePath, filePath, styleFiles, scriptFiles, jsonFiles, mediaFiles })
          },
          CallExpression (astPath) {
            const node = astPath.node
            const callee = node.callee
            if (callee.name === 'require') {
              const args = node.arguments
              let value = args[0].value
              const valueExtname = path.extname(value)
              if (value.indexOf('.') === 0) {
                let importPath = path.resolve(path.dirname(sourceFilePath), value)
                importPath = Util.resolveScriptPath(importPath)
                if (isFileToBePage(importPath)) {
                  if (astPath.parent.type === 'AssignmentExpression' || 'ExpressionStatement') {
                    astPath.parentPath.remove()
                  } else if (astPath.parent.type === 'VariableDeclarator') {
                    astPath.parentPath.parentPath.remove()
                  } else {
                    astPath.remove()
                  }
                } else {
                  if (Util.REG_STYLE.test(valueExtname)) {
                    const stylePath = path.resolve(path.dirname(sourceFilePath), value)
                    if (styleFiles.indexOf(stylePath) < 0) {
                      styleFiles.push(stylePath)
                    }
                    if (astPath.parent.type === 'AssignmentExpression' || 'ExpressionStatement') {
                      astPath.parentPath.remove()
                    } else if (astPath.parent.type === 'VariableDeclarator') {
                      astPath.parentPath.parentPath.remove()
                    } else {
                      astPath.remove()
                    }
                  } else if (Util.REG_JSON.test(valueExtname)) {
                    const vpath = path.resolve(sourceFilePath, '..', value)
                    if (jsonFiles.indexOf(vpath) < 0) {
                      jsonFiles.push(vpath)
                    }
                    if (fs.existsSync(vpath)) {
                      const obj = JSON.parse(fs.readFileSync(vpath).toString())
                      let objArr = [t.nullLiteral()]
                      if (Array.isArray(obj)) {
                        objArr = t.arrayExpression(astConvert.array(obj))
                      } else {
                        objArr = t.objectExpression(astConvert.obj(obj))
                      }
                      astPath.replaceWith(t.objectExpression(objArr))
                    }
                  } else if (Util.REG_SCRIPT.test(valueExtname) || Util.REG_TYPESCRIPT.test(valueExtname)) {
                    const vpath = path.resolve(sourceFilePath, '..', value)
                    let fPath = value
                    if (fs.existsSync(vpath) && vpath !== sourceFilePath) {
                      fPath = vpath
                    }
                    if (scriptFiles.indexOf(fPath) < 0) {
                      scriptFiles.push(fPath)
                    }
                  } else if (Util.REG_FONT.test(valueExtname) || Util.REG_IMAGE.test(valueExtname) || Util.REG_MEDIA.test(valueExtname)) {
                    const vpath = path.resolve(sourceFilePath, '..', value)
                    if (mediaFiles.indexOf(vpath) < 0) {
                      mediaFiles.push(vpath)
                    }
                    let sourceDirPath = sourceDir
                    if (NODE_MODULES_REG.test(vpath)) {
                      sourceDirPath = nodeModulesPath
                    }
                    astPath.replaceWith(t.stringLiteral(vpath.replace(sourceDirPath, '').replace(/\\/g, '/')))
                  } else {
                    let vpath = Util.resolveScriptPath(path.resolve(sourceFilePath, '..', value))
                    let outputVpath
                    if (NODE_MODULES_REG.test(vpath)) {
                      outputVpath = vpath.replace(nodeModulesPath, npmOutputDir)
                    } else {
                      outputVpath = vpath.replace(sourceDir, outputDir)
                    }
                    let relativePath = path.relative(filePath, outputVpath)
                    if (vpath) {
                      if (!fs.existsSync(vpath)) {
                        Util.printLog(Util.pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
                      } else {
                        if (fs.lstatSync(vpath).isDirectory()) {
                          if (fs.existsSync(path.join(vpath, 'index.js'))) {
                            vpath = path.join(vpath, 'index.js')
                            relativePath = path.join(relativePath, 'index.js')
                          } else {
                            Util.printLog(Util.pocessTypeEnum.ERROR, '引用目录', `文件 ${sourceFilePath} 中引用了目录 ${value}！`)
                            return
                          }
                        }
                        if (scriptFiles.indexOf(vpath) < 0) {
                          scriptFiles.push(vpath)
                        }
                        relativePath = Util.promoteRelativePath(relativePath)
                        relativePath = relativePath.replace(path.extname(relativePath), '.js')
                        args[0].value = relativePath
                      }
                    }
                  }
                }
              }
            }
          }
        })
        const node = astPath.node
        const exportVariableName = exportTaroReduxConnected || componentClassName
        if (needExportDefault) {
          const exportDefault = template(`export default ${exportVariableName}`, babylonConfig)()
          node.body.push(exportDefault)
        }
        const taroMiniAppFrameworkPath = !npmSkip ? getExactedNpmFilePath(taroMiniAppFramework, filePath) : taroMiniAppFramework
        switch (type) {
          case PARSE_AST_TYPE.ENTRY:
            const pxTransformConfig = {
              designWidth: projectConfig.designWidth || 750
            }
            if (projectConfig.hasOwnProperty(DEVICE_RATIO)) {
              pxTransformConfig[DEVICE_RATIO] = projectConfig.deviceRatio
            }
            node.body.push(template(`App(require('${taroMiniAppFrameworkPath}').default.createApp(${exportVariableName}))`, babylonConfig)())
            node.body.push(template(`Taro.initPxTransform(${JSON.stringify(pxTransformConfig)})`, babylonConfig)())
            break
          case PARSE_AST_TYPE.PAGE:
            if (buildAdapter === Util.BUILD_TYPES.WEAPP) {
              node.body.push(template(`Component(require('${taroMiniAppFrameworkPath}').default.createComponent(${exportVariableName}, true))`, babylonConfig)())
            } else {
              node.body.push(template(`Page(require('${taroMiniAppFrameworkPath}').default.createComponent(${exportVariableName}, true))`, babylonConfig)())
            }
            break
          case PARSE_AST_TYPE.COMPONENT:
            node.body.push(template(`Component(require('${taroMiniAppFrameworkPath}').default.createComponent(${exportVariableName}))`, babylonConfig)())
            break
          default:
            break
        }
      }
    }
  })
  return {
    code: generate(ast).code,
    styleFiles,
    scriptFiles,
    jsonFiles,
    configObj,
    mediaFiles,
    componentClassName
  }
}

function parseComponentExportAst (ast, componentName, componentPath, componentType) {
  let componentRealPath = null
  let importExportName
  ast = babel.transformFromAst(ast, '', {
    plugins: [
      [require('babel-plugin-transform-define').default, constantsReplaceList]
    ]
  }).ast
  traverse(ast, {
    ExportNamedDeclaration (astPath) {
      const node = astPath.node
      const specifiers = node.specifiers
      const source = node.source
      if (source && source.type === 'StringLiteral') {
        specifiers.forEach(specifier => {
          const exported = specifier.exported
          if (_.kebabCase(exported.name) === componentName) {
            componentRealPath = Util.resolveScriptPath(path.resolve(path.dirname(componentPath), source.value))
          }
        })
      } else {
        specifiers.forEach(specifier => {
          const exported = specifier.exported
          if (_.kebabCase(exported.name) === componentName) {
            importExportName = exported.name
          }
        })
      }
    },

    ExportDefaultDeclaration (astPath) {
      const node = astPath.node
      const declaration = node.declaration
      if (componentType === 'default') {
        importExportName = declaration.name
      }
    },

    CallExpression (astPath) {
      if (astPath.get('callee').isIdentifier({ name: 'require' })) {
        const arg = astPath.get('arguments')[0]
        if (t.isStringLiteral(arg.node)) {
          componentRealPath = Util.resolveScriptPath(path.resolve(path.dirname(componentPath), arg.node.value))
        }
      }
    },

    Program: {
      exit (astPath) {
        astPath.traverse({
          ImportDeclaration (astPath) {
            const node = astPath.node
            const specifiers = node.specifiers
            const source = node.source
            if (importExportName) {
              specifiers.forEach(specifier => {
                const local = specifier.local
                if (local.name === importExportName) {
                  componentRealPath = Util.resolveScriptPath(path.resolve(path.dirname(componentPath), source.value))
                }
              })
            }
          }
        })
      }
    }
  })
  return componentRealPath
}

function isFileToBeTaroComponent (code, sourcePath, outputPath) {
  const transformResult = wxTransformer({
    code,
    sourcePath: sourcePath,
    outputPath: outputPath,
    isNormal: true,
    isTyped: Util.REG_TYPESCRIPT.test(sourcePath),
    adapter: buildAdapter,
    env: constantsReplaceList
  })
  const { ast } = transformResult
  let isTaroComponent = false

  traverse(ast, {
    ClassDeclaration (astPath) {
      astPath.traverse({
        ClassMethod (astPath) {
          if (astPath.get('key').isIdentifier({ name: 'render' })) {
            astPath.traverse({
              JSXElement () {
                isTaroComponent = true
              }
            })
          }
        }
      })
    },

    ClassExpression (astPath) {
      astPath.traverse({
        ClassMethod (astPath) {
          if (astPath.get('key').isIdentifier({ name: 'render' })) {
            astPath.traverse({
              JSXElement () {
                isTaroComponent = true
              }
            })
          }
        }
      })
    }
  })

  return {
    isTaroComponent,
    transformResult
  }
}

function isFileToBePage (filePath) {
  let isPage = false
  const extname = path.extname(filePath)
  const pages = appConfig.pages || []
  const filePathWithoutExt = filePath.replace(extname, '')
  pages.forEach(page => {
    if (filePathWithoutExt === path.join(sourceDir, page)) {
      isPage = true
    }
  })
  return isPage && Util.REG_SCRIPTS.test(extname)
}

function copyFilesFromSrcToOutput (files) {
  files.forEach(file => {
    let outputFilePath
    if (NODE_MODULES_REG.test(file)) {
      outputFilePath = file.replace(nodeModulesPath, npmOutputDir)
    } else {
      outputFilePath = file.replace(sourceDir, outputDir)
    }
    if (isCopyingFiles[outputFilePath]) {
      return
    }
    isCopyingFiles[outputFilePath] = true
    let modifySrc = file.replace(appPath + path.sep, '')
    modifySrc = modifySrc.split(path.sep).join('/')
    let modifyOutput = outputFilePath.replace(appPath + path.sep, '')
    modifyOutput = modifyOutput.split(path.sep).join('/')
    Util.printLog(Util.pocessTypeEnum.COPY, '文件', modifyOutput)
    if (!fs.existsSync(file)) {
      Util.printLog(Util.pocessTypeEnum.ERROR, '文件', `${modifySrc} 不存在`)
    } else {
      fs.ensureDir(path.dirname(outputFilePath))
      if (file === outputFilePath) {
        return
      }
      fs.copySync(file, outputFilePath)
    }
  })
}

const babelConfig = _.mergeWith({}, defaultBabelConfig, pluginsConfig.babel, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return Array.from(new Set(srcValue.concat(objValue)))
  }
})

const shouldTransformAgain = (function () {
  const pluginsStr = JSON.stringify(babelConfig.plugins)
  if (/transform-runtime/.test(pluginsStr)) {
    return true
  }
  return false
})()

async function compileScriptFile (content, sourceFilePath, outputFilePath, adapter) {
  const compileScriptRes = await npmProcess.callPlugin('babel', content, sourceFilePath, babelConfig)
  const code = compileScriptRes.code
  if (!shouldTransformAgain) {
    return code
  }
  const transformResult = wxTransformer({
    code,
    sourcePath: sourceFilePath,
    outputPath: outputFilePath,
    isNormal: true,
    isTyped: false,
    adapter,
    env: constantsReplaceList
  })
  const res = parseAst(PARSE_AST_TYPE.NORMAL, transformResult.ast, [], sourceFilePath, outputFilePath)
  return res.code
}

async function checkCliAndFrameworkVersion () {
  const frameworkName = `@tarojs/taro-${buildAdapter}`
  const frameworkVersion = Util.getInstalledNpmPkgVersion(frameworkName, nodeModulesPath)
  if (frameworkVersion) {
    if (frameworkVersion !== Util.getPkgVersion()) {
      Util.printLog(Util.pocessTypeEnum.ERROR, '版本问题', `Taro CLI 与本地安装的小程序框架 ${frameworkName} 版本不一致，请确保一致`)
      console.log(`Taro CLI: ${Util.getPkgVersion()}`)
      console.log(`${frameworkName}: ${frameworkVersion}`)
      process.exit(1)
    }
  } else {
    Util.printLog(Util.pocessTypeEnum.WARNING, '依赖安装', chalk.red(`项目依赖 ${frameworkName} 未安装，或安装有误！`))
  }
}

function buildProjectConfig () {
  let projectConfigFileName = `project.${buildAdapter}.json`
  if (buildAdapter === Util.BUILD_TYPES.WEAPP) {
    projectConfigFileName = 'project.config.json'
  }
  let projectConfigPath = path.join(appPath, projectConfigFileName)

  if (!fs.existsSync(projectConfigPath)) {
    projectConfigPath = path.join(sourceDir, projectConfigFileName)
    if (!fs.existsSync(projectConfigPath)) return
  }

  const origProjectConfig = fs.readJSONSync(projectConfigPath)
  if (buildAdapter === Util.BUILD_TYPES.TT) {
    projectConfigFileName = 'project.config.json'
  }
  fs.ensureDirSync(outputDir)
  fs.writeFileSync(
    path.join(outputDir, projectConfigFileName),
    JSON.stringify(Object.assign({}, origProjectConfig, { miniprogramRoot: './' }), null, 2)
  )
  Util.printLog(Util.pocessTypeEnum.GENERATE, '工具配置', `${outputDirName}/${projectConfigFileName}`)
}

async function buildFrameworkInfo () {
  // 百度小程序编译出 .frameworkinfo 文件
  if (buildAdapter === Util.BUILD_TYPES.SWAN) {
    const frameworkInfoFileName = '.frameworkinfo'
    const frameworkName = `@tarojs/taro-${buildAdapter}`
    const frameworkVersion = Util.getInstalledNpmPkgVersion(frameworkName, nodeModulesPath)
    if (frameworkVersion) {
      const frameworkinfo = {
        toolName: 'Taro',
        toolCliVersion: Util.getPkgVersion(),
        toolFrameworkVersion: frameworkVersion,
        createTime: new Date(projectConfig.date).getTime()
      }
      fs.writeFileSync(
        path.join(outputDir, frameworkInfoFileName),
        JSON.stringify(frameworkinfo, null, 2)
      )
      Util.printLog(Util.pocessTypeEnum.GENERATE, '框架信息', `${outputDirName}/${frameworkInfoFileName}`)
    } else {
      Util.printLog(Util.pocessTypeEnum.WARNING, '依赖安装', chalk.red(`项目依赖 ${frameworkName} 未安装，或安装有误！`))
    }
  }
}

function buildWorkers (worker) {
  Util.printLog(Util.pocessTypeEnum.COMPILE, 'Workers', '编译 worker 相关文件')
  const workerDir = path.join(sourceDir, worker)
  function fileRecursiveSearch (fileDir) {
    fs.readdir(fileDir, (err, files) => {
      if (err) {
        console.warn(err)
      } else {
        files.forEach(filename => {
          const filePath = path.join(fileDir, filename)
          fs.stat(filePath, (err, stats) => {
            if (err) {
              console.warn(err)
            } else {
              const isFile = stats.isFile()
              const isDir = stats.isDirectory()
              if (isFile) {
                if (Util.REG_SCRIPTS.test(filePath)) {
                  compileDepScripts([filePath])
                } else {
                  copyFilesFromSrcToOutput([filePath])
                }
              } else if (isDir) {
                fileRecursiveSearch(filePath)
              }
            }
          })
        })
      }
    })
  }
  fileRecursiveSearch(workerDir)
}

async function buildCustomTabbar () {
  const customTabbarPath = path.join(sourceDir, 'custom-tab-bar')
  const customTabbarJSPath = Util.resolveScriptPath(customTabbarPath)
  await buildSingleComponent({
    path: customTabbarJSPath,
    name: 'custom-tab-bar'
  })
}

async function buildEntry () {
  Util.printLog(Util.pocessTypeEnum.COMPILE, '入口文件', `${sourceDirName}/${entryFileName}`)
  const entryFileCode = fs.readFileSync(entryFilePath).toString()
  try {
    const transformResult = wxTransformer({
      code: entryFileCode,
      sourcePath: entryFilePath,
      outputPath: outputEntryFilePath,
      isApp: true,
      isTyped: Util.REG_TYPESCRIPT.test(entryFilePath),
      adapter: buildAdapter,
      env: constantsReplaceList
    })
    // app.js的template忽略
    const res = parseAst(PARSE_AST_TYPE.ENTRY, transformResult.ast, [], entryFilePath, outputEntryFilePath)
    let resCode = res.code
    resCode = await compileScriptFile(resCode, entryFilePath, outputEntryFilePath, buildAdapter)
    if (isProduction) {
      const uglifyPluginConfig = pluginsConfig.uglify || { enable: true }
      if (uglifyPluginConfig.enable) {
        const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
        const uglifyResult = npmProcess.callPluginSync('uglifyjs', resCode, entryFilePath, uglifyConfig)
        if (uglifyResult.error) {
          Util.printLog(Util.pocessTypeEnum.ERROR, '压缩错误', `文件${entryFilePath}`)
          console.log(uglifyResult.error)
        } else {
          resCode = uglifyResult.code
        }
      }
    }
    if (appOutput) {
      fs.writeFileSync(path.join(outputDir, 'app.json'), JSON.stringify(res.configObj, null, 2))
      Util.printLog(Util.pocessTypeEnum.GENERATE, '入口配置', `${outputDirName}/app.json`)
      fs.writeFileSync(path.join(outputDir, 'app.js'), resCode)
      Util.printLog(Util.pocessTypeEnum.GENERATE, '入口文件', `${outputDirName}/app.js`)
    }
    if (res.configObj.workers) {
      buildWorkers(res.configObj.workers)
    }
    if (res.configObj.tabBar && res.configObj.tabBar.custom) {
      await buildCustomTabbar()
    }
    const fileDep = dependencyTree[entryFilePath] || {}
    // 编译依赖的脚本文件
    if (Util.isDifferentArray(fileDep['script'], res.scriptFiles)) {
      compileDepScripts(res.scriptFiles)
    }
    // 编译样式文件
    if (Util.isDifferentArray(fileDep['style'], res.styleFiles) && appOutput) {
      await compileDepStyles(path.join(outputDir, `app${outputFilesTypes.STYLE}`), res.styleFiles, false)
      Util.printLog(Util.pocessTypeEnum.GENERATE, '入口样式', `${outputDirName}/app${outputFilesTypes.STYLE}`)
    }
    // 拷贝依赖文件
    if (Util.isDifferentArray(fileDep['json'], res.jsonFiles)) {
      copyFilesFromSrcToOutput(res.jsonFiles)
    }

    // 处理res.configObj 中的tabBar配置
    const tabBar = res.configObj.tabBar
    if (tabBar && typeof tabBar === 'object' && !Util.isEmptyObject(tabBar)) {
      const {
        list: listConfig,
        iconPath: pathConfig,
        selectedIconPath: selectedPathConfig
      } = Util.CONFIG_MAP[buildAdapter]
      const list = tabBar[listConfig] || []
      let tabBarIcons = []
      list.forEach(item => {
        item[pathConfig] && tabBarIcons.push(item[pathConfig])
        item[selectedPathConfig] && tabBarIcons.push(item[selectedPathConfig])
      })
      tabBarIcons = tabBarIcons.map(item => path.resolve(sourceDir, item))
      if (tabBarIcons && tabBarIcons.length) {
        res.mediaFiles = res.mediaFiles.concat(tabBarIcons)
      }
    }
    if (Util.isDifferentArray(fileDep['media'], res.mediaFiles)) {
      copyFilesFromSrcToOutput(res.mediaFiles)
    }
    fileDep['style'] = res.styleFiles
    fileDep['script'] = res.scriptFiles
    fileDep['json'] = res.jsonFiles
    fileDep['media'] = res.mediaFiles
    dependencyTree[entryFilePath] = fileDep
    return res.configObj
  } catch (err) {
    console.log(err)
  }
}

async function buildPages () {
  Util.printLog(Util.pocessTypeEnum.COMPILE, '所有页面')
  // 支持分包，解析子包页面
  const pages = appConfig.pages || []
  const subPackages = appConfig.subPackages || appConfig.subpackages
  if (subPackages && subPackages.length) {
    subPackages.forEach(item => {
      if (item.pages && item.pages.length) {
        const root = item.root
        item.pages.forEach(page => {
          let pagePath = `${root}/${page}`
          pagePath = pagePath.replace(/\/{2,}/g, '/')
          if (pages.indexOf(pagePath) < 0) {
            pages.push(pagePath)
          }
        })
      }
    })
  }
  const pagesPromises = pages.map(async page => {
    return buildSinglePage(page)
  })
  await Promise.all(pagesPromises)
}

function processNativeWxml (componentWXMLPath, componentWXMLContent, outputComponentWXMLPath) {
  let wxmlContent
  let needCopy = true
  if (componentWXMLPath && fs.existsSync(componentWXMLPath)) {
    wxmlContent = fs.readFileSync(componentWXMLPath).toString()
  } else {
    needCopy = false
    wxmlContent = componentWXMLContent
  }
  const importWxmlPathList = []
  let regResult
  while ((regResult = Util.REG_WXML_IMPORT.exec(wxmlContent)) != null) {
    importWxmlPathList.push(regResult[2] || regResult[3])
  }
  if (importWxmlPathList.length) {
    importWxmlPathList.forEach(item => {
      const itemPath = path.resolve(componentWXMLPath, '..', item)
      if (fs.existsSync(itemPath)) {
        const outputItemPath = itemPath.replace(sourceDir, outputDir)
        processNativeWxml(itemPath, null, outputItemPath)
      }
    })
  }
  if (componentWXMLPath === outputComponentWXMLPath || !needCopy) {
    return
  }
  copyFileSync(componentWXMLPath, outputComponentWXMLPath)
}

function transfromNativeComponents (configFile, componentConfig) {
  const usingComponents = componentConfig.usingComponents
  if (usingComponents && !Util.isEmptyObject(usingComponents)) {
    Object.keys(usingComponents).map(async item => {
      let componentPath = usingComponents[item]

      if (Util.isAliasPath(componentPath, pathAlias)) {
        componentPath = Util.replaceAliasPath(configFile, componentPath, pathAlias)
        usingComponents[item] = componentPath
      }

      if (/^plugin:\/\//.test(componentPath)) {
        // 小程序 plugin
        Util.printLog(Util.pocessTypeEnum.REFERENCE, '插件引用', `使用了插件 ${chalk.bold(componentPath)}`)
        return
      }
      let componentJSPath = Util.resolveScriptPath(path.resolve(path.dirname(configFile), componentPath))
      if (!fs.existsSync(componentJSPath)) {
        componentJSPath = Util.resolveScriptPath(path.join(sourceDir, componentPath))
      }
      const componentJSONPath = componentJSPath.replace(path.extname(componentJSPath), outputFilesTypes.CONFIG)
      const componentWXMLPath = componentJSPath.replace(path.extname(componentJSPath), outputFilesTypes.TEMPL)
      const componentWXSSPath = componentJSPath.replace(path.extname(componentJSPath), outputFilesTypes.STYLE)
      const outputComponentJSPath = componentJSPath.replace(sourceDir, outputDir).replace(path.extname(componentJSPath), outputFilesTypes.SCRIPT)
      if (fs.existsSync(componentJSPath)) {
        const componentJSContent = fs.readFileSync(componentJSPath).toString()
        if (componentJSContent.indexOf(taroJsFramework) >= 0 && !fs.existsSync(componentWXMLPath)) {
          const buildDepComponentsRes = await buildDepComponents([componentJSPath])
          return buildDepComponentsRes
        }
        compileDepScripts([componentJSPath])
      } else {
        return Util.printLog(Util.pocessTypeEnum.ERROR, '编译错误', `原生组件文件 ${componentJSPath} 不存在！`)
      }
      if (fs.existsSync(componentWXMLPath)) {
        const outputComponentWXMLPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), outputFilesTypes.TEMPL)
        processNativeWxml(componentWXMLPath, null, outputComponentWXMLPath)
      }
      if (fs.existsSync(componentWXSSPath)) {
        const outputComponentWXSSPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), outputFilesTypes.STYLE)
        await compileDepStyles(outputComponentWXSSPath, [componentWXSSPath], true)
      }
      if (fs.existsSync(componentJSONPath)) {
        const componentJSON = require(componentJSONPath)
        const outputComponentJSONPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), outputFilesTypes.CONFIG)
        copyFileSync(componentJSONPath, outputComponentJSONPath)

        // 解决组件循环依赖不断编译爆栈的问题
        if (componentJSON && componentJSON.usingComponents) {
          Object.keys(componentJSON.usingComponents).forEach(key => {
            if (key === item) {
              delete componentJSON.usingComponents[key]
            }
          })
        }

        transfromNativeComponents(componentJSONPath, componentJSON)
      }
    })
  }
}

// 小程序页面编译
async function buildSinglePage (page) {
  Util.printLog(Util.pocessTypeEnum.COMPILE, '页面文件', `${sourceDirName}/${page}`)
  const pagePath = path.join(sourceDir, `${page}`)
  let pageJs = Util.resolveScriptPath(pagePath)
  if (!fs.existsSync(pageJs)) {
    Util.printLog(Util.pocessTypeEnum.ERROR, '页面文件', `${sourceDirName}/${page} 不存在！`)
    return
  }
  const pageJsContent = fs.readFileSync(pageJs).toString()
  const outputPageJSPath = pageJs.replace(sourceDir, outputDir).replace(path.extname(pageJs), outputFilesTypes.SCRIPT)
  const outputPagePath = path.dirname(outputPageJSPath)
  const outputPageJSONPath = outputPageJSPath.replace(path.extname(outputPageJSPath), outputFilesTypes.CONFIG)
  const outputPageWXMLPath = outputPageJSPath.replace(path.extname(outputPageJSPath), outputFilesTypes.TEMPL)
  const outputPageWXSSPath = outputPageJSPath.replace(path.extname(outputPageJSPath), outputFilesTypes.STYLE)
  // 判断是不是小程序原生代码页面
  const pageWXMLPath = pageJs.replace(path.extname(pageJs), outputFilesTypes.TEMPL)
  if (fs.existsSync(pageWXMLPath) && pageJsContent.indexOf(taroJsFramework) < 0) {
    const pageJSONPath = pageJs.replace(path.extname(pageJs), outputFilesTypes.CONFIG)
    const pageWXSSPath = pageJs.replace(path.extname(pageJs), outputFilesTypes.STYLE)
    if (fs.existsSync(pageJSONPath)) {
      const pageJSON = require(pageJSONPath)
      copyFileSync(pageJSONPath, outputPageJSONPath)
      transfromNativeComponents(pageJSONPath, pageJSON)
    }
    compileDepScripts([pageJs])
    copyFileSync(pageWXMLPath, outputPageWXMLPath)
    if (fs.existsSync(pageWXSSPath)) {
      await compileDepStyles(outputPageWXSSPath, [pageWXSSPath], false)
    }
    return
  }
  try {
    const transformResult = wxTransformer({
      code: pageJsContent,
      sourcePath: pageJs,
      outputPath: outputPageJSPath,
      isRoot: true,
      isTyped: Util.REG_TYPESCRIPT.test(pageJs),
      adapter: buildAdapter,
      env: constantsReplaceList
    })
    const pageDepComponents = transformResult.components
    const compressTemplate = useCompileConf.compressTemplate
    const pageWXMLContent = (isProduction && compressTemplate) ? transformResult.compressedTemplate : transformResult.template
    const res = parseAst(PARSE_AST_TYPE.PAGE, transformResult.ast, pageDepComponents, pageJs, outputPageJSPath)
    let resCode = res.code
    resCode = await compileScriptFile(resCode, pageJs, outputPageJSPath, buildAdapter)
    if (isProduction) {
      const uglifyPluginConfig = pluginsConfig.uglify || { enable: true }
      if (uglifyPluginConfig.enable) {
        const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
        const uglifyResult = npmProcess.callPluginSync('uglifyjs', resCode, outputPageJSPath, uglifyConfig)
        if (uglifyResult.error) {
          Util.printLog(Util.pocessTypeEnum.ERROR, '压缩错误', `文件${pageJs}`)
          console.log(uglifyResult.error)
        } else {
          resCode = uglifyResult.code
        }
      }
    }
    fs.ensureDirSync(outputPagePath)
    const { usingComponents = {} } = res.configObj
    if (usingComponents && !Util.isEmptyObject(usingComponents)) {
      const keys = Object.keys(usingComponents)
      keys.forEach(item => {
        pageDepComponents.forEach(component => {
          if (_.camelCase(item) === _.camelCase(component.name)) {
            delete usingComponents[item]
          }
        })
      })
      transfromNativeComponents(outputPageJSONPath.replace(outputDir, sourceDir), res.configObj)
    }
    const fileDep = dependencyTree[pageJs] || {}
    // 编译依赖的组件文件
    let buildDepComponentsResult = []
    let realComponentsPathList = []
    if (pageDepComponents.length) {
      realComponentsPathList = getRealComponentsPathList(pageJs, pageDepComponents)
      res.scriptFiles = res.scriptFiles.map(item => {
        for (let i = 0; i < realComponentsPathList.length; i++) {
          const componentObj = realComponentsPathList[i]
          const componentPath = componentObj.path
          if (item === componentPath) {
            return null
          }
        }
        return item
      }).filter(item => item)
      buildDepComponentsResult = await buildDepComponents(realComponentsPathList)
    }
    if (!Util.isEmptyObject(componentExportsMap) && realComponentsPathList.length) {
      const mapKeys = Object.keys(componentExportsMap)
      realComponentsPathList.forEach(component => {
        if (mapKeys.indexOf(component.path) >= 0) {
          const componentMap = componentExportsMap[component.path]
          componentMap.forEach(component => {
            pageDepComponents.forEach(depComponent => {
              if (depComponent.name === component.name) {
                let componentPath = component.path
                let realPath
                if (NODE_MODULES_REG.test(componentPath)) {
                  componentPath = componentPath.replace(nodeModulesPath, npmOutputDir)
                  realPath = Util.promoteRelativePath(path.relative(outputPageJSPath, componentPath))
                } else {
                  realPath = Util.promoteRelativePath(path.relative(pageJs, componentPath))
                }
                depComponent.path = realPath.replace(path.extname(realPath), '')
              }
            })
          })
        }
      })
    }
    fs.writeFileSync(outputPageJSONPath, JSON.stringify(_.merge({}, buildUsingComponents(pageJs, pageDepComponents), res.configObj), null, 2))
    Util.printLog(Util.pocessTypeEnum.GENERATE, '页面配置', `${outputDirName}/${page}${outputFilesTypes.CONFIG}`)
    fs.writeFileSync(outputPageJSPath, resCode)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '页面逻辑', `${outputDirName}/${page}${outputFilesTypes.SCRIPT}`)
    fs.writeFileSync(outputPageWXMLPath, pageWXMLContent)
    processNativeWxml(outputPageWXMLPath.replace(outputDir, sourceDir), pageWXMLContent, outputPageWXMLPath)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '页面模板', `${outputDirName}/${page}${outputFilesTypes.TEMPL}`)
    // 编译依赖的脚本文件
    if (Util.isDifferentArray(fileDep['script'], res.scriptFiles)) {
      compileDepScripts(res.scriptFiles)
    }
    // 编译样式文件
    if (Util.isDifferentArray(fileDep['style'], res.styleFiles) || Util.isDifferentArray(depComponents[pageJs], pageDepComponents)) {
      Util.printLog(Util.pocessTypeEnum.GENERATE, '页面样式', `${outputDirName}/${page}${outputFilesTypes.STYLE}`)
      const depStyleList = getDepStyleList(outputPageWXSSPath, buildDepComponentsResult)
      wxssDepTree[outputPageWXSSPath] = depStyleList
      await compileDepStyles(outputPageWXSSPath, res.styleFiles, false)
    }
    // 拷贝依赖文件
    if (Util.isDifferentArray(fileDep['json'], res.jsonFiles)) {
      copyFilesFromSrcToOutput(res.jsonFiles)
    }
    if (Util.isDifferentArray(fileDep['media'], res.mediaFiles)) {
      copyFilesFromSrcToOutput(res.mediaFiles)
    }
    depComponents[pageJs] = pageDepComponents
    fileDep['style'] = res.styleFiles
    fileDep['script'] = res.scriptFiles
    fileDep['json'] = res.jsonFiles
    fileDep['media'] = res.mediaFiles
    dependencyTree[pageJs] = fileDep
  } catch (err) {
    Util.printLog(Util.pocessTypeEnum.ERROR, '页面编译', `页面${pagePath}编译失败！`)
    console.log(err)
  }
}

/**
 * css module processor
 * @param styleObj { css: string, filePath: '' }
 * @returns postcss.process()
 */
function processStyleUseCssModule (styleObj) {
  const useModuleConf = weappConf.module || {}
  const customPostcssConf = useModuleConf.postcss || {}
  const customCssModulesConf = Object.assign({
    enable: false,
    config: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      namingPattern: 'global'
    }
  }, customPostcssConf.cssModules || {})
  if (!customCssModulesConf.enable) {
    return styleObj
  }
  const namingPattern = customCssModulesConf.config.namingPattern
  if (namingPattern === 'module') {
    // 只对 xxx.module.[css|scss|less|styl] 等样式文件做处理
    const DO_USE_CSS_MODULE_REGEX = /^(.*\.module).*\.(css|scss|less|styl)$/
    if (!DO_USE_CSS_MODULE_REGEX.test(styleObj.filePath)) return styleObj
  } else {
    // 对 xxx.global.[css|scss|less|styl] 等样式文件不做处理
    const DO_NOT_USE_CSS_MODULE_REGEX = /^(.*\.global).*\.(css|scss|less|styl)$/
    if (DO_NOT_USE_CSS_MODULE_REGEX.test(styleObj.filePath)) return styleObj
  }
  const generateScopedName = customCssModulesConf.config.generateScopedName
  const context = process.cwd()
  let scopedName
  if (generateScopedName) {
    scopedName = genericNames(generateScopedName, { context })
  } else {
    scopedName = (local, filename) => Scope.generateScopedName(local, path.relative(context, filename))
  }
  const postcssPlugins = [
    Values,
    LocalByDefault,
    ExtractImports,
    new Scope({ generateScopedName: scopedName }),
    new ResolveImports({ resolve: Object.assign({}, { extensions: Util.CSS_EXT }) })
  ]
  const runner = postcss(postcssPlugins)
  const result = runner.process(styleObj.css, Object.assign({}, { from: styleObj.filePath }))
  return result
}

async function processStyleWithPostCSS (styleObj) {
  const useModuleConf = weappConf.module || {}
  const customPostcssConf = useModuleConf.postcss || {}
  const customCssModulesConf = Object.assign({
    enable: false,
    config: {
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }, customPostcssConf.cssModules || {})
  const customPxtransformConf = Object.assign({
    enable: true,
    config: {}
  }, customPostcssConf.pxtransform || {})
  const customUrlConf = Object.assign({
    enable: true,
    config: {
      limit: 10240
    }
  }, customPostcssConf.url || {})
  const customAutoprefixerConf = Object.assign({
    enable: true,
    config: {
      browsers: browserList
    }
  }, customPostcssConf.autoprefixer || {})
  const postcssPxtransformOption = {
    designWidth: projectConfig.designWidth || 750,
    platform: 'weapp'
  }

  if (projectConfig.hasOwnProperty(DEVICE_RATIO)) {
    postcssPxtransformOption[DEVICE_RATIO] = projectConfig.deviceRatio
  }
  const cssUrlConf = Object.assign({ limit: 10240 }, customUrlConf)
  const maxSize = Math.round((customUrlConf.config.limit || cssUrlConf.limit) / 1024)
  const postcssPxtransformConf = Object.assign({}, postcssPxtransformOption, customPxtransformConf, customPxtransformConf.config)
  const processors = []
  if (customAutoprefixerConf.enable) {
    processors.push(autoprefixer(customAutoprefixerConf.config))
  }
  if (customPxtransformConf.enable) {
    processors.push(pxtransform(postcssPxtransformConf))
  }
  if (cssUrlConf.enable) {
    processors.push(cssUrlParse({
      url: 'inline',
      maxSize,
      encodeType: 'base64'
    }))
  }

  const defaultPostCSSPluginNames = ['autoprefixer', 'pxtransform', 'url', 'cssModules']
  Object.keys(customPostcssConf).forEach(pluginName => {
    if (defaultPostCSSPluginNames.indexOf(pluginName) < 0) {
      const pluginConf = customPostcssConf[pluginName]
      if (pluginConf && pluginConf.enable) {
        if (!Util.isNpmPkg(pluginName)) { // local plugin
          pluginName = path.join(appPath, pluginName)
        }
        processors.push(require(resolveNpmPkgMainPath(pluginName, isProduction, weappNpmConfig, buildAdapter))(pluginConf.config || {}))
      }
    }
  })
  let css = styleObj.css
  if (customCssModulesConf.enable) {
    css = processStyleUseCssModule(styleObj).css
  }
  const postcssResult = await postcss(processors).process(css, {
    from: styleObj.filePath
  })
  return postcssResult.css
}

function compileImportStyles (filePath, importStyles) {
  if (importStyles.length) {
    importStyles.forEach(async importItem => {
      const importFilePath = path.resolve(filePath, '..', importItem)
      if (fs.existsSync(importFilePath)) {
        await compileDepStyles(importFilePath.replace(sourceDir, outputDir), [importFilePath])
      }
    })
  }
}

function compileDepStyles (outputFilePath, styleFiles, isComponent) {
  if (isBuildingStyles[outputFilePath]) {
    return Promise.resolve({})
  }
  isBuildingStyles[outputFilePath] = true
  return Promise.all(styleFiles.map(async p => {
    const filePath = path.join(p)
    const fileExt = path.extname(filePath)
    const pluginName = Util.FILE_PROCESSOR_MAP[fileExt]
    const fileContent = fs.readFileSync(filePath).toString()
    const cssImportsRes = Util.processStyleImports(fileContent, buildAdapter, (str, stylePath) => {
      if (stylePath.indexOf('~') === 0) {
        let newStylePath = stylePath
        newStylePath = stylePath.replace('~', '')
        const npmInfo = resolveNpmFilesPath(newStylePath, isProduction, weappNpmConfig, buildAdapter, appPath, compileInclude)
        const importRelativePath = Util.promoteRelativePath(path.relative(filePath, npmInfo.main))
        return str.replace(stylePath, importRelativePath)
      }
      return str
    })
    compileImportStyles(filePath, cssImportsRes.imports)
    if (pluginName) {
      return npmProcess.callPlugin(pluginName, cssImportsRes.content, filePath, pluginsConfig[pluginName] || {})
        .then(res => ({
          css: cssImportsRes.style.join('\n') + '\n' + res.css,
          filePath
        }))
    }
    return new Promise(resolve => {
      resolve({
        css: cssImportsRes.style.join('\n') + '\n' + cssImportsRes.content,
        filePath
      })
    })
  })).then(async resList => {
    Promise.all(resList.map(res => processStyleWithPostCSS(res)))
      .then(cssList => {
        let resContent = cssList.map(res => res).join('\n')
        if (isProduction) {
          const cssoPuginConfig = pluginsConfig.csso || { enable: true }
          if (cssoPuginConfig.enable) {
            const cssoConfig = cssoPuginConfig.config || {}
            const cssoResult = npmProcess.callPluginSync('csso', resContent, outputFilePath, cssoConfig)
            resContent = cssoResult.css
          }
        }
        fs.ensureDirSync(path.dirname(outputFilePath))
        fs.writeFileSync(outputFilePath, resContent)
      })
  })
}

function getRealComponentsPathList (filePath, components) {
  return components.map(component => {
    let componentPath = component.path
    if (Util.isAliasPath(componentPath, pathAlias)) {
      componentPath = Util.replaceAliasPath(filePath, componentPath, pathAlias)
    }
    if (Util.isNpmPkg(componentPath)) {
      try {
        componentPath = resolveNpmPkgMainPath(componentPath, isProduction, weappNpmConfig, buildAdapter)
      } catch (err) {
        console.log(err)
      }
    } else {
      componentPath = path.resolve(path.dirname(filePath), componentPath)
      componentPath = Util.resolveScriptPath(componentPath)
    }
    if (isFileToBePage(componentPath)) {
      Util.printLog(Util.pocessTypeEnum.ERROR, '组件引用', `文件${component.path}已经在 app.js 中被指定为页面，不能再作为组件来引用！`)
    }
    return {
      path: componentPath,
      name: component.name,
      type: component.type
    }
  })
}

function buildDepComponents (componentPathList, buildConfig) {
  return Promise.all(componentPathList.map(componentObj => buildSingleComponent(componentObj, buildConfig)))
}

function getDepStyleList (outputFilePath, buildDepComponentsResult) {
  let depWXSSList = []
  if (buildDepComponentsResult.length) {
    depWXSSList = buildDepComponentsResult.map(item => {
      let wxss = item.wxss
      wxss = wxss.replace(sourceDir, outputDir)
      wxss = Util.promoteRelativePath(path.relative(outputFilePath, wxss))
      return wxss
    })
  }
  return depWXSSList
}

function buildUsingComponents (filePath, components, isComponent) {
  const usingComponents = Object.create(null)
  for (const component of components) {
    let componentPath = component.path
    if (Util.isAliasPath(componentPath, pathAlias)) {
      componentPath = Util.replaceAliasPath(filePath, componentPath, pathAlias)
    }
    componentPath = Util.resolveScriptPath(path.resolve(filePath, '..', componentPath))
    if (fs.existsSync(componentPath)) {
      componentPath = Util.promoteRelativePath(path.relative(filePath, componentPath))
    } else {
      componentPath = component.path
    }
    usingComponents[component.name] = componentPath.replace(path.extname(componentPath), '')
  }
  return Object.assign({}, isComponent ? { component: true } : { usingComponents: {} }, components.length ? {
    usingComponents
  } : {})
}

async function buildSingleComponent (componentObj, buildConfig = {}) {
  if (hasBeenBuiltComponents.indexOf(componentObj.path) >= 0 && componentsBuildResult[componentObj.path]) {
    return componentsBuildResult[componentObj.path]
  }
  componentsNamedMap[componentObj.path] = {
    name: componentObj.name,
    type: componentObj.type
  }
  const component = componentObj.path
  if (!component) {
    Util.printLog(Util.pocessTypeEnum.ERROR, '组件错误', `组件${_.upperFirst(_.camelCase(componentObj.name))}路径错误，请检查！（可能原因是导出的组件名不正确）`)
    return {
      js: null,
      wxss: null,
      wxml: null
    }
  }
  let componentShowPath = component.replace(appPath + path.sep, '')
  componentShowPath = componentShowPath.split(path.sep).join('/')
  let isComponentFromNodeModules = false
  let sourceDirPath = sourceDir
  let buildOutputDir = outputDir
  // 来自 node_modules 的组件
  if (NODE_MODULES_REG.test(componentShowPath)) {
    isComponentFromNodeModules = true
    sourceDirPath = nodeModulesPath
    buildOutputDir = npmOutputDir
  }
  let outputComponentShowPath = componentShowPath.replace(isComponentFromNodeModules ? NODE_MODULES : sourceDirName, buildConfig.outputDirName || outputDirName)
  outputComponentShowPath = outputComponentShowPath.replace(path.extname(outputComponentShowPath), '')
  Util.printLog(Util.pocessTypeEnum.COMPILE, '组件文件', componentShowPath)
  const componentContent = fs.readFileSync(component).toString()
  const outputComponentJSPath = component.replace(sourceDirPath, buildConfig.outputDir || buildOutputDir).replace(path.extname(component), outputFilesTypes.SCRIPT)
  const outputComponentWXMLPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), outputFilesTypes.TEMPL)
  const outputComponentWXSSPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), outputFilesTypes.STYLE)
  const outputComponentJSONPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), outputFilesTypes.CONFIG)
  if (hasBeenBuiltComponents.indexOf(component) < 0) {
    hasBeenBuiltComponents.push(component)
  }
  try {
    let isTaroComponentRes = isFileToBeTaroComponent(componentContent, component, outputComponentJSPath)
    if (!isTaroComponentRes.isTaroComponent) {
      const transformResult = isTaroComponentRes.transformResult
      const componentRealPath = parseComponentExportAst(transformResult.ast, componentObj.name, component, componentObj.type)
      const realComponentObj = {
        path: componentRealPath,
        name: componentObj.name,
        type: componentObj.type
      }
      let isInMap = false
      if (notTaroComponents.indexOf(component) < 0) {
        notTaroComponents.push(component)
      }
      if (!Util.isEmptyObject(componentExportsMap)) {
        Object.keys(componentExportsMap).forEach(key => {
          componentExportsMap[key].forEach(item => {
            if (item.path === component) {
              isInMap = true
              item.path = componentRealPath
            }
          })
        })
      }
      if (!isInMap) {
        componentExportsMap[component] = componentExportsMap[component] || []
        componentExportsMap[component].push(realComponentObj)
      }
      return await buildSingleComponent(realComponentObj, buildConfig)
    }
    const transformResult = wxTransformer({
      code: componentContent,
      sourcePath: component,
      outputPath: outputComponentJSPath,
      isRoot: false,
      isTyped: Util.REG_TYPESCRIPT.test(component),
      isNormal: false,
      adapter: buildAdapter,
      env: constantsReplaceList
    })
    const compressTemplate = useCompileConf.compressTemplate
    const componentWXMLContent = (isProduction && compressTemplate) ? transformResult.compressedTemplate : transformResult.template
    const componentDepComponents = transformResult.components
    const res = parseAst(PARSE_AST_TYPE.COMPONENT, transformResult.ast, componentDepComponents, component, outputComponentJSPath, buildConfig.npmSkip)
    let resCode = res.code
    resCode = await compileScriptFile(resCode, component, outputComponentJSPath, buildAdapter)
    fs.ensureDirSync(path.dirname(outputComponentJSPath))
    if (isProduction) {
      const uglifyPluginConfig = pluginsConfig.uglify || { enable: true }
      if (uglifyPluginConfig.enable) {
        const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
        const uglifyResult = npmProcess.callPluginSync('uglifyjs', resCode, outputComponentJSPath, uglifyConfig)
        if (uglifyResult.error) {
          Util.printLog(Util.pocessTypeEnum.ERROR, '压缩错误', `文件${component}`)
          console.log(uglifyResult.error)
        } else {
          resCode = uglifyResult.code
        }
      }
    }
    const { usingComponents = {} } = res.configObj
    if (usingComponents && !Util.isEmptyObject(usingComponents)) {
      const keys = Object.keys(usingComponents)
      keys.forEach(item => {
        componentDepComponents.forEach(component => {
          if (_.camelCase(item) === _.camelCase(component.name)) {
            delete usingComponents[item]
          }
        })
      })
      transfromNativeComponents(outputComponentJSONPath.replace(buildConfig.outputDir || buildOutputDir, sourceDirPath), res.configObj)
    }

    const fileDep = dependencyTree[component] || {}
    // 编译依赖的组件文件
    let buildDepComponentsResult = []
    let realComponentsPathList = []
    if (componentDepComponents.length) {
      realComponentsPathList = getRealComponentsPathList(component, componentDepComponents)
      res.scriptFiles = res.scriptFiles.map(item => {
        for (let i = 0; i < realComponentsPathList.length; i++) {
          const componentObj = realComponentsPathList[i]
          const componentPath = componentObj.path
          if (item === componentPath) {
            return null
          }
        }
        return item
      }).filter(item => item)
      realComponentsPathList = realComponentsPathList.filter(item => hasBeenBuiltComponents.indexOf(item.path) < 0 || notTaroComponents.indexOf(item.path) >= 0)
      buildDepComponentsResult = await buildDepComponents(realComponentsPathList)
    }
    if (!Util.isEmptyObject(componentExportsMap) && realComponentsPathList.length) {
      const mapKeys = Object.keys(componentExportsMap)
      realComponentsPathList.forEach(componentObj => {
        if (mapKeys.indexOf(componentObj.path) >= 0) {
          const componentMap = componentExportsMap[componentObj.path]
          componentMap.forEach(componentObj => {
            componentDepComponents.forEach(depComponent => {
              if (depComponent.name === componentObj.name) {
                let componentPath = componentObj.path
                let realPath
                if (NODE_MODULES_REG.test(componentPath)) {
                  componentPath = componentPath.replace(nodeModulesPath, npmOutputDir)
                  realPath = Util.promoteRelativePath(path.relative(outputComponentJSPath, componentPath))
                } else {
                  realPath = Util.promoteRelativePath(path.relative(component, componentPath))
                }
                depComponent.path = realPath.replace(path.extname(realPath), '')
              }
            })
          })
        }
      })
    }
    fs.writeFileSync(outputComponentJSONPath, JSON.stringify(_.merge({}, buildUsingComponents(component, componentDepComponents, true), res.configObj), null, 2))
    Util.printLog(Util.pocessTypeEnum.GENERATE, '组件配置', `${outputDirName}/${outputComponentShowPath}${outputFilesTypes.CONFIG}`)
    fs.writeFileSync(outputComponentJSPath, resCode)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '组件逻辑', `${outputDirName}/${outputComponentShowPath}${outputFilesTypes.SCRIPT}`)
    fs.writeFileSync(outputComponentWXMLPath, componentWXMLContent)
    processNativeWxml(outputComponentWXMLPath.replace(outputDir, sourceDir), componentWXMLContent, outputComponentWXMLPath)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '组件模板', `${outputDirName}/${outputComponentShowPath}${outputFilesTypes.TEMPL}`)
    // 编译依赖的脚本文件
    if (Util.isDifferentArray(fileDep['script'], res.scriptFiles)) {
      compileDepScripts(res.scriptFiles)
    }
    // 编译样式文件
    if (Util.isDifferentArray(fileDep['style'], res.styleFiles) || Util.isDifferentArray(depComponents[component], componentDepComponents)) {
      Util.printLog(Util.pocessTypeEnum.GENERATE, '组件样式', `${outputDirName}/${outputComponentShowPath}${outputFilesTypes.STYLE}`)
      const depStyleList = getDepStyleList(outputComponentWXSSPath, buildDepComponentsResult)
      wxssDepTree[outputComponentWXSSPath] = depStyleList
      await compileDepStyles(outputComponentWXSSPath, res.styleFiles, true)
    }
    // 拷贝依赖文件
    if (Util.isDifferentArray(fileDep['json'], res.jsonFiles)) {
      copyFilesFromSrcToOutput(res.jsonFiles)
    }
    if (Util.isDifferentArray(fileDep['media'], res.mediaFiles)) {
      copyFilesFromSrcToOutput(res.mediaFiles)
    }
    fileDep['style'] = res.styleFiles
    fileDep['script'] = res.scriptFiles
    fileDep['json'] = res.jsonFiles
    fileDep['media'] = res.mediaFiles
    dependencyTree[component] = fileDep
    depComponents[component] = componentDepComponents
    componentsBuildResult[component] = {
      js: outputComponentJSPath,
      wxss: outputComponentWXSSPath,
      wxml: outputComponentWXMLPath
    }
    return componentsBuildResult[component]
  } catch (err) {
    Util.printLog(Util.pocessTypeEnum.ERROR, '组件编译', `组件${componentShowPath}编译失败！`)
    console.log(err)
  }
}

function compileDepScripts (scriptFiles) {
  scriptFiles.forEach(async item => {
    if (path.isAbsolute(item)) {
      let outputItem
      if (NODE_MODULES_REG.test(item)) {
        outputItem = item.replace(nodeModulesPath, npmOutputDir).replace(path.extname(item), '.js')
      } else {
        outputItem = item.replace(path.join(sourceDir), path.join(outputDir)).replace(path.extname(item), '.js')
      }
      const useCompileConf = Object.assign({}, weappConf.compile)
      const compileExclude = useCompileConf.exclude || []
      let isInCompileExclude = false
      compileExclude.forEach(excludeItem => {
        if (item.indexOf(path.join(appPath, excludeItem)) >= 0) {
          isInCompileExclude = true
        }
      })
      if (isInCompileExclude) {
        copyFileSync(item, outputItem)
        return
      }
      if (!isBuildingScripts[outputItem]) {
        isBuildingScripts[outputItem] = true
        try {
          const code = fs.readFileSync(item).toString()
          const transformResult = wxTransformer({
            code,
            sourcePath: item,
            outputPath: outputItem,
            isNormal: true,
            isTyped: Util.REG_TYPESCRIPT.test(item),
            adapter: buildAdapter,
            env: constantsReplaceList
          })
          const ast = transformResult.ast
          const res = parseAst(PARSE_AST_TYPE.NORMAL, ast, [], item, outputItem)
          const fileDep = dependencyTree[item] || {}
          let resCode = res.code
          resCode = await compileScriptFile(res.code, item, outputItem, buildAdapter)
          fs.ensureDirSync(path.dirname(outputItem))
          if (isProduction) {
            const uglifyPluginConfig = pluginsConfig.uglify || { enable: true }
            if (uglifyPluginConfig.enable) {
              const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
              const uglifyResult = npmProcess.callPluginSync('uglifyjs', resCode, item, uglifyConfig)
              if (uglifyResult.error) {
                Util.printLog(Util.pocessTypeEnum.ERROR, '压缩错误', `文件${item}`)
                console.log(uglifyResult.error)
              } else {
                resCode = uglifyResult.code
              }
            }
          }
          fs.writeFileSync(outputItem, resCode)
          let modifyOutput = outputItem.replace(appPath + path.sep, '')
          modifyOutput = modifyOutput.split(path.sep).join('/')
          Util.printLog(Util.pocessTypeEnum.GENERATE, '依赖文件', modifyOutput)
          // 编译依赖的脚本文件
          if (Util.isDifferentArray(fileDep['script'], res.scriptFiles)) {
            compileDepScripts(res.scriptFiles)
          }
          // 拷贝依赖文件
          if (Util.isDifferentArray(fileDep['json'], res.jsonFiles)) {
            copyFilesFromSrcToOutput(res.jsonFiles)
          }
          if (Util.isDifferentArray(fileDep['media'], res.mediaFiles)) {
            copyFilesFromSrcToOutput(res.mediaFiles)
          }
          fileDep['script'] = res.scriptFiles
          fileDep['json'] = res.jsonFiles
          fileDep['media'] = res.mediaFiles
          dependencyTree[item] = fileDep
        } catch (err) {
          Util.printLog(Util.pocessTypeEnum.ERROR, '编译失败', item.replace(appPath + path.sep, ''))
          console.log(err)
        }
      }
    }
  })
}

function copyFileSync (from, to, options) {
  const filename = path.basename(from)
  if (fs.statSync(from).isFile() && !path.extname(to)) {
    fs.ensureDir(to)
    if (from === path.join(to, filename)) {
      return
    }
    return fs.copySync(from, path.join(to, filename), options)
  }
  if (from === to) {
    return
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

function watchFiles () {
  console.log()
  console.log(chalk.gray('监听文件修改中...'))
  console.log()
  isBuildingScripts = {}
  isBuildingStyles = {}
  isCopyingFiles = {}
  const watcherPaths = [path.join(sourceDir)].concat(watcherDirs)
  const watcher = chokidar.watch(watcherPaths, {
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
      // 编译JS文件
      if (Util.REG_SCRIPT.test(extname) || Util.REG_TYPESCRIPT.test(extname)) {
        if (filePath.indexOf(entryFileName) >= 0) {
          Util.printLog(Util.pocessTypeEnum.MODIFY, '入口文件', `${sourceDirName}/${entryFileName}.js`)
          const config = await buildEntry()
          // TODO 此处待优化
          if ((Util.checksum(JSON.stringify(config.pages)) !== Util.checksum(JSON.stringify(appConfig.pages))) ||
            (Util.checksum(JSON.stringify(config.subPackages || config.subpackages || {})) !== Util.checksum(JSON.stringify(appConfig.subPackages || appConfig.subpackages || {})))) {
            appConfig = config
            await buildPages()
          }
        } else {
          const filePathWithoutExt = filePath.replace(extname, '')
          if (isFileToBePage(filePath)) { // 编译页面
            filePath = filePathWithoutExt
            filePath = filePath.replace(path.join(sourceDir) + path.sep, '')
            filePath = filePath.split(path.sep).join('/')
            Util.printLog(Util.pocessTypeEnum.MODIFY, '页面文件', `${sourceDirName}/${filePath}`)
            await buildSinglePage(filePath)
          } else if (hasBeenBuiltComponents.indexOf(filePath) >= 0) { // 编译组件
            let outoutShowFilePath = filePath.replace(appPath + path.sep, '')
            outoutShowFilePath = outoutShowFilePath.split(path.sep).join('/')
            Util.printLog(Util.pocessTypeEnum.MODIFY, '组件文件', outoutShowFilePath)
            const hasbeenBuiltIndex = hasBeenBuiltComponents.indexOf(filePath)
            if (hasbeenBuiltIndex >= 0) {
              hasBeenBuiltComponents.splice(hasbeenBuiltIndex, 1)
            }

            if (isWindows) {
              await new Promise((resolve, reject) => {
                setTimeout(async () => {
                  await buildSingleComponent(Object.assign({
                    path: filePath
                  }, componentsNamedMap[filePath]))
                  resolve()
                }, 300)
              })
            } else {
              await buildSingleComponent(Object.assign({
                path: filePath
              }, componentsNamedMap[filePath]))
            }
          } else {
            let isImported = false
            for (const key in dependencyTree) {
              const scripts = dependencyTree[key].script || []
              if (scripts.indexOf(filePath) >= 0) {
                isImported = true
              }
            }
            let modifySource = filePath.replace(appPath + path.sep, '')
            modifySource = modifySource.split(path.sep).join('/')
            if (isImported) {
              Util.printLog(Util.pocessTypeEnum.MODIFY, 'JS文件', modifySource)
              compileDepScripts([filePath])
            } else {
              Util.printLog(Util.pocessTypeEnum.WARNING, 'JS文件', `${modifySource} 没有被引用到，不会被编译`)
            }
          }
        }
      } else if (Util.REG_STYLE.test(extname)) {
        const includeStyleJSPath = []
        for (const key in dependencyTree) {
          const styles = dependencyTree[key]['style'] || []
          styles.forEach(item => {
            if (item === filePath) {
              includeStyleJSPath.push({
                filePath: key,
                styles
              })
            }
          })
        }
        if (includeStyleJSPath.length) {
          includeStyleJSPath.forEach(async item => {
            let outputWXSSPath = null
            outputWXSSPath = item.filePath.replace(path.extname(item.filePath), outputFilesTypes.STYLE)
            let modifySource = outputWXSSPath.replace(appPath + path.sep, '')
            modifySource = modifySource.split(path.sep).join('/')
            Util.printLog(Util.pocessTypeEnum.MODIFY, '样式文件', modifySource)
            if (NODE_MODULES_REG.test(outputWXSSPath)) {
              let sourceNodeModulesDir = nodeModulesPath
              let outputNodeModulesDir = npmOutputDir
              outputWXSSPath = outputWXSSPath.replace(sourceNodeModulesDir, outputNodeModulesDir)
            } else {
              outputWXSSPath = outputWXSSPath.replace(sourceDir, outputDir)
            }
            let modifyOutput = outputWXSSPath.replace(appPath + path.sep, '')
            modifyOutput = modifyOutput.split(path.sep).join('/')
            let isComponent = false
            if (!isFileToBePage(item.filePath) && item.filePath !== entryFilePath) {
              isComponent = true
            }
            if (isWindows) {
              await new Promise((resolve, reject) => {
                setTimeout(async () => {
                  await compileDepStyles(outputWXSSPath, item.styles, isComponent)
                  resolve()
                }, 300)
              })
            } else {
              await compileDepStyles(outputWXSSPath, item.styles, isComponent)
            }
            Util.printLog(Util.pocessTypeEnum.GENERATE, '样式文件', modifyOutput)
          })
        } else {
          let outputWXSSPath = filePath.replace(path.extname(filePath), outputFilesTypes.STYLE)
          let modifySource = outputWXSSPath.replace(appPath + path.sep, '')
          modifySource = modifySource.split(path.sep).join('/')
          Util.printLog(Util.pocessTypeEnum.MODIFY, '样式文件', modifySource)
          if (NODE_MODULES_REG.test(outputWXSSPath)) {
            let sourceNodeModulesDir = nodeModulesPath
            let outputNodeModulesDir = npmOutputDir
            outputWXSSPath = outputWXSSPath.replace(sourceNodeModulesDir, outputNodeModulesDir)
          } else {
            outputWXSSPath = outputWXSSPath.replace(sourceDir, outputDir)
          }
          let modifyOutput = outputWXSSPath.replace(appPath + path.sep, '')
          modifyOutput = modifyOutput.split(path.sep).join('/')
          if (isWindows) {
            await new Promise((resolve, reject) => {
              setTimeout(async () => {
                await compileDepStyles(outputWXSSPath, [filePath], false)
                resolve()
              }, 300)
            })
          } else {
            await compileDepStyles(outputWXSSPath, [filePath], false)
          }
          Util.printLog(Util.pocessTypeEnum.GENERATE, '样式文件', modifyOutput)
        }
      } else {
        let modifySource = filePath.replace(appPath + path.sep, '')
        modifySource = modifySource.split(path.sep).join('/')
        Util.printLog(Util.pocessTypeEnum.MODIFY, '文件', modifySource)
        copyFilesFromSrcToOutput([filePath])
      }
      isBuildingScripts = {}
      isBuildingStyles = {}
      isCopyingFiles = {}
    })
}

async function build ({ watch, adapter }) {
  process.env.TARO_ENV = adapter
  isProduction = process.env.NODE_ENV === 'production' || !watch
  buildAdapter = adapter
  outputFilesTypes = Util.MINI_APP_FILES[buildAdapter]
  // 可以自定义输出文件类型
  if (weappConf.customFilesTypes && !Util.isEmptyObject(weappConf.customFilesTypes)) {
    outputFilesTypes = Object.assign({}, outputFilesTypes, weappConf.customFilesTypes[buildAdapter] || {})
  }
  constantsReplaceList = Object.assign({}, constantsReplaceList, {
    'process.env.TARO_ENV': buildAdapter
  })
  buildProjectConfig()
  await buildFrameworkInfo()
  copyFiles()
  appConfig = await buildEntry()
  await buildPages()
  if (watch) {
    watchFiles()
  }
}

module.exports = {
  build,
  buildDepComponents,
  buildSingleComponent,
  compileDepStyles,
  parseAst
}
