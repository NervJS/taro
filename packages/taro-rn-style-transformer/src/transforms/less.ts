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

import less from 'less'
import * as path from 'path'

import { LessConfig, RenderAdditionalResult, RenderResult } from '../types'
import { getAdditionalData, insertBefore } from '../utils'
import makeLessImport from '../utils/lessImport'

function renderToCSS (src, filename, options = {} as any) {
  // default plugins
  const plugins = [makeLessImport(options)]
  // default paths set current filePath
  const paths = [path.dirname(path.resolve(process.cwd(), filename))]
  return new Promise((resolve, reject) => {
    less
      .render(src, {
        ...options,
        filename,
        plugins: plugins.concat(options.plugins || []),
        paths: paths.concat(options.paths || [])
      }, (err, result) => {
        if (err) {
          return reject(err.message)
        }
        resolve(result)
      })
  })
}

export default function transform (
  src: string,
  filename: string,
  config: LessConfig
) {
  const additionalData = getAdditionalData(src, config.additionalData)
  const data = insertBefore(src, additionalData)

  return renderToCSS(
    data,
    filename,
    {
      sourceMap: {
        outputFilename: `${filename}.map`
      },
      alias: config.alias,
      ...config.options
    }
  ).then((result: RenderResult) => {
    return { ...result, additionalData } as RenderAdditionalResult
  })
}
