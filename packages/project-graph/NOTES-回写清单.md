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
