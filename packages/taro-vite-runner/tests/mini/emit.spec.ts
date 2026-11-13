import { rollup } from 'rollup'
import { expect, test } from 'vitest'

import emitPlugin from '../../src/mini/emit'

import type { ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { Plugin } from 'rollup'

test('emits new assets added by modifyBuildAssets', async () => {
  const fileName = '.browserslistrc'
  const source = 'defaults and fully supports es6-module'
  const plugins = emitPlugin({
    taroConfig: {
      modifyBuildAssets (assets) {
        assets[fileName] = { source: () => source }
      }
    }
  } as unknown as ViteMiniCompilerContext) as Plugin[]

  const entry = '\0app'
  const bundle = await rollup({
    input: entry,
    plugins: [
      {
        name: 'test-entry',
        resolveId: id => id === entry ? entry : null,
        load: id => id === entry ? 'export default 1' : null,
      },
      plugins.find(plugin => plugin.name === 'taro:vite-mini-emit-post'),
    ],
  })

  try {
    const { output } = await bundle.generate({ format: 'es' })

    expect(output).toContainEqual(expect.objectContaining({
      fileName,
      source,
      type: 'asset',
    }))
  } finally {
    await bundle.close()
  }
})
