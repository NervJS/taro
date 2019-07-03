import * as fs from 'fs-extra'
import * as path from 'path'
import * as resolvePath from 'resolve'
import * as wxTransformer from '@tarojs/transformer-wx'
import * as babel from 'babel-core'
import * as t from 'babel-types'
import traverse from 'babel-traverse'
import generate from 'babel-generator'
import * as _ from 'lodash'

import {
  isNpmPkg,
  promoteRelativePath,
  printLog,
  recursiveFindNodeModules,
  generateEnvList,
  isQuickappPkg
} from './index'

import {
  processTypeEnum,
  REG_TYPESCRIPT,
  BUILD_TYPES,
  REG_STYLE,
  REG_FONT,
  REG_IMAGE,
  REG_MEDIA,
  REG_JSON
} from './constants'

import defaultUglifyConfig from '../config/uglify'

import * as npmProcess from './npm'
import { IInstallOptions, INpmConfig, IResolvedCache, TogglableOptions, ITaroManifestConfig } from './types'

const excludeNpmPkgs = ['ReactPropTypes']

const resolvedCache: IResolvedCache = {}
const copyedFiles = {}

export function resolveNpmPkgMainPath (
  pkgName: string,
  isProduction: boolean,
  npmConfig: INpmConfig,
  buildAdapter: BUILD_TYPES = BUILD_TYPES.WEAPP,
  root: string
) {
  try {
    return resolvePath.sync(pkgName, { basedir: root })
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log(`缺少npm包${pkgName}，开始安装...`)
      const installOptions: IInstallOptions = {
        dev: false
      }
      if (pkgName.indexOf(npmProcess.taroPluginPrefix) >= 0) {
        installOptions.dev = true
      }
      npmProcess.installNpmPkg(pkgName, installOptions)
      return resolveNpmPkgMainPath(pkgName, isProduction, npmConfig, buildAdapter, root)
    }
  }
}

export function resolveNpmFilesPath ({
  pkgName,
  isProduction,
  npmConfig,
  buildAdapter,
  root,
  rootNpm,
  npmOutputDir,
  compileConfig = {},
  env,
  uglify,
  babelConfig,
  quickappManifest
}: {
  pkgName: string,
  isProduction: boolean,
  npmConfig: INpmConfig,
  buildAdapter: BUILD_TYPES,
  root: string,
  rootNpm: string,
  npmOutputDir: string,
  compileConfig: {[k: string]: any},
  env: object,
  uglify: TogglableOptions,
  babelConfig: object,
  quickappManifest?: ITaroManifestConfig
}) {
  if (!resolvedCache[pkgName]) {
    const res = resolveNpmPkgMainPath(pkgName, isProduction, npmConfig, buildAdapter, root)
    resolvedCache[pkgName] = {
      main: res,
      files: []
    }
    resolvedCache[pkgName].files.push(res)
    recursiveRequire({
      filePath: res,
      files: resolvedCache[pkgName].files,
      isProduction,
      npmConfig,
      buildAdapter,
      rootNpm,
      npmOutputDir: npmOutputDir,
      compileConfig,
      env,
      uglify,
      babelConfig,
      quickappManifest
    })
  }
  return resolvedCache[pkgName]
}

function parseAst ({
  ast,
  filePath,
  files,
  isProduction,
  npmConfig,
  rootNpm,
  npmOutputDir,
  buildAdapter,
  compileConfig = [],
  env,
  uglify,
  babelConfig,
  quickappManifest
}: {
  ast: t.File,
  filePath: string,
  files: string[],
  isProduction: boolean,
  npmConfig: INpmConfig,
  rootNpm: string,
  npmOutputDir: string,
  buildAdapter: BUILD_TYPES,
  compileConfig: {[k: string]: any},
  env: object,
  uglify: TogglableOptions,
  babelConfig: object,
  quickappManifest?: ITaroManifestConfig
}) {
  const excludeRequire: string[] = []

  traverse(ast, {
    IfStatement (astPath) {
      astPath.traverse({
        BinaryExpression (astPath) {
          const node = astPath.node
          const left = node.left
          const right = node.right
          if (t.isMemberExpression(left) && t.isStringLiteral(right)) {
            if (generate(left).code === 'process.env.TARO_ENV' &&
              (node.right as t.StringLiteral).value !== buildAdapter) {
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
        }
      })
    },
    Program: {
      exit (astPath) {
        astPath.traverse({
          CallExpression (astPath) {
            const node = astPath.node
            const callee = node.callee as t.Identifier
            if (callee.name === 'require') {
              const args = node.arguments as Array<t.StringLiteral>
              let requirePath = args[0].value
              if (excludeRequire.indexOf(requirePath) < 0) {
                const quickappPkgs = quickappManifest ? quickappManifest.features : []
                if (isQuickappPkg(requirePath, quickappPkgs)) {
                  return
                }
                if (isNpmPkg(requirePath)) {
                  if (excludeNpmPkgs.indexOf(requirePath) < 0) {
                    const res = resolveNpmFilesPath({
                      pkgName: requirePath,
                      isProduction,
                      npmConfig,
                      buildAdapter,
                      root: path.dirname(recursiveFindNodeModules(filePath)),
                      rootNpm,
                      npmOutputDir,
                      compileConfig,
                      env,
                      uglify,
                      babelConfig,
                      quickappManifest
                    })
                    let relativeRequirePath = promoteRelativePath(path.relative(filePath, res.main))
                    relativeRequirePath = relativeRequirePath.replace(/node_modules/g, npmConfig.name)
                    if (buildAdapter === BUILD_TYPES.ALIPAY) {
                      relativeRequirePath = relativeRequirePath.replace(/@/g, '_')
                    }
                    args[0].value = relativeRequirePath
                  }
                } else {
                  let realRequirePath = path.resolve(path.dirname(filePath), requirePath)
                  const tempPathWithJS = `${realRequirePath}.js`
                  const tempPathWithIndexJS = `${realRequirePath}${path.sep}index.js`
                  if (fs.existsSync(tempPathWithJS)) {
                    realRequirePath = tempPathWithJS
                    requirePath += '.js'
                  } else if (fs.existsSync(tempPathWithIndexJS)) {
                    realRequirePath = tempPathWithIndexJS
                    requirePath += '/index.js'
                  }
                  if (files.indexOf(realRequirePath) < 0) {
                    files.push(realRequirePath)
                    recursiveRequire({
                      filePath: realRequirePath,
                      files,
                      isProduction,
                      npmConfig,
                      buildAdapter,
                      rootNpm,
                      npmOutputDir,
                      compileConfig,
                      env,
                      uglify,
                      babelConfig,
                      quickappManifest
                    })
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

async function recursiveRequire ({
  filePath,
  files,
  isProduction,
  npmConfig,
  buildAdapter,
  npmOutputDir,
  rootNpm,
  compileConfig = {},
  env,
  uglify,
  babelConfig,
  quickappManifest
}: {
  filePath: string,
  files: string[],
  isProduction: boolean,
  npmConfig: INpmConfig,
  buildAdapter: BUILD_TYPES,
  rootNpm: string,
  npmOutputDir: string,
  compileConfig: {[k: string]: any},
  env: object,
  uglify: TogglableOptions,
  babelConfig: object,
  quickappManifest?: ITaroManifestConfig
}) {
  let fileContent = fs.readFileSync(filePath).toString()
  let outputNpmPath = filePath.replace(rootNpm, npmOutputDir).replace(/node_modules/g, npmConfig.name)
  if (buildAdapter === BUILD_TYPES.ALIPAY) {
    outputNpmPath = outputNpmPath.replace(/@/g, '_')
  }
  if (REG_STYLE.test(path.basename(filePath))) {
    return
  }
  if (REG_FONT.test(filePath) || REG_IMAGE.test(filePath) || REG_MEDIA.test(filePath) || REG_JSON.test(filePath)) {
    fs.ensureDirSync(path.dirname(outputNpmPath))
    fs.writeFileSync(outputNpmPath, fileContent)
    let modifyOutput = outputNpmPath.replace(path.dirname(rootNpm) + path.sep, '')
    modifyOutput = modifyOutput.split(path.sep).join('/')
    printLog(processTypeEnum.COPY, 'NPM文件', modifyOutput)
    return
  }
  fileContent = npmCodeHack(filePath, fileContent, buildAdapter)

  const npmExclude = (compileConfig.exclude || []).filter(item => /(?:\/|^)node_modules(\/|$)/.test(item))
  let isNpmInCompileExclude = false
  for (const item of npmExclude) {
    isNpmInCompileExclude = filePath.indexOf(item) !== -1
    if (isNpmInCompileExclude) {
      break
    }
  }
  if (!isNpmInCompileExclude) {
    try {
      const constantsReplaceList = Object.assign({
        'process.env.TARO_ENV': buildAdapter
      }, generateEnvList(env || {}))
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
      }).ast as t.File
      fileContent = parseAst({
        ast,
        filePath,
        files,
        isProduction,
        npmConfig,
        rootNpm,
        buildAdapter,
        compileConfig,
        npmOutputDir,
        env,
        uglify,
        babelConfig,
        quickappManifest
      })
    } catch (err) {
      console.log(err)
    }
  }

  if (!copyedFiles[outputNpmPath]) {
    const compileInclude = compileConfig.include
    if (compileInclude && compileInclude.length) {
      const filePathArr = filePath.split(path.sep)
      const nodeModulesIndex = filePathArr.indexOf('node_modules')
      const npmPkgName = filePathArr[nodeModulesIndex + 1]
      if (compileInclude.indexOf(npmPkgName) >= 0) {
        const compileScriptRes = await npmProcess.callPlugin('babel', fileContent, filePath, babelConfig, rootNpm)
        fileContent = compileScriptRes.code
      }
    }
    if (isProduction && buildAdapter !== BUILD_TYPES.QUICKAPP) {
      const uglifyPluginConfig = uglify || { enable: true }
      if (uglifyPluginConfig.enable) {
        const uglifyConfig = Object.assign(defaultUglifyConfig, uglifyPluginConfig.config || {})
        const uglifyResult = npmProcess.callPluginSync('uglifyjs', fileContent, outputNpmPath, uglifyConfig, rootNpm)
        if (uglifyResult.error) {
          printLog(processTypeEnum.ERROR, '压缩错误', `文件${filePath}`)
          console.log(uglifyResult.error)
        } else {
          fileContent = uglifyResult.code
        }
      }
    }
    fs.ensureDirSync(path.dirname(outputNpmPath))
    fs.writeFileSync(outputNpmPath, fileContent)
    let modifyOutput = outputNpmPath.replace(path.dirname(rootNpm) + path.sep, '')
    modifyOutput = modifyOutput.split(path.sep).join('/')
    printLog(processTypeEnum.COPY, 'NPM文件', modifyOutput)
    copyedFiles[outputNpmPath] = true
  }
}

export function npmCodeHack (filePath: string, content: string, buildAdapter: BUILD_TYPES): string {
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

export function getResolvedCache (): IResolvedCache {
  return resolvedCache
}
