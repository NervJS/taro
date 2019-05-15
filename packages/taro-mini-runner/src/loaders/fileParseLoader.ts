import { getOptions } from 'loader-utils'
import { transform } from 'babel-core'

export default function fileParseLoader (source, ast) {
  const options = getOptions(this)
  const babelConfig = options.babel
  const res = transform(source, babelConfig)
  return res.code
}
