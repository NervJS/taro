import helper from '@tarojs/helper'
import * as path from 'path'

interface IOptions {
  include?: string[]
  chain?: any
}

/**
 * @description 此 enhance-resolve 插件用于根据当前编译的平台，解析多端文件的后缀
 *
 * @property {string} source resolver hook 类别
 * @property {string} target 解析完成后需要触发的钩子
 * @property {IOptions} options 插件配置项
 *
 * @example
 *   there's filepath 'src/index'
 *   when platform is weapp, we get 'src/index.weapp.[js|ts|jsx|tsx]'
 *   when platform is h5, we get 'src/index.h5.[js|ts|jsx|tsx]'
 *   by default, we get 'src/index.[js|ts|jsx|tsx]'
 *
 * @class MultiPlatformPlugin
 */
export class MultiPlatformPlugin {
  private source: string
  private target: string
  private options: IOptions

  constructor (source: string, target: string, options?: IOptions) {
    this.source = source
    this.target = target
    this.options = options || {}
  }

  public apply (resolver) {
    const target = resolver.ensureHook(this.target)
    resolver
      .getHook(this.source)
      .tapAsync('MultiPlatformPlugin', (request, resolveContext, callback) => {
        const innerRequest: string = request.request || request.path
        if (!innerRequest || (Object.hasOwnProperty(request.context.issuer) && !request.context.issuer)) return callback()

        if (!path.extname(innerRequest)) {
          let srcRequest: string
          if (path.isAbsolute(innerRequest)) {
            // absolute path
            srcRequest = innerRequest
          } else if (!path.isAbsolute(innerRequest) && /^\./.test(innerRequest)) {
            // relative path
            srcRequest = path.resolve(request.path, request.request)
          } else {
            return callback()
          }

          if (/node_modules/.test(srcRequest) && !this.includes(srcRequest)) {
            return callback()
          }

          const extensions = this.options.chain?.resolve?.extensions?.values()

          const newRequestStr = helper.resolveMainFilePath(srcRequest, extensions)
          if (newRequestStr === innerRequest) return callback()
          const obj = Object.assign({}, request, {
            request: newRequestStr
          })
          return resolver.doResolve(target, obj, 'resolve multi platform file path', resolveContext, (err, result) => {
            if (err) return callback(err)

            if (result === undefined) return callback(null, null)
            return callback(null, result)
          })
        }

        callback()
      })
  }

  private includes (filePath: string): boolean {
    if (!this.options.include || !this.options.include.length) return false

    filePath = filePath.replace(path.sep, '/')

    const res = this.options.include.find(item => filePath.includes(item))
    return Boolean(res)
  }
}
