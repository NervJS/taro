import { merge } from 'lodash'
import { getCacheKey, transform as babelTransform } from 'metro-react-native-babel-transformer'
import { sep } from 'path'

import { getBabelConfig } from './babel'
import { entryFilePath } from './defaults'
import { getProjectConfig } from './utils'

const normalizeEntryFilePath = entryFilePath.replace(/\//g, sep)

const getTransformer = (pkgName) => {
  // TODO: 利用缓存，参见metro对transformer的缓存处理
  return require(pkgName)
}

const transform = async ({ src, filename, options }) => {
  const config = await getProjectConfig()
  const rnConfig = config?.rn || {}
  const entry = rnConfig?.entry || 'app'
  const isConfigFile = /\.config\.(t|j)sx?$/.test(filename)
  const { plugins } = getBabelConfig(config, isConfigFile)
  const rules: Record<string, any> = [
    {
      test: /\.(css|scss|sass|less|styl|stylus|pcss)/,
      transformer: '@tarojs/rn-style-transformer',
      configOpt: { config: config }
    },
    {
      test: /\.(svg|svgx)/, // .svg 文件仅在 enableSvgTransform 为 true 才会生效
      transformer: 'react-native-svg-transformer'
    },
    {
      // TODO:处理引用的外部资源文件
      test: /\.(png|jpg|jpeg|bmp)/,
      transformer: ''
    }, {
      test: /\.(js|ts|jsx|tsx)/,
      transformer: '@tarojs/rn-transformer',
      configOpt: {
        entry: entry,
        sourceRoot: config?.sourceRoot,
        appName: rnConfig.appName,
        designWidth: rnConfig.designWidth || config.designWidth,
        deviceRatio: rnConfig.deviceRatio || config.deviceRatio,
        nextTransformer: babelTransform,
        isEntryFile: filename_ => {
          return filename_.includes(normalizeEntryFilePath)
        },
        isConfigFile,
        plugins,
        rn: rnConfig
      }
    }
  ]
  for (let i = 0; i < rules.length; i++) {
    const match = filename.match(rules[i].test)
    if (match && match.length) {
      const mixOptions = merge({}, options, rules[i].configOpt)
      return getTransformer(rules[i].transformer).transform({ src, filename, options: mixOptions })
    }
  }
  return babelTransform({ src, filename, options })
}

export {
  getCacheKey,
  transform
}

module.exports.transform = transform