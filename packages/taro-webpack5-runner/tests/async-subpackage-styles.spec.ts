import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { describe, expect, test } from 'vitest'

import AsyncSubPackagePlugin from '../src/plugins/AsyncSubPackagePlugin'
import SubPackageIndiePlugin from '../src/plugins/SubPackageIndiePlugin'

import type { SubPackageIndieConfig } from '../src/plugins/SubPackageIndiePlugin'

const runnerRequire = createRequire(path.resolve(__dirname, '../package.json'))
const webpack = runnerRequire('webpack')
const MiniCssExtractPlugin = runnerRequire('mini-css-extract-plugin')
const postcss = runnerRequire('postcss')
const { SyncHook } = runnerRequire('tapable')
const testsRequire = createRequire(path.resolve(__dirname, '../../../tests/package.json'))
const { createFsFromVolume, Volume } = testsRequire('memfs')

const fixtureDir = path.resolve(__dirname, 'fixtures/async-subpackage-styles')
let injectedTemplateName = ''
const sameGroup: SubPackageIndieConfig[] = [{
  mainPackageRoot: 'pages/index/index',
  subPackageRoots: ['pages/list/index', 'pages/detail/index'],
}]

const temporaryFixture = {
  'pages/list/index.js': 'import "./private.css"; import { load, loadExtra } from "../../components/LazyDemo"; load(); loadExtra();',
  'pages/detail/index.js': 'import "./private.css"; import { load, loadExtra } from "../../components/LazyDemo"; load(); loadExtra();',
  'pages/list/private.css': '.list-private { color: purple; }',
  'pages/detail/private.css': '.detail-private { color: orange; }',
  'components/LazyDemo/index.js': 'export const load = () => import("./Demo"); export const loadExtra = () => import("./Extra");',
  'components/LazyDemo/Demo.js': 'import "./Demo.css"; export default "demo";',
  'components/LazyDemo/Demo.css': '.demo { color: red; font-size: 20px; }',
  'components/LazyDemo/Extra.js': 'import "./Extra.css"; export default "extra";',
  'components/LazyDemo/Extra.css': '.extra { color: green; }',
}

const resourceStyle = `@import "../../../assets/theme.wxss?theme=1#palette" screen;
@import url("../../../assets/url-theme.wxss?theme=2#layer");
@import "https://cdn.styles.test/theme.wxss?theme=3#external";
.demo {
  color: red;
  background-image: url("../../../assets/icon.svg?size=2#glyph");
  mask-image: url("/fixed.svg?size=3#shape");
  border-image-source: url("https://cdn.styles.test/image.svg?size=4#tile");
  cursor: url("//cdn.styles.test/cursor.svg?size=5#cursor");
  --inline-image: url("data:image/svg+xml;base64,PHN2Zy8+");
  --uppercase-scheme: url("HTTPS://cdn.styles.test/upper.svg?size=6#upper");
  --uppercase-data: url("DATA:image/svg+xml;base64,PHN2Zy8+");
}`
const resourceFixture = {
  ...temporaryFixture,
  'components/LazyDemo/Demo.js': 'import "./Demo.css"; import "../../assets/icon.svg"; import "../../assets/theme.wxss"; import "../../assets/url-theme.wxss"; export default "demo";',
  'components/LazyDemo/Demo.css': resourceStyle,
  'assets/icon.svg': '<svg id="original-icon" />',
  'assets/theme.wxss': '.theme { color: cyan; }',
  'assets/url-theme.wxss': '.url-theme { color: yellow; }',
}

const crossGroups: SubPackageIndieConfig[] = [{
  mainPackageRoot: 'pages/a/index',
  subPackageRoots: ['pages/list/index'],
}, {
  mainPackageRoot: 'pages/b/index',
  subPackageRoots: ['pages/detail/index'],
}]

type CompileOptions = {
  entry?: Record<string, string>
  subPackageIndie?: SubPackageIndieConfig[]
  initialAssets?: Record<string, string>
  mode?: 'development' | 'production'
  fixtureDir?: string
  asyncRootMap?: Map<string, string>
  cssLoaderOptions?: { url?: boolean, import?: boolean }
  onBeforeStyleMove?: (compilation: any) => void
  injectTemplate?: boolean
}

type CompileResult = {
  assets: Record<string, string>
  warnings: string[]
}

async function withFixture<T> (files: Record<string, string>, run: (directory: string) => Promise<T>): Promise<T> {
  const directory = await mkdtemp(path.join(tmpdir(), 'taro-async-subpackage-styles-'))
  try {
    const fixtureRoot = await realpath(directory)
    for (const [name, content] of Object.entries(files)) {
      const filePath = path.join(fixtureRoot, name)
      await mkdir(path.dirname(filePath), { recursive: true })
      await writeFile(filePath, content)
    }
    return await run(fixtureRoot)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

function createCompiler (options: CompileOptions = {}) {
  const context = options.fixtureDir || fixtureDir
  const entry = options.entry || {
    'pages/detail/index': 'pages/detail/index.js',
    'pages/list/index': 'pages/list/index.js',
  }
  const compiler = webpack({
    context,
    mode: options.mode || 'development',
    target: 'web',
    cache: false,
    devtool: false,
    entry: Object.fromEntries(Object.entries(entry).map(([name, request]) => [name, path.resolve(context, request)])),
    output: {
      path: path.join(context, 'output'),
      filename: '[name].js',
      chunkFilename: '[name].js',
    },
    optimization: {
      minimize: false,
      splitChunks: {
        cacheGroups: {
          common: {
            chunks: 'initial',
            minChunks: 2,
            name: 'common',
            enforce: true,
          },
        },
      },
    },
    module: {
      rules: [{
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, {
          loader: runnerRequire.resolve('css-loader'),
          options: options.cssLoaderOptions || {},
        }],
      }, {
        test: /\.(svg|wxss)$/,
        type: 'asset/resource',
        generator: { filename: '[path][name][ext]' },
      }],
    },
    plugins: [new MiniCssExtractPlugin({ filename: '[name].wxss' })],
  })
  compiler.outputFileSystem = createFsFromVolume(new Volume())
  if (options.injectTemplate) {
    compiler.hooks.compilation.tap('InjectAsyncTemplate', (compilation: any) => {
      compilation.hooks.processAssets.tap({ name: 'InjectAsyncTemplate', stage: 0 }, () => {
        const chunk = Array.from(compilation.chunks).find((item: any) =>
          item.name?.startsWith('async/detail/') && item.name !== 'async/detail/index'
        )
        if (!chunk) return
        injectedTemplateName = `${chunk.name}-templates.wxml`
        compilation.assets[injectedTemplateName] = new compilation.compiler.webpack.sources.RawSource('<view class="demo" />')
      })
    })
  }

  const miniPlugin: any = {
    options: {
      sourceDir: context,
      newBlended: !!options.subPackageIndie,
      fileType: { style: '.wxss', templ: '.wxml', config: '.json' },
    },
    appConfig: { pages: Object.keys(entry), subPackageIndie: options.subPackageIndie },
    hooks: { afterGenerateFiles: new SyncHook(['compilation']) },
  }
  if (options.subPackageIndie) {
    miniPlugin.subPackageIndiePlugin = new SubPackageIndiePlugin(miniPlugin)
  }

  compiler.hooks.thisCompilation.tap('AsyncSubPackageStyleFixture', compilation => {
    compilation.hooks.processAssets.tap({
      name: 'AsyncSubPackageStyleFixture',
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER - 1,
    }, () => {
      for (const [name, content] of Object.entries(options.initialAssets || {})) {
        const existing = compilation.getAsset(name)
        const source = new webpack.sources.RawSource([existing?.source.source().toString(), content].filter(Boolean).join('\n'))
        if (existing) compilation.updateAsset(name, source)
        else compilation.emitAsset(name, source)
      }
      options.onBeforeStyleMove?.(compilation)
    })
  })
  new AsyncSubPackagePlugin(miniPlugin, options.asyncRootMap || new Map([
    ['pages/detail', 'async/detail'],
    ['pages/list', 'async/detail'],
  ])).apply(compiler)
  return compiler
}

function readCompilation (compiler: any, stats: any): CompileResult {
  if (stats.hasErrors()) throw new Error(stats.toString({ all: false, errors: true }))
  const assets: Record<string, string> = {}
  for (const asset of stats.compilation.getAssets()) {
    assets[asset.name] = compiler.outputFileSystem.readFileSync(
      path.join(compiler.options.output.path, asset.name), 'utf-8'
    )
  }
  return { assets, warnings: stats.compilation.warnings.map(warning => warning.message || String(warning)) }
}

function importedStyleAssets (assets: Record<string, string>, assetName: string): string[] {
  const imports: string[] = []
  postcss.parse(assets[assetName] || '').walkAtRules('import', rule => {
    const request = rule.params.match(/^(?:url\(\s*)?["']([^"']+)["']/)?.[1]
    if (!request) throw new Error(`Unexpected fixture import: ${rule.params}`)
    imports.push(new URL(request, `https://styles.test/${assetName}`).pathname.slice(1))
  })
  return imports
}

async function compile (options: CompileOptions = {}): Promise<CompileResult> {
  const compiler = createCompiler(options)
  try {
    return await new Promise((resolve, reject) => {
      compiler.run((error, stats) => {
        if (error) return reject(error)
        try {
          resolve(readCompilation(compiler, stats))
        } catch (error) {
          reject(error)
        }
      })
    })
  } finally {
    await new Promise<void>((resolve, reject) => compiler.close(error => error ? reject(error) : resolve()))
  }
}

function watchCompiler (options: CompileOptions) {
  const compiler = createCompiler(options)
  const builds: Array<CompileResult | Error> = []
  const pending: Array<(build: CompileResult | Error) => void> = []
  const watcher = compiler.watch({ aggregateTimeout: 20 }, (error, stats) => {
    let build: CompileResult | Error
    try {
      build = error || readCompilation(compiler, stats)
    } catch (error) {
      build = error as Error
    }
    const consume = pending.shift()
    if (consume) consume(build)
    else builds.push(build)
  })

  return {
    nextBuild: (): Promise<CompileResult> => new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const index = pending.indexOf(consume)
        if (index !== -1) pending.splice(index, 1)
        reject(new Error('Timed out waiting for compiler.watch'))
      }, 10000)
      function consume (build: CompileResult | Error) {
        clearTimeout(timeout)
        if (build instanceof Error) reject(build)
        else resolve(build)
      }
      if (builds.length) consume(builds.shift()!)
      else pending.push(consume)
    }),
    close: async () => {
      for (const consume of pending.splice(0)) consume(new Error('compiler.watch closed'))
      try {
        await new Promise<void>((resolve, reject) => watcher.close(error => error ? reject(error) : resolve()))
      } finally {
        await new Promise<void>((resolve, reject) => compiler.close(error => error ? reject(error) : resolve()))
      }
    },
  }
}

function ruleDeclarations (css: string, selector: string, property: string): string[] {
  const values: string[] = []
  postcss.parse(css).walkRules(selector, rule => rule.walkDecls(property, declaration => {
    values.push(declaration.value)
  }))
  return values
}

function compileResourceFixture (): Promise<CompileResult> {
  return withFixture(resourceFixture, directory => compile({
    fixtureDir: directory,
    cssLoaderOptions: { url: false, import: false },
    subPackageIndie: [{
      mainPackageRoot: 'pages/deep/group/home/index',
      subPackageRoots: ['pages/list/index', 'pages/detail/index'],
    }],
    asyncRootMap: new Map([
      ['pages/list', 'async/nested/detail'],
      ['pages/detail', 'async/nested/detail'],
    ]),
    initialAssets: {
      'pages/deep/group/home/common.wxss': '.common { background: url("./keep.svg?original=1#local"); }',
      'pages/deep/group/home/keep.svg': '<svg id="existing-icon" />',
    },
  }))
}

describe('async subpackage styles from a shared module', () => {
  test('moves the async style into every page that can reach the dynamic import', async () => {
    const { assets, warnings } = await compile()
    const asyncStyles = Object.keys(assets).filter(name => name.startsWith('async/detail/') && name.endsWith('.wxss'))

    expect(assets['pages/detail/index.wxss']).toContain('.demo')
    expect(assets['pages/list/index.wxss']).toContain('.demo')
    expect(asyncStyles).toEqual([])
    expect(warnings).toEqual([])
  }, 30000)

  test('hoists a style shared by two sourceRoots into their existing group common', async () => {
    const { assets, warnings } = await compile({
      subPackageIndie: sameGroup,
      initialAssets: {
        'pages/index/index.wxss': '@import "./app.wxss";',
        'pages/index/app.wxss': '@import "./common.wxss"; .app { color: black; }',
        'pages/index/common.wxss': '.common { color: green; }',
      },
    })

    expect(assets['pages/index/common.wxss']).toContain('.common')
    expect(assets['pages/index/common.wxss'].match(/\.demo/g)).toHaveLength(1)
    expect(assets['pages/list/index.wxss'] || '').not.toContain('.demo')
    expect(assets['pages/detail/index.wxss'] || '').not.toContain('.demo')
    expect(Object.keys(assets).filter(name => name.startsWith('async/detail/') && name.endsWith('.wxss'))).toEqual([])
    expect(warnings).toEqual([])
  }, 30000)

  test('creates a missing app style to connect the group entry to the new common', async () => {
    const entryStyle = '@import "./app.wxss"; .entry { color: black; }'
    const { assets, warnings } = await compile({
      subPackageIndie: sameGroup,
      initialAssets: { 'pages/index/index.wxss': entryStyle },
    })

    expect(assets['pages/index/index.wxss']).toBe(entryStyle)
    expect(importedStyleAssets(assets, 'pages/index/index.wxss')).toEqual(['pages/index/app.wxss'])
    expect(importedStyleAssets(assets, 'pages/index/app.wxss')).toEqual(['pages/index/common.wxss'])
    expect(assets['pages/index/common.wxss']).toContain('.demo')
    expect(warnings).toEqual([])
  }, 30000)

  test('preserves existing app content and imports when connecting a missing common', async () => {
    const appStyle = '@import "./other.wxss"; .app { color: black; }'
    const { assets } = await compile({
      subPackageIndie: sameGroup,
      initialAssets: {
        'pages/index/index.wxss': '@import "./app.wxss";',
        'pages/index/app.wxss': appStyle,
        'pages/index/other.wxss': '.other { color: green; }',
      },
    })

    expect(assets['pages/index/app.wxss']).toContain(appStyle)
    expect(importedStyleAssets(assets, 'pages/index/app.wxss').sort()).toEqual([
      'pages/index/common.wxss', 'pages/index/other.wxss',
    ])
    expect(assets['pages/index/common.wxss'].match(/\.demo/g)).toHaveLength(1)
  }, 30000)

  test.each([
    { name: 'charset', prefix: '@charset "UTF-8";\n', expectedAtRules: ['charset', 'import', 'import'] },
    { name: 'BOM', prefix: '\uFEFF', expectedAtRules: ['import', 'import'] },
    { name: 'BOM and charset', prefix: '\uFEFF@charset "UTF-8";\r\n', expectedAtRules: ['charset', 'import', 'import'] },
  ])('keeps the leading $name before a newly connected common import', async ({ prefix, expectedAtRules }) => {
    const appContent = '@import "./other.wxss"; .app { color: black; }'
    const { assets, warnings } = await compile({
      subPackageIndie: sameGroup,
      initialAssets: {
        'pages/index/index.wxss': '@import "./app.wxss";',
        'pages/index/app.wxss': `${prefix}${appContent}`,
        'pages/index/other.wxss': '.other { color: green; }',
      },
    })
    const app = assets['pages/index/app.wxss']
    expect(app.slice(0, prefix.length)).toBe(prefix)
    expect(app).toContain(appContent)

    const atRules: string[] = []
    postcss.parse(app).walkAtRules(rule => {
      atRules.push(rule.name)
    })
    expect(atRules).toEqual(expectedAtRules)
    expect(importedStyleAssets(assets, 'pages/index/app.wxss')).toEqual([
      'pages/index/common.wxss', 'pages/index/other.wxss',
    ])
    expect(assets['pages/index/common.wxss'].match(/\.demo/g)).toHaveLength(1)
    expect(warnings).toEqual([])
  }, 30000)

  test.each(['"common.wxss"', '"./common.wxss"', 'url("./nested/../common.wxss")'])(
    'does not duplicate an equivalent existing common import: %s', async importRequest => {
      const appStyle = `@import ${importRequest}; .app { color: black; }`
      const { assets } = await compile({
        subPackageIndie: sameGroup,
        initialAssets: {
          'pages/index/app.wxss': appStyle,
          'pages/index/common.wxss': '.common { color: green; }',
        },
      })

      expect(assets['pages/index/app.wxss']).toBe(appStyle)
      expect(importedStyleAssets(assets, 'pages/index/app.wxss')).toEqual(['pages/index/common.wxss'])
      expect(assets['pages/index/common.wxss'].match(/\.demo/g)).toHaveLength(1)
    }, 30000
  )

  test('keeps a deep group entry import connected through app to common', async () => {
    const entryStyle = '@import "../app.wxss"; .entry { color: black; }'
    const { assets } = await compile({
      subPackageIndie: [{
        mainPackageRoot: 'pages/deep/group/home/index',
        subPackageRoots: ['pages/list/index', 'pages/detail/index'],
      }],
      initialAssets: {
        'pages/deep/group/home/index/index.wxss': entryStyle,
        'pages/deep/group/home/app.wxss': '.app { color: black; }',
      },
    })

    expect(assets['pages/deep/group/home/index/index.wxss']).toBe(entryStyle)
    expect(importedStyleAssets(assets, 'pages/deep/group/home/index/index.wxss')).toEqual(['pages/deep/group/home/app.wxss'])
    expect(importedStyleAssets(assets, 'pages/deep/group/home/app.wxss')).toEqual(['pages/deep/group/home/common.wxss'])
    expect(assets['pages/deep/group/home/common.wxss'].match(/\.demo/g)).toHaveLength(1)
  }, 30000)

  test('rebases only promoted relative URLs to the original emitted resources', async () => {
    const { assets, warnings } = await compileResourceFixture()
    const commonAsset = 'pages/deep/group/home/common.wxss'
    const common = assets[commonAsset]
    const request = common.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/)?.[1]
    expect(request).toBeDefined()
    const resolved = new URL(request!, `https://styles.test/${commonAsset}`)

    expect(resolved.pathname).toBe('/assets/icon.svg')
    expect(resolved.search).toBe('?size=2')
    expect(resolved.hash).toBe('#glyph')
    expect(assets['assets/icon.svg']).toBe('<svg id="original-icon" />')
    expect(common).toContain('.common { background: url("./keep.svg?original=1#local"); }')
    expect(common).toContain('url("/fixed.svg?size=3#shape")')
    expect(common).toContain('url("https://cdn.styles.test/image.svg?size=4#tile")')
    expect(common).toContain('url("//cdn.styles.test/cursor.svg?size=5#cursor")')
    expect(common).toContain('url("data:image/svg+xml;base64,PHN2Zy8+")')
    expect(common).toContain('url("HTTPS://cdn.styles.test/upper.svg?size=6#upper")')
    expect(common).toContain('url("DATA:image/svg+xml;base64,PHN2Zy8+")')
    expect(warnings).toEqual([])
  }, 30000)

  test('rebases retained relative imports without changing their query, hash or media', async () => {
    const { assets } = await compileResourceFixture()
    const common = assets['pages/deep/group/home/common.wxss']

    expect(importedStyleAssets(assets, 'pages/deep/group/home/common.wxss').slice(0, 2)).toEqual([
      'assets/theme.wxss', 'assets/url-theme.wxss',
    ])
    expect(common).toContain('assets/theme.wxss?theme=1#palette" screen')
    expect(common).toContain('assets/url-theme.wxss?theme=2#layer")')
    expect(common).toContain('@import "https://cdn.styles.test/theme.wxss?theme=3#external";')
    expect(assets['assets/theme.wxss']).toBe('.theme { color: cyan; }')
    expect(assets['assets/url-theme.wxss']).toBe('.url-theme { color: yellow; }')
  }, 30000)

  test('keeps one copy per group and warns once for two async styles with the same group set', async () => {
    let asyncStyles: string[] = []
    const { assets, warnings } = await withFixture(temporaryFixture, directory => compile({
      fixtureDir: directory,
      subPackageIndie: crossGroups,
      initialAssets: {
        'pages/a/index.wxss': '@import "./app.wxss";',
        'pages/b/index.wxss': '@import "./app.wxss";',
      },
      onBeforeStyleMove: compilation => {
        asyncStyles = Object.keys(compilation.assets).filter(name => name.startsWith('async/detail/') && name.endsWith('.wxss'))
      },
    }))

    expect(asyncStyles).toHaveLength(2)
    expect(assets['pages/a/common.wxss'].match(/\.demo/g)).toHaveLength(1)
    expect(assets['pages/b/common.wxss'].match(/\.demo/g)).toHaveLength(1)
    expect(assets['pages/a/common.wxss'].match(/\.extra/g)).toHaveLength(1)
    expect(assets['pages/b/common.wxss'].match(/\.extra/g)).toHaveLength(1)
    expect(importedStyleAssets(assets, 'pages/a/app.wxss')).toEqual(['pages/a/common.wxss'])
    expect(importedStyleAssets(assets, 'pages/b/app.wxss')).toEqual(['pages/b/common.wxss'])
    expect(assets['pages/list/index.wxss']).not.toContain('.demo')
    expect(assets['pages/detail/index.wxss']).not.toContain('.demo')
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain('async/detail')
    expect(warnings[0]).toContain('pages/a')
    expect(warnings[0]).toContain('pages/b')
  }, 30000)

  test('keeps single-entry async styles private even when two roots are configured', async () => {
    const { assets, warnings } = await withFixture(temporaryFixture, directory => compile({
      fixtureDir: directory,
      subPackageIndie: sameGroup,
      entry: { 'pages/list/index': 'pages/list/index.js' },
    }))

    expect(assets['pages/list/index.wxss'].match(/\.demo/g)).toHaveLength(1)
    expect(assets['pages/list/index.wxss']).toContain('.extra')
    expect(assets['pages/list/index.wxss']).toContain('.list-private')
    expect(assets['pages/detail/index.wxss']).toBeUndefined()
    expect(assets['pages/index/common.wxss']).toBeUndefined()
    expect(assets['pages/index/app.wxss']).toBeUndefined()
    expect(warnings).toEqual([])
  }, 30000)

  test('leaves initial private styles in their sourceRoots while hoisting shared async styles', async () => {
    const { assets, warnings } = await withFixture(temporaryFixture, directory => compile({
      fixtureDir: directory,
      subPackageIndie: sameGroup,
    }))

    expect(assets['pages/list/index.wxss']).toContain('.list-private')
    expect(assets['pages/detail/index.wxss']).toContain('.detail-private')
    expect(assets['pages/list/index.wxss']).not.toContain('.demo')
    expect(assets['pages/detail/index.wxss']).not.toContain('.demo')
    expect(assets['pages/index/common.wxss']).not.toContain('.list-private')
    expect(assets['pages/index/common.wxss']).not.toContain('.detail-private')
    expect(assets['pages/index/common.wxss'].match(/\.demo/g)).toHaveLength(1)
    expect(warnings).toEqual([])
  }, 30000)

  test('falls back only for an unknown consumer without inventing another group', async () => {
    const { assets, warnings } = await withFixture(temporaryFixture, directory => compile({
      fixtureDir: directory,
      subPackageIndie: [{ mainPackageRoot: 'pages/index/index', subPackageRoots: ['pages/list/index'] }],
    }))

    expect(assets['pages/index/common.wxss'].match(/\.demo/g)).toHaveLength(1)
    expect(assets['pages/list/index.wxss']).not.toContain('.demo')
    expect(assets['pages/detail/index.wxss'].match(/\.demo/g)).toHaveLength(1)
    expect(assets['pages/detail/index.wxss']).toContain('.detail-private')
    expect(assets['pages/detail/common.wxss']).toBeUndefined()
    expect(warnings).toEqual([])
  }, 30000)

  test('keeps the original fallback when no consumer belongs to a configured group', async () => {
    const { assets, warnings } = await compile({
      subPackageIndie: [{ mainPackageRoot: 'pages/unrelated/index', subPackageRoots: [] }],
    })

    expect(assets['pages/list/index.wxss']).toContain('.demo')
    expect(assets['pages/detail/index.wxss']).toContain('.demo')
    expect(assets['pages/unrelated/common.wxss']).toBeUndefined()
    expect(assets['pages/unrelated/app.wxss']).toBeUndefined()
    expect(warnings).toEqual([])
  }, 30000)

  test('preserves unpromoted CSS URLs and imports in ordinary mode', async () => {
    const { assets, warnings } = await withFixture(resourceFixture, directory => compile({
      fixtureDir: directory,
      cssLoaderOptions: { url: false, import: false },
      asyncRootMap: new Map([
        ['pages/list', 'async/nested/detail'],
        ['pages/detail', 'async/nested/detail'],
      ]),
    }))

    expect(assets['pages/list/index.wxss']).toContain(resourceStyle)
    expect(assets['pages/detail/index.wxss']).toContain(resourceStyle)
    expect(warnings).toEqual([])
  }, 30000)

  test('deduplicates shared async styles in a production group', async () => {
    let asyncStyleCount = 0
    const { assets, warnings } = await withFixture(temporaryFixture, directory => compile({
      fixtureDir: directory,
      subPackageIndie: sameGroup,
      mode: 'production',
      onBeforeStyleMove: compilation => {
        asyncStyleCount = Object.keys(compilation.assets).filter(name => name.startsWith('async/detail/') && name.endsWith('.wxss')).length
      },
      initialAssets: {
        'pages/index/app.wxss': '@import "common.wxss"; .app { color: black; }',
        'pages/index/common.wxss': '.common { color: green; }',
      },
    }))

    expect(asyncStyleCount).toBe(2)
    expect(assets['pages/index/common.wxss'].match(/\.demo/g)).toHaveLength(1)
    expect(assets['pages/index/common.wxss'].match(/\.extra/g)).toHaveLength(1)
    expect(assets['pages/index/common.wxss']).toContain('.common')
    expect(assets['pages/list/index.wxss']).not.toContain('.demo')
    expect(assets['pages/detail/index.wxss']).not.toContain('.demo')
    expect(importedStyleAssets(assets, 'pages/index/app.wxss')).toEqual(['pages/index/common.wxss'])
    expect(warnings).toEqual([])
  }, 30000)

  test.each([
    { label: 'same group', config: sameGroup, mainRoots: ['pages/index'], warningCount: 0 },
    { label: 'cross groups', config: crossGroups, mainRoots: ['pages/a', 'pages/b'], warningCount: 1 },
  ])('refreshes styles, imports and per-round warnings with real watch: $label', async ({ config, mainRoots, warningCount }) => {
    await withFixture(temporaryFixture, async directory => {
      const asyncStyleCounts: number[] = []
      const watched = watchCompiler({
        fixtureDir: directory,
        subPackageIndie: config,
        initialAssets: Object.fromEntries(mainRoots.flatMap(root => [
          [`${root}/index.wxss`, '@import "./app.wxss";'],
          [`${root}/app.wxss`, '.app { color: black; }'],
          [`${root}/common.wxss`, '.common { font-size: 12px; }'],
        ])),
        onBeforeStyleMove: compilation => {
          asyncStyleCounts.push(Object.keys(compilation.assets).filter(name => name.startsWith('async/detail/') && name.endsWith('.wxss')).length)
        },
      })
      try {
        const previousColors: string[] = []
        for (const color of ['red', 'blue', 'purple']) {
          if (previousColors.length) {
            await writeFile(path.join(directory, 'components/LazyDemo/Demo.css'), `.demo { color: ${color}; font-size: 20px; }`)
          }
          const { assets, warnings } = await watched.nextBuild()
          for (const root of mainRoots) {
            const common = assets[`${root}/common.wxss`]
            expect(common.match(/\.demo/g)).toHaveLength(1)
            expect(common.match(/\.extra/g)).toHaveLength(1)
            expect(ruleDeclarations(common, '.demo', 'color')).toEqual([color])
            for (const previousColor of previousColors) expect(common).not.toMatch(new RegExp(`color:\\s*${previousColor}\\b`))
            expect(importedStyleAssets(assets, `${root}/app.wxss`)).toEqual([`${root}/common.wxss`])
            expect(assets[`${root}/app.wxss`]).toContain('.app { color: black; }')
          }
          expect(assets['pages/list/index.wxss']).not.toContain('.demo')
          expect(assets['pages/detail/index.wxss']).not.toContain('.demo')
          expect(warnings).toHaveLength(warningCount)
          if (warningCount) {
            expect(warnings[0]).toContain('async/detail')
            for (const root of mainRoots) expect(warnings[0]).toContain(root)
          }
          previousColors.push(color)
        }
        expect(asyncStyleCounts).toEqual([2, 2, 2])
      } finally {
        await watched.close()
      }
    })
  }, 30000)
})

describe('async subpackage legacy template relocation', () => {
  test('keeps a shared async template under the asyncRoot when multiple pages consume it', async () => {
    const { assets } = await compile({ injectTemplate: true })
    expect(injectedTemplateName).toMatch(/^async\/detail\/async-.+-templates\.wxml$/)
    expect(assets[injectedTemplateName]).toBeTruthy()

    const copiedTemplates = Object.keys(assets).filter(name =>
      (name.startsWith('pages/detail/') || name.startsWith('pages/list/')) && name.endsWith('-templates.wxml')
    )
    expect(copiedTemplates).toEqual([])
  }, 30000)

  test('moves a single-consumer async template back to its sourceRoot', () => {
    const plugin = new AsyncSubPackagePlugin({
      options: { fileType: { templ: '.wxml' } },
    } as any, new Map([['pages/detail', 'async/detail']]))
    ;(plugin as any).asyncChunkSourceRoots.set('async/detail/async-demo', new Set(['pages/detail']))
    ;(plugin as any).asyncChunkConsumers.set('async/detail/async-demo', ['pages/detail/index'])
    const assets: Record<string, any> = {
      'async/detail/async-demo-templates.wxml': { source: () => '<view />' },
    }
    ;(plugin as any).moveAsyncRootTemplatesToConsumers({ assets })
    expect(assets['pages/detail/async-demo-templates.wxml']).toBeTruthy()
    expect(assets['async/detail/async-demo-templates.wxml']).toBeUndefined()
  })
})
