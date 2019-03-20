const fs = require('fs-extra')
const path = require('path')
const resolvePath = require('resolve')
const wxTransformer = require('@tarojs/transformer-wx')
const babel = require('babel-core')
const traverse = require('babel-traverse').default
const t = require('babel-types')
const generate = require('babel-generator').default
const _ = require('lodash')

const defaultUglifyConfig = require('../config/uglify')

const {
  isNpmPkg,
  promoteRelativePath,
  printLog,
  pocessTypeEnum,
  PROJECT_CONFIG,
  generateEnvList,
  REG_TYPESCRIPT,
  BUILD_TYPES,
  REG_STYLE,
  recursiveFindNodeModules
} = require('./index')

const CONFIG = require('../config')
const defaultBabelConfig = require('../config/babel')

const npmProcess = require('./npm')

const excludeNpmPkgs = ['ReactPropTypes']

const resolvedCache = {}
const copyedFiles = {}

const basedir = process.cwd()
const configDir = path.join(basedir, PROJECT_CONFIG)
const projectConfig = require(configDir)(_.merge)
const pluginsConfig = projectConfig.plugins || {}
const outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR

const babelConfig = _.mergeWith({}, defaultBabelConfig, pluginsConfig.babel, (objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return Array.from(new Set(srcValue.concat(objValue)))
  }
})

function resolveNpmPkgMainPath (pkgName, isProduction, npmConfig, buildAdapter = BUILD_TYPES.WEAPP, root = basedir) {
  try {
    return resolvePath.sync(pkgName, { basedir: root })
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log(`缺少npm包${pkgName}，开始安装...`)
      const installOptions = {}
      if (pkgName.indexOf(npmProcess.taroPluginPrefix) >= 0) {
        installOptions.dev = true
      }
      npmProcess.installNpmPkg(pkgName, installOptions)
      return resolveNpmPkgMainPath(pkgName, isProduction, npmConfig, buildAdapter, root)
    }
  }
}

function resolveNpmFilesPath (pkgName, isProduction, npmConfig, buildAdapter = BUILD_TYPES.WEAPP, root = basedir, compileInclude = []) {
  if (!resolvedCache[pkgName]) {
    const res = resolveNpmPkgMainPath(pkgName, isProduction, npmConfig, buildAdapter, root)
    resolvedCache[pkgName] = {
      main: res,
      files: []
    }
    resolvedCache[pkgName].files.push(res)
    recursiveRequire(res, resolvedCache[pkgName].files, isProduction, npmConfig, buildAdapter, compileInclude)
  }
  return resolvedCache[pkgName]
}

function parseAst (ast, filePath, files, isProduction, npmConfig, buildAdapter = BUILD_TYPES.WEAPP, compileInclude) {
  const excludeRequire = []
  traverse(ast, {
    IfStatement (astPath) {
      astPath.traverse({
        BinaryExpression (astPath) {
          const node = astPath.node
          const left = node.left
          if (generate(left).code === 'process.env.TARO_ENV' &&
            node.right.value !== buildAdapter) {
            const consequentSibling = astPath.getSibling('consequent')
            consequentSibling.traverse({
              CallExpression (astPath) {
                if (astPath.get('callee').isIdentifier({ name: 'require' })) {
                  const arg = astPath.get('arguments')[0]
                  if (t.isStringLiteral(arg.node)) {
                    excludeRequire.push(arg.node.value)
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
          CallExpression (astPath) {
            const node = astPath.node
            const callee = node.callee
            if (callee.name === 'require') {
              const args = node.arguments
              let requirePath = args[0].value
              if (excludeRequire.indexOf(requirePath) < 0) {
                if (isNpmPkg(requirePath)) {
                  if (excludeNpmPkgs.indexOf(requirePath) < 0) {
                    const res = resolveNpmFilesPath(requirePath, isProduction, npmConfig, buildAdapter, path.dirname(recursiveFindNodeModules(filePath)), compileInclude)
                    let relativeRequirePath = promoteRelativePath(path.relative(filePath, res.main))
                    relativeRequirePath = relativeRequirePath.replace(/node_modules/g, npmConfig.name)
                    if (buildAdapter === BUILD_TYPES.ALIPAY) {
                      relativeRequirePath = relativeRequirePath.replace(/@/g, '_')
                    }
                    args[0].value = relativeRequirePath
                  }
                } else {
                  let realRequirePath = path.resolve(path.dirname(filePath), requirePath)
                  let tempPathWithJS = `${realRequirePath}.js`
                  let tempPathWithIndexJS = `${realRequirePath}${path.sep}index.js`
                  if (fs.existsSync(tempPathWithJS)) {
                    realRequirePath = tempPathWithJS
                    requirePath += '.js'
                  } else if (fs.existsSync(tempPathWithIndexJS)) {
                    realRequirePath = tempPathWithIndexJS
                    requirePath += '/index.js'
                  }
                  if (files.indexOf(realRequirePath) < 0) {
                    files.push(realRequirePath)
                    recursiveRequire(realRequirePath, files, isProduction, npmConfig, buildAdapter, compileInclude)
                  }
                  args[0].value = requirePath
                }
              }
            }
          }
        })
      }
    }
  })
  return generate(ast).code
}

async function recursiveRequire (filePath, files, isProduction, npmConfig = {}, buildAdapter, compileInclude = []) {
  let fileContent = fs.readFileSync(filePath).toString()
  let outputNpmPath
  if (!npmConfig.dir) {
    const cwdRelate2Npm = path.relative(
      filePath.slice(0, filePath.search('node_modules')),
      process.cwd()
    )
    outputNpmPath = filePath.replace('node_modules', path.join(cwdRelate2Npm, outputDirName, npmConfig.name))
    outputNpmPath = outputNpmPath.replace(/node_modules/g, npmConfig.name)
  } else {
    let npmFilePath = filePath.match(/(?=(node_modules)).*/)[0]
    npmFilePath = npmFilePath.replace(/node_modules/g, npmConfig.name)
    outputNpmPath = path.join(path.resolve(configDir, '..', npmConfig.dir), npmFilePath)
  }
  if (buildAdapter === BUILD_TYPES.ALIPAY) {
    outputNpmPath = outputNpmPath.replace(/@/g, '_')
  }
  if (REG_STYLE.test(path.basename(filePath))) {
    return
  }
  fileContent = npmCodeHack(filePath, fileContent, buildAdapter)
  try {
    const constantsReplaceList = Object.assign({
      'process.env.TARO_ENV': buildAdapter
    }, generateEnvList(projectConfig.env || {}))
    const transformResult = wxTransformer({
      code: fileContent,
      sourcePath: filePath,
      outputPath: outputNpmPath,
      isNormal: true,
      adapter: buildAdapter,
      isTyped: REG_TYPESCRIPT.test(filePath),
      env: constantsReplaceList
    })
    const ast = babel.transformFromAst(transformResult.ast, '', {
      plugins: [
        [require('babel-plugin-transform-define').default, constantsReplaceList]
      ]
    }).ast
    fileContent = parseAst(ast, filePath, files, isProduction, npmConfig, buildAdapter, compileInclude)
  } catch (err) {
    console.log(err)
  }
  if (!copyedFiles[outputNpmPath]) {
    if (compileInclude && compileInclude.length) {
      const filePathArr = filePath.split(path.sep)
      const nodeModulesIndex = filePathArr.indexOf('node_modules')
      const npmPkgName = filePathArr[nodeModulesIndex + 1]
      if (compileInclude.indexOf(npmPkgName) >= 0) {
        const compileScriptRes = await npmProcess.callPlugin('babel', fileContent, filePath, babelConfig)
        fileContent = compileScriptRes.code
      }
    }
    if (isProduction) {
      const uglifyPluginConfig = pluginsConfig.uglify || { enable: true }
      if (uglifyPluginConfig.enable) {
        const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
        const uglifyResult = npmProcess.callPluginSync('uglifyjs', fileContent, outputNpmPath, uglifyConfig)
        if (uglifyResult.error) {
          printLog(pocessTypeEnum.ERROR, '压缩错误', `文件${filePath}`)
          console.log(uglifyResult.error)
        } else {
          fileContent = uglifyResult.code
        }
      }
    }
    fs.ensureDirSync(path.dirname(outputNpmPath))
    fs.writeFileSync(outputNpmPath, fileContent)
    let modifyOutput = outputNpmPath.replace(basedir + path.sep, '')
    modifyOutput = modifyOutput.split(path.sep).join('/')
    printLog(pocessTypeEnum.COPY, 'NPM文件', modifyOutput)
    copyedFiles[outputNpmPath] = true
  }
}

function npmCodeHack (filePath, content, buildAdapter) {
  const basename = path.basename(filePath)
  switch (basename) {
    case 'lodash.js':
    case '_global.js':
    case 'lodash.min.js':
      if (buildAdapter === BUILD_TYPES.ALIPAY || buildAdapter === BUILD_TYPES.SWAN) {
        content = content.replace(/Function\(['"]return this['"]\)\(\)/, '{}')
      } else {
        content = content.replace(/Function\(['"]return this['"]\)\(\)/, 'this')
      }
      break
    case 'mobx.js':
      // 解决支付宝小程序全局window或global不存在的问题
      content = content.replace(
        /typeof window\s{0,}!==\s{0,}['"]undefined['"]\s{0,}\?\s{0,}window\s{0,}:\s{0,}global/,
        'typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {}'
      )
      break
    case '_html.js':
      content = 'module.exports = false;'
      break
    case '_microtask.js':
      content = content.replace('if(Observer)', 'if(false && Observer)')
      // IOS 1.10.2 Promise BUG
      content = content.replace('Promise && Promise.resolve', 'false && Promise && Promise.resolve')
      break
    case '_freeGlobal.js':
      content = content.replace('module.exports = freeGlobal;', 'module.exports = freeGlobal || this || global || {};')
      break
  }
  if (buildAdapter === BUILD_TYPES.ALIPAY && content.replace(/\s\r\n/g, '').length <= 0) {
    content = '// Empty file'
  }
  return content
}

function getResolvedCache () {
  return resolvedCache
}

module.exports = {
  getResolvedCache,
  resolveNpmFilesPath,
  resolveNpmPkgMainPath
}
