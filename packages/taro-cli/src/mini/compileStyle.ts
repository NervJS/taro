import * as fs from 'fs-extra'
import * as path from 'path'

import * as autoprefixer from 'autoprefixer'
import * as postcss from 'postcss'
import * as pxtransform from 'postcss-pxtransform'
import rewriter from '../quickapp/style-rewriter'
import browserList from '../config/browser_list'
import {
  resolveNpmPkgMainPath,
  resolveNpmFilesPath
} from '../util/resolve_npm_files'
import {
  callPlugin, callPluginSync
} from '../util/npm'
import {
  isNpmPkg,
  processStyleImports,
  promoteRelativePath,
  getBabelConfig,
  normalizeUrl
} from '../util'
import { CSS_EXT, FILE_PROCESSOR_MAP, DEVICE_RATIO_NAME, BUILD_TYPES } from '../util/constants'
import { IMiniAppConfig } from '../util/types'
import { getHashName } from '../util/hash'

import {
  copyFilesFromSrcToOutput,
  getBuildData
} from './helper'

const cssUrlParse = require('postcss-url')
const genericNames = require('generic-names')
const Scope = require('postcss-modules-scope')
const Values = require('postcss-modules-values')
const LocalByDefault = require('postcss-modules-local-by-default')
const ExtractImports = require('postcss-modules-extract-imports')
const ResolveImports = require('postcss-modules-resolve-imports')
interface IStyleObj {
  css: string,
  filePath: string
}

const isBuildingStyles: Map<string, boolean> = new Map<string, boolean>()

export function initCompileStyles () {
  isBuildingStyles.clear()
}

export interface ICSSModulesConf {
  enable: boolean,
  config: {
    generateScopedName: string | ((localName: string, absoluteFilePath: string) => string),
    namingPattern: 'global' | 'module'
  }
}

/**
 * css module processor
 * @param styleObj { css: string, filePath: '' }
 * @returns postcss.process()
 */
export async function processStyleUseCssModule (styleObj: IStyleObj): Promise<any> {
  const { projectConfig, appPath } = getBuildData()
  const weappConf = Object.assign({}, projectConfig.weapp)
  const useModuleConf = weappConf.module || {}
  const customPostcssConf = useModuleConf.postcss || {}
  const customCssModulesConf = Object.assign({
    enable: false,
    config: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      namingPattern: 'global'
    }
  }, customPostcssConf.cssModules || {}) as ICSSModulesConf
  if (!customCssModulesConf.enable) {
    return styleObj
  }
  const namingPattern = customCssModulesConf.config.namingPattern
  if (namingPattern === 'module') {
    // 只对 xxx.module.[css|scss|less|styl] 等样式文件做处理
    const DO_USE_CSS_MODULE_REGEX = /^(.*\.module).*\.(css|scss|less|styl)$/
    if (!DO_USE_CSS_MODULE_REGEX.test(styleObj.filePath)) return styleObj
  } else {
    // 对 xxx.global.[css|scss|less|styl] 等样式文件不做处理
    const DO_NOT_USE_CSS_MODULE_REGEX = /^(.*\.global).*\.(css|scss|less|styl)$/
    if (DO_NOT_USE_CSS_MODULE_REGEX.test(styleObj.filePath)) return styleObj
  }
  const generateScopedName = customCssModulesConf.config.generateScopedName
  const context = appPath
  let scopedName
  if (generateScopedName) {
    scopedName = typeof generateScopedName === 'function'
      ? (local, filename) => generateScopedName(local, filename)
      : genericNames(generateScopedName, { context })
  } else {
    scopedName = (local, filename) => Scope.generateScopedName(local, path.relative(context, filename))
  }
  const postcssPlugins = [
    Values,
    LocalByDefault,
    ExtractImports,
    new Scope({ generateScopedName: scopedName }),
    new ResolveImports({ resolve: Object.assign({}, { extensions: CSS_EXT }) })
  ]
  const runner = postcss(postcssPlugins)
  const cssText = (await compileStyleWithPlugin(styleObj.filePath)).css
  const result = runner.process(cssText, Object.assign({}, { from: styleObj.filePath }))
  return result
}

async function processStyleWithPostCSS (styleObj: IStyleObj): Promise<string> {
  const { appPath, outputDir, sourceDir, projectConfig, npmConfig, isProduction, buildAdapter } = getBuildData()
  const styleFilePath = styleObj.filePath.replace(sourceDir, outputDir)
  const weappConf = Object.assign({}, projectConfig.weapp)
  const { publicPath, staticDirectory, useHashName } = weappConf
  const useModuleConf = weappConf.module || {}
  const customPostcssConf = useModuleConf.postcss || {}
  const customCssModulesConf = Object.assign({
    enable: false,
    config: {
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }, customPostcssConf.cssModules || {})
  const customPxtransformConf = Object.assign({
    enable: true,
    config: {}
  }, customPostcssConf.pxtransform || {})
  const customUrlConf = {
    enable: true,
    config: {
      limit: 10240
    } as any,
    ...customPostcssConf.url
  }
  const customAutoprefixerConf = Object.assign({
    enable: true,
    config: {
      browsers: browserList
    }
  }, customPostcssConf.autoprefixer || {})
  const postcssPxtransformOption = {
    designWidth: projectConfig.designWidth || 750,
    platform: 'weapp'
  }

  if (projectConfig.hasOwnProperty(DEVICE_RATIO_NAME)) {
    postcssPxtransformOption[DEVICE_RATIO_NAME] = projectConfig.deviceRatio
  }

  const postcssPxtransformConf = Object.assign({}, postcssPxtransformOption, customPxtransformConf, customPxtransformConf.config)
  const processors: any[] = []
  if (customAutoprefixerConf.enable) {
    processors.push(autoprefixer(customAutoprefixerConf.config))
  }
  if (customPxtransformConf.enable && buildAdapter !== BUILD_TYPES.QUICKAPP) {
    processors.push(pxtransform(postcssPxtransformConf))
  }
  if (customUrlConf.enable) {
    let options: any[] = []
    const config = customUrlConf.config
    if (Array.isArray(config)) {
      // 数组模式参数同: https://github.com/postcss/postcss-url#muiltiple-options
      options = options.concat(config)
    } else {
      const url = config.url || 'inline'
      const limit = config.limit || 1024
      if (url !== 'inline') {
        options.push(config)
      } else if (limit >= 0) {
        // limit < 0 时忽略`inline`
        options.push({
          url,
          encodeType: 'base64',
          maxSize: limit / 1024,
          ...config
        })
      }
    }

    const customOption = {
      multi: true,
      url: (assets, dir, opts) => {
        if (!/^(https?|data):/.test(assets.url)) {
          const relativePath = path.relative(sourceDir, assets.absolutePath)
          const outputFile = path.resolve(outputDir, `./${staticDirectory||''}`, `./${relativePath}`)

          if (assets.absolutePath) {
            copyFilesFromSrcToOutput([assets.absolutePath])

            if (publicPath) {
              assets.url = normalizeUrl(publicPath, staticDirectory||'', relativePath)
            } else if (staticDirectory) {
              assets.url = path.relative(path.dirname(styleFilePath), outputFile)
            }

            if (useHashName !== false && staticDirectory) {
              const hashName = getHashName(assets.absolutePath, useHashName)
              assets.url = assets.url.replace(path.basename(assets.url), hashName)
            }
          }

          if (buildAdapter === BUILD_TYPES.TT) {
            // 头条下不支持 / ，修正头条css background路径
            assets.url = assets.url.replace(/^[\/]/,'')
          }
        }

        return assets.url
      }
    }

    options.push(customOption) 
    processors.push(cssUrlParse(options))
  }

  const defaultPostCSSPluginNames = ['autoprefixer', 'pxtransform', 'url', 'cssModules']
  Object.keys(customPostcssConf).forEach(pluginName => {
    if (defaultPostCSSPluginNames.indexOf(pluginName) < 0) {
      const pluginConf = customPostcssConf[pluginName]
      if (pluginConf && pluginConf.enable) {
        if (!isNpmPkg(pluginName)) { // local plugin
          pluginName = path.join(appPath, pluginName)
        }
        processors.push(require(resolveNpmPkgMainPath(pluginName, isProduction, npmConfig, buildAdapter, appPath))(pluginConf.config || {}))
      }
    }
  })
  let css = styleObj.css
  if (customCssModulesConf.enable) {
    css = (await processStyleUseCssModule(styleObj)).css
  }
  const postcssResult = await postcss(processors).process(css, {
    from: styleObj.filePath
  })
  return postcssResult.css
}

function compileImportStyles (filePath: string, importStyles: string[]) {
  const { sourceDir, outputDir } = getBuildData()
  if (importStyles.length) {
    importStyles.forEach(async importItem => {
      const importFilePath = path.resolve(filePath, '..', importItem)
      if (fs.existsSync(importFilePath)) {
        await compileDepStyles(importFilePath.replace(sourceDir, outputDir), [importFilePath])
      }
    })
  }
}

function compileStyleWithPlugin (filePath) {
  const { appPath, npmOutputDir, nodeModulesPath, projectConfig, npmConfig, isProduction, buildAdapter, quickappManifest } = getBuildData()
  const fileExt = path.extname(filePath)
  const pluginName = FILE_PROCESSOR_MAP[fileExt]
  const fileContent = fs.readFileSync(filePath).toString()
  const pluginsConfig = projectConfig.plugins || {}
  const weappConf = projectConfig.weapp || {} as IMiniAppConfig
  const useCompileConf = Object.assign({}, weappConf.compile)
  const cssImportsRes = processStyleImports(fileContent, buildAdapter, (str, stylePath) => {
    if (stylePath.indexOf('~') === 0) {
      let newStylePath = stylePath
      newStylePath = stylePath.replace('~', '')
      const npmInfo = resolveNpmFilesPath({
        pkgName: newStylePath,
        isProduction,
        npmConfig,
        buildAdapter,
        root: appPath,
        rootNpm: nodeModulesPath,
        npmOutputDir,
        compileConfig: useCompileConf,
        env: projectConfig.env || {},
        uglify: projectConfig!.plugins!.uglify || {  enable: true  },
        babelConfig: getBabelConfig(projectConfig!.plugins!.babel) || {},
        quickappManifest
      })
      const importRelativePath = promoteRelativePath(path.relative(filePath, npmInfo.main))
      return str.replace(stylePath, importRelativePath)
    }
    return str
  })
  compileImportStyles(filePath, cssImportsRes.imports)
  if (pluginName) {
    return callPlugin(pluginName, cssImportsRes.content, filePath, pluginsConfig[pluginName] || {}, appPath)
      .then(res => ({
        css: cssImportsRes.style.join('\n') + '\n' + res.css,
        filePath
      })).catch(err => {
        if (err) {
          console.log(err)
          if (isProduction) {
            process.exit(0)
          }
        }
      })
  }
  return new Promise(resolve => {
    resolve({
      css: cssImportsRes.style.join('\n') + '\n' + cssImportsRes.content,
      filePath
    })
  })
}

export function compileDepStyles (outputFilePath: string, styleFiles: string[]) {
  if (isBuildingStyles.get(outputFilePath)) {
    return Promise.resolve({})
  }
  const { appPath, projectConfig, isProduction, buildAdapter } = getBuildData()
  const isQuickApp = buildAdapter === BUILD_TYPES.QUICKAPP
  const pluginsConfig = projectConfig.plugins || {}
  isBuildingStyles.set(outputFilePath, true)
  return Promise.all(styleFiles.map(async p => compileStyleWithPlugin(p))).then(async resList => {
    await Promise.all(resList.map(res => processStyleWithPostCSS(res)))
      .then(cssList => {
        let resContent = cssList.map(res => res).join('\n')
        // 非生产模式下用户 csso 配置不存在则默认 csso 为禁用
        let cssoPuginConfig = pluginsConfig.csso || { enable: false }
        if (isProduction) {
          cssoPuginConfig = pluginsConfig.csso || { enable: true }
        }
        if (cssoPuginConfig.enable) {
          const cssoConfig = cssoPuginConfig.config || {}
          const cssoResult = callPluginSync('csso', resContent, outputFilePath, cssoConfig, appPath)
          resContent = cssoResult.css
        }
        if (isQuickApp) {
          const transformStyle = rewriter(resContent, isProduction)
          if(transformStyle) {
            resContent = transformStyle
          }
        }

        fs.ensureDirSync(path.dirname(outputFilePath))
        fs.writeFileSync(outputFilePath, resContent)
      })
  })
}
