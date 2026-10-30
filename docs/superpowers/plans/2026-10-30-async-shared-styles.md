# subPackageIndie 共享异步样式上提实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将同组多个 sourceRoot 共用的异步 CSS 提升到组内 common 样式，并在业务复现工程确认 Demo 的实际渲染。

**Architecture:** 只修改 AsyncSubPackagePlugin 的最终样式回迁，复用现有 SubPackageIndiePlugin 分组匹配缓存。按目标样式文件去重，补组内 app 样式对 common 的导入；保留 JS 与模板归属。测试使用真实 webpack、MiniCssExtractPlugin、分组匹配及内存输出文件系统。

**Tech Stack:** TypeScript、webpack 5、MiniCssExtractPlugin、Vitest、postcss-url、微信开发者工具。

## Global Constraints

- 以 [已批准设计](../specs/2026-10-30-async-shared-styles-design.md) 为行为边界，不新增配置项。
- 只提升对应多个 sourceRoot 的共享异步样式。同组保留一份，跨组每组一份。
- 单 sourceRoot、无 subPackageIndie、无法确定组归属者保持原回迁行为。
- 不检查 isolated 或 :host，不保证这两类场景的兼容性。
- 接受公共 CSS 提前加载、入口所在包体积增加，以及跨组保留多份样式的成本。
- 只用现有 sourceRoot 和 getSubPackageIndieMatch 的结果检测跨组 warning，按编译轮次、asyncRoot 和组集合去重。不增加组件树扫描或新的模块图回溯。
- 公共文件缺失时创建并补导入链，保留已有内容和导入。watch 不重复累积规则、导入或 warning。
- 上提后的相对资源引用必须指向原资源，不改变绝对 URL、data URL 或 URL 的 query/hash。
- 不修改 JS splitChunks、异步 runtime 或模板分配。
- 沿用 <TARO_ROOT>/taro 的 feat/weapp-runtime-union 和 <TARO_ROOT>/Business/business-order-demo，不操作原业务目录的用户改动，不 push。
- 最终验收必须包含微信开发者工具中 list/detail 的 Demo 颜色与字号；产物断言不能替代渲染验证。

## 文件职责

- 修改 `packages/taro-webpack5-runner/src/plugins/AsyncSubPackagePlugin.ts`：最终 CSS 归属、相对路径迁移、组内导入和 warning。
- 修改 `packages/taro-webpack5-runner/tests/async-subpackage-styles.spec.ts`：真实编译和 watch 回归，保留原普通模式测试。
- 不修改 `MiniPlugin.ts`、`SubPackageIndiePlugin.ts` 或业务源代码；两者现有公开接口已经满足本次需求。

## 执行后验收（主线程）

- [x] 阅读子任务 report 与真实 diff，做独立的 spec/代码质量复核；发现缺陷时回到原实现子任务修复并复核。
- [x] 独立复跑聚焦测试与 runner 全套测试，核对最终文件范围与提交。
- [x] 在 Taro 仓库构建 `@tarojs/webpack5-runner`，确认业务 worktree 解析到本次构建。若需调整本地依赖，只调整本次复现 worktree 的链接，不改变 package.json/lockfile 或原业务目录。
- [x] 在业务 worktree 执行用户指定的 `pnpm -F @demo/app_order run dev:weapp`，等首次编译结束；不新建重复 dev watcher。
- [x] 核对 `dist/weapp/pages/index/common.wxss` 的 Demo CSS Modules 类只出现一份，list/detail 不重复携带规则，入口到 app/common 的导入链完整，Demo JS 的类名仍一致。
- [x] 用微信开发者工具打开该业务项目，实际渲染 list/detail 中的懒加载 Demo，读取元素样式或截图确认红色和预期字号。记录项目路径、操作、可复核证据及真实异常。
- [x] 交付提交、聚焦/邻近测试结果、产物归属和微信渲染验证结果。仅真实验证通过才宣称修复完成；工具权限或登录阻碍时明确剩余验证。


### Task 1: 共享异步 CSS 按组上提

**Files:**

- Modify: `packages/taro-webpack5-runner/src/plugins/AsyncSubPackagePlugin.ts`
- Test: `packages/taro-webpack5-runner/tests/async-subpackage-styles.spec.ts`

**Interfaces:**

- Consumes: `miniPlugin.subPackageIndiePlugin?.getSubPackageIndieMatch(sourceRoot)`，匹配结果中的 `config.mainPackageRoot` 已归一化。
- Consumes: `asyncChunkSourceRoots: Map<string, Set<string>>`、`miniPlugin.options.fileType.style`、`compilation.assets`、`compilation.warnings`。
- Produces: `moveAsyncRootStylesToSourceRoots(compilation, RawSource): Promise<void>`。唯一调用点的 processAssets 使用 tapPromise 并 await 样式回迁，随后按原顺序处理模板和占位入口；插件公开接口不变。组内 common 追加共享规则，sourceRoot 保留私有规则。
- Produces: `${mainPackageRoot}/app${styleExt}` 能导入 `${mainPackageRoot}/common${styleExt}`。既有入口由 MiniPlugin 导入该 app 样式，无需重写入口生成器。
- Test helper: 将 `compile()` 扩展为可配置的真实编译工具，返回 `{ assets: Record<string, string>, warnings: string[] }`。参数至少支持 entry 集合、subPackageIndie 配置、初始样式、development/production 和临时 fixture。

- [ ] **Step 1: 写同组上提的失败测试，保留普通模式基线**

用真实 SubPackageIndiePlugin 取得配置匹配。MiniPlugin double 只提供测试编译必要的 options、appConfig 和 hooks；已有 common/app/入口样式在回迁之前的 processAssets 阶段注入，不 mock 分组匹配结果。

```typescript
const { assets, warnings } = await compile({
  subPackageIndie: [{
    mainPackageRoot: 'pages/index/index',
    subPackageRoots: ['pages/list/index', 'pages/detail/index'],
  }],
  initialAssets: {
    'pages/index/index.wxss': '@import "./app.wxss";',
    'pages/index/app.wxss': '@import "./common.wxss"; .app { color: black; }',
    'pages/index/common.wxss': '.common { color: green; }',
  },
})
expect(assets['pages/index/common.wxss']).toContain('.common')
expect(assets['pages/index/common.wxss'].match(/\.demo/g)).toHaveLength(1)
expect(assets['pages/list/index.wxss'] || '').not.toContain('.demo')
expect(assets['pages/detail/index.wxss'] || '').not.toContain('.demo')
expect(Object.keys(assets).filter(name => name.startsWith('async/detail/') && name.endsWith('.wxss'))).toEqual([])
expect(warnings).toEqual([])
```

- [ ] **Step 2: 运行并确认失败原因是公共样式尚未上提**

Run from `packages/taro-webpack5-runner`:

```sh
env PATH="<HOME>/.volta/bin:$PATH" ../../node_modules/.bin/vitest run tests/async-subpackage-styles.spec.ts
```

Expected: 原普通模式测试通过，新同组测试失败，因为 `.demo` 仍存在于两个 sourceRoot，common 中没有该规则。将命令、失败断言和退出码记录到子任务 report，再写生产代码。

- [ ] **Step 3: 最小实现目标去重、导入链和相对 URL 迁移**

postcss-url 的 rebase 处理返回 Promise，使用异步 processAssets 钩子等待完成，不从 LazyResult 同步读取 `.css`。依据是 runner 已安装依赖的 `postcss-url/src/index.js` 和 `src/type/rebase.js`；主线程已复核同步调用报 async plugins 错误，await 后能正确保留 query/hash。

在既有回迁方法中按产物的 sourceRoots 决定目标；共享判断使用 sourceRoots.size，不按 asyncRoot 下的全部配置根推测消费者。目标 Map 的 key 是最终样式资产名，value 是 mainRoot 或 null。

```typescript
const targets = new Map<string, string | null>()
for (const sourceRoot of sourceRoots) {
  const mainRoot = sourceRoots.size > 1
    ? this.miniPlugin.subPackageIndiePlugin?.getSubPackageIndieMatch(sourceRoot)?.config.mainPackageRoot
    : undefined
  targets.set(mainRoot ? `${mainRoot}/common${styleExt}` : `${sourceRoot}/index${styleExt}`, mainRoot || null)
}
for (const [targetStyleAsset, mainRoot] of targets) {
  const origin = compilation.assets[targetStyleAsset]?.source?.().toString() || ''
  const relocatedStyle = mainRoot
    ? await this.rebaseAsyncStyle(compilation, asyncStyle, assetName, targetStyleAsset)
    : asyncStyle
  compilation.assets[targetStyleAsset] = new RawSource([origin, relocatedStyle].filter(Boolean).join('\n'))
  if (mainRoot) this.ensureMainRootCommonStyleImport(compilation, RawSource, mainRoot, styleExt)
}
delete compilation.assets[assetName]
```

`rebaseAsyncStyle(compilation, css, fromAsset, toAsset): Promise<string>` 使用 compilation 的实际 output 路径与已有 postcss-url rebase；保留相对 @import 时同步调整路径。`ensureMainRootCommonStyleImport(compilation, RawSource, mainRoot, styleExt): void` 仅补该组 app 到 common 的导入，并按解析后的路径判重。两个辅助方法只服务现有回迁方法，不增加插件公开接口。

补导入时保留已有 app/common 内容。`app.wxss` 不存在时创建；既有组入口对 app 的导入保持不变。导入和规则处理不能依赖上一次 compilation 的资产状态。URL 迁移只作用于新上提内容，不重写已有 common 或普通回迁的 CSS。若 CSS 保留相对 @import，同样保持其目标解析结果。

- [ ] **Step 4: 先写跨组 warning 的失败测试，再实现轻量 warning**

两个消费者分属 `pages/a/index` 与 `pages/b/index` 对应的组时，各 common 都包含一份 Demo，且各 app 都可导入 common。使用含两个动态 CSS 产物的临时 fixture，证明同 asyncRoot、相同目标组组合只发一个 warning。

```typescript
expect(assets['pages/a/common.wxss'].match(/\.demo/g)).toHaveLength(1)
expect(assets['pages/b/common.wxss'].match(/\.demo/g)).toHaveLength(1)
expect(warnings).toHaveLength(1)
expect(warnings[0]).toContain('async/detail')
expect(warnings[0]).toContain('pages/a')
expect(warnings[0]).toContain('pages/b')
```

在每轮回迁中使用本地 Set，key 为 asyncRoot 与排序后的 mainRoot 集合。仅集合大小超过 1 时向 compilation.warnings 追加 webpack warning，说明各组保留一份。不确定的组不额外扫描，同组不 warning。

- [ ] **Step 5: 补边界和 watch 回归，并确认测试可检出缺陷**

真实产物断言必须覆盖：common 缺失仍有完整导入链；等价 `common.wxss`/`./common.wxss` import 不重复；深层 mainRoot 的入口导入保持可达；单 entry 的私有样式不提升；未知组消费者回迁原 sourceRoot；无 subPackageIndie 基线保持；production 同组去重。

对相对资源测试，使用不同深度的 asyncRoot 与 mainRoot；断言上提后 url()/相对 @import 解析到原目标，绝对 URL、data URL、query/hash 保留。测试 fixture 在 mkdtemp 目录中生成，不改仓库已有 fixture。

watch 使用真实 `compiler.watch`。修改临时 Demo CSS，从红色改蓝色，触发下一轮编译后验证：common 只有新的规则，旧红色不存在，app 的 common import 只有一次。再次修改 CSS，验证规则和 import 不累积，跨组 warning 每轮仍只一份。关闭 watcher/compiler 后清理该测试创建的临时 fixture。

- [ ] **Step 6: 运行覆盖该变更的测试和类型检查，再精确提交代码与测试**

```sh
env PATH="<HOME>/.volta/bin:$PATH" ../../node_modules/.bin/vitest run tests/async-subpackage-styles.spec.ts
env PATH="<HOME>/.volta/bin:$PATH" ../../node_modules/.bin/vitest run
env PATH="<HOME>/.volta/bin:$PATH" ../../node_modules/.bin/tsc --noEmit -p tsconfig.json
git diff --check
git add -- src/plugins/AsyncSubPackagePlugin.ts tests/async-subpackage-styles.spec.ts
env PATH="<HOME>/Library/pnpm/.tools/pnpm/10.7.1_tmp_48940/bin:<HOME>/.volta/bin:$PATH" git commit -m "fix(webpack-runner): hoist shared async styles"
```

Expected: 聚焦测试和邻近 runner 测试通过；类型检查如存在基线错误，比较仅与本次变更相关的诊断并报告，不修改无关包。提交不跳过 hook，不暂存主线程的计划或验证产物，不 push。

## 业务验收范围记录

2026-10-30 核对业务 worktree 的 `8d443403766b7213863135c8483ce849a16afdee`：Demo 的直接渲染位于 [detail/index.tsx](<TARO_ROOT>/Business/business-order-demo/apps/app_order/src/pages/detail/index.tsx:668)。`rg -n 'Demo|dekfjak|Suspense' apps/app_order/src/pages/list apps/app_order/src/pages/detail` 在 list 源码中未找到 Demo JSX。

真实渲染验收检查 detail 中已有的 Demo 颜色和字号。list 验收检查入口加载、公共样式导入链和样式去重，不新增业务 Demo JSX。样式归属和兼容边界仍由已批准设计规定。

## 验收记录（2026-10-30）

- Taro 最终提交：`e0da68561d513628614c75e77c9b0dba347d774a`（实现 `83a0f75eb019040f571693f6d805baf3d0d67faa`，修复 `e0da68561d513628614c75e77c9b0dba347d774a`）。
- 复核：评审 finding 全部 ADDRESSED，无新增 Critical/Important。
- 门禁：聚焦测试 22/22、runner 全套 93/93、`tsc --noEmit` 通过、两文件 ESLint `--max-warnings 0` 通过、runner 重构建通过。
- 业务 worktree：`<TARO_ROOT>/Business/business-order-demo`，HEAD `8d443403766b7213863135c8483ce849a16afdee`，源码工作树干净。
- 业务构建：`pnpm -F @demo/app_order run dev:weapp` 首次编译成功（`No errors found`），watcher PID 83437。
- 产物归属：`pages/index/common.wxss` 中 `.text_iZH9y` 恰好 1 条，含 `color: red` 与 `font-size: calc(1rem * var(--taro-font-scale, 1))`；`pages/list/index.wxss`、`pages/detail/index.wxss` 各 0 条；`pages/index/index.wxss` → `app.wxss` → `common.wxss` 导入链完整；Demo JS 类名一致。证据：`business-styles.json`。
- 微信真实渲染：list（`/pages/index/index?__type=list`）与 detail（`/pages/index/index?__type=detail&orderId=ORDER_ID_PLACEHOLDER`）均渲染 `dekfjakljgkalkgjalg` 为红色；截图与像素分析见 `wechat-render-evidence.json`（list 红色像素 1376、detail 红色像素 646）。
- 已知边界：`isolated`、`:host` 场景不在本次保证范围；跨组共享样式每组保留一份并 warning。
- 观察项（非本次 CSS 变更引入）：当前业务构建将异步模块并入主包 `common.js`，未产出 `pages/shared-async` 目录，微信 console 报 `[Page json file missing] Page [pages/shared-async/index]`。该行为来自 feat 分支既有 chunk 归属，本次未修改 JS splitChunks/runtime/模板。
- 未 push。
