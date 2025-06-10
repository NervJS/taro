import path from 'node:path'

import { fs, getHash } from '@tarojs/helper'
import MagicString from 'magic-string'
import * as mrmime from 'mrmime'
import { normalizePath } from 'vite'

import { addTrailingSlash, escapePath, virtualModulePrefixREG } from '../utils'
import {
  createToImportMetaURLBasedRelativeRuntime,
  toOutputFilePathInJS,
} from './postcss/build'
import { publicAssetUrlRE } from './postcss/constants'
import { cleanUrl } from './postcss/utils'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type {
  NormalizedOutputOptions,
  PluginContext,
  RenderedChunk,
} from 'rollup'
import type { Plugin, ResolvedConfig } from 'vite'

export const assetUrlRE = /__TARO_VITE_ASSET__([a-z\d]+)__(?:\$_(.*?)__)?/g

const rawRE = /(?:\?|&)raw(?:&|$)/
const urlRE = /(\?|&)url(?:&|$)/
const unnededFinalQueryCharRE = /[?&]$/

const assetCache = new WeakMap<ResolvedConfig, Map<string, string>>()

// chunk.name is the basename for the asset ignoring the directory structure
// For the manifest, we need to preserve the original file path and isEntry
// for CSS assets. We keep a map from referenceId to this information.
interface GeneratedAssetMeta {
  originalName: string
  isEntry?: boolean
}
export const generatedAssets = new WeakMap<
ResolvedConfig,
Map<string, GeneratedAssetMeta>
>()

export const publicAssetUrlCache = new WeakMap<
ResolvedConfig,
// hash -> url
Map<string, string>
>()

// add own dictionary entry by directly assigning mrmime
function registerCustomMime(): void {
  // https://github.com/lukeed/mrmime/issues/3
  mrmime.mimes.ico = 'image/x-icon'
  // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Containers#flac
  mrmime.mimes.flac = 'audio/flac'
  // mrmime and mime-db is not released yet: https://github.com/jshttp/mime-db/commit/c9242a9b7d4bb25d7a0c9244adec74aeef08d8a1
  mrmime.mimes.aac = 'audio/aac'
  // https://wiki.xiph.org/MIME_Types_and_File_Extensions#.opus_-_audio/ogg
  mrmime.mimes.opus = 'audio/ogg'
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  mrmime.mimes.eot = 'application/vnd.ms-fontobject'
}

export function renderAssetUrlInJS(
  ctx: PluginContext,
  config: ResolvedConfig,
  chunk: RenderedChunk,
  opts: NormalizedOutputOptions,
  code: string,
): MagicString | undefined {
  const toRelativeRuntime = createToImportMetaURLBasedRelativeRuntime(
    opts.format,
    config.isWorker,
  )

  let match: RegExpExecArray | null
  let s: MagicString | undefined

  // Urls added with JS using e.g.
  // imgElement.src = "__TARO_VITE_ASSET__5aa0ddc0__" are using quotes

  // Urls added in CSS that is imported in JS end up like
  // var inlined = ".inlined{color:green;background:url(__TARO_VITE_ASSET__5aa0ddc0__)}\n";

  // In both cases, the wrapping should already be fine

  assetUrlRE.lastIndex = 0
  while ((match = assetUrlRE.exec(code))) {
    s ||= new MagicString(code)
    const [full, referenceId, postfix = ''] = match
    const file = ctx.getFileName(referenceId)
    const filename = file + postfix
    const replacement = toOutputFilePathInJS(
      filename,
      'asset',
      chunk.fileName,
      'js',
      config,
      toRelativeRuntime,
    )
    const replacementString =
      typeof replacement === 'string'
        ? JSON.stringify(replacement).slice(1, -1)
        : `"+${replacement.runtime}+"`
    s.update(match.index, match.index + full.length, replacementString)
  }

  // Replace __TARO_VITE_PUBLIC_ASSET__5aa0ddc0__ with absolute paths

  const publicAssetUrlMap = publicAssetUrlCache.get(config)!
  publicAssetUrlRE.lastIndex = 0
  while ((match = publicAssetUrlRE.exec(code))) {
    s ||= new MagicString(code)
    const [full, hash] = match
    const publicUrl = publicAssetUrlMap.get(hash)!.slice(1)
    const replacement = toOutputFilePathInJS(
      publicUrl,
      'public',
      chunk.fileName,
      'js',
      config,
      toRelativeRuntime,
    )
    const replacementString =
      typeof replacement === 'string'
        ? JSON.stringify(replacement).slice(1, -1)
        : `"+${replacement.runtime}+"`
    s.update(match.index, match.index + full.length, replacementString)
  }

  return s
}

/**
 * Also supports loading plain strings with import text from './foo.txt?raw'
 */
export function assetPlugin(viteCompilerContext: ViteHarmonyCompilerContext): Plugin {
  registerCustomMime()
  let viteConfig: ResolvedConfig

  return {
    name: 'taro:vite-asset',
    enforce: 'pre',
    configResolved (config) {
      viteConfig = config
    },
    buildStart() {
      assetCache.set(viteConfig, new Map())
      generatedAssets.set(viteConfig, new Map())
    },
    resolveId(id) {
      if (!viteConfig.assetsInclude(cleanUrl(id)) && !urlRE.test(id)) {
        return
      }
      // imports to absolute urls pointing to files in /public
      // will fail to resolve in the main resolver. handle them here.
      const publicFile = checkPublicFile(id, viteConfig)
      if (publicFile) {
        return id
      }
    },
    load(id) {
      if (virtualModulePrefixREG.test(id)) {
        // Rollup convention, this id should be handled by the
        // plugin that marked it with \0
        return
      }

      // raw requests, read from disk
      if (rawRE.test(id)) {
        const file = checkPublicFile(id, viteConfig) || cleanUrl(id)
        // raw query, read file and return as string
        return `export default ${JSON.stringify(
          fs.readFileSync(file, 'utf-8'),
        )}`
      }

      if (!viteConfig.assetsInclude(cleanUrl(id)) && !urlRE.test(id)) {
        return
      }

      id = id.replace(urlRE, '$1').replace(unnededFinalQueryCharRE, '')
      const url = fileToUrl(id, viteConfig, this, viteCompilerContext)
      return `export default ${JSON.stringify(url)}`
    },
    renderChunk(code, chunk, opts) {
      const s = renderAssetUrlInJS(this, viteConfig, chunk, opts as any, code)

      if (s) {
        return {
          code: s.toString(),
          map: viteConfig.build.sourcemap
            ? s.generateMap({ hires: 'boundary' })
            : null,
        }
      } else {
        return null
      }
    },
  }
}

export function checkPublicFile(
  url: string,
  { publicDir }: ResolvedConfig,
): string | undefined {
  // note if the file is in /public, the resolver would have returned it
  // as-is so it's not going to be a fully resolved path.
  if (!publicDir || url[0] !== '/') {
    return
  }
  const publicFile = path.join(publicDir, cleanUrl(url))
  if (
    !normalizePath(publicFile).startsWith(
      addTrailingSlash(normalizePath(publicDir)),
    )
  ) {
    // can happen if URL starts with '../'
    return
  }
  if (fs.existsSync(publicFile)) {
    return publicFile
  }
}

export function publicFileToBuiltUrl(
  url: string,
  config: ResolvedConfig,
): string {
  const hash = getHash(url)
  let cache = publicAssetUrlCache.get(config)
  if (!cache) {
    cache = new Map<string, string>()
    publicAssetUrlCache.set(config, cache)
  }
  if (!cache.get(hash)) {
    cache.set(hash, url)
  }
  return `__TARO_VITE_PUBLIC_ASSET__${hash}__`
}

export function fileToUrl(
  id: string,
  config: ResolvedConfig,
  _pluginContext: PluginContext,
  viteCompilerContext: ViteHarmonyCompilerContext,
  skipPublicCheck = false,
): string {
  if (!skipPublicCheck && checkPublicFile(id, config)) {
    return publicFileToBuiltUrl(id, config)
  }

  const cache = assetCache.get(config)!
  const cached = cache.get(id)
  if (cached) {
    return cached
  }

  const file = cleanUrl(id)
  const content = fs.readFileSync(file)

  // emit as asset
  // const { search, hash } = parseUrl(id)
  // const postfix = (search || '') + (hash || '')

  const { cwd: appPath, taroConfig } = viteCompilerContext
  const { sourceRoot = 'src', outputRoot = 'dist' } = taroConfig
  const appRoot = path.resolve(appPath, sourceRoot)
  // const referenceId = pluginContext.emitFile({
  //   // Ignore directory structure for asset file names
  //   fileName: path.relative(appRoot, file),
  //   name: path.basename(file),
  //   type: 'asset',
  //   source: content,
  // })

  // const originalName = normalizePath(path.relative(config.root, file))
  // generatedAssets.get(config)!.set(referenceId, { originalName })

  // const url = `__TARO_VITE_ASSET__${referenceId}__${postfix ? `$_${postfix}__` : ``}` // TODO_BASE

  const resourceName = path.relative(appRoot, file).replace(/^[\\/]+/, '').replace(/[\\/-]+/g, '_')
  const resourcePath = path.join(escapePath(outputRoot), '..', 'resources/base/media', resourceName)
  fs.ensureDirSync(path.dirname(resourcePath))
  fs.writeFileSync(resourcePath, content, {
    encoding: 'utf-8',
  })

  cache.set(id, resourcePath)
  return 'resource://base/media/' + resourceName
}
