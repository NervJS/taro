import fs from 'fs'
import path from 'path'
import sass, { Options } from 'node-sass' // TODO: dart-sass 支持
import { insertBefore, resolveStyle } from '../utils'

// https://github.com/sass/node-sass#options
export interface Config {
  options?: Options;
  additionalData?: string | Function;
}

export interface SassExternalConfig {
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
  return `@import '${relativePath}'`
}

/**
 * 处理 additional 配置，比如 config.sass 配置
 * @param src
 * @param filename
 * @returns
 */
export function processByExternal (src, filename, config: SassExternalConfig) {
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
  const combineSource = insertBefore(config?.data, resource)
  return insertBefore(src, combineSource)
}

function renderToCSS (src, filename, options, transformOptions) {
  const defaultOpts = {
    importer: function (url, prev /*, done */) {
      // url is the path in import as is, which LibSass encountered.
      // prev is the previously resolved path.
      // done is an optional callback, either consume it or return value synchronously.
      // this.options contains this options hash, this.callback contains the node-style callback
      let basedir = ''
      if (path.isAbsolute(prev)) {
        basedir = path.dirname(prev)
      } else {
        basedir = path.dirname(path.resolve(process.cwd(), filename))
      }
      try {
        const file = resolveStyle(
          url,
          {
            basedir,
            platforms: transformOptions.platform
          })
        return { file: file }
      } catch (err) {
        return err
      }
    }
  }

  const opts = { ...defaultOpts, ...options, data: src }

  return new Promise((resolve, reject) => {
    sass.render(opts, (err, result) => {
      if (err) {
        reject(err)
      } else {
        const css = result.css.toString()
        resolve(css)
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
  let data = src

  if (!data) {
    data = `\n${data}` // fix empty file error. reference https://github.com/sass/node-sass/blob/91c40a0bf0a3923ab9f91b82dcd479c25486235a/lib/index.js#L430
  }

  if (typeof config.additionalData !== 'undefined') {
    data =
      typeof config.additionalData === 'function'
        ? `${config.additionalData(data)}`
        : `${config.additionalData}\n${data}`
  }

  return renderToCSS(data, filename, config.options, transformOptions)
    .then((css: string) => {
      return css
    })
}
