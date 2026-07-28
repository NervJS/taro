import * as path from 'node:path'

import { fs } from '@tarojs/helper'
import webpack from 'webpack'

import { SHARED_ASYNC_HOST_PROVIDER_NAME, SHARED_ASYNC_ROOT, SHARED_GLOBAL_ASYNC, SHARED_HOST_CORE_NAME, SHARED_SYNC_CORE_NAME } from './constants'

import type { MiniCombination } from '../webpack/MiniCombination'

/**
 * 主构建成功后，额外跑独立 webpack 子构建产出共享运行时。按 sharedRuntimeMode 分叉：
 *   - host（方案一）：产【一个】全量核 taro-core.js（整条链同步挂全局），emit 到 outputDir 根，无 external/无异步子包。
 *   - split（方案二）：产 sync-core（随业务包）+ async-provider（异步子包 shared-async/）。
 *   - async-host（实验）：全量核挪进异步子包 shared-async/，业务包不产任何同步核；
 *     由宿主主包 require.async 预热挂全局，详见 SHARED_RUNTIME_DEV.md「async-host 实验」一节。
 *
 * 为何独立 webpack 而非 child compiler：主构建 externals 把 @tarojs/*+react 外置了，
 * 而这些 bundle 要把它们【真正打进产物】，依赖集正相反。独立 compiler 自带反向 external。
 * 依赖解析：react/@tarojs/* 从【用户项目】node_modules 解析（resolve.modules 指向 appPath）。
 */
export async function buildSharedRuntime (combination: MiniCombination): Promise<void> {
  const { appPath, outputDir } = combination
  const config = combination.config
  const globalObject = config.output?.globalObject || 'wx'
  const shimDir = path.resolve(__dirname) // dist/shared-runtime（provider 源文件所在）
  const userNodeModules = path.resolve(appPath, 'node_modules')

  // 复用主构建的 DefinePlugin 常量（保 runtime DOM 分支一致）
  const definePlugin = (combination as any).webpackPluginInstance?.definePluginOptions
  const defineConstants = definePlugin || buildDefineConstants(config)

  // 接入方声明的额外共享包（CLI 不认识具体包名）。webpack entry 用数组：额外包按序先执行
  // （其 mergeReconciler 等副作用先跑），再执行核心 entry（内部 require @tarojs/taro 触发 initNativeApi）。
  const extraPackages: string[] = config.sharedRuntimeExtraPackages || []

  const base = (name: string, entry: string, emitTo: string, withExtras = true) => ({
    name,
    mode: 'production' as const,
    target: ['web', 'es5'] as any,
    // extraPackages 按 withExtras 拼进对应核：host 拼进全量核；split 拼进 async-provider（与 @tarojs/api 同处异步子包）。
    // 只在其一带，避免打两份。
    entry: withExtras ? [...extraPackages, path.join(shimDir, entry)] : path.join(shimDir, entry),
    output: {
      path: path.join(outputDir, emitTo),
      filename: `${name}.js`,
      globalObject,
      iife: true,
    },
    optimization: { minimize: true, splitChunks: false as const, runtimeChunk: false as const },
    plugins: [
      new webpack.DefinePlugin(defineConstants),
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    ],
    resolve: { modules: [userNodeModules, 'node_modules'] },
  })

  if (config.sharedRuntimeMode === 'split') {
    await buildSplit(base, outputDir, globalObject, config)
  } else if (config.sharedRuntimeMode === 'async-host') {
    await buildAsyncHost(base, outputDir, config)
  } else {
    await buildHost(base)
  }
}

/** 方案一 host：产一个全量核 taro-core.js（无 external、无异步子包、不注册 subPackage） */
async function buildHost (base: (name: string, entry: string, emitTo: string, withExtras?: boolean) => any): Promise<void> {
  const hostConfig = base(SHARED_HOST_CORE_NAME, 'entry.host.js', '')
  await runWebpack([hostConfig])
}

/** 方案二 split：sync-core（业务包根）+ async-provider（shared-async 子包）+ 占位入口 + app.json 注册 */
async function buildSplit (
  base: (name: string, entry: string, emitTo: string, withExtras?: boolean) => any,
  outputDir: string,
  globalObject: string,
  config: any
): Promise<void> {
  const asyncRequest = getAsyncRequest(config)

  // sync-core：放 outputDir 根；withExtras=false —— 额外包（如 jdapi 等 api）随异步子包，与 @tarojs/api 一致
  const syncCoreConfig: any = base(SHARED_SYNC_CORE_NAME, 'entry.sync.js', '', false)
  syncCoreConfig.externalsType = 'promise'
  syncCoreConfig.externals = { 'shared-async/index': `require.async(${JSON.stringify(asyncRequest)})` }

  // async-provider：放 shared-async/；withExtras=true —— extraPackages（jdapi 等）拼进异步子包 entry，
  // 其 mergeReconciler 副作用在子包加载时执行，API 挂到 @tarojs/taro（也在异步子包），时序与其他 api 一致。
  const asyncConfig: any = base('async-provider', 'async-provider.js', SHARED_ASYNC_ROOT, true)
  asyncConfig.externals = reverseExternals(globalObject)

  await runWebpack([syncCoreConfig, asyncConfig])

  // 生成 shared-async 占位入口：index.js 同步 require 真实 chunk（async-provider.js），
  // 微信 require.async 只能加载 app.json 注册过的分包页面入口。
  const asyncDir = path.join(outputDir, SHARED_ASYNC_ROOT)
  const fileType = config.fileType || { templ: '.wxml', config: '.json' }
  fs.writeFileSync(path.join(asyncDir, 'index.js'), "require('./async-provider.js');\n")
  fs.writeFileSync(path.join(asyncDir, `index${fileType.config || '.json'}`), '{"usingComponents":{}}\n')
  fs.writeFileSync(path.join(asyncDir, `index${fileType.templ || '.wxml'}`), '<view/>\n')

  // dist 自带运行时：把 shared-async 注册进本项目 dist/app.json，使 dist 可直接被开发者工具打开
  registerAsyncSubPackage(outputDir, fileType.config || '.json')
}

/**
 * 实验 async-host：全量运行时（含 @tarojs/runtime）整条打进 shared-async/ 一个 provider bundle，
 * 无 external（自包含，与 host 全量核同源——复用 entry.host.js，同挂 wx.__TARO_RT__）。
 * 业务包不产任何同步核、MiniWebpackPlugin 不注入 require —— 业务包同步核占用 = 0。
 *
 * 与 split 的关键区别：split 的 async-provider 是"反向 external"的增量包（同步核已提供的不重复打）；
 * async-host 的 provider 是完整独立包（业务包侧完全没有同步核打底），故直接复用 entry.host.js 全量入口，
 * 不能复用 buildSplit 的 reverseExternals（那是给"已有同步核兜底"用的，这里没有同步核）。
 *
 * 导航门控依赖宿主实现（本 PoC 未在 runner 侧生成宿主接入代码，见 SHARED_RUNTIME_DEV.md）：
 * 宿主必须在 navigateTo 任一 taro 页前 await 完 require.async(该 provider)，否则页面顶层
 * `Page(createPageConfig(...))` 执行时 wx.__TARO_RT__ 未就位会直接崩（硬约束，非本函数职责能兜底）。
 */
async function buildAsyncHost (
  base: (name: string, entry: string, emitTo: string, withExtras?: boolean) => any,
  outputDir: string,
  config: any
): Promise<void> {
  const providerConfig: any = base(SHARED_ASYNC_HOST_PROVIDER_NAME, 'entry.host.js', SHARED_ASYNC_ROOT, true)
  await runWebpack([providerConfig])

  // 占位入口：同 split，微信 require.async 只能加载 app.json 注册过的分包页面入口
  const asyncDir = path.join(outputDir, SHARED_ASYNC_ROOT)
  const fileType = config.fileType || { templ: '.wxml', config: '.json' }
  fs.writeFileSync(path.join(asyncDir, 'index.js'), `require('./${SHARED_ASYNC_HOST_PROVIDER_NAME}.js');\n`)
  fs.writeFileSync(path.join(asyncDir, `index${fileType.config || '.json'}`), '{"usingComponents":{}}\n')
  fs.writeFileSync(path.join(asyncDir, `index${fileType.templ || '.wxml'}`), '<view/>\n')

  // dist 自带运行时：注册 subPackage + preloadRule。
  // 注意：单独打开本项目 dist（无宿主门控）访问 taro 页仍会命中硬约束崩溃——这是预期行为，
  // 用于在开发者工具里直观复现「入口不可控」的边界（见 PoC 验证第 2 条）。
  registerAsyncSubPackage(outputDir, fileType.config || '.json')
}

/** 把 shared-async 注册进 dist/app.json 的 subPackages（幂等），并配 preloadRule 预下载 */
function registerAsyncSubPackage (outputDir: string, configExt: string) {
  const appConfigPath = path.join(outputDir, `app${configExt}`)
  if (!fs.existsSync(appConfigPath)) return
  const appConfig = fs.readJSONSync(appConfigPath)
  const subPackages = appConfig.subPackages || appConfig.subpackages || []
  if (!subPackages.some((s: any) => s.root === SHARED_ASYNC_ROOT)) {
    subPackages.push({ root: SHARED_ASYNC_ROOT, pages: ['index'], independent: false })
  }
  appConfig.subPackages = subPackages
  addPreloadRule(appConfig)
  fs.writeJSONSync(appConfigPath, appConfig, { spaces: 2 })
}

/**
 * 配 preloadRule：进入业务页面前预下载 shared-async 分包，缩小首屏异步窗口。
 * 仅对 dist 自带运行时场景（本项目 dist 可直接被开发者工具打开）；宿主场景由接入方按布局自配。
 * 幂等：已存在的 preloadRule 项不覆盖，只对未声明的业务页补 shared-async。
 */
function addPreloadRule (appConfig: any) {
  const preloadRule = appConfig.preloadRule || {}
  // 收集业务页面路径：主包 pages + 各业务子包页面（排除 shared-async 自身）
  const triggerPages: string[] = []
  ;(appConfig.pages || []).forEach((p: string) => triggerPages.push(p))
  ;(appConfig.subPackages || appConfig.subpackages || []).forEach((sub: any) => {
    if (sub.root === SHARED_ASYNC_ROOT) return
    ;(sub.pages || []).forEach((pg: string) => triggerPages.push(`${sub.root}/${pg}`.replace(/\/+/g, '/')))
  })
  triggerPages.forEach((page) => {
    const existing = preloadRule[page]
    if (!existing) {
      preloadRule[page] = { packages: [SHARED_ASYNC_ROOT], network: 'all' }
    } else if (Array.isArray(existing.packages) && !existing.packages.includes(SHARED_ASYNC_ROOT)) {
      existing.packages.push(SHARED_ASYNC_ROOT)
    }
  })
  if (Object.keys(preloadRule).length) appConfig.preloadRule = preloadRule
}

/** async-provider 的反向 external：凡同步核已提供的包都读方案二全局（__TARO_RT_ASYNC__），不打副本 */
function reverseExternals (globalObject: string) {
  const g = `${globalObject}.${SHARED_GLOBAL_ASYNC}`
  const ext = (key: string) => `var ${g}[${JSON.stringify(key)}]`
  return {
    react: ext('react'),
    'react/jsx-runtime': ext('react/jsx-runtime'),
    '@tarojs/runtime': ext('@tarojs/runtime'),
    '@tarojs/shared': ext('@tarojs/shared'),
    '@tarojs/plugin-platform-weapp/dist/runtime': ext('@tarojs/plugin-platform-weapp/dist/runtime'),
  }
}

function getAsyncRequest (config: any): string {
  // 允许接入方通过 config.mini.sharedRuntimeAsyncRequest 覆盖（业务独立编译不预知宿主布局）
  const custom = config.sharedRuntimeAsyncRequest
  if (typeof custom === 'string' && custom) return custom
  // 默认值：相对路径（业务被拷进宿主子包后由接入方按实际布局配置覆盖）
  return `${SHARED_ASYNC_ROOT}/index`
}

/** 主构建 DefinePlugin 不可得时，按 config 重建 runtime 分支常量 */
function buildDefineConstants (config: any): Record<string, any> {
  const runtime = config.runtime || {}
  const framework = config.framework || 'react'
  const buildAdapter = config.buildAdapter || 'weapp'
  return {
    'process.env.FRAMEWORK': JSON.stringify(framework),
    'process.env.TARO_ENV': JSON.stringify(buildAdapter),
    'process.env.TARO_PLATFORM': JSON.stringify(process.env.TARO_PLATFORM || 'mini'),
    'process.env.SUPPORT_TARO_POLYFILL': '"disabled"',
    'process.env.NODE_ENV': JSON.stringify(config.mode || 'production'),
    ENABLE_INNER_HTML: runtime.enableInnerHTML ?? true,
    ENABLE_ADJACENT_HTML: runtime.enableAdjacentHTML ?? false,
    ENABLE_SIZE_APIS: runtime.enableSizeAPIs ?? false,
    ENABLE_TEMPLATE_CONTENT: runtime.enableTemplateContent ?? false,
    ENABLE_CLONE_NODE: runtime.enableCloneNode ?? false,
    ENABLE_CONTAINS: runtime.enableContains ?? false,
    ENABLE_MUTATION_OBSERVER: runtime.enableMutationObserver ?? false,
    // 兜底：额外共享包（如 jdapi）可能用未知的 process.env.X 或裸 process，
    // 小程序无 process 全局 → 未显式定义的都替换掉，避免 "process is not defined"。
    // webpack DefinePlugin 精确键（上面的 process.env.NODE_ENV 等）优先于 'process.env' 前缀键。
    'process.env': '({})',
    process: '({"env":{}})',
  }
}

function runWebpack (configs: any[]): Promise<void> {
  return new Promise((resolve, reject) => {
    webpack(configs, (err, stats) => {
      if (err) return reject(err)
      if (stats?.hasErrors()) return reject(new Error(stats.toString({ errors: true } as any)))
      resolve()
    })
  })
}
