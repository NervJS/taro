# 异步分包共享样式修复交接

本文件记录 `subPackageIndie` 场景下异步分包样式归属与去重修复的现状。设计边界以 [共享异步样式上提](../specs/2026-10-30-async-shared-styles-design.md) 为准，实施步骤见 [实施计划](../plans/2026-10-30-async-shared-styles.md)。本文不复述计划里的逐步勾选，只说明改了什么、为什么这么改、以及怎么复验。

## 1. 问题

业务复现工程 `apps/app_order` 里，`components/Demo` 由 `lazy(() => import('./Demo'))` 动态加载，list 和 detail 两个页面都会用到。

- 期望：Demo 内的 CSS Modules 样式生效。
- 实际：Demo 渲染出来了，但 `color: red` 和 `font-size` 都不生效。

排查后确认是两个前后相连的缺陷，不是同一个 bug 的两种表现。

| 缺陷 | 现象 | 根因 | 修复提交 |
| --- | --- | --- | --- |
| 一 | 样式文件留在 `pages/shared-async/` 下，页面 wxss 拿不到规则 | 动态 import 的调用点在页面外的共享组件里，origin 模块不属于任何 sourceRoot，回溯结果为空 | `e74f3f43cd` |
| 二 | 修好缺陷一后，list 和 detail 各自携带一份相同规则 | 每个 sourceRoot 都独立回迁同一份异步样式 | `24c6b9e429` |

缺陷一不修，样式根本不生效；缺陷二不修，功能正确但产物重复。两者必须一起看，只修第一个会得到"能跑但体积翻倍"的中间态。

## 2. 功能设计

### 2.1 缺陷一：沿 issuer 链回溯消费方

`getSourceRootsFromChunkGroupOrigins` 原本只对 chunk group 的 origin module 自身调用 `getSourceRootForResource`。当 `import()` 写在 `components/Demo/index.tsx` 这种共享组件里时，该模块不在 `pages/list` 或 `pages/detail` 目录下，函数返回空集合，样式回迁整段被跳过。

改为新增 `getSourceRootsFromModule`：

- 先看模块自身能否直接归属某个 sourceRoot，能就返回。
- 不能则取 `moduleGraph.getIncomingConnections()` 的 `originModule` 和 `getIssuer()`，递归回溯。
- 用 `visited` 集合防环，结果写入 `asyncModuleSourceRootCache`，每个 compilation 重置，避免重复遍历。

这样"谁真正使用了这个懒加载模块"才决定样式归属，而不是"模块文件放在哪"。

### 2.2 缺陷二：共享样式按组上提

同一个异步样式对应多个 sourceRoot 时，把它提升到所属 `subPackageIndie` 组的 `mainPackageRoot/common.wxss`，每组保留一份。JS 仍然异步分包，模板归属不变。

行为规则：

| 场景 | 样式落点 |
| --- | --- |
| 单 sourceRoot 使用 | `sourceRoot/index.wxss`（原行为） |
| 多 sourceRoot，同组 | 组内 `mainPackageRoot/common.wxss`，一份 |
| 多 sourceRoot，跨组 | 各组 `mainPackageRoot/common.wxss` 各一份，并 warning |
| 多 sourceRoot，无法匹配组 | 各自 `sourceRoot/index.wxss`（原行为） |

组归属复用 `SubPackageIndiePlugin.getSubPackageIndieMatch(sourceRoot)?.config.mainPackageRoot`，该方法自带匹配缓存。注意它在 `options.newBlended` 为假时直接返回 `null`，所以上提只在 `--new-blended` 下生效，业务工程正是用这个开关。

### 2.3 明确不覆盖

用户已确认以下边界，实现里也没有为它们做兼容：

- `isolated` 样式隔离场景不考虑。
- `:host` 场景不考虑。
- 接受公共 CSS 提前加载、入口所在包体积增加。
- 接受跨组保留多份样式的成本。

跨组 warning 只在能低成本判定时产生：只用现有 sourceRoot 集合和配置匹配结果，不额外做组件树扫描或 CSS 解析。判定不出来就不 warning，不阻断构建。

### 2.4 时序约束

导入链由 `MiniPlugin.injectCommonStyles()` 在 `afterGenerateFiles` 阶段生成，异步样式回迁挂在 `processAssets`（stage 300）。两者先后顺序固定，新建的 `common.wxss` 不会被已经生成的导入链自动发现，所以必须自己补 `app.wxss` 对 `common.wxss` 的导入。

这一点是设计文档里单独点名的风险，实现里对应 `ensureMainRootCommonStyleImport`。

## 3. 代码修改

改动集中在 `packages/taro-webpack5-runner/src/plugins/AsyncSubPackagePlugin.ts` 和它的测试文件，没有动 `MiniPlugin.ts`、`SubPackageIndiePlugin.ts`，也没有新增配置项。

### 3.1 提交清单

| 提交 | 内容 |
| --- | --- |
| `e74f3f43cd` | 异步分包样式回溯共享模块 issuer |
| `24c6b9e429` | 共享异步样式上提到组内 common |
| `31465eb699` / `3f13d5a86a` / `1dffe33f74` | 依次发布 `4.3.2-alpha.0` / `.1` / `.2` |

### 3.2 缺陷一改动

文件：`packages/taro-webpack5-runner/src/plugins/AsyncSubPackagePlugin.ts`

- 新增字段 `asyncModuleSourceRootCache: WeakMap<module, Set<string>>`，在 `compiler.hooks.compilation` 里随 `asyncModuleCache` 一起重置。
- 新增 `getSourceRootsFromModule(module, moduleGraph, visited)`（约 391 行）。
- `getSourceRootsFromChunkGroupOrigins(chunk, moduleGraph)`（约 432 行）改为对每个 origin module 调上面的方法，签名多一个 `moduleGraph` 参数。
- 调用点（约 462 行）传入 `compilation.moduleGraph`。

### 3.3 缺陷二改动

同一文件：

- `setupAsyncChunkAssetExtraction`（约 528 行）里 `processAssets.tap` 改成 `tapPromise`，回调改 `async` 并 `await this.moveAsyncRootStylesToSourceRoots(...)`。模板处理和占位入口生成保持原顺序，仍在样式之后同步执行。
- `moveAsyncRootStylesToSourceRoots`（约 590 行）改为返回 `Promise<void>`：
  - 用 `targets: Map<targetAsset, mainRoot | null>` 收集每个 sourceRoot 的落点。只有 `sourceRoots.size > 1` 时才去查组，单 sourceRoot 保持原路径。
  - 跨组判定：`mainRoots` 去重排序后长度大于 1 就 push 一条 `WebpackError`，key 是 `[asyncRoot, mainRoots]`，同一编译轮次内去重。
  - 目标落点是组 common 时，先 `rebaseAsyncStyle` 再追加，并调 `ensureMainRootCommonStyleImport`。
  - 处理完删除原 async 样式 asset。
- 新增 `rebaseAsyncStyle`（约 636 行）：`postcss.parse` 后重算 `@import` 的相对路径，再用 `postcss-url` 的 `url: 'rebase'` 处理 `url()`。绝对 URL、协议相对 `//`、根路径 `/`、纯 `#` 一律跳过，query 和 hash 原样保留。
- 新增 `ensureMainRootCommonStyleImport`（约 659 行）：解析 `app.wxss` 的 `@import`，用 `path.posix.resolve` 比对目标是否已指向 common；没有则在最前面插入 `@import "./common.wxss";`，但把 BOM 和 `@charset` 提到它前面，避免编码声明失效。

`postcss-url` 已是 runner 的既有依赖（`^10.1.3`），本次没有新增包。

### 3.4 测试

文件：`packages/taro-webpack5-runner/tests/async-subpackage-styles.spec.ts`

测试用真实 webpack + `MiniCssExtractPlugin` + 真实 `SubPackageIndiePlugin` 跑内存文件系统，不 mock 分组匹配结果。辅助函数：`withFixture`、`createCompiler`、`compile`、`watchCompiler`、`readCompilation`、`importedStyleAssets`、`ruleDeclarations`。

共 22 个用例，覆盖：

- 共享模块的动态 import 样式回迁到每个可达页面。
- 同组上提到已有 common。
- common 或 app 缺失时新建并接通导入链。
- app 已有内容和导入不被破坏，`@import` 写法变体（`"common.wxss"`、`"./common.wxss"`、`url("./nested/../common.wxss")`）都能识别。
- 深层组入口经 app 到 common 的链路完整。
- 相对 `url()` 和 `@import` 重定位后仍指向原资源，query/hash/media 不变。
- 跨组每组一份 + 同组集合 warning 去重。
- 单 sourceRoot、未知组、无组配置回退原行为。
- production 模式去重。
- 真实 watch 三轮改写颜色，规则不累积、导入不重复、warning 每轮一致。

## 4. 如何验证

### 4.1 单元测试

```sh
cd /Users/fengshimin5/Projects/Taro/taro/packages/taro-webpack5-runner
env PATH="/Users/fengshimin5/.volta/bin:$PATH" ../../node_modules/.bin/vitest run tests/async-subpackage-styles.spec.ts
```

当前机器实测：20 passed、2 failed。失败的两条是 `refreshes styles, imports and per-round warnings with real watch: 'same group'` 和 `'cross groups'`，报 `Timed out waiting for compiler.watch`。

判断为环境问题而非代码回归，依据是同一台机器上单独跑 `fs.watch` 也会直接抛 `EMFILE: too many open files, watch`，说明系统级 file watcher 句柄已经耗尽；当时机器上并行跑着多个 `taro build --watch`，是可能的原因，但没有做隔离实验证明因果。**这两条 watch 用例尚未在干净环境通过，不能算已验证。** 复验时先停掉无关的 dev watcher 再跑，并把实际结果写回本文。

### 4.2 业务产物断言

业务复现工程：`/Users/fengshimin5/Projects/Taro/Business/taro_order-test_wxapp_size`（分支 `test_wxapp_size`）。

```sh
cd /Users/fengshimin5/Projects/Taro/Business/taro_order-test_wxapp_size
pnpm -F @hlfe/app_order run dev:weapp
```

等首次编译结束（输出 `Watching...` 且 `No errors found`），在 `apps/app_order/dist/weapp` 下跑这段脚本：

```python
import json, re
from pathlib import Path

out = Path('.')
read = lambda n: (out / n).read_text() if (out / n).is_file() else ''

# 1. 从产物里解析 Demo 的 CSS Module 类名，不硬编码
cls = None
for js in out.rglob('*.js'):
    text = js.read_text()
    if 'Demo.module.scss' in text:
        m = re.search(r'\{"text":"([^"]+)"\}', text)
        if m:
            cls, chunk = m.group(1), str(js)
            break
assert cls, 'Demo CSS Module export not found'

# 2. 规则只允许出现在组内 common
rule = re.compile(r'(?<![\w-])\.' + re.escape(cls) + r'\s*\{[^}]*\}')
for name, expected in [('pages/index/common.wxss', 1),
                       ('pages/list/index.wxss', 0),
                       ('pages/detail/index.wxss', 0)]:
    hits = rule.findall(read(name))
    assert len(hits) == expected, (name, len(hits), expected)
    if expected:
        assert re.search(r'color\s*:\s*red', hits[0]), hits[0]
        assert 'calc(1rem * var(--taro-font-scale, 1))' in hits[0], hits[0]

# 3. 导入链完整，common 只被导入一次
import posixpath
imp = re.compile(r'@import\s+(?:url\(\s*)?["\']?([^"\')\s;]+)')
def imports_of(name):
    return [posixpath.normpath(posixpath.join(posixpath.dirname(name), re.sub(r'[?#].*$', '', m.group(1))))
            for m in imp.finditer(read(name))]
assert 'pages/index/app.wxss' in imports_of('pages/index/index.wxss')
assert imports_of('pages/index/app.wxss').count('pages/index/common.wxss') == 1

# 4. asyncRoot 下不残留样式
leftover = list((out / 'pages/shared-async').rglob('*.wxss'))
assert not leftover, leftover

print('OK', cls, chunk)
```

断言覆盖：规则落点唯一、颜色与字号正确、导入链完整且不重复、async 目录无残留。2026-11-02 跑出来类名是 `.text_iZH9y`，Demo 的 JS 落在 `pages/shared-async/async-Demo.js`。

另外人工确认 list/detail 的 `index.json` 都是 `styleIsolation: shared`，这是公共样式能穿透到组件的前提。

### 4.3 微信开发者工具真实渲染

产物断言只能证明规则落点，不能证明渲染生效，必须开工具看。

项目路径：`/Users/fengshimin5/Projects/Taro/Business/taro_order-test_wxapp_size/apps/app_order/dist/weapp`

1. `open_project_window` 打开项目（liteMode 即可）。
2. `simulator_open_page` 打开 `pages/index/index`，query `__type=list`。
3. 截图，确认顶部 `dekfjakljgkalkgjalg` 为红色。
4. `automation_navigate --action reLaunch --url "/pages/index/index?__type=detail&orderId=3666425004107386"`。
5. 截图，确认同一文本仍为红色。
6. `get_simulator_console --command "grep -n dekfjakljgkalkgjalg"`，从 `page setData` / `custom wrapper setData` 里核对元素 `cl` 是 `text_iZH9y`，与 common.wxss 的规则选择器一致。

注意 Taro 的页面节点包在 `custom-wrapper` 里，`wx.createSelectorQuery()` 和 `automation_element_action` 的 selector 都取不到这个元素，会报 `no such element`。用 console 里的 setData 日志取类名是可行路径。

2026-11-02 在 `4.3.2-alpha.2` 上的结果：

| 页面 | 红色像素 | 红色 bbox |
| --- | --- | --- |
| list | 1358 | `[2, 269, 268, 297]` |
| detail | 680 | `[4, 11, 138, 39]` |

console 里只有 `wx.getSystemInfo` 废弃告警和业务日志，没有样式相关报错。

### 4.4 业务侧版本

业务工程从 `4.2.2-beta.4` 升到 `4.3.2-alpha.2`，改了 22 处：`apps/app_order/package.json` 19 处、根 `package.json` 3 处（含 `pnpm.overrides`）。`pnpm-lock.yaml` 随之更新。

之前为验证未发布代码挂的 `node_modules/@tarojs/webpack5-runner → webpack5-runner-local` 软链已由 `pnpm install` 替换成真实发布包，残留目录已归档到临时目录。复验前请确认这条软链指向 `.pnpm/@tarojs+webpack5-runner@4.3.2-alpha.2`，否则验的是本地构建。

## 5. 当前状态

- Taro 仓库：分支 `feat/weapp-runtime-union_rebase`，HEAD `1dffe33f74`，工作树干净，未 push。
- 业务仓库：3 个文件未提交（两个 `package.json` 加 `pnpm-lock.yaml`）。
- `@tarojs/webpack5-runner@4.3.2-alpha.2` 已发布，业务工程解析到的就是发布包。
- 缺陷一、缺陷二在 `4.3.2-alpha.2` 上均已通过产物断言和真实渲染验证。

### 遗留

1. 两条 watch 用例在本机因 `EMFILE` 无法执行，需要在干净环境复跑一次并回填结果。
2. 业务仓库的版本升级改动尚未提交。
3. 构建日志里有 `@tarojs/components` 的 `ModuleDependencyWarning`（`InlinePaymentPanel`、`Lifestyle`、`Like`、`Login` 找不到导出），是业务侧引用与组件库版本的老问题，与本次样式改动无关，未处理。
4. `isolated` 与 `:host` 场景按约定不覆盖，若后续有业务方反馈需要，属于新需求。
