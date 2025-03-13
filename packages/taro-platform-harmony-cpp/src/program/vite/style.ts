import path from 'node:path'

import { fs, REG_STYLE } from '@tarojs/helper'
import { parse as parseJSXStyle } from '@tarojs/parse-css-to-stylesheet'
import { isFunction } from '@tarojs/shared'
import { usedRE } from '@tarojs/vite-runner/dist/harmony/postcss/constants'
import { stripVirtualModulePrefix } from '@tarojs/vite-runner/dist/utils'

import { genRawFileName, getProjectId, RAWFILE_FOLDER } from '../../utils'

import type { TaroHarmonyPageMeta } from '@tarojs/vite-runner/dist/harmony/template/page'
import type Parser from '@tarojs/vite-runner/dist/harmony/template/page'
import type { ModuleInfo, PluginContext } from 'rollup'
import type { PluginOption, ResolvedConfig } from 'vite'
import type Harmony from '..'

export const STYLE_SUFFIX = '.xss'
export const STYLE_SUFFIX_RE = new RegExp(`\\${STYLE_SUFFIX}(\\?\\S+)?$`)

export declare class PageParser extends Parser {
  public appPath: (typeof Parser.prototype)['appPath']
  public appConfig: (typeof Parser.prototype)['appConfig']
}
interface NewModuleInfo extends ModuleInfo {
  originName?: string
  outputRoot?: string
}

export default function (this: Harmony): PluginOption {
  const that = this
  let viteConfigResolved: ResolvedConfig
  const PageMap = new Map<string, NewModuleInfo | null>()
  const projectId = getProjectId()
  const onlyBundle = this.ctx.runOpts?.options?.args?.onlyBundle

  return {
    name: 'taro:vite-harmony-style',
    enforce: 'pre',
    configResolved(config) {
      viteConfigResolved = config
    },
    buildStart(this: PluginContext) {
      const pluginContext = this
      const { runnerUtils } = that.context

      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = getViteHarmonyCompilerContext(pluginContext)

      if (compiler) {
        compiler.loaderMeta ||= {}
        compiler.loaderMeta.enableParseJSXStyle = true
      }

      if (compiler?.components instanceof Array) {
        compiler.components.forEach((config: TaroHarmonyPageMeta) => {
          const oddModifyPageImport = config.modifyPageImport
          config.modifyPageImport = function (this: PageParser, importStr: string[], page: TaroHarmonyPageMeta) {
            if (isFunction(oddModifyPageImport)) {
              oddModifyPageImport.call(this, importStr, page)
            }

            const { outputRoot = 'dist' } = this.buildConfig

            const styleName = `${page.originName}_style.json`

            const moduleInfo = pluginContext.getModuleInfo(page.id) as NewModuleInfo
            moduleInfo.originName = page.originName
            moduleInfo.outputRoot = outputRoot
            PageMap.set(path.resolve(outputRoot, styleName), moduleInfo)
          }
        })
      }
    },
    buildEnd() {
      const pluginContext = this
      const { runnerUtils } = that.context
      const cacheStyleMap = new Map<string, Set<string>>()

      const { getViteHarmonyCompilerContext } = runnerUtils
      const compiler = getViteHarmonyCompilerContext(pluginContext)
      const cssModuleId = new Set<string>()
      if (compiler) {
        PageMap.forEach((moduleInfo) => {
          const list = findStyleInModuleInfo(moduleInfo)
          const { code } = parseJSXStyle(Array.from(list), {
            platformString: 'Harmony',
          })
          if (code) {
            let cssPath
            if (onlyBundle) {
              cssPath = path.resolve(moduleInfo?.outputRoot || '', `index_style.json`)
            } else {
              cssPath = path.resolve(
                moduleInfo?.outputRoot || '',
                '../',
                RAWFILE_FOLDER,
                genRawFileName(projectId),
                `${moduleInfo?.originName || ''}_style.json`
              )
            }

            fs.ensureDirSync(path.dirname(cssPath))
            fs.writeFileSync(cssPath, `${code}\n`)
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
        const styleMap: Map<string, string> | undefined =
          compiler.loaderMeta.parseJSXStyleMapCache?.get(viteConfigResolved)
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
