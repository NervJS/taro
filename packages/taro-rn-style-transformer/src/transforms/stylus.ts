import stylus from 'stylus'

import { RenderAdditionalResult, RenderResult } from '../types'
import { getAdditionalData, insertBefore } from '../utils'

class Evaluator { }

interface Dictionary<T> {
  [key: string]: T
}

// https://stylus-lang.com/docs/js.html
interface RenderOptions {
  globals?: Dictionary<any>
  functions?: Dictionary<any>
  imports?: string[]
  paths?: string[]
  filename?: string
  Evaluator?: typeof Evaluator
  /**
   * Specify Stylus plugins to use. Plugins may be passed as
   * strings instead of importing them in your Webpack config.
   *
   * @type {(string|Function)[]}
   * @default []
   */
  use: (string | ((string) => string))[]
  /**
   * Add path(s) to the import lookup paths.
   *
   * @type {string[]}
   * @default []
   */
  include: string[]
  /**
   * Import the specified Stylus files/paths.
   *
   * @type {string[]}
   * @default []
   */
  import: string[]

  /**
   * Define Stylus variables or functions.
   *
   * @type {Array|Object}
   * @default {}
   */
  // Array is the recommended syntax: [key, value, raw]
  define: Array<any> | Record<string, any>
  // Object is deprecated syntax (there is no possibility to specify "raw')
  // define: {
  //   $development: process.env.NODE_ENV === 'development',
  //   rawVar: 42,
  // },

  /**
   * Include regular CSS on @import.
   *
   * @type {boolean}
   * @default false
   */
  includeCSS: boolean

  /**
   * Resolve relative url()'s inside imported files.
   *
   * @see https://stylus-lang.com/docs/js.html#stylusresolveroptions
   *
   * @type {boolean|Object}
   * @default { nocheck: true }
   */
  // resolveURL: boolean | Record<string, any>,
  // resolveURL: { nocheck: true },

  /**
   * Emits comments in the generated CSS indicating the corresponding Stylus line.
   *
   * @see https://stylus-lang.com/docs/executable.html
   *
   * @type {boolean}
   * @default false
   */
  lineNumbers: boolean
  /**
   * @type {boolean}
   * @default false
   */
  disableCache: boolean

  /**
   * Move @import and @charset to the top.
   *
   * @see https://stylus-lang.com/docs/executable.html
   *
   * @type {boolean}
   * @default false
   */
  hoistAtrules: boolean
}

export interface Config {
  alias?: Record<string, string>
  options: RenderOptions
  additionalData?: string | ((key: string) => string)
}

export const defaultOptions = {
  use: [],
  include: [],
  import: [],
  define: {},
  includeCSS: false,
  // resolveURL: { nocheck: false },
  lineNumbers: false,
  hoistAtrules: false,
  disableCache: false
}

function renderToCSS (src, filename, options = {} as RenderOptions) {
  const stylusOptions = { filename, ...options }
  const styl = stylus(src, stylusOptions)

  styl.set(
    'sourcemap',
    {
      comment: true,
      sourceRoot: '.', // stylusOptions.dest
      basePath: '.'
    }
  )

  // include regular CSS on @import
  if (stylusOptions.includeCSS) {
    styl.set('include css', true)
  }

  if (stylusOptions.hoistAtrules) {
    styl.set('hoist atrules', true)
  }

  if (stylusOptions.lineNumbers) {
    styl.set('linenos', true)
  }

  if (stylusOptions.disableCache) {
    styl.set('cache', false)
  }

  if (
    typeof stylusOptions.use !== 'undefined' &&
    stylusOptions.use.length > 0
  ) {
    let { length } = stylusOptions.use

    // eslint-disable-next-line no-plusplus
    while (length--) {
      const [item] = stylusOptions.use.splice(length, 1)
      let useIn: any = item
      if (typeof item === 'string') {
        try {
          const resolved = require.resolve(item)

          // eslint-disable-next-line import/no-dynamic-require, global-require
          useIn = require(resolved)(stylusOptions)
        } catch (error) {
          const msg = `Failed to load "${item}" Stylus plugin.Are you sure it's installed?\n${error}`
          throw new Error(msg)
        }
      }
      styl.use(useIn)
    }
  }

  if (typeof stylusOptions.import !== 'undefined') {
    for (const imported of stylusOptions.import) {
      styl.import(imported)
    }
  }

  if (typeof stylusOptions.include !== 'undefined') {
    for (const included of stylusOptions.include) {
      styl.include(included)
    }
  }

  // if (stylusOptions.resolveURL !== false) {
  //   styl.define('url', urlResolver(stylusOptions.resolveURL))
  // }

  if (typeof stylusOptions.define !== 'undefined') {
    const definitions = Array.isArray(stylusOptions.define)
      ? stylusOptions.define
      : Object.entries(stylusOptions.define)

    for (const defined of definitions) {
      styl.define.apply(null, defined)
    }
  }

  return new Promise((resolve, reject) => {
    styl.render((err, css) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          css,
          map: styl.sourcemap
        })
      }
    })
  })
}

export default function transform (src: string, filename: string, config: Config) {
  const additionalData = getAdditionalData(src, config.additionalData)
  const data = insertBefore(src, additionalData)

  return renderToCSS(
    data,
    filename,
    config.options
  ).then((result: RenderResult) => {
    return { ...result, additionalData } as RenderAdditionalResult
  })
}
