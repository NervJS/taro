import { fs, getHash } from '@tarojs/helper'
import { Buffer } from 'buffer'
import MagicString from 'magic-string'
import * as mrmime from 'mrmime'
import path from 'path'
import { URL } from 'url'
import { normalizePath } from 'vite'

import { addTrailingSlash } from '../../utils'
import {
  createToImportMetaURLBasedRelativeRuntime,
  toOutputFilePathInJS,
} from './build'
import { publicAssetUrlRE } from './constants'
import { cleanUrl } from './utils'

import type {
  NormalizedOutputOptions,
  PluginContext,
  RenderedChunk,
} from 'rollup'
import type { ResolvedConfig } from 'vite'

export const assetUrlRE = /__VITE_ASSET__([a-z\d]+)__(?:\$_(.*?)__)?/g

const assetCache = new WeakMap<ResolvedConfig, Map<string, string>>()

// chunk.name is the basename for the asset ignoring the directory structure
// For the manifest, we need to preserve the original file path and isEntry
// for CSS assets. We keep a map from referenceId to this information.
interface GeneratedAssetMeta {
  originalName: string
  isEntry?: boolean
}
const generatedAssets = new WeakMap<
ResolvedConfig,
Map<string, GeneratedAssetMeta>
>()

// add own dictionary entry by directly assigning mrmime

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
  // imgElement.src = "__VITE_ASSET__5aa0ddc0__" are using quotes

  // Urls added in CSS that is imported in JS end up like
  // var inlined = ".inlined{color:green;background:url(__VITE_ASSET__5aa0ddc0__)}\n";

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

  // Replace __VITE_PUBLIC_ASSET__5aa0ddc0__ with absolute paths

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

// During build, if we don't use a virtual file for public assets, rollup will
// watch for these ids resulting in watching the root of the file system in Windows,


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

export async function fileToUrl(
  id: string,
  config: ResolvedConfig,
  ctx: PluginContext,
): Promise<string> {
  return fileToBuiltUrl(id, config, ctx)
}

export const publicAssetUrlCache = new WeakMap<
ResolvedConfig,
// hash -> url
Map<string, string>
>()

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
  return `__VITE_PUBLIC_ASSET__${hash}__`
}

const GIT_LFS_PREFIX = Buffer.from('version https://git-lfs.github.com')
function isGitLfsPlaceholder(content: Buffer): boolean {
  if (content.length < GIT_LFS_PREFIX.length) return false
  // Check whether the content begins with the characteristic string of Git LFS placeholders
  return GIT_LFS_PREFIX.compare(content, 0, GIT_LFS_PREFIX.length) === 0
}

/**
 * Register an asset to be emitted as part of the bundle (if necessary)
 * and returns the resolved public URL
 */
async function fileToBuiltUrl(
  id: string,
  config: ResolvedConfig,
  pluginContext: PluginContext,
  skipPublicCheck = false,
): Promise<string> {
  if (!skipPublicCheck && checkPublicFile(id, config)) {
    return publicFileToBuiltUrl(id, config)
  }

  const cache = assetCache.get(config)!
  const cached = cache.get(id)
  if (cached) {
    return cached
  }

  const file = cleanUrl(id)
  const content = await fs.readFile(file)

  let url: string
  if (
    config.build.lib ||
    (!file.endsWith('.svg') &&
      !file.endsWith('.html') &&
      content.length < Number(config.build.assetsInlineLimit) &&
      !isGitLfsPlaceholder(content))
  ) {
    if (config.build.lib && isGitLfsPlaceholder(content)) {
      config.logger.warn(
        `Inlined file ${id} was not downloaded via Git LFS`,
      )
    }

    const mimeType = mrmime.lookup(file) ?? 'application/octet-stream'
    // base64 inlined as a string
    url = `data:${mimeType};base64,${content.toString('base64')}`
  } else {
    // emit as asset
    const { search, hash } = new URL(id)
    const postfix = (search || '') + (hash || '')

    const referenceId = pluginContext.emitFile({
      // Ignore directory structure for asset file names
      name: path.basename(file),
      type: 'asset',
      source: content,
    })

    const originalName = normalizePath(path.relative(config.root, file))
    generatedAssets.get(config)!.set(referenceId, { originalName })

    url = `__VITE_ASSET__${referenceId}__${postfix ? `$_${postfix}__` : ``}` // TODO_BASE
  }

  cache.set(id, url)
  return url
}
