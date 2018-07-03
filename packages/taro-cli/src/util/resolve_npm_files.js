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
const { NPM_DIR, OUTPUT_DIR } = require('../config')

const requireRegex = /require\(['"]([\w\d_\-./@]+)['"]\)/ig
const excludeNpmPkgs = ['ReactPropTypes']

const resolvedCache = {}
const copyedFiles = {}

const basedir = process.cwd()
const projectConfig = require(path.join(basedir, PROJECT_CONFIG))(_.merge)
const pluginsConfig = projectConfig.plugins || {}

function resolveNpmFilesPath (pkgName, isProduction) {
  if (!resolvedCache[pkgName]) {
    try {
      const res = resolvePath.sync(pkgName, { basedir })
      resolvedCache[pkgName] = {
        main: res,
        files: []
      }
      resolvedCache[pkgName].files.push(res)
      recursiveRequire(res, resolvedCache[pkgName].files, isProduction)
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        console.log(`缺少npm包${pkgName}，开始安装...`)
        const installOptions = {}
        if (pkgName.indexOf(npmProcess.taroPluginPrefix) >= 0) {
          installOptions.dev = true
        }
        npmProcess.installNpmPkg(pkgName, installOptions)
        return resolveNpmFilesPath(pkgName, isProduction)
      }
    }
  }
  return resolvedCache[pkgName]
}

function recursiveRequire (filePath, files, isProduction) {
  let fileContent = fs.readFileSync(filePath).toString()
  fileContent = replaceContentEnv(fileContent, projectConfig.env || {})
  fileContent = npmCodeHack(filePath, fileContent)
  fileContent = fileContent.replace(requireRegex, (m, requirePath) => {
    if (isNpmPkg(requirePath)) {
      if (excludeNpmPkgs.indexOf(requirePath) >= 0) {
        return `require('${requirePath}')`
      }
      const res = resolveNpmFilesPath(requirePath, isProduction)
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
      recursiveRequire(realRequirePath, files, isProduction)
    }
    return `require('${requirePath}')`
  })
  const outputNpmPath = filePath.replace('node_modules', path.join(OUTPUT_DIR, NPM_DIR))
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
  resolveNpmFilesPath
}
