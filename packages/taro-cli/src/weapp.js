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
const cssUrlParse = require('postcss-url')
const minimatch = require('minimatch')
const _ = require('lodash')

const Util = require('./util')
const CONFIG = require('./config')
const npmProcess = require('./util/npm')
const { resolveNpmFilesPath, resolveNpmPkgMainPath } = require('./util/resolve_npm_files')
const babylonConfig = require('./config/babylon')
const browserList = require('./config/browser_list')
const defaultUglifyConfig = require('./config/uglify')
const defaultBabelConfig = require('./config/babel')
const defaultTSConfig = require('./config/tsconfig.json')

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

const pluginsConfig = projectConfig.plugins || {}
const weappConf = projectConfig.weapp || {}
const weappNpmConfig = Object.assign({
  name: CONFIG.NPM_DIR,
  dir: null
}, weappConf.npm)
const appOutput = typeof weappConf.appOutput === 'boolean' ? weappConf.appOutput : true

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
const componentsNamedMap = {}
const componentExportsMap = {}
const wxssDepTree = {}
let isBuildingScripts = {}
let isBuildingStyles = {}
let isCopyingFiles = {}
let isProduction = false

const NODE_MODULES = 'node_modules'
const NODE_MODULES_REG = /(.*)node_modules/

const nodeModulesPath = path.join(appPath, NODE_MODULES)

const PARSE_AST_TYPE = {
  ENTRY: 'ENTRY',
  PAGE: 'PAGE',
  COMPONENT: 'COMPONENT',
  NORMAL: 'NORMAL'
}

const DEVICE_RATIO = 'deviceRatio'

const isWindows = os.platform() === 'win32'

function getExactedNpmFilePath (npmName, filePath) {
  try {
    const npmInfo = resolveNpmFilesPath(npmName, isProduction, weappNpmConfig)
    const npmInfoMainPath = npmInfo.main
    let outputNpmPath
    if (Util.REG_STYLE.test(npmInfoMainPath)) {
      outputNpmPath = npmInfoMainPath
    } else {
      if (!weappNpmConfig.dir) {
        outputNpmPath = npmInfoMainPath.replace(NODE_MODULES, path.join(outputDirName, weappNpmConfig.name))
      } else {
        const npmFilePath = npmInfoMainPath.replace(NODE_MODULES_REG, '')
        outputNpmPath = path.join(path.resolve(configDir, '..', weappNpmConfig.dir), weappNpmConfig.name, npmFilePath)
      }
    }
    const relativePath = path.relative(filePath, outputNpmPath)
    return Util.promoteRelativePath(relativePath)
  } catch (err) {
    if (notExistNpmList.indexOf(npmName) < 0) {
      notExistNpmList.push(npmName)
    }
    return npmName
  }
}

function processIfTaroEnv (astPath, node, a, b) {
  if (node[a].value !== Util.BUILD_TYPES.WEAPP) {
    const consequentSibling = astPath.getSibling('consequent')
    consequentSibling.set('body', [])
  } else {
    const alternateSibling = astPath.getSibling('alternate')
    if (alternateSibling.node) {
      alternateSibling.set('body', [])
    }
  }
  node[b] = t.stringLiteral(Util.BUILD_TYPES.WEAPP)
}

function parseAst (type, ast, depComponents, sourceFilePath, filePath, npmSkip = false) {
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
      properties.forEach(p => {
        obj[p.key.name] = traverseObjectNode(p.value)
      })
      return obj
    }
    if (node.type === 'ObjectExpression') {
      const properties = node.properties
      obj = {}
      properties.forEach(p => {
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
                        if (type === PARSE_AST_TYPE.ENTRY) {
                          appConfig = configObj
                        }
                        astPath.remove()
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
            componentClassName = '_TaroComponentClass'
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
        if (type === PARSE_AST_TYPE.ENTRY) {
          appConfig = configObj
        }
        astPath.remove()
      }
    },

    IfStatement (astPath) {
      astPath.traverse({
        BinaryExpression (astPath) {
          const node = astPath.node
          const left = node.left
          const right = node.right
          if (generate(left).code === 'process.env.TARO_ENV') {
            processIfTaroEnv(astPath, node, 'right', 'left')
          } else if (generate(right).code === 'process.env.TARO_ENV') {
            processIfTaroEnv(astPath, node, 'left', 'right')
          }
        }
      })
    },

    ImportDeclaration (astPath) {
      const node = astPath.node
      const source = node.source
      let value = source.value
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
            if (!npmSkip) {
              source.value = getExactedNpmFilePath(value, filePath)
            } else {
              source.value = value
            }
          }
        }
      } else if (path.isAbsolute(value)) {
        Util.printLog(Util.pocessTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 是绝对路径！`)
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
              if (!npmSkip) {
                args[0].value = getExactedNpmFilePath(value, filePath)
              } else {
                args[0].value = value
              }
              astPath.replaceWith(t.variableDeclaration(node.kind, [t.variableDeclarator(id, init)]))
            }
          }
        }
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
        if (Util.isNpmPkg(value) && notExistNpmList.indexOf(value) < 0) {
          if (Util.REG_STYLE.test(value)) {
            if (!npmSkip) {
              args[0].value = getExactedNpmFilePath(value, filePath)
            } else {
              args[0].value = value
            }
          }
        }
        if (path.isAbsolute(value)) {
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

    Program: {
      exit (astPath) {
        astPath.traverse({
          ImportDeclaration (astPath) {
            const node = astPath.node
            const source = node.source
            let value = source.value
            const valueExtname = path.extname(value)
            if (value.indexOf('.') === 0) {
              let importPath = path.resolve(path.dirname(sourceFilePath), value)
              importPath = Util.resolveScriptPath(importPath)
              if (isFileToBePage(importPath)) {
                astPath.remove()
              } else {
                let isDepComponent = false
                if (depComponents && depComponents.length) {
                  depComponents.forEach(item => {
                    const resolvePath = Util.resolveScriptPath(path.resolve(path.dirname(sourceFilePath), item.path))
                    const resolveValuePath = Util.resolveScriptPath(path.resolve(path.dirname(sourceFilePath), value))
                    if (resolvePath === resolveValuePath) {
                      isDepComponent = true
                    }
                  })
                }
                if (isDepComponent) {
                  astPath.remove()
                } else if (Util.REG_SCRIPT.test(valueExtname) || Util.REG_TYPESCRIPT.test(valueExtname)) {
                  const vpath = path.resolve(sourceFilePath, '..', value)
                  let fPath = value
                  if (fs.existsSync(vpath) && !NODE_MODULES_REG.test(vpath)) {
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
                    outputVpath = vpath.replace(nodeModulesPath, path.join(outputDir, weappNpmConfig.name))
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
                      source.value = relativePath
                      astPath.replaceWith(t.importDeclaration(node.specifiers, node.source))
                    }
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
                  let isDepComponent = false
                  if (depComponents && depComponents.length) {
                    depComponents.forEach(item => {
                      const resolvePath = Util.resolveScriptPath(path.resolve(path.dirname(sourceFilePath), item.path))
                      const resolveValuePath = Util.resolveScriptPath(path.resolve(path.dirname(sourceFilePath), value))
                      if (resolvePath === resolveValuePath) {
                        isDepComponent = true
                      }
                    })
                  }
                  if (isDepComponent) {
                    if (astPath.parent.type === 'AssignmentExpression' || 'ExpressionStatement') {
                      astPath.parentPath.remove()
                    } else if (astPath.parent.type === 'VariableDeclarator') {
                      astPath.parentPath.parentPath.remove()
                    } else {
                      astPath.remove()
                    }
                  } else if (Util.REG_STYLE.test(valueExtname)) {
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
                        objArr = convertArrayToAstExpression(obj)
                      } else {
                        objArr = convertObjectToAstExpression(obj)
                      }
                      astPath.replaceWith(t.objectExpression(objArr))
                    }
                  } else if (Util.REG_SCRIPT.test(valueExtname) || Util.REG_TYPESCRIPT.test(valueExtname)) {
                    const vpath = path.resolve(sourceFilePath, '..', value)
                    let fPath = value
                    if (fs.existsSync(vpath) && !NODE_MODULES_REG.test(vpath)) {
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
                      outputVpath = vpath.replace(nodeModulesPath, path.join(outputDir, weappNpmConfig.name))
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
        const taroWeappFrameworkPath = !npmSkip ? getExactedNpmFilePath(taroWeappFramework, filePath) : taroWeappFramework
        switch (type) {
          case PARSE_AST_TYPE.ENTRY:
            const pxTransformConfig = {
              designWidth: projectConfig.designWidth || 750,
            }
            if (projectConfig.hasOwnProperty(DEVICE_RATIO)) {
              pxTransformConfig[DEVICE_RATIO] = projectConfig.deviceRatio
            }
            node.body.push(template(`App(require('${taroWeappFrameworkPath}').default.createApp(${exportVariableName}))`, babylonConfig)())
            node.body.push(template(`Taro.initPxTransform(${JSON.stringify(pxTransformConfig)})`, babylonConfig)())
            break
          case PARSE_AST_TYPE.PAGE:
            node.body.push(template(`Page(require('${taroWeappFrameworkPath}').default.createComponent(${exportVariableName}, true))`, babylonConfig)())
            break
          case PARSE_AST_TYPE.COMPONENT:
            node.body.push(template(`Component(require('${taroWeappFrameworkPath}').default.createComponent(${exportVariableName}))`, babylonConfig)())
            break
          default:
            break
        }
      }
    }
  })
  return {
    code: unescape(generate(ast).code.replace(/\\u/g, '%u')),
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

    IfStatement (astPath) {
      astPath.traverse({
        BinaryExpression (astPath) {
          const node = astPath.node
          const left = node.left
          if (generate(left).code === 'process.env.TARO_ENV' &&
            node.right.value === Util.BUILD_TYPES.WEAPP) {
            const consequentSibling = astPath.getSibling('consequent')
            consequentSibling.traverse({
              CallExpression (astPath) {
                if (astPath.get('callee').isIdentifier({ name : 'require'})) {
                  const arg = astPath.get('arguments')[0]
                  if (t.isStringLiteral(arg.node)) {
                    componentRealPath = Util.resolveScriptPath(path.resolve(path.dirname(componentPath), arg.node.value))
                  }
                }
              }
            })
          }
        }
      })
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
      return t.objectProperty(t.stringLiteral(key), t.arrayExpression(convertArrayToAstExpression(value)))
    }
    if (value == null) {
      return t.objectProperty(t.stringLiteral(key), t.nullLiteral())
    }
    if (typeof value === 'object') {
      return t.objectProperty(t.stringLiteral(key), t.objectExpression(convertObjectToAstExpression(value)))
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
      return t.objectExpression(convertObjectToAstExpression(value))
    }
  })
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
      outputFilePath = file.replace(nodeModulesPath, path.join(outputDir, weappNpmConfig.name))
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
    const res = parseAst(PARSE_AST_TYPE.ENTRY, transformResult.ast, [], entryFilePath, outputEntryFilePath)
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
    if (appOutput) {
      fs.writeFileSync(path.join(outputDir, 'app.json'), JSON.stringify(res.configObj, null, 2))
      Util.printLog(Util.pocessTypeEnum.GENERATE, '入口配置', `${outputDirName}/app.json`)
      fs.writeFileSync(path.join(outputDir, 'app.js'), resCode)
      Util.printLog(Util.pocessTypeEnum.GENERATE, '入口文件', `${outputDirName}/app.js`)
    }
    const fileDep = dependencyTree[entryFilePath] || {}
    // 编译依赖的脚本文件
    if (Util.isDifferentArray(fileDep['script'], res.scriptFiles)) {
      compileDepScripts(res.scriptFiles)
    }
    // 编译样式文件
    if (Util.isDifferentArray(fileDep['style'], res.styleFiles) && appOutput) {
      await compileDepStyles(path.join(outputDir, 'app.wxss'), res.styleFiles, false)
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

function transfromNativeComponents (configFile, componentConfig) {
  const usingComponents = componentConfig.usingComponents
  if (usingComponents && !Util.isEmptyObject(usingComponents)) {
    Object.keys(usingComponents).map(async item => {
      const componentPath = usingComponents[item]
      const componentJSPath = Util.resolveScriptPath(path.resolve(path.dirname(configFile), componentPath))
      const componentJSONPath = componentJSPath.replace(path.extname(componentJSPath), '.json')
      const componentWXMLPath = componentJSPath.replace(path.extname(componentJSPath), '.wxml')
      const componentWXSSPath = componentJSPath.replace(path.extname(componentJSPath), '.wxss')
      const outputComponentJSPath = componentJSPath.replace(sourceDir, outputDir).replace(path.extname(componentJSPath), '.js')
      if (fs.existsSync(componentJSPath)) {
        const componentJSContent = fs.readFileSync(componentJSPath).toString()
        if (componentJSContent.indexOf(taroJsFramework) >= 0 && !fs.existsSync(componentWXMLPath)) {
          return await buildDepComponents([componentJSPath])
        }
        compileDepScripts([componentJSPath])
      } else {
        return Util.printLog(Util.pocessTypeEnum.ERROR, '编译错误', `原生组件文件 ${componentJSPath} 不存在！`)
      }
      if (fs.existsSync(componentWXMLPath)) {
        const outputComponentWXMLPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), '.wxml')
        copyFileSync(componentWXMLPath, outputComponentWXMLPath)
      }
      if (fs.existsSync(componentWXSSPath)) {
        const outputComponentWXSSPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), '.wxss')
        await compileDepStyles(outputComponentWXSSPath, [componentWXSSPath], true)
      }
      if (fs.existsSync(componentJSONPath)) {
        const componentJSON = require(componentJSONPath)
        const outputComponentJSONPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), '.json')
        copyFileSync(componentJSONPath, outputComponentJSONPath)
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
  const outputPageJSPath = pageJs.replace(sourceDir, outputDir).replace(path.extname(pageJs), '.js')
  const outputPagePath = path.dirname(outputPageJSPath)
  const outputPageJSONPath = outputPageJSPath.replace(path.extname(outputPageJSPath), '.json')
  const outputPageWXMLPath = outputPageJSPath.replace(path.extname(outputPageJSPath), '.wxml')
  const outputPageWXSSPath = outputPageJSPath.replace(path.extname(outputPageJSPath), '.wxss')
  // 判断是不是小程序原生代码页面
  const pageWXMLPath = pageJs.replace(path.extname(pageJs), '.wxml')
  if (fs.existsSync(pageWXMLPath) && pageJsContent.indexOf(taroJsFramework) < 0) {
    const pageJSONPath = pageJs.replace(path.extname(pageJs), '.json')
    const pageWXSSPath = pageJs.replace(path.extname(pageJs), '.wxss')
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
      isTyped: Util.REG_TYPESCRIPT.test(pageJs)
    })
    const pageDepComponents = transformResult.components
    const res = parseAst(PARSE_AST_TYPE.PAGE, transformResult.ast, pageDepComponents, pageJs, outputPageJSPath)
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
                if (NODE_MODULES_REG.test(componentPath)) {
                  componentPath = componentPath.replace(NODE_MODULES, weappNpmConfig.name)
                }
                const realPath = Util.promoteRelativePath(path.relative(pageJs, componentPath))
                depComponent.path = realPath.replace(path.extname(realPath), '')
              }
            })
          })
        }
      })
    }
    fs.writeFileSync(outputPageJSONPath, JSON.stringify(_.merge({}, buildUsingComponents(pageDepComponents), res.configObj), null, 2))
    Util.printLog(Util.pocessTypeEnum.GENERATE, '页面JSON', `${outputDirName}/${page}.json`)
    fs.writeFileSync(outputPageJSPath, resCode)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '页面JS', `${outputDirName}/${page}.js`)
    fs.writeFileSync(outputPageWXMLPath, transformResult.template)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '页面WXML', `${outputDirName}/${page}.wxml`)
    // 编译依赖的脚本文件
    if (Util.isDifferentArray(fileDep['script'], res.scriptFiles)) {
      compileDepScripts(res.scriptFiles)
    }
    // 编译样式文件
    if (Util.isDifferentArray(fileDep['style'], res.styleFiles) || Util.isDifferentArray(depComponents[pageJs], pageDepComponents)) {
      Util.printLog(Util.pocessTypeEnum.GENERATE, '页面WXSS', `${outputDirName}/${page}.wxss`)
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
    console.log(err)
  }
}

async function processStyleWithPostCSS (styleObj) {
  const useModuleConf = weappConf.module || {}
  const customPostcssConf = useModuleConf.postcss || {}
  const customPxtransformConf = customPostcssConf.pxtransform || {}
  const customUrlConf = customPostcssConf.url || {}
  const postcssPxtransformOption = {
    designWidth: projectConfig.designWidth || 750,
    platform: 'weapp'
  }

  if (projectConfig.hasOwnProperty(DEVICE_RATIO)) {
    postcssPxtransformOption[DEVICE_RATIO] = projectConfig.deviceRatio
  }
  const cssUrlConf = Object.assign({ limit: 10240, enable: true }, customUrlConf)
  const maxSize = Math.round(cssUrlConf.limit / 1024)
  const processors = [
    autoprefixer({ browsers: browserList }),
    pxtransform(Object.assign(
      postcssPxtransformOption,
      customPxtransformConf
    ))
  ]
  if (cssUrlConf.enable) {
    processors.push(cssUrlParse({
      url: 'inline',
      maxSize,
      encodeType: 'base64'
    }))
  }
  const postcssResult = await postcss(processors).process(styleObj.css, {
    from: styleObj.filePath
  })
  return postcssResult.css
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
    const cssImportsRes = Util.processWxssImports(fileContent)
    if (pluginName) {
      return npmProcess.callPlugin(pluginName, cssImportsRes.content, filePath, pluginsConfig[pluginName] || {})
        .then(res => ({
          css: cssImportsRes.wxss.join('\n') + '\n' + res.css,
          filePath
        }))
    }
    return new Promise(resolve => {
      resolve({
        css: cssImportsRes.wxss.join('\n') + '\n' + cssImportsRes.content,
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
    if (Util.isNpmPkg(componentPath)) {
      try {
        componentPath = resolveNpmPkgMainPath(componentPath, isProduction, weappNpmConfig)
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

function buildUsingComponents (components, isComponent) {
  const usingComponents = Object.create(null)
  for (const component of components) {
    usingComponents[component.name] = component.path
  }
  return Object.assign({}, isComponent ? { component: true } : {}, components.length ? {
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
  let componentShowPath = component.replace(appPath + path.sep, '')
  componentShowPath = componentShowPath.split(path.sep).join('/')
  let isComponentFromNodeModules = false
  let sourceDirPath = sourceDir
  let buildOutputDir = outputDir
  // 来自 node_modules 的组件
  if (NODE_MODULES_REG.test(componentShowPath)) {
    isComponentFromNodeModules = true
    sourceDirPath = nodeModulesPath
    buildOutputDir = path.join(outputDir, weappNpmConfig.name)
  }
  let outputComponentShowPath = componentShowPath.replace(isComponentFromNodeModules ? NODE_MODULES : sourceDirName, buildConfig.outputDirName || outputDirName)
  outputComponentShowPath = outputComponentShowPath.replace(path.extname(outputComponentShowPath), '')
  Util.printLog(Util.pocessTypeEnum.COMPILE, '组件文件', componentShowPath)
  const componentContent = fs.readFileSync(component).toString()
  const outputComponentJSPath = component.replace(sourceDirPath, buildConfig.outputDir || buildOutputDir).replace(path.extname(component), '.js')
  const outputComponentWXMLPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), '.wxml')
  const outputComponentWXSSPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), '.wxss')
  const outputComponentJSONPath = outputComponentJSPath.replace(path.extname(outputComponentJSPath), '.json')
  if (hasBeenBuiltComponents.indexOf(component) < 0) {
    hasBeenBuiltComponents.push(component)
  }
  try {
    let isTaroComponent = true
    if (componentContent.indexOf(taroJsFramework) < 0 &&
      componentContent.indexOf('render') < 0) {
      isTaroComponent = false
    }
    const transformResult = wxTransformer({
      code: componentContent,
      sourcePath: component,
      outputPath: outputComponentJSPath,
      isRoot: false,
      isTyped: Util.REG_TYPESCRIPT.test(component),
      isNormal: !isTaroComponent
    })
    if (!isTaroComponent) {
      const componentRealPath = parseComponentExportAst(transformResult.ast, componentObj.name, component, componentObj.type)
      const realComponentObj = {
        path: componentRealPath,
        name:  componentObj.name,
        type: componentObj.type
      }
      let isInMap = false
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
    const componentDepComponents = transformResult.components
    const res = parseAst(PARSE_AST_TYPE.COMPONENT, transformResult.ast, componentDepComponents, component, outputComponentJSPath, buildConfig.npmSkip)
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
                if (NODE_MODULES_REG.test(componentPath)) {
                  componentPath = componentPath.replace(NODE_MODULES, weappNpmConfig.name)
                }
                const realPath = Util.promoteRelativePath(path.relative(component, componentPath))
                depComponent.path = realPath.replace(path.extname(realPath), '')
              }
            })
          })
        }
      })
    }
    fs.writeFileSync(outputComponentJSONPath, JSON.stringify(_.merge({}, buildUsingComponents(componentDepComponents, true), res.configObj), null, 2))
    Util.printLog(Util.pocessTypeEnum.GENERATE, '组件JSON', `${outputDirName}/${outputComponentShowPath}.json`)
    fs.writeFileSync(outputComponentJSPath, resCode)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '组件JS', `${outputDirName}/${outputComponentShowPath}.js`)
    fs.writeFileSync(outputComponentWXMLPath, transformResult.template)
    Util.printLog(Util.pocessTypeEnum.GENERATE, '组件WXML', `${outputDirName}/${outputComponentShowPath}.wxml`)
    // 编译依赖的脚本文件
    if (Util.isDifferentArray(fileDep['script'], res.scriptFiles)) {
      compileDepScripts(res.scriptFiles)
    }
    // 编译样式文件
    if (Util.isDifferentArray(fileDep['style'], res.styleFiles) || Util.isDifferentArray(depComponents[component], componentDepComponents)) {
      Util.printLog(Util.pocessTypeEnum.GENERATE, '组件WXSS', `${outputDirName}/${outputComponentShowPath}.wxss`)
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
    console.log(err)
  }
}

function compileDepScripts (scriptFiles) {
  scriptFiles.forEach(async item => {
    if (path.isAbsolute(item)) {
      let outputItem
      if (NODE_MODULES_REG.test(item)) {
        outputItem = item.replace(nodeModulesPath, path.join(outputDir, weappNpmConfig.name)).replace(path.extname(item), '.js')
      } else {
        outputItem = item.replace(path.join(sourceDir), path.join(outputDir)).replace(path.extname(item), '.js')
      }
      const useCompileConf = Object.assign({}, weappConf.compile)
      const compileExclude = useCompileConf.exclude || []
      let isInCompileExclude = false
      compileExclude.forEach(excludeItem => {
        if (path.join(appPath, excludeItem) === item) {
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
            isTyped: Util.REG_TYPESCRIPT.test(item)
          })
          const ast = transformResult.ast
          const res = parseAst(PARSE_AST_TYPE.NORMAL, ast, [], item, outputItem)
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

function copyFileSync (from, to, options) {
  const filename = path.basename(from)
  if (fs.statSync(from).isFile() && !path.extname(to)) {
    fs.ensureDir(to)
    return fs.copySync(from, path.join(to, filename), options)
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
            ignore = Array.isArray(ignore) || [ignore]
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
            outputWXSSPath = item.filePath.replace(path.extname(item.filePath), '.wxss')
            let modifySource = outputWXSSPath.replace(appPath + path.sep, '')
            modifySource = modifySource.split(path.sep).join('/')
            Util.printLog(Util.pocessTypeEnum.MODIFY, '样式文件', modifySource)
            outputWXSSPath = outputWXSSPath.replace(sourceDir, outputDir)
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

async function build ({ watch }) {
  process.env.TARO_ENV = Util.BUILD_TYPES.WEAPP
  isProduction = !watch
  buildProjectConfig()
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
