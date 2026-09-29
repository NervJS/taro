## Demo - 共享运行时（split 模式）

把 Taro / React 运行时从业务包中 external 出去，由一个独立的 `shared-async-v1` 异步核分包统一提供；业务包内只保留一个体积很小的同步核 `taro-shared-sync.js`。多个独立编译的业务包接入同一宿主时，可共享同一份运行时，业务包自身不再各带 ~200KB 的 Taro + React 运行时。

本示例含两个独立编译的业务包，共享同一异步核：

- `taro-project/` —— **pages 模式**业务包，含 `app.js` + 页面。
- `native-comp-project/` —— **native-components 模式**业务包，仅 `components` 无 `pages`，产物为一批可被原生宿主 `usingComponents` 引用的自定义组件。

两者产出的 `shared-async-v1/` 内容一致（同版本运行时），共同拷进宿主 `miniapp/pages/shared-async-v1/`（`plugin-mv` 幂等覆盖）。

### 开发环境

推荐在业务子项目中进行开发调试，生产环境下再在原生宿主 `miniapp` 中预览。

#### 1. 编译运行

```bash
# pages 业务包
$ (cd taro-project && npm run dev)

# native-components 业务包
$ (cd native-comp-project && npm run dev)
```

#### 2. 预览

小程序开发者工具导入项目，路径可以是：

- `shared-runtime/taro-project` —— 单独预览 pages 业务包（业务产物 `dist/app.json` 已自动注册 `shared-async-v1` 分包与 `preloadRule`，可直接打开）。
- `shared-runtime/native-comp-project` —— native-comp 产物**没有 `app.json`**（`BuildNativePlugin` 不生成 app 配置），不可独立预览；须走宿主 `miniapp` 集成路径。

### 生产环境

#### 1. 编译运行

```bash
# 两个业务包各跑一次 build，plugin-mv 分别把产物搬进宿主
$ (cd taro-project && npm run build)
$ (cd native-comp-project && npm run build)
```

- `taro-project/plugin-mv` 把 `taro-project/dist` 搬进宿主：业务产物 → `miniapp/pages/shared-runtime/`；异步核 → 与之平级的 `miniapp/pages/shared-async-v1/`。
- `native-comp-project/plugin-mv` 把 `native-comp-project/dist` 搬进宿主：native-comp 产物 → `miniapp/pages/shared-native-comp/`；异步核幂等覆盖到同一个 `miniapp/pages/shared-async-v1/`（两包运行时版本必须一致，否则 `__rtVersion` 校验 fail-fast）。

#### 2. 预览

> **首次跑之前必须两个业务包各 build 一次**：宿主 `miniapp/app.json` 里声明的 `pages/shared-runtime` 与 `pages/shared-native-comp` 都是 subPackage root，微信开发者工具在打开项目时会校验这两个目录**必须真实存在**（`app.json: ["subPackages"][x]["root"] field needs to be Directory`）。生产流程里业务包 build 会自动把产物落到这两个目录，先决条件是两包各跑过至少一次 `npm run build`。若你只想演示其中一种模式，把 `miniapp/app.json` 里未 build 的那一项从 `subPackages` 里删掉即可。

小程序开发者工具导入 `shared-runtime/miniapp`：宿主入口页有两个按钮。

- **打开共享运行时 Taro 页面（pages 模式）** —— 跳进 `pages/shared-runtime/pages/index/index`，走的是 `createReactApp` 占位 → 异步核 activate → 页面 mount 路径。
- **打开共享运行时 native-component 页（native-components 模式）** —— 跳进 `pages/comp-host/index`（宿主原生页），页面 `usingComponents` 引用 `pages/shared-native-comp/components/counter/index`。走的是 `createNativeComponentConfig` 占位 → 异步核 activate → `__replayNativeCompConfigs` 重放路径。

宿主 `app.json` 已手工注册两个业务分包 + 异步核分包：`pages/shared-runtime`、`pages/shared-native-comp`、`pages/shared-async-v1`，均平级于宿主 `pages/` 下。`preloadRule` 已配置：进入 `pages/comp-host/index` 前预下载 `shared-async-v1` 与 `shared-native-comp` 分包，缩小首屏窗口。

> **注意**：`pages/shared-native-comp` 分包内并无真实页面（native-comp 产物只有自定义组件）,但微信规范要求 `subPackages[].pages` **非空**,否则被认作无效分包(`preloadRule` 里引用会报 `pages/shared-native-comp/ not found`)。示例把该分包的 `pages` 声明为 `["components/counter/index"]`——路径指向 component（`component: true`）而非 page,只用于让微信认可分包有效,实际渲染仍由宿主 `pages/comp-host` 的 `usingComponents` 触发。

### 介绍

本示例演示了共享运行时（split 模式）的以下特性：

- 业务包产物不再打包 Taro / React 运行时本体（被 external 到共享全局）。
- **pages 模式**：业务包 `app.js` 头部同步 `require('./taro-shared-sync')` 加载同步核。
- **native-components 模式**：每个 native-comp chunk 顶部由 `TaroInjectSyncCorePlugin`（`injectOnPage=true`）注入 `require('taro-shared-sync')`，先于 `Component()` 顶层调用；顶层 `fw.createNativeComponentConfig` 是**同步占位描述符**（`created`/`attached`/`ready`/`detached` 等生命周期延迟转发），异步核 activate 后 `__replayNativeCompConfigs` 用真身重建描述符并按序重放缓存调用。
- 同步核再异步 `require.async('../..[..]/shared-async-v1/index')` 拉起异步核分包，注册运行时真身；两种业务包共用同一异步核。
- 异步核分包 `shared-async-v1/` 内含 `async-provider.js` 与 `runtime-manifest.json`（记录 react 全家桶精确版本 + 运行时协议版本，供多包版本一致性排查）。
- 多个独立编译的业务包接入同一宿主时，可共享同一份异步核分包；`shared.__pkgApps` 与 `shared.__nativeComponentApps` 分别按 `pkgId` 隔离 pages 模式的 App 与 native-comp 的 Entry，互不覆盖。
