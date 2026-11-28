import { rollup } from 'rollup'
import { expect, test, vi } from 'vitest'

import emitPlugin from '../../src/harmony/emit'

import type { ViteHarmonyCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { Plugin } from 'rollup'

vi.mock('node:child_process', () => ({ execSync: vi.fn() }))

async function build (hook) {
  const plugins = emitPlugin({
    taroConfig: { modifyBuildAssets: hook, projectPath: '/tmp', ohpm: 'ohpm' },
    modifyHostPackage: () => ({}),
  } as unknown as ViteHarmonyCompilerContext) as Plugin[]
  return rollup({
    input: 'app.js',
    plugins: [{
      name: 'entry',
      resolveId: id => id === 'app.js' ? id : null,
      load: () => 'export default 1',
    }, plugins.find(plugin => plugin.name === 'taro:vite-harmony-emit-post')!],
  })
}

test.each([false, true])('supports asset additions and chunk updates, async=%s', async asynchronous => {
  const bundle = await build(assets => {
    const update = () => {
      assets['extra.json'] = { source: () => '{}' }
      assets['app.js'] = { source: () => 'export default 2' }
    }
    if (asynchronous) return new Promise<void>(resolve => setTimeout(() => { update(); resolve() }, 0))
    update()
  })
  try {
    const { output } = await bundle.generate({ format: 'es' })
    expect(output).toContainEqual(expect.objectContaining({ type: 'asset', fileName: 'extra.json', source: '{}' }))
    expect(output).toContainEqual(expect.objectContaining({ type: 'chunk', fileName: 'app.js', code: 'export default 2' }))
  } finally {
    await bundle.close()
  }
})

test('propagates hook rejection', async () => {
  const bundle = await build(async () => { throw new Error('transform failed') })
  try {
    await expect(bundle.generate({ format: 'es' })).rejects.toThrow('transform failed')
  } finally {
    await bundle.close()
  }
})
