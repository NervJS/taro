# RFC-0003 P1 待回写清单

> 实现过程中相对规划 `rfcs/0003-project-graph-p1-plan.md` 的净新增 / 偏离。
> 按约定：P1 全部任务完成后，统一回写规划文档 + 登记 OQ，不在编码中途反复改计划。
> 本清单随代码走，作为收尾回写的依据。

## 任务 0（骨架 / schema）

- **诊断层**：新增 `GraphWarning` 类型、`ProjectGraph.warnings`、`Edge.resolved`。§2.3 原 schema 无。动机：服务 taro-pilot 构建诊断 + 任务1 解析失败信号落点。
- **工厂函数形态**：`createProjectGraph({ root, kernel? })` + `KernelLike` 注入接口。§2.4 原文写作自由函数，实际改为工厂 + 实例（更契合 §2.6 Kernel 注入）。
- **compileModeStatus**：schema 落为 `string`（原"待定"，放宽避免过早锁定值域）。

## 任务 1（config 解析）

- **`__taroAsyncComponent__`**：RFC-0003 §2.2 / 本方案 §任务1 提及该标识符，经核查主仓源码**不存在**（疑早期方案占位）。实现不为其编码；动态 pages 由 readConfig 执行求值覆盖。→ 回写时从 RFC 订正删除该提法。

## 任务 2（页面 / 边 / 查询）

- **useRouter 从扫描集移除**：§2.2 / §2.3 Edge.via 列了 useRouter，但它是读当前路由参数的 hook、无 url、不产生跳转边。实现不扫它（NavigationVia 类型保留但不产出）。→ 回写：§2.2 扫描清单删 useRouter；via 类型保留并注明 P1 不产出。
- **PageNode.config 读取归任务2**：config 是 §2.3 P1 字段，实现在任务2 用 readPageConfigContent 填充。→ 回写注明"config 由任务2 填充"。
- **调用识别细节**（全局 Taro 命名空间、别名具名导入映射、收紧 this./router. 误报）：实现细节，注释背书，低优先记录即可。

## 任务 3（插件节点 / platforms）

- **A 层数据源改为 Kernel**：§2.6 设想"A 层静态读 config.plugins"。实际编译插件在 config/index.ts（defineConfig 函数形态，静态读脆），改为以注入的 **Kernel.plugins Map 为权威单一数据源**（自带 id + opts）。→ 回写 §2.6 A 层描述 / 任务3 line260。
- **免 resolve-join**：§2.6 line263"A/B 合并键=resolve 后路径 join"要点已 moot——Kernel 条目自带 id，无需二次 resolve join；resolve 仅用于"路径→包名"显示映射。→ 回写。
- **未注入 Kernel 时 plugins 为空**（非"仅 A 层"）：因 A 层也依赖 Kernel。→ **回写 §2.6 line219 + 验收 line261**（原"仅静态时列出插件与 opts"不满足，须消除口径冲突）。
- **registeredHooks 排除命令/平台名**：应对 Kernel 的 registerCommand/registerPlatform 内部也 register() 到 hooks Map 的耦合。→ §2.6 B 层补一句（低优先）。
- **platforms 语义 = 可编译目标集合**（kernel.platforms 全集 superset，非单次 --type 目标）。→ 回写 §2.6 line221。
- **包名反解**：preset 展开 / global 插件不回写 initialConfig，其包名由"路径 node_modules 段反解"兜底。实现细节，注释背书。

## 任务 4（四通道封装）

- **CLI 形态 `taro-graph`（独立 bin）而非 `taro graph`（子命令）**：§2.5 写作 `taro graph`。做成 taro 子命令需耦合 @tarojs/cli、违背"独立入口包"边界，故实现为独立 bin `taro-graph`。→ 回写 §2.5 CLI 验收措辞对齐（或说明二者关系）。
- **MCP 挂现有 server、不自带 SDK**：mcp.ts 导出"传输无关工具定义"（name+description+inputSchema+handler），由 plugin-mcp 注册。符合 §2.5 说明，无需回写，仅记录形态。
- **MCP handler 每次 createProjectGraph 重建图**：会重跑 config 执行（esbuild+require 有副作用），成本高于纯重建。P1 可接受，任务 5 缓存后缓解 → 任务 5 明确此风险。
- **入口暴露**：package.json 加 `bin.taro-graph` + `exports['./mcp']`；核心库 index.ts 不含 cli/mcp（薄 façade）。符合边界。
- **CLI 新增 `--root=` 参数**：独立 bin 需指定工程根（§2.5 未列）。合理，随独立 bin 形态而来。
- **MCP query_project_graph 返回 `{ summary, graph }`**：§2.4 仅约定返回 graph，summary 为派生计数（通用非特化）。属净新增输出形态，回写时一并说明。
- **`./mcp` 子路径类型解析待验证**：exports 子路径在 node classic resolution（moduleResolution:node）下 TS 可能找不到类型。消费方 plugin-mcp 接入时（任务5 之后）需验证其 tsconfig（node16/bundler 无碍）。

## 任务 5（缓存 / 增量 / 监听）

- **chokidar 复用 @tarojs/helper re-export**（`import { chokidar } from '@tarojs/helper'`），不新增依赖。符合"与 vite/webpack 共用 watcher 生态、不重复造底层能力"。
- **taro-pilot 接入用 mock 自验**（不改 taro-pilot 仓，之前拍板的降级方案）。真实接入是 taro-pilot 一侧的工作。
- **缓存跳冷启动**：loadOrBuild 命中缓存时不重建（实测 432ms→6ms，72x）。content hash 覆盖 app.config + 页面文件 + 页面 config。
- **onGraphChange 惰性监听**：首个订阅者启动 chokidar，最后一个 unsub 后关闭。GraphChange 字段为 `changedFiles`（变更文件路径，非节点 id）。
- **已知边界（P1 不修，记录）**：
  - 缓存"该失效却命中"窄洞：跨重启 + app.config 引用了不存在的文件、停机期间补建该文件且 app.config 未变 → hash 命中返回旧图。任何 app.config 改动自愈；缓存是优化非正确性依赖。可选增强：hash 纳入 app.config 声明的全部期望页面路径。**同类扩展**：(a) 页面 config——写缓存时某页无 `.config.ts`（configFilePath=''），停机期间补建则漏 hash；(b) app.config 的 **transitive import**（如 `pages` 抽到 `./routes.ts`）——停机期间改被 import 的模块、app.config 字节不变 → hash 命中返回旧图。二者均"任一 src/ 或 config/ 变更即自愈"，属同一"写缓存时输入不存在/未追踪"类。→ 回写措辞从"缺页面文件"泛化为"任一写缓存时不存在或未追踪的输入（页面文件 / 页面 config / config 的 transitive import）"。
  - 缓存命中路径丢弃 parsePlugins 的 warnings（当前 parsePlugins 不产 warning，无实害；将来产则漂移）。
  - config 含函数/Date 等非 JSON 值时，命中路径（JSON 反序列化）与冷启动（内存原值）有差异。典型 Taro config JSON 安全。
- **监听触发全量重建（非"重算受影响节点"）**：任务5 产出 / §2.2 / 附录A 均写"重算受影响节点"，实现为文件变更即 `buildProjectGraph` 全量重建。行为正确（P1 数据新鲜度达标），选择性增量属 P4 性能优化。→ 回写：措辞对齐为"全量重建，选择性增量归 P4"。
- **缓存命中就地重算 kernel 部分**：命中路径 plugins/platforms 不进 content hash，由注入的 kernel 就地重算（parsePlugins/parsePlatforms，无文件编译）。
- **readCache 形状兜底（已修）**：读侧除校 schemaVersion 外，再校 `graph.app != null && Array.isArray(graph.pages)`，"版本匹配但 graph 残缺"（手改 / 未来 schema 复用）降级为 miss（重建），避免 loadOrBuild 的 `collectInputFiles(cached.graph)`（不在 try 内）抛崩调用方。
- **rebuild 吞构建异常（已修）**：监听重建回调跑在 chokidar 防抖 setTimeout 里，用户存了语法损坏的 app.config / 页面（编辑中间态）会让 buildProjectGraph 抛出。已 try/catch 吞掉并保留上一份可用图，下次成功重建再通知订阅者——否则 uncaught throw 直接 crash 长驻宿主（taro-pilot 控制面）。
- **watcher 'error' 静默吞（已知边界）**：EMFILE/ENOSPC/EPERM 时 chokidar emit 'error'，本库 `watcher.on('error', () => {})` 吞掉以不崩宿主；代价是监听可能永久静默停摆、`onGraphChange` 不再触发且无信号。P1 接受（不崩优先）；可选增强：暴露 onError/debug 钩子让宿主感知并重建监听。
- **config/ 被监听但不入 hash（已知边界）**：watch 监听 源码目录（sourceRoot） + `config/`，但 `collectInputFiles`/`parseAppConfig` 只解析 app.config——改 `config/index.ts` 会触发一次全量重建但不改变图产出（config 编译配置当前由注入的 kernel 承载，非本库静态读）。冗余重建、无副作用，P1 接受。
- **sourceRoot / app.config 别名已接线（kernel 路径，方案三中等档）**：`createProjectGraph` 经 `deriveSourceConfig` 从 `kernel.initialConfig.sourceRoot`（默认 'src'）、`kernel.initialConfig.alias`（默认 {}）派生源码目录与别名；`buildProjectGraph`/`parseAppConfig`/`readPageConfigContent` 透传 alias 给 helper `readConfig({ alias })`。未注入 kernel（纯 CLI）时回退默认 src/、无别名。→ 回写：§2.6 A 层补"sourceRoot/alias 从 kernel.initialConfig 派生"；config-parser 内"待任务5/Kernel"注释已消。
  - **边界**：CLI 无 kernel 通道**不自动感知** sourceRoot/alias（静态读 config/index.ts 属 defer 到 P4 的"静态读脆"，明确不碰）。用别名 import 或自定义 sourceRoot 的工程若走纯 CLI，会解析失败并触发下方零页面兜底 warning。
  - **缓存 seed（三 agent 复核 must-fix，已修）**：sourceRoot/alias 来自 kernel、不落输入文件，若不进 content hash 则空图（输入集为空 → hash 退化为常量）会在不同 root/alias 间误命中——具体崩法：无 kernel CLI 跑（默认 src/）在自定义 sourceRoot 工程上找不到 app.config → 写空图缓存；之后 kernel 跑（正确 sourceRoot）读到空图 → 空集重算同一常量 hash → 永久命中返回空图。已修：`computeContentHash(files, seed)` 增 seed 参数，`buildSeed(sourceRoot, alias)`（alias key 排序后序列化）折进摘要，三处 hash 调用（命中校验 / miss 写 / rebuild 写）统一带同一 seed。已验证跨 root 不误命中、alias 变更正确失效。
- **零页面兜底 warning（净新增诊断）**：app.config **声明了页面路由却无一解析到文件**（`pageRoutes.length > 0 && pages.length === 0`）时补一条顶层 `GraphWarning`（kind=config_parse_failed），提示检查 sourceRoot / 未注入别名 / 页面文件缺失——避免别名/自定义布局工程静默返回空图。门槛用 `pageRoutes.length > 0`：`pages:[]` 的空工程由 config-parser 单独告警，此处不重复报（三 agent 复核指出的去重）。§2.3 原 schema 无此兜底，属诊断层净新增。→ 回写登记。
- **task5 验收脚本对 chokidar 启动时序敏感（记录）**：`scripts/acceptance-task5.cjs` 场景3 用固定 600ms 等监听防抖+重建，偶发不够导致 onGraphChange 未及触发（假失败，重跑即过）。5b 未改 watch 时序逻辑。→ 任务6 正式测试应改用事件驱动等待（await 首次 onGraphChange）而非固定 sleep。
