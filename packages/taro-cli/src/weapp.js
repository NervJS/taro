const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const chalk = require('chalk')
const chokidar = require('chokidar')
const wxTransformer = require('@tarojs/transformer-wx')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generate = require('babel-generator').default
const template = require('babel-template')
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const pxtransform = require('postcss-pxtransform')
const _ = require('lodash')

const Util = require('./util')
const CONFIG = require('./config')
const npmProcess = require('./util/npm')
const { resolveNpmFilesPath } = require('./util/resolve_npm_files')
const babylonConfig = require('./config/babylon')
const browserList = require('./config/browser_list')
const defaultUglifyConfig = require('./config/uglify')
const defaultBabelConfig = require('./config/babel')
const defaultTSConfig = require('./config/tsconfig.json')

const appPath = process.cwd()
const projectConfig = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
const outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
const sourceDir = path.join(appPath, sourceDirName)
const outputDir = path.join(appPath, outputDirName)
const entryFilePath = Util.resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)
const outputEntryFilePath = path.join(outputDir, entryFileName)

const pluginsConfig = projectConfig.plugins || {}

const notExistNpmList = []
const taroJsFramework = '@tarojs/taro'
const taroWeappFramework = '@tarojs/taro-weapp'
const taroJsComponents = '@tarojs/components'
const taroJsRedux = '@tarojs/redux'
let appConfig = {}
const dependencyTree = {}
const depComponents = {}
const hasBeenBuiltComponents = []
const componentsBuildResult = {}
const wxssDepTree = {}
let isBuildingScripts = {}
let isBuildingStyles = {}
let isCopyingFiles = {}
let isProduction = false

const PARSE_AST_TYPE = {
  ENTRY: 'ENTRY',
  PAGE: 'PAGE',
  COMPONENT: 'COMPONENT',
  NORMAL: 'NORMAL'
}

const isWindows = os.platform() === 'win32'

function getExactedNpmFilePath (npmName, filePath) {
  try {
    const npmInfo = resolveNpmFilesPath(npmName, isProduction)
    const npmInfoMainPath = npmInfo.main
    const outputNpmPath = npmInfoMainPath.replace('node_modules', path.join(outputDirName, CONFIG.NPM_DIR))
    const relativePath = path.relative(filePath, outputNpmPath)
    return Util.promoteRelativePath(relativePath)
  } catch (err) {
    if (notExistNpmList.indexOf(npmName) < 0) {
      notExistNpmList.push(npmName)
    }
    return npmName
  }
}

function parseAst (type, ast, sourceFilePath, filePath) {
  const styleFiles = []
  const scriptFiles = []
  const jsonFiles = []
  const mediaFiles = []
  let configObj = {}
  let componentClassName = null
  let taroJsReduxConnect = null
  function traverseObjectNode (node, obj) {
    if (node.type === 'ClassProperty' || node.type === 'ObjectProperty') {
      const properties = node.value.properties
      obj = {}
      properties.forEach((p, index) => {
        obj[p.key.name] = traverseObjectNode(p.value)
      })
      return obj
    }
    if (node.type === 'ObjectExpression') {
      const properties = node.properties
      obj = {}
      properties.forEach((p, index) => {
        const key = t.isIdentifier(p.key) ? p.key.name : p.key.value
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
  let taroImportDefaultName
  let needExportDefault = false
  let exportTaroReduxConnected = null
  traverse(ast, {
    ClassDeclaration (astPath) {
      const node = astPath.node
      if (node.superClass) {
        if (node.superClass.name === 'Component' ||
        (node.superClass.type === 'MemberExpression' &&
        node.superClass.object.name === taroImportDefaultName)) {
          needExportDefault = true
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

    ClassProperty (astPath) {
      const node = astPath.node
      if (node.key.name === 'config') {
        configObj = traverseObjectNode(node)
        if (type === PARSE_AST_TYPE.ENTRY) {
          appConfig = configObj
        }
        astPath.remove()
      }
    },

    ImportDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      let value = source.value
      const valueExtname = path.extname(value)
      if (Util.isNpmPkg(value) && notExistNpmList.indexOf(value) < 0) {
        if (value === taroJsComponents) {
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
            value = taroWeappFramework
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
          source.value = getExactedNpmFilePath(value, filePath)
          astPath.replaceWith(t.importDeclaration(node.specifiers, node.source))
        }
      } else if (path.isAbsolute(value)) {
        Util.printLog(Util.pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 是绝对路径！`)
      } else if (Util.REG_STYLE.test(valueExtname)) {
        const stylePath = path.resolve(path.dirname(sourceFilePath), value)
        if (styleFiles.indexOf(stylePath) < 0) {
          styleFiles.push(stylePath)
        }
        astPath.remove()
      }
    },

    VariableDeclaration (astPath) {
      const node = astPath.node
      if (node.declarations.length === 1 && node.declarations[0].init &&
        node.declarations[0].init.type === 'CallExpression' && node.declarations[0].init.callee &&
        node.declarations[0].init.callee.name === 'require') {
        const init = node.declarations[0].init
        const args = init.arguments
        let value = args[0].value
        const id = node.declarations[0].id
        if (Util.isNpmPkg(value) && notExistNpmList.indexOf(value) < 0) {
          if (value === taroJsComponents) {
            astPath.remove()
          } else {
            if (value === taroJsFramework && id.type === 'Identifier') {
              taroImportDefaultName = id.name
              value = taroWeappFramework
            } else if (value === taroJsRedux) {
              const declarations = node.declarations
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
            args[0].value = getExactedNpmFilePath(value, filePath)
            astPath.replaceWith(t.variableDeclaration(node.kind, [t.variableDeclarator(id, init)]))
          }
        }
      }
    },

    CallExpression (astPath) {
      const node = astPath.node
      const callee = node.callee
      if (t.isMemberExpression(callee)) {
        if (callee.object.name === taroImportDefaultName && callee.property.name === 'render') {
          astPath.remove()
        }
      } else if (callee.name === 'require') {
        const args = node.arguments
        let value = args[0].value
        const valueExtname = path.extname(value)
        if (Util.REG_STYLE.test(valueExtname)) {
          const stylePath = path.resolve(path.dirname(sourceFilePath), value)
          if (styleFiles.indexOf(stylePath) < 0) {
            styleFiles.push(stylePath)
          }
          astPath.remove()
        } else if (path.isAbsolute(value)) {
          Util.printLog(Util.pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 是绝对路径！`)
        }
      }
    },

    ExportDefaultDeclaration (astPath) {
      const node = astPath.node
      const declaration = node.declaration
      needExportDefault = false
      if (declaration && declaration.type === 'ClassDeclaration') {
        const superClass = declaration.superClass
        if (superClass &&
          (superClass.name === 'Component' ||
          superClass.name === 'BaseComponent' ||
          (superClass.type === 'MemberExpression' &&
          superClass.object.name === taroImportDefaultName))) {
          needExportDefault = true
          if (declaration.id === null) {
            componentClassName = '_TaroComponentClass'
          } else if (declaration.id.name === 'App') {
            componentClassName = '_App'
          } else {
            componentClassName = declaration.id.name
          }
          astPath.replaceWith(t.classDeclaration(t.identifier(componentClassName), superClass, declaration.body, declaration.decorators || []))
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

    Program: {
      exit (astPath) {
        astPath.traverse({
          ImportDeclaration (astPath) {
            const node = astPath.node
            const source = node.source
            let value = source.value
            const valueExtname = path.extname(value)
            if (value.indexOf('.') === 0) {
              let isPage = false
              const pages = appConfig.pages
              let importPath = path.resolve(path.dirname(sourceFilePath), value)
              importPath = Util.resolveScriptPath(importPath)
              pages.forEach(page => {
                if (path.normalize(importPath).indexOf(path.normalize(page)) >= 0) {
                  isPage = true
                }
              })
              if (isPage) {
                astPath.remove()
              } else if (Util.REG_SCRIPT.test(valueExtname) || Util.REG_TYPESCRIPT.test(valueExtname)) {
                const vpath = path.resolve(sourceFilePath, '..', value)
                let fPath = value
                if (fs.existsSync(vpath)) {
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
                      objArr = convertArrayToAstExpression(obj)
                    } else {
                      objArr = convertObjectToAstExpression(obj)
                    }
                    astPath.replaceWith(t.variableDeclaration('const', [t.variableDeclarator(t.identifier(defaultSpecifier), t.objectExpression(objArr))]))
                  } else {
                    astPath.remove()
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
                if (defaultSpecifier) {
                  astPath.replaceWith(t.variableDeclaration('const', [t.variableDeclarator(t.identifier(defaultSpecifier), t.stringLiteral(vpath.replace(sourceDir, '').replace(/\\/g, '/')))]))
                } else {
                  astPath.remove()
                }
              } else if (!valueExtname) {
                let vpath = Util.resolveScriptPath(path.resolve(sourceFilePath, '..', value))
                const outputVpath = vpath.replace(sourceDir, outputDir)
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
                    source.value = relativePath
                    astPath.replaceWith(t.importDeclaration(node.specifiers, node.source))
                  }
                }
              }
            }
          },
          CallExpression (astPath) {
            const node = astPath.node
            const callee = node.callee
            if (callee.name === 'require') {
              const args = node.arguments
              let value = args[0].value
              const valueExtname = path.extname(value)
              if (value.indexOf('.') === 0) {
                let isPage = false
                const pages = appConfig.pages
                let importPath = path.resolve(path.dirname(sourceFilePath), value)
                importPath = Util.resolveScriptPath(importPath)
                pages.forEach(page => {
                  if (path.normalize(importPath).indexOf(path.normalize(page)) >= 0) {
                    isPage = true
                  }
                })
                if (isPage) {
                  astPath.remove()
                } else if (Util.REG_JSON.test(valueExtname)) {
                  const vpath = path.resolve(sourceFilePath, '..', value)
                  if (jsonFiles.indexOf(vpath) < 0) {
                    jsonFiles.push(vpath)
                  }
                  if (fs.existsSync(vpath)) {
                    const obj = JSON.parse(fs.readFileSync(vpath).toString())
                    let objArr = [t.nullLiteral()]
                    if (Array.isArray(obj)) {
                      objArr = convertArrayToAstExpression(obj)
                    } else {
                      objArr = convertObjectToAstExpression(obj)
                    }
                    astPath.replaceWith(t.objectExpression(objArr))
                  }
                } else if (Util.REG_SCRIPT.test(valueExtname) || Util.REG_TYPESCRIPT.test(valueExtname)) {
                  const vpath = path.resolve(sourceFilePath, '..', value)
                  let fPath = value
                  if (fs.existsSync(vpath)) {
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
                  astPath.replaceWith(t.stringLiteral(vpath.replace(sourceDir, '').replace(/\\/g, '/')))
                } else if (!valueExtname) {
                  let vpath = Util.resolveScriptPath(path.resolve(sourceFilePath, '..', value))
                  const outputVpath = vpath.replace(sourceDir, outputDir)
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
        })
        const node = astPath.node
        const exportVariableName = exportTaroReduxConnected || componentClassName
        if (needExportDefault) {
          const exportDefault = template(`export default ${exportVariableName}`, babylonConfig)()
          node.body.push(exportDefault)
        }
        const taroWeappFrameworkPath = getExactedNpmFilePath(taroWeappFramework, filePath)
        let insert
        switch (type) {
          case PARSE_AST_TYPE.ENTRY:
            insert = template(`App(require('${taroWeappFrameworkPath}').default.createApp(${exportVariableName}))`, babylonConfig)()
            node.body.push(insert)
            break
          case PARSE_AST_TYPE.PAGE:
            insert = template(`Component(require('${taroWeappFrameworkPath}').default.createComponent(${exportVariableName}))`, babylonConfig)()
            node.body.push(insert)
            break
          case PARSE_AST_TYPE.COMPONENT:
            insert = template(`Component(require('${taroWeappFrameworkPath}').default.createComponent(${exportVariableName}))`, babylonConfig)()
            node.body.push(insert)
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

function convertObjectToAstExpression (obj) {
  const objArr = Object.keys(obj).map(key => {
    const value = obj[key]
    if (typeof value === 'string') {
      return t.objectProperty(t.stringLiteral(key), t.stringLiteral(value))
    }
    if (typeof value === 'number') {
      return t.objectProperty(t.stringLiteral(key), t.numericLiteral(value))
    }
    if (typeof value === 'boolean') {
      return t.objectProperty(t.stringLiteral(key), t.booleanLiteral(value))
    }
    if (Array.isArray(value)) {
      return t.objectProperty(t.stringLiteral(key), convertArrayToAstExpression(value))
    }
    if (value == null) {
      return t.objectProperty(t.stringLiteral(key), t.nullLiteral())
    }
    if (typeof value === 'object') {
      return t.objectProperty(t.stringLiteral(key), convertObjectToAstExpression(value))
    }
  })
  return objArr
}

function convertArrayToAstExpression (arr) {
  return arr.map(value => {
    if (typeof value === 'string') {
      return t.stringLiteral(value)
    }
    if (typeof value === 'number') {
      return t.numericLiteral(value)
    }
    if (typeof value === 'boolean') {
      return t.booleanLiteral(value)
    }
    if (Array.isArray(value)) {
      return convertArrayToAstExpression(value)
    }
    if (value == null) {
      return t.nullLiteral()
    }
    if (typeof value === 'object') {
      return convertObjectToAstExpression(value)
    }
  })
}

function copyFilesFromSrcToOutput (files) {
  files.forEach(file => {
    const outputFilePath = file.replace(sourceDir, outputDir)
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
      fs.copySync(file, outputFilePath)
    }
  })
}

async function compileScriptFile (filePath, content) {
  const babelConfig = Object.assign({}, pluginsConfig.babel, defaultBabelConfig)
  const tsConfig = Object.assign({}, pluginsConfig.typescript, defaultTSConfig)
  if (Util.REG_TYPESCRIPT.test(filePath)) {
    const compileTSRes = await npmProcess.callPlugin('typescript', content, entryFilePath, tsConfig)
    if (compileTSRes && compileTSRes.outputText) {
      content = compileTSRes.outputText
    }
  }
  const compileScriptRes = await npmProcess.callPlugin('babel', content, entryFilePath, babelConfig)
  return compileScriptRes.code
}

function buildProjectConfig () {
  const projectConfigPath = path.join(appPath, 'project.config.json')
  if (!fs.existsSync(projectConfigPath)) {
    return
  }
  const origProjectConfig = fs.readJSONSync(projectConfigPath)
  fs.writeFileSync(
    path.join(outputDir, 'project.config.json'),
    JSON.stringify(Object.assign({}, origProjectConfig, { miniprogramRoot: './' }), null, 2)
  )
  Util.printLog(Util.pocessTypeEnum.GENERATE, '工具配置', `${outputDirName}/project.config.json`)
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
      isTyped: Util.REG_TYPESCRIPT.test(entryFilePath)
    })
    // app.js的template忽略
    const res = parseAst(PARSE_AST_TYPE.ENTRY, transformResult.ast, entryFilePath, outputEntryFilePath)
    let resCode = res.code
    resCode = await compileScriptFile(entryFilePath, resCode)
    resCode = Util.replaceContentEnv(resCode, projectConfig.env || {})
    resCode = Util.replaceContentConstants(resCode, projectConfig.defineConstants || {})
    if (isProduction) {
      const uglifyPluginConfig = pluginsConfig.uglify || { enable: true }
      if (uglifyPluginConfig.enable) {
        const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
        const uglifyResult = npmProcess.callPluginSync('uglifyjs', resCode, entryFilePath, uglifyConfig)
        if (uglifyResult.error) {
          console.log(uglifyResult.error)
        } else {
          resCode = uglifyResult.code
        }
      }
    }
    fs.writeFileSync(path.join(outputDir, 'app.json'), JSON.stringify(res.configObj, null, 2))
    Util.printLog(Util.pocessTypeEnum.GENERATE, '入口配置', `${outputDirName}/app.json`)
    fs.writeFileSync(path.join(outputDir, 'app.js'), resCode)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '入口文件', `${outputDirName}/app.js`)
    const fileDep = dependencyTree[entryFilePath] || {}
    // 编译依赖的脚本文件
    if (Util.isDifferentArray(fileDep['script'], res.scriptFiles)) {
      compileDepScripts(res.scriptFiles)
    }
    // 编译样式文件
    if (Util.isDifferentArray(fileDep['style'], res.styleFiles)) {
      await compileDepStyles(path.join(outputDir, 'app.wxss'), res.styleFiles, [])
      Util.printLog(Util.pocessTypeEnum.GENERATE, '入口样式', `${outputDirName}/app.wxss`)
    }
    // 拷贝依赖文件
    if (Util.isDifferentArray(fileDep['json'], res.jsonFiles)) {
      copyFilesFromSrcToOutput(res.jsonFiles)
    }

    // 处理res.configObj 中的tabBar配置
    const tabBar = res.configObj.tabBar
    if (tabBar && typeof tabBar === 'object' && !Util.isEmptyObject(tabBar)) {
      const list = tabBar.list || []
      let tabBarIcons = []
      list.forEach(item => {
        if (item.iconPath) {
          tabBarIcons.push(item.iconPath)
        }
        if (item.selectedIconPath) {
          tabBarIcons.push(item.selectedIconPath)
        }
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
  const pages = appConfig.pages || []
  const pagesPromises = pages.map(async page => {
    return buildSinglePage(page)
  })
  await Promise.all(pagesPromises)
}

async function buildSinglePage (page) {
  Util.printLog(Util.pocessTypeEnum.COMPILE, '页面文件', `${sourceDirName}/${page}`)
  let pageJs = Util.resolveScriptPath(path.join(sourceDir, `${page}`))
  if (!fs.existsSync(pageJs)) {
    Util.printLog(Util.pocessTypeEnum.ERROR, '页面文件', `${sourceDirName}/${page} 不存在！`)
    return
  }
  const pageJsContent = fs.readFileSync(pageJs).toString()
  const outputPageJSPath = pageJs.replace(sourceDir, outputDir).replace(path.extname(pageJs), '.js')
  const outputPagePath = path.dirname(outputPageJSPath)
  const outputPageJSONPath = outputPageJSPath.replace(path.extname(outputPageJSPath), '.json')
  const outputPageWXMLPath = outputPageJSPath.replace(path.extname(outputPageJSPath), '.wxml')
  const outputPageWXSSPath = outputPageJSPath.replace(path.extname(outputPageJSPath), '.wxss')
  try {
    const transformResult = wxTransformer({
      code: pageJsContent,
      sourcePath: pageJs,
      outputPath: outputPageJSPath,
      isRoot: true,
      isTyped: Util.REG_TYPESCRIPT.test(pageJs)
    })
    const res = parseAst(PARSE_AST_TYPE.PAGE, transformResult.ast, pageJs, outputPageJSPath)
    const pageDepComponents = transformResult.components
    let resCode = res.code
    resCode = await compileScriptFile(pageJs, resCode)
    resCode = Util.replaceContentEnv(resCode, projectConfig.env || {})
    resCode = Util.replaceContentConstants(resCode, projectConfig.defineConstants || {})
    if (isProduction) {
      const uglifyPluginConfig = pluginsConfig.uglify || { enable: true }
      if (uglifyPluginConfig.enable) {
        const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
        const uglifyResult = npmProcess.callPluginSync('uglifyjs', resCode, outputPageJSPath, uglifyConfig)
        if (uglifyResult.error) {
          console.log(uglifyResult.error)
        } else {
          resCode = uglifyResult.code
        }
      }
    }
    fs.ensureDirSync(outputPagePath)
    fs.writeFileSync(outputPageJSONPath, JSON.stringify(Object.assign({}, buildUsingComponents(transformResult.components), res.configObj), null, 2))
    Util.printLog(Util.pocessTypeEnum.GENERATE, '页面JSON', `${outputDirName}/${page}.json`)
    fs.writeFileSync(outputPageJSPath, resCode)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '页面JS', `${outputDirName}/${page}.js`)
    fs.writeFileSync(outputPageWXMLPath, transformResult.template)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '页面WXML', `${outputDirName}/${page}.wxml`)
    const fileDep = dependencyTree[pageJs] || {}
    // 编译依赖的组件文件
    let buildDepComponentsResult = []
    if (pageDepComponents.length) {
      const realComponentsPathList = getRealComponentsPathList(pageJs, pageDepComponents)
      res.scriptFiles = res.scriptFiles.map(item => {
        for (let i = 0; i < realComponentsPathList.length; i++) {
          const componentPath = realComponentsPathList[i]
          if (item === componentPath) {
            return null
          }
        }
        return item
      }).filter(item => item)
      buildDepComponentsResult = await buildDepComponents(realComponentsPathList)
    }
    // 编译依赖的脚本文件
    if (Util.isDifferentArray(fileDep['script'], res.scriptFiles)) {
      compileDepScripts(res.scriptFiles)
    }
    // 编译样式文件
    if (Util.isDifferentArray(fileDep['style'], res.styleFiles) || Util.isDifferentArray(depComponents[pageJs], pageDepComponents)) {
      Util.printLog(Util.pocessTypeEnum.GENERATE, '页面WXSS', `${outputDirName}/${page}.wxss`)
      const depStyleList = getDepStyleList(outputPageWXSSPath, buildDepComponentsResult)
      wxssDepTree[outputPageWXSSPath] = depStyleList
      await compileDepStyles(outputPageWXSSPath, res.styleFiles, depStyleList)
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
    console.log(err)
  }
}

function compileDepStyles (outputFilePath, styleFiles, depStyleList) {
  if (isBuildingStyles[outputFilePath]) {
    return Promise.resolve({})
  }
  isBuildingStyles[outputFilePath] = true
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
    let resContent = resList.map(res => res.css).join('\n')
    const weappConf = projectConfig.weapp || {}
    const useModuleConf = weappConf.module || {}
    const customPostcssConf = useModuleConf.postcss || {}
    const customPxtransformConf = customPostcssConf.pxtransform || {}

    try {
      const postcssResult = await postcss([
        autoprefixer({ browsers: browserList }),
        pxtransform(Object.assign({
          designWidth: projectConfig.designWidth || 750,
          platform: 'weapp'
        }, customPxtransformConf))
      ]).process(resContent, {
        from: undefined
      })
      resContent = postcssResult.css
      if (depStyleList && depStyleList.length) {
        const importStyles = depStyleList.map(item => {
          return `@import "${item}";\n`
        }).join('')
        resContent = importStyles + resContent
      }
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
    } catch (err) {
      console.log(err)
    }
  })
}

function getRealComponentsPathList (filePath, components) {
  return components.map(component => {
    let componentPath = path.resolve(path.dirname(filePath), component.path)
    componentPath = Util.resolveScriptPath(componentPath)
    return componentPath
  })
}

function buildDepComponents (componentPathList) {
  return Promise.all(componentPathList.map(componentPath => buildSingleComponent(componentPath)))
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

function buildUsingComponents (components) {
  const usingComponents = Object.create(null)
  for (const component of components) {
    usingComponents[component.name] = component.path
  }
  return Object.assign({}, { components: true }, components.length ? {
    usingComponents
  } : {})
}

async function buildSingleComponent (component) {
  if (hasBeenBuiltComponents.indexOf(component) >= 0 && componentsBuildResult[component]) {
    return componentsBuildResult[component]
  }
  let componentShowPath = component.replace(appPath + path.sep, '')
  componentShowPath = componentShowPath.split(path.sep).join('/')
  let outputComponentShowPath = componentShowPath.replace(sourceDirName, outputDirName)
  outputComponentShowPath = outputComponentShowPath.replace(path.extname(outputComponentShowPath), '')
  Util.printLog(Util.pocessTypeEnum.COMPILE, '组件文件', componentShowPath)
  const componentContent = fs.readFileSync(component).toString()
  const outputComponentJSPath = component.replace(sourceDir, outputDir).replace(path.extname(component), '.js')
  const outputComponentWXMLPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), '.wxml')
  const outputComponentWXSSPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), '.wxss')
  const outputComponentJSONPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), '.json')
  try {
    const transformResult = wxTransformer({
      code: componentContent,
      sourcePath: component,
      outputPath: outputComponentJSPath,
      isRoot: false,
      isTyped: Util.REG_TYPESCRIPT.test(component)
    })
    const res = parseAst(PARSE_AST_TYPE.COMPONENT, transformResult.ast, component, outputComponentJSPath)
    const componentDepComponents = transformResult.components
    let resCode = res.code
    resCode = await compileScriptFile(component, resCode)
    resCode = Util.replaceContentEnv(resCode, projectConfig.env || {})
    resCode = Util.replaceContentConstants(resCode, projectConfig.defineConstants || {})
    fs.ensureDirSync(path.dirname(outputComponentJSPath))
    if (isProduction) {
      const uglifyPluginConfig = pluginsConfig.uglify || { enable: true }
      if (uglifyPluginConfig.enable) {
        const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
        const uglifyResult = npmProcess.callPluginSync('uglifyjs', resCode, outputComponentJSPath, uglifyConfig)
        if (uglifyResult.error) {
          console.log(uglifyResult.error)
        } else {
          resCode = uglifyResult.code
        }
      }
    }
    fs.writeFileSync(outputComponentJSONPath, JSON.stringify(buildUsingComponents(transformResult.components), null, 2))
    Util.printLog(Util.pocessTypeEnum.GENERATE, '组件JSON', `${outputDirName}/${outputComponentShowPath}.json`)
    fs.writeFileSync(outputComponentJSPath, resCode)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '组件JS', `${outputDirName}/${outputComponentShowPath}.js`)
    fs.writeFileSync(outputComponentWXMLPath, transformResult.template)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '组件WXML', `${outputDirName}/${outputComponentShowPath}.wxml`)
    const fileDep = dependencyTree[component] || {}
    // 编译依赖的组件文件
    let buildDepComponentsResult = []
    if (componentDepComponents.length) {
      const realComponentsPathList = getRealComponentsPathList(component, componentDepComponents)
      res.scriptFiles = res.scriptFiles.map(item => {
        for (let i = 0; i < realComponentsPathList.length; i++) {
          const componentPath = realComponentsPathList[i]
          if (item === componentPath) {
            return null
          }
        }
        return item
      }).filter(item => item)
      buildDepComponentsResult = await buildDepComponents(realComponentsPathList)
    }
    // 编译依赖的脚本文件
    if (Util.isDifferentArray(fileDep['script'], res.scriptFiles)) {
      compileDepScripts(res.scriptFiles)
    }
    // 编译样式文件
    if (Util.isDifferentArray(fileDep['style'], res.styleFiles) || Util.isDifferentArray(depComponents[component], componentDepComponents)) {
      Util.printLog(Util.pocessTypeEnum.GENERATE, '组件WXSS', `${outputDirName}/${outputComponentShowPath}.wxss`)
      const depStyleList = getDepStyleList(outputComponentWXSSPath, buildDepComponentsResult)
      wxssDepTree[outputComponentWXSSPath] = depStyleList
      await compileDepStyles(outputComponentWXSSPath, res.styleFiles, depStyleList)
    }
    // 拷贝依赖文件
    if (Util.isDifferentArray(fileDep['json'], res.jsonFiles)) {
      copyFilesFromSrcToOutput(res.jsonFiles)
    }
    if (Util.isDifferentArray(fileDep['media'], res.mediaFiles)) {
      copyFilesFromSrcToOutput(res.mediaFiles)
    }
    hasBeenBuiltComponents.push(component)
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
    console.log(err)
  }
}

function compileDepScripts (scriptFiles) {
  scriptFiles.forEach(async item => {
    if (path.isAbsolute(item)) {
      const outputItem = item.replace(path.join(sourceDir), path.join(outputDir)).replace(path.extname(item), '.js')
      if (!isBuildingScripts[outputItem]) {
        isBuildingScripts[outputItem] = true
        try {
          const code = fs.readFileSync(item).toString()
          const transformResult = wxTransformer({
            code,
            sourcePath: item,
            outputPath: outputItem,
            isNormal: true,
            isTyped: Util.REG_TYPESCRIPT.test(item)
          })
          const ast = transformResult.ast
          const res = parseAst(PARSE_AST_TYPE.NORMAL, ast, item, outputItem)
          const fileDep = dependencyTree[item] || {}
          let resCode = res.code
          resCode = await compileScriptFile(item, res.code)
          fs.ensureDirSync(path.dirname(outputItem))
          resCode = Util.replaceContentEnv(resCode, projectConfig.env || {})
          resCode = Util.replaceContentConstants(resCode, projectConfig.defineConstants || {})
          if (isProduction) {
            const uglifyPluginConfig = pluginsConfig.uglify || { enable: true }
            if (uglifyPluginConfig.enable) {
              const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
              const uglifyResult = npmProcess.callPluginSync('uglifyjs', resCode, item, uglifyConfig)
              if (uglifyResult.error) {
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

// function buildWxsFiles () {
//   const wsxDir = path.join(outputDir, 'wxs')
//   fs.ensureDirSync(wsxDir)
//   fs.copyFileSync(path.join(__dirname, 'extra/util_wxs'), path.join(wsxDir, 'utils.wxs'))
// }

function watchFiles () {
  console.log()
  console.log(chalk.gray('监听文件修改中...'))
  console.log()
  isBuildingScripts = {}
  isBuildingStyles = {}
  isCopyingFiles = {}
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
      // 编译JS文件
      if (Util.REG_SCRIPT.test(extname) || Util.REG_TYPESCRIPT.test(extname)) {
        if (filePath.indexOf(entryFileName) >= 0) {
          Util.printLog(Util.pocessTypeEnum.MODIFY, '入口文件', `${sourceDirName}/${entryFileName}.js`)
          const config = await buildEntry()
          // TODO 此处待优化
          if (Util.checksum(JSON.stringify(config)) !== Util.checksum(JSON.stringify(appConfig))) {
            appConfig = config
            await buildPages()
          }
        } else {
          let isPage = false
          const pages = appConfig.pages || []
          pages.forEach(page => {
            if (path.normalize(filePath).indexOf(path.normalize(page)) >= 0) {
              isPage = true
            }
          })
          if (isPage) { // 编译页面
            filePath = filePath.replace(path.extname(filePath), '')
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
            await buildSingleComponent(filePath)
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
            outputWXSSPath = item.filePath.replace(path.extname(item.filePath), '.wxss')
            let modifySource = outputWXSSPath.replace(appPath + path.sep, '')
            modifySource = modifySource.split(path.sep).join('/')
            Util.printLog(Util.pocessTypeEnum.MODIFY, '样式文件', modifySource)
            outputWXSSPath = outputWXSSPath.replace(sourceDir, outputDir)
            let modifyOutput = outputWXSSPath.replace(appPath + path.sep, '')
            modifyOutput = modifyOutput.split(path.sep).join('/')
            const depStyleList = wxssDepTree[outputWXSSPath]
            if (isWindows) {
              await new Promise((resolve, reject) => {
                setTimeout(async () => {
                  await compileDepStyles(outputWXSSPath, item.styles, depStyleList)
                  resolve()
                }, 300)
              })
            } else {
              await compileDepStyles(outputWXSSPath, item.styles, depStyleList)
            }
            Util.printLog(Util.pocessTypeEnum.GENERATE, '样式文件', modifyOutput)
          })
        } else {
          let outputWXSSPath = filePath.replace(path.extname(filePath), '.wxss')
          let modifySource = outputWXSSPath.replace(appPath + path.sep, '')
          modifySource = modifySource.split(path.sep).join('/')
          Util.printLog(Util.pocessTypeEnum.MODIFY, '样式文件', modifySource)
          outputWXSSPath = outputWXSSPath.replace(sourceDir, outputDir)
          let modifyOutput = outputWXSSPath.replace(appPath + path.sep, '')
          modifyOutput = modifyOutput.split(path.sep).join('/')
          const depStyleList = wxssDepTree[outputWXSSPath]
          if (isWindows) {
            await new Promise((resolve, reject) => {
              setTimeout(async () => {
                await compileDepStyles(outputWXSSPath, [filePath], depStyleList)
                resolve()
              }, 300)
            })
          } else {
            await compileDepStyles(outputWXSSPath, [filePath], depStyleList)
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

async function build ({ watch }) {
  isProduction = !watch
  buildProjectConfig()
  // buildWxsFiles()
  appConfig = await buildEntry()
  await buildPages()
  if (watch) {
    watchFiles()
  }
}

module.exports = {
  build
}
