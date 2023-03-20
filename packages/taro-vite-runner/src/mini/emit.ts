import { promoteRelativePath } from '@tarojs/helper'
import { isFunction, isString,toDashed } from '@tarojs/shared'
import path from 'path'

import { componentConfig } from '../template/component'
import { getCompiler, getComponentName,prettyPrintJson } from '../utils'
import { baseCompName, baseTemplateName,customWrapperName } from '../utils/constants'

import type { Config } from '@tarojs/taro'
import type { PluginContext } from 'rollup'
import type { PluginOption } from 'vite'
import type { TaroCompiler } from '../utils/taroCompiler'

export default function (): PluginOption {
  return [{
    name: 'taro:vite-mini-emit',
    async generateBundle (_outputOpts, bundle) {
      const compiler = getCompiler(this)
      const isUsingCustomWrapper = componentConfig.thirdPartyComponents.has('custom-wrapper')

      if (compiler) {
        const { taroConfig, sourceDir } = compiler
        const template = taroConfig.template

        if (isFunction(compiler.taroConfig.modifyMiniConfigs)) {
          compiler.taroConfig.modifyMiniConfigs(compiler.filesConfig)
        }


        const compPathId = await this.resolve(taroConfig.taroComponentsPath || '@tarojs/components/mini')
        if (compPathId) {
          const id = compPathId.id
          const depsChunks = ['vendors.js', 'common.js']
          let isFound = false
          // eslint-disable-next-line no-inner-declarations
          function collectDeps (chunkName: string) {
            const chunk = bundle[chunkName]
            if (chunk?.type === 'chunk' && chunk.moduleIds.includes(id)) {
              const module = chunk.modules[id]
              module.renderedExports.forEach(item => componentConfig.includes.add(toDashed(item)))
              isFound = true
              return true
            }
          }
          depsChunks.some(chunkName => {
            return collectDeps(chunkName)
          })
          if (!isFound) {
            for (const chunkName in bundle) {
              if (collectDeps(chunkName)) {
                break
              }
            }
          }
        }

        // emit: app.json
        generateConfigFile(this, compiler, {
          filePath: compiler.app.name,
          config: compiler.app.config
        })

        // emit: page
        compiler.pages.forEach(page => {
          const pageConfig = page.config

          if (!page.isNative) {
            const usingComponents = pageConfig.usingComponents = {
              ...pageConfig.usingComponents
            }
            if (isUsingCustomWrapper) {
              const importCustomWrapperPath = promoteRelativePath(path.relative(page.scriptPath, path.join(sourceDir, compiler.getTargetFilePath(customWrapperName, ''))))
              usingComponents[customWrapperName] = importCustomWrapperPath
            }
            if (!template.isSupportRecursive) {
              const importBaseCompPath = promoteRelativePath(path.relative(page.scriptPath, path.join(sourceDir, compiler.getTargetFilePath(baseCompName, ''))))
              usingComponents[baseCompName] = importBaseCompPath
            }
            const importBaseTemplatePath = promoteRelativePath(path.relative(page.scriptPath, path.join(sourceDir, compiler.getTemplatePath(baseTemplateName))))
            generateTemplateFile(this, compiler, {
              filePath: page.scriptPath,
              content: template.buildPageTemplate(importBaseTemplatePath)
            })
          }

          generateConfigFile(this, compiler, {
            filePath: page.name,
            config: pageConfig
          })
        })

        // emit native components' json
        for (const comp of compiler.nativeComponents.values()) {
          generateConfigFile(this, compiler, {
            filePath: comp.name,
            config: comp.config
          })
        }

        // emit: base.xml
        generateTemplateFile(this, compiler, {
          filePath: baseTemplateName,
          content: template.buildTemplate(componentConfig)
        })
        // emit: utils.xs
        generateXSFile(this, compiler, {
          filePath: 'utils',
          content: compiler.taroConfig.template.buildXScript()
        })

        // emit: comp.json, comp.xml
        if (!template.isSupportRecursive) {
          // 如微信、QQ 不支持递归模版的小程序，需要使用自定义组件协助递归
          const baseCompConfig = {
            component: true,
            usingComponents: {
              [baseCompName]: `./${baseCompName}`
            }
          }
          if (isUsingCustomWrapper) {
            baseCompConfig.usingComponents[customWrapperName] = `./${customWrapperName}`
          }
          generateConfigFile(this, compiler, {
            filePath: baseCompName,
            config: baseCompConfig
          })
          generateTemplateFile(this, compiler, {
            filePath: baseCompName,
            content: template.buildBaseComponentTemplate(compiler.fileType.templ)
          })
        }

        // emit: custom-wrapper.json, custom-wrapper.xml
        if (isUsingCustomWrapper) {
          const customWrapperConfig = {
            filePath: customWrapperName,
            config: {
              component: true,
              usingComponents: {
                [customWrapperName]: `./${customWrapperName}`
              }
            }
          }
          if (!template.isSupportRecursive) {
            customWrapperConfig.config.usingComponents[baseCompName] = `./${baseCompName}`
          }
          generateConfigFile(this, compiler, {
            filePath: customWrapperName,
            config: {
              component: true,
              usingComponents: {
                [customWrapperName]: `./${customWrapperName}`
              }
            }
          })
          generateTemplateFile(this, compiler, {
            filePath: customWrapperName,
            content: template.buildCustomComponentTemplate(compiler.fileType.templ)
          })
        } else {
          delete bundle[compiler.getScriptPath(customWrapperName)]
        }

        // @TODO emit: components
        // @TODO emit: tabbar files
      }
    }
  }, {
    name: 'taro:vite-mini-emit-post',
    async generateBundle (_outputOpts, bundle) {
      const compiler = getCompiler(this)
      if (compiler) {
        const { taroConfig } = compiler
        if (isFunction(taroConfig.modifyBuildAssets)) {
          const assets = {}
          for (const name in bundle) {
            const chunk = bundle[name]
            const source = chunk.type === 'asset' ? chunk.source : chunk.code
            assets[chunk.fileName] = {
              source: () => source
            }
          }
          const assetsProxy = new Proxy(assets, {
            set (target, p, newValue) {
              if (!isString(p)) return false

              target[p] = newValue
              const chunk = bundle[p]
              if (chunk.type === 'asset') {
                chunk.source = newValue.source()
              } else {
                chunk.code = newValue.source()
              }
              return true
            },
          })
          taroConfig.modifyBuildAssets(
            assetsProxy,
            {
              pages: compiler.pages,
              filesConfig: compiler.filesConfig,
              getConfigFilePath: compiler.getConfigFilePath,
              options: {
                isBuildPlugin: compiler.taroConfig.isBuildPlugin
              }
            }
          )
        }
      }
    }
  }]
}

function generateConfigFile (ctx: PluginContext, compiler: TaroCompiler, options: { filePath: string, config: Config & { component?: boolean } }) {
  const { filePath, config } = options
  const fileName = compiler.getConfigPath(getComponentName(compiler, filePath))
  const unOfficalConfigs = ['enableShareAppMessage', 'enableShareTimeline', 'components']
  unOfficalConfigs.forEach(item => {
    delete config[item]
  })
  const source = prettyPrintJson(config)
  ctx.emitFile({
    type: 'asset',
    fileName,
    source
  })
}

function generateTemplateFile (ctx: PluginContext, compiler: TaroCompiler, options: { filePath: string, content: string }) {
  let source = options.content
  const fileName = compiler.getTemplatePath(getComponentName(compiler, options.filePath))

  if (compiler.taroConfig.minifyXML?.collapseWhitespace) {
    const minify = require('html-minifier').minify
    source = minify(source, {
      collapseWhitespace: true,
      keepClosingSlash: true
    })
  }

  ctx.emitFile({
    type: 'asset',
    fileName,
    source
  })
}

function generateXSFile (ctx: PluginContext, compiler: TaroCompiler, options: { filePath: string, content: string }) {
  const ext = compiler.fileType.xs

  if (ext == null) return

  const fileName = compiler.getTargetFilePath(options.filePath, ext)

  ctx.emitFile({
    type: 'asset',
    fileName,
    source: options.content
  })
}
