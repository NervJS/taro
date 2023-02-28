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
