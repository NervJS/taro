import path from 'node:path'

import { REG_SCRIPTS, resolveSync, swc } from '@tarojs/helper'

import { resolveAbsoluteRequire } from '../utils'
import { commonjsProxyRE, CSS_LANGS_RE, loadParseImportRE, SPECIAL_QUERY_RE } from './postcss/constants'
import RenderParser from './template/render'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption, ResolvedConfig } from 'vite'

const isTemplateRequest = (request: string): boolean =>
  !/\.ets(\?\S*)?$/.test(request) &&
  !commonjsProxyRE.test(request) &&
  !SPECIAL_QUERY_RE.test(request) &&
  !loadParseImportRE.test(request) &&
  !CSS_LANGS_RE.test(request) &&
  REG_SCRIPTS.test(request)

let FILE_COUNTER = 0

const FILE_COUNTER_MAP = new Map<string, number>()
const etsTemplatesCache = new WeakMap<ResolvedConfig, Map<string, string>>()

function extractTaroTemplates (inputString) {
  const regex = /const\s(TARO_TEMPLATES_\w+)\s*=.*`([^`]+)`;/g
  const templates = {}
  let match

  while ((match = regex.exec(inputString)) !== null) {
    const key = match[1]
    const value = match[2]
    templates[key] = value
  }

  const extractedString = inputString.replace(regex, '')

  return {
    templates,
    extractedString
  }
}

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
    transform (source, id) {
      if (!isTemplateRequest(id) || !source.includes('compileMode')) return

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

      const componentReplace = viteCompilerContext.taroConfig?.harmony?.compileModeSetting?.componentReplace || {}

      const { code } = swc.transformSync(source, {
        filename: resourcePath,
        sourceMaps: true,
        jsc: {
          target: 'esnext',
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true,
            dynamicImport: true
          },
          transform: {
            legacyDecorator: true,
            react: {
              pragma: 'React.createElement',
              pragmaFrag: 'React.Fragment',
              throwIfNamespace: true,
              development: false,
              useBuiltins: false,
              runtime: 'automatic',
              importSource: 'react'
            }
          },
          experimental: {
            plugins: [
              [
                '@tarojs/helper/swc/swc_plugin_compile_mode.wasm',
                {
                  tmpl_prefix: `f${FILE_COUNTER_MAP.get(resourcePath)}`,
                  is_harmony: true,
                  component_replace: componentReplace,

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

      const { extractedString, templates } = extractTaroTemplates(code)

      // 遍历 templates, 输出 template 里的内容到 path.join(config.outputRoot, 'npm', '@tarojs/components/static/')
      for (const key in templates) {
        const name = `${key}.ets`
        const fileName = path.join('static', name)
        const { cwd: appPath, loaderMeta, taroConfig } = viteCompilerContext
        const { outputRoot = 'dist', sourceRoot = 'src' } = taroConfig
        const { modifyResolveId } = loaderMeta
        const template = resolveAbsoluteRequire({
          name,
          importer: path.resolve(appPath, sourceRoot, fileName),
          code: templates[key],
          outputRoot,
          targetRoot: path.resolve(appPath, sourceRoot),
          resolve: this.resolve,
          modifyResolveId,
        })

        etsTemplateCache.set(key, template)

        this.emitFile({
          type: 'prebuilt-chunk',
          code: template,
          fileName,
        })
      }

      return { map: null, code: extractedString }
    },
    buildEnd () {
      const renderGenerator = new RenderParser(etsTemplateCache, viteCompilerContext)
      const fileName = 'render.ets'

      this.emitFile({
        type: 'prebuilt-chunk',
        code: renderGenerator.generate(fileName),
        fileName,
      })
    }
  }
}
