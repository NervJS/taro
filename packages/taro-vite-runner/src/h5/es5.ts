import { babel } from '@rollup/plugin-babel'
import { babelKit } from '@tarojs/helper'
import { InputPluginOption } from 'rollup'

import { getBabelOption } from '../utils'

import type{ ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginOption } from 'vite'

export default function (viteCompilerContext: ViteH5CompilerContext): PluginOption {
  const { taroConfig } = viteCompilerContext
  const { parse, generate, traverse } = babelKit
  return {
    name: 'taro:vite-h5-es5',
    // 如果要把代码编译成 es5，那么 rollup 就要使用 babel 插件
    config: async () => ({
      build: {
        rollupOptions: {
          plugins: [babel(getBabelOption(taroConfig)) as InputPluginOption]
        }
      }
    }),
    // vite 自动注入的代码 含有 const 关键字，需要在最后再用 babel 转一次
    renderChunk (code) {
      const ast = parse(code, {
        sourceType: 'module',
        plugins: []
      })
      traverse(ast, {
        VariableDeclaration(path) {
          const { node } = path
          if (node.kind === 'const') {
            node.kind = 'var'
          }
        }
      })
      return generate(ast)
    }
  }
}
