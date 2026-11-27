import path from 'node:path'

import { fs, NODE_MODULES, readConfig, resolveMainFilePath } from '@tarojs/helper'

import { appendVirtualModulePrefix, escapePath, getComponentName, prettyPrintJson, stripVirtualModulePrefix } from '../utils'

import type { Config } from '@tarojs/taro'
import type { ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginContext } from 'rollup'
import type { PluginOption } from 'vite'

export const TABBAR_SUFFIX = '?tabbar-loader=true'

/**
 * Adjust usingComponents paths for npm packages
 * Aligns with webpack5 MiniPlugin.adjustConfigContent
 */
function adjustConfigContent(config: Config) {
  const { usingComponents } = config
  if (!usingComponents) return

  for (const [key, value] of Object.entries(usingComponents)) {
    const compPath = Array.isArray(value) ? value[0] : value
    if (!compPath.includes(NODE_MODULES)) continue

    const match = compPath.replace(NODE_MODULES, 'npm').match(/npm.*/)
    usingComponents[key] = match ? `/${match[0]}` : compPath
  }
}

/**
 * Recursively collect components from usingComponents JSON config
 * Mirrors webpack5 MiniPlugin.compileFile pattern
 */
function collectUsingComponents(
  viteCompilerContext: ViteMiniCompilerContext,
  scriptPath: string,
  config: Config,
  ctx: PluginContext,
  implicitlyLoadedAfterOneOf: string[],
  seen = new Set<string>(),
) {
  const { usingComponents } = config
  if (!usingComponents) return

  for (const compName of Object.keys(usingComponents)) {
    const value = usingComponents[compName]
    const compPath = Array.isArray(value) ? value[0] : value

    // Resolve component path
    const resolvedPath = resolveMainFilePath(path.resolve(path.dirname(scriptPath), compPath))
    if (!fs.existsSync(resolvedPath) || seen.has(resolvedPath)) continue

    seen.add(resolvedPath)

    // Read component's config and recursively collect its dependencies
    const compConfigPath = viteCompilerContext.getConfigFilePath(resolvedPath)
    const compConfig = fs.existsSync(compConfigPath) ? (readConfig(compConfigPath) || {}) : {}

    collectUsingComponents(
      viteCompilerContext,
      resolvedPath,
      compConfig,
      ctx,
      implicitlyLoadedAfterOneOf,
      seen,
    )

    // Apply adjustConfigContent and emit component's JSON
    adjustConfigContent(compConfig)
    const compComponentName = getComponentName(viteCompilerContext, resolvedPath)
    const compJsonName = viteCompilerContext.getConfigPath(compComponentName)
    const compJsonForEmit = { ...compConfig } as Record<string, unknown>
    delete compJsonForEmit.enableShareAppMessage
    delete compJsonForEmit.enableShareTimeline
    delete compJsonForEmit.components
    ctx.emitFile({
      type: 'asset',
      fileName: compJsonName,
      source: prettyPrintJson(compJsonForEmit),
    })

    // Emit component chunk and template
    ctx.emitFile({
      type: 'chunk',
      id: resolvedPath,
      fileName: viteCompilerContext.getScriptPath(compComponentName),
      implicitlyLoadedAfterOneOf,
    })

    const baseTemplatePath = '../base' + viteCompilerContext.fileType.templ
    const templateContent = viteCompilerContext.taroConfig.template.buildPageTemplate(baseTemplatePath)
    ctx.emitFile({
      type: 'asset',
      fileName: viteCompilerContext.getTemplatePath(compComponentName),
      source: templateContent,
    })

    ctx.addWatchFile(resolvedPath)
  }
}

export default function (viteCompilerContext: ViteMiniCompilerContext): PluginOption {
  const { taroConfig, sourceDir } = viteCompilerContext

  let tabBarScriptPath = ''
  let tabBarDirName = 'custom-tab-bar'

  return {
    name: 'taro:vite-mini-tabbar',
    enforce: 'pre',
    buildStart() {
      // detect custom-tab-bar
      if (viteCompilerContext.app.config.tabBar?.custom) {
        const isAlipay = process.env.TARO_ENV === 'alipay'
        tabBarDirName = isAlipay ? 'customize-tab-bar' : 'custom-tab-bar'
        const customTabBarPath = path.join(sourceDir, tabBarDirName)
        tabBarScriptPath = resolveMainFilePath(customTabBarPath, taroConfig.frameworkExts)
      }
    },
    resolveId (source, _importer, options) {
      if (tabBarScriptPath && source === tabBarScriptPath && options.isEntry) {
        return appendVirtualModulePrefix(source + TABBAR_SUFFIX)
      }
      return null
    },
    load (id) {
      if (id.endsWith(TABBAR_SUFFIX)) {
        const rawId = stripVirtualModulePrefix(id).replace(TABBAR_SUFFIX, '')

        const configPath = viteCompilerContext.getConfigFilePath(rawId)
        const tabbarConfig: Config = fs.existsSync(configPath)
          ? (readConfig(configPath, taroConfig) || {})
          : {}

        // Apply adjustConfigContent
        adjustConfigContent(tabbarConfig)

        // Recursively collect and emit usingComponents
        collectUsingComponents(
          viteCompilerContext,
          rawId,
          tabbarConfig,
          this,
          [rawId],
        )

        // Emit JSON config file
        const tabBarConfigForJson = { ...tabbarConfig } as Config & { component?: boolean }
        const unofficialConfigs = ['enableShareAppMessage', 'enableShareTimeline', 'components']
        unofficialConfigs.forEach(item => {
          delete (tabBarConfigForJson as Record<string, unknown>)[item]
        })
        const configJsonName = viteCompilerContext.getConfigPath(`${tabBarDirName}/index`)
        this.emitFile({
          type: 'asset',
          fileName: configJsonName,
          source: prettyPrintJson(tabBarConfigForJson),
        })

        let instantiateComponent = `Component(createComponentConfig(component, '${tabBarDirName}/index'))`

        if (typeof viteCompilerContext.loaderMeta.modifyInstantiateComponent === 'function') {
          instantiateComponent = viteCompilerContext.loaderMeta.modifyInstantiateComponent(instantiateComponent)
        }

        return [
          'import { createComponentConfig } from "@tarojs/runtime"',
          `import component from "${escapePath(rawId)}"`,
          instantiateComponent,
        ].join('\n')
      }
    },
  }
}
