import { transform as babelTransform, getCacheKey } from 'metro-react-native-babel-transformer'
import { merge } from 'lodash'
import { getProjectConfig } from './utils'

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
