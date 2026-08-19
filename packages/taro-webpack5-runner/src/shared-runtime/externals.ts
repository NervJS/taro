import { REG_TARO_SCOPED_PACKAGE, taroJsComponents } from '@tarojs/helper'

import { REG_POST, SYNC_CORE_REGISTERED_RUNTIMES } from './constants'

/**
 * 共享运行时（方案二 split）需 external 到共享全局的 React 全家桶。
 * 这四个包 React 单例敏感、版本错配会真出错，必须共享同一实例：
 * react 本体/jsx-runtime 在同步核，react-dom/react-reconciler/scheduler 在异步核，
 * 但对业务包而言都 external 到同一个全局对象，由运行时核在加载时注册齐全。
 */
export const REG_SHARED_REACT = /^(react|react-dom|react-reconciler|scheduler)(\/|$)/

/**
 * React 全家桶各成员在共享运行时中的分工——单一真理源，所有 runner 侧引用都从这里取。
 *
 * SYNC_REACT_MEMBERS：随同步核打包并 share() 到全局。
 *   业务 app.js 顶层 `class App extends React.Component` 需 react 本体同步就位；
 *   dev 构建启用自动 JSX runtime 时需 react/jsx-dev-runtime 同步就位。
 *
 * ASYNC_REACT_MEMBERS：随异步核 provider 打包并 share() 到全局。
 *   业务包 external 了这两个，真身在异步核内，须显式挂全局，否则 require 拿到 undefined。
 *
 * 注：entry.sync.js 是手写 .js 模板由 webpack 打包，`require(...)` 的 arg 必须是字面量
 * 才能被静态分析——无法用宏展开成动态数组遍历。故 entry.sync.js 里 react/jsx-runtime/
 * jsx-dev-runtime 的 require 仍是字面量；改动本清单时必须同步 entry.sync.js。
 */
export const SYNC_REACT_MEMBERS: readonly string[] = ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime']
export const ASYNC_REACT_MEMBERS: readonly string[] = ['react-reconciler', 'scheduler']

/** React 全家桶所有需注册到共享全局的 key（同步 + 异步），用于 provider 的 reverseExternals 构造 */
export const ALL_REACT_MEMBERS: readonly string[] = [...SYNC_REACT_MEMBERS, ...ASYNC_REACT_MEMBERS, 'react-dom']

/**
 * 判断一个模块请求是否应被 external 到共享运行时全局（方案二 split）。
 * @param request 裸模块请求名，如 'react'、'@tarojs/runtime'
 * @param extraPackages 接入方声明的额外共享包（config.mini.sharedRuntimeExtraPackages）
 */
export function shouldShareExternal (request?: string, extraPackages: string[] = []): boolean {
  if (!request) return false
  // 只处理裸模块请求：排除内联 loader(!)、query(?)、相对/绝对路径
  if (/[!?]/.test(request) || request.startsWith('.') || request.startsWith('/')) return false
  // @tarojs/taro-loader 是编译期 loader，不能 external
  if (request.startsWith('@tarojs/taro-loader')) return false
  // @tarojs/components 不能 external：Taro 的 base.wxml 模板收集依赖组件在编译模块图中可见，
  // external 后模板生成器扫不到组件使用会漏生成模板（如 Button 的 tmpl_0_14）。
  // 且组件本身是 'view'/'button' 字符串常量，体积极小，各业务包自带无成本。
  if (request === taroJsComponents || request.startsWith(`${taroJsComponents}/`)) return false
  // 接入方声明的额外共享包（CLI 不认识具体包名，由 config.mini.sharedRuntimeExtraPackages 传入）
  if (extraPackages.some((p: string) => request === p || request.startsWith(`${p}/`))) return true
  return REG_TARO_SCOPED_PACKAGE.test(request) || REG_SHARED_REACT.test(request)
}

/**
 * 计算「被主构建 external 到共享全局、却没有任何运行时核注册」的漏网 runtime。
 *
 * 背景：平台插件（@tarojs/plugin-html / plugin-inject / plugin-http / *-devtools 等）通过
 * `platform.runtimePath.push(...)` 往 runtimePath 追加自己的 side-effect runtime（如 plugin-html
 * 的 `hooks.tap('modifyHydrateData')` 把 <i> 等 HTML 标签 nodeName 映射成 view/text）。taro-loader
 * 把 runtimePath 每项生成 `import '<path>'` 注入业务 app.js。共享运行时下这些 @tarojs/* 被
 * shouldShareExternal 无差别 external 成读全局，但同步核/异步核只注册了固定清单（见
 * SYNC_CORE_REGISTERED_RUNTIMES + async-provider），漏掉这些插件 runtime → 业务包读到 undefined
 * → hook 从未注册 → 出现 `Template tmpl_0_i not found` 等运行时症状。
 *
 * 本函数挑出这批漏网模块，交给 build-shared-runtime 作为同步核的额外入口一并打包执行，使其
 * hooks.tap 在同步核内（与模板消费方同一 @tarojs/shared 单例）就位。不硬编码任何插件名。
 *
 * @param runtimePath   combination.config.runtimePath（插件追加后的完整值，string | string[]）
 * @param extraPackages config.mini.sharedRuntimeExtraPackages（已被异步核显式接管，需排除）
 * @param syncExtraPackages config.mini.sharedRuntimeSyncExtraPackages（已被同步核显式接管，需排除）
 */
export function computeMissingRuntimes (
  runtimePath?: string | string[],
  extraPackages: string[] = [],
  syncExtraPackages: string[] = []
): string[] {
  const list = (Array.isArray(runtimePath) ? runtimePath : [runtimePath])
    .filter((p): p is string => typeof p === 'string' && p.length > 0)
    // 剥离 taro-loader 的 post: 前缀（其语义是业务 app.js import 排序，与同步核内执行序无关）
    .map((p) => p.replace(REG_POST, ''))
  const registered = new Set<string>(SYNC_CORE_REGISTERED_RUNTIMES)
  const claimed = new Set<string>([...extraPackages, ...syncExtraPackages])
  const seen = new Set<string>()
  const result: string[] = []
  for (const p of list) {
    if (seen.has(p)) continue
    seen.add(p)
    // 只挑「会被主构建 external 的 @tarojs/*」（=运行时核需负责提供的），排除平台 runtime（已注册）
    // 与已被 extra/syncExtra 显式接管的，剩下的即漏网。
    if (shouldShareExternal(p, [...extraPackages, ...syncExtraPackages]) && !registered.has(p) && !claimed.has(p)) {
      result.push(p)
    }
  }
  return result
}
