# 共享运行时(方案二 split)适用范围

本文档明确 `--shared-runtime --shared-runtime-mode split` 的适用与不适用场景。方案二 CLI 在 `taro-cli/src/presets/commands/build.ts` 里对不适用场景做了 fail-fast 拒绝,不会静默产出会崩的产物。

## ✅ 适用场景

### 1. 小程序 pages 模式(可加 `--new-blended`)

**平台**:weapp / alipay / swan / tt / qq / jd / ascf

```bash
taro build --type weapp --new-blended --shared-runtime
taro build --type weapp --new-blended --shared-runtime --shared-runtime-mode split
```

**收益**:业务包不再自带 ~200KB Taro+React 运行时,由共享 `shared-async-v{N}` 子包统一提供。多个独立编译的业务包接入同一宿主时,共享一份异步核。

### 2. native-components 模式(F6 起支持)

```bash
taro build native-components --type weapp --shared-runtime --shared-runtime-mode split
```

**收益**:多个独立编译的 native-components 包接入同一方案二宿主时,共享一份异步核,不再每包各带 ~200KB 运行时;与主业务包共存时 react 全家桶共用同一实例(避免双实例)。

**机制**(与 pages 模式对称):
- 每个 native-component(miniType=PAGE)chunk 顶部由 `TaroInjectSyncCorePlugin`(injectOnPage=true)注入 `require('taro-shared-sync')`,同步核先于组件 `Component(...)` 注册就位。
- **同步占位 `createNativeComponentConfig`**:native-comp 产物顶层**同步**调 `fw.createNativeComponentConfig(...)` 建描述符传给 `Component()`。同步核阶段 framework/reactDOM 尚是占位,app-shim 装一个占位版:同步返回**形状完整的 WeChat Component 描述符**(created/attached/ready/detached/pageLifetimes/methods/分享/支付宝别名齐全),各生命周期是延迟转发器——真身未到则按调用顺序缓存。异步核到位后 `__replayNativeCompConfigs` 用真身 framework 重建描述符并按序重放缓存调用(created→attached→…)。这是 `createReactApp` 占位的 native 版对应物;缺它则顶层调用拿到 `undefined` 直接崩(组件不渲染)。
- `@tarojs/react` 的 `createNativeComponentConfig` 引入 `isNativeShared` 第三分支:按 pkgId 存/查 `shared.__nativeComponentApps[pkgId]`,不共用 `Current.app`、不共用单例 `nativeComponentApp`。
- container id 用 `app_${pkgId}` 隔离(与 pages 的 `config.appId=pkgId` 同源),避免多包 React root 挂到同一 DOM node 互相覆盖。
- 时序兜底:host 页面在异步核就绪前渲染 native-comp 时,组件 attached 排队到 `shared.__nativeCompQueue`,异步核 activate 后 flush;组件在就绪前销毁则按 compId 出队,避免僵尸挂载。

**前提**:native-components 产物**必须在方案二共享运行时宿主内使用**(宿主需提供 `wx.__TARO_RT_ASYNC_V1__` 全局)。若要发给非方案二宿主,去掉 `--shared-runtime` 走 vanilla 自足产物。

## ❌ 不适用场景(CLI 编译期直接拒)

### 1. 小程序插件(--plugin)模式

```bash
taro build --plugin weapp --shared-runtime  # ← 会 fail-fast
```

**为何不适用**:小程序插件在宿主中运行时无共享 JS 全局对象访问权;方案二依赖跨包 `wx.__TARO_RT_ASYNC_V*__` 全局共享,插件模式无法达成。

### 2. 非小程序端(h5 / rn / harmony)

```bash
taro build --type h5 --shared-runtime  # ← 会 fail-fast
```

**为何不适用**:h5/rn/harmony 走独立编译栈,不经过 `MiniCombination`/`externals` 层,方案二 flag 传入会静默失效——CLI 直接拒绝以避免开发者误用。

## ⚠️ 已知边界

### 多业务包共享——last-writer(后加载者胜出)

多个独立编译的业务包接入同一宿主时,共享一份异步核。**后加载的业务包 App 覆盖 Current.app**——与 Taro 单份 runtime 里 framework `createReactApp` 的原生行为一致(`packages/taro-framework-react/src/runtime/connect.ts:434` `Current.app = appObj` 无守卫赋值)。

**流程**:
- 若异步核尚未激活:后到者调 `fw.createReactApp(App_B, ...)` 覆盖 `shared.__appBootstrap`,异步核激活时 `__activateReal` 用最后一包的 App 建 realAppObj。
- 若异步核已激活:后到者调用直接进 framework 真身 createReactApp,内部按原生语义覆盖 `Current.app`。

**为何选 last-writer**:非共享运行时下,每个业务包各带独立 `@tarojs/runtime` 副本,`Current` 是模块级常量,两包各自一份、完全隔离——不存在"覆盖 vs 首包"这个问题。方案二把多包塞进一份 `Current` 后,应选与单份 runtime **原生语义连续**的策略。last-writer 让"最后加载的包成为当前活跃 App",符合 Taro API 一贯行为与业务"就近激活"直觉。

**含义**:多包在同一时刻共用一个 App 生命周期(以最后加载者为准)。若两包各自需要独立 App 副作用(独立 `onLaunch`/`onShow`),当前架构不支持——需后续扩展多 App 表 + 按包路由分派。

**Caveat**:mount 队列错位。app-shim 的 whenReal 队列缓存了页面 mount/lifecycle,若 A 页面已入队、B 后加载成为 last-writer,`__activateReal` 用 B 的 App 建 realAppObj,A 的页面会挂到 B 的 AppWrapper 上。此矛盾根源是"多包共用一个 AppWrapper",与 first/last 无关——真正的解是多 App 隔离。

### native-components 下 `Current.app` 是占位/页面包 App(非本组件 Entry)

native-components 包**没有 app.js**,从不调 `createReactApp`。因此:

- 同步核 `__activateReal` 因无 `__appBootstrap` 早退,**`Current.app` 保持 app-shim 装的占位对象**(`{ __isTaroPlaceholder: true, ... }`);若宿主同时有页面业务包(basic/order),`Current.app` 则是最后加载页面包的 App(last-writer)。
- native-comp 的真正渲染与组件生命周期由 **`shared.__nativeComponentApps[pkgId]`**(Entry 实例)驱动,**刻意不写 `Current.app`**——否则多包共存时会覆盖页面包的 App(即 F5 修的那个洞)。

**含义**:在 native-comp 内 `getCurrentInstance().app` 拿到的是占位或页面包 App,**不是**本组件的 Entry。这对 native-comp 无害——它不驱动 App 生命周期;真正依赖的 `Current.page` / `Current.router` 均正常(useReady/useLoad、路由参数都对)。

**对比 vanilla**:非共享 native-comp 会把 `Current.app` 设为 Entry(`connect-native.ts` `isDefaultEntryDom` 分支)。共享模式为避免跨包覆盖改用 pkgId 表,故 `Current.app` 语义不同。若业务代码在 native-comp 里读 `getCurrentInstance().app` 并依赖它是本组件 Entry,需改读 `shared.__nativeComponentApps[pkgId]`,或不依赖该字段。

### 版本一致性

- 所有业务包与共享运行时必须用**相同 Taro monorepo 版本**编译。异步核 provider 会做协议版本校验(`__rtVersion`),不一致直接 throw。
- react 全家桶(react/react-dom/react-reconciler/scheduler + @tarojs/react)版本由业务项目 node_modules 决定,产物 `runtime-manifest.json` 记录实际版本供排查。

### plugin-mv 幂等

Example 的 `plugin-mv/index.js` 在多业务包场景下对 `shared-async-v*` 做幂等处理:若宿主目标目录已存在且 async-provider.js 字节数一致(表明来自同版本 Taro 编译),跳过覆盖;不一致时告警不阻断,保留已存在版本。
