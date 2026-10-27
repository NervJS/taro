import { mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { FONT_LIMIT, IMAGE_LIMIT, MEDIA_LIMIT } from '@tarojs/runner-utils'
import { build, normalizePath } from 'vite'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import assetsPlugin from '../../src/common/vite-plugin-assets'
import { TaroCompilerContext as H5CompilerContext } from '../../src/utils/compiler/h5'
import { TaroCompilerContext as MiniCompilerContext } from '../../src/utils/compiler/mini'

import type { ViteH5BuildConfig, ViteH5CompilerContext } from '@tarojs/taro/types/compile/viteCompilerContext'
import type { PluginContext, RollupOutput } from 'rollup'
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
    root = realpathSync(mkdtempSync(path.join(tmpdir(), 'taro-asset-limit-')))
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
    return { code, emitFile, plugin, id: normalizePath(id) }
  }

  // These inputs bypass compiler defaults; undefined here is not an omitted user option.
  describe.each(assetTypes)('%s assets with direct plugin options', (extension, option) => {
    test.each([
      [true, true],
      [false, false],
      [undefined, false],
      [0, false],
      [10, false],
      [32, true],
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

    test.each([
      [true, true],
      [false, false],
      [undefined, false],
      [0, true]
    ] as const)('limit=%s handles empty assets (inline=%s)', async (limit, inline) => {
      const { code, emitFile } = await loadAsset(extension, { [option]: { limit } }, 0)
      if (inline) {
        expect(code).toMatch(/^export default "data:[^;]+;base64,"$/)
        expect(emitFile).not.toHaveBeenCalled()
      } else {
        expect(code).toBe('export default "__VITE_ASSET__test-asset__"')
        expect(emitFile).toHaveBeenCalledWith({
          type: 'asset',
          fileName: `asset.${extension}`,
          source: new Uint8Array(0)
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

          for (const [size, inline] of [[defaultLimit - 1, true], [defaultLimit, true], [defaultLimit + 1, false]] as const) {
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

  describe.each(assetTypes)('%s asset cache', (extension, option) => {
    test.each([
      [true, true], [true, false], [false, true], [false, false]
    ])('returns the same complete module for inline=%s, esModule=%s', async (inline, esModule) => {
      const { code, emitFile, plugin, id } = await loadAsset(extension, { [option]: { limit: inline, esModule } })

      for (const suffix of ['', '?first', '?second', '#fragment']) {
        expect(await plugin.load.call({ emitFile } as unknown as PluginContext, id + suffix)).toBe(code)
      }
      expect(emitFile).toHaveBeenCalledTimes(inline ? 0 : 1)
      expect(code.startsWith(esModule ? 'export default "' : 'module.exports = "')).toBe(true)
    })

    test.each([true, false])('reloads changed content after buildStart for inline=%s', async inline => {
      const { code, emitFile, plugin, id } = await loadAsset(extension, { [option]: { limit: inline } })
      const source = Buffer.alloc(32, 2)
      writeFileSync(id, source)
      emitFile.mockReturnValue('next-build-asset')
      plugin.buildStart()

      const updated = await plugin.load.call({ emitFile } as unknown as PluginContext, id + '?next')
      expect(updated).not.toBe(code)
      if (inline) {
        expect(updated).toMatch(/^export default "data:/)
        expect(updated).toContain(source.toString('base64'))
      } else {
        expect(updated).toBe('export default "__VITE_ASSET__next-build-asset__"')
      }
      expect(await plugin.load.call({ emitFile } as unknown as PluginContext, id)).toBe(updated)
      expect(emitFile).toHaveBeenCalledTimes(inline ? 0 : 2)
      if (!inline) expect(emitFile).toHaveBeenLastCalledWith(expect.objectContaining({ source: Uint8Array.from(source) }))
    })

    test.each([true, false])('builds query variants and resolves output URLs for inline=%s', async inline => {
      const id = path.join(root, `asset.${extension}`)
      const entry = path.join(root, 'entry.js')
      const source = Buffer.alloc(32, 1)
      writeFileSync(id, source)
      writeFileSync(entry, `import first from './asset.${extension}?first'; import second from './asset.${extension}?second'; export { first, second };`)
      const result = await build({
        root,
        configFile: false,
        logLevel: 'silent',
        plugins: [assetsPlugin({ sourceDir: normalizePath(root), taroConfig: { [option]: { limit: inline } } } as unknown as ViteH5CompilerContext)],
        build: { write: false, lib: { entry, formats: ['es'] } }
      }) as RollupOutput | RollupOutput[]
      const output = Array.isArray(result) ? result[0].output : result.output
      const chunk = output.find(output => output.type === 'chunk')!
      expect(chunk.type).toBe('chunk')
      if (chunk.type !== 'chunk') return
      expect(chunk.code).not.toContain('__VITE_ASSET__')
      const assets = output.filter(output => output.type === 'asset')
      if (inline) {
        expect(assets).toHaveLength(0)
        expect(chunk.code).toContain(source.toString('base64'))
      } else {
        expect(assets).toHaveLength(1)
        expect(assets[0].fileName).toBe(`asset.${extension}`)
        expect(Buffer.from(assets[0].source)).toEqual(source)
        expect(chunk.code).toContain(`asset.${extension}`)
      }
    })
  })

  test.each(['?raw', '?url'])('leaves %s requests to Vite even after caching the file', async suffix => {
    const { emitFile, plugin, id } = await loadAsset('png', { imageUrlLoaderOption: { limit: false } })
    expect(await plugin.load.call({ emitFile } as unknown as PluginContext, id + suffix)).toBeUndefined()
    expect(emitFile).toHaveBeenCalledOnce()
  })
})
