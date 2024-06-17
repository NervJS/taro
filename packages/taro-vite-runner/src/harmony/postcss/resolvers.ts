import { createRequire } from 'node:module'
import path from 'node:path'

import { fs } from '@tarojs/helper'
import MagicString from 'magic-string'
import { type Alias, type ResolvedConfig, type ResolveFn, normalizePath } from 'vite'

import { cssDataUriRE, cssUrlRE, importCssRE, PostCssDialectLang, PreprocessLang } from './constants'
import { cleanScssBugUrl, fixScssBugImportValue, isExternalUrl, requireResolveFromRootWithFallback, rewriteCssDataUris, rewriteCssUrls, rewriteImportCss } from './utils'

import type Less from 'less'
import type PostCSS from 'postcss'
import type { ExistingRawSourceMap, RollupError } from 'rollup'
import type Sass from 'sass' // FIXME update ^1.75.0
import type Stylus from 'stylus'

interface CSSAtImportResolvers {
  css: ResolveFn
  sass: ResolveFn
  less: ResolveFn
}

export const configToAtImportResolvers = new WeakMap<ResolvedConfig, CSSAtImportResolvers>()

export function createCSSResolvers(config: ResolvedConfig): CSSAtImportResolvers {
  let cssResolve: ResolveFn | undefined
  let sassResolve: ResolveFn | undefined
  let lessResolve: ResolveFn | undefined
  return {
    get css() {
      return (
        cssResolve ||
        (cssResolve = config.createResolver({
          extensions: ['.css'],
          mainFields: ['style'],
          conditions: ['style'],
          tryIndex: false,
          preferRelative: true,
        }))
      )
    },

    get sass() {
      return (
        sassResolve ||
        (sassResolve = config.createResolver({
          extensions: ['.scss', '.sass', '.css'],
          mainFields: ['sass', 'style'],
          conditions: ['sass', 'style'],
          tryIndex: true,
          tryPrefix: '_',
          preferRelative: true,
        }))
      )
    },

    get less() {
      return (
        lessResolve ||
        (lessResolve = config.createResolver({
          extensions: ['.less', '.css'],
          mainFields: ['less', 'style'],
          conditions: ['less', 'style'],
          tryIndex: false,
          preferRelative: true,
        }))
      )
    },
  }
}

export function getCssResolversKeys(resolvers: CSSAtImportResolvers): Array<keyof CSSAtImportResolvers> {
  return Object.keys(resolvers) as unknown as Array<keyof CSSAtImportResolvers>
}

type PreprocessorAdditionalDataResult =
  | string
  | { content: string, map?: ExistingRawSourceMap }

type PreprocessorAdditionalData =
  | string
  | ((
    source: string,
    filename: string,
  ) =>
  | PreprocessorAdditionalDataResult
  | Promise<PreprocessorAdditionalDataResult>)

type StylePreprocessorOptions = {
  [key: string]: any
  additionalData?: PreprocessorAdditionalData
  filename: string
  alias: Alias[]
  enableSourcemap: boolean
}

type SassStylePreprocessorOptions = StylePreprocessorOptions & Sass.Options

type StylusStylePreprocessorOptions = StylePreprocessorOptions & {
  define?: Record<string, any>
}

type StylePreprocessor = (
  source: string,
  root: string,
  options: StylePreprocessorOptions,
  resolvers: CSSAtImportResolvers,
) => StylePreprocessorResults | Promise<StylePreprocessorResults>

type SassStylePreprocessor = (
  source: string,
  root: string,
  options: SassStylePreprocessorOptions,
  resolvers: CSSAtImportResolvers,
) => StylePreprocessorResults | Promise<StylePreprocessorResults>

type StylusStylePreprocessor = (
  source: string,
  root: string,
  options: StylusStylePreprocessorOptions,
  resolvers: CSSAtImportResolvers,
) => StylePreprocessorResults | Promise<StylePreprocessorResults>

interface StylePreprocessorResults {
  code: string
  map?: ExistingRawSourceMap | undefined
  additionalMap?: ExistingRawSourceMap | undefined
  error?: RollupError
  deps: string[]
}

const loadedPreprocessors: Partial<
Record<PreprocessLang | PostCssDialectLang, any>
> = {}

// TODO: use dynamic import
const _require = createRequire(__filename)

export function loadPreprocessor(lang: PreprocessLang.scss, root: string): typeof Sass
export function loadPreprocessor(lang: PreprocessLang.sass, root: string): typeof Sass
export function loadPreprocessor(lang: PreprocessLang.less, root: string): typeof Less
export function loadPreprocessor(
  lang: PreprocessLang.stylus,
  root: string,
): typeof Stylus
export function loadPreprocessor(
  lang: PostCssDialectLang.sss,
  root: string,
): PostCSS.Parser
export function loadPreprocessor(
  lang: PreprocessLang | PostCssDialectLang,
  root: string,
): any {
  if (lang in loadedPreprocessors) {
    return loadedPreprocessors[lang]
  }
  try {
    const resolved = requireResolveFromRootWithFallback(root, lang)
    return (loadedPreprocessors[lang] = _require(resolved))
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        `Preprocessor dependency "${lang}" not found. Did you install it?`,
      )
    } else {
      const message = new Error(
        `Preprocessor dependency "${lang}" failed to load:\n${e.message}`,
      )
      message.stack = e.stack + '\n' + message.stack
      throw message
    }
  }
}

// .scss/.sass processor
export const scss: SassStylePreprocessor = async (
  source,
  root,
  options,
  resolvers,
) => {
  const render = loadPreprocessor(PreprocessLang.sass, root).render
  // NOTE: `sass` always runs it's own importer first, and only falls back to
  // the `importer` option when it can't resolve a path
  const internalImporter: Sass.Importer = (url, importer, done) => {
    importer = cleanScssBugUrl(importer)
    resolvers.sass(url, importer).then((resolved) => {
      if (resolved) {
        rebaseUrls(resolved, options.filename, options.alias, '$')
          .then((data) => done?.(fixScssBugImportValue(data)))
          .catch((data) => done?.(data))
      } else {
        done?.(null)
      }
    })
  }
  const importer = [internalImporter]
  if (options.importer) {
    Array.isArray(options.importer)
      ? importer.unshift(...options.importer)
      : importer.unshift(options.importer)
  }

  const { content: data, map: additionalMap } = await getSource(
    source,
    options.filename,
    options.additionalData,
    options.enableSourcemap,
  )
  const finalOptions: Sass.Options = {
    ...options,
    data,
    file: options.filename,
    outFile: options.filename,
    importer,
    ...(options.enableSourcemap
      ? {
        sourceMap: true,
        omitSourceMapUrl: true,
        sourceMapRoot: path.dirname(options.filename),
      }
      : {}),
  }

  try {
    const result = await new Promise<Sass.Result>((resolve, reject) => {
      render(finalOptions, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
    const deps = result.stats.includedFiles.map((f) => cleanScssBugUrl(f))
    const map: ExistingRawSourceMap | undefined = result.map
      ? JSON.parse(result.map.toString())
      : undefined

    return {
      code: result.css.toString(),
      map,
      additionalMap,
      deps,
    }
  } catch (e) {
    // normalize SASS error
    e.message = `[sass] ${e.message}`
    e.id = e.file
    e.frame = e.formatted
    return { code: '', error: e, deps: [] }
  }
}

export const sass: SassStylePreprocessor = (source, root, options, aliasResolver) =>
  scss(
    source,
    root,
    {
      ...options,
      indentedSyntax: true,
    },
    aliasResolver,
  )

/**
 * relative url() inside \@imported sass and less files must be rebased to use
 * root file as base.
 */
async function rebaseUrls(
  file: string,
  rootFile: string,
  alias: Alias[],
  variablePrefix: string,
): Promise<Sass.ImporterReturnType> {
  file = path.resolve(file) // ensure os-specific flashes
  // in the same dir, no need to rebase
  const fileDir = path.dirname(file)
  const rootDir = path.dirname(rootFile)
  if (fileDir === rootDir) {
    return { file }
  }

  const content = fs.readFileSync(file, 'utf-8')
  // no url()
  const hasUrls = cssUrlRE.test(content)
  // data-uri() calls
  const hasDataUris = cssDataUriRE.test(content)
  // no @import xxx.css
  const hasImportCss = importCssRE.test(content)

  if (!hasUrls && !hasDataUris && !hasImportCss) {
    return { file }
  }

  let rebased
  const rebaseFn = (url: string) => {
    if (url.startsWith('/')) return url
    // ignore url's starting with variable
    if (url.startsWith(variablePrefix)) return url
    // match alias, no need to rewrite
    for (const { find } of alias) {
      const matches =
        typeof find === 'string' ? url.startsWith(find) : find.test(url)
      if (matches) {
        return url
      }
    }
    const absolute = path.resolve(fileDir, url)
    const relative = path.relative(rootDir, absolute)
    return normalizePath(relative)
  }

  // fix css imports in less such as `@import "foo.css"`
  if (hasImportCss) {
    rebased = await rewriteImportCss(content, rebaseFn)
  }

  if (hasUrls) {
    rebased = await rewriteCssUrls(rebased || content, rebaseFn)
  }

  if (hasDataUris) {
    rebased = await rewriteCssDataUris(rebased || content, rebaseFn)
  }

  return {
    file,
    contents: rebased,
  }
}

// .less
export const less: StylePreprocessor = async (source, root, options, resolvers) => {
  const nodeLess = loadPreprocessor(PreprocessLang.less, root)
  const viteResolverPlugin = createViteLessPlugin(
    nodeLess,
    options.filename,
    options.alias,
    resolvers,
  )
  const { content, map: additionalMap } = await getSource(
    source,
    options.filename,
    options.additionalData,
    options.enableSourcemap,
  )

  let result: Less.RenderOutput | undefined
  try {
    result = await nodeLess.render(content, {
      ...options,
      plugins: [viteResolverPlugin, ...(options.plugins || [])],
      ...(options.enableSourcemap
        ? {
          sourceMap: {
            outputSourceFiles: true,
            sourceMapFileInline: false,
          },
        }
        : {}),
    })
  } catch (e) {
    const error = e as Less.RenderError
    // normalize error info
    const normalizedError: RollupError = new Error(
      `[less] ${error.message || error.type}`,
    ) as RollupError
    normalizedError.loc = {
      file: error.filename || options.filename,
      line: error.line,
      column: error.column,
    }
    return { code: '', error: normalizedError, deps: [] }
  }

  const map: ExistingRawSourceMap = result.map && JSON.parse(result.map)
  if (map) {
    delete map.sourcesContent
  }

  return {
    code: result.css.toString(),
    map,
    additionalMap,
    deps: result.imports,
  }
}

/**
 * Less manager, lazy initialized
 */
let ViteLessManager: any

function createViteLessPlugin(
  less: typeof Less,
  rootFile: string,
  alias: Alias[],
  resolvers: CSSAtImportResolvers,
): Less.Plugin {
  if (!ViteLessManager) {
    ViteLessManager = class ViteManager extends less.FileManager {
      resolvers
      rootFile
      alias
      constructor(
        rootFile: string,
        resolvers: CSSAtImportResolvers,
        alias: Alias[],
      ) {
        super()
        this.rootFile = rootFile
        this.resolvers = resolvers
        this.alias = alias
      }

      override supports(filename: string) {
        return !isExternalUrl(filename)
      }

      override supportsSync() {
        return false
      }

      override async loadFile(
        filename: string,
        dir: string,
        opts: any,
        env: any,
      ): Promise<Less.FileLoadResult> {
        const resolved = await this.resolvers.less(
          filename,
          path.join(dir, '*'),
        )
        if (resolved) {
          const result = await rebaseUrls(
            resolved,
            this.rootFile,
            this.alias,
            '@',
          )
          let contents: string
          if (result && 'contents' in result) {
            contents = result.contents
          } else {
            contents = fs.readFileSync(resolved, 'utf-8')
          }
          return {
            filename: path.resolve(resolved),
            contents,
          }
        } else {
          return super.loadFile(filename, dir, opts, env)
        }
      }
    }
  }

  return {
    install(_, pluginManager) {
      pluginManager.addFileManager(
        new ViteLessManager(rootFile, resolvers, alias),
      )
    },
    minVersion: [3, 0, 0],
  }
}

// .styl
export const styl: StylusStylePreprocessor = async (source, root, options) => {
  const nodeStylus = loadPreprocessor(PreprocessLang.stylus, root)
  // Get source with preprocessor options.additionalData. Make sure a new line separator
  // is added to avoid any render error, as added stylus content may not have semi-colon separators
  const { content, map: additionalMap } = await getSource(
    source,
    options.filename,
    options.additionalData,
    options.enableSourcemap,
    '\n',
  )
  // Get preprocessor options.imports dependencies as stylus
  // does not return them with its builtin `.deps()` method
  const importsDeps = (options.imports ?? []).map((dep: string) =>
    path.resolve(dep),
  )
  try {
    const ref = nodeStylus(content, options)
    if (options.define) {
      for (const key in options.define) {
        ref.define(key, options.define[key])
      }
    }
    if (options.enableSourcemap) {
      ref.set('sourcemap', {
        comment: false,
        inline: false,
        basePath: root,
      })
    }

    const result = ref.render()

    // Concat imports deps with computed deps
    const deps = [...ref.deps(), ...importsDeps]

    const map: ExistingRawSourceMap | undefined = ref.sourcemap

    return {
      code: result,
      map: formatStylusSourceMap(map, root),
      additionalMap,
      deps,
    }
  } catch (e) {
    e.message = `[stylus] ${e.message}`
    return { code: '', error: e, deps: [] }
  }
}

function formatStylusSourceMap(
  mapBefore: ExistingRawSourceMap | undefined,
  root: string,
): ExistingRawSourceMap | undefined {
  if (!mapBefore) return undefined
  const map = { ...mapBefore }

  const resolveFromRoot = (p: string) => normalizePath(path.resolve(root, p))

  if (map.file) {
    map.file = resolveFromRoot(map.file)
  }
  map.sources = map.sources.map(resolveFromRoot)

  return map
}

async function getSource(
  source: string,
  filename: string,
  additionalData: PreprocessorAdditionalData | undefined,
  enableSourcemap: boolean,
  sep = '',
): Promise<{ content: string, map?: ExistingRawSourceMap }> {
  if (!additionalData) return { content: source }

  if (typeof additionalData === 'function') {
    const newContent = await additionalData(source, filename)
    if (typeof newContent === 'string') {
      return { content: newContent }
    }
    return newContent
  }

  if (!enableSourcemap) {
    return { content: additionalData + sep + source }
  }

  const ms = new MagicString(source)
  ms.appendLeft(0, sep)
  ms.appendLeft(0, additionalData)

  const map = ms.generateMap({ hires: true })
  map.file = filename
  map.sources = [filename]

  return {
    content: ms.toString(),
    map,
  }
}
