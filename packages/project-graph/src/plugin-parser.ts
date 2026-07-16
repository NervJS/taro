/**
 * @tarojs/project-graph — 插件节点与 platforms（任务 3）
 *
 * 数据源统一为注入的 Kernel（§2.6 B 层）。以 Kernel 的 `plugins` Map 为权威单一
 * 数据源——其每个条目（IPlugin）自带 `id`（解析后的绝对路径）与 `opts`（用户参数），
 * 无需本库自行 resolve + join。再按 `id` 从 hooks / commands / platforms 三张 Map
 * 反查该插件注册的 hook / 命令 / 平台。
 *
 * 显示增强：PluginNode.id 优先用包名（更友好）。用 initialConfig.plugins/presets
 * 的包名做一次 resolve，建「解析路径 → 包名」映射；join 不上时退化用路径。
 *
 * 未注入 Kernel 时：plugins 为空、platforms 为 []（本模块不被调用）。
 */

import { createRequire } from 'node:module'
import * as path from 'node:path'

import type { KernelCommandEntry, KernelLike } from './query'
import type { GraphWarning, PluginCommand, PluginNode } from './schema'

/**
 * 把包名 resolve 为绝对路径，用于建「解析路径 → 包名」映射。
 *
 * 注意：这里用 node 内置 createRequire().resolve（非 Kernel 的 `resolve` 包）。
 * 二者算法可能有细微差异，但本用途仅是**显示增强**（把 PluginNode.id 从路径美化
 * 成包名），join 不上时退化用路径、不影响正确性——插件的权威 join 键始终是
 * Kernel.plugins 条目自带的 id，不依赖这里的 resolve。故不引入额外的 resolve 依赖。
 */
function resolvePackagePath(pkg: string, appPath: string): string | undefined {
  try {
    const req = createRequire(path.join(appPath, 'package.json'))
    return req.resolve(pkg)
  } catch {
    return undefined
  }
}

/**
 * 从解析后的绝对路径反解 node_modules 包名。
 * 如 `/…/node_modules/@tarojs/plugin-html/dist/index.js` → `@tarojs/plugin-html`、
 * `/…/node_modules/foo/index.js` → `foo`。取最后一个 node_modules 段之后的包名
 * （scope 包含 @scope/name 两段）。非 node_modules 路径返回 undefined。
 */
function pkgNameFromPath(filePath: string): string | undefined {
  const norm = filePath.replace(/\\/g, '/')
  const idx = norm.lastIndexOf('/node_modules/')
  if (idx < 0) return undefined
  const rest = norm.slice(idx + '/node_modules/'.length)
  const segs = rest.split('/')
  if (segs.length === 0) return undefined
  if (segs[0].startsWith('@')) {
    return segs.length >= 2 ? `${segs[0]}/${segs[1]}` : undefined
  }
  return segs[0]
}

/**
 * 建「解析路径 → 包名」映射。数据源两路，覆盖更全：
 *  - initialConfig.plugins/presets：用户手写的插件，resolve 出路径（精确）。
 *  - preset 递归展开 / global 插件不回写 initialConfig，用其路径反解 node_modules
 *    包名兜底（覆盖 initialConfig 拿不到的插件）。
 */
function buildPathToPkgName(kernel: KernelLike, appPath: string): Map<string, string> {
  const map = new Map<string, string>()
  const config = kernel.initialConfig
  if (config != null) {
    for (const key of ['presets', 'plugins'] as const) {
      const list = config[key]
      if (!Array.isArray(list)) continue
      for (const item of list) {
        const pkg = typeof item === 'string' ? item : Array.isArray(item) && typeof item[0] === 'string' ? item[0] : undefined
        if (pkg == null) continue
        const resolved = resolvePackagePath(pkg, appPath)
        if (resolved != null) map.set(resolved, pkg)
      }
    }
  }
  // 对 Kernel 里 initialConfig 未覆盖的插件路径，用 node_modules 反解补齐。
  if (kernel.plugins != null) {
    for (const pluginPath of kernel.plugins.keys()) {
      if (map.has(pluginPath)) continue
      const name = pkgNameFromPath(pluginPath)
      if (name != null) map.set(pluginPath, name)
    }
  }
  return map
}

/**
 * 从 hooks 注册表反查某插件（按解析路径归属）注册的**生命周期 hook** 名。
 *
 * 注意：Taro 的 Plugin.registerCommand / registerPlatform 内部也调用 register()，
 * 把命令名 / 平台名一并写进了 hooks Map（Kernel 的实现耦合）。因此需从 hook 名
 * 中排除该插件注册的命令名与平台名，否则 registeredHooks 会混入 'build'、'weapp'
 * 这类非生命周期条目、与 commands/platforms 字段重复。
 *
 * 边界：按名称排除。若同一插件既注册名为 X 的命令/平台、又有真名叫 X 的生命周期
 * hook，该同名 hook 会被一并排除。Taro 中命令/平台名与生命周期名（onXxx/modifyXxx）
 * 几乎不会相撞，且排除的是重复项，P1 可接受。
 */
function collectHooksForPlugin(
  kernel: KernelLike,
  pluginPath: string,
  excludeNames: ReadonlySet<string>,
): string[] {
  const names: string[] = []
  if (kernel.hooks == null) return names
  for (const [hookName, entries] of kernel.hooks) {
    if (excludeNames.has(hookName)) continue
    if (entries.some((e) => e.plugin === pluginPath)) names.push(hookName)
  }
  return names
}

function toPluginCommand(entry: KernelCommandEntry): PluginCommand {
  const cmd: PluginCommand = { name: entry.name }
  if (entry.alias != null) cmd.alias = entry.alias
  if (entry.optionsMap != null) cmd.optionsMap = entry.optionsMap
  if (entry.synopsisList != null) cmd.synopsisList = entry.synopsisList
  return cmd
}

/** 从 commands 注册表反查某插件注册的命令。 */
function collectCommandsForPlugin(kernel: KernelLike, pluginPath: string): PluginCommand[] {
  const cmds: PluginCommand[] = []
  if (kernel.commands == null) return cmds
  for (const entry of kernel.commands.values()) {
    if (entry.plugin === pluginPath) cmds.push(toPluginCommand(entry))
  }
  return cmds
}

/** 从 platforms 注册表反查某插件注册的平台名。 */
function collectPlatformsForPlugin(kernel: KernelLike, pluginPath: string): string[] {
  const names: string[] = []
  if (kernel.platforms == null) return names
  for (const entry of kernel.platforms.values()) {
    if (entry.plugin === pluginPath) names.push(entry.name)
  }
  return names
}

/** 插件解析结果。 */
export interface ParsedPlugins {
  plugins: PluginNode[]
  warnings: GraphWarning[]
}

/**
 * 从注入的 Kernel 提取插件节点。以 Kernel.plugins（自带 id+opts）为权威遍历，
 * 按解析路径从三张注册表反查 hook/命令/平台，id 优先显示为包名。
 *
 * @param kernel 已 initPresetsAndPlugins 的 Kernel
 * @param appPath 工程根（用于把包名 resolve 成路径以建包名映射）
 */
export function parsePlugins(kernel: KernelLike, appPath: string): ParsedPlugins {
  const warnings: GraphWarning[] = []
  const plugins: PluginNode[] = []
  if (kernel.plugins == null) return { plugins, warnings }

  const pathToPkg = buildPathToPkgName(kernel, appPath)

  for (const [pluginPath, entry] of kernel.plugins) {
    const node: PluginNode = { id: pathToPkg.get(pluginPath) ?? pluginPath }
    // opts 取自 Kernel 条目（IPlugin.opts）。跳过：空对象（无参数）、函数形态
    // （Kernel 原样存函数、JSON 不可序列化，静态取不到值）。
    const opts = entry.opts
    if (
      opts != null &&
      typeof opts !== 'function' &&
      !(typeof opts === 'object' && Object.keys(opts as object).length === 0)
    ) {
      node.opts = opts
    }
    // 先算命令/平台，再据其名排除 hooks 里的同名条目（Kernel register 耦合，见 collectHooksForPlugin）
    const commands = collectCommandsForPlugin(kernel, pluginPath)
    const platforms = collectPlatformsForPlugin(kernel, pluginPath)
    const excludeNames = new Set<string>([...commands.map((c) => c.name), ...platforms])
    const hooks = collectHooksForPlugin(kernel, pluginPath, excludeNames)
    if (hooks.length > 0) node.registeredHooks = hooks
    if (commands.length > 0) node.commands = commands
    if (platforms.length > 0) node.platforms = platforms
    plugins.push(node)
  }

  return { plugins, warnings }
}

/**
 * 从注入的 Kernel 提取编译目标平台清单。
 *
 * 语义为「项目可编译的目标平台集合」，而非单次 build 的 `--type` 目标（后者在
 * runOpts，非本库关注）。取值优先级：
 *  - initialConfig.platforms：若调用方在 config 显式提供（注：非 Taro 标准顶层
 *    字段，通常缺省）；
 *  - 否则退化为平台注册表（kernel.platforms）里所有已注册平台名——即所有平台
 *    插件贡献的可编译目标（superset）。
 */
export function parsePlatforms(kernel: KernelLike): string[] {
  const fromConfig = kernel.initialConfig?.platforms
  if (Array.isArray(fromConfig)) {
    return fromConfig.filter((p): p is string => typeof p === 'string')
  }
  if (kernel.platforms != null) {
    return [...kernel.platforms.values()].map((e) => e.name)
  }
  return []
}
