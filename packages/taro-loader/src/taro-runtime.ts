import * as webpack from 'webpack'
import { getOptions } from 'loader-utils'

export default function (this: webpack.loader.LoaderContext, source: string) {
  const options = getOptions(this)

  const runtimePath = Array.isArray(options.runtimePath) ? options.runtimePath : [options.runtimePath]
  const setReconciler = runtimePath.reduce((res, item) => {
    return res + `import '${item}'\n`
  }, '')

  return `${setReconciler}
  ${source}`
}
