import MagicString from 'magic-string'

import { asyncReplace, emptyCssComments, isDataUrl, isExternalUrl } from '../style-utils'
import { cssDataUriRE, cssUrlRE, importCssRE, varRE } from './constants'

import type Sass from 'sass'
import type { CssUrlReplacer } from './types'

export function rewriteImportCss(
  css: string,
  replacer: CssUrlReplacer,
): Promise<string> {
  return asyncReplace(css, importCssRE, async (match) => {
    const [matched, rawUrl] = match
    return await doImportCSSReplace(rawUrl, matched, replacer)
  })
}

export function rewriteCssUrls(
  css: string,
  replacer: CssUrlReplacer,
): Promise<string> {
  return asyncReplace(css, cssUrlRE, async (match) => {
    const [matched, rawUrl] = match
    return await doUrlReplace(rawUrl.trim(), matched, replacer)
  })
}

export function rewriteCssDataUris(
  css: string,
  replacer: CssUrlReplacer,
): Promise<string> {
  return asyncReplace(css, cssDataUriRE, async (match) => {
    const [matched, rawUrl] = match
    return await doUrlReplace(rawUrl.trim(), matched, replacer, 'data-uri')
  })
}

export async function doUrlReplace(
  rawUrl: string,
  matched: string,
  replacer: CssUrlReplacer,
  funcName = 'url',
) {
  let wrap = ''
  const first = rawUrl[0]
  if (first === `"` || first === `'`) {
    wrap = first
    rawUrl = rawUrl.slice(1, -1)
  }

  if (
    isExternalUrl(rawUrl) ||
    isDataUrl(rawUrl) ||
    rawUrl.startsWith('#') ||
    varRE.test(rawUrl)
  ) {
    return matched
  }

  const newUrl = await replacer(rawUrl)
  if (wrap === '' && newUrl !== encodeURI(newUrl)) {
    // The new url might need wrapping even if the original did not have it, e.g. if a space was added during replacement
    wrap = "'"
  }
  return `${funcName}(${wrap}${newUrl}${wrap})`
}

async function doImportCSSReplace(
  rawUrl: string,
  matched: string,
  replacer: CssUrlReplacer,
) {
  let wrap = ''
  const first = rawUrl[0]
  if (first === `"` || first === `'`) {
    wrap = first
    rawUrl = rawUrl.slice(1, -1)
  }
  if (isExternalUrl(rawUrl) || isDataUrl(rawUrl) || rawUrl.startsWith('#')) {
    return matched
  }

  return `@import ${wrap}${await replacer(rawUrl)}${wrap}`
}

declare const window: unknown | undefined
declare const location: { href: string } | undefined

// in unix, scss might append `location.href` in environments that shim `location`
// see https://github.com/sass/dart-sass/issues/710
export function cleanScssBugUrl(url: string) {
  if (
    // check bug via `window` and `location` global
    typeof window !== 'undefined' &&
    typeof location !== 'undefined' &&
    typeof location?.href === 'string'
  ) {
    const prefix = location.href.replace(/\/$/, '')
    return url.replace(prefix, '')
  } else {
    return url
  }
}

export function fixScssBugImportValue(
  data: Sass.ImporterReturnType,
): Sass.ImporterReturnType {
  // the scss bug doesn't load files properly so we have to load it ourselves
  // to prevent internal error when it loads itself
  if (
    // check bug via `window` and `location` global
    typeof window !== 'undefined' &&
    typeof location !== 'undefined' &&
    data &&
    'file' in data &&
    (!('contents' in data) || data.contents == null)
  ) {
    // @ts-expect-error we need to preserve file property for HMR
    data.contents = fs.readFileSync(data.file, 'utf-8')
  }
  return data
}

export async function finalizeCss(css: string) {
  // hoist external @imports and @charset to the top of the CSS chunk per spec (#1845 and #6333)
  if (css.includes('@import') || css.includes('@charset')) {
    css = await hoistAtRules(css)
  }
  return css
}

// https://drafts.csswg.org/css-syntax-3/#identifier-code-point
// Assuming a function name won't be longer than 256 chars

async function hoistAtRules(css: string): Promise<string> {
  const s = new MagicString(css)
  const cleanCss = emptyCssComments(css)
  let match: RegExpExecArray | null

  // #1845
  // CSS @import can only appear at top of the file. We need to hoist all @import
  // to top when multiple files are concatenated.
  // match until semicolon that's not in quotes
  const atImportRE =
    /@import(?:\s*(?:url\([^)]*\)|"(?:[^"]|(?<=\\)")*"|'(?:[^']|(?<=\\)')*').*?|[^;]*);/g
  while ((match = atImportRE.exec(cleanCss))) {
    s.remove(match.index, match.index + match[0].length)
    // Use `appendLeft` instead of `prepend` to preserve original @import order
    s.appendLeft(0, match[0])
  }

  // #6333
  // CSS @charset must be the top-first in the file, hoist the first to top
  const atCharsetRE =
    /@charset(?:\s*(?:"(?:[^"]|(?<=\\)")*"|'(?:[^']|(?<=\\)')*').*?|[^;]*);/g
  let foundCharset = false
  while ((match = atCharsetRE.exec(cleanCss))) {
    s.remove(match.index, match.index + match[0].length)
    if (!foundCharset) {
      s.prepend(match[0])
      foundCharset = true
    }
  }

  return s.toString()
}
