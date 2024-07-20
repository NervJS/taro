import { isObject } from '@tarojs/shared'
import postcssRC from 'postcss-load-config'

import type { AcceptedPlugin, ProcessOptions } from 'postcss'
import type { ResolvedConfig } from 'vite'

interface PostCSSConfigResult {
  options: ProcessOptions
  plugins: AcceptedPlugin[]
}

const postcssConfigCache: Record<string, WeakMap<ResolvedConfig, PostCSSConfigResult | null | void>> = {}

export async function resolvePostcssConfig(
  config: ResolvedConfig,
  dialect = 'css',
): Promise<PostCSSConfigResult | null | void> {
  postcssConfigCache[dialect] ??= new WeakMap<
  ResolvedConfig,
  PostCSSConfigResult | null
  >()

  let result = postcssConfigCache[dialect].get(config)
  if (result !== undefined) {
    return result
  }

  // inline postcss config via vite config
  const inlineOptions = config.css?.postcss as ProcessOptions & { plugins?: AcceptedPlugin[] }
  if (isObject<Exclude<typeof inlineOptions, string | undefined>>(inlineOptions)) {
    const options = { ...inlineOptions }

    delete options.plugins
    result = {
      options,
      plugins: inlineOptions.plugins || [],
    }
  } else {
    const searchPath =
      typeof inlineOptions === 'string' ? inlineOptions : config.root
    try {
      result = await postcssRC({}, searchPath)
    } catch (e) {
      if (!/No PostCSS Config found/.test(e.message)) {
        if (e instanceof Error) {
          const { name, message, stack } = e
          e.name = 'Failed to load PostCSS config'
          e.message = `Failed to load PostCSS config (searchPath: ${searchPath}): [${name}] ${message}\n${stack}`
          e.stack = '' // add stack to message to retain stack
          throw e
        } else {
          throw new Error(`Failed to load PostCSS config: ${e}`)
        }
      }
      result = null
    }
  }

  postcssConfigCache[dialect].set(config, result)
  return result
}
