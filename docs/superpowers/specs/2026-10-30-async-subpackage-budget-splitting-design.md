# 异步分包预算拆分（asyncSubPackage budget splitting）设计规格

- 日期：2026-10-30
- 分支：`feat/async-subpackage-budget-splitting`
- 基线：`feat/weapp-runtime-union_rebase` @ `665880784c`
- 适用范围：微信小程序 `--new-blended`（混合开发）模式

## 1. 背景

现有 `subPackageIndie.asyncSubPackage` 只能表达「一个 sourceRoot → 一个 asyncRoot」。
它解决的是「独立分包里的动态组件产物落到哪个异步子包」，隐含三个前提：

1. 必须配置 `mainPackageRoot`，业务包有一个主入口页面；
2. `subPackageRoots` 是「独立编译的组件根」，不是页面；
3. 所有动态 import 的归属由 sourceRoot 前缀决定，无法表达「sub1 私有 / sub2 私有 / sub1+sub2 共享」三分类。

用户诉求：

- 不再把 `pages/index/index` 当业务入口、把 `sub1`/`sub2` 当组件；
- `sub1`、`sub2` 直接是业务页面；
- `sub1` 的动态 import 只进 `sub1-async`，`sub2` 的只进 `sub2-async`；
- 两边共享的动态模块进用户配置的 `shared-async`；
- `shared-async` 超出单包体积上限时还能继续拆成 `shared-async-2`、`shared-async-3`；
- 配置要能看出「树形归属」，不要 `splits` 这类隐式约定。

## 2. 目标与非目标

### 2.1 目标

1. `subPackageIndie` 支持省略 `mainPackageRoot`，进入 **async-only 模式**。
2. async-only 模式下 `subPackageRoots` 的语义切换为「异步分包归属规则」。
3. 规则支持 `path: string | RegExp | Array<string | RegExp>`，`asyncRoot: string | string[]`，可选 `maxSize`。
4. 按「模块的消费页面集合」决定归属，而不是按源码目录前缀。
5. 多物理目标按 `maxSize` 做确定性分配；不可拆分或容量不足时构建报错。
6. 只生成、只注册真正被使用的 asyncRoot。
7. 与共享运行时（`sharedRuntime`）共存：业务异步 chunk 必须等 provider 就绪后再 resolve。
8. 旧 `subPackageIndie`（带 `mainPackageRoot`）行为逐字节不变。

### 2.2 非目标

- 不支持普通（非 `--new-blended`）构建模式。
- 不支持微信「独立分包」（`independent: true`）。
- 不实现多业务包并发冷启动的完整多 App 隔离。
- 不为 `asyncRoot` 支持正则；`asyncRoot` 必须是显式目录。
- 不改变 `shared-async-v1`（框架 provider）的固定命名与职责。

## 3. 配置契约

```ts
type EntrySelector = string | RegExp

interface AsyncSubPackageRuleConfig {
  /** 匹配 app.config 中已声明的页面路径（不含扩展名），如 'pages/sub1/index' */
  path: EntrySelector | EntrySelector[]
  asyncSubPackage: {
    /** 物理异步分包根目录，一个或多个 */
    asyncRoot: string | string[]
    /** 每个物理目标的字节预算；asyncRoot 为数组时必填 */
    maxSize?: number
  }
}

interface SubPackageIndieRootConfig {
  path: string | RegExp | Array<string | RegExp>
  disableRecursiveComponent?: boolean
  asyncSubPackage?: {
    asyncRoot: string | string[]
    maxSize?: number
  }
}

interface SubPackageIndieConfig {
  /** 省略即进入 async-only 模式 */
  mainPackageRoot?: SubPackageIndieRootConfig
  subPackageRoots?: SubPackageIndieRootConfig[]
}
```

示例：

```js
subPackageIndie: [
  {
    subPackageRoots: [
      {
        path: 'pages/sub1/index',
        asyncSubPackage: { asyncRoot: 'pages/sub1-async' },
      },
      {
        path: 'pages/sub2/index',
        asyncSubPackage: { asyncRoot: 'pages/sub2-async' },
      },
      {
        path: /^pages\/sub\d+\/index$/,
        asyncSubPackage: {
          asyncRoot: ['pages/shared-async', 'pages/shared-async-2'],
          maxSize: 1_500_000,
        },
      },
    ],
  },
]
```

## 4. 语义

### 4.1 页面匹配

- `path` 只匹配 **已声明页面**：`app.config.pages` + `app.config.subPackages[].pages`。
- 不接受源码文件扩展名、组件路径、mv 宿主前缀、provider 路径。
- 字符串为精确匹配；`RegExp` 为 `test()` 匹配（每次匹配前重置 `lastIndex`）。
- 数组为并集去重。
- 一条规则匹配不到任何页面 → 构建报错。
- 两条规则匹配到完全相同的页面集合 → 构建报错（歧义）。

### 4.2 模块归属

对每个异步 chunk，计算它的 **消费页面集合** `consumers`：

1. 优先取 `chunk.groupsIterable` 中每个 group 的 `origins`（动态 import 调用点），沿 `moduleGraph` 的 incoming connections 上溯到页面入口模块；
2. 若 origins 无结果，退化为遍历 chunk 内模块上溯；
3. 上溯到页面入口即停止，记录页面路径。

归属判定：

| consumers | 结果 |
| --- | --- |
| 空集 | 不接管，保持 webpack 默认（留在主包异步 chunk） |
| 没有任何规则命中其中任一页面 | 不接管 |
| 有规则命中，但没有一条规则覆盖全部 consumers | 构建报错 |
| 有多条规则覆盖全部 consumers | 取 `matchedPages` 最小者；并列则报错 |
| 唯一最小规则 | 归入该规则的 `asyncRoot`（单目标）或按预算分配（多目标） |

关键推论：

- 同一业务包内多个页面共享模块 **不算** 跨包共享，仍按覆盖它们的最小规则走。
- 源码目录不决定归属；只有「谁 import 了它」决定归属。

### 4.3 预算分配

- `asyncRoot` 为字符串：全部 chunk 进该目录，`maxSize` 仅做总量校验。
- `asyncRoot` 为数组：`maxSize` 必填。
- 分配算法（确定性）：
  1. chunk 按估算体积降序、名称升序排序；
  2. 依次放入第一个「已用 + 本 chunk ≤ maxSize」的目标；
  3. 单个 chunk 体积 > maxSize → 报错（不可拆分单元）；
  4. 所有目标都放不下 → 报错。
- 体积估算使用 `chunkGraph` 内模块 `size()` 之和（压缩前，偏保守）。
- 产物阶段复核实际体积；超过 `maxSize` 报错。

### 4.4 生成与注册

- 只为「实际分配到 chunk」的 asyncRoot 生成 `index.js` / `index.json` / `index.wxml`。
- 只为这些 root 写入 `app.json.subPackages`。
- 未被使用的 `asyncRoot` 不产生任何产物。

## 5. 产物结构

### 5.1 业务包 dist（async-only）

```text
dist/
├── app.js                     # 业务 App（newBlended 下不注册 App()，导出 taroApp）
├── app.json                   # pages: []；subPackages: sub1 / sub2 / 用到的 async root
├── app.wxss
├── runtime.js                 # 唯一 webpack runtime，位于根目录
├── taro-shared-sync.js        # 共享运行时同步核（sharedRuntime 开启时）
├── base.wxml
├── common.js / vendors.js     # 主包公共 chunk（如存在）
├── pages/
│   ├── sub1/
│   │   ├── index.js           # require('../../app')
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss         # 含 sub1 私有异步样式
│   ├── sub2/
│   │   └── ...
│   ├── sub1-async/
│   │   ├── index.js           # require 本目录全部 chunk
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── async-*.js
│   ├── sub2-async/
│   │   └── ...
│   └── shared-async/
│       ├── index.js
│       ├── index.json
│       ├── index.wxml
│       └── async-*.js
└── shared-async-v1/           # 框架 provider（与业务 shared-async 不同）
    ├── index.js
    ├── index.json
    ├── index.wxml
    └── async-provider.js
```

要点：

- `pages/sub1/index`、`pages/sub2/index` 是**真实页面**，不是 `component: true` 组件。
- `runtime.js` 留在根目录，因此 `require.async` 的相对锚点是根目录（`''`）。
- 业务 `shared-async` 与框架 `shared-async-v1` 是两个不同目录，禁止同名。

### 5.2 宿主小程序（mv 后）

```text
miniapp/
├── app.json
├── pages/
│   ├── entry/                 # 宿主原生入口页
│   └── order/                 # 业务包整体拷贝
│       ├── app.js
│       ├── runtime.js
│       ├── taro-shared-sync.js
│       ├── pages/sub1/index.*
│       ├── pages/sub2/index.*
│       ├── pages/sub1-async/*
│       ├── pages/sub2-async/*
│       ├── pages/shared-async/*
│       └── shared-async-v1/*
```

宿主 `app.json.subPackages` 需要注册（root 带 `pages/order/` 前缀）：

- `pages/order/pages/sub1` → `['index']`
- `pages/order/pages/sub2` → `['index']`
- `pages/order/pages/sub1-async` → `['index']`
- `pages/order/pages/sub2-async` → `['index']`
- `pages/order/pages/shared-async` → `['index']`
- `pages/order/shared-async-v1` → `['index']`

`require.async` 在宿主中由 `pages/order/runtime.js` 发起，请求 `./pages/sub1-async/async-X`，解析为 `pages/order/pages/sub1-async/async-X`。

## 6. 运行时模型

### 6.1 三层边界

```text
宿主共享 Taro/React runtime
└── order 业务包：一个 App、一份 webpack runtime、一份模块缓存
    ├── sub1 / sub2 页面
    ├── 私有异步分包 sub1-async / sub2-async
    └── 共享异步分包 shared-async
```

- 物理异步分包不创建新的业务 App、不创建新的模块缓存。
- 共享模块只执行一次。
- provider 与业务 chunk 可并行加载，但业务异步模块依赖共享运行时前必须等待就绪信号。

### 6.2 就绪信号

- `entry.sync.js` 在安装占位后初始化：
  - `shared.__rtProviderState = 'pending'`
  - `shared.__rtProviderWaiters = []`
  - `shared.__rtProviderSettle(ok, err)`
- `async-provider.js` 的 `activate()` 在**全部 fill 完成后**返回 `true`；占位未就绪而提前返回时返回 `false`。
- `entry.sync.js` 收到 `true` 后调用 `__rtProviderSettle(true)`；异常或 `require.async` 失败调用 `__rtProviderSettle(false, err)`。
- 业务运行时 `loadScript` 在 `require.async(request)` 成功后追加 `waitSharedRuntime()`：
  - 无共享运行时 / 已 ready → 立即 resolve；
  - pending → 入队等待；
  - error → reject，错误向上传播，绝不挂起。
- 不使用 `__rtActivated` 作为完成信号（它在 fill 之前置位）。

## 7. 兼容性

- 带 `mainPackageRoot` 的旧配置：解析、chunk 归属、样式/模板回填、app.json 注册、runtime 锚点全部保持现状。
- `subPackageIndie` 仍是编译期配置，不写入小程序 `app.json`。
- `mainPackageRoot` 省略时：
  - 不执行独立分包模板/运行时/app 搬迁；
  - 保留根级 `app.js`、业务 webpack runtime、`taro-shared-sync.js`；
  - 不生成 `comp` / `custom-wrapper` 的独立 root 副本。

## 8. 风险

1. **chunk 消费者解析依赖 webpack moduleGraph**：极端动态拼接 import 可能上溯失败，此时不接管（留在主包），不会静默错放。
2. **体积估算偏保守**：可能提前拆分；产物阶段复核兜底。
3. **共享运行时就绪门**：新增等待逻辑，若 provider 永不 settle 会挂起；已用 error 分支与超时外的显式 reject 覆盖。
4. **宿主注册清理**：mv 插件必须只清理自己拥有的 root，避免误删宿主其它分包。
5. **`pages: []`**：业务包 app.json 允许空主包页面，但宿主必须自带页面；该约束由 mv 插件与宿主保证。
