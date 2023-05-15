import { fs, recursiveMerge, REG_FONT, REG_IMAGE, REG_MEDIA, } from '@tarojs/helper'
import { isBoolean,isFunction, isString } from '@tarojs/shared'
import mrmime from 'mrmime'

import { getMiniCompiler,isVirtualModule } from '../utils'

import type { IOption, PostcssOption } from '@tarojs/taro/types/compile'
import type { PluginOption, ResolvedConfig } from 'vite'
import type { MiniBuildConfig } from '../utils/types'

type PostcssURLConfig = Partial<PostcssOption.url['config']>

const rawRE = /(?:\?|&)raw(?:&|$)/
const urlRE = /(\?|&)url(?:&|$)/
const queryRE = /\?.*$/s
const hashRE = /#.*$/s

const cleanUrl = (url: string): string =>
  url.replace(hashRE, '').replace(queryRE, '')

export default function (taroConfig: MiniBuildConfig): PluginOption {
  let resolvedConfig: ResolvedConfig
  const assetsCache: WeakMap<ResolvedConfig, Map<string, string>> = new WeakMap()
  return {
    name: 'taro:vite-assets',
    enforce: 'pre',
    configResolved (config) {
      resolvedConfig = config
    },
    buildStart () {
      assetsCache.set(resolvedConfig, new Map())
    },
    async load (id) {
      if (isVirtualModule(id)) return
      if (rawRE.test(id) || urlRE.test(id)) return

      id = cleanUrl(id)
      if (!resolvedConfig.assetsInclude(id)) return


      const compiler = getMiniCompiler(this)
      if (!compiler) return

      const cache = assetsCache.get(resolvedConfig)
      const cachedValue = cache?.get(id)
      if (isString(cachedValue)) {
        return cachedValue
      }

      const source = await fs.readFile(id)

      const defaultUrlOption: PostcssOption.url = {
        enable: true,
        config: {
          limit: 10 * 1024 // limit 10k base on document
        }
      }
      const {
        postcss: postcssOption = {},
        imageUrlLoaderOption,
        fontUrlLoaderOption,
        mediaUrlLoaderOption
      } = taroConfig
      const urlOptions: PostcssOption.url = recursiveMerge({}, defaultUrlOption, postcssOption.url)
      const postcssUrlOption: PostcssURLConfig = urlOptions.enable
        ? urlOptions.config
        : {}


      let limit: number
      const options: PostcssURLConfig & IOption = {}

      if (REG_IMAGE.test(id)) {
        Object.assign(options, postcssUrlOption, imageUrlLoaderOption)
        limit = options.limit || 2 * 1024
      } else if (REG_FONT.test(id)) {
        Object.assign(options, postcssUrlOption, fontUrlLoaderOption)
        limit = options.limit || 10 * 1024
      } else if (REG_MEDIA.test(id)) {
        Object.assign(options, postcssUrlOption, mediaUrlLoaderOption)
        limit = options.limit || 10 * 1024
      } else {
        return
      }
      const isEsModule = isBoolean(options.esModule) ? options.esModule : true

      let url: string
      if (source.length < limit) {
        const mimeType = mrmime.lookup(id) ?? 'application/octet-stream'
        url = `data:${mimeType};base64,${source.toString('base64')}`
      } else {
        let fileName = id.replace(compiler.sourceDir + '/', '')
        isFunction(options.name) && (fileName = options.name(fileName))

        const referenceId = this.emitFile({
          type: 'asset',
          fileName,
          source
        })

        url = `__VITE_ASSET__${referenceId}__`
      }

      cache?.set(id, url)

      return isEsModule
        ? `export default "${url}"`
        : `module.exports = "${url}"`
    },
  }
}
