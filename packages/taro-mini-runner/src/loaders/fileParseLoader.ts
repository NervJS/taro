import { getOptions } from 'loader-utils'
import { transform, transformFromAst } from 'babel-core'

const cannotRemoves = ['@tarojs/taro', 'react', 'nervjs']

export default function fileParseLoader (source, ast) {
  const { babel: babelConfig, constantsReplaceList } = getOptions(this)
  const newBabelConfig = Object.assign({}, babelConfig)
  newBabelConfig.plugins = [
    [require('babel-plugin-danger-remove-unused-import'), { ignore: cannotRemoves }],
    [require('babel-plugin-transform-define').default, constantsReplaceList]
  ].concat(newBabelConfig.plugins)
  const res = transformFromAst(ast, '', newBabelConfig)
  return res.code
}
