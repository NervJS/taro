import * as fs from 'fs'
import * as path from 'path'
import { Options } from 'sass'
import { insertAfter, insertBefore, resolveStyle, getAdditionalData } from '../utils'
import { TransformOptions, RenderResult, RenderAdditionalResult } from '../types'

/**
 * 用过用户手动安装了 node-sass，启用node-sass，默认使用 sass
 */
function getSassImplementation () {
  let sassImplPkg = 'node-sass'

  try {
    require.resolve('node-sass')
  } catch (error) {
    try {
      require.resolve('sass')
      sassImplPkg = 'sass'
    } catch (ignoreError) {
      sassImplPkg = 'sass'
    }
  }

  return require(sassImplPkg)
}

const sassImplementation = getSassImplementation()

// https://github.com/sass/node-sass#options
export interface Config {
  sass?: SassGlobalConfig
  alias?: Record<string, string>
  options?: Options<'sync'>
  additionalData?: string | ((key: string) => string)
}

export interface SassGlobalConfig {
  resource?: string | string[];
  projectDirectory?: string;
  data?: string;
}

function makeURL (resource: string, rootDir: string) {
  const url = path.resolve(rootDir, resource)
  if (!fs.existsSync(url)) {
    throw new Error(`全局注入 scss 文件路径错误: ${url}`)
  }
  return url
}

function makeImportStatement (filePath: string, resource: string, rootDir: string) {
  const url = makeURL(resource, rootDir)
  const relativePath = path.relative(filePath, url).replace(/\\/g, '/') // fix window path error
  return `@import './${relativePath}'`
}

function getGlobalResource (filename: string, config: SassGlobalConfig) {
  let resource = ''
  const projectDirectory = config.projectDirectory || process.cwd()
  const filePath = path.dirname(path.resolve(projectDirectory, filename))
  if (typeof config.resource === 'string') {
    resource = makeImportStatement(filePath, config.resource, projectDirectory)
  }
  if (Array.isArray(config.resource)) {
    const resources = config.resource?.map(source => makeImportStatement(filePath, source, projectDirectory)) || []
    resource = resources.join(';\n')
  }
  // https://taro-docs.jd.com/taro/docs/config-detail/#sassdata, data 覆盖 resurce 配置
  return insertAfter(resource, config?.data)
}

function combineResource (src: string, filename: string, config: Config) {
  // sass config
  const globalResource = getGlobalResource(filename, config.sass || {})

  // sass tranform config
  const additionalData = getAdditionalData(src, config.additionalData)

  return insertAfter(globalResource, additionalData)
}

function renderToCSS (src, filename, options, transformOptions) {
  const defaultOpts = {
    importer: function (...params) { /* url, prev, done */
      let [url, prev] = params
      // url is the path in import as is, which LibSass encountered.
      // prev is the previously resolved path.
      // done is an optional callback, either consume it or return value synchronously.
      // this.options contains this options hash, this.callback contains the node-style callback
      let basedir = ''
      let defaultExt = ''
      if (path.isAbsolute(prev)) {
        ({ dir: basedir, ext: defaultExt } = path.parse(prev))
      } else {
        ({ dir: basedir, ext: defaultExt } = path.parse(path.resolve(process.cwd(), filename)))
      }

      // 外部 sass importer 配置
      if (typeof options.importer === 'function') {
        ({ file: url } = options.importer(params))
      }

      try {
        const file = resolveStyle(
          url,
          {
            basedir,
            defaultExt,
            alias: options.alias,
            platform: transformOptions.platform
          }
        )
        const contents = fs.readFileSync(file, 'utf8')
        return { file, contents }
      } catch (err) {
        return err
      }
    }
  }

  const opts = { ...options, ...defaultOpts, data: src }

  return new Promise((resolve, reject) => {
    sassImplementation.render(opts, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

export default function transform (
  src: string,
  filename: string,
  config: Config,
  transformOptions: TransformOptions
) {
  const additionalData = combineResource(src, filename, config)
  let data = insertBefore(src, additionalData)

  if (!data) {
    data = `\n${data}` // fix empty file error. reference https://github.com/sass/node-sass/blob/91c40a0bf0a3923ab9f91b82dcd479c25486235a/lib/index.js#L430
  }

  return renderToCSS(
    data,
    filename,
    {
      file: filename,
      outFile: `${filename}.map`,
      sourceMap: true, // If no outFile is set, sourceMap parameter is ignored.
      alias: config.alias,
      ...config.options
    },
    transformOptions
  ).then((result: RenderResult) => {
    return { ...result, additionalData } as RenderAdditionalResult
  })
}
