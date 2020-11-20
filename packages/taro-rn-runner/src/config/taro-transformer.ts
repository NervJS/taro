import { transform as babelTransform, getCacheKey } from 'metro-react-native-babel-transformer'
import { getConfig, getRNConfig, getRNConfigEntry } from './config-holder'
import { merge } from 'lodash'
import * as ModuleResolution from 'metro/src/node-haste/DependencyGraph/ModuleResolution'

const _babelTransform = ({ src, filename, options, plugins }) => {
  // 获取rn配置中的moodifyBabelConfig
  // 与参数plugins合并，然后传给babelTransform
  return babelTransform({ src, filename, options, plugins })
}

const getTransformer = (pkgName) => {
  // TODO: 利用缓存，参见metro对transformer的缓存处理
  return require(pkgName)
}

const transform = ({ src, filename, options }) => {
  const config = getConfig()
  const rnConfig = getRNConfig()
  const entry = getRNConfigEntry()
  // const output = getRNConfigOutput(options.platform);
  // const transformer = getRNConfigTransformer();
  // const babelPlugin = getRNConfigBabelPlugin();
  const rules = [
    {
      test: /\.(css|scss|sass|less|styl|stylus|pcss)/,
      transformer: '@tarojs/rn-style-transformer',
      configOpt: { config: config }
    },
    {
      test: /\.(js|ts|jsx|tsx)/,
      transformer: '@tarojs/rn-transformer',
      configOpt: {
        entry: entry,
        sourceDir: rnConfig.sourceDir,
        appName: rnConfig.appName,
        designWidth: rnConfig.designWidth ? rnConfig.designWidth : config.designWidth,
        deviceRatio: rnConfig.designWidth ? rnConfig.deviceRatio : config.deviceRatio,
        nextTransformer: babelTransform,
        isEntryFile: filename_ => ModuleResolution.ModuleResolver.EMPTY_MODULE.includes(filename_)
      }
    },
    {
      // TODO:处理引用的外部资源文件
      test: /\.(png|jpg|jpeg|bmp)/,
      transformer: ''
    }
  ]
  for (let i = 0; i < rules.length; i++) {
    const match = filename.match(rules[i].test)
    if (match && match.length) {
      const mixOptions = merge({}, options, rules[i].configOpt)
      return getTransformer(rules[i].transformer).transform({ src, filename, options: mixOptions })
    }
  }
  return _babelTransform({ src, filename, options, plugins: [] })

  // 根据匹配规则使用不用的transformer，并从rn配置中中读取transformer的配置
  // transformer对象需要缓存？

  // 动态添加transformer
}

export {
  transform,
  getCacheKey
}
