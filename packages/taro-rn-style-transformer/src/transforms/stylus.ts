/* 
 *  MIT License
 *  
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import stylus from 'stylus'

import { RenderAdditionalResult, RenderResult, StylusConfig, StylusRenderOptions } from '../types'
import { getAdditionalData, insertBefore } from '../utils'

export const defaultOptions: StylusRenderOptions = {
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

function renderToCSS (src, filename, options = {} as StylusRenderOptions) {
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

export default function transform (src: string, filename: string, config: StylusConfig) {
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
