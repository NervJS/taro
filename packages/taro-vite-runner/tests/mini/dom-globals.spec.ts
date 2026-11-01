import { mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import vm from 'node:vm'

import { build } from 'vite'
import { expect, test } from 'vitest'

import miniConfig from '../../src/mini/config'

import type { ViteMiniCompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { RollupOutput } from 'rollup'
import type { Plugin, UserConfig } from 'vite'

test('mini builds provide document constructors without native DOM globals', async () => {
  const root = realpathSync(mkdtempSync(path.join(tmpdir(), 'taro-dom-globals-')))
  try {
    const entry = path.join(root, 'entry.js')
    writeFileSync(entry, `
      import { document } from '@tarojs/runtime'
      export function probe(connected) {
        const parent = document.createElement('view')
        const input = document.createElement('input')
        parent.appendChild(input)
        if (connected) document.body.appendChild(parent)
        const root = input.getRootNode()
        const result = [root instanceof Document, root instanceof ShadowRoot, root === document]
        parent.remove()
        return result
      }
    `)
    const plugin = miniConfig({
      cwd: root,
      sourceDir: root,
      taroConfig: {
        framework: 'vue3',
        template: { isSupportRecursive: true },
        entry: { app: entry },
        output: { chunkFileNames: '[name].js' },
        fileType: { script: '.js' },
        postcss: { pxtransform: { config: {} } }
      }
    } as unknown as ViteMiniCompilerContext) as Plugin
    const config = await (plugin.config as () => Promise<UserConfig>)()
    const result = await build({
      configFile: false,
      root,
      logLevel: 'silent',
      define: { ...config.define, 'process.env.TARO_PLATFORM': JSON.stringify('mini') },
      resolve: {
        alias: { '@tarojs/runtime': path.resolve(__dirname, '../../../taro-runtime/src/index.ts') }
      },
      build: {
        write: false,
        minify: false,
        lib: { entry, formats: ['cjs'] },
        rollupOptions: { plugins: [config.build!.rollupOptions!.plugins![0]] }
      }
    }) as RollupOutput | RollupOutput[]
    const output = Array.isArray(result) ? result[0] : result
    const chunk = output.output.find(output => output.type === 'chunk')!
    const sandbox = { exports: {}, console } as Record<string, any>
    sandbox.global = sandbox
    vm.runInNewContext(chunk.code, sandbox)
    expect(Array.from(sandbox.exports.probe(true))).toEqual([true, false, true])
    expect(Array.from(sandbox.exports.probe(false))).toEqual([false, false, false])
    expect(sandbox.Document).toBeUndefined()
    expect(sandbox.ShadowRoot).toBeUndefined()
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
