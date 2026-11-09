import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runInNewContext } from 'node:vm'

import ts from 'typescript'
import { describe, expect, test, vi } from 'vitest'
import webpack from 'webpack'

async function bundleRaf (platform: string) {
  const directory = await mkdtemp(join(tmpdir(), 'taro-raf-webpack-'))
  try {
    const source = await readFile(new URL('../../../taro-runtime/src/bom/raf.ts', import.meta.url), 'utf8')
    await writeFile(join(directory, 'raf.js'), ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.ESNext }
    }).outputText)
    const entry = join(directory, 'index.js')
    await writeFile(entry, "export { raf as requestAnimationFrame, caf as cancelAnimationFrame } from './raf.js'\n")
    const compiler = webpack({
      mode: 'none',
      target: 'node',
      entry,
      output: { path: directory, filename: 'bundle.js', library: { type: 'commonjs2' } },
      plugins: [
        new webpack.DefinePlugin({ 'process.env.TARO_PLATFORM': JSON.stringify(platform) }),
        new webpack.ProvidePlugin({
          requestAnimationFrame: [entry, 'requestAnimationFrame'],
          cancelAnimationFrame: [entry, 'cancelAnimationFrame']
        })
      ]
    })
    await new Promise<void>((resolve, reject) => {
      compiler.run((error, stats) => {
        compiler.close(closeError => {
          if (error || closeError) reject(error || closeError)
          else if (stats?.hasErrors()) reject(new Error(stats.toString('errors-only')))
          else resolve()
        })
      })
    })
    return await readFile(join(directory, 'bundle.js'), 'utf8')
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

describe('RAF with native runtime globals provided by Webpack', () => {
  test.each(['mini', 'MiniProgram', 'harmony'])('does not import its own RAF export before initialization on %s', async platform => {
    const bundle = await bundleRaf(platform)
    const module = { exports: {} as any }
    const setTimeout = vi.fn(() => 7)
    const clearTimeout = vi.fn()

    runInNewContext(bundle, { module, exports: module.exports, setTimeout, clearTimeout })

    const callback = vi.fn()
    const id = module.exports.requestAnimationFrame(callback)
    module.exports.cancelAnimationFrame(id)
    expect(setTimeout).toHaveBeenCalledOnce()
    expect(clearTimeout).toHaveBeenCalledWith(7)
    expect(bundle).not.toContain('provided dependency')
  })
})
