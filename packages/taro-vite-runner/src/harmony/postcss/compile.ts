import path from 'node:path'

import { chalk, getHash } from '@tarojs/helper'
import glob from 'fast-glob'
import { normalizePath } from 'vite'

import { checkPublicFile } from '../asset'
import { CSS_LANGS_RE } from './constants'
import { type CssLang, cssGlobalModuleRE, cssImageSetRE, cssModuleRE, cssUrlRE, PostCssDialectLang, PreprocessLang } from './constants'
import { resolvePostcssConfig } from './resolve'
import { configToAtImportResolvers, createCSSResolvers, getCssResolversKeys, less, loadPreprocessor, sass, scss, styl } from './resolvers'
import { UrlRewritePostcssPlugin } from './url'
import { cleanUrl, combineSourcemaps, generateCodeFrame, removeDirectQuery } from './utils'

import type { RawSourceMap } from '@ampproject/remapping'
import type PostCSS from 'postcss'
import type { ExistingRawSourceMap, SourceMapInput } from 'rollup'
import type { ResolvedConfig } from 'vite'
import type { CssUrlReplacer } from './types'

const preProcessors = Object.freeze({
  [PreprocessLang.less]: less,
  [PreprocessLang.sass]: sass,
  [PreprocessLang.scss]: scss,
  [PreprocessLang.styl]: styl,
  [PreprocessLang.stylus]: styl,
})

export async function compileCSS(
  id: string,
  code: string,
  config: ResolvedConfig,
  urlReplacer?: CssUrlReplacer,
  isGlobalModule ?: boolean
): Promise<{
    code: string
    map?: SourceMapInput
    ast?: PostCSS.Result
    modules?: Record<string, string>
    deps?: Set<string>
  }> {
  const {
    modules: modulesOptions,
    preprocessorOptions,
    devSourcemap,
  } = config.css || {}
  const cssModuleRegex = isGlobalModule ? cssGlobalModuleRE : cssModuleRE
  const isModule = modulesOptions !== false && cssModuleRegex.test(id)
  // although at serve time it can work without processing, we do need to
  // crawl them in order to register watch dependencies.
  const needInlineImport = code.includes('@import')
  const hasUrl = cssUrlRE.test(code) || cssImageSetRE.test(code)
  const lang = id.match(CSS_LANGS_RE)?.[1] as CssLang | undefined
  const postcssConfig = await resolvePostcssConfig(config, getCssDialect(lang))

  // 1. plain css that needs no processing
  if (
    lang === 'css' &&
    !postcssConfig &&
    !isModule &&
    !needInlineImport &&
    !hasUrl
  ) {
    return { code, map: null }
  }

  let preprocessorMap: ExistingRawSourceMap | undefined
  let modules: Record<string, string> | undefined
  const deps = new Set<string>()

  let atImportResolvers = configToAtImportResolvers.get(config)!
  if (!atImportResolvers) {
    atImportResolvers = createCSSResolvers(config)
    configToAtImportResolvers.set(config, atImportResolvers)
  }

  // 2. pre-processors: sass etc.
  if (isPreProcessor(lang)) {
    const preProcessor = preProcessors[lang]
    let opts = (preprocessorOptions && preprocessorOptions[lang]) || {}
    // support @import from node dependencies by default
    switch (lang) {
      case PreprocessLang.scss:
      case PreprocessLang.sass:
        opts = {
          includePaths: ['node_modules'],
          alias: config.resolve.alias,
          ...opts,
        }
        break
      case PreprocessLang.less:
      case PreprocessLang.styl:
      case PreprocessLang.stylus:
        opts = {
          paths: ['node_modules'],
          alias: config.resolve.alias,
          ...opts,
        }
    }
    // important: set this for relative import resolving
    opts.filename = cleanUrl(id)
    opts.enableSourcemap = devSourcemap ?? false

    const preprocessResult = await preProcessor(
      code,
      config.root,
      opts,
      atImportResolvers,
    )

    if (preprocessResult.error) {
      throw preprocessResult.error
    }

    code = preprocessResult.code
    preprocessorMap = combineSourcemapsIfExists(
      opts.filename,
      preprocessResult.map,
      preprocessResult.additionalMap,
    )

    if (preprocessResult.deps) {
      preprocessResult.deps.forEach((dep) => {
        // sometimes sass registers the file itself as a dep
        if (normalizePath(dep) !== normalizePath(opts.filename)) {
          deps.add(dep)
        }
      })
    }
  }

  // 3. postcss
  const postcssOptions = (postcssConfig && postcssConfig.options) || {}

  // for sugarss change parser
  if (lang === 'sss') {
    postcssOptions.parser = loadPreprocessor(
      PostCssDialectLang.sss,
      config.root,
    )
  }

  const postcssPlugins =
    postcssConfig && postcssConfig.plugins ? postcssConfig.plugins.slice() : []

  if (needInlineImport) {
    postcssPlugins.unshift(
      (await import('postcss-import')).default({
        async resolve(id, basedir) {
          const publicFile = checkPublicFile(id, config)
          if (publicFile) {
            return publicFile
          }

          const resolved = await atImportResolvers.css(
            id,
            path.join(basedir, '*'),
          )

          if (resolved) {
            return path.resolve(resolved)
          }
          return id
        },
        // @ts-ignore
        nameLayer(index) {
          return `vite--anon-layer-${getHash(id)}-${index}`
        },
      }),
    )
  }

  if (urlReplacer) {
    postcssPlugins.push(
      UrlRewritePostcssPlugin({
        replacer: urlReplacer,
        logger: config.logger,
      }),
    )
  }

  if (isModule) {
    postcssPlugins.unshift(
      (await import('postcss-modules')).default({
        ...modulesOptions,
        localsConvention: modulesOptions?.localsConvention,
        getJSON(
          cssFileName: string,
          _modules: Record<string, string>,
          outputFileName: string,
        ) {
          modules = _modules
          if (modulesOptions && typeof modulesOptions.getJSON === 'function') {
            modulesOptions.getJSON(cssFileName, _modules, outputFileName)
          }
        },
        async resolve(id: string, importer: string) {
          for (const key of getCssResolversKeys(atImportResolvers)) {
            const resolved = await atImportResolvers[key](id, importer)
            if (resolved) {
              return path.resolve(resolved)
            }
          }

          return id
        },
      }),
    )
  }

  postcssPlugins.push((await import('postcss-css-variables')).default({}))

  if (!postcssPlugins.length) {
    return {
      code,
      map: preprocessorMap,
    }
  }

  let postcssResult: PostCSS.Result
  try {
    const source = removeDirectQuery(id)
    // postcss is an unbundled dep and should be lazy imported
    postcssResult = await (await import('postcss'))
      .default(postcssPlugins)
      .process(code, {
        ...postcssOptions,
        to: source,
        from: source,
        ...(devSourcemap
          ? {
            map: {
              inline: false,
              annotation: false,
              // postcss may return virtual files
              // we cannot obtain content of them, so this needs to be enabled
              sourcesContent: true,
              // when "prev: preprocessorMap", the result map may include duplicate filename in `postcssResult.map.sources`
              // prev: preprocessorMap,
            },
          }
          : {}),
      })

    // record CSS dependencies from @imports
    for (const message of postcssResult.messages) {
      if (message.type === 'dependency') {
        deps.add(normalizePath(message.file as string))
      } else if (message.type === 'dir-dependency') {
        // https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md#3-dependencies
        const { dir, glob: globPattern = '**' } = message
        const pattern =
          glob.escapePath(normalizePath(path.resolve(path.dirname(id), dir))) +
          `/` +
          globPattern
        const files = glob.sync(pattern, {
          ignore: ['**/node_modules/**'],
        })
        for (let i = 0; i < files.length; i++) {
          deps.add(files[i])
        }
      } else if (message.type === 'warning') {
        let msg = `[taro:vite-style] ${message.text}`
        if (message.line && message.column) {
          msg += `\n${generateCodeFrame(code, {
            line: message.line,
            column: message.column,
          })}`
        }
        config.logger.warn(chalk.yellow(msg))
      }
    }
  } catch (e) {
    e.message = `[postcss] ${e.message}`
    e.code = code
    e.loc = {
      column: e.column,
      line: e.line,
    }
    throw e
  }

  if (!devSourcemap) {
    return {
      ast: postcssResult,
      code: postcssResult.css,
      map: { mappings: '' },
      modules,
      deps,
    }
  }

  const rawPostcssMap = postcssResult.map.toJSON()

  const postcssMap = await formatPostcssSourceMap(
    // version property of rawPostcssMap is declared as string
    // but actually it is a number
    rawPostcssMap as Omit<RawSourceMap, 'version'> as ExistingRawSourceMap,
    cleanUrl(id),
  )

  return {
    ast: postcssResult,
    code: postcssResult.css,
    map: combineSourcemapsIfExists(cleanUrl(id), postcssMap, preprocessorMap),
    modules,
    deps,
  }
}

async function formatPostcssSourceMap(
  rawMap: ExistingRawSourceMap,
  file: string,
): Promise<ExistingRawSourceMap> {
  const inputFileDir = path.dirname(file)

  const sources = rawMap.sources.map((source) => {
    const cleanSource = cleanUrl(decodeURIComponent(source))

    // postcss returns virtual files
    if (/^<.+>$/.test(cleanSource)) {
      return `\0${cleanSource}`
    }

    return normalizePath(path.resolve(inputFileDir, cleanSource))
  })

  return {
    file,
    mappings: rawMap.mappings,
    names: rawMap.names,
    sources,
    sourcesContent: rawMap.sourcesContent,
    version: rawMap.version,
  }
}

function combineSourcemapsIfExists(
  filename: string,
  map1: ExistingRawSourceMap | undefined,
  map2: ExistingRawSourceMap | undefined,
): ExistingRawSourceMap | undefined {
  return map1 && map2
    ? (combineSourcemaps(filename, [
      // type of version property of ExistingRawSourceMap is number
      // but it is always 3
      map1 as RawSourceMap,
      map2 as RawSourceMap,
    ]) as ExistingRawSourceMap)
    : map1
}

function isPreProcessor(lang: any): lang is PreprocessLang {
  return lang && lang in preProcessors
}

function getCssDialect(lang: CssLang | undefined): string {
  return lang === 'sss' ? 'sss' : 'css'
}
