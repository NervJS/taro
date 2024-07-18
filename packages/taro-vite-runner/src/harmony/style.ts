import path from 'node:path'

import { transformSync } from '@babel/core'
import { dataToEsm } from '@rollup/pluginutils'
import { chalk, CSS_EXT, fs, REG_JS, REG_NODE_MODULES, REG_SCRIPTS, resolveSync } from '@tarojs/helper'
import { parse as parseJSXStyle } from '@tarojs/parse-css-to-stylesheet'
import { isEqual } from 'lodash'
import MagicString from 'magic-string'
import stylelint from 'stylelint'

import { appendVirtualModulePrefix, stripVirtualModulePrefix } from '../utils'
import {
  checkPublicFile,
  fileToUrl,
  // generatedAssets,
  publicFileToBuiltUrl,
  renderAssetUrlInJS,
} from './asset'
import { compileCSS } from './postcss'
import {
  commonjsProxyRE, CSS_LANGS_RE, cssModuleRE,
  htmlProxyRE, inlineCSSRE, inlineRE, loadParseImportRE,
  SPECIAL_QUERY_RE, usedRE
} from './postcss/constants'
import { finalizeCss, stripBomTag } from './postcss/utils'

import type * as BabelCore from '@babel/core'
import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type {
  RenderedChunk,
} from 'rollup'
import type { Plugin, ResolvedConfig } from 'vite'
import type { CssUrlReplacer } from './postcss/types'

const STYLE_SUFFIX = '.xss'
const STYLE_SUFFIX_RE = new RegExp(`\\${STYLE_SUFFIX}(\\?\\S+)?$`)

// const cssBundleName = 'style.css'

const isStyleRequest = (request: string): boolean =>
  CSS_LANGS_RE.test(request.replace(STYLE_SUFFIX_RE, ''))

const cssModulesCache = new WeakMap<ResolvedConfig, Map<string, Record<string, string>>>()
const cssMapCache = new WeakMap<ResolvedConfig, Map<string, string>>()
const removedPureCssFilesCache = new WeakMap<ResolvedConfig, Map<string, RenderedChunk>>()

function getCssIdSets (raw: string, id: string, sourceDir: string) {
  const cssIdSet = new Set<string>()
  transformSync(raw, {
    filename: id,
    parserOpts: {
      plugins: [
        'jsx',
        'typescript',
      ],
    },
    plugins: [
      [
        function importPlugin (): BabelCore.PluginObj<BabelCore.PluginPass> {
          return {
            name: 'taro-import-plugin',
            visitor: {
              ImportDeclaration(ats) {
                const rawId = ats.node.source.value
                const resolveId = resolveSync(rawId, {
                  basedir: path.dirname(id) || sourceDir,
                  extensions: CSS_EXT,
                })

                if (resolveId && CSS_LANGS_RE.test(rawId)) {
                  // Note: 预加载依赖的 CSS 文件
                  const cssId = appendVirtualModulePrefix(resolveId + STYLE_SUFFIX)
                  cssIdSet.add(cssId)
                }
                // const node = path.node
                // if (t.isIdentifier(node) && node.loc) {
                //   await that.load.add(node.name)
                // }
              }
            },
          }
        }
      ]
    ],
  })

  return cssIdSet
}

export async function stylePlugin(viteCompilerContext: ViteHarmonyCompilerContext): Promise<Plugin> {
  let moduleCache: Map<string, Record<string, string>>
  let cssCache: Map<string, string>
  let globalCssCache: Set<string>

  let viteConfig: ResolvedConfig
  let resolveUrl
  return {
    name: 'taro:vite-style',
    enforce: 'pre',
    configResolved(config) {
      resolveUrl = config.createResolver({
        preferRelative: true,
        tryIndex: false,
        extensions: [],
      })
      viteConfig = config
    },
    buildStart() {
      // Ensure a new cache for every build (i.e. rebuilding in watch mode)
      if (cssModulesCache.has(viteConfig)) {
        moduleCache = cssModulesCache.get(viteConfig)!
      } else {
        moduleCache = new Map<string, Record<string, string>>()
        cssModulesCache.set(viteConfig, moduleCache)
      }

      if (cssMapCache.has(viteConfig)) {
        cssCache = cssMapCache.get(viteConfig)!
      } else {
        cssCache = new Map<string, string>()
        cssMapCache.set(viteConfig, cssCache)
      }

      removedPureCssFilesCache.set(viteConfig, new Map<string, RenderedChunk>())
    },
    resolveId (source, importer) {
      if (CSS_LANGS_RE.test(source)) {
        const sourceDir = importer ? path.dirname(importer) : viteCompilerContext.sourceDir
        const suffix = source.includes('?')
          ? source.slice(source.lastIndexOf('?'))
          : ''
        const virtualId = resolveSync(source.replace(suffix, ''), {
          basedir: sourceDir,
          extensions: CSS_EXT,
        })

        if (virtualId) {
          return appendVirtualModulePrefix(virtualId + STYLE_SUFFIX + suffix)
        }
      }
      return null
    },
    load (id) {
      if (isStyleRequest(id)) {
        const rawId = stripVirtualModulePrefix(id).replace(STYLE_SUFFIX_RE, '')
        this.addWatchFile(rawId)
        return fs.readFileSync(rawId, 'utf-8')
      }
    },
    async transform(raw, id) {
      if (viteCompilerContext.loaderMeta.enableParseJSXStyle && !viteCompilerContext.loaderMeta.parseJSXStyleMapCache) {
        viteCompilerContext.loaderMeta.parseJSXStyleMapCache = cssMapCache
      }

      if (
        commonjsProxyRE.test(id) ||
        SPECIAL_QUERY_RE.test(id) ||
        loadParseImportRE.test(id)
      ) return
      // 如果是node_modules的文件，判断是否js\jsx\tsx
      if (REG_NODE_MODULES.test(id)) {
        if (REG_JS.test(id) || REG_SCRIPTS.test(id)) {
          // 读写内容，判断raw是否含有createElement 或者 jsx-runtime
          if (!(raw.includes('createElement') || raw.includes('jsx-runtime'))) {
            // 普通js文件，不走样式处理
            return
          }
        }
      }

      // Note: 新版本 rust 插件不需要修改 JSX 代码
      if (!isStyleRequest(id) && viteCompilerContext.loaderMeta.enableParseJSXStyle) return

      if (!isStyleRequest(id)) {
        if (!REG_SCRIPTS.test(id)) return
        try {
          const isEntry = viteCompilerContext.taroConfig.entry.app.includes(id)
          if (!isEntry && !globalCssCache) {
            const entryPath = viteCompilerContext.taroConfig.entry.app
            if (typeof entryPath === 'string') {
              await this.load({
                id: entryPath,
                resolveDependencies: true,
              })
            } else {
              await Promise.all(entryPath.map(async (entry) => {
                await this.load({
                  id: entry,
                  resolveDependencies: true,
                })
              }))
            }
          }

          const cssIdSet = getCssIdSets(raw, id, viteCompilerContext.sourceDir)

          if (isEntry) {
            globalCssCache = cssIdSet
          } else {
            globalCssCache.forEach((cssId) => {
              cssIdSet.add(cssId)
            })
          }

          // Note: 确保 CSS 文件已经加载
          await Promise.all(Array.from(cssIdSet).map(async (cssId) => {
            await this.load({
              id: cssId,
              resolveDependencies: true,
            })
          }))

          if (cssIdSet.size) {
            const cssRawArr = Array.from(cssIdSet).map((cssId) => {
              const rawId = stripVirtualModulePrefix(cssId).replace(STYLE_SUFFIX_RE, '').replace(usedRE, '')
              return cssCache.get(rawId) || ''
            })
            const { code: raw_code } = parseJSXStyle(raw, cssRawArr, {
              platformString: 'Harmony'
            })

            const s = new MagicString(raw_code)
            return {
              code: s.toString(),
              map: s.generateMap({ hires: true }),
            }
          }
        } catch (error) {
          console.error(error)
        }
        return
      }

      id = stripVirtualModulePrefix(id).replace(STYLE_SUFFIX, '')
      const urlReplacer: CssUrlReplacer = async (url, importer) => {
        if (checkPublicFile(url, viteConfig)) {
          return publicFileToBuiltUrl(url, viteConfig)
        }
        const resolved = await resolveUrl(url, importer)
        if (resolved) {
          return fileToUrl(resolved, viteConfig, this, viteCompilerContext)
        }
        viteConfig.logger.warnOnce(
          `\n${url} referenced in ${id} didn't resolve at build time, it will remain unchanged to be resolved at runtime`,
        )
        return url
      }

      const { taroConfig } = viteCompilerContext
      const isGlobalModule = taroConfig?.postcss?.cssModules?.config?.namingPattern === 'global'

      const {
        code: css,
        modules,
        deps,
        map,
      } = await compileCSS(id, raw, viteConfig, urlReplacer, isGlobalModule)

      // if (!cssCache.has(id)) {

      cssCache.set(id, css)
      // }

      // 校验css
      validateStylelint(id, raw)

      const rawId = id.replace(STYLE_SUFFIX_RE, '').replace(usedRE, '')
      if (modules && !moduleCache.has(rawId)) {
        moduleCache.set(rawId, modules)
      }

      // track deps for build watch mode
      if (viteConfig.build.watch && deps) {
        for (const file of deps) {
          this.addWatchFile(file)
        }
      }

      return {
        code: css,
        map,
      }
    }
  }
}

export async function stylePostPlugin(_viteCompilerContext: ViteHarmonyCompilerContext): Promise<Plugin> {
  // styles initialization in buildStart causes a styling loss in watch
  const styles: Map<string, string> = new Map<string, string>()
  let pureCssChunks: Set<RenderedChunk>

  // Note: ETS 模式不需要注入 CSS 文件
  // when there are multiple rollup outputs and extracting CSS, only emit once,
  // since output formats have no effect on the generated CSS.
  // let outputToExtractedCSSMap: Map<NormalizedOutputOptions, string>
  // let hasEmitted = false

  // const config = await resolveConfig({}, 'build')
  // const rollupOptionsOutput = config.build.rollupOptions.output
  let viteConfig: ResolvedConfig
  // const assetFileNames = (
  //   Array.isArray(rollupOptionsOutput)
  //     ? rollupOptionsOutput[0]
  //     : rollupOptionsOutput
  // )?.assetFileNames
  // const getCssAssetDirname = (config: ResolvedConfig, cssAssetName: string) => {
  //   if (!assetFileNames) {
  //     return config.build.assetsDir
  //   } else if (typeof assetFileNames === 'string') {
  //     return path.dirname(assetFileNames)
  //   } else {
  //     return path.dirname(
  //       assetFileNames({
  //         name: cssAssetName,
  //         type: 'asset',
  //         source: '/* vite internal call, ignore */',
  //       }),
  //     )
  //   }
  // }

  return {
    name: 'taro:vite-style-post',
    enforce: 'post',
    configResolved(config) {
      viteConfig = config
    },
    buildStart() {
      // Ensure new caches for every build (i.e. rebuilding in watch mode)
      pureCssChunks = new Set<RenderedChunk>()
      // outputToExtractedCSSMap = new Map<NormalizedOutputOptions, string>()
      // hasEmitted = false
    },
    async transform(raw, id) {
      if (
        !isStyleRequest(id) ||
        commonjsProxyRE.test(id) ||
        SPECIAL_QUERY_RE.test(id)
      ) {
        return
      }
      id = stripVirtualModulePrefix(id).replace(STYLE_SUFFIX, '')
      const css = stripBomTag(raw)

      const inlined = inlineRE.test(id)
      const rawId = stripVirtualModulePrefix(id).replace(STYLE_SUFFIX_RE, '').replace(usedRE, '')
      const modules = cssModulesCache.get(viteConfig)!.get(rawId)

      // `foo.module.css` => modulesCode
      // `foo.module.css?inline` => cssContent
      const modulesCode =
        modules &&
        !inlined &&
        dataToEsm(modules, { namedExports: true, preferConst: true })

      // build CSS handling ----------------------------------------------------

      // record css
      // cache css compile result to map
      // and then use the cache replace inline-style-flag when `generateBundle` in vite:build-html plugin
      const inlineCSS = inlineCSSRE.test(id)
      const isHTMLProxy = htmlProxyRE.test(id)
      if (inlineCSS && isHTMLProxy) {
        return `export default ''`
      }
      if (!inlined) {
        styles.set(id, css)
      }

      let code: string
      if (usedRE.test(id)) {
        if (modulesCode) {
          code = modulesCode
        } else {
          code = `export default ${JSON.stringify(css)}`
        }
      } else {
        // if moduleCode exists return it **even if** it does not have `?used`
        // this will disable tree-shake to work with `import './foo.module.css'` but this usually does not happen
        // this is a limitation of the current approach by `?used` to make tree-shake work
        // See #8936 for more details
        code = modulesCode || `export default ''`
      }

      return {
        code,
        map: { mappings: '' },
        // avoid the css module from being tree-shaken so that we can retrieve
        // it in renderChunk()
        moduleSideEffects: false,
        // moduleSideEffects: inlined ? false : 'no-treeshake',
      }
    },
    async renderChunk(code, chunk, opts) {
      let chunkCSS = ''
      let isPureCssChunk = true
      const ids = Object.keys(chunk.modules)
      for (let id of ids) {
        id = stripVirtualModulePrefix(id).replace(STYLE_SUFFIX_RE, '')
        if (styles.has(id)) {
          chunkCSS += styles.get(id)
          // a css module contains JS, so it makes this not a pure css chunk
          if (cssModuleRE.test(id)) {
            isPureCssChunk = false
          }
        } else {
          // if the module does not have a style, then it's not a pure css chunk.
          // this is true because in the `transform` hook above, only modules
          // that are css gets added to the `styles` map.
          isPureCssChunk = false
        }
      }

      if (!chunkCSS) {
        return null
      }

      // const publicAssetUrlMap = publicAssetUrlCache.get(viteConfig)!

      // resolve asset URL placeholders to their built file URLs
      // const resolveAssetUrlsInCss = (
      //   chunkCSS: string,
      //   cssAssetName: string,
      // ) => {
      //   const cssAssetDirname = getCssAssetDirname(viteConfig, cssAssetName)

      //   const toRelative = (filename: string) => {
      //     // relative base + extracted CSS
      //     const relativePath = path.posix.relative(cssAssetDirname!, filename)
      //     return relativePath.startsWith('.')
      //       ? relativePath
      //       : './' + relativePath
      //   }

      //   // replace asset url references with resolved url.
      //   chunkCSS = chunkCSS.replace(assetUrlRE, (_, fileHash, postfix = '') => {
      //     const filename = this.getFileName(fileHash) + postfix
      //     return toOutputFilePathInCss(
      //       filename,
      //       'asset',
      //       cssAssetName,
      //       'css',
      //       viteConfig,
      //       toRelative,
      //     )
      //   })
      //   // resolve public URL from CSS paths
      //   const relativePathToPublicFromCSS = path.posix.relative(
      //     cssAssetDirname!,
      //     '',
      //   )
      //   chunkCSS = chunkCSS.replace(publicAssetUrlRE, (_, hash) => {
      //     const publicUrl = publicAssetUrlMap.get(hash)!.slice(1)
      //     return toOutputFilePathInCss(
      //       publicUrl,
      //       'public',
      //       cssAssetName,
      //       'css',
      //       viteConfig,
      //       () => `${relativePathToPublicFromCSS}/${publicUrl}`,
      //     )
      //   })

      //   return chunkCSS
      // }

      // function ensureFileExt(name: string, ext: string) {
      //   return normalizePath(
      //     path.format({ ...path.parse(name), base: undefined, ext }),
      //   )
      // }

      if (isPureCssChunk) {
        // this is a shared CSS-only chunk that is empty.
        pureCssChunks.add(chunk)
      }
      if (opts.format === 'es' || opts.format === 'cjs') {
        // const cssAssetName = chunk.facadeModuleId
        //   ? normalizePath(path.relative(viteConfig.root, chunk.facadeModuleId))
        //   : chunk.name

        // const lang = path.extname(cssAssetName).slice(1)
        // const cssFileName = ensureFileExt(cssAssetName, '.css')

        // chunkCSS = resolveAssetUrlsInCss(chunkCSS, cssAssetName)
        // chunkCSS = await finalizeCss(chunkCSS)

        // emit corresponding css file
        /** const referenceId = */
        // this.emitFile({
        //   name: path.basename(cssFileName),
        //   type: 'asset',
        //   source: chunkCSS,
        // })
        // TODO 考虑 CSS 中相关 asset 处理方案
        // const originalName = isPreProcessor(lang) ? cssAssetName : cssFileName
        // const isEntry = chunk.isEntry && isPureCssChunk
        // generatedAssets
        //   .get(viteConfig)!
        //   .set(referenceId, { originalName, isEntry })
        // chunk.viteMetadata!.importedCss.add(this.getFileName(referenceId))
      } else {
        chunkCSS = await finalizeCss(chunkCSS)
        let cssString = JSON.stringify(chunkCSS)
        cssString =
          renderAssetUrlInJS(
            this,
            viteConfig,
            chunk,
            opts as any,
            cssString,
          )?.toString() || cssString
        const style = `__vite_style__`
        const injectCode =
          `var ${style} = document.createElement('style');` +
          `${style}.textContent = ${cssString};` +
          `document.head.appendChild(${style});`
        const wrapIdx = code.indexOf('System.register')
        const insertMark = "'use strict';"
        const insertIdx = code.indexOf(insertMark, wrapIdx)
        const s = new MagicString(code)
        s.appendLeft(insertIdx + insertMark.length, injectCode)
        if (viteConfig.build.sourcemap) {
          // resolve public URL from CSS paths, we need to use absolute paths
          return {
            code: s.toString(),
            map: s.generateMap({ hires: true }),
          }
        } else {
          return { code: s.toString() }
        }
      }

      return null
    },
    async generateBundle(opts, bundle) {
      // @ts-expect-error asset emits are skipped in legacy bundle
      if (opts.__vite_skip_asset_emit__) {
        return
      }

      // remove empty css chunks and their imports
      if (pureCssChunks.size) {
        // map each pure css chunk (rendered chunk) to it's corresponding bundle
        // chunk. we check that by comparing the `moduleIds` as they have different
        // filenames (rendered chunk has the !~{XXX}~ placeholder)
        const pureCssChunkNames: string[] = []
        for (const pureCssChunk of pureCssChunks) {
          for (const key in bundle) {
            const bundleChunk = bundle[key]
            if (
              bundleChunk.type === 'chunk' &&
              isEqual(bundleChunk.moduleIds, pureCssChunk.moduleIds)
            ) {
              pureCssChunkNames.push(key)
              break
            }
          }
        }

        const emptyChunkFiles = pureCssChunkNames
          .map((file) => path.basename(file))
          .join('|')
          .replace(/\./g, '\\.')
        const emptyChunkRE = new RegExp(
          opts.format === 'es'
            ? `\\bimport\\s*["'][^"']*(?:${emptyChunkFiles})["'];\n?`
            : `\\brequire\\(\\s*["'][^"']*(?:${emptyChunkFiles})["']\\);\n?`,
          'g',
        )
        for (const file in bundle) {
          const chunk = bundle[file]
          if (chunk.type === 'chunk') {
            // remove pure css chunk from other chunk's imports,
            // and also register the emitted CSS files under the importer
            // chunks instead.
            chunk.imports = chunk.imports.filter((file) => {
              if (pureCssChunkNames.includes(file)) {
                return false
              }
              return true
            })
            chunk.code = chunk.code.replace(
              emptyChunkRE,
              // remove css import while preserving source map location
              (m) => `/* empty css ${''.padEnd(m.length - 15)}*/`,
            )
          }
        }
        const removedPureCssFiles = removedPureCssFilesCache.get(viteConfig)!
        pureCssChunkNames.forEach((fileName) => {
          removedPureCssFiles.set(fileName, bundle[fileName] as RenderedChunk)
          delete bundle[fileName]
        })
      }

      // let extractedCss = outputToExtractedCSSMap.get(opts as any)
      // if (extractedCss && !hasEmitted) {
      //   hasEmitted = true
      //   extractedCss = await finalizeCss(extractedCss)
      //   this.emitFile({
      //     name: cssBundleName,
      //     type: 'asset',
      //     source: extractedCss,
      //   })
      // }
    },
  }
}

// 校验stylelint
function validateStylelint(id: string, code: string) {
  stylelint.lint({
    code,
    configBasedir: process.cwd()
  }).then(res => {
    if (res.errored) {
      // eslint-disable-next-line no-console
      // console.log(res.output)
    } else {
      res.results.forEach(res => {
        if (res.warnings.length) {
          // eslint-disable-next-line no-console
          console.log('\n', chalk.cyan('Taro多端样式检测:'), chalk.gray(id))
        }
        res.warnings.forEach(warning => {
          // eslint-disable-next-line no-console
          console.log(' |', chalk.gray(`${path.basename(id)}:[${warning.line}:${warning.column}]`), highlightQuotes(warning.text))
        })
      })
    }
  }).catch(_ => {
    // 没有stylelint配置文件
  })
}

function highlightQuotes(inputString) {
  // 使用正则表达式匹配双引号内容
  const regex = /"("?[^"]*?"?)"/g
  // 使用 replace 方法将匹配到的双引号内容进行高亮
  const highlightedString = inputString.replace(regex, (_, group) => {
    return chalk.yellow(`"${group}"`)
  })
  return highlightedString
}
