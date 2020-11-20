import appLoader from './app'
import pageLoader from './page'
import { TransformType } from './types/index'
import { isPageFile } from './utils'

// eslint-disable-next-line import/no-commonjs
module.exports.transform = function ({ src, filename, options }: TransformType) {
  let code = src
  const sourceDir = options?.sourceRoot || 'src'
  if (options.isEntryFile(filename)) {
    code = appLoader({
      filename: filename,
      projectRoot: options.projectRoot,
      sourceDir: sourceDir,
      appName: options.appName || 'taroDemo',
      entryName: options?.entry || 'app',
      designWidth: options?.designWidth || 750,
      deviceRatio: options?.deviceRatio || {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
      }
    })
  } else if (isPageFile(filename, sourceDir)) {
    code = pageLoader({
      projectRoot: options.projectRoot,
      sourceCode: src,
      sourceDir: sourceDir,
      filename
    })
  }
  return options.nextTransformer({
    src: code,
    filename: filename,
    options: options
  })
}
