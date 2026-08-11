# 共享运行时(方案二 split)适用范围

本文档明确 `--shared-runtime --shared-runtime-mode split` 的适用与不适用场景。方案二 CLI 在 `taro-cli/src/presets/commands/build.ts` 里对不适用场景做了 fail-fast 拒绝,不会静默产出会崩的产物。

## ✅ 适用场景

**编译产物**:小程序端 pages 模式(可加 `--new-blended`)
**平台**:weapp / alipay / swan / tt / qq / jd / ascf

```bash
taro build --type weapp --new-blended --shared-runtime
taro build --type weapp --new-blended --shared-runtime --shared-runtime-mode split
```

**收益**:业务包不再自带 ~200KB Taro+React 运行时,由共享 `shared-async-v{N}` 子包统一提供。多个独立编译的业务包接入同一宿主时,共享一份异步核,首个激活的业务包 App 胜出。

## ❌ 不适用场景(CLI 编译期直接拒)

### 1. native-components 模式

```bash
taro build native-components --type weapp --shared-runtime  # ← 会 fail-fast
```

**为何不适用**:`BuildNativePlugin` 会移除 app.js entry(`plugins/BuildNativePlugin.ts:73-83`),`TaroInjectSyncCorePlugin` 找不到 `META_TYPE.ENTRY` 注入点,同步核 require 无处插入;但业务包 external 到 `wx.__TARO_RT_ASYNC_V1__[...]` 仍生效——产物读全局但无人挂载 → 运行时 `undefined` 崩溃。

**替代方案**:native-components 走独立发布路径,由宿主为其单独提供运行时依赖(如挂 SDK)。

### 2. 小程序插件(--plugin)模式

```bash
taro build --plugin weapp --shared-runtime  # ← 会 fail-fast
```

**为何不适用**:小程序插件在宿主中运行时无共享 JS 全局对象访问权;方案二依赖跨包 `wx.__TARO_RT_ASYNC_V*__` 全局共享,插件模式无法达成。

### 3. 非小程序端(h5 / rn / harmony)

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

### 版本一致性

- 所有业务包与共享运行时必须用**相同 Taro monorepo 版本**编译。异步核 provider 会做协议版本校验(`__rtVersion`),不一致直接 throw。
- react 全家桶(react/react-dom/react-reconciler/scheduler + @tarojs/react)版本由业务项目 node_modules 决定,产物 `runtime-manifest.json` 记录实际版本供排查。

### plugin-mv 幂等

Example 的 `plugin-mv/index.js` 在多业务包场景下对 `shared-async-v*` 做幂等处理:若宿主目标目录已存在且 async-provider.js 字节数一致(表明来自同版本 Taro 编译),跳过覆盖;不一致时告警不阻断,保留已存在版本。
