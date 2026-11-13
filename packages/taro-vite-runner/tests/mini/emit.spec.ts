import { rollup } from 'rollup'
import { expect, test } from 'vitest'

import emitPlugin from '../../src/mini/emit'

import type { ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { Plugin } from 'rollup'

function buildWithAssetHook (modifyBuildAssets: (assets: Record<string, { source: () => string }>) => void | Promise<void>) {
  const plugins = emitPlugin({
    taroConfig: { modifyBuildAssets }
  } as unknown as ViteMiniCompilerContext) as Plugin[]

  const entry = 'app.js'
  return rollup({
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
}

test.each([false, true])('applies synchronous additions and asynchronous updates (async: %s)', async asynchronous => {
  const fileName = '.browserslistrc'
  const source = 'defaults and fully supports es6-module'
  const bundle = await buildWithAssetHook(assets => {
    const addAsset = () => { assets[fileName] = { source: () => source } }
    if (asynchronous) {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          assets['app.js'] = { source: () => 'export default 2' }
          resolve()
        }, 0)
      })
    }
    addAsset()
  })

  try {
    const { output } = await bundle.generate({ format: 'es' })

    expect(output).toContainEqual(asynchronous
      ? expect.objectContaining({ fileName: 'app.js', code: 'export default 2', type: 'chunk' })
      : expect.objectContaining({ fileName, source, type: 'asset' }))
  } finally {
    await bundle.close()
  }
})

test('propagates a rejected modifyBuildAssets promise', async () => {
  const error = new Error('asset transformation failed')
  const hook = Promise.reject(error)
  hook.catch(() => {})
  const bundle = await buildWithAssetHook(() => hook)

  try {
    await expect(bundle.generate({ format: 'es' })).rejects.toThrow('asset transformation failed')
  } finally {
    await bundle.close()
  }
})
