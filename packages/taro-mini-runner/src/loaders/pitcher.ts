import * as path from 'path'
import * as qs from 'querystring'

import { stringifyRequest, getOptions } from 'loader-utils'
import {
  NODE_MODULES,
  NODE_MODULES_REG
} from '@tarojs/helper'

const isPitcher = l => l.path !== __filename
const isPreLoader = l => !l.pitchExecuted
const isPostLoader = l => l.pitchExecuted

export default code => code

const genRequest = (loaderRequest, loaders) => {
  const seen = new Map()
  const loaderStrings: string[] = []
  loaders.forEach(loader => {
    const identifier = typeof loader === 'string'
      ? loader
      : (loader.path + loader.query)
    const request = typeof loader === 'string' ? loader : loader.request
    if (!seen.has(identifier)) {
      seen.set(identifier, true)
      loaderStrings.push(request)
    }
  })

  return stringifyRequest(loaderRequest, '-!' + [
    ...loaderStrings,
    loaderRequest.resourcePath + loaderRequest.resourceQuery
  ].join('!'))
}

export function pitch () {
  const { sourceDir, fileType } = getOptions(this)
  const query = qs.parse(this.resourceQuery.slice(1))

  let loaders = this.loaders
  loaders = loaders.filter(isPitcher)
  if (query.type === 'template') {
    const preLoaders = loaders.filter(isPreLoader)
    const postLoaders = loaders.filter(isPostLoader)
    let fileLoaderRequest = `${require.resolve('file-loader')}?name=[path][name]${fileType.templ}`
    if (NODE_MODULES_REG.test(this.resourcePath)) {
      const baseContext = path.join(process.cwd(), NODE_MODULES)
      fileLoaderRequest += `&context=${baseContext}&outputPath=npm`
    } else {
      fileLoaderRequest += `&context=${sourceDir}`
    }
    const request = genRequest(this, [
      ...postLoaders,
      fileLoaderRequest,
      require.resolve('./miniTemplateLoader'),
      ...preLoaders
    ])
    return `export * from ${request}`
  }
  const request = genRequest(this, loaders)
  return `import mod from ${request}; export default mod; export * from ${request}`
}
