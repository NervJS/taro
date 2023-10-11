import remapping from '@ampproject/remapping'
import { resolveSync } from '@tarojs/helper'
import { createHash } from 'crypto'
import { createRequire } from 'module'

import type { DecodedSourceMap, RawSourceMap } from '@ampproject/remapping'

// TODO: use import()
const _require = createRequire(__filename)


export function withTrailingSlash(path: string): string {
  if (path[path.length - 1] !== '/') {
    return `${path}/`
  }
  return path
}

const postfixRE = /[?#].*$/s
export function cleanUrl(url: string): string {
  return url.replace(postfixRE, '')
}

const externalRE = /^(https?:)?\/\//
export const isExternalUrl = (url: string): boolean => externalRE.test(url)

const dataUrlRE = /^\s*data:/i
export const isDataUrl = (url: string): boolean => dataUrlRE.test(url)

const directRequestRE = /(\?|&)direct=?(?:&|$)/
const trailingSeparatorRE = /[?&]$/

export function removeDirectQuery(url: string): string {
  return url.replace(directRequestRE, '$1').replace(trailingSeparatorRE, '')
}

export async function asyncReplace(
  input: string,
  re: RegExp,
  replacer: (match: RegExpExecArray) => string | Promise<string>,
): Promise<string> {
  let match: RegExpExecArray | null
  let remaining = input
  let rewritten = ''
  while ((match = re.exec(remaining))) {
    rewritten += remaining.slice(0, match.index)
    rewritten += await replacer(match)
    remaining = remaining.slice(match.index + match[0].length)
  }
  rewritten += remaining
  return rewritten
}

const splitRE = /\r?\n/

const range = 2


function posToNumber(
  source: string,
  pos: number | { line: number, column: number },
): number {
  if (typeof pos === 'number') return pos
  const lines = source.split(splitRE)
  const { line, column } = pos
  let start = 0
  for (let i = 0; i < line - 1 && i < lines.length; i++) {
    start += lines[i].length + 1
  }
  return start + column
}

export function generateCodeFrame(
  source: string,
  start: number | { line: number, column: number } = 0,
  end?: number,
): string {
  start = posToNumber(source, start)
  end = end || start
  const lines = source.split(splitRE)
  let count = 0
  const res: string[] = []
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + 1
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) continue
        const line = j + 1
        res.push(
          `${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${
            lines[j]
          }`,
        )
        const lineLength = lines[j].length
        if (j === i) {
          // push underline
          const pad = Math.max(start - (count - lineLength) + 1, 0)
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start,
          )
          res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length))
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1)
            res.push(`   |  ` + '^'.repeat(length))
          }
          count += lineLength + 1
        }
      }
      break
    }
  }
  return res.join('\n')
}

interface ImageCandidate {
  url: string
  descriptor: string
}
const escapedSpaceCharacters = /( |\\t|\\n|\\f|\\r)+/g
const imageSetUrlRE = /^(?:[\w-]+\(.*?\)|'.*?'|".*?"|\S*)/
function reduceSrcset(ret: { url: string, descriptor: string }[]) {
  return ret.reduce((prev, { url, descriptor }, index) => {
    descriptor ??= ''
    return (prev +=
      url + ` ${descriptor}${index === ret.length - 1 ? '' : ', '}`)
  }, '')
}

function splitSrcSetDescriptor(srcs: string): ImageCandidate[] {
  return splitSrcSet(srcs)
    .map((s) => {
      const src = s.replace(escapedSpaceCharacters, ' ').trim()
      const [url] = imageSetUrlRE.exec(src) || ['']

      return {
        url,
        descriptor: src?.slice(url.length).trim(),
      }
    })
    .filter(({ url }) => !!url)
}

export function processSrcSet(
  srcs: string,
  replacer: (arg: ImageCandidate) => Promise<string>,
): Promise<string> {
  return Promise.all(
    splitSrcSetDescriptor(srcs).map(async ({ url, descriptor }) => ({
      url: await replacer({ url, descriptor }),
      descriptor,
    })),
  ).then((ret) => reduceSrcset(ret))
}

const blankReplacer = (match: string): string => ' '.repeat(match.length)
const cleanSrcSetRE =
  /(?:url|image|gradient|cross-fade)\([^)]*\)|"([^"]|(?<=\\)")*"|'([^']|(?<=\\)')*'/g
function splitSrcSet(srcs: string) {
  const parts: string[] = []
  // There could be a ',' inside of url(data:...), linear-gradient(...) or "data:..."
  const cleanedSrcs = srcs.replace(cleanSrcSetRE, blankReplacer)
  let startIndex = 0
  let splitIndex: number
  do {
    splitIndex = cleanedSrcs.indexOf(',', startIndex)
    parts.push(
      srcs.slice(startIndex, splitIndex !== -1 ? splitIndex : undefined),
    )
    startIndex = splitIndex + 1
  } while (splitIndex !== -1)
  return parts
}

const windowsDriveRE = /^[A-Z]:/
const replaceWindowsDriveRE = /^([A-Z]):\//
const linuxAbsolutePathRE = /^\/[^/]/
function escapeToLinuxLikePath(path: string) {
  if (windowsDriveRE.test(path)) {
    return path.replace(replaceWindowsDriveRE, '/windows/$1/')
  }
  if (linuxAbsolutePathRE.test(path)) {
    return `/linux${path}`
  }
  return path
}

const revertWindowsDriveRE = /^\/windows\/([A-Z])\//
function unescapeToLinuxLikePath(path: string) {
  if (path.startsWith('/linux/')) {
    return path.slice('/linux'.length)
  }
  if (path.startsWith('/windows/')) {
    return path.replace(revertWindowsDriveRE, '$1:/')
  }
  return path
}

// based on https://github.com/sveltejs/svelte/blob/abf11bb02b2afbd3e4cac509a0f70e318c306364/src/compiler/utils/mapped_code.ts#L221
const nullSourceMap: RawSourceMap = {
  names: [],
  sources: [],
  mappings: '',
  version: 3,
}
export function combineSourcemaps(
  filename: string,
  sourcemapList: Array<DecodedSourceMap | RawSourceMap>,
): RawSourceMap {
  if (
    sourcemapList.length === 0 ||
    sourcemapList.every((m) => m.sources.length === 0)
  ) {
    return { ...nullSourceMap }
  }

  // hack for parse broken with normalized absolute paths on windows (C:/path/to/something).
  // escape them to linux like paths
  // also avoid mutation here to prevent breaking plugin's using cache to generate sourcemaps like vue (see #7442)
  sourcemapList = sourcemapList.map((sourcemap) => {
    const newSourcemaps = { ...sourcemap }
    newSourcemaps.sources = sourcemap.sources.map((source) =>
      source ? escapeToLinuxLikePath(source) : null,
    )
    if (sourcemap.sourceRoot) {
      newSourcemaps.sourceRoot = escapeToLinuxLikePath(sourcemap.sourceRoot)
    }
    return newSourcemaps
  })
  const escapedFilename = escapeToLinuxLikePath(filename)

  // We don't declare type here so we can convert/fake/map as RawSourceMap
  let map // : SourceMap
  let mapIndex = 1
  const useArrayInterface =
    sourcemapList.slice(0, -1).find((m) => m.sources.length !== 1) === undefined
  if (useArrayInterface) {
    map = remapping(sourcemapList, () => null)
  } else {
    map = remapping(sourcemapList[0], function loader(sourcefile) {
      if (sourcefile === escapedFilename && sourcemapList[mapIndex]) {
        return sourcemapList[mapIndex++]
      } else {
        return null
      }
    })
  }
  if (!map.file) {
    delete map.file
  }

  // unescape the previous hack
  map.sources = map.sources.map((source) =>
    source ? unescapeToLinuxLikePath(source) : source,
  )
  map.file = filename

  return map as RawSourceMap
}

// Taken from https://stackoverflow.com/a/36328890
const multilineCommentsRE = /\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g


export function getHash(text: Buffer | string): string {
  return createHash('sha256').update(text).digest('hex').substring(0, 8)
}

export const requireResolveFromRootWithFallback = (
  root: string,
  id: string,
): string => {
  // check existence first, so if the package is not found,
  // it won't be cached by nodejs, since there isn't a way to invalidate them:
  // https://github.com/nodejs/node/issues/44663
  const found = resolveSync(id, {
    basedir: root
  }) || resolveSync(id, {
    basedir: __dirname
  })
  if (!found) {
    const error = new Error(`${JSON.stringify(id)} not found.`)
    ;(error as any).code = 'MODULE_NOT_FOUND'
    throw error
  }

  // actually resolve
  // Search in the root directory first, and fallback to the default require paths.
  return _require.resolve(id, { paths: [root, __dirname] })
}

export function emptyCssComments(raw: string): string {
  return raw.replace(multilineCommentsRE, (s) => ' '.repeat(s.length))
}

// https://github.com/vitejs/vite/issues/1363
// work around https://github.com/rollup/plugins/issues/759

// strip UTF-8 BOM
export function stripBomTag(content: string): string {
  if (content.charCodeAt(0) === 0xfeff) {
    return content.slice(1)
  }

  return content
}

export function joinUrlSegments(a: string, b: string): string {
  if (!a || !b) {
    return a || b || ''
  }
  if (a[a.length - 1] === '/') {
    a = a.substring(0, a.length - 1)
  }
  if (b[0] !== '/') {
    b = '/' + b
  }
  return a + b
}

export function arrayEqual(a: any[], b: any[]): boolean {
  if (a === b) return true
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}
