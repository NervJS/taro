import less from 'less'
import * as path from 'path'

import { LessConfig, RenderAdditionalResult, RenderResult } from '../types'
import { getAdditionalData, insertBefore } from '../utils'
import makeLessImport from '../utils/lessImport'

function renderToCSS (src, filename, options = {} as any) {
  // default plugins
  const plugins = [makeLessImport(options)]
  // default paths set current filePath
  const paths = [path.dirname(path.resolve(process.cwd(), filename))]
  return new Promise((resolve, reject) => {
    less
      .render(src, {
        ...options,
        filename,
        plugins: plugins.concat(options.plugins || []),
        paths: paths.concat(options.paths || [])
      }, (err, result) => {
        if (err) {
          return reject(err.message)
        }
        resolve(result)
      })
  })
}

export default function transform (
  src: string,
  filename: string,
  config: LessConfig
) {
  const additionalData = getAdditionalData(src, config.additionalData)
  const data = insertBefore(src, additionalData)

  return renderToCSS(
    data,
    filename,
    {
      sourceMap: {
        outputFilename: `${filename}.map`
      },
      alias: config.alias,
      ...config.options
    }
  ).then((result: RenderResult) => {
    return { ...result, additionalData } as RenderAdditionalResult
  })
}
