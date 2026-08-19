import * as path from 'node:path'

import { fs } from '@tarojs/helper'
import webpack from 'webpack'

import { RUNTIME_GLOBAL_VERSION, SHARED_ASYNC_PROVIDER_NAME, SHARED_ASYNC_ROOT, SHARED_GLOBAL_ASYNC, SHARED_SYNC_CORE_NAME } from './constants'
import { computeMissingRuntimes, SYNC_REACT_MEMBERS } from './externals'

import type { MiniCombination } from '../webpack/MiniCombination'

/**
 * 主构建成功后，额外跑独立 webpack 子构建产出共享运行时（方案二 split）：
 *   - sync-core（taro-shared-sync.js）：随业务包，emit 到 outputDir 根，同步 require。
 *   - async-provider：放异步子包 shared-async-v1/，全局共享一份。
 *
 * 为何独立 webpack 而非 child compiler：主构建 externals 把 @tarojs/*+react 外置了，
 * 而这些 bundle 要把它们真正打进产物，依赖集正相反。独立 compiler 自带反向 external。
 * 依赖解析：react/@tarojs/* 从用户项目 node_modules 解析（resolve.modules 指向 appPath）。
 */
export async function buildSharedRuntime (combination: MiniCombination): Promise<void> {
  const { appPath, outputDir } = combination
  const config = combination.config
  const globalObject = config.output?.globalObject || 'wx'
  const shimDir = path.resolve(__dirname) // dist/shared-runtime（运行时模板所在）
  const userNodeModules = path.resolve(appPath, 'node_modules')

  const asyncRequest = getAsyncRequest(config)

  // 共享运行时模板子构建的 DefinePlugin 常量：按 config 重建 runtime 分支常量（保 DOM 分支与主构建一致），
  // 叠加运行时模板所需的宏。
  const defineConstants = {
    // 接入方通过插件/webpackChain 注入主构建的自定义 DefinePlugin 常量（如某私有插件的
    // process.env.SOME_RUNTIME_FLAG）。extraPackages 的 runtime 打进异步核，其行为
    // 常被这些编译期 define 控制；异步核是独立子构建，不继承主构建的 DefinePlugin，若不透传，
    // buildDefineConstants 里兜底的 'process.env':'({})' 会把它们吞成 undefined（如
    // "true"===({}).SOME_RUNTIME_FLAG → false），导致对应运行时特性静默失效。
    // 放在最前：Taro 核心 runtime 常量与模板宏在后覆盖，避免业务 define 意外改写核心分支。
    ...collectUserDefineConstants(combination),
    ...buildDefineConstants(config),
    // 运行时模板（entry.sync.js / async-provider.js）引用的宏，单一来源为 constants.ts + globalObject 配置：
    // 注意：__TARO_GLOBAL_OBJECT__ 是**标识符**（不 JSON.stringify），其它是**字符串常量**（JSON.stringify）。
    __TARO_GLOBAL_OBJECT__: globalObject,
    __TARO_SHARED_GLOBAL__: JSON.stringify(SHARED_GLOBAL_ASYNC),
    __TARO_SHARED_ASYNC_REQUEST__: JSON.stringify(asyncRequest),
    __TARO_RUNTIME_VERSION__: JSON.stringify(RUNTIME_GLOBAL_VERSION),
  }

  // 接入方声明的额外共享包（CLI 不认识具体包名），按加载时机分两类:
  //   - sharedRuntimeExtraPackages: 随异步核加载,多业务包共享(不参与首屏时序的 API 定义/异步初始化)
  //   - sharedRuntimeSyncExtraPackages: 随同步核加载,每业务包各带一份(必须在首屏 window INIT
  //     广播之前注册监听器/写全局状态等——异步核 .then 晚于首屏 onLoad,时机敏感副作用放这里)
  // 两者都会被 shouldShareExternal 识别为共享 external,不进业务包主 bundle,只是执行时机不同.
  const extraPackages: string[] = config.sharedRuntimeExtraPackages || []
  const syncExtraPackages: string[] = config.sharedRuntimeSyncExtraPackages || []

  // 平台插件（plugin-html/plugin-inject/plugin-http/*-devtools 等）通过 platform.runtimePath 注入的
  // side-effect runtime 也是 @tarojs/*，被主构建 external 成读共享全局，但运行时核只注册固定清单，
  // 会漏掉它们 → 业务包读到 undefined → 其 hooks.tap 从未执行（如 plugin-html 的 <i> 标签映射失效，
  // 报 `Template tmpl_0_i not found`）。这里从 runtimePath 挑出漏网项，一并作为同步核额外入口打包执行，
  // 使其副作用在同步核内（与模板消费方同一 @tarojs/shared 单例）就位。对业务透明，无需手动声明。
  const missingRuntimes = computeMissingRuntimes(config.runtimePath, extraPackages, syncExtraPackages)

  // entry 用数组多入口:extras 先执行副作用,最后核心 entry.
  // 数组多入口 webpack 会按 __webpack_exec__ 序列依次执行,extras 顶层副作用(mergeReconciler
  // 等)必然先于核心 entry 完成——mock-exec 已实测证实(用 Node vm 跑产物 + mock @tarojs/shared,
  // 验证 hostConfig 被 tap、initNativeApi hook 就位).
  const buildEntry = (coreEntryFile: string, extras: string[]) => {
    const core = path.join(shimDir, coreEntryFile)
    return extras.length ? [...extras, core] : core
  }

  const base = (name: string, entry: string, emitTo: string, extras: string[]) => ({
    name,
    mode: 'production' as const,
    target: ['web', 'es5'] as any,
    entry: buildEntry(entry, extras),
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

  // sync-core：放 outputDir 根。SyncExtraPackages 走同步核入口(时机敏感副作用).
  // missingRuntimes 前置：它们是平台级 side-effect runtime，tap 幂等无顺序依赖，前置更符合语义.
  // require.async(shared-async-v1/index) 由 externalsType='promise' 编译得到。
  const syncCoreConfig: any = base(SHARED_SYNC_CORE_NAME, 'entry.sync.js', '', [...missingRuntimes, ...syncExtraPackages])
  syncCoreConfig.externalsType = 'promise'
  syncCoreConfig.externals = { [asyncRequest]: `require.async(${JSON.stringify(asyncRequest)})` }

  // async-provider：放 shared-async-v1/。extraPackages(异步)以数组多入口在核心 entry 前先执行副作用.
  const asyncConfig: any = base(SHARED_ASYNC_PROVIDER_NAME, 'async-provider.js', SHARED_ASYNC_ROOT, extraPackages)
  asyncConfig.externals = reverseExternals(globalObject)

  await runWebpack([syncCoreConfig, asyncConfig])

  // subPackageIndie 自包含:把刚产出的同步核 taro-shared-sync.js 拷进每个 mainPackageRoot。
  // subPackageIndie 会把 app.js 等 runtime chunks 搬进 mainPackageRoot 目录,app.js 头部的
  // require("./taro-shared-sync") 是"同级"引用——同步核也必须在同目录才对。根级那份保留
  // (ENTRY / F6 native-components 仍从根级 require)。mainPackageRoots 由 MiniPlugin.apply
  // 反向挂在 combination 上;非 subPackageIndie 场景该列表为空,此步跳过。
  copySyncCoreIntoMainPackageRoots(outputDir, combination.subPackageIndiePlugin?.getAllMainPackageRoots?.() || [])

  // 生成 shared-async 占位入口：index.js 同步 require 真实 chunk（async-provider.js），
  // 微信 require.async 只能加载 app.json 注册过的分包页面入口。
  const asyncDir = path.join(outputDir, SHARED_ASYNC_ROOT)
  const fileType = config.fileType || { templ: '.wxml', config: '.json' }
  fs.writeFileSync(path.join(asyncDir, 'index.js'), `require('./${SHARED_ASYNC_PROVIDER_NAME}.js');\n`)
  fs.writeFileSync(path.join(asyncDir, `index${fileType.config || '.json'}`), '{"usingComponents":{}}\n')
  fs.writeFileSync(path.join(asyncDir, `index${fileType.templ || '.wxml'}`), '<view/>\n')

  // 产物元数据 manifest：记录本次共享运行时用到的 react 全家桶精确版本 + 运行时协议版本。
  // 供宿主/接入方排查版本一致性（多业务包 + 宿主 provider 的 react 单例必须版本一致）。
  writeRuntimeManifest(asyncDir, userNodeModules, extraPackages, syncExtraPackages)

  // dist 自带运行时：把 shared-async 注册进本项目 dist/app.json + 配 preloadRule，使 dist 可直接被开发者工具打开。
  registerAsyncSubPackage(outputDir, fileType.config || '.json')
}

/**
 * subPackageIndie 自包含:把 outputDir 根的 taro-shared-sync.js(及其 .LICENSE.txt)拷进每个
 * mainPackageRoot 目录,使其与被 subPackageIndie 搬进去的 app.js 同级(app.js 头部 require 的是
 * "./taro-shared-sync",天然同级)。mainPackageRoots 为空时(非 subPackageIndie)直接跳过。
 *
 * 拷贝后清理根级冗余:subPackageIndie 的 optimizeAssets 已删掉根级 app.js(SubPackageIndiePlugin
 * 接管了根级 ENTRY),故根级 taro-shared-sync.js 不再有消费者(ENTRY app.js 没了;native-components
 * 是互斥的另一种构建,不会有 mainPackageRoot)。此时删根级那份,与 taro-blended-project@main 的
 * 产物结构对齐(businessRoot 根不含同步核)。保守判断:仅当根级确无 app.js 时才删,避免误伤。
 */
function copySyncCoreIntoMainPackageRoots (outputDir: string, mainPackageRoots: string[]) {
  if (!mainPackageRoots.length) return
  const syncCoreFile = `${SHARED_SYNC_CORE_NAME}.js`
  const src = path.join(outputDir, syncCoreFile)
  if (!fs.existsSync(src)) return
  const licenseFile = `${syncCoreFile}.LICENSE.txt`
  const licenseSrc = path.join(outputDir, licenseFile)
  const hasLicense = fs.existsSync(licenseSrc)
  for (const root of mainPackageRoots) {
    const destDir = path.join(outputDir, root)
    if (!fs.existsSync(destDir)) continue
    fs.copySync(src, path.join(destDir, syncCoreFile), { overwrite: true })
    if (hasLicense) fs.copySync(licenseSrc, path.join(destDir, licenseFile), { overwrite: true })
  }
  // 根级冗余清理:根级 app.js 已被 subPackageIndie 删除 → 根级同步核无消费者,删之对齐 main。
  if (!fs.existsSync(path.join(outputDir, 'app.js'))) {
    fs.removeSync(src)
    if (hasLicense) fs.removeSync(licenseSrc)
  }
}

/**
 * 写产物元数据 manifest（runtime-manifest.json）到异步子包目录。
 * 记录 react 全家桶（React 单例敏感、版本错配会真出错）精确版本 + 运行时协议版本号。
 * 定位：仅产物元数据，供宿主/人工排查；运行时跨包错配由同步核/异步核的 __rtVersion 校验兜底。
 *
 * extraPackages（config.mini.sharedRuntimeExtraPackages，如某私有插件的 runtime）的版本也一并记录：
 * 它们随异步核打包共享,多业务包若声明不同版本会静默漂移（不像 react 全家桶有 __rtVersion 硬 gate）。
 * 这里只做**记录**供人工排查——不做编译期 gate（这些包的版本差异未必出错,硬 gate 易误报,与
 * react 全家桶的处理策略一致:只 react 全家桶做硬校验）。
 */
function writeRuntimeManifest (asyncDir: string, userNodeModules: string, extraPackages: string[] = [], syncExtraPackages: string[] = []) {
  const REACT_FAMILY = ['react', 'react-dom', 'react-reconciler', 'scheduler', '@tarojs/react']
  const versions: Record<string, string> = {}
  REACT_FAMILY.forEach((pkg) => {
    const v = readPackageVersion(userNodeModules, pkg)
    if (v) versions[pkg] = v
  })
  // extraPackages 可能带子路径（如 '@scope/my-shared-plugin/runtime-mini'），
  // 版本要从包根 package.json 读——取 scope/包名部分（前 1 或 2 段）作为 readPackageVersion 的 key。
  const collectVersions = (pkgs: string[]) => {
    const out: Record<string, string> = {}
    pkgs.forEach((pkg) => {
      const pkgRoot = pkg.startsWith('@') ? pkg.split('/').slice(0, 2).join('/') : pkg.split('/')[0]
      const v = readPackageVersion(userNodeModules, pkgRoot)
      if (v) out[pkgRoot] = v
    })
    return out
  }
  const extraVersions = collectVersions(extraPackages)
  const syncExtraVersions = collectVersions(syncExtraPackages)
  const manifest = {
    runtimeProtocolVersion: RUNTIME_GLOBAL_VERSION,
    global: SHARED_GLOBAL_ASYNC,
    subPackage: SHARED_ASYNC_ROOT,
    reactFamilyVersions: versions,
    extraPackageVersions: extraVersions,
    syncExtraPackageVersions: syncExtraVersions,
  }
  fs.writeFileSync(path.join(asyncDir, 'runtime-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
}

/** 从指定 node_modules 读取包的 version（读不到返回空串，不阻断构建） */
function readPackageVersion (nodeModules: string, pkg: string): string {
  try {
    const pkgJson = fs.readJSONSync(path.join(nodeModules, pkg, 'package.json'))
    return pkgJson.version || ''
  } catch {
    return ''
  }
}

/** 把 shared-async 注册进 dist/app.json 的 subPackages（幂等），并配 preloadRule 预下载 */
function registerAsyncSubPackage (outputDir: string, configExt: string) {
  const appConfigPath = path.join(outputDir, `app${configExt}`)
  if (!fs.existsSync(appConfigPath)) return
  const appConfig = fs.readJSONSync(appConfigPath)
  // 保留项目原用的大小写键：subPackages（默认）或小写 subpackages。避免两种大小写同时写回导致微信双注册冲突。
  const key = appConfig.subpackages && !appConfig.subPackages ? 'subpackages' : 'subPackages'
  const subPackages = appConfig[key] || []
  if (!subPackages.some((s: any) => s.root === SHARED_ASYNC_ROOT)) {
    subPackages.push({ root: SHARED_ASYNC_ROOT, pages: ['index'], independent: false })
  }
  appConfig[key] = subPackages
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

/**
 * async-provider 的反向 external：凡同步核已提供的包都读方案二全局，不打副本，避免双实例。
 * react 全家桶部分（含开发模式 jsx-dev-runtime）与 entry.sync.js 同步注册的清单保持一致——
 * 单一真理源为 externals.ts 的 SYNC_REACT_MEMBERS，改动只需改那一处。
 */
function reverseExternals (globalObject: string) {
  const g = `${globalObject}.${SHARED_GLOBAL_ASYNC}`
  const ext = (key: string) => `var ${g}[${JSON.stringify(key)}]`
  const result: Record<string, string> = {
    // 非 react 部分：@tarojs/* 运行时和平台 runtime，同步核已提供
    '@tarojs/runtime': ext('@tarojs/runtime'),
    '@tarojs/shared': ext('@tarojs/shared'),
    '@tarojs/plugin-platform-weapp/dist/runtime': ext('@tarojs/plugin-platform-weapp/dist/runtime'),
  }
  // react 全家桶部分：从 externals.ts 单一清单展开
  for (const m of SYNC_REACT_MEMBERS) result[m] = ext(m)
  return result
}

function getAsyncRequest (config: any): string {
  // 允许接入方通过 config.mini.sharedRuntimeAsyncRequest 覆盖（业务独立编译不预知宿主布局）
  const custom = config.sharedRuntimeAsyncRequest
  if (typeof custom === 'string' && custom) return custom
  // 默认值：相对路径（业务被拷进宿主子包后由接入方按实际布局配置覆盖）
  return `${SHARED_ASYNC_ROOT}/index`
}

/**
 * 从主构建 webpack chain 收集接入方注入的自定义 DefinePlugin 常量，透传给异步核子构建。
 *
 * 场景：某私有插件通过 webpackChain 独立 new DefinePlugin 注入
 * `process.env.SOME_RUNTIME_FLAG` 等编译期开关，控制其 runtime 行为。这些插件的
 * runtime 被 sharedRuntimeExtraPackages 打进异步核，但异步核是独立子构建、不继承主构建的
 * DefinePlugin，若不透传，这些 `process.env.X` 会被兜底的 'process.env':'({})' 吞成 undefined，
 * 导致对应特性静默失效（本次真机现象：根字号开关失效 → root-font-size 空 → 字体变小）。
 *
 * 仅收集**具名精确键**（如 'process.env.X'、裸标识符），显式跳过 'process' / 'process.env' 这类
 * 前缀/裸键——它们由 buildDefineConstants 的兜底策略统一处理，不能被业务值覆盖。调用时机在主构建
 * 结束后（chain 已 finalize，所有插件含业务 DefinePlugin 都已装配），从 combination.chain 遍历。
 */
function collectUserDefineConstants (combination: MiniCombination): Record<string, any> {
  const result: Record<string, any> = {}
  const chain: any = (combination as any).chain
  const store = chain?.plugins?.store
  if (!store || typeof store.forEach !== 'function') return result
  store.forEach((plugin: any) => {
    try {
      // 识别 DefinePlugin:优先引用相等(同一 webpack 实例时成立);兜底按构造器名——
      // 极端场景下业务插件自行 require('webpack') 解析到未被 pnpm 去重的另一实例时,
      // 引用相等会失败,靠 .name === 'DefinePlugin' 仍能命中,避免静默漏收其 define 常量。
      const ctor = plugin?.get?.('plugin')
      if (ctor !== webpack.DefinePlugin && ctor?.name !== 'DefinePlugin') return
      const defs = (plugin.get('args') || [])[0]
      if (!defs || typeof defs !== 'object') return
      Object.keys(defs).forEach((key) => {
        // 跳过前缀/裸键，交给兜底；其余具名键透传（后续 buildDefineConstants 会覆盖同名核心键）
        if (key === 'process' || key === 'process.env') return
        result[key] = defs[key]
      })
    } catch {
      /* 单个插件读取失败不影响整体，跳过 */
    }
  })
  return result
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
    // 兜底：额外共享包可能用未知的 process.env.X 或裸 process，
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
