import * as path from 'path'
import appLoader, { getAppPages } from './app'
import pageLoader from './page'
import { TransformType, globalAny } from './types/index'
import { isPageFile, getCommonStyle } from './utils'

// eslint-disable-next-line import/no-commonjs
module.exports.transform = function ({ src, filename, options }: TransformType) {
  let code = src
  const sourceDir = options?.sourceRoot || 'src'
  const entryName = options?.entry || 'app'
  if (!(/node_modules/.test(filename)) && filename.indexOf(sourceDir) !== -1 && !filename.includes('.config')) {
    const appPath = path.join(options.projectRoot, sourceDir, entryName)
    const basePath = path.join(options.projectRoot, sourceDir)
    const pages = getAppPages(appPath)
    globalAny.__taroAppPages = pages.map(item => sourceDir + item)
    globalAny.__taroCommonStyle = getCommonStyle(appPath, basePath)
  }
  if (options.isEntryFile(filename)) {
    code = appLoader({
      filename: filename,
      projectRoot: options.projectRoot,
      sourceDir: sourceDir,
      appName: options.appName || 'taroDemo',
      entryName: entryName,
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
