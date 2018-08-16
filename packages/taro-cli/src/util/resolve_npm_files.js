const fs = require('fs-extra')
const path = require('path')
const resolvePath = require('resolve')
const _ = require('lodash')

const defaultUglifyConfig = require('../config/uglify')

const {
  isNpmPkg,
  promoteRelativePath,
  printLog,
  pocessTypeEnum,
  PROJECT_CONFIG,
  replaceContentEnv
} = require('./index')

const npmProcess = require('./npm')

const requireRegex = /require\(['"]([\w\d_\-./@]+)['"]\)/ig
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

function recursiveRequire (filePath, files, isProduction, npmConfig = {}) {
  let fileContent = fs.readFileSync(filePath).toString()
  fileContent = replaceContentEnv(fileContent, projectConfig.env || {})
  fileContent = npmCodeHack(filePath, fileContent)
  fileContent = fileContent.replace(requireRegex, (m, requirePath) => {
    if (isNpmPkg(requirePath)) {
      if (excludeNpmPkgs.indexOf(requirePath) >= 0) {
        return `require('${requirePath}')`
      }
      const res = resolveNpmFilesPath(requirePath, isProduction, npmConfig)
      const relativeRequirePath = promoteRelativePath(path.relative(filePath, res.main))
      return `require('${relativeRequirePath}')`
    }
    let realRequirePath = path.resolve(path.dirname(filePath), requirePath)
    let tempPathWithJS = `${realRequirePath}.js`
    let tempPathWithIndexJS = `${realRequirePath}${path.sep}index.js`
    if (!path.extname(realRequirePath)) {
      if (fs.existsSync(tempPathWithJS)) {
        realRequirePath = tempPathWithJS
      } else if (fs.existsSync(tempPathWithIndexJS)) {
        realRequirePath = tempPathWithIndexJS
        requirePath += '/index.js'
      }
    }
    if (files.indexOf(realRequirePath) < 0) {
      files.push(realRequirePath)
      recursiveRequire(realRequirePath, files, isProduction, npmConfig)
    }
    return `require('${requirePath}')`
  })
  let outputNpmPath
  if (!npmConfig.dir) {
    outputNpmPath = filePath.replace('node_modules', path.join(outputDirName, npmConfig.name))
  } else {
    const npmFilePath = filePath.replace(/(.*)node_modules/, '')
    outputNpmPath = path.join(path.resolve(configDir, '..', npmConfig.dir), npmConfig.name, npmFilePath)
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
