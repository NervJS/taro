import path from 'node:path'

import { transformSync } from '@babel/core'
import { removeHeadSlash } from '@tarojs/helper'

import pluginImportNativeComponent from '../common/babel-plugin-import-native-component'
import pluginRemovePageConfig from '../common/babel-plugin-remove-config'
import { addLeadingSlash, appendVirtualModulePrefix, escapePath, stripVirtualModulePrefix, virtualModulePrefixREG } from '../utils'
import { createFilterWithCompileOptions } from '../utils/createFilter'
import { UniqueKeyMap } from '../utils/map'
import { PageParser } from './template'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption, ResolvedConfig } from 'vite'
import type { TaroHarmonyPageMeta } from './template/page'

export const PAGE_SUFFIX = '?page-loader=true'
export const TARO_TABBAR_PAGE_PATH = 'taro_tabbar'
const nativeComponentMapCache = new WeakMap<ResolvedConfig, Map<string, Record<string, [string, string]>>>()
const nativeUniqueKeyMap = new WeakMap<ResolvedConfig, UniqueKeyMap<string>>()

export default function (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption {
  const name = 'taro:vite-harmony-page'
  const { taroConfig, sourceDir } = viteCompilerContext
  const filter = createFilterWithCompileOptions(taroConfig.compile, [sourceDir, /(?<=node_modules[\\/]).*taro/], [])

  let viteConfig: ResolvedConfig
  let nCompCache: Map<string, Record<string, [string, string]>>
  let nCompUniqueKeyMap: UniqueKeyMap<string>

  return {
    name,
    enforce: 'pre',
    configResolved(config) {
      viteConfig = config
    },
    buildStart() {
      if (nativeComponentMapCache.has(viteConfig)) {
        nCompCache = nativeComponentMapCache.get(viteConfig)!
        nCompUniqueKeyMap = nativeUniqueKeyMap.get(viteConfig)!
      } else {
        nCompCache = new Map<string, Record<string, [string, string]>>()
        nativeComponentMapCache.set(viteConfig, nCompCache)
        nCompUniqueKeyMap = new UniqueKeyMap<string>()
        nativeUniqueKeyMap.set(viteConfig, nCompUniqueKeyMap)
      }
    },
    resolveId (source, importer, options) {
      if ((viteCompilerContext?.isPage(source) || viteCompilerContext?.isComponent(source)) && options.isEntry) {
        if (viteCompilerContext.getPageById(source)?.isNative) return null
        return appendVirtualModulePrefix(source + PAGE_SUFFIX)
      } else if (source.includes(TARO_TABBAR_PAGE_PATH) && options.isEntry) {
        return appendVirtualModulePrefix(source)
      } else if (source.endsWith(PAGE_SUFFIX)) {
        return appendVirtualModulePrefix(source)
      } else if (virtualModulePrefixREG.test(importer || '')) {
        importer = stripVirtualModulePrefix(importer || '')
        if (source.includes(TARO_TABBAR_PAGE_PATH) && source === importer.replace(PAGE_SUFFIX, '')) {
          return appendVirtualModulePrefix(source)
        } else {
          return this.resolve(source, importer, options)
        }
      }
      return null
    },
    load (id) {
      if (!viteCompilerContext) return
      const { taroConfig, cwd: appPath, app, loaderMeta } = viteCompilerContext
      const appConfig = app.config
      const { sourceRoot = 'src' } = taroConfig
      const appRoot = path.resolve(appPath, sourceRoot)
      const parse = new PageParser(appPath, appConfig, taroConfig, loaderMeta, taroConfig.isPure)
      const tabbarList = appConfig.tabBar?.list || []
      const rawId = stripVirtualModulePrefix(id).replace(PAGE_SUFFIX, '')

      if (id.endsWith(PAGE_SUFFIX)) {
        const page = viteCompilerContext.getPageById(rawId) || viteCompilerContext.getComponentById(rawId)
        // Note: 组件编译模式下禁用 TabBar 页面生成
        const isTabbarPage = !taroConfig.isBuildNativeComp &&
          tabbarList.some(item => item.pagePath === page?.name)

        if (!page) {
          viteCompilerContext.logger.warn(`编译页面 ${rawId} 失败!`)
          process.exit(1)
        }

        if (isTabbarPage) {
          if (tabbarList[0].pagePath === page.name) {
            const tabbarPages = tabbarList.map(item => viteCompilerContext.pages.find((e: TaroHarmonyPageMeta) => {
              if (e.name === item.pagePath) {
                e.originName = item.pagePath
                e.id = appendVirtualModulePrefix(e.scriptPath + PAGE_SUFFIX)
                return true
              }
            })!)
            const tabbarId = path.join(appRoot, `${TARO_TABBAR_PAGE_PATH}`)
            this.emitFile({
              type: 'prebuilt-chunk',
              fileName: viteCompilerContext.getTargetFilePath(TARO_TABBAR_PAGE_PATH, '.ets'),
              code: parse.parse(tabbarId, tabbarPages as TaroHarmonyPageMeta[], name, this.resolve),
              exports: ['default'],
            })
            tabbarPages.forEach(async page => {
              const deps = await viteCompilerContext.collectedDeps(this, escapePath(page.scriptPath), filter)
              const ncObj: Record<string, [string, string]> = {}
              deps.forEach(dep => {
                Object.entries(nCompCache.get(dep) || {}).forEach(([key, value]) => {
                  const absPath = value[0]
                  const ext = path.extname(absPath)
                  const basename = path.basename(absPath, ext)
                  ncObj[key] = [path.join(path.dirname(path.relative(path.dirname(rawId), absPath)), basename), value[1]]
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
          }
        } else {
          const list: string[] = []
          const key = Object.keys(taroConfig.router?.customRoutes || {}).find(e => [page.name, addLeadingSlash(page.name)].includes(e))
          if (key) {
            const alias = taroConfig.router?.customRoutes![key]
            if (alias instanceof Array) {
              list.push(...alias)
            } else {
              list.push(alias)
            }
          } else {
            list.push(page.name)
          }

          list.forEach(pageName => {
            pageName = removeHeadSlash(pageName)
            if (!pageName) {
              pageName = 'index'
            }

            const page_ = page as TaroHarmonyPageMeta
            page_.id = id
            page_.originName = page.name
            page_.name = pageName

            this.emitFile({
              type: 'prebuilt-chunk',
              fileName: viteCompilerContext.getTargetFilePath(pageName, '.ets'),
              code: parse.parse(path.resolve(appRoot, pageName), page_, name, this.resolve),
              exports: ['default'],
            })
            viteCompilerContext.collectedDeps(this, escapePath(rawId), filter).then(deps => {
              const ncObj: Record<string, [string, string]> = {}
              deps.forEach(dep => {
                Object.entries(nCompCache.get(dep) || {}).forEach(([key, value]) => {
                  const absPath = value[0]
                  const ext = path.extname(absPath)
                  const basename = path.basename(absPath, ext)
                  ncObj[key] = [path.join(path.dirname(path.relative(path.dirname(rawId), absPath)), basename), value[1]]
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
          })
        }
        return parse.parseEntry(rawId, page as TaroHarmonyPageMeta)
      }
    },
    transform(code, id) {
      if (/\.m?[jt]sx?$/.test(id) && filter(id)) {
        const scopeNativeComp = new Map<string, [string, string]>()
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
              scopeNativeComp.set(key, [path, exportName])
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
