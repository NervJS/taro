import { transform as babelTransform, getCacheKey } from 'metro-react-native-babel-transformer'
import { merge } from 'lodash'
import * as ModuleResolution from 'metro/src/node-haste/DependencyGraph/ModuleResolution'
import { getProjectConfig, getRNConfig } from './utils'

const _babelTransform = ({ src, filename, options, plugins }) => {
  // 获取rn配置中的moodifyBabelConfig
  // 与参数plugins合并，然后传给babelTransform
  return babelTransform({ src, filename, options, plugins })
}

const getTransformer = (pkgName) => {
  // TODO: 利用缓存，参见metro对transformer的缓存处理
  return require(pkgName)
}

const transform = ({ src, filename, options, plugins }) => {
  const config = getProjectConfig()
  const rnConfig = getRNConfig()
  const entry = rnConfig?.entry || 'app'
  const rules: Record<string, any> = [
    {
      test: /\.(css|scss|sass|less|styl|stylus|pcss)/,
      transformer: '@tarojs/rn-style-transformer',
      configOpt: { config: config }
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
        designWidth: rnConfig.designWidth ? rnConfig.designWidth : config.designWidth,
        deviceRatio: rnConfig.designWidth ? rnConfig.deviceRatio : config.deviceRatio,
        nextTransformer: babelTransform,
        isEntryFile: filename_ => ModuleResolution.ModuleResolver.EMPTY_MODULE.includes(filename_)
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
  return _babelTransform({ src, filename, options, plugins })
}

export {
  transform,
  getCacheKey
}

module.exports.transform = function ({ src, filename, options }) {
  return transform({ src, filename, options, plugins: [] })
}
