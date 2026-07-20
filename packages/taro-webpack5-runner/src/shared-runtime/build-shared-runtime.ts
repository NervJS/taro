import * as path from 'node:path'

import { fs } from '@tarojs/helper'
import webpack from 'webpack'

import { SHARED_ASYNC_ROOT, SHARED_SYNC_CORE_NAME } from './constants'

import type { MiniCombination } from '../webpack/MiniCombination'

/**
 * 方案二 split：主构建成功后，额外跑两个独立 webpack 子构建，产出共享运行时：
 *   - sync-core（emit 到 outputDir 根 `${SHARED_SYNC_CORE_NAME}.js`）：随业务包、app.js 顶层同步 require
 *   - async-provider（emit 到 `${SHARED_ASYNC_ROOT}/`）：react+framework+api 异步子包
 *
 * 为何独立 webpack 而非 child compiler：主构建 externals 把 @tarojs/*+react 外置了，
 * 而这两个 bundle 要把它们【真正打进产物】，依赖集正相反。独立 compiler 自带反向 external。
 *
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

  const asyncRequest = getAsyncRequest(config)

  const base = (name: string, entry: string, emitTo: string) => ({
    name,
    mode: 'production' as const,
    target: ['web', 'es5'] as any,
    entry: path.join(shimDir, entry),
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

  // sync-core：放 outputDir 根；bootstrap 的 require('shared-async/index') → require.async(asyncRequest)
  const syncCoreConfig: any = base(SHARED_SYNC_CORE_NAME, 'entry.sync.js', '')
  syncCoreConfig.externalsType = 'promise'
  syncCoreConfig.externals = { 'shared-async/index': `require.async(${JSON.stringify(asyncRequest)})` }

  // async-provider：放 shared-async/；react/runtime/shared 等 external 到 wx.__TARO_SHARED__（读同步核那份，保单例）
  const asyncConfig: any = base('async-provider', 'async-provider.js', SHARED_ASYNC_ROOT)
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

/** 把 shared-async 注册进 dist/app.json 的 subPackages（幂等） */
function registerAsyncSubPackage (outputDir: string, configExt: string) {
  const appConfigPath = path.join(outputDir, `app${configExt}`)
  if (!fs.existsSync(appConfigPath)) return
  const appConfig = fs.readJSONSync(appConfigPath)
  const subPackages = appConfig.subPackages || appConfig.subpackages || []
  if (!subPackages.some((s: any) => s.root === SHARED_ASYNC_ROOT)) {
    subPackages.push({ root: SHARED_ASYNC_ROOT, pages: ['index'], independent: false })
  }
  appConfig.subPackages = subPackages
  fs.writeJSONSync(appConfigPath, appConfig, { spaces: 2 })
}

/** async-provider 的反向 external：凡同步核已提供的包都读全局，不打副本 */
function reverseExternals (globalObject: string) {
  const g = `${globalObject}.__TARO_SHARED__`
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
