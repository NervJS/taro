/**
 * @tarojs/project-graph — Taro 插件形态入口（独立子入口，不进核心库）
 *
 * 按 OQ-015（2026-07-28 已决）：提供"零代码接入"形态。用户在 `config.plugins`
 * 加一行 `'@tarojs/project-graph/taro-plugin'`，即把项目图接入 Taro build 流程，
 * 无需自行 `new Kernel`。这是唯一同时满足"零代码接入"+"看得到 platforms/plugins"
 * 的形态——CLI 独立进程不注入 Kernel（platforms 恒空），库 API 要消费方自持 Kernel。
 *
 * 设计（对齐 1.3 边界 3 与 mcp.ts 的薄 façade）：
 *  - 本文件是核心库之上的独立入口,不进 index.ts;只做 ctx 编排 + 调 createProjectGraph。
 *  - 不 import `@tarojs/service`、不硬依赖它:插件 ctx 以鸭子类型(any)接收,与核心库
 *    的 `KernelLike` 理念一致。Taro 传入的 ctx 是 Plugin 实例,其 `ctx`(Proxy 透传)
 *    即已 initPresetsAndPlugins 的 Kernel;`appPath` / `runOpts` 经 Kernel Proxy 白名单直达。
 *
 * 关键时序(经 PoC 实测 + 三 agent 复核,见 RFC-0003-P1 附录 C.6):
 *  - **必须在 onBuildStart 回调内建图**:插件函数体执行时平台尚未注册(platforms=[]),
 *    平台由平台插件在其 apply 阶段同步 registerPlatform,onBuildStart 触发时已就绪。
 *  - `taro graph` 子命令执行时 initPresetsAndPlugins 已完成(Kernel.run 顺序保证),
 *    plugins/platforms 已注册,直接建图即可见平台,不依赖 onBuildStart。
 *  - config 校验(doctor)是 build 的前置门:config 非法且未 --no-check 时 Taro 会在
 *    onBuildStart 前 process.exit,插件不执行——这是框架行为,插件不绕过。
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

import { createProjectGraph } from './graph'

import type { ProjectGraphQuery } from './query'
import type { ProjectGraph } from './schema'

/**
 * Kernel 上挂载图实例的键,供同进程其它插件(如 taro-pilot)复用,免重复建图。
 *
 * 契约:仅在 build 流程 onBuildStart 触发后、或 `taro graph` 命令执行后,该键才有值。
 * 其它命令、或 onBuildStart 之前,`kernel[PROJECT_GRAPH_KERNEL_KEY]` 为 undefined。
 * 消费方应判空。
 */
export const PROJECT_GRAPH_KERNEL_KEY = '__projectGraph' as const

/** 插件参数。 */
export interface ProjectGraphPluginOptions {
  /**
   * 落盘路径(相对工程根或绝对路径)。给定时,每次 build(onBuildStart)后把完整图
   * 以 JSON 写到该路径,供外部工具/CI 消费。不给则不写文件(仅内存 + `taro graph` 命令)。
   */
  output?: string
}

/**
 * 把图写到指定路径(相对工程根解析)。目录不存在则递归创建。
 * 供 build 落盘与 `taro graph --output` 复用。
 */
function writeGraphFile(graph: ProjectGraph, appPath: string, output: string): string {
  const target = path.isAbsolute(output) ? output : path.join(appPath, output)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, JSON.stringify(graph, null, 2), 'utf8')
  return target
}

/** 概览文本(人类可读),与 CLI formatOverview 同信息量,此处内联避免跨入口耦合。 */
function formatOverview(graph: ProjectGraph): string {
  const lines = [
    `framework: ${graph.framework}   platforms: [${graph.platforms.join(', ')}]`,
    `pages: ${graph.pages.length}   edges: ${graph.edges.length}   plugins: ${graph.plugins.length}   warnings: ${graph.warnings.length}`,
    'Pages:',
    ...graph.pages.map((p) => `  ${p.id}${p.inSubpackage ? `  [subpackage ${p.inSubpackage}]` : ''}`),
  ]
  return lines.join('\n')
}

/**
 * Taro 插件默认导出。ctx 为 Taro 注入的插件上下文(Plugin 实例)。
 *
 * @param ctx Taro 插件上下文;`ctx.ctx` 是 Kernel,`ctx.appPath` / `ctx.runOpts`
 *   经 Kernel Proxy 白名单直达。以 any 接收以避免对 `@tarojs/service` 的类型硬依赖。
 * @param opts 用户在 config.plugins 传入的插件参数。`output` 给定时 build 后落盘图 JSON。
 */
export default function projectGraphPlugin(ctx: any, opts?: ProjectGraphPluginOptions): void {
  let query: ProjectGraphQuery | undefined
  const output = typeof opts?.output === 'string' && opts.output ? opts.output : undefined

  // build 流程:onBuildStart 触发时平台已注册,此刻建图并挂到 Kernel 供同进程复用。
  // 裹 try/catch:本插件是诊断/事实层,建图失败(异常 config、损坏文件等)绝不能拖垮
  // 用户 build——onBuildStart 的异常会经 applyPlugins 冒泡中断整个 build。核心库
  // graph.ts 的 rebuild 出于同因也吞异常(见其注释)。失败降级为 warn,build 照常。
  ctx.onBuildStart(() => {
    try {
      const kernel = ctx.ctx
      query = createProjectGraph({ root: ctx.appPath, kernel })
      kernel[PROJECT_GRAPH_KERNEL_KEY] = query
      // 配置了 output 则落盘一份完整图(写盘失败同样不拖垮 build)。
      if (output != null) {
        const target = writeGraphFile(query.getProjectGraph(), ctx.appPath, output)
        // eslint-disable-next-line no-console
        console.log(`[project-graph] 项目图已写入 ${target}`)
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[project-graph] 构建项目图失败,已跳过(不影响 build):${(err as Error).message}`)
    }
  })

  // `taro graph` 子命令:命令执行时 Kernel 已 initPresetsAndPlugins,可直接建图看平台。
  ctx.registerCommand({
    name: 'graph',
    optionsMap: {
      '--json': '输出稳定 JSON(外部脚本可解析)',
      '--route': '查询单条路由并打印命中页面详情',
      '--output': '把完整图写入指定文件(相对工程根或绝对路径)',
    },
    synopsisList: [
      'taro graph',
      'taro graph --json',
      'taro graph --route=/pages/index/index',
      'taro graph --output=.taro/project-graph.json',
    ],
    fn() {
      if (query == null) {
        query = createProjectGraph({ root: ctx.appPath, kernel: ctx.ctx })
        // 与 onBuildStart 分支对称:挂到 Kernel 供同进程其它插件复用。
        ctx.ctx[PROJECT_GRAPH_KERNEL_KEY] = query
      }
      const args = ctx.runOpts?.options ?? {}
      // --output 优先:落盘(命令行 --output 覆盖插件 opts.output)。
      const outPath = typeof args.output === 'string' && args.output ? args.output : output
      if (outPath != null) {
        const target = writeGraphFile(query.getProjectGraph(), ctx.appPath, outPath)
        // eslint-disable-next-line no-console
        console.log(`项目图已写入 ${target}`)
        return
      }
      if (args.json) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(query.getProjectGraph(), null, 2))
        return
      }
      if (typeof args.route === 'string') {
        const page = query.findPageByRoute(args.route)
        // eslint-disable-next-line no-console
        console.log(page != null ? JSON.stringify(page, null, 2) : `路由 ${args.route} 未找到对应页面`)
        return
      }
      // eslint-disable-next-line no-console
      console.log(formatOverview(query.getProjectGraph()))
    },
  })
}
