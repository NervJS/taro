import os from 'node:os'
import path from 'node:path'

import helper, { fs } from '@tarojs/helper'
import * as runnerUtils from '@tarojs/runner-utils'
import { afterEach, describe, expect, it } from 'vitest'

import ReactLikePlugin from '../../taro-framework-react/dist/index.js'
import Vue3Plugin from '../../taro-framework-vue3/dist/index.js'
import { TT } from '../../taro-platform-tt/dist/index.js'
import { Weapp } from '../../taro-platform-weapp/dist/index.js'
import buildH5 from '../dist/index.h5'
import buildMini from '../dist/index.mini'
import { H5BaseConfig, H5RspackModule } from '../dist/rspack/h5'
import { MiniBaseConfig, MiniRspackModule, MiniRspackPlugin } from '../dist/rspack/mini'
import { componentConfig } from '../dist/utils/context'

const REPO_ROOT = path.resolve(__dirname, '../../..')
const FIXTURES_DIR = path.resolve(REPO_ROOT, 'tests/__tests__/fixtures')
const MOCKS_DIR = path.resolve(REPO_ROOT, 'tests/__tests__/mocks')

const tempDirs: string[] = []

function makeTempOutDir (prefix: string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `taro-rspack-${prefix}-`))
  tempDirs.push(dir)
  return dir
}

afterEach(() => {
  while (tempDirs.length) {
    const dir = tempDirs.pop()!
    fs.removeSync(dir)
  }
})

function applyFrameworkPatch (chain: any, rspackInstance: any, config: any) {
  const mockCtx: any = {
    initialConfig: {
      framework: config.framework || 'react',
      h5: config.h5 || {},
      mini: { debugReact: true },
    },
    runOpts: { options: {} },
    modifyWebpackChain: (cb: any) => cb({ chain, webpack: rspackInstance, data: { componentConfig } }),
    modifyViteConfig: () => {},
    modifyRunnerOpts: (cb: any) => cb({ opts: config }),
    onParseCreateElement: (cb: any) => {
      const prev = config.onParseCreateElement
      config.onParseCreateElement = (nodeName: string, compCfg: any) => {
        prev?.(nodeName, compCfg)
        cb({ nodeName, componentConfig: compCfg })
      }
    },
    applyPlugins: () => null,
    runnerUtils,
  }

  if (config.framework === 'vue3') {
    Vue3Plugin(mockCtx)
  } else {
    ReactLikePlugin(mockCtx)
  }
}

async function compileFixture (
  fixtureName: string,
  options: Record<string, any> = {}
) {
  const platformType = options.platformType || 'web'
  const buildAdapter = options.buildAdapter || (platformType === 'web' ? 'h5' : 'weapp')
  process.env.TARO_PLATFORM = platformType
  process.env.TARO_ENV = buildAdapter
  process.env.NODE_ENV = 'test'

  const appPath = path.isAbsolute(fixtureName) ? fixtureName : path.resolve(FIXTURES_DIR, fixtureName)
  const outputRoot = makeTempOutDir(path.basename(fixtureName))
  const sourceRoot = options.sourceRoot || 'src'
  const entryFilePath = platformType === 'web'
    ? path.join(appPath, sourceRoot, 'app.config')
    : helper.resolveMainFilePath(path.join(appPath, sourceRoot, 'app'))

  const prevCwd = process.cwd()
  process.chdir(appPath)

  try {
    const userWebpackChain = options.webpackChain
    let platformProgram: any
    if (platformType === 'mini') {
      platformProgram = buildAdapter === 'tt'
        ? new TT({ helper } as any, {})
        : new Weapp({ helper } as any, {})
      platformProgram.modifyTemplate?.({})
    }

    const config: any = {
      sourceRoot,
      outputRoot,
      designWidth: 750,
      deviceRatio: { 640: 1.17, 750: 1, 828: 0.905 },
      defineConstants: {},
      env: {
        FRAMEWORK: JSON.stringify(options.framework || 'react'),
        TARO_ENV: JSON.stringify(buildAdapter),
        TARO_PLATFORM: JSON.stringify(platformType),
      },
      compiler: {
        type: 'rspack',
      },
      buildAdapter,
      platformType,
      enableSourceMap: false,
      entry: {
        app: [entryFilePath]
      },
      framework: options.framework || 'react',
      isWatch: false,
      mode: options.mode || 'production',
      logger: { quiet: true },
      ...(platformProgram ? {
        globalObject: platformProgram.globalObject,
        fileType: platformProgram.fileType,
        template: platformProgram.template,
        runtimePath: platformProgram.runtimePath,
      } : {}),
      ...options,
    }

    config.webpackChain = (chain: any, rspackInstance: any, metaType: any) => {
      applyFrameworkPatch(chain, rspackInstance, config)

      const alias = chain.resolve.alias
      alias.set('@tarojs/components$', path.resolve(MOCKS_DIR, 'taro-components'))
      alias.set('@tarojs/plugin-framework-react/dist/runtime', path.resolve(MOCKS_DIR, 'taro'))
      alias.set('@tarojs/plugin-framework-vue3/dist/runtime', path.resolve(MOCKS_DIR, 'taro'))
      alias.set('@tarojs/runtime', path.resolve(MOCKS_DIR, 'taro-runtime'))
      alias.set('@tarojs/shared', path.resolve(MOCKS_DIR, 'taro-shared'))
      alias.set('@tarojs/taro', path.resolve(MOCKS_DIR, 'taro'))
      alias.set('react$', path.resolve(MOCKS_DIR, 'react'))
      alias.set('react/jsx-runtime', path.resolve(MOCKS_DIR, 'react'))
      alias.set('vue', path.resolve(MOCKS_DIR, 'vue'))

      if (platformType === 'web') {
        alias.set('@tarojs/router', path.resolve(MOCKS_DIR, 'taro-router'))
        alias.set('@tarojs/components/lib/react', path.resolve(MOCKS_DIR, 'taro-components'))
        alias.set('@tarojs/components/lib/vue3', path.resolve(MOCKS_DIR, 'taro-components'))
        alias.set('@tarojs/components/loader', path.resolve(MOCKS_DIR, 'taro-components'))
        alias.set('@tarojs/components/global.css', path.resolve(MOCKS_DIR, 'taro-components.css'))
        alias.set('@tarojs/components/dist/taro-components/taro-components.css', path.resolve(MOCKS_DIR, 'taro-components.css'))
        alias.set('react-dom$', path.resolve(MOCKS_DIR, 'react'))
        alias.set('react-dom/client$', path.resolve(MOCKS_DIR, 'react'))

        chain.plugin('mainPlugin').tap((args: any) => {
          args[0].loaderMeta ||= {}
          args[0].loaderMeta.extraImportForWeb ||= ''
          args[0].loaderMeta.execBeforeCreateWebApp ||= ''
          return args
        })
      } else {
        alias.set('@tarojs/plugin-platform-weapp/dist/runtime', path.resolve(MOCKS_DIR, 'taro'))
        alias.set('@tarojs/plugin-platform-tt/dist/runtime', path.resolve(MOCKS_DIR, 'taro'))
        alias.set('@tarojs/react', path.resolve(MOCKS_DIR, 'taro-react'))
        alias.set('regenerator-runtime', path.resolve(MOCKS_DIR, 'deps'))
      }

      if (typeof userWebpackChain === 'function') {
        userWebpackChain(chain, rspackInstance, metaType)
      }
    }

    const runner = platformType === 'web' ? buildH5 : buildMini
    const stats = await runner(appPath, config)
    return { stats, outputRoot, config }
  } finally {
    process.chdir(prevCwd)
  }
}

describe('@tarojs/rspack-runner end-to-end', () => {
  it('builds H5 React app with HTML, CSS extraction, and JS bundle', async () => {
    const { stats, outputRoot } = await compileFixture('react', {
      platformType: 'web',
    })

    expect(stats?.hasErrors()).toBe(false)
    expect(fs.existsSync(path.join(outputRoot, 'index.html'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'js/app.js'))).toBe(true)

    const html = fs.readFileSync(path.join(outputRoot, 'index.html'), 'utf-8')
    expect(html).toContain('js/app.js')
    expect(html).toContain('fontSize')
  })

  it('builds Weapp MiniProgram with app.json, base.wxml, comp, pages, and runtime requires', async () => {
    const { stats, outputRoot } = await compileFixture('react', {
      platformType: 'mini',
      buildAdapter: 'weapp',
    })

    expect(stats?.hasErrors()).toBe(false)
    expect(fs.existsSync(path.join(outputRoot, 'app.js'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'app.json'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'base.wxml'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'comp.js'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'comp.json'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'comp.wxml'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'utils.wxs'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'pages/index/index.js'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'pages/index/index.json'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'pages/index/index.wxml'))).toBe(true)

    const appJs = fs.readFileSync(path.join(outputRoot, 'app.js'), 'utf-8')
    expect(appJs).toContain('require("./runtime")')
  })

  it('builds ByteDance (TT) MiniProgram with recursive templates and .ttml/.ttss assets', async () => {
    const { stats, outputRoot } = await compileFixture('react', {
      platformType: 'mini',
      buildAdapter: 'tt',
    })

    expect(stats?.hasErrors()).toBe(false)
    expect(fs.existsSync(path.join(outputRoot, 'app.js'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'app.json'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'base.ttml'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'pages/index/index.ttml'))).toBe(true)
  })

  it('handles subpackages and addChunkPages in MiniProgram', async () => {
    const { stats, outputRoot } = await compileFixture('subpackages', {
      platformType: 'mini',
      webpackChain (chain: any) {
        const sc = chain.optimization.get('splitChunks')
        chain.optimization.splitChunks({
          ...sc,
          cacheGroups: {
            ...sc.cacheGroups,
            subutils: {
              name: 'sub-utils',
              minChunks: 2,
              test: (module: any) => /[\\/]packageA[\\/]/.test(module.resource || ''),
              priority: 20000
            }
          }
        })
      },
      addChunkPages (pages: Map<string, string[]>) {
        pages.set('packageA/detail/index', ['sub-utils'])
        pages.set('packageA/my/index', ['sub-utils'])
      }
    })

    expect(stats?.hasErrors()).toBe(false)
    expect(fs.existsSync(path.join(outputRoot, 'sub-utils.js'))).toBe(true)
    const detailJs = fs.readFileSync(path.join(outputRoot, 'packageA/detail/index.js'), 'utf-8')
    expect(detailJs).toContain('sub-utils')
  })

  it('handles MiniSplitChunksPlugin (sub-vendors & sub-common extraction)', async () => {
    const { stats, outputRoot } = await compileFixture('mini-split-chunks', {
      platformType: 'mini',
      webpackChain (chain: any) {
        chain.merge({
          externals: ['lodash']
        })
      },
      optimizeMainPackage: {
        enable: true,
        exclude: [
          path.resolve(FIXTURES_DIR, 'mini-split-chunks/src/utils/testExcludeString.js'),
          (module: any) => (module.resource || '').indexOf('testExcludeFunction') >= 0
        ]
      },
      postcss: {
        cssModules: {
          enable: true,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    })

    expect(stats?.hasErrors()).toBe(false)
    // Root sub-common directory must be cleaned up
    expect(fs.existsSync(path.join(outputRoot, 'sub-common'))).toBe(false)

    // Subpackage pages referencing extracted sub-vendors / sub-common must resolve to existing files
    for (const relPage of ['packageA/detail/index.js', 'packageA/my/index.js', 'packageB/list/index.js']) {
      const fullPath = path.join(outputRoot, relPage)
      expect(fs.existsSync(fullPath)).toBe(true)
      const content = fs.readFileSync(fullPath, 'utf-8')
      const reqMatches = [...content.matchAll(/require\(["'](\.\.\/[^"']+)["']\)/g)]
      for (const m of reqMatches) {
        const target = path.resolve(path.dirname(fullPath), `${m[1]}.js`.replace(/\.js\.js$/, '.js'))
        expect(fs.existsSync(target)).toBe(true)
      }
    }
  })

  it('resolves multi-platform files (.weapp.tsx vs .h5.tsx vs default)', async () => {
    const multiDir = fs.mkdtempSync(path.join(FIXTURES_DIR, '.tmp-rspack-multi-'))
    tempDirs.push(multiDir)
    const babelPresetTaroPath = require.resolve('babel-preset-taro')
    fs.ensureDirSync(path.join(multiDir, 'src/pages/index'))
    fs.writeFileSync(
      path.join(multiDir, 'babel.config.js'),
      `module.exports = { presets: [[${JSON.stringify(babelPresetTaroPath)}, { framework: 'react', ts: true }]] }`
    )
    fs.writeFileSync(path.join(multiDir, 'src/index.html'), '<!DOCTYPE html><html><head><script><%= htmlWebpackPlugin.options.script %></script></head><body><div id="app"></div></body></html>')
    fs.writeFileSync(path.join(multiDir, 'src/app.config.ts'), `export default { pages: ['pages/index/index'] }`)
    fs.writeFileSync(path.join(multiDir, 'src/app.tsx'), `export default function App(props) { return props.children }`)
    fs.writeFileSync(path.join(multiDir, 'src/pages/index/greeting.ts'), `export const PLATFORM_TAG = 'DEFAULT_TAG'`)
    fs.writeFileSync(path.join(multiDir, 'src/pages/index/greeting.weapp.ts'), `export const PLATFORM_TAG = 'WEAPP_SPECIFIC_TAG'`)
    fs.writeFileSync(path.join(multiDir, 'src/pages/index/greeting.h5.ts'), `export const PLATFORM_TAG = 'H5_SPECIFIC_TAG'`)
    fs.writeFileSync(path.join(multiDir, 'src/pages/index/index.config.ts'), `export default { navigationBarTitleText: 'Home' }`)
    fs.writeFileSync(path.join(multiDir, 'src/pages/index/index.tsx'), `
      import React from 'react'
      import { View, Button } from '@tarojs/components'
      import { PLATFORM_TAG } from './greeting'
      export default function Index() {
        return <View><Button>{PLATFORM_TAG}</Button></View>
      }
    `)

    const prevEnv = process.env.NODE_ENV
    componentConfig.includeAll = false
    componentConfig.includes = new Set(['view', 'text'])

    const weappRes = await compileFixture(multiDir, {
      platformType: 'mini',
      buildAdapter: 'weapp',
      mode: 'production',
      terser: { enable: false },
    })
    process.env.NODE_ENV = prevEnv

    expect(weappRes.stats?.hasErrors()).toBe(false)
    const weappPageJs = fs.readFileSync(path.join(weappRes.outputRoot, 'pages/index/index.js'), 'utf-8')
    expect(weappPageJs).toContain('WEAPP_SPECIFIC_TAG')
    expect(weappPageJs).not.toContain('H5_SPECIFIC_TAG')
    const baseWxml = fs.readFileSync(path.join(weappRes.outputRoot, 'base.wxml'), 'utf-8')
    expect(baseWxml).toContain('<button ')

    const h5Res = await compileFixture(multiDir, {
      platformType: 'web',
      buildAdapter: 'h5',
      terser: { enable: false },
    })
    expect(h5Res.stats?.hasErrors()).toBe(false)
    const chunkDir = path.join(h5Res.outputRoot, 'chunk')
    const h5DirFiles = fs.existsSync(chunkDir) ? fs.readdirSync(chunkDir) : []
    const allH5Code = [
      fs.readFileSync(path.join(h5Res.outputRoot, 'js/app.js'), 'utf-8'),
      ...h5DirFiles.map(f => fs.readFileSync(path.join(chunkDir, f), 'utf-8'))
    ].join('\n')
    expect(allH5Code).toContain('H5_SPECIFIC_TAG')
    expect(allH5Code).not.toContain('WEAPP_SPECIFIC_TAG')
  })

  it('compiles Sass and CSS Modules in both H5 and MiniProgram', async () => {
    const miniCss = await compileFixture('css-modules', {
      platformType: 'mini',
      postcss: {
        cssModules: {
          enable: true,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]'
          }
        }
      }
    })
    expect(miniCss.stats?.hasErrors()).toBe(false)
    expect(fs.existsSync(path.join(miniCss.outputRoot, 'pages/index/index.wxss'))).toBe(true)

    const h5Sass = await compileFixture('sass', {
      platformType: 'web',
    })
    expect(h5Sass.stats?.hasErrors()).toBe(false)
    expect(fs.existsSync(path.join(h5Sass.outputRoot, 'css/app.css'))).toBe(true)
  })

  it('isolates default Terser options, provider globals, and PostCSS plugin lists across instances', () => {
    const appPath = path.resolve(__dirname, '..')

    const h5A = new H5BaseConfig(appPath, { mode: 'development' })
    const h5B = new H5BaseConfig(appPath, { mode: 'development' })
    expect(h5A.defaultTerserOptions).not.toBe(h5B.defaultTerserOptions)
    expect(h5A.defaultTerserOptions.output).not.toBe(h5B.defaultTerserOptions.output)
    h5A.defaultTerserOptions.output.comments = true
    expect(h5B.defaultTerserOptions.output.comments).toBe(false)

    const miniA = new MiniBaseConfig(appPath, { mode: 'development' })
    const miniB = new MiniBaseConfig(appPath, { mode: 'development' })
    expect(miniA.defaultTerserOptions).not.toBe(miniB.defaultTerserOptions)
    expect(miniA.defaultTerserOptions.compress).not.toBe(miniB.defaultTerserOptions.compress)
    miniA.defaultTerserOptions.compress.unused = false
    expect(miniB.defaultTerserOptions.compress.unused).toBe(true)

    const miniPlugin = new MiniRspackPlugin({ config: {} } as any)
    const providerA = miniPlugin.getProviderPlugin().args[0]
    const providerB = miniPlugin.getProviderPlugin().args[0]
    expect(providerA).not.toBe(providerB)
    providerA.window = ['custom']
    expect(providerB.window).toEqual(['@tarojs/runtime', 'window'])

    const h5Mod = new H5RspackModule({ appPath, config: { designWidth: 750 } } as any)
    const h5Rule1 = h5Mod.getPostCSSRule({})
    const h5Rule2 = h5Mod.getPostCSSRule({})
    expect(h5Rule1.use[0].options.postcssOptions.plugins.length).toBe(
      h5Rule2.use[0].options.postcssOptions.plugins.length
    )

    const miniMod = new MiniRspackModule({
      appPath,
      sourceRoot: 'src',
      fileType: { style: '.wxss', config: '.json', script: '.js', templ: '.wxml', xs: '.wxs' },
      config: { buildAdapter: 'weapp', designWidth: 750 }
    } as any)
    const miniModules1 = miniMod.getModules()
    const miniModules2 = miniMod.getModules()
    expect(miniModules1.rule.normalCss.oneOf[0].use[2].options.postcssOptions.plugins.length).toBe(
      miniModules2.rule.normalCss.oneOf[0].use[2].options.postcssOptions.plugins.length
    )
  })
})
