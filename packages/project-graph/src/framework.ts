/**
 * @tarojs/project-graph — Framework 六值判定（WP5b）
 *
 * §4.1：framework 六值（react/preact/solid/vue3/none/unknown）判定。取值优先级：
 *   显式 options > 注入 Kernel > 项目静态配置（package.json）> 降级默认（unknown）。
 *
 * 关键约束：
 *  - 无 Kernel 且静态推断失败 → 'unknown'，**不得回退 none 或 react**。
 *  - 'none' 表示**确为**无框架 / dynamic 原生工程——静态阶段难以确证，故本实现只在
 *    有明确无框架信号时取 none；不确定一律 unknown（诚实降级，不臆造）。
 *  - native 是 source/platform 维度，不是 framework。
 *  - 单项目单 AnalysisContext：顶层 ProjectGraph.framework 与逐页 PageNode.framework
 *    取同一判定值（§3.2）。
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

import type { TContextSource, TFrameworkKind } from './schema'

/** framework 判定结果：值 + 来源（写入 IAnalysisContext.framework/frameworkSource）。 */
export interface IFrameworkResolution {
  framework: TFrameworkKind
  frameworkSource: TContextSource
}

/**
 * 判定项目 framework 六值（§4.1 优先级链）。
 *
 * @param options.explicit  显式指定的 framework（最高优先级，来自 createProjectGraph
 *   调用方；当前无此入参，预留）。
 * @param options.kernelFramework  注入 Kernel 的 initialConfig.framework（求值后配置）。
 * @param options.projectRoot  工程根，用于静态读 package.json 推断。
 */
export function resolveFramework(options: {
  explicit?: string
  kernelFramework?: unknown
  projectRoot: string
}): IFrameworkResolution {
  // 1. 显式 options（最高优先级）。
  const explicit = normalizeFramework(options.explicit)
  if (explicit != null) return { framework: explicit, frameworkSource: 'options' }

  // 2. 注入 Kernel 的 initialConfig.framework（求值后可信配置）。
  const fromKernel = normalizeFramework(options.kernelFramework)
  if (fromKernel != null) return { framework: fromKernel, frameworkSource: 'kernel' }

  // 3. 项目静态配置：package.json 依赖推断。
  const fromStatic = inferFromPackageJson(options.projectRoot)
  if (fromStatic != null) return { framework: fromStatic, frameworkSource: 'static-config' }

  // 4. 降级默认：unknown（不得回退 none/react）。
  return { framework: 'unknown', frameworkSource: 'default' }
}

/**
 * 归一化一个可能的 framework 字符串到六值之一（认识的才返回，否则 undefined）。
 * 对齐主仓 FRAMEWORK_MAP（react/vue3/solid）+ 六值扩展（preact）。'vue' 归 'vue3'
 * （Taro 4 只支持 Vue3）。
 */
function normalizeFramework(value: unknown): TFrameworkKind | undefined {
  if (typeof value !== 'string') return undefined
  const v = value.toLowerCase().trim()
  switch (v) {
    case 'react':
      return 'react'
    case 'preact':
      return 'preact'
    case 'solid':
      return 'solid'
    case 'vue3':
    case 'vue':
      return 'vue3'
    case 'none':
      return 'none'
    default:
      return undefined
  }
}

/**
 * 从 `<projectRoot>/package.json` 的依赖静态推断 framework。
 *
 * 优先看 Taro 框架插件（`@tarojs/plugin-framework-<x>`），其次看框架本体依赖
 * （preact / solid-js / vue / react）。preact 先于 react 判定（preact 工程通常也带
 * react 别名/兼容依赖，先判 preact 避免误报 react）。读不到 / 无已知框架 → undefined
 * （交由降级为 unknown，不臆造 none）。
 */
function inferFromPackageJson(projectRoot: string): TFrameworkKind | undefined {
  const pkgPath = path.join(projectRoot, 'package.json')
  let deps: Record<string, unknown>
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as Record<string, unknown>
    deps = { ...(pkg.dependencies as object), ...(pkg.devDependencies as object) }
  } catch {
    return undefined
  }

  // Taro 框架插件（最强信号）。
  if ('@tarojs/plugin-framework-react' in deps) return 'react'
  if ('@tarojs/plugin-framework-vue3' in deps) return 'vue3'
  if ('@tarojs/plugin-framework-solid' in deps) return 'solid'

  // 框架本体依赖（preact 先于 react；vue 归 vue3）。
  if ('preact' in deps) return 'preact'
  if ('solid-js' in deps) return 'solid'
  if ('vue' in deps) return 'vue3'
  if ('react' in deps) return 'react'

  return undefined
}

/**
 * 该 framework 是否参与 JSX 通道分析（§4.3 / capabilities 静态表单一出处）。
 * react/preact/solid 参与（跑 JSX componentUsage 图、jsxAnalyzer 聚合）；vue3
 * （config-only、JSX render function 本期 deferred）、none、unknown 不参与。
 * graph.ts 的 JSX 通道门控与 capabilities 的 jsxAnalyzer 判定都调本函数，避免两处
 * 独立字面量漂移导致「跑了 JSX 却报 unsupported」的矛盾。
 */
export function jsxParticipatesIn(framework: TFrameworkKind): boolean {
  return framework === 'react' || framework === 'preact' || framework === 'solid'
}
