import { resolveSync, swc } from '@tarojs/helper'

import { commonjsProxyRE, CSS_LANGS_RE, loadParseImportRE, SPECIAL_QUERY_RE } from './postcss/constants'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption, ResolvedConfig } from 'vite'

// const TEMPLATE_EXT = /\.([j|t]sx)$/
// const TEMPLATE_SUFFIX = 'compile-mode'
// const TEMPLATE_SUFFIX_RE = new RegExp(`(\\?(\\S+)?)?${TEMPLATE_SUFFIX}$`)
const isTemplateRequest = (request: string): boolean => 
  !/\.ets(\?\S*)?$/.test(request) &&
  !commonjsProxyRE.test(request) &&
  !SPECIAL_QUERY_RE.test(request) &&
  !loadParseImportRE.test(request) &&
  !CSS_LANGS_RE.test(request) &&
  /\.[tj]sx$/i.test(request)

let FILE_COUNTER = 0

const FILE_COUNTER_MAP = new Map<string, number>()
const etsTemplatesCache = new WeakMap<ResolvedConfig, Map<string, string>>()

export function compileModePrePlugin (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption {
  let viteConfig: ResolvedConfig
  let etsTemplateCache: Map<string, string>
  
  return {
    name: 'taro:vite-compile-mode',
    enforce: 'pre',
    configResolved(config) {
      viteConfig = config
    },
    buildStart() {
      if (etsTemplatesCache.has(viteConfig)) {
        etsTemplateCache = etsTemplatesCache.get(viteConfig)!
      } else {
        etsTemplateCache = new Map<string, string>()
        etsTemplatesCache.set(viteConfig, etsTemplateCache)
      }
    },
    async transform (source, id) {
      if (!isTemplateRequest(id)) return

      const suffix = id.includes('?')
        ? id.slice(id.lastIndexOf('?'))
        : ''
      const resourcePath = resolveSync(id.replace(suffix, ''), {
        basedir: viteCompilerContext.sourceDir,
        extensions: ['.jsx', '.tsx'],
      })

      if (!resourcePath) return

      if (!FILE_COUNTER_MAP.has(resourcePath)) {
        FILE_COUNTER_MAP.set(resourcePath, FILE_COUNTER++)
      }

      const { code, map } = await swc
        .transform(source, {
          filename: resourcePath,
          sourceMaps: true,
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
              decorators: true
            },
            transform: {
              legacyDecorator: true
            },
            experimental: {
              plugins: [
                [
                  require.resolve('swc-plugin-taro-compile-mode'),
                  {
                    tmpl_prefix: `f${FILE_COUNTER_MAP.get(resourcePath)}`,
                    is_harmony: true,
                    support_events: [
                      'onLoad',
                      'onClick',
                      'onTouchEnd',
                      'onTouchMove',
                      'onTouchStart',
                      'onTouchCancel'
                    ],
                    support_components: [
                      'view',
                      'text',
                      'image'
                    ],
                    event_adapter: {
                      onLoad: 'onComplete',
                      onTouchEnd: 'onTouch',
                      onTouchMove: 'onTouch',
                      onTouchStart: 'onTouch',
                      onTouchCancel: 'onTouch',
                    }
                  }
                ]
              ]
            }
          }
        })

      return { map, code }
    }
  }
}

export function compileModePostPlugin (_: ViteHarmonyCompilerContext): PluginOption {
  return []
}