import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { FONT_LIMIT, IMAGE_LIMIT, MEDIA_LIMIT } from '@tarojs/runner-utils'
import { normalizePath } from 'vite'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import assetsPlugin from '../../src/common/vite-plugin-assets'
import { TaroCompilerContext as H5CompilerContext } from '../../src/utils/compiler/h5'
import { TaroCompilerContext as MiniCompilerContext } from '../../src/utils/compiler/mini'

import type { ViteH5BuildConfig, ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginContext } from 'rollup'
import type { ResolvedConfig } from 'vite'

// The runner is compiled to CommonJS; mirror its default-import interop in Vitest's ESM loader.
vi.mock('mrmime', async () => ({ default: await vi.importActual('mrmime') }))

const assetTypes = [
  ['png', 'imageUrlLoaderOption', IMAGE_LIMIT],
  ['woff', 'fontUrlLoaderOption', FONT_LIMIT],
  ['mp4', 'mediaUrlLoaderOption', MEDIA_LIMIT]
] as const

describe('asset inline limits', () => {
  let root: string

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'taro-asset-limit-'))
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  async function loadAsset (extension: string, taroConfig: Partial<ViteH5BuildConfig>, size = 32) {
    const id = path.join(root, `asset.${extension}`)
    writeFileSync(id, Buffer.alloc(size, 1))
    const plugin = assetsPlugin({
      sourceDir: normalizePath(root),
      taroConfig
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

  // These inputs bypass compiler defaults; undefined here is not an omitted user option.
  describe.each(assetTypes)('%s assets with direct plugin options', (extension, option) => {
    test.each([
      [true, true],
      [false, false],
      [undefined, false],
      [0, false],
      [10, false],
      [32, false],
      [33, true]
    ] as const)('limit=%s respects the byte threshold (inline=%s)', async (limit, inline) => {
      const { code, emitFile } = await loadAsset(extension, { [option]: { limit } })
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

  describe.each([
    ['h5', H5CompilerContext],
    ['mini', MiniCompilerContext]
  ] as const)('%s compiler defaults', (_platform, CompilerContext) => {
    describe.each(assetTypes)('%s assets', (extension, option, defaultLimit) => {
      test.each(['omitted options', 'empty options', 'name only'] as const)(
        '%s preserves the default byte threshold', async configShape => {
          const name = () => `custom-asset.${extension}`
          const rawTaroConfig = configShape === 'omitted options'
            ? {}
            : { [option]: configShape === 'empty options' ? {} : { name } }
          // Run real config normalization without initializing app/page discovery.
          const context = Object.assign(Object.create(CompilerContext.prototype), { rawTaroConfig }) as H5CompilerContext | MiniCompilerContext
          context.processConfig()

          expect(context.taroConfig[option]?.limit).toBe(defaultLimit)

          for (const [size, inline] of [[defaultLimit - 1, true], [defaultLimit, false], [defaultLimit + 1, false]] as const) {
            const { code, emitFile } = await loadAsset(extension, context.taroConfig, size)
            if (inline) {
              expect(code).toMatch(/^export default "data:/)
              expect(code).toContain(Buffer.alloc(size, 1).toString('base64'))
              expect(emitFile).not.toHaveBeenCalled()
            } else {
              expect(code).toBe('export default "__VITE_ASSET__test-asset__"')
              expect(emitFile).toHaveBeenCalledOnce()
              expect(emitFile).toHaveBeenCalledWith(expect.objectContaining({
                type: 'asset',
                source: Uint8Array.from(Buffer.alloc(size, 1))
              }))
              if (configShape === 'name only') {
                expect(emitFile).toHaveBeenCalledWith(expect.objectContaining({ fileName: name() }))
              }
            }
          }
        }
      )
    })
  })

  test.each([true, false])('preserves CommonJS output for inline=%s', async inline => {
    const { code } = await loadAsset('png', { imageUrlLoaderOption: { limit: inline ? 33 : 10, esModule: false } })
    expect(code.startsWith('module.exports = "')).toBe(true)
    expect(code.includes('data:')).toBe(inline)
  })
})
