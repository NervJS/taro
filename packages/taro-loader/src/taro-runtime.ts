import type * as webpack from 'webpack'

export default function (this: webpack.LoaderContext<any>, source: string) {
  const options = this.getOptions()

  const runtimePath = Array.isArray(options.runtimePath) ? options.runtimePath : [options.runtimePath]
  const setReconciler = runtimePath.reduce((res, item) => {
    return res + `import '${item}'\n`
  }, '')

  return `${setReconciler}
  ${source}`
}
