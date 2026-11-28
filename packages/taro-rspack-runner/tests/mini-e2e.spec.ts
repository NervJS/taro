import { execFileSync } from 'node:child_process'
import path from 'node:path'
import vm from 'node:vm'

import helper, { fs } from '@tarojs/helper'
import * as runnerUtils from '@tarojs/runner-utils'
import { afterEach, describe, expect, it } from 'vitest'

import ReactLikePlugin from '../../taro-framework-react/dist/index.js'
import Vue3Plugin from '../../taro-framework-vue3/dist/index.js'
import { Alipay } from '../../taro-platform-alipay/dist/index.js'
import { JD } from '../../taro-platform-jd/dist/index.js'
import { QQ } from '../../taro-platform-qq/dist/index.js'
import { Swan } from '../../taro-platform-swan/dist/index.js'
import { TT } from '../../taro-platform-tt/dist/index.js'
import { Weapp } from '../../taro-platform-weapp/dist/index.js'
import buildMini from '../dist/index.mini'
import { componentConfig } from '../dist/utils/context'

const REPO_ROOT = path.resolve(__dirname, '../../..')
const FIXTURES_DIR = path.resolve(REPO_ROOT, 'tests/__tests__/fixtures')
const MOCKS_DIR = path.resolve(REPO_ROOT, 'tests/__tests__/mocks')
const TARO_BIN_PATH = path.resolve(REPO_ROOT, 'packages/taro-cli/bin/taro')

const tempDirs: string[] = []

function createFixtureTempDir (prefix: string) {
  const dir = fs.mkdtempSync(path.join(FIXTURES_DIR, `.tmp-mini-e2e-${prefix}-`))
  tempDirs.push(dir)
  return dir
}

afterEach(() => {
  while (tempDirs.length) {
    const dir = tempDirs.pop()!
    fs.removeSync(dir)
  }
})

function getPlatformInstance (adapter: string) {
  switch (adapter) {
    case 'alipay':
      return new Alipay({ helper } as any, {})
    case 'tt':
      return new TT({ helper } as any, {})
    case 'swan':
      return new Swan({ helper } as any, {})
    case 'qq':
      return new QQ({ helper } as any, {})
    case 'jd':
      return new JD({ helper } as any, {})
    case 'weapp':
    default:
      return new Weapp({ helper } as any, {})
  }
}

async function compileMiniFixture (
  fixtureName: string,
  options: Record<string, any> = {}
) {
  const buildAdapter = options.buildAdapter || 'weapp'
  process.env.TARO_PLATFORM = 'mini'
  process.env.TARO_ENV = buildAdapter
  process.env.NODE_ENV = options.nodeEnv || 'test'

  const appPath = path.isAbsolute(fixtureName) ? fixtureName : path.resolve(FIXTURES_DIR, fixtureName)
  const outputRoot = createFixtureTempDir(`${path.basename(fixtureName)}-${buildAdapter}-dist`)
  const sourceRoot = options.sourceRoot || 'src'
  const entryFilePath = helper.resolveMainFilePath(path.join(appPath, sourceRoot, 'app'))

  const prevCwd = process.cwd()
  process.chdir(appPath)

  try {
    const program: any = getPlatformInstance(buildAdapter)
    program.modifyTemplate?.({})
    const userWebpackChain = options.webpackChain

    const config: any = {
      sourceRoot,
      outputRoot,
      designWidth: 750,
      deviceRatio: { 640: 1.17, 750: 1, 828: 0.905 },
      defineConstants: {},
      env: {
        FRAMEWORK: JSON.stringify(options.framework || 'react'),
        TARO_ENV: JSON.stringify(buildAdapter),
        TARO_PLATFORM: JSON.stringify('mini'),
      },
      compiler: {
        type: 'rspack',
      },
      buildAdapter,
      platformType: 'mini',
      enableSourceMap: false,
      entry: {
        app: [entryFilePath]
      },
      framework: options.framework || 'react',
      isWatch: false,
      mode: options.mode || 'production',
      logger: { quiet: true },
      globalObject: program.globalObject,
      fileType: program.fileType,
      template: program.template,
      runtimePath: program.runtimePath,
      taroComponentsPath: `@tarojs/plugin-platform-${buildAdapter}/dist/components-react`,
      ...options,
    }

    config.webpackChain = (chain: any, rspackInstance: any, metaType: any) => {
      const mockCtx: any = {
        initialConfig: {
          framework: config.framework || 'react',
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

      if (options.useMocks !== false) {
        const mockRuntimeDir = createFixtureTempDir('mock-runtime')
        const mockRuntimePath = path.join(mockRuntimeDir, 'taro-runtime.js')
        fs.writeFileSync(
          mockRuntimePath,
          [
            "export default 'taro-runtime-mock'",
            'export const window = {}',
            'export function createReactApp () {}',
            'export function createVue3App () {}',
            'export function createRecursiveComponentConfig () {}',
            'export function createPageConfig () {}',
            'export function createComponentConfig () {}',
          ].join('\n')
        )
        const alias = chain.resolve.alias
        alias.set('@tarojs/components$', path.resolve(MOCKS_DIR, 'taro-components'))
        alias.set('@tarojs/plugin-framework-react/dist/runtime', path.resolve(MOCKS_DIR, 'taro'))
        alias.set('@tarojs/plugin-framework-vue3/dist/runtime', path.resolve(MOCKS_DIR, 'taro'))
        alias.set(`@tarojs/plugin-platform-${buildAdapter}/dist/runtime`, path.resolve(MOCKS_DIR, 'taro'))
        alias.set('@tarojs/runtime', mockRuntimePath)
        alias.set('@tarojs/shared', path.resolve(MOCKS_DIR, 'taro-shared'))
        alias.set('@tarojs/taro', path.resolve(MOCKS_DIR, 'taro'))
        alias.set('@tarojs/react', path.resolve(MOCKS_DIR, 'taro-react'))
        alias.set('react$', path.resolve(MOCKS_DIR, 'react'))
        alias.set('react/jsx-runtime', path.resolve(MOCKS_DIR, 'react'))
        alias.set('vue', path.resolve(MOCKS_DIR, 'vue'))
        alias.set('regenerator-runtime', path.resolve(MOCKS_DIR, 'deps'))
      }

      if (typeof userWebpackChain === 'function') {
        userWebpackChain(chain, rspackInstance, metaType)
      }
    }

    const stats = await buildMini(appPath, config)
    return { stats, outputRoot, config }
  } finally {
    process.chdir(prevCwd)
  }
}

/**
 * Recursively apply WeChat setData key-path updates (e.g. 'root.cn.[0].cn.[1].v')
 * onto a plain JS data object and extract all rendered text values + button sids.
 */
function setByMiniPath (target: Record<string, any>, rawPath: string, value: any) {
  const parts = rawPath
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)

  let curr: any = target
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    const nextKey = parts[i + 1]
    if (curr[key] == null) {
      curr[key] = /^\d+$/.test(nextKey) ? [] : {}
    }
    curr = curr[key]
  }
  curr[parts[parts.length - 1]] = value
}

function collectRenderedTexts (node: any, out: string[] = []): string[] {
  if (!node || typeof node !== 'object') return out
  if (typeof node.v === 'string') {
    out.push(node.v)
  }
  if (Array.isArray(node.cn)) {
    for (const child of node.cn) {
      collectRenderedTexts(child, out)
    }
  }
  return out
}

function findNodeByAttrOrTag (node: any, predicate: (n: any) => boolean): any {
  if (!node || typeof node !== 'object') return null
  if (predicate(node)) return node
  if (Array.isArray(node.cn)) {
    for (const child of node.cn) {
      const found = findNodeByAttrOrTag(child, predicate)
      if (found) return found
    }
  }
  return null
}

function createSimulatedWxVm (distDir: string) {
  let registeredAppConfig: any = null
  let registeredPageConfig: any = null
  const registeredComponents: any[] = []
  const moduleCache = new Map<string, { exports: any }>()

  const wxGlobal: Record<string, any> = {
    getSystemInfoSync: () => ({ brand: 'devtools', model: 'iPhone', screenWidth: 375, windowWidth: 375 }),
    canIUse: () => true,
    getLaunchOptionsSync: () => ({ path: 'pages/index/index', query: {}, scene: 1001 }),
    getEnterOptionsSync: () => ({ path: 'pages/index/index', query: {}, scene: 1001 }),
    onError: () => {},
    onPageNotFound: () => {},
    onAppShow: () => {},
    onAppHide: () => {},
    nextTick: (cb: () => void) => Promise.resolve().then(cb),
  }

  const sandbox: Record<string, any> = {
    wx: wxGlobal,
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Promise,
    Object,
    Array,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Symbol,
    Error,
    TypeError,
    RegExp,
    JSON,
    Math,
    Date,
    Number,
    String,
    Boolean,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    encodeURIComponent,
    decodeURIComponent,
    App: (cfg: any) => { registeredAppConfig = cfg },
    Page: (cfg: any) => { registeredPageConfig = cfg },
    Component: (cfg: any) => { registeredComponents.push(cfg) },
    Behavior: (cfg: any) => cfg,
    getApp: () => registeredAppConfig,
    getCurrentPages: () => (registeredPageConfig ? [registeredPageConfig] : []),
    requirePlugin: () => ({}),
  }
  sandbox.global = sandbox
  sandbox.self = sandbox
  const context = vm.createContext(sandbox)

  function execMiniScript (absFilePath: string): any {
    const normalized = path.resolve(absFilePath.endsWith('.js') ? absFilePath : `${absFilePath}.js`)
    if (moduleCache.has(normalized)) return moduleCache.get(normalized)!.exports
    const mod = { exports: {} as any }
    moduleCache.set(normalized, mod)
    const dir = path.dirname(normalized)
    const code = fs.readFileSync(normalized, 'utf-8')
    const wrapped = `(function(require, module, exports, __dirname, __filename) {\n${code}\n})`
    const fn = vm.runInContext(wrapped, context, { filename: normalized })
    fn((relReq: string) => execMiniScript(path.resolve(dir, relReq)), mod, mod.exports, dir, normalized)
    return mod.exports
  }

  function mountPage (pageRoute = 'pages/index/index') {
    execMiniScript(path.join(distDir, `${pageRoute}.js`))
    expect(registeredPageConfig).toBeTruthy()
    const pageData: Record<string, any> = JSON.parse(JSON.stringify(registeredPageConfig.data || { root: { cn: [] } }))
    const pageInstance: Record<string, any> = {
      ...registeredPageConfig,
      route: pageRoute,
      __route__: pageRoute,
      options: {},
      data: pageData,
      setData (patch: Record<string, any>, cb?: () => void) {
        for (const [k, v] of Object.entries(patch)) {
          setByMiniPath(pageData, k, v)
        }
        cb?.()
      }
    }
    pageInstance.onLoad?.({})
    pageInstance.onShow?.()
    pageInstance.onReady?.()
    return { pageData, pageInstance }
  }

  return {
    execMiniScript,
    mountPage,
    getAppConfig: () => registeredAppConfig,
    getComponents: () => registeredComponents,
  }
}

describe('MiniProgram comprehensive E2E verification', () => {
  it('runs FULL Taro Kernel CLI build (zero mocks) + executes compiled Weapp bundle in simulated wx VM with React state updates', async () => {
    const appDir = createFixtureTempDir('real-kernel-weapp')
    const distDir = path.join(appDir, 'dist')
    const babelPresetTaroPath = require.resolve('babel-preset-taro')

    fs.ensureDirSync(path.join(appDir, 'config'))
    fs.ensureDirSync(path.join(appDir, 'src/pages/index'))
    fs.ensureDirSync(path.join(appDir, 'src/pkgA/detail'))

    fs.writeJsonSync(path.join(appDir, 'package.json'), {
      name: 'real-kernel-weapp-test',
      version: '1.0.0',
      private: true,
      dependencies: {
        '@tarojs/components': '4.3.3',
        '@tarojs/plugin-framework-react': '4.3.3',
        '@tarojs/plugin-platform-weapp': '4.3.3',
        '@tarojs/react': '4.3.3',
        '@tarojs/runtime': '4.3.3',
        '@tarojs/shared': '4.3.3',
        '@tarojs/taro': '4.3.3',
        react: '^18.3.1',
        'react-dom': '^18.3.1'
      },
      devDependencies: {
        '@tarojs/cli': '4.3.3',
        '@tarojs/rspack-runner': '4.3.3'
      }
    })

    fs.writeFileSync(
      path.join(appDir, 'babel.config.js'),
      `module.exports = { presets: [[${JSON.stringify(babelPresetTaroPath)}, { framework: 'react', ts: true }]] }`
    )

    fs.writeFileSync(
      path.join(appDir, 'config/index.js'),
      `module.exports = {
        projectName: 'real-kernel-weapp-test',
        sourceRoot: 'src',
        outputRoot: 'dist',
        framework: 'react',
        compiler: 'rspack',
        logger: { quiet: true },
        mini: {
          debugReact: true
        }
      }`
    )

    fs.writeFileSync(
      path.join(appDir, 'src/app.config.ts'),
      `export default {
        pages: ['pages/index/index'],
        subPackages: [{ root: 'pkgA', pages: ['detail/index'] }],
        window: { navigationBarTitleText: 'Rspack Real E2E' }
      }`
    )

    fs.writeFileSync(
      path.join(appDir, 'src/app.scss'),
      `.global-box { width: 750px; color: #333; }`
    )

    fs.writeFileSync(
      path.join(appDir, 'src/app.tsx'),
      `import './app.scss'
      export default function App(props: any) {
        return props.children
      }`
    )

    fs.writeFileSync(
      path.join(appDir, 'src/pages/index/index.config.ts'),
      `export default { navigationBarTitleText: 'Home Page' }`
    )

    fs.writeFileSync(
      path.join(appDir, 'src/pages/index/index.scss'),
      `.counter-title { font-size: 32px; }`
    )

    fs.writeFileSync(
      path.join(appDir, 'src/pages/index/index.tsx'),
      `import React, { useState } from 'react'
      import { View, Text, Button } from '@tarojs/components'
      import Taro from '@tarojs/taro'
      import './index.scss'

      export default function Index() {
        const [count, setCount] = useState(0)
        return (
          <View className="counter-wrap">
            <Text className="counter-title">Env:{Taro.getEnv()}|Count:{count}</Text>
            <Button id="inc-btn" onClick={() => setCount(c => c + 1)}>AddOne</Button>
          </View>
        )
      }`
    )

    fs.writeFileSync(
      path.join(appDir, 'src/pkgA/detail/index.config.ts'),
      `export default { navigationBarTitleText: 'Detail' }`
    )

    fs.writeFileSync(
      path.join(appDir, 'src/pkgA/detail/index.tsx'),
      `import React from 'react'
      import { View, Text } from '@tarojs/components'
      export default function Detail() {
        return <View><Text>SubpackageDetail</Text></View>
      }`
    )

    // Symlink workspace @tarojs/* packages into appDir/node_modules so `taro build --type weapp`
    // resolves the exact workspace packages without mocks
    const appNodeModules = path.join(appDir, 'node_modules/@tarojs')
    fs.ensureDirSync(appNodeModules)
    for (const [pkgDir, pkgName] of [
      ['taro-rspack-runner', 'rspack-runner'],
      ['taro-platform-weapp', 'plugin-platform-weapp'],
      ['taro-framework-react', 'plugin-framework-react'],
      ['taro-components', 'components'],
      ['taro-runtime', 'runtime'],
      ['shared', 'shared'],
      ['taro', 'taro'],
      ['taro-react', 'react'],
      ['taro-api', 'api'],
    ]) {
      fs.symlinkSync(path.resolve(REPO_ROOT, 'packages', pkgDir), path.join(appNodeModules, pkgName), 'dir')
    }

    execFileSync(process.execPath, [TARO_BIN_PATH, 'build', '--type', 'weapp'], {
      cwd: appDir,
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
      stdio: 'pipe',
    })

    // 1. Verify full build artifacts emitted by Kernel -> Weapp -> RspackRunner
    expect(fs.existsSync(path.join(distDir, 'app.js'))).toBe(true)
    expect(fs.existsSync(path.join(distDir, 'app.json'))).toBe(true)
    expect(fs.existsSync(path.join(distDir, 'app.wxss'))).toBe(true)
    expect(fs.existsSync(path.join(distDir, 'runtime.js'))).toBe(true)
    expect(
      fs.existsSync(path.join(distDir, 'vendors.js')) ||
      fs.existsSync(path.join(distDir, 'common.js')) ||
      fs.existsSync(path.join(distDir, 'taro.js'))
    ).toBe(true)
    expect(fs.existsSync(path.join(distDir, 'base.wxml'))).toBe(true)
    expect(fs.existsSync(path.join(distDir, 'comp.js'))).toBe(true)
    expect(fs.existsSync(path.join(distDir, 'pages/index/index.js'))).toBe(true)
    expect(fs.existsSync(path.join(distDir, 'pages/index/index.wxml'))).toBe(true)
    expect(fs.existsSync(path.join(distDir, 'pages/index/index.wxss'))).toBe(true)
    expect(fs.existsSync(path.join(distDir, 'pkgA/detail/index.js'))).toBe(true)

    const pageWxss = fs.readFileSync(path.join(distDir, 'pages/index/index.wxss'), 'utf-8')
    expect(pageWxss).toContain('32rpx')

    // 2. Execute the compiled MiniProgram bundle in a simulated WeChat MiniProgram VM!
    const wxVm = createSimulatedWxVm(distDir)
    wxVm.execMiniScript(path.join(distDir, 'app.js'))
    expect(wxVm.getAppConfig()).toBeTruthy()
    wxVm.getAppConfig().onLaunch?.({ path: 'pages/index/index', query: {}, scene: 1001 })

    wxVm.execMiniScript(path.join(distDir, 'comp.js'))
    expect(wxVm.getComponents().length).toBeGreaterThan(0)

    const { pageData, pageInstance } = wxVm.mountPage('pages/index/index')

    // Wait for React 18 scheduler + Taro nextTick batch update to flush setData
    await new Promise(resolve => setTimeout(resolve, 80))

    const initialTexts = collectRenderedTexts(pageData.root).join('')
    expect(initialTexts).toContain('Env:WEAPP|Count:0')
    expect(initialTexts).toContain('AddOne')

    // Trigger tap event on #inc-btn and verify React state update -> MiniProgram setData!
    const btnNode = findNodeByAttrOrTag(pageData.root, n => n.uid === 'inc-btn' || n.sid === 'inc-btn')
    expect(btnNode).toBeTruthy()

    pageInstance.eh?.({
      type: 'tap',
      timeStamp: Date.now(),
      detail: {},
      target: { id: btnNode.uid || btnNode.sid, dataset: { sid: btnNode.sid } },
      currentTarget: { id: btnNode.uid || btnNode.sid, dataset: { sid: btnNode.sid } },
    })

    await new Promise(resolve => setTimeout(resolve, 80))
    const updatedTexts = collectRenderedTexts(pageData.root).join('')
    expect(updatedTexts).toContain('Env:WEAPP|Count:1')
  })

  it.each([
    ['alipay', '.axml', '.acss'],
    ['swan', '.swan', '.css'],
    ['qq', '.qml', '.qss'],
    ['jd', '.jxml', '.jxss'],
  ] as const)('builds %s MiniProgram platform with platform-specific templates and styles', async (adapter, templExt, styleExt) => {
    const { stats, outputRoot } = await compileMiniFixture('react', {
      buildAdapter: adapter,
    })

    expect(stats?.hasErrors()).toBe(false)
    expect(fs.existsSync(path.join(outputRoot, 'app.js'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'app.json'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, `base${templExt}`))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, `pages/index/index${templExt}`))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, `pages/index/index${styleExt}`))).toBe(true)
  })

  it('builds Vue 3 SFC (.vue) MiniProgram app without template render linking warnings', async () => {
    const { stats, outputRoot } = await compileMiniFixture('vue3', {
      framework: 'vue3',
    })

    expect(stats?.hasErrors()).toBe(false)
    const warnings = stats?.toJson({ warnings: true }).warnings || []
    const hasRenderLinkWarning = warnings.some((w: any) => String(w?.message || w).includes("export 'render'"))
    expect(hasRenderLinkWarning).toBe(false)

    expect(fs.existsSync(path.join(outputRoot, 'app.js'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'app.json'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'base.wxml'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'pages/index/index.js'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'pages/index/index.wxml'))).toBe(true)
  })

  it('builds TabBar icons and Custom TabBar component (weapp & alipay)', async () => {
    const tabbarRes = await compileMiniFixture('tabbar', {
      buildAdapter: 'weapp',
    })
    expect(tabbarRes.stats?.hasErrors()).toBe(false)
    const appJson = fs.readJsonSync(path.join(tabbarRes.outputRoot, 'app.json'))
    expect(appJson.tabBar?.list?.length).toBeGreaterThan(0)
    for (const item of appJson.tabBar.list) {
      if (item.iconPath) {
        expect(fs.existsSync(path.join(tabbarRes.outputRoot, item.iconPath))).toBe(true)
      }
    }

    const customTabbarRes = await compileMiniFixture('custom-tabbar', {
      buildAdapter: 'weapp',
    })
    expect(customTabbarRes.stats?.hasErrors()).toBe(false)
    expect(fs.existsSync(path.join(customTabbarRes.outputRoot, 'custom-tab-bar/index.js'))).toBe(true)
    expect(fs.existsSync(path.join(customTabbarRes.outputRoot, 'custom-tab-bar/index.wxml'))).toBe(true)
    expect(fs.existsSync(path.join(customTabbarRes.outputRoot, 'custom-tab-bar/index.json'))).toBe(true)
  })

  it('builds WeChat native hybrid pages and components (wx-hybrid)', async () => {
    const { stats, outputRoot } = await compileMiniFixture('wx-hybrid', {
      buildAdapter: 'weapp',
      compile: {
        exclude: [(filename: string) => (
          /node_modules/.test(filename) ||
          /echarts\.js$/.test(filename) ||
          (/taro/.test(filename) && !(/tests/.test(filename)))
        )]
      }
    })

    expect(stats?.hasErrors()).toBe(false)
    expect(fs.existsSync(path.join(outputRoot, 'app.js'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'pages/index/index.js'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'pages/native/native.js'))).toBe(true)
    expect(fs.existsSync(path.join(outputRoot, 'pages/native/native.wxml'))).toBe(true)
  })

  it('runs FULL Taro CLI build for Vue 3 SFC MiniProgram (zero mocks) + executes in simulated wx VM', async () => {
    const appDir = createFixtureTempDir('real-cli-vue3-weapp')
    const distDir = path.join(appDir, 'dist')
    const babelPresetTaroPath = require.resolve('babel-preset-taro')

    fs.ensureDirSync(path.join(appDir, 'config'))
    fs.ensureDirSync(path.join(appDir, 'src/pages/index'))

    fs.writeJsonSync(path.join(appDir, 'package.json'), {
      name: 'real-cli-vue3-weapp-test',
      version: '1.0.0',
      private: true,
    })

    fs.writeFileSync(
      path.join(appDir, 'babel.config.js'),
      `module.exports = { presets: [[${JSON.stringify(babelPresetTaroPath)}, { framework: 'vue3', ts: true }]] }`
    )

    fs.writeFileSync(
      path.join(appDir, 'config/index.js'),
      `module.exports = {
        projectName: 'real-cli-vue3-weapp-test',
        sourceRoot: 'src',
        outputRoot: 'dist',
        framework: 'vue3',
        compiler: 'rspack',
        logger: { quiet: true }
      }`
    )

    fs.writeFileSync(
      path.join(appDir, 'src/app.config.ts'),
      `export default { pages: ['pages/index/index'] }`
    )

    fs.writeFileSync(
      path.join(appDir, 'src/app.ts'),
      `import { createApp } from 'vue'
      export default createApp({})`
    )

    fs.writeFileSync(
      path.join(appDir, 'src/pages/index/index.config.ts'),
      `export default { navigationBarTitleText: 'Vue3 Home' }`
    )

    fs.writeFileSync(
      path.join(appDir, 'src/pages/index/index.vue'),
      `<template>
        <view class="vue-box">
          <text>VueCount:{{ count }}</text>
        </view>
      </template>
      <script setup lang="ts">
      import { ref } from 'vue'
      const count = ref(42)
      </script>`
    )

    const appNodeModules = path.join(appDir, 'node_modules/@tarojs')
    fs.ensureDirSync(appNodeModules)
    for (const [pkgDir, pkgName] of [
      ['taro-rspack-runner', 'rspack-runner'],
      ['taro-platform-weapp', 'plugin-platform-weapp'],
      ['taro-framework-vue3', 'plugin-framework-vue3'],
      ['taro-components', 'components'],
      ['taro-runtime', 'runtime'],
      ['shared', 'shared'],
      ['taro', 'taro'],
      ['taro-api', 'api'],
    ]) {
      fs.symlinkSync(path.resolve(REPO_ROOT, 'packages', pkgDir), path.join(appNodeModules, pkgName), 'dir')
    }
    fs.symlinkSync(
      fs.realpathSync(path.resolve(REPO_ROOT, 'packages/taro-framework-vue3/node_modules/vue')),
      path.join(appDir, 'node_modules/vue'),
      'dir'
    )
    fs.symlinkSync(
      path.resolve(REPO_ROOT, 'packages/taro-framework-vue3/node_modules/@vue'),
      path.join(appDir, 'node_modules/@vue'),
      'dir'
    )
    fs.symlinkSync(
      fs.realpathSync(path.resolve(REPO_ROOT, 'tests/node_modules/vue-loader')),
      path.join(appDir, 'node_modules/vue-loader'),
      'dir'
    )

    try {
      execFileSync(process.execPath, [TARO_BIN_PATH, 'build', '--type', 'weapp'], {
        cwd: appDir,
        env: { ...process.env, NODE_ENV: 'production' },
        stdio: 'pipe',
      })
    } catch (e: any) {
      throw new Error(`Vue3 CLI failed:\nSTDOUT:\n${e.stdout?.toString()}\nSTDERR:\n${e.stderr?.toString()}`)
    }

    expect(fs.existsSync(path.join(distDir, 'app.js'))).toBe(true)
    expect(fs.existsSync(path.join(distDir, 'pages/index/index.js'))).toBe(true)

    const wxVm = createSimulatedWxVm(distDir)
    wxVm.execMiniScript(path.join(distDir, 'app.js'))
    wxVm.getAppConfig()?.onLaunch?.({})
    const { pageData } = wxVm.mountPage('pages/index/index')

    await new Promise(resolve => setTimeout(resolve, 80))
    const rendered = collectRenderedTexts(pageData.root).join('')
    expect(rendered).toContain('VueCount:42')
  })
})
