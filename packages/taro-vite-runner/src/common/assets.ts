import { fs, REG_FONT, REG_IMAGE, REG_MEDIA, } from '@tarojs/helper'
import { isBoolean, isFunction, isString } from '@tarojs/shared'
import mrmime from 'mrmime'

import { isVirtualModule } from '../utils'

import type { IUrlLoaderOption } from '@tarojs/taro/types/compile'
import type { ViteH5CompilerContext, ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption, ResolvedConfig } from 'vite'

const rawRE = /(?:\?|&)raw(?:&|$)/
const urlRE = /(\?|&)url(?:&|$)/
const queryRE = /\?.*$/s
const hashRE = /#.*$/s

const cleanUrl = (url: string): string =>
  url.replace(hashRE, '').replace(queryRE, '')

export default function (viteCompilerContext: ViteH5CompilerContext | ViteMiniCompilerContext): PluginOption {
  const { taroConfig, sourceDir } = viteCompilerContext
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

      const cache = assetsCache.get(resolvedConfig)
      const cachedValue = cache?.get(id)
      if (isString(cachedValue)) {
        return cachedValue
      }

      const source = await fs.readFile(id)

      const {
        imageUrlLoaderOption = {},
        fontUrlLoaderOption = {},
        mediaUrlLoaderOption = {}
      } = taroConfig

      let limit: number | boolean

      let options: IUrlLoaderOption = {}

      if (REG_IMAGE.test(id)) {
        options = imageUrlLoaderOption
        limit = options.limit as number | boolean
      } else if (REG_FONT.test(id)) {
        options = fontUrlLoaderOption
        limit = options.limit as number | boolean
      } else if (REG_MEDIA.test(id)) {
        options = mediaUrlLoaderOption
        limit = options.limit as number | boolean
      } else {
        return
      }
      const isEsModule = isBoolean(options.esModule) ? options.esModule : true

      let url: string
      if (limit || (!isBoolean(limit) && source.length < limit)) {
        const mimeType = mrmime.lookup(id) ?? 'application/octet-stream'
        url = `data:${mimeType};base64,${source.toString('base64')}`
      } else {
        let fileName = id.replace(sourceDir + '/', '')
        isFunction(options.name) && (fileName = options.name(id))
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
