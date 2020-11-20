import fs from 'fs'
import path from 'path'
import appRoot from 'app-root-path'
import sass, { Options } from 'node-sass'
import { insertBefore, findVariant } from '../utils'

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
  const filePath = path.dirname(path.join(projectDirectory, filename))
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
  const ext = path.extname(filename)
  const exts = [
    // add the platform specific extension, first in the array to take precedence
    transformOptions.platform === 'android' ? '.android' + ext : '.ios' + ext,
    '.native' + ext,
    '.rn' + ext,
    ext
  ]

  const defaultOpts = {
    includePaths: [path.dirname(filename), appRoot],
    importer: function (url /*, prev, done */) {
      // url is the path in import as is, which LibSass encountered.
      // prev is the previously resolved path.
      // done is an optional callback, either consume it or return value synchronously.
      // this.options contains this options hash, this.callback contains the node-style callback

      const urlPath = path.parse(url)
      const separator = process.platform === 'win32' ? ';' : ':'
      const incPaths = this.options.includePaths.split(separator)

      if (urlPath.dir.length > 0) {
        incPaths.unshift(path.resolve(path.dirname(filename), urlPath.dir)) // add the file's dir to the search array
      }
      const f = findVariant(urlPath.name, exts, incPaths)

      if (f) {
        return { file: f }
      } else {
        return new Error(`
        样式文件没有找到，请检查路径: ${url}
        在 [
          ${incPaths.join(',\n       ')}
        ]
 `)
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
