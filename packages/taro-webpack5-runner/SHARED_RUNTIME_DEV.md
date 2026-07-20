# 共享运行时（`--shared-runtime`）· Taro 开发实现文档

> 面向 Taro 框架/CLI 开发者。讲清两种共享运行时方案的**设计思路、实现取舍、具体改动位置、示例输出**。业务方使用文档见 `Testing/taro-blended-project/docs/共享运行时-业务方接入指南.md`。
>
> 相关 commit：`b799119f`（方案一 host）、`a9f46cd2`（方案二 split）。

---

## 一、要解决的问题

多个**独立编译**的 Taro 项目并入同一宿主小程序，每个产物各带一份运行时（Taro + React，压缩后 200KB+），重复 N 份。

**第一性约束**：独立 webpack 编译，各自的 module-id 空间与 `__webpack_require__` 互不相通 —— 无法直接共享 chunk 文件。跨编译唯一能传递的是**全局变量**。

**由此确定的统一手法**：运行时挂到 `wx.__TARO_SHARED__[包名]`，业务包把运行时依赖 external 到该全局读取。两方案共用这个约定，区别只在「谁、何时填全局」。

---

## 二、关键设计约束：同步性

Taro 入口是**模块顶层同步执行**的，有两处硬同步锚点：

| 锚点 | 位置 | 依赖 |
|---|---|---|
| 页面注册 `Page(createPageConfig(...))` | `taro-loader/src/page.ts` | `@tarojs/runtime` |
| app 初始化 `initPxTransform(...)` | `taro-loader/src/app.ts` | `@tarojs/taro` |

微信加载页面时**同步 require** 该文件、期望返回即完成注册。**任何 `await`/门闩都救不了顶层同步调用**。

推论：`external` 只是把 `import X from 'pkg'` 编译成一次全局读取 `var X = wx.__TARO_SHARED__['pkg']`。**读不崩，崩的是「读到 undefined 后立即调用」**。所以全局必须在业务包顶层执行前就位。这条约束直接分出两种方案：

- **方案一**：整条链放主包同步核，业务包读全局时**必然已就位** → 顶层怎么用都安全。
- **方案二**：只把「页面注册必需的最小核」留同步、随业务包；React 等大头异步，用**占位排队**兜住「顶层已引用但真身未到」的窗口。

---

## 三、方案一：运行时统一（host 模式，`--shared-runtime`）

### 3.1 设计
整条链（`@tarojs/runtime`+`@tarojs/shared`+`react`+`react-dom`+`react-reconciler`+`@tarojs/taro-react`+`@tarojs/taro`+`@tarojs/components`）打成一个 `taro-core`，放宿主主包，`app.js` 顶层同步 require → 挂全局。业务包 external 读取。全同步，无异步/无 Proxy/无门闩。

> `@tarojs/components` 是例外：**不 external**。它是编译期模板收集的依据（external 后 `base.wxml` 会漏生成组件模板，如 Button 的 `tmpl_0_14`），且本身是 `'view'`/`'button'` 字符串常量，体积极小，随业务包自带无成本。

### 3.2 具体改动位置

| 文件 | 改动 |
|---|---|
| `taro-cli/src/cli.ts` | 解析 `--shared-runtime` → `sharedRuntime: Boolean(args['shared-runtime'])` |
| `taro-cli/src/presets/commands/build.ts` | 新增 flag 描述 + 解构 + 透传 config |
| `taro-webpack5-runner/src/utils/types.ts` | `IMiniBuildConfig` 加 `sharedRuntime?: boolean` |
| `taro-webpack5-runner/src/webpack/MiniCombination.ts` | **核心**：`shouldShareExternal`（78-90）判定 external 白名单；`sharedExternals`（91-98）编译成 `wx.__TARO_SHARED__[request]`；加进 `chain.merge` 的 `externals`（110）；`getOptimization(sharedRuntime)`（139）关掉 `taro` cacheGroup、vendors 剔除 react |
| `taro-webpack5-runner/src/webpack/MiniWebpackPlugin.ts` | `getCommonChunks()` 在 sharedRuntime 下过滤 `taro` chunk，页面 require 头不再引它 |

**external 判定逻辑**（`MiniCombination.ts:79-90`）：
```
@tarojs/* (REG_TARO_SCOPED_PACKAGE) 或 react/react-dom/react-reconciler/scheduler
  → external 到 wx.__TARO_SHARED__[request]
排除：@tarojs/taro-loader（编译期 loader）、@tarojs/components（模板收集依赖）
```

> mini 构建此前**没有 externals 能力**（只有 H5 有），这是从零新增的。

### 3.3 `taro-core` 产物
方案一的 `taro-core` 目前由一个独立打包脚本产出（PoC 阶段在 `Testing/taro-blended-project/taro-core-poc/`），把整条链 require 进来后挂全局：
```js
var shared = (wx.__TARO_SHARED__ = wx.__TARO_SHARED__ || {})
share('@tarojs/runtime', require('@tarojs/runtime'))
share('@tarojs/taro', require('@tarojs/taro'))      // 内部触发 initNativeApi 挂平台 API
share('react', require('react'))
share('react-dom', require('@tarojs/react'))         // 小程序下 react-dom alias 成 @tarojs/react
// … 平台 runtime、framework runtime、jsx-runtime
```
两个踩过的坑（务必注意）：
1. `@tarojs/components` 要用**小程序版**（`@tarojs/plugin-platform-weapp/dist/components-react`，字符串常量），直接 `require('@tarojs/components')` 会拿到 H5 版（含 hammerjs 顶层摸 `document`）真机崩。
2. React 生命周期 hook（`useLoad` 等）不在 `@tarojs/taro` 本体上，需从 framework runtime 合并进 `@tarojs/taro`（正常编译时由 framework 插件做，`taro-core` 要复刻）。

### 3.4 示例输出
业务 `--shared-runtime` build 后：
- `dist/` 里 `taro.js` **消失**、`vendors.js` **不含 react**。
- 页面 `index.js` 头部：`var s = wx.__TARO_SHARED__["@tarojs/runtime"]` 等 external 读取。
- 宿主 `app.js` 顶层：`require('./taro-core/index.js')`（接入方手写）。

---

## 四、方案二：同步核 + React 异步子包（split 模式，`--shared-runtime-mode split`）

### 4.1 设计
主包零占用。运行时按「首次被用的时机」切两层：

| 层 | 内容 | 归属 | 依据 |
|---|---|---|---|
| **同步核** | `@tarojs/runtime` + `@tarojs/shared` + 平台 runtime + **react 本体** | 随业务包，app.js 顶层同步 require | 页面注册同步必需；react 本体因业务 `class App extends React.Component` 顶层执行也必须同步（仅 ~9KB） |
| **异步子包** | `react-reconciler`(`@tarojs/react`) + framework runtime + `@tarojs/taro` API | 独立子包 `shared-async`，onLoad 后 `require.async` | mount/渲染/API 调用才用，可延迟 |

**占位排队机制（核心难点）**：业务 app.js 顶层同步调 `createReactApp(...)`，但此刻 framework 是占位。设计：
- 同步核装一个**占位 framework**：其 `createReactApp` 只存下 `{App, config}`（`__appBootstrap`）并返回一个**占位 appObj**（`onLaunch`/`mount` 等全部排队）。
- 占位 `@tarojs/taro` 的 `initPxTransform` 存参待补跑。
- React 异步子包（`async-provider`）就绪后：用真身 react 重跑 `createReactApp`、把真身**原地 mutate** 进占位对象（保引用不变，业务顶层已捕获），flush 排队的调用。
- 幂等：若检测到 framework 已是真身（方案一场景），占位安装跳过、不发 `require.async` —— **这是「先二后一」平滑迁移的关键**。

### 4.2 具体改动位置

| 文件 | 改动 |
|---|---|
| `cli.ts` / `build.ts` / `types.ts` | 新增 `--shared-runtime-mode host\|split`，透传 `sharedRuntimeMode` |
| `taro-webpack5-runner/src/plugins/TaroInjectSyncCorePlugin.ts` | **新增**：给 app 入口 chunk（`META_TYPE.ENTRY`）头部注入 `require('<syncCore>')`，仿 `TaroLoadChunksPlugin` 的 render 钩子 + `addRequireToSource` |
| `taro-webpack5-runner/src/webpack/MiniWebpackPlugin.ts:50-54` | split 模式挂上 `TaroInjectSyncCorePlugin` |
| `taro-webpack5-runner/src/shared-runtime/*.js` | **新增** 4 个 provider 运行时源文件（下详） |
| `taro-webpack5-runner/src/shared-runtime/build-shared-runtime.ts` | **新增**：主构建后跑独立双 bundle 子构建 + 生成占位入口 + 注册 shared-async 到 app.json |
| `taro-webpack5-runner/src/shared-runtime/constants.ts` | 共享常量（`SHARED_SYNC_CORE_NAME` / `SHARED_ASYNC_ROOT`） |
| `taro-webpack5-runner/src/index.mini.ts:75-83` | 主构建成功后 `if (sharedRuntime && mode==='split') buildSharedRuntime(combination)` |
| `taro-webpack5-runner/mv-comp.js` / `tsconfig.json` | build 时拷 `.js` 运行时模板进 dist（tsc 不处理）、exclude 掉 `shared-runtime/*.js` |

**provider 源文件**（`src/shared-runtime/`，运行时模板，由子构建打包）：
- `entry.sync.js` —— 同步核入口：填 runtime/shared/平台/react 本体 + 装占位 + 触发异步。
- `app-shim.js` —— 占位 framework/taro + 占位 appObj 排队 + `__activateReal` flush。
- `bootstrap.js` —— 幂等分派：已就位则同步激活，否则 `require('shared-async/index')`（→ 编译成 `require.async`）。
- `async-provider.js` —— 异步子包：mutate 真身进占位 + flush。

### 4.3 为什么 provider 用独立 webpack 子构建（而非 child compiler）
主构建的 `externals` 把 `@tarojs/*`+react 外置了，而 provider 要把它们**真正打进产物**（依赖集正相反）。child compiler 会继承父 `externals` → `require('react-reconciler')` 被外置成空引用。故用**独立 `webpack()`**，自带一套「反向 external」：
- `build-shared-runtime.ts` 里 `sync-core` config：external 掉 `shared-async/index`（promise 类型 → 编译成 `require.async(相对路径)`）。
- `async-provider` config：external 掉同步核已提供的包（runtime/shared/平台/react → 读全局），**只打 reconciler/framework/api** —— **保多包单例**（这是 PoC 踩过的坑：不 external 会打进第二份 react/document 导致 hooks 崩、`没有找到页面实例`）。
- DefinePlugin 常量复用主构建的 runtime DOM 开关。
- `resolve.modules` 指向**用户项目** node_modules（provider 要解析业务方的 react/@tarojs 版本）。

### 4.4 require.async 路径
微信 `require.async` **不认前导 `/`**，按调用文件所在目录做相对解析。而业务独立编译时**不预知**自己会被拷到宿主哪层 → 无法自动算。故由接入方配置 `config.mini.sharedRuntimeAsyncRequest`（`build-shared-runtime.ts` 的 `getAsyncRequest` 读取），编译进 sync-core 的 external。

### 4.5 示例输出
`build:basic:split` 后 `dist/`：
```
dist/
├── app.js                      # 头部自动注入 require("./taro-shared-sync")
├── app.json                    # 自动注册 shared-async 子包
├── taro-shared-sync.js         # 同步核 101KB（子构建产出）
├── shared-async/
│   ├── index.js                # 占位入口：require('./async-provider.js')
│   ├── index.json / index.wxml # 占位
│   └── async-provider.js       # reconciler+framework+api 121KB
└── pages/…                     # 业务页面 external 读全局
```
sync-core 里：`require.async("../../shared-async/index")`（按配置的相对路径）。

### 4.6 运行时序（进业务页时）
1. 主包 app.js 执行（无运行时）。
2. 进业务子包 → 业务 app.js 顶层 `require("./taro-shared-sync")`：同步填 runtime/shared/平台/react + 装占位 + 发 `require.async(shared-async)`。
3. 页面 `Page(createPageConfig(...))` 同步注册成功（只用 runtime，已就位）。
4. onLoad → `Current.app.mount` → 占位入队。
5. shared-async 到 → mutate 真身 + flush → 真正渲染。

---

## 五、为什么两方案业务产物零差异 / 可平滑迁移

两方案业务编译**完全复用同一套 external 逻辑**（`MiniCombination` 的 `shouldShareExternal` 不区分 mode）。业务产物都读同一个 `wx.__TARO_SHARED__`，唯一差别是 split 模式下 app.js 头部多一句 `require(sync-core)`。

而同步核 `bootstrap.js` **幂等自适应**：检测全局 framework 是否真身 → 决定同步直用还是异步加载。所以：
- 先方案二铺开；
- 宿主加载全量 taro-core（方案一的核）→ 已上线的方案二包**无需重编**，同步核检测到就位、自动同步直用、shared-async 休眠；
- 逐步用方案一重编业务包收全部体积收益。

**未改 loader**：`taro-loader/src/app.ts` 与 `loader-meta.ts` 均未改 —— 占位逻辑全在 sync-core 运行时，业务产物 = 方案一产物 + 一句 require。这是 PoC 验证后的重要简化（原计划的 `modifyInstantiate`/`splitMode` 分支被证明多余）。

---

## 六、体积实测（同口径，terser 压缩 / gzip）

| 产物 | 压缩后 | gzip |
|---|---|---|
| 方案一 taro-core（全量） | 226KB | 72KB |
| 方案二 同步核 | 101KB | 34KB |
| 方案二 异步子包 | 121KB | 38KB |

自洽：226 ≈ 101 + 121（同一条链的不同切分）。

**多项目累计对比（gzip 口径，直观看两方案的 crossover）**：
```
项目数 N   方案一（主包 taro-core 一份）   方案二（异步子包共用 + 同步核每包一份）
────────   ─────────────────────────────   ──────────────────────────────────────
   1        72KB                            38KB + 34×1 = 72KB
   2        72KB                            38KB + 34×2 = 106KB
   3        72KB                            38KB + 34×3 = 140KB
   5        72KB                            38KB + 34×5 = 208KB
   N        72KB（恒定）                    38 + 34×N（随 N 线性增长）
```
> 方案一运行时总量恒定；方案二同步核随项目数线性增长，N≥2 起总量反超方案一。方案二的价值不在总量，而在**主包零占用** + **首屏只需先下 34KB 同步核**（React 大头延后异步）。

> 同步核瘦身评估：曾评估把 runtime 的 DOM/BOM 也拆异步，实测天花板仅省 ~31KB（101→70KB），且需深度重构 `@tarojs/runtime` 入口（打破 `dsl/common.ts` 对 bom/dom 的顶层静态 import）、全平台回归，**性价比不足，已放弃**。

---

## 七、已知限制
- 仅微信（`globalObject='wx'`）；其它平台需另配全局对象。
- 所有业务项目 + 运行时必须锁定完全一致的 `@tarojs/*` 与 react 版本（全局单例）。
- 方案二 `sharedRuntimeAsyncRequest` 需接入方按宿主布局手配。
