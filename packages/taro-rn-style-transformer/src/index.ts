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

import * as path from 'path'

import StyleTransform from './transforms'
import { Config, TransformOptions } from './types'

const RN_CSS_EXT = ['.css', '.scss', '.sass', '.less', '.styl', '.stylus']
const upstreamTransformer = require('metro-react-native-babel-transformer')

const getSingleStyleTransform = styleTransformIns()

function styleTransformIns () {
  let styleTransform: StyleTransform | null = null
  return function (config: Config) {
    // 初始化 config
    if (!styleTransform) {
      styleTransform = new StyleTransform(config)
    }
    return styleTransform
  }
}

export async function transform (src: string, filename: string, options: TransformOptions) {
  if (typeof src === 'object') {
    // handle RN >= 0.46
    ({ src, filename, options } = src)
  }
  const ext = path.extname(filename)
  if (RN_CSS_EXT.includes(ext)) {
    const styleTransform = getSingleStyleTransform(options.config)
    const styles = await styleTransform.transform(src, filename, options)
    return upstreamTransformer.transform({
      src: styles,
      filename,
      options
    })
  }
  return upstreamTransformer.transform({ src, filename, options })
}

export function rollupTransform (options: TransformOptions) {
  return {
    name: 'rn-style-transformer', // this name will show up in warnings and errors
    async transform (src: string, filename: string) {
      const ext = path.extname(filename)
      if (RN_CSS_EXT.includes(ext)) {
        const styleTransform = getSingleStyleTransform(options.config)
        const code = await styleTransform.transform(src, filename, options)
        return { code }
      }
    }
  }
}
