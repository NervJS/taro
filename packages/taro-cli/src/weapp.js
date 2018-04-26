const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const chokidar = require('chokidar')
const babylon = require('babylon')
const nervToMp = require('nerv-to-mp')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generate = require('babel-generator').default
const template = require('babel-template')
const _ = require('lodash')

const Util = require('./util')
const CONFIG = require('./config')
const npmProcess = require('./npm')
const { resolveNpmFilesPath } = require('./util/resolve_npm_files')
const babylonConfig = require('./config/babylon')

const appPath = process.cwd()
const projectConfig = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
const outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
const sourceDir = path.join(appPath, sourceDirName)
const outputDir = path.join(appPath, outputDirName)
const entryFilePath = path.join(sourceDir, CONFIG.ENTRY)
const outputEntryFilePath = path.join(outputDir, CONFIG.ENTRY)

const pluginsConfig = projectConfig.plugins || {}

const notExistNpmList = []
const taroJsFramework = '@tarojs/taro'
const taroJsComponents = '@tarojs/components'
const taroJsRedux = '@tarojs/redux'
let appConfig = {}
const dependencyTree = {}
const depComponents = {}
const hasBeenBuiltComponents = []
const wxssDepTree = {}
let isBuildingScripts = {}
let isBuildingStyles = {}
let isCopyingFiles = {}

const PARSE_AST_TYPE = {
  ENTRY: 'ENTRY',
  PAGE: 'PAGE',
  COMPONENT: 'COMPONENT',
  NORMAL: 'NORMAL'
}

function getExactedNpmFilePath (npmName, filePath) {
  try {
    const npmInfo = resolveNpmFilesPath(npmName)
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
        obj[p.key.name] = traverseObjectNode(p.value)
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
        astPath.remove()
      }
    },

    ImportDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      const value = source.value
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
      } else if (Util.REG_STYLE.test(valueExtname)) {
        const stylePath = path.resolve(path.dirname(sourceFilePath), value)
        if (styleFiles.indexOf(stylePath) < 0) {
          styleFiles.push(stylePath)
        }
        astPath.remove()
      } else if (value.indexOf('.') === 0) {
        const pathArr = value.split('/')
        if (pathArr.indexOf('pages') >= 0) {
          astPath.remove()
        } else if (Util.REG_SCRIPT.test(valueExtname)) {
          if (scriptFiles.indexOf(value) < 0) {
            scriptFiles.push(value)
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
            astPath.replaceWith(t.variableDeclaration('const', [t.variableDeclarator(t.identifier(defaultSpecifier), t.stringLiteral(value))]))
          } else {
            astPath.remove()
          }
        } else if (!valueExtname) {
          const vpath = Util.resolveScriptPath(path.resolve(sourceFilePath, '..', value))
          const outputVpath = vpath.replace(sourceDir, outputDir)
          const relativePath = path.relative(filePath, outputVpath)
          if (vpath) {
            if (!fs.existsSync(vpath)) {
              Util.printLog(Util.pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
            } else {
              if (scriptFiles.indexOf(vpath) < 0) {
                scriptFiles.push(vpath)
              }
              source.value = Util.promoteRelativePath(relativePath)
              astPath.replaceWith(t.importDeclaration(node.specifiers, node.source))
            }
          }
        }
      }
    },

    VariableDeclaration (astPath) {
      const node = astPath.node
      if (node.declarations.length === 1 && node.declarations[0].init &&
        node.declarations[0].init.type === 'CallExpression' && node.declarations[0].init.callee &&
        node.declarations[0].init.callee.name === 'require') {
        const init = node.declarations[0].init
        const args = init.arguments
        const value = args[0].value
        const valueExtname = path.extname(value)
        const id = node.declarations[0].id
        if (Util.isNpmPkg(value) && notExistNpmList.indexOf(value) < 0) {
          if (value === taroJsComponents) {
            astPath.remove()
          } else {
            if (value === taroJsFramework && id.type === 'Identifier') {
              taroImportDefaultName = id.name
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
        } else if (Util.REG_STYLE.test(valueExtname)) {
          const stylePath = path.resolve(path.dirname(sourceFilePath), value)
          if (styleFiles.indexOf(stylePath) < 0) {
            styleFiles.push(stylePath)
          }
          astPath.remove()
        } else if (value.indexOf('.') === 0) {
          const pathArr = value.split('/')
          if (pathArr.indexOf('pages') >= 0) {
            astPath.remove()
          } else if (Util.REG_JSON.test(valueExtname)) {
            const vpath = path.resolve(sourceFilePath, '..', value)
            if (jsonFiles.indexOf(vpath) < 0) {
              jsonFiles.push(vpath)
            }
            if (fs.existsSync(vpath)) {
              const obj = JSON.parse(fs.readFileSync(vpath).toString())
              let defaultSpecifier = null
              if (id.type === 'Identifier') {
                defaultSpecifier = id.name
              }
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
          } else if (Util.REG_SCRIPT.test(valueExtname)) {
            if (scriptFiles.indexOf(value) < 0) {
              scriptFiles.push(value)
            }
          } else if (Util.REG_FONT.test(valueExtname) || Util.REG_IMAGE.test(valueExtname) || Util.REG_MEDIA.test(valueExtname)) {
            const vpath = path.resolve(sourceFilePath, '..', value)
            if (mediaFiles.indexOf(vpath) < 0) {
              mediaFiles.push(vpath)
            }
            let defaultSpecifier = null
            if (id.type === 'Identifier') {
              defaultSpecifier = id.name
            }
            if (defaultSpecifier) {
              astPath.replaceWith(t.variableDeclaration('const', [t.variableDeclarator(t.identifier(defaultSpecifier), t.stringLiteral(value))]))
            } else {
              astPath.remove()
            }
          } else if (!valueExtname) {
            const vpath = Util.resolveScriptPath(path.resolve(sourceFilePath, '..', value))
            const outputVpath = vpath.replace(sourceDir, outputDir)
            const relativePath = path.relative(filePath, outputVpath)
            if (vpath) {
              if (!fs.existsSync(vpath)) {
                Util.printLog(Util.pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
              } else {
                if (scriptFiles.indexOf(vpath) < 0) {
                  scriptFiles.push(vpath)
                }
                args[0].value = Util.promoteRelativePath(relativePath)
                astPath.replaceWith(t.variableDeclaration(node.kind, [t.variableDeclarator(id, init)]))
              }
            }
          }
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
        const node = astPath.node
        const exportVariableName = exportTaroReduxConnected || componentClassName
        if (needExportDefault) {
          const exportDefault = template(`export default ${exportVariableName}`, babylonConfig)()
          node.body.push(exportDefault)
        }
        const taroJsFrameworkPath = getExactedNpmFilePath(taroJsFramework, filePath)
        let insert
        switch (type) {
          case PARSE_AST_TYPE.ENTRY:
            insert = template(`App(require('${taroJsFrameworkPath}').default.createApp(${exportVariableName}))`, babylonConfig)()
            node.body.push(insert)
            break
          case PARSE_AST_TYPE.PAGE:
            insert = template(`Page(require('${taroJsFrameworkPath}').default.createPage(${exportVariableName}))`, babylonConfig)()
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

async function buildEntry () {
  Util.printLog(Util.pocessTypeEnum.COMPILE, '入口文件', `${sourceDirName}/${CONFIG.ENTRY}`)
  const entryFileCode = fs.readFileSync(entryFilePath).toString()
  try {
    const transformResult = nervToMp({
      code: entryFileCode,
      path: outputEntryFilePath,
      isApp: true
    })
    // app.js的template忽略
    const res = parseAst(PARSE_AST_TYPE.ENTRY, transformResult.ast, entryFilePath, outputEntryFilePath)
    const babelConfig = pluginsConfig.babel
    babelConfig && (babelConfig.babelrc = false)
    let resCode = res.code
    if (babelConfig) {
      const compileScriptRes = await npmProcess.callPlugin('babel', resCode, entryFilePath, babelConfig)
      resCode = compileScriptRes.code
    }
    resCode = Util.replaceContentEnv(resCode, projectConfig.env || {})
    resCode = Util.replaceContentConstants(resCode, projectConfig.defineConstants || {})
    fs.writeFileSync(path.join(outputDir, 'app.json'), JSON.stringify(res.configObj, null, 2))
    Util.printLog(Util.pocessTypeEnum.GENERATE, '入口配置', `${outputDirName}/app.json`)
    fs.writeFileSync(path.join(outputDir, 'app.js'), resCode)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '入口文件', `${outputDirName}/app.js`)
    const fileDep = dependencyTree[entryFilePath] || {}
    // 编译依赖的脚本文件
    if (Util.isDifferentArray(fileDep['script'], res.scriptFiles)) {
      compileDepScripts(babelConfig, res.scriptFiles)
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
  let pageJs = path.join(sourceDir, `${page}.js`)
  if (!fs.existsSync(pageJs)) {
    Util.printLog(Util.pocessTypeEnum.ERROR, '页面文件', `${sourceDirName}/${page} 不存在！`)
    return
  }
  const pageJsContent = fs.readFileSync(pageJs).toString()
  const outputPageJSPath = pageJs.replace(sourceDir, outputDir)
  const outputPagePath = path.dirname(outputPageJSPath)
  const outputPageJSONPath = outputPageJSPath.replace(path.extname(pageJs), '.json')
  const outputPageWXMLPath = outputPageJSPath.replace(path.extname(pageJs), '.wxml')
  const outputPageWXSSPath = outputPageJSPath.replace(path.extname(pageJs), '.wxss')
  try {
    const transformResult = nervToMp({
      code: pageJsContent,
      path: outputPageJSPath,
      isRoot: true
    })
    const res = parseAst(PARSE_AST_TYPE.PAGE, transformResult.ast, pageJs, outputPageJSPath)
    const babelConfig = pluginsConfig.babel
    const pageDepComponents = transformResult.components
    depComponents[pageJs] = pageDepComponents
    babelConfig && (babelConfig.babelrc = false)
    let resCode = res.code
    if (babelConfig) {
      const compileScriptRes = await npmProcess.callPlugin('babel', resCode, pageJs, babelConfig)
      resCode = compileScriptRes.code
    }
    resCode = Util.replaceContentEnv(resCode, projectConfig.env || {})
    resCode = Util.replaceContentConstants(resCode, projectConfig.defineConstants || {})
    fs.ensureDirSync(outputPagePath)
    fs.writeFileSync(outputPageJSONPath, JSON.stringify(res.configObj, null, 2))
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
      compileDepScripts(babelConfig, res.scriptFiles)
    }
    // 编译样式文件
    if (Util.isDifferentArray(fileDep['style'], res.styleFiles)) {
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
  })).then(resList => {
    const designWidth = projectConfig.designWidth || 750
    let resContent = resList.map(res => res.css).join('\n')
    resContent = resContent.replace(/([0-9.]+)px/ig, (match, size) => {
      return (parseInt(size, 10) / Util.DEVICE_RATIO[designWidth]) + 'rpx'
    })
    if (depStyleList && depStyleList.length) {
      const importStyles = depStyleList.map(item => {
        return `@import "${item}";\n`
      }).join('')
      resContent = importStyles + resContent
    }
    fs.writeFileSync(outputFilePath, resContent)
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
  const promises = componentPathList.map(componentPath => {
    if (hasBeenBuiltComponents.indexOf(componentPath) < 0) {
      return buildSingleComponent(componentPath)
    }
  }).filter(item => item)
  return Promise.all(promises)
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

async function buildSingleComponent (component) {
  let componentShowPath = component.replace(appPath + path.sep, '')
  componentShowPath = componentShowPath.split(path.sep).join('/')
  let outputComponentShowPath = componentShowPath.replace(sourceDirName, outputDirName)
  outputComponentShowPath = outputComponentShowPath.replace(path.extname(outputComponentShowPath), '')
  Util.printLog(Util.pocessTypeEnum.COMPILE, '组件文件', componentShowPath)
  const componentContent = fs.readFileSync(component).toString()
  const outputComponentJSPath = component.replace(sourceDir, outputDir)
  const outputComponentWXMLPath = outputComponentJSPath.replace(path.extname(component), '.wxml')
  const outputComponentWXSSPath = outputComponentJSPath.replace(path.extname(component), '.wxss')
  try {
    const transformResult = nervToMp({
      code: componentContent,
      path: outputComponentJSPath,
      isRoot: false
    })
    const res = parseAst(PARSE_AST_TYPE.COMPONENT, transformResult.ast, component, outputComponentJSPath)
    const babelConfig = pluginsConfig.babel
    const componentDepComponents = transformResult.components
    depComponents[component] = componentDepComponents
    babelConfig && (babelConfig.babelrc = false)
    let resCode = res.code
    if (babelConfig) {
      const compileScriptRes = await npmProcess.callPlugin('babel', resCode, component, babelConfig)
      resCode = compileScriptRes.code
    }
    fs.ensureDirSync(path.dirname(outputComponentJSPath))
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
      compileDepScripts(babelConfig, res.scriptFiles)
    }
    // 编译样式文件
    if (Util.isDifferentArray(fileDep['style'], res.styleFiles)) {
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
    return {
      js: outputComponentJSPath,
      wxss: outputComponentWXSSPath,
      wxml: outputComponentWXMLPath
    }
  } catch (err) {
    console.log(err)
  }
}

function compileDepScripts (babelConfig, scriptFiles) {
  if (babelConfig) {
    scriptFiles.forEach(async item => {
      if (path.isAbsolute(item)) {
        const outputItem = item.replace(path.join(sourceDir), path.join(outputDir))
        if (!isBuildingScripts[outputItem]) {
          isBuildingScripts[outputItem] = true
          try {
            const code = fs.readFileSync(item).toString()
            const ast = babylon.parse(code, babylonConfig)
            const res = parseAst(PARSE_AST_TYPE.NORMAL, ast, item, outputItem)
            const fileDep = dependencyTree[item] || {}
            const compileScriptRes = await npmProcess.callPlugin('babel', res.code, item, babelConfig)
            fs.ensureDirSync(path.dirname(outputItem))
            let resCode = Util.replaceContentEnv(compileScriptRes.code, projectConfig.env || {})
            resCode = Util.replaceContentConstants(resCode, projectConfig.defineConstants || {})
            fs.writeFileSync(outputItem, resCode)
            let modifyOutput = outputItem.replace(appPath + path.sep, '')
            modifyOutput = modifyOutput.split(path.sep).join('/')
            Util.printLog(Util.pocessTypeEnum.GENERATE, '依赖文件', modifyOutput)
            // 编译依赖的脚本文件
            if (Util.isDifferentArray(fileDep['script'], res.scriptFiles)) {
              compileDepScripts(babelConfig, res.scriptFiles)
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
}

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
      if (Util.REG_SCRIPT.test(extname)) {
        if (filePath.indexOf(CONFIG.ENTRY) >= 0) {
          Util.printLog(Util.pocessTypeEnum.MODIFY, '入口文件', `${sourceDirName}/${CONFIG.ENTRY}.js`)
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
            if (filePath.indexOf(page) >= 0) {
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
            let outoutShowFilePath = filePath.replace(path.join(appPath) + path.sep, '')
            outoutShowFilePath = filePath.split(path.sep).join('/')
            Util.printLog(Util.pocessTypeEnum.MODIFY, '组件文件', outoutShowFilePath)
            await buildSingleComponent(filePath)
          } else {
            let modifySource = filePath.replace(appPath + path.sep, '')
            modifySource = modifySource.split(path.sep).join('/')
            Util.printLog(Util.pocessTypeEnum.MODIFY, '组件文件', modifySource)
            const babelConfig = pluginsConfig.babel
            babelConfig && (babelConfig.babelrc = false)
            compileDepScripts(babelConfig, [filePath])
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
            await compileDepStyles(outputWXSSPath, item.styles, depStyleList)
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
          await compileDepStyles(outputWXSSPath, [filePath], depStyleList)
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
  appConfig = await buildEntry()
  await buildPages()
  if (watch) {
    watchFiles()
  }
}

module.exports = {
  build
}
