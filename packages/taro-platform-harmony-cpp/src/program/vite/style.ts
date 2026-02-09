import path from 'node:path'

import { fs, REG_STYLE } from '@tarojs/helper'
import { parse as parseJSXStyle } from '@tarojs/parse-css-to-stylesheet'
import { isFunction } from '@tarojs/shared'
import { usedRE } from '@tarojs/vite-runner/dist/harmony/postcss/constants'
import { stripVirtualModulePrefix } from '@tarojs/vite-runner/dist/utils'

import type { TaroHarmonyPageMeta } from '@tarojs/vite-runner/dist/harmony/template/page'
import type Parser from '@tarojs/vite-runner/dist/harmony/template/page'
import type { ModuleInfo, PluginContext } from 'rollup'
import type { PluginOption, ResolvedConfig } from 'vite'
import type Harmony from '..'

export const STYLE_SUFFIX = '.xss'
export const STYLE_SUFFIX_RE = new RegExp(`\\${STYLE_SUFFIX}(\\?\\S+)?$`)

export declare class PageParser extends Parser {
  public appPath: typeof Parser.prototype['appPath']
  public appConfig: typeof Parser.prototype['appConfig']
}

export default function (this: Harmony): PluginOption {
  const that = this
  let viteConfigResolved: ResolvedConfig
  const PageMap = new Map<string, ModuleInfo | null>()

  return {
    name: 'taro:vite-harmony-style',
    enforce: 'pre',
    configResolved(config) {
      viteConfigResolved = config
    },
    async buildStart(this: PluginContext) {
      const pluginContext = this
      const { runnerUtils } = that.context

      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = await getViteHarmonyCompilerContext(pluginContext)

      if (compiler) {
        compiler.loaderMeta ||= {}
        compiler.loaderMeta.enableParseJSXStyle = true
      }

      const modifyPageOrComp = (config: TaroHarmonyPageMeta) => {
        const oddModifyPageImport = config.modifyPageImport
        config.modifyPageImport = function (this: PageParser, importStr: string[], page: TaroHarmonyPageMeta | TaroHarmonyPageMeta[]) {
          if (isFunction(oddModifyPageImport)) {
            oddModifyPageImport.call(this, importStr, page)
          }

          const { outputRoot = 'dist', sourceRoot = 'src' } = this.buildConfig
          const targetRoot = path.resolve(this.appPath, sourceRoot)
          if (page instanceof Array) {
            page.forEach((p, i) => {
              const styleName = `${p.originName}_style.json`
              const styleJsonPath = path.resolve(targetRoot, styleName)
              importStr.push(`import styleJson${i} from "${styleJsonPath}"`)
              PageMap.set(path.resolve(outputRoot, styleName), pluginContext.getModuleInfo(p.id))
            })
          } else {
            const styleName = `${page.originName}_style.json`
            const styleJsonPath = path.resolve(targetRoot, styleName)
            importStr.push(`import styleJson from "${styleJsonPath}"`)
            PageMap.set(path.resolve(outputRoot, styleName), pluginContext.getModuleInfo(page.id))
          }
        }
      }
      compiler?.pages?.forEach?.(modifyPageOrComp)
      compiler?.components?.forEach?.(modifyPageOrComp)
    },
    async buildEnd() {
      const pluginContext = this
      const { runnerUtils } = that.context
      const cacheStyleMap = new Map<string, Set<string>>()

      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = await getViteHarmonyCompilerContext(pluginContext)
      const cssModuleId = new Set<string>()
      if (compiler) {
        PageMap.forEach((moduleInfo, styleJsonPath) => {
          const list = findStyleInModuleInfo(moduleInfo)
          const { code } = parseJSXStyle(Array.from(list), {
            platformString: 'Harmony',
          })
          if (code) {
            fs.ensureDirSync(path.dirname(styleJsonPath))
            fs.writeFileSync(styleJsonPath, code)
          }
        })
      }

      function findStyleInModuleInfo(moduleInfo: ModuleInfo | null, cssList: Set<string> = new Set()) {
        if (!compiler || !moduleInfo) return cssList
        if (cacheStyleMap.has(moduleInfo.id)) {
          const list = cacheStyleMap.get(moduleInfo.id)!
          list.forEach((item) => cssList.add(item))
          return cssList
        } else {
          cacheStyleMap.set(moduleInfo.id, cssList)
        }

        if (cssModuleId.has(moduleInfo.id)) {
          return cssList
        } else {
          cssModuleId.add(moduleInfo.id)
        }
        const styleMap: Map<string, string> | undefined = compiler.loaderMeta.parseJSXStyleMapCache?.get(viteConfigResolved)
        for (const oid of moduleInfo.importedIds) {
          const id = stripVirtualModulePrefix(oid).replace(STYLE_SUFFIX_RE, '').replace(usedRE, '')
          if (REG_STYLE.test(id) && styleMap) {
            if (styleMap.has(id)) {
              cssList.add(styleMap.get(id)!)
            } else if (styleMap.has(id + '?used')) {
              cssList.add(styleMap.get(id + '?used')!)
            } else {
              for (const key of styleMap.keys()) {
                if (key.includes(id) && styleMap.has(key)) {
                  cssList.add(styleMap.get(key)!)
                }
              }
            }
          } else {
            // Note: 入口文件被供用时，递归查询仍可能造成依赖错误导致样式丢失，当前使用缓存解决
            findStyleInModuleInfo(pluginContext.getModuleInfo(id), cssList)
          }
        }
        return cssList
      }
    },
  }
}
