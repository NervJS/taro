import path from 'node:path'

import { promoteRelativePath } from '@tarojs/helper'
import { isFunction, isString, toDashed } from '@tarojs/shared'

import { getComponentName, prettyPrintJson } from '../utils'
import { componentConfig } from '../utils/component'
import { baseCompName, baseTemplateName, customWrapperName } from '../utils/constants'

import type { Config } from '@tarojs/taro'
import type { ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginContext } from 'rollup'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteMiniCompilerContext): PluginOption {
  return [{
    name: 'taro:vite-mini-emit',
    async generateBundle (_outputOpts, bundle) {
      const isUsingCustomWrapper = componentConfig.thirdPartyComponents.has('custom-wrapper')

      if (viteCompilerContext) {
        const { taroConfig, sourceDir } = viteCompilerContext
        const template = taroConfig.template

        if (isFunction(viteCompilerContext.taroConfig.modifyMiniConfigs)) {
          viteCompilerContext.taroConfig.modifyMiniConfigs(viteCompilerContext.filesConfig)
        }

        const compPathId = await this.resolve(taroConfig.taroComponentsPath)
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
        generateConfigFile(this, viteCompilerContext, {
          filePath: viteCompilerContext.app.name,
          config: viteCompilerContext.app.config
        })

        // emit: page
        viteCompilerContext.pages.forEach(page => {
          const pageConfig = page.config

          if (!page.isNative) {
            const usingComponents = pageConfig.usingComponents = {
              ...pageConfig.usingComponents
            }
            if (isUsingCustomWrapper) {
              const importCustomWrapperPath = promoteRelativePath(path.relative(page.scriptPath, path.join(sourceDir, viteCompilerContext.getTargetFilePath(customWrapperName, ''))))
              usingComponents[customWrapperName] = importCustomWrapperPath
            }
            if (!template.isSupportRecursive) {
              const importBaseCompPath = promoteRelativePath(path.relative(page.scriptPath, path.join(sourceDir, viteCompilerContext.getTargetFilePath(baseCompName, ''))))
              usingComponents[baseCompName] = importBaseCompPath
            }
            const importBaseTemplatePath = promoteRelativePath(path.relative(page.scriptPath, path.join(sourceDir, viteCompilerContext.getTemplatePath(baseTemplateName))))
            generateTemplateFile(this, viteCompilerContext, {
              filePath: page.scriptPath,
              content: template.buildPageTemplate(importBaseTemplatePath)
            })
          }

          generateConfigFile(this, viteCompilerContext, {
            filePath: page.name,
            config: pageConfig
          })
        })

        // emit native components' json
        for (const comp of viteCompilerContext.nativeComponents.values()) {
          if (comp.isPackage) continue
          generateConfigFile(this, viteCompilerContext, {
            filePath: comp.name,
            config: comp.config
          })
        }

        // emit: base.xml
        generateTemplateFile(this, viteCompilerContext, {
          filePath: baseTemplateName,
          content: template.buildTemplate(componentConfig)
        })

        if (template.isUseXS) {
          // emit: utils.xs
          generateXSFile(this, viteCompilerContext, {
            filePath: 'utils',
            content: viteCompilerContext.taroConfig.template.buildXScript()
          })
        }

        // emit: comp.json, comp.xml
        if (!template.isSupportRecursive) {
          // 如微信、QQ 不支持递归模版的小程序，需要使用自定义组件协助递归
          const baseCompConfig = {
            component: true,
            styleIsolation: 'apply-shared',
            usingComponents: {
              [baseCompName]: `./${baseCompName}`
            }
          } as Config & { component?: boolean, usingComponents: Record<string, string> }
          if (isUsingCustomWrapper) {
            baseCompConfig.usingComponents[customWrapperName] = `./${customWrapperName}`
          }
          generateConfigFile(this, viteCompilerContext, {
            filePath: baseCompName,
            config: baseCompConfig
          })
          generateTemplateFile(this, viteCompilerContext, {
            filePath: baseCompName,
            content: template.buildBaseComponentTemplate(viteCompilerContext.fileType.templ)
          })
        }

        // emit: custom-wrapper.json, custom-wrapper.xml
        if (isUsingCustomWrapper) {
          const customWrapperConfig = {
            filePath: customWrapperName,
            config: {
              component: true,
              styleIsolation: 'apply-shared',
              usingComponents: {
                [customWrapperName]: `./${customWrapperName}`
              }
            }
          }
          if (!template.isSupportRecursive) {
            customWrapperConfig.config.usingComponents[baseCompName] = `./${baseCompName}`
          }
          generateConfigFile(this, viteCompilerContext, {
            filePath: customWrapperName,
            config: {
              component: true,
              styleIsolation: 'apply-shared',
              usingComponents: {
                [customWrapperName]: `./${customWrapperName}`
              }
            }
          })
          generateTemplateFile(this, viteCompilerContext, {
            filePath: customWrapperName,
            content: template.buildCustomComponentTemplate(viteCompilerContext.fileType.templ)
          })
        } else {
          delete bundle[viteCompilerContext.getScriptPath(customWrapperName)]
        }
      }
    }
  }, {
    name: 'taro:vite-mini-emit-post',
    async generateBundle (_outputOpts, bundle) {
      if (viteCompilerContext) {
        const { taroConfig } = viteCompilerContext
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
              pages: viteCompilerContext.pages,
              filesConfig: viteCompilerContext.filesConfig,
              getConfigFilePath: viteCompilerContext.getConfigFilePath,
              options: {
                isBuildPlugin: viteCompilerContext.taroConfig.isBuildPlugin
              }
            }
          )
        }
      }
    }
  }]
}

function generateConfigFile (ctx: PluginContext, viteCompilerContext: ViteMiniCompilerContext, options: { filePath: string, config: Config & { component?: boolean } }) {
  const { filePath, config } = options
  const fileName = viteCompilerContext.getConfigPath(getComponentName(viteCompilerContext, filePath))
  const unOfficialConfigs = ['enableShareAppMessage', 'enableShareTimeline', 'components']
  unOfficialConfigs.forEach(item => {
    delete config[item]
  })
  const source = prettyPrintJson(config)
  ctx.emitFile({
    type: 'asset',
    fileName,
    source
  })
}

function generateTemplateFile (ctx: PluginContext, viteCompilerContext: ViteMiniCompilerContext, options: { filePath: string, content: string }) {
  let source = options.content
  const fileName = viteCompilerContext.getTemplatePath(getComponentName(viteCompilerContext, options.filePath))

  if (viteCompilerContext.taroConfig.minifyXML?.collapseWhitespace) {
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

function generateXSFile (ctx: PluginContext, viteCompilerContext: ViteMiniCompilerContext, options: { filePath: string, content: string }) {
  const ext = viteCompilerContext.fileType.xs

  if (ext == null) return

  const fileName = viteCompilerContext.getTargetFilePath(options.filePath, ext)

  ctx.emitFile({
    type: 'asset',
    fileName,
    source: options.content
  })
}
