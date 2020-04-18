import { getTransformResult } from '../utils/codeTransform'

export default function tsTransformerLoader (source) {
  // const {buildAdapter} = getOptions(this)
  const filePath = this.resourcePath
  try {
    // @ts-ignore
    const {code, ast} = getTransformResult({
      code: source,
      sourcePath: filePath
    })
    this.callback(null, code, ast)
    return code
  } catch (error) {
    this.emitError(error)
    this.callback(null, source, null)
    return source
  }
}
