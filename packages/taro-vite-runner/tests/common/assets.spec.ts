import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { normalizePath } from 'vite'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import assetsPlugin from '../../src/common/vite-plugin-assets'

import type { ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginContext } from 'rollup'
import type { ResolvedConfig } from 'vite'

// The runner is compiled to CommonJS; mirror its default-import interop in Vitest's ESM loader.
vi.mock('mrmime', async () => ({ default: await vi.importActual('mrmime') }))

const assetTypes = [
  ['png', 'imageUrlLoaderOption'],
  ['woff', 'fontUrlLoaderOption'],
  ['mp4', 'mediaUrlLoaderOption']
] as const

describe('asset inline limits', () => {
  let root: string

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'taro-asset-limit-'))
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  async function loadAsset (extension: string, option: string, limit: number | boolean | undefined, esModule = true) {
    const id = path.join(root, `asset.${extension}`)
    writeFileSync(id, Buffer.alloc(32, 1))
    const plugin = assetsPlugin({
      sourceDir: normalizePath(root),
      taroConfig: { [option]: { limit, esModule } }
    } as unknown as ViteH5CompilerContext) as unknown as {
      configResolved(config: ResolvedConfig): void
      buildStart(): void
      load(this: PluginContext, id: string): Promise<string>
    }
    plugin.configResolved({ assetsInclude: () => true } as unknown as ResolvedConfig)
    plugin.buildStart()
    const emitFile = vi.fn(() => 'test-asset')
    // Vite passes normalized IDs to plugin hooks on every platform.
    const code = await plugin.load.call({ emitFile } as unknown as PluginContext, normalizePath(id))
    return { code, emitFile }
  }

  describe.each(assetTypes)('%s assets', (extension, option) => {
    test.each([
      [true, true],
      [false, false],
      [undefined, false],
      [0, false],
      [10, false],
      [32, false],
      [33, true]
    ] as const)('limit=%s respects the byte threshold (inline=%s)', async (limit, inline) => {
      const { code, emitFile } = await loadAsset(extension, option, limit)
      if (inline) {
        expect(code).toMatch(/^export default "data:/)
        expect(code).toContain(Buffer.alloc(32, 1).toString('base64'))
        expect(emitFile).not.toHaveBeenCalled()
      } else {
        expect(code).toBe('export default "__VITE_ASSET__test-asset__"')
        expect(emitFile).toHaveBeenCalledWith({
          type: 'asset',
          fileName: `asset.${extension}`,
          source: Uint8Array.from(Buffer.alloc(32, 1))
        })
      }
    })
  })

  test.each([true, false])('preserves CommonJS output for inline=%s', async inline => {
    const { code } = await loadAsset('png', 'imageUrlLoaderOption', inline ? 33 : 10, false)
    expect(code.startsWith('module.exports = "')).toBe(true)
    expect(code.includes('data:')).toBe(inline)
  })
})
