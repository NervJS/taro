const fs = require('fs-extra')
const path = require('path')
const resolvePath = require('resolve')
const wxTransformer = require('@tarojs/transformer-wx')
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
  replaceContentEnv,
  REG_TYPESCRIPT,
  BUILD_TYPES,
  REG_STYLE
} = require('./index')

const npmProcess = require('./npm')

const excludeNpmPkgs = ['ReactPropTypes']

const resolvedCache = {}
const copyedFiles = {}

const basedir = process.cwd()
const configDir = path.join(basedir, PROJECT_CONFIG)
const projectConfig = require(configDir)(_.merge)
const pluginsConfig = projectConfig.plugins || {}
const outputDirName = projectConfig.outputRoot || CONFIG.OUTPUT_DIR

function resolveNpmPkgMainPath (pkgName, isProduction, npmConfig) {
  try {
    return resolvePath.sync(pkgName, { basedir })
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log(`缺少npm包${pkgName}，开始安装...`)
      const installOptions = {}
      if (pkgName.indexOf(npmProcess.taroPluginPrefix) >= 0) {
        installOptions.dev = true
      }
      npmProcess.installNpmPkg(pkgName, installOptions)
      return resolveNpmPkgMainPath(pkgName, isProduction, npmConfig)
    }
  }
}

function resolveNpmFilesPath (pkgName, isProduction, npmConfig) {
  if (!resolvedCache[pkgName]) {
    const res = resolveNpmPkgMainPath(pkgName, isProduction, npmConfig)
    resolvedCache[pkgName] = {
      main: res,
      files: []
    }
    resolvedCache[pkgName].files.push(res)
    recursiveRequire(res, resolvedCache[pkgName].files, isProduction, npmConfig)
  }
  return resolvedCache[pkgName]
}

function parseAst (ast, filePath, files, isProduction, npmConfig) {
  const excludeRequire = []
  traverse(ast, {
    IfStatement (astPath) {
      astPath.traverse({
        BinaryExpression (astPath) {
          const node = astPath.node
          const left = node.left
          if (generate(left).code === 'process.env.TARO_ENV' &&
            node.right.value !== BUILD_TYPES.WEAPP) {
            const consequentSibling = astPath.getSibling('consequent')
            consequentSibling.traverse({
              CallExpression (astPath) {
                if (astPath.get('callee').isIdentifier({ name : 'require'})) {
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
                    const res = resolveNpmFilesPath(requirePath, isProduction, npmConfig)
                    const relativeRequirePath = promoteRelativePath(path.relative(filePath, res.main))
                    args[0].value = relativeRequirePath
                  }
                } else {
                  let realRequirePath = path.resolve(path.dirname(filePath), requirePath)
                  let tempPathWithJS = `${realRequirePath}.js`
                  let tempPathWithIndexJS = `${realRequirePath}${path.sep}index.js`
                  if (fs.existsSync(tempPathWithJS)) {
                    realRequirePath = tempPathWithJS
                  } else if (fs.existsSync(tempPathWithIndexJS)) {
                    realRequirePath = tempPathWithIndexJS
                    requirePath += '/index.js'
                  }
                  if (files.indexOf(realRequirePath) < 0) {
                    files.push(realRequirePath)
                    recursiveRequire(realRequirePath, files, isProduction, npmConfig)
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

function recursiveRequire (filePath, files, isProduction, npmConfig = {}) {
  let fileContent = fs.readFileSync(filePath).toString()
  let outputNpmPath
  if (!npmConfig.dir) {
    outputNpmPath = filePath.replace('node_modules', path.join(outputDirName, npmConfig.name))
  } else {
    const npmFilePath = filePath.replace(/(.*)node_modules/, '')
    outputNpmPath = path.join(path.resolve(configDir, '..', npmConfig.dir), npmConfig.name, npmFilePath)
  }
  if (REG_STYLE.test(path.basename(filePath))) {
    return
  }
  fileContent = replaceContentEnv(fileContent, projectConfig.env || {})
  fileContent = npmCodeHack(filePath, fileContent)
  try {
    const transformResult = wxTransformer({
      code: fileContent,
      sourcePath: filePath,
      outputPath: outputNpmPath,
      isNormal: true,
      isTyped: REG_TYPESCRIPT.test(filePath)
    })
    fileContent = parseAst(transformResult.ast, filePath, files, isProduction, npmConfig)
  } catch (err) {
    console.log(err)
  }
  if (!copyedFiles[outputNpmPath]) {
    if (isProduction) {
      const uglifyPluginConfig = pluginsConfig.uglify || { enable: true }
      if (uglifyPluginConfig.enable) {
        const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
        const uglifyResult = npmProcess.callPluginSync('uglifyjs', fileContent, outputNpmPath, uglifyConfig)
        if (uglifyResult.error) {
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

function npmCodeHack (filePath, content) {
  const basename = path.basename(filePath)
  switch (basename) {
    case 'lodash.js':
    case '_global.js':
      content = content.replace('Function(\'return this\')()', 'this')
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
      content = content.replace('module.exports = freeGlobal;', 'module.exports = freeGlobal || this;')
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
