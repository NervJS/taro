const fs = require('fs-extra')
const path = require('path')
const chokidar = require('chokidar')
const wxTransformer = require('@tarojs/transformer-wx')
const klaw = require('klaw')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const babel = require('babel-core')
const generate = require('babel-generator').default
const _ = require('lodash')
const rimraf = require('rimraf')

const Util = require('./util')
const npmProcess = require('./util/npm')
const CONFIG = require('./config')
const { source: toAst } = require('./util/ast_convert')

const PACKAGES = {
  '@tarojs/taro': '@tarojs/taro',
  '@tarojs/taro-h5': '@tarojs/taro-h5',
  '@tarojs/redux': '@tarojs/redux',
  '@tarojs/redux-h5': '@tarojs/redux-h5',
  '@tarojs/mobx': '@tarojs/mobx',
  '@tarojs/mobx-h5': '@tarojs/mobx-h5',
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
const routerImportName = 'Router'
const tabBarComponentName = 'Tabbar'
const tabBarContainerComponentName = 'TabbarContainer'
const tabBarPanelComponentName = 'TabbarPanel'
const providerComponentName = 'Provider'
const setStoreFuncName = 'setStore'
const tabBarConfigName = '__tabs'
const tempDir = '.temp'
const DEVICE_RATIO = 'deviceRatio'

const appPath = process.cwd()
const projectConfig = require(path.join(appPath, Util.PROJECT_CONFIG))(_.merge)
const sourceDirName = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
const sourceDir = path.join(appPath, sourceDirName)
const tempPath = path.join(appPath, tempDir)
const entryFilePath = Util.resolveScriptPath(path.join(sourceDir, CONFIG.ENTRY))
const entryFileName = path.basename(entryFilePath)
let pxTransformConfig = { designWidth: projectConfig.designWidth || 750 }

if (projectConfig.hasOwnProperty(DEVICE_RATIO)) {
  pxTransformConfig[DEVICE_RATIO] = projectConfig.deviceRatio
}

let pages = []
let tabBar
let tabbarPos

const FILE_TYPE = {
  ENTRY: 'ENTRY',
  PAGE: 'PAGE',
  COMPONENT: 'COMPONENT',
  NORMAL: 'NORMAL'
}

const isUnderSubPackages = (parentPath) => (parentPath.isObjectProperty() && /subPackages|subpackages/i.test(parentPath.node.key.name))

function processEntry (code, filePath) {
  let ast = wxTransformer({
    code,
    sourcePath: filePath,
    isNormal: true,
    isTyped: Util.REG_TYPESCRIPT.test(filePath),
    adapter: 'h5'
  }).ast
  let taroImportDefaultName
  let providorImportName
  let storeName
  let renderCallCode

  let hasAddNervJsImportDefaultName = false
  let hasComponentWillMount = false
  let hasComponentDidMount = false
  let hasComponentDidShow = false
  let hasComponentDidHide = false
  let hasComponentWillUnmount = false
  let hasJSX = false
  let hasState = false

  const initPxTransformNode = toAst(`Taro.initPxTransform(${JSON.stringify(pxTransformConfig)})`)

  ast = babel.transformFromAst(ast, '', {
    plugins: [
      [require('babel-plugin-danger-remove-unused-import'), { ignore: ['@tarojs/taro', 'react', 'nervjs'] }]
    ]
  }).ast

  const ClassDeclarationOrExpression = {
    enter (astPath) {
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
        resetTSClassProperty(node.body.body)
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
    }
  }

  /**
   * ProgramExit使用的visitor
   * 负责修改render函数的内容，在componentDidMount中增加componentDidShow调用，在componentWillUnmount中增加componentDidHide调用。
   */
  const programExitVisitor = {
    ClassMethod: {
      exit (astPath) {
        const node = astPath.node
        const key = node.key
        let funcBody
        if (!t.isIdentifier(key)) return

        const isRender = key.name === 'render'
        const isComponentWillMount = key.name === 'componentWillMount'
        const isComponentDidMount = key.name === 'componentDidMount'
        const isComponentWillUnmount = key.name === 'componentWillUnmount'

        if (isRender) {
          const pageRequires = pages.map(v => {
            const absPagename = v.startsWith('/') ? v : `/${v}`
            const relPagename = `.${absPagename}`
            return `['${absPagename}', require('${relPagename}').default]`
          }).join(',')
          funcBody = `<${routerImportName} routes={[${pageRequires}]} />`

          /* 插入Tabbar */
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
                  <${tabBarComponentName} conf={this.state.${tabBarConfigName}} homePage="${homePage}" router={${taroImportDefaultName}}/>
                </${tabBarContainerComponentName}>`
            }
          }

          /* 插入<Provider /> */
          if (providerComponentName && storeName) {
            // 使用redux 或 mobx
            funcBody = `
              <${providorImportName} store={${storeName}}>
                ${funcBody}
              </${providorImportName}>`
          }

          /* 插入<TaroRouter.Router /> */
          node.body = toAst(`{return (${funcBody});}`)
        }
        if (tabBar && isComponentWillMount) {
          const initTabBarApisCallNode = toAst(`Taro.initTabBarApis(this, Taro)`)
          astPath.get('body').pushContainer('body', initTabBarApisCallNode)
        }

        if (hasComponentDidShow && isComponentDidMount) {
          const componentDidShowCallNode = toAst(`this.componentDidShow()`)
          astPath.get('body').pushContainer('body', componentDidShowCallNode)
        }

        if (hasComponentDidHide && isComponentWillUnmount) {
          const componentDidHideCallNode = toAst(`this.componentDidHide()`)
          astPath.get('body').unshiftContainer('body', componentDidHideCallNode)
        }
      }
    },
    ClassProperty: {
      exit (astPath) {
        const node = astPath.node
        const key = node.key
        const value = node.value
        if (key.name !== 'state' || !t.isObjectExpression(value)) return
        astPath.node.value.properties.push(t.objectProperty(
          t.identifier(tabBarConfigName),
          tabBar
        ))
      }
    },
    ClassBody: {
      exit (astPath) {
        if (hasComponentDidShow && !hasComponentDidMount) {
          astPath.pushContainer('body', t.classMethod(
            'method', t.identifier('componentDidMount'), [],
            t.blockStatement([]), false, false))
        }
        if (hasComponentDidHide && !hasComponentWillUnmount) {
          astPath.pushContainer('body', t.classMethod(
            'method', t.identifier('componentWillUnmount'), [],
            t.blockStatement([]), false, false))
        }
        if (tabBar) {
          if (!hasComponentWillMount) {
            astPath.pushContainer('body', t.classMethod(
              'method', t.identifier('componentWillMount'), [],
              t.blockStatement([]), false, false))
          }
          if (!hasState) {
            astPath.unshiftContainer('body', t.classProperty(
              t.identifier('state'),
              t.objectExpression([])
            ))
          }
        }
      }
    }
  }

  /**
   * ClassProperty使用的visitor
   * 负责收集config中的pages，收集tabbar的position，替换icon。
   */
  const classPropertyVisitor = {
    ObjectProperty (astPath) {
      const node = astPath.node
      const key = node.key
      const value = node.value
      const keyName = t.isIdentifier(key) ? key.name : key.value
      if (keyName === 'pages' && t.isArrayExpression(value)) {
        const subPackageParent = astPath.findParent(isUnderSubPackages)
        let root = ''
        if (subPackageParent) {
          /* 在subPackages属性下，说明是分包页面，需要处理root属性 */
          const rootNode = astPath.parent.properties.find(v => {
            return t.isIdentifier(v.key, { name: 'root' })
          })
          root = rootNode ? rootNode.value.value : ''
        }
        value.elements.forEach(v => {
          const pagePath = `${root}/${v.value}`.replace(/\/{2,}/g, '/')
          pages.push(pagePath)
        })
      } else if (keyName === 'tabBar' && t.isObjectExpression(value)) {
        // tabBar
        tabBar = value
        value.properties.forEach(node => {
          if (node.keyName === 'position') tabbarPos = node.value.value
        })
      } else if ((keyName === 'iconPath' || keyName === 'selectedIconPath') && t.isStringLiteral(value)) {
        astPath.replaceWith(
          t.objectProperty(t.stringLiteral(keyName), t.callExpression(t.identifier('require'), [t.stringLiteral(`./${value.value}`)]))
        )
      }
    }
  }

  traverse(ast, {
    ClassExpression: ClassDeclarationOrExpression,
    ClassDeclaration: ClassDeclarationOrExpression,
    ClassProperty: {
      enter (astPath) {
        const node = astPath.node
        const key = node.key
        const value = node.value
        if (key.name === 'state') hasState = true
        if (key.name !== 'config' || !t.isObjectExpression(value)) return
        astPath.traverse(classPropertyVisitor)
      }
    },
    ImportDeclaration: {
      enter (astPath) {
        const node = astPath.node
        const source = node.source
        const value = source.value
        const specifiers = node.specifiers
        if (!Util.isNpmPkg(value)) {
          if (value.indexOf('.') === 0) {
            const pathArr = value.split('/')
            if (pathArr.indexOf('pages') >= 0) {
              astPath.remove()
            } else if (Util.REG_SCRIPTS.test(value)) {
              /* TODO windows下路径处理可能有问题 ../../lib/utils.js */
              const dirname = path.dirname(value)
              const extname = path.extname(value)
              node.source = t.stringLiteral(path.format({
                dir: dirname,
                base: path.basename(value, extname)
              }))
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
          source.value = PACKAGES['@tarojs/redux-h5']
        } else if (value === PACKAGES['@tarojs/mobx']) {
          const specifier = specifiers.find(item => {
            return t.isImportSpecifier(item) && item.imported.name === providerComponentName
          })
          if (specifier) {
            providorImportName = specifier.local.name
          } else {
            providorImportName = providerComponentName
            specifiers.push(t.importSpecifier(t.identifier(providerComponentName), t.identifier(providerComponentName)))
          }
          source.value = PACKAGES['@tarojs/mobx-h5']
        }
      }
    },
    CallExpression: {
      enter (astPath) {
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
      }
    },
    ClassMethod: {
      exit (astPath) {
        const node = astPath.node
        const key = node.key
        if (t.isIdentifier(key)) {
          if (key.name === 'componentWillMount') {
            hasComponentWillMount = true
          }
          if (key.name === 'componentDidMount') {
            hasComponentDidMount = true
          } else if (key.name === 'componentDidShow') {
            hasComponentDidShow = true
          } else if (key.name === 'componentDidHide') {
            hasComponentDidHide = true
          } else if (key.name === 'componentWillUnmount') {
            hasComponentWillUnmount = true
          }
        }
      }
    },
    JSXElement: {
      enter (astPath) {
        hasJSX = true
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
        const importNervjsNode = t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
        const importRouterNode = toAst(`import { ${routerImportName} } from '${PACKAGES['@tarojs/router']}'`)
        const importTaroH5Node = toAst(`import ${taroImportDefaultName} from '${PACKAGES['@tarojs/taro-h5']}'`)
        const renderCallNode = toAst(renderCallCode)
        const importComponentNode = toAst(`import { View, ${tabBarComponentName}, ${tabBarContainerComponentName}, ${tabBarPanelComponentName}} from '${PACKAGES['@tarojs/components']}'`)
        const lastImportIndex = _.findLastIndex(astPath.node.body, t.isImportDeclaration)
        const lastImportNode = astPath.get(`body.${lastImportIndex > -1 ? lastImportIndex : 0}`)
        const extraNodes = [
          importTaroH5Node,
          importRouterNode,
          initPxTransformNode
        ]

        astPath.traverse(programExitVisitor)

        if (hasJSX && !hasAddNervJsImportDefaultName) {
          extraNodes.unshift(importNervjsNode)
        }
        if (tabBar) {
          extraNodes.unshift(importComponentNode)
        }

        lastImportNode.insertAfter(extraNodes)

        astPath.pushContainer('body', renderCallNode)
      }
    }
  })
  const generateCode = generate(ast).code
  return {
    code: generateCode
  }
}

function processOthers (code, filePath) {
  let ast = wxTransformer({
    code,
    sourcePath: filePath,
    isNormal: true,
    isTyped: Util.REG_TYPESCRIPT.test(filePath),
    adapter: 'h5'
  }).ast
  let taroImportDefaultName
  let hasAddNervJsImportDefaultName = false
  let hasJSX = false

  ast = babel.transformFromAst(ast, '', {
    plugins: [
      [require('babel-plugin-danger-remove-unused-import'), { ignore: ['@tarojs/taro', 'react', 'nervjs'] }]
    ]
  }).ast

  const ClassDeclarationOrExpression = {
    enter (astPath) {
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
        resetTSClassProperty(node.body.body)
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
    }
  }

  traverse(ast, {
    ClassExpression: ClassDeclarationOrExpression,
    ClassDeclaration: ClassDeclarationOrExpression,
    ImportDeclaration: {
      enter (astPath) {
        const node = astPath.node
        const source = node.source
        const value = source.value
        const specifiers = node.specifiers
        if (!Util.isNpmPkg(value)) {
          if (Util.REG_SCRIPTS.test(value)) {
            const dirname = path.dirname(value)
            const extname = path.extname(value)
            node.source = t.stringLiteral(path.format({
              dir: dirname,
              base: path.basename(value, extname)
            }))
          }
        } else if (value === PACKAGES['@tarojs/taro']) {
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
          source.value = PACKAGES['@tarojs/redux-h5']
        } else if (value === PACKAGES['@tarojs/mobx']) {
          source.value = PACKAGES['@tarojs/mobx-h5']
        }
      }
    },
    JSXElement: {
      enter (astPath) {
        hasJSX = true
      }
    },
    Program: {
      exit (astPath) {
        const node = astPath.node
        if (hasJSX && !hasAddNervJsImportDefaultName) {
          node.body.unshift(
            t.importDeclaration([
              t.importDefaultSpecifier(t.identifier(nervJsImportDefaultName))
            ], t.stringLiteral(PACKAGES['nervjs']))
          )
        }
        if (taroImportDefaultName) {
          const importTaro = toAst(`import ${taroImportDefaultName} from '${PACKAGES['@tarojs/taro-h5']}'`)
          node.body.unshift(importTaro)
        }
      }
    }
  })
  const generateCode = generate(ast).code
  return {
    code: generateCode
  }
}

/**
 * TS 编译器会把 class property 移到构造器，
 * 而小程序要求 `config` 和所有函数在初始化(after new Class)之后就收集到所有的函数和 config 信息，
 * 所以当如构造器里有 this.func = () => {...} 的形式，就给他转换成普通的 classProperty function
 * 如果有 config 就给他还原
 */
function resetTSClassProperty (body) {
  for (const method of body) {
    if (t.isClassMethod(method) && method.kind === 'constructor') {
      for (const statement of _.cloneDeep(method.body.body)) {
        if (t.isExpressionStatement(statement) && t.isAssignmentExpression(statement.expression)) {
          const expr = statement.expression
          const { left, right } = expr
          if (
            t.isMemberExpression(left) &&
              t.isThisExpression(left.object) &&
              t.isIdentifier(left.property)
          ) {
            if (
              (t.isArrowFunctionExpression(right) || t.isFunctionExpression(right)) ||
                (left.property.name === 'config' && t.isObjectExpression(right))
            ) {
              body.push(
                t.classProperty(left.property, right)
              )
              _.remove(method.body.body, statement)
            }
          }
        }
      }
    }
  }
}

function classifyFiles (filename) {
  const relPath = path.normalize(
    path.relative(appPath, filename)
  )
  if (relPath.indexOf(entryFileName) >= 0) return FILE_TYPE.ENTRY

  if (pages.some(page => {
    if (relPath.indexOf(page) >= 0) return true
  })) {
    return FILE_TYPE.PAGE
  } else {
    return FILE_TYPE.NORMAL
  }
}
function getDist (filename, isScriptFile) {
  const dirname = path.dirname(filename)
  const distDirname = dirname.replace(sourceDir, tempDir)
  return isScriptFile
    ? path.format({
      dir: distDirname,
      ext: '.js',
      name: path.basename(filename, path.extname(filename))
    })
    : path.format({
      dir: distDirname,
      base: path.basename(filename)
    })
}

function processFiles (filePath) {
  const file = fs.readFileSync(filePath)
  const fileType = classifyFiles(filePath)
  const dirname = path.dirname(filePath)
  const extname = path.extname(filePath)
  const distDirname = dirname.replace(sourceDir, tempDir)
  const isScriptFile = Util.REG_SCRIPTS.test(extname)
  const distPath = getDist(filePath, isScriptFile)

  try {
    if (isScriptFile) {
      // 脚本文件 处理一下
      const content = file.toString()
      const transformResult = fileType === FILE_TYPE.ENTRY
        ? processEntry(content, filePath)
        : processOthers(content, filePath)
      const jsCode = unescape(transformResult.code.replace(/\\u/g, '%u'))
      fs.ensureDirSync(distDirname)
      fs.writeFileSync(distPath, Buffer.from(jsCode))
    } else {
      // 其他 直接复制
      fs.ensureDirSync(distDirname)
      fs.copySync(filePath, distPath)
    }
  } catch (e) {
    console.log(e)
  }
}

function watchFiles () {
  const watcher = chokidar.watch(path.join(sourceDir), {
    ignored: /(^|[/\\])\../,
    persistent: true,
    ignoreInitial: true
  })
  watcher
    .on('add', filePath => {
      pages = []
      const relativePath = path.relative(appPath, filePath)
      Util.printLog(Util.pocessTypeEnum.CREATE, '添加文件', relativePath)
      processFiles(filePath)
    })
    .on('change', filePath => {
      pages = []
      const relativePath = path.relative(appPath, filePath)
      Util.printLog(Util.pocessTypeEnum.MODIFY, '文件变动', relativePath)
      processFiles(filePath)
    })
    .on('unlink', filePath => {
      const relativePath = path.relative(appPath, filePath)
      const extname = path.extname(relativePath)
      const isScriptFile = Util.REG_SCRIPTS.test(extname)
      const dist = getDist(filePath, isScriptFile)
      Util.printLog(Util.pocessTypeEnum.UNLINK, '删除文件', relativePath)
      fs.unlinkSync(dist)
    })
}

function buildTemp () {
  fs.ensureDirSync(tempPath)
  return new Promise((resolve, reject) => {
    klaw(sourceDir)
      .on('data', file => {
        const relativePath = path.relative(appPath, file.path)
        if (!file.stats.isDirectory()) {
          Util.printLog(Util.pocessTypeEnum.CREATE, '发现文件', relativePath)
          processFiles(file.path)
        }
      })
      .on('end', () => {
        resolve()
      })
  })
}

async function buildDist (buildConfig) {
  const { watch } = buildConfig
  const h5Config = projectConfig.h5 || {}
  const entryFile = path.basename(entryFileName, path.extname(entryFileName)) + '.js'
  const sourceRoot = projectConfig.sourceRoot || CONFIG.SOURCE_DIR
  const outputRoot = projectConfig.outputRoot || CONFIG.OUTPUT_DIR
  Util.emptyDirectory(path.join(appPath, outputRoot))
  h5Config.env = projectConfig.env
  Object.assign(h5Config.env, {
    TARO_ENV: JSON.stringify(Util.BUILD_TYPES.H5)
  })
  h5Config.defineConstants = projectConfig.defineConstants
  h5Config.plugins = projectConfig.plugins
  h5Config.designWidth = projectConfig.designWidth
  if (projectConfig.deviceRatio) {
    h5Config.deviceRatio = projectConfig.deviceRatio
  }
  h5Config.sourceRoot = sourceRoot
  h5Config.outputRoot = outputRoot
  h5Config.entry = Object.assign({
    app: [path.join(tempPath, entryFile)]
  }, h5Config.entry)
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

async function build (buildConfig) {
  process.env.TARO_ENV = Util.BUILD_TYPES.H5
  await clean()
  await buildTemp(buildConfig)
  await buildDist(buildConfig)
  if (buildConfig.watch) {
    watchFiles()
  }
}

module.exports = {
  build,
  buildTemp
}
