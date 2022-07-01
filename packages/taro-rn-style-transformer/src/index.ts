import * as path from 'path'

// import semver from 'semver'
// import reactNativePKG from 'react-native/package.json'
import StyleTransform from './transforms'

const RN_CSS_EXT = ['.css', '.scss', '.sass', '.less', '.styl', '.stylus']

// 目前仅支持React-Native 0.60+
// const reactNativeVersionString = reactNativePKG.version
// const reactNativeMinorVersion = semver.minor(reactNativeVersionString)

const upstreamTransformer = require('metro-react-native-babel-transformer')

const getSingleStyleTransform = styleTransformIns()

function styleTransformIns () {
  let styleTransform: StyleTransform | null = null
  return function (config) {
    // 初始化 config
    if (!styleTransform) {
      styleTransform = new StyleTransform(config)
    }
    return styleTransform
  }
}

export async function transform (src: string, filename: string, options) {
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

export function rollupTransform (options) {
  return {
    name: 'rn-style-transformer', // this name will show up in warnings and errors
    async transform (src, filename) {
      const ext = path.extname(filename)
      if (RN_CSS_EXT.includes(ext)) {
        const styleTransform = getSingleStyleTransform((options as any).config)
        const code = await styleTransform.transform(src, filename, options)
        return { code }
      }
    }
  }
}
