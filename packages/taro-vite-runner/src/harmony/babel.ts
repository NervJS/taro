import { transformAsync } from '@babel/core'
import { SCRIPT_EXT } from '@tarojs/helper'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default (viteCompilerContext: ViteHarmonyCompilerContext): PluginOption => {
  return {
    name: 'taro:vite-import-api',
    enforce: 'post',
    async transform(code, id) {
      const exts = Array.from(new Set(viteCompilerContext.frameworkExts.concat(SCRIPT_EXT)))

      if (id.startsWith(viteCompilerContext.sourceDir) && exts.some((ext: string) => id.includes(ext))) {
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
