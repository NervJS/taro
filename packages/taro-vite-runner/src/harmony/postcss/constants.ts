export const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/
export const JSX_TSX_LANGS_RE = /\.(jsx|tsx)(?:$|\?)/
export const SPECIAL_QUERY_RE = /[?&](?:worker|sharedworker|raw|url)\b/

export const enum PreprocessLang {
  less = 'less',
  sass = 'sass',
  scss = 'scss',
  styl = 'styl',
  stylus = 'stylus',
}
export const enum PureCssLang {
  css = 'css',
}
export const enum PostCssDialectLang {
  sss = 'sugarss',
}
export type CssLang =
  | keyof typeof PureCssLang
  | keyof typeof PreprocessLang
  | keyof typeof PostCssDialectLang

// https://drafts.csswg.org/css-syntax-3/#identifier-code-point
export const cssUrlRE = /(?<=^|[^\w\-\u0080-\uffff])url\((\s*('[^']+'|"[^"]+")\s*|[^'")]+)\)/
export const cssDataUriRE = /(?<=^|[^\w\-\u0080-\uffff])data-uri\((\s*('[^']+'|"[^"]+")\s*|[^'")]+)\)/
export const importCssRE = /@import ('[^']+\.css'|"[^"]+\.css"|[^'")]+\.css)/
// Assuming a function name won't be longer than 256 chars
export const cssImageSetRE = /(?<=image-set\()((?:[\w-]{1,256}\([^)]*\)|[^)])*)(?=\))/

// TODO: image and cross-fade could contain a "url" that needs to be processed
// https://drafts.csswg.org/css-images-4/#image-notation
// https://drafts.csswg.org/css-images-4/#cross-fade-function
export const cssNotProcessedRE = /(?:gradient|element|cross-fade|image)\(/

export const cssModuleRE = new RegExp(`\\.module${CSS_LANGS_RE.source}`)
export const cssGlobalModuleRE = new RegExp(`^(?!.*\\.global\\.).*${CSS_LANGS_RE.source}`)

export const htmlProxyRE = /(?:\?|&)html-proxy\b/
export const commonjsProxyRE = /\?commonjs-proxy/
export const inlineRE = /(?:\?|&)inline\b/
export const inlineCSSRE = /(?:\?|&)inline-css\b/
export const usedRE = /(?:\?|&)used/
export const varRE = /^var\(/i
export const loadParseImportRE = /(?:\?|&)load-parse-import\b/

export const publicAssetUrlRE = /__TARO_VITE_PUBLIC_ASSET__([a-z\d]{8})__/g
