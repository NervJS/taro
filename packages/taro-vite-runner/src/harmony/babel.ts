import { transformAsync } from '@babel/core'
import { SCRIPT_EXT } from '@tarojs/helper'

import type { PluginOption } from 'vite'
import type { TaroCompiler } from '../utils/compiler/harmony'

export default (compiler: TaroCompiler): PluginOption => {
  return {
    name: 'taro:vite-import-api',
    enforce: 'post',
    async transform(code, id) {
      const exts = Array.from(new Set(compiler.frameworkExts.concat(SCRIPT_EXT)))

      if (id.startsWith(compiler.sourceDir) && exts.some((ext: string) => id.includes(ext))) {
        // @TODO 后续考虑使用 SWC 插件的方式实现
        const result = await transformAsync(code, {
          filename: id,
          plugins: [
            [
              require('babel-plugin-transform-taroapi'),
              {
                packageName: '@tarojs/taro',
              },
            ],
          ],
        })
        return {
          code: result?.code || code,
          map: result?.map || null,
        }
      }
    },
  }
}
