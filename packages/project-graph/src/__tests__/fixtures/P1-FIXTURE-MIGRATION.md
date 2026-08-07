# P1 Fixture 迁移登记（WP1 DoD #6）

> 依据 taro-meta `rfcs/0003-project-graph-p2-plan.md` §3.2 迁移矩阵与 §9 验收矩阵登记。
> 本文档是 fixture 维度的「保留 / 改 Schema 2.0 / 新增」台账，登记完成即视为 WP1 交付；具体改写动作属 WP2+。

## 一、`fixtures/` 现有项（唯一目录）

| 路径 | P1 用途 | P2 去向 | 说明 |
|---|---|---|---|
| `fixtures/mini-app/src/app.config.ts` | 最小 app config(两页面路由）,`graph.integration.spec.ts` 唯一 fixture | **改 Schema 2.0** | 保留两路由结构；补 `usingComponents` entry（数组形式 + 对象形式各一），供 P2 config usingComponents 边断言；不引 complexity,WP4 再补 app 级全局组件 |
| `fixtures/mini-app/src/pages/index/index.config.ts` | 最小 page config | **保留** | 不动 |
| `fixtures/mini-app/src/pages/index/index.tsx` | navigation 边断言（navigateTo/ghost page) | **保留** | JSX 仍走 React；P2 在同类目录补 componentUsage 用例（见下） |
| `fixtures/mini-app/src/pages/detail/index.tsx` | navigation 边目标页面 | **保留** | 不动 |
| —（新增）`fixtures/mini-app/src/components/...` | — | **新增** | 1 个 local 组件 + 1 个 barrel(re-export）二跳穿透用例 + 1 个平台后缀组件（Card.weapp.tsx + Card.tsx 双文件）；落 §4.4 判定树与 barrel 穿透断言 |
| —（新增）`fixtures/mini-app/src/pages/empty-route/` 只留 config 无 tsx | — | **新增** | config 声明 routePath 但 PageNode 不存在 → 产 `IGraphIssue { kind: 'empty-route' }`(§9 空路由诊断门禁） |
| —（新增）`fixtures/mini-app/src/components/unused-npm/` + `package.json` 声明 | — | **新增** | 未安装裸包 → external 键；`plugin://` specifier → external;webpackChain-only alias 不可解析 → unresolved + 缺失候选（对应 §4.4 判定树三分支） |

## 二、`__mocks__/` 现有项（与 fixtures 互补：P1 单测主要走这里）

WP1 决定：**`__mocks__/` 维持独立目录不合并**，P2 按需在各自目录新增；本文档一并登记以便 WP2 评估合并可行性。

| 路径 | P1 用途 | P2 去向 |
|---|---|---|
| `__mocks__/app-basic/app.config.ts` | 两页面 config 基准 | **保留** |
| `__mocks__/app-broken-syntax/app.config.ts` | `config_parse_failed` 分支覆盖 | **保留 · 语义对应** Schema 2.0 下断言 `IGraphIssue { kind: 'parse-failed' }` 替代 warning；文件本身不变 |
| `__mocks__/app-define/app.config.ts` | `defineAppConfig` helper 形态 | **保留** |
| `__mocks__/app-dirty-pages/app.config.ts` | `pages` 数组含空串 / 数字（脏数据） | **保留**（脏数据校验用例）。**注**：空串/非串被 `collectStrings` 直接 drop（不产 routePath），故**不构成 empty-route**（empty-route 定义为「有效 routePath 但缺 PageNode」）；empty-route 用例见 `app-tabbar-broken`（ghost pagePath），subPackages 触发源的 empty-route fixture 由 WP9 补 |
| `__mocks__/app-empty-pages/app.config.ts` | pages 空数组 | **保留** |
| `__mocks__/app-subpackage/app.config.ts` | subPackages 结构 | **保留** |
| `__mocks__/app-tabbar-broken/app.config.ts` | tabBar pagePath 指向不存在页面（broken_navigation) | **保留 · 语义对应** Schema 2.0 下通过 `INavigationEdge.resolved=false` + `IGraphIssue { kind:'empty-route' }` 断言 |
| `__mocks__/pages/nav-dynamic-url.tsx` | 模板字符串动态 url（不采 navigation) | **保留** |
| `__mocks__/pages/nav-false-positive.tsx` | class 方法遮蔽 `navigateTo` 不误判 | **保留** |
| `__mocks__/pages/nav-variants.tsx` | 直接 import / 别名 import / Taro.switchTab | **保留** |
| `__mocks__/pages/no-jsx.ts` | 纯函数文件（无 JSX) | **保留** |
| `__mocks__/pages/react-page.tsx` | 最小 JSX 页面 | **保留** |

## 三、Schema 2.0 断言需 rewrite 的测试文件（WP2+ 动作，本文档先登记）

| 测试 | 受影响点 |
|---|---|
| `graph.integration.spec.ts` | `expect(graph.warnings)` → `expect(graph.issues)`;GraphWarning 改名 → IGraphIssue;kind `'config_parse_failed'` → `'parse-failed'` |
| `config-parser.spec.ts` | 同上 warning → issue；新增 sourceSpan partial 断言（config 定位失败→owner partial) |
| `page-parser.spec.ts` | PageNode.framework 从恒 `'react'` 改为六值；新增 componentUsage 边断言（React jsx import binding) |
| `cli.spec.ts` | snapshot schemaVersion '1.0.0' → '2.0.0'；增加 `--link` 输出断言（file://:1:1)；增加 lint 含 empty-route 输出 |
| `mcp.spec.ts` | 同上版本字段 + summary envelope 对齐 getGraphSummary |
| `plugin-parser.spec.ts` | PluginNode A/B 层字段随 clean break 改名（`IPluginNode`）；**WP2 需补"同包多插件文件 id 不碰撞"断言**（对应 §3.2/§10 继承项 PluginNode id 碰撞修复，P1 C.6.4 缺陷#3）——现有 spec 未覆盖该场景 |
| `taro-plugin.spec.ts` | 不动（KERNEL_KEY 契约保留） |
| `cache-watch.spec.ts` / `watch.spec.ts` | snapshotId 断言方式调整（旧 snapshot 不再保留 warnings 形状） |

## 四、新增 fixture 一览（P2 全新）

1. `components/basic/` — local 组件 config + JSX 双关系
2. `components/barrel/` — re-export 二跳穿透到最终定义
3. `components/platform-suffix/` — Card.weapp.tsx + Card.tsx 归一
4. `components/npm-shallow/` — 已安装 npm 包浅纳入（终点，不递归）
5. `components/uninstalled-npm/` — external 键 + 安装后 npm 键（跨安装态，演示 §3.3 ③ id 迁移，防抖重建吸收）
6. `components/plugin-protocol/` — `plugin://` specifier（直接 external)
7. `components/array-specifier/` — `usingComponents: { x: ['path', { opts }] }` 数组形式
8. `components/mixed-ref-same-file/` — 已知假阳性②：同文件既被裸包名又被相对路径引用，落两节点（文档化断言，非缺陷）
9. `cycle/a.tsx` / `cycle/b.tsx` — local usingComponent 双 kind SCC cycle（自环 / 双节点互引）
10. `framework-variants/` — preact / solid / vue3 / none 各一最小 app（WP5b framework 六值断言 + Vue3 `framework: 'vue3'` + config-only,template 不采）

## 五、未登记的 P1 源

无。`src/__tests__/` 下 P1 资产只在 fixtures / __mocks__ / *.spec.ts 三处，全部已登记。
