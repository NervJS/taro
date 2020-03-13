import { NODE_MODULES_REG } from '../utils/constants'
import { npmCodeHack } from '../utils'
import { transform } from 'babel-core'
import { getOptions } from 'loader-utils'

export default function fileParseLoader (source) {
  const {babel: babelConfig, buildAdapter} = getOptions(this)
  const filePath = this.resourcePath
  const res = transform(source, babelConfig) // use config babelConfig
  if (NODE_MODULES_REG.test(filePath) && res.code) {
    res.code = npmCodeHack(filePath, res.code, buildAdapter)
  }
  return res.code
}
