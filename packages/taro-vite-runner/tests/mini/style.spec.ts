import { describe, expect, test, vi } from 'vitest'

import stylePlugin from '../../src/mini/style'

import type { OutputAsset, OutputBundle, OutputChunk, Plugin } from 'rollup'

const styleSource = '.ct-page{display:block}\n'

const createChunk = (fileName: string, importedCss: string[]): OutputChunk => ({
  code: '',
  dynamicImports: [],
  exports: [],
  facadeModuleId: null,
  fileName,
  implicitlyLoadedBefore: [],
  importedBindings: {},
  imports: [],
  isDynamicEntry: false,
  isEntry: true,
  isImplicitEntry: false,
  map: null,
  modules: {},
  moduleIds: [],
  name: fileName,
  preliminaryFileName: fileName,
  referencedFiles: [],
  sourcemapFileName: null,
  type: 'chunk',
  viteMetadata: {
    importedAssets: new Set(),
    importedCss: new Set(importedCss),
  },
})

const createStyleAsset = (fileName: string, source = styleSource): OutputAsset => ({
  fileName,
  name: fileName,
  needsCodeReference: false,
  source,
  type: 'asset',
})

const runPlugin = (bundle: OutputBundle, commonChunks: string[] = []): Map<string, string> => {
  const emitFile = vi.fn()
  const plugin = stylePlugin({
    commonChunks,
    fileType: { style: '.wxss' },
    sourceDir: 'src',
  } as never) as Plugin

  const generateBundle =
    typeof plugin.generateBundle === 'function' ? plugin.generateBundle : plugin.generateBundle?.handler
  if (!generateBundle) throw new Error('Expected the style plugin to define generateBundle')
  generateBundle.call({ emitFile } as never, {} as never, bundle, false)

  const styleAssets = [...Object.values(bundle), ...emitFile.mock.calls.map(([asset]) => asset)].filter(
    (asset): asset is OutputAsset => asset.type === 'asset'
  )
  return new Map(styleAssets.map((asset) => [asset.fileName, String(asset.source)]))
}

describe('mini style plugin', () => {
  test('emits a style file for every chunk that shares the same CSS asset', () => {
    const styles = runPlugin({
      'pages/index/index.js': createChunk('pages/index/index.js', ['index.css']),
      'pages/list/index.js': createChunk('pages/list/index.js', ['index.css']),
      'index.css': createStyleAsset('index.css'),
    })

    expect(styles.get('pages/index/index.wxss')).toBe(styleSource)
    expect(styles.get('pages/list/index.wxss')).toBe(styleSource)
  })

  test('keeps app styles mutable when their CSS asset is shared with a page', () => {
    const styles = runPlugin({
      'pages/index/index.js': createChunk('pages/index/index.js', ['app.css']),
      'app.js': createChunk('app.js', ['app.css']),
      'app.css': createStyleAsset('app.css'),
    })

    expect(styles.get('app-origin.wxss')).toBe(styleSource)
    expect(styles.get('app.wxss')).toBe('@import "app-origin.wxss";\n')
    expect(styles.get('pages/index/index.wxss')).toBe(styleSource)
  })

  test('adds common styles to the app style when the app has no CSS asset', () => {
    const styles = runPlugin(
      {
        'common.js': createChunk('common.js', ['common.css']),
        'common.css': createStyleAsset('common.css', '.common{display:block}\n'),
      },
      ['common']
    )

    expect(styles.get('common.wxss')).toBe('.common{display:block}\n')
    expect(styles.get('app.wxss')).toBe('@import "common.wxss";')
  })

  test('preserves app styles while importing common styles', () => {
    const styles = runPlugin(
      {
        'app.js': createChunk('app.js', ['app.css']),
        'common.js': createChunk('common.js', ['common.css']),
        'app.css': createStyleAsset('app.css'),
        'common.css': createStyleAsset('common.css', '.common{display:block}\n'),
      },
      ['common']
    )

    expect(styles.get('app-origin.wxss')).toBe(styleSource)
    expect(styles.get('app.wxss')).toBe('@import "app-origin.wxss";\n@import "common.wxss";\n')
    expect(styles.get('common.wxss')).toBe('.common{display:block}\n')
  })
})
