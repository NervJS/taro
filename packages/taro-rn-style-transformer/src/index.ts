import path from 'path'
// import semver from 'semver'
// import reactNativePKG from 'react-native/package.json'
import StyleTransform from './transforms'

const RN_CSS_EXT = ['.css', '.scss', '.sass', '.less', '.styl', '.stylus']

// 目前仅支持React-Native 0.60+
// const reactNativeVersionString = reactNativePKG.version
// const reactNativeMinorVersion = semver.minor(reactNativeVersionString)

let upstreamTransformer = null
// if (reactNativeMinorVersion >= 59) {
upstreamTransformer = require('metro-react-native-babel-transformer')
// } else if (reactNativeMinorVersion >= 56) {
//   upstreamTransformer = require('metro/src/reactNativeTransformer')
// } else if (reactNativeMinorVersion >= 52) {
//   upstreamTransformer = require('metro/src/transformer')
// } else if (reactNativeMinorVersion >= 47) {
//   upstreamTransformer = require('metro-bundler/src/transformer')
// } else if (reactNativeMinorVersion === 46) {
//   upstreamTransformer = require('metro-bundler/build/transformer')
// } else {
//   // handle RN <= 0.45
//   const oldUpstreamTransformer = require('react-native/packager/transformer')
//   upstreamTransformer = {
//     transform ({ src, filename, options }) {
//       return oldUpstreamTransformer.transform(src, filename, options)
//     }
//   }
// }

const getSingleStyleTransform = styleTransformIns()

function styleTransformIns () {
  let styleTransform = null
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
