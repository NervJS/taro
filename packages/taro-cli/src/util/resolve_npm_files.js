const fs = require('fs-extra')
const path = require('path')
const resolvePath = require('resolve')
const _ = require('lodash')

const {
  isNpmPkg,
  promoteRelativePath,
  printLog,
  pocessTypeEnum,
  PROJECT_CONFIG,
  replaceContentEnv
} = require('./index')
const { NPM_DIR, OUTPUT_DIR } = require('../config')

const requireRegex = /require\(['"]([\w\d_\-./@]+)['"]\)/ig

const resolvedCache = {}

const basedir = process.cwd()
const projectConfig = require(path.join(basedir, PROJECT_CONFIG))(_.merge)

function resolveNpmFilesPath (pkgName) {
  if (!resolvedCache[pkgName]) {
    try {
      const res = resolvePath.sync(pkgName, { basedir })
      resolvedCache[pkgName] = {
        main: res,
        files: []
      }
      resolvedCache[pkgName].files.push(res)
      recursiveRequire(res, resolvedCache[pkgName].files)
    } catch (error) {
      console.log(error)
    }
  }
  return resolvedCache[pkgName]
}

function recursiveRequire (filePath, files) {
  let fileContent = fs.readFileSync(filePath).toString()
  fileContent = replaceContentEnv(fileContent, projectConfig.env || '')
  fileContent = fileContent.replace(requireRegex, (m, requirePath) => {
    if (isNpmPkg(requirePath)) {
      const res = resolveNpmFilesPath(requirePath)
      const relativeRequirePath = promoteRelativePath(path.relative(filePath, res.main))
      return `require('${relativeRequirePath}')`
    }
    requirePath = path.resolve(path.dirname(filePath), requirePath)
    if (!path.extname(requirePath)) {
      requirePath += '.js'
    }
    if (files.indexOf(requirePath) < 0) {
      files.push(requirePath)
    }
    recursiveRequire(requirePath, files)
    return m
  })
  const outputNpmPath = filePath.replace('node_modules', path.join(OUTPUT_DIR, NPM_DIR))
  fs.ensureDirSync(path.dirname(outputNpmPath))
  fs.writeFileSync(outputNpmPath, fileContent)
  let modifyOutput = outputNpmPath.replace(basedir + path.sep, '')
  modifyOutput = modifyOutput.split(path.sep).join('/')
  printLog(pocessTypeEnum.COPY, 'NPM文件', modifyOutput)
}

function getResolvedCache () {
  return resolvedCache
}

module.exports = {
  getResolvedCache,
  resolveNpmFilesPath
}
