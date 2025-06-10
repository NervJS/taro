import path from 'node:path'

import { transformSync } from '@babel/core'

import pluginImportNativeComponent from '../common/babel-plugin-import-native-component'
import pluginRemovePageConfig from '../common/babel-plugin-remove-config'
import { appendVirtualModulePrefix, escapePath, prettyPrintJson, stripVirtualModulePrefix } from '../utils'
import { createFilterWithCompileOptions } from '../utils/createFilter'
import { UniqueKeyMap } from '../utils/map'

import type { ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption, ResolvedConfig } from 'vite'

export const PAGE_SUFFIX = '?page-loader=true'
const nativeComponentMapCache = new WeakMap<ResolvedConfig, Map<string, Record<string, string>>>()
const nativeUniqueKeyMap = new WeakMap<ResolvedConfig, UniqueKeyMap<string>>()

export default function (viteCompilerContext: ViteMiniCompilerContext): PluginOption {
  const { taroConfig, sourceDir } = viteCompilerContext
  const filter = createFilterWithCompileOptions(taroConfig.compile, [sourceDir, /(?<=node_modules[\\/]).*taro/], [])

  let viteConfig: ResolvedConfig
  let nCompCache: Map<string, Record<string, string>>
  let nCompUniqueKeyMap: UniqueKeyMap<string>

  return {
    name: 'taro:vite-mini-page',
    enforce: 'pre',
    configResolved(config) {
      viteConfig = config
    },
    buildStart() {
      if (nativeComponentMapCache.has(viteConfig)) {
        nCompCache = nativeComponentMapCache.get(viteConfig)!
        nCompUniqueKeyMap = nativeUniqueKeyMap.get(viteConfig)!
      } else {
        nCompCache = new Map<string, Record<string, string>>()
        nativeComponentMapCache.set(viteConfig, nCompCache)
        nCompUniqueKeyMap = new UniqueKeyMap<string>()
        nativeUniqueKeyMap.set(viteConfig, nCompUniqueKeyMap)
      }
    },
    resolveId (source, _importer, options) {
      if (viteCompilerContext?.isPage(source) && options.isEntry) {
        if (viteCompilerContext.getPageById(source)?.isNative) return null
        return appendVirtualModulePrefix(source + PAGE_SUFFIX)
      }
      return null
    },
    load (id) {
      if (viteCompilerContext && id.endsWith(PAGE_SUFFIX)) {
        const rawId = stripVirtualModulePrefix(id).replace(PAGE_SUFFIX, '')
        const page = viteCompilerContext.getPageById(rawId)

        if (!page) {
          viteCompilerContext.logger.warn(`编译页面 ${rawId} 失败!`)
          process.exit(1)
        }

        const pageConfig = prettyPrintJson(page.config)

        let instantiatePage = `var inst = Page(createPageConfig(component, '${page.name}', {root:{cn:[]}}, config || {}))`

        if (typeof viteCompilerContext.loaderMeta.modifyInstantiate === 'function') {
          instantiatePage = viteCompilerContext.loaderMeta.modifyInstantiate(instantiatePage, 'page')
        }

        viteCompilerContext.collectedDeps(this, escapePath(rawId), filter).then(deps => {
          const ncObj: Record<string, string> = {}
          deps.forEach(dep => {
            Object.entries(nCompCache.get(dep) || {}).forEach(([key, value]) => {
              const absPath = value
              const ext = path.extname(absPath)
              const basename = path.basename(absPath, ext)
              ncObj[key] = path.join(path.dirname(path.relative(path.dirname(rawId), absPath)), basename)
            })
          })
          if (!page.isNative) {
            page.config.usingComponents = {
              ...page.config.usingComponents,
              ...ncObj,
            }
          }
          const nativeComps = viteCompilerContext.collectNativeComponents(page)
          nativeComps.forEach(comp => {
            viteCompilerContext.generateNativeComponent(this, comp, [rawId])
          })
        })

        return [
          'import { createPageConfig } from "@tarojs/runtime"',
          `import component from "${escapePath(rawId)}"`,
          `var config = ${pageConfig}`,
          page.config.enableShareTimeline ? 'component.enableShareTimeline = true' : '',
          page.config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : '',
          instantiatePage,
        ].join('\n')
      }
    },
    transform(code, id) {
      if (/\.m?[jt]sx?$/.test(id) && filter(id)) {
        const scopeNativeComp = new Map<string, string>()
        let enableImportComponent = true

        const result = transformSync(code, {
          filename: id,
          parserOpts: {
            plugins: [
              'jsx',
              'typescript',
            ],
          },
          plugins: [
            pluginRemovePageConfig(id),
            pluginImportNativeComponent(viteCompilerContext, id, (path, name = '', exportName = '') => {
              if (path === false) {
                enableImportComponent = false
                return ''
              }

              let key = `${name}${exportName !== 'default' ? `_${exportName}` : ''}`.toLowerCase()
              key = nCompUniqueKeyMap.add(key, path)
              scopeNativeComp.set(key, path)
              return key
            }),
          ]
        })

        if (enableImportComponent) {
          nCompCache.set(id, Object.fromEntries(scopeNativeComp))
          return {
            code: result?.code || code,
            map: result?.map || null,
          }
        }
      }
    }
  }
}
