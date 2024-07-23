export const needsEscapeRegEx = /[\n\r'\\\u2028\u2029]/
export const quoteNewlineRegEx = /([\n\r'\u2028\u2029])/g
export const backSlashRegEx = /\\/g

export const baseTemplateName = 'base'
export const baseCompName = 'comp'
export const customWrapperName = 'custom-wrapper'
export const ENTRY_QUERY = 'taro-entry-loader'
export const PAGENAME_QUERY = 'taro-pagename'
export const DEFAULT_TERSER_OPTIONS = {
  parse: {
    ecma: 8,
  },
  compress: {
    ecma: 5,
    warnings: false,
    arrows: false,
    collapse_vars: false,
    comparisons: false,
    computed_props: false,
    hoist_funs: false,
    hoist_props: false,
    hoist_vars: false,
    inline: false,
    loops: false,
    negate_iife: false,
    properties: false,
    reduce_funcs: false,
    reduce_vars: false,
    switches: false,
    toplevel: false,
    typeofs: false,
    booleans: true,
    if_return: true,
    sequences: true,
    unused: true,
    conditionals: true,
    dead_code: true,
    evaluate: true,
  },
  output: {
    ecma: 5,
    comments: false,
    ascii_only: true,
  },
}

export const MINI_EXCLUDE_POSTCSS_PLUGIN_NAME = ['cssModules']
export const H5_EXCLUDE_POSTCSS_PLUGIN_NAME = ['cssModules', 'url']
export const HARMONY_SCOPES = [/^@system\./, /^@ohos\./, /^@hmscore\//, /^@jd-oh\//]
