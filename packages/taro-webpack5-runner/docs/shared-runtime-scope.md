# 共享运行时（split 模式）适用范围

本文档明确 `--shared-runtime --shared-runtime-mode split` 的适用与不适用场景。共享运行时 CLI 在 `taro-cli/src/presets/commands/build.ts` 里对不适用场景做了 fail-fast 拒绝,不会静默产出会崩的产物。

## ✅ 适用场景

### 1. 小程序 pages 模式(可加 `--new-blended`)

**平台**:CLI 白名单放行 weapp / alipay / swan / tt / qq / jd / ascf,但 **⚠️ 目前仅 weapp 经过真机验证**。

```bash
taro build --type weapp --new-blended --shared-runtime
taro build --type weapp --new-blended --shared-runtime --shared-runtime-mode split
```

**收益**:业务包不再自带 ~200KB Taro+React 运行时,由共享 `shared-async-v{N}` 子包统一提供。多个独立编译的业务包接入同一宿主时,共享一份异步核。

> **⚠️ 非 weapp 平台(alipay/swan/tt/qq/jd/ascf)已知不可用**:虽在 CLI 白名单内,但运行时有两处 weapp 硬编码泄漏,当前会静默产出错误产物,尚未修复:
> - `entry.sync.js` 与 `build-shared-runtime.ts::reverseExternals` 字面量 `require`/external `@tarojs/plugin-platform-weapp/dist/runtime`,未按 `buildAdapter` 参数化——非 weapp 平台会解析失败或错误注册 weapp 平台 API。
> - `connect-native.ts` 的共享全局查找兜底硬编码 `g.wx?.[globalKey]`,非 weapp 平台(`my`/`swan`/`tt`…)查不到 `__nativeComponentApps` 表。
>
> 修复方向:上述引用改由 `globalObject`/`buildAdapter` 动态确定(工作量 + 需非 weapp 真机环境验证)。在此之前,非 weapp 平台请勿用于生产。

### 2. native-components 模式(F6 起支持)

```bash
taro build native-components --type weapp --shared-runtime --shared-runtime-mode split
```

**收益**:多个独立编译的 native-components 包接入同一共享运行时宿主时,共享一份异步核,不再每包各带 ~200KB 运行时;与主业务包共存时 react 全家桶共用同一实例(避免双实例)。

**机制**(与 pages 模式对称):
- 每个 native-component(miniType=PAGE)chunk 顶部由 `TaroInjectSyncCorePlugin`(injectOnPage=true)注入 `require('taro-shared-sync')`,同步核先于组件 `Component(...)` 注册就位。
- **同步占位 `createNativeComponentConfig`**:native-comp 产物顶层**同步**调 `fw.createNativeComponentConfig(...)` 建描述符传给 `Component()`。同步核阶段 framework/reactDOM 尚是占位,app-shim 装一个占位版:同步返回**形状完整的 WeChat Component 描述符**(created/attached/ready/detached/pageLifetimes/methods/分享/支付宝别名齐全),各生命周期是延迟转发器——真身未到则按调用顺序缓存。异步核到位后 `__replayNativeCompConfigs` 用真身 framework 重建描述符并按序重放缓存调用(created→attached→…)。这是 `createReactApp` 占位的 native 版对应物;缺它则顶层调用拿到 `undefined` 直接崩(组件不渲染)。
- `@tarojs/react` 的 `createNativeComponentConfig` 引入 `isNativeShared` 第三分支:按 pkgId 存/查 `shared.__nativeComponentApps[pkgId]`,不共用 `Current.app`、不共用单例 `nativeComponentApp`。
- container id 用 `app_${pkgId}` 隔离(与 pages 的 `config.appId=pkgId` 同源),避免多包 React root 挂到同一 DOM node 互相覆盖。
- 时序兜底:host 页面在异步核就绪前渲染 native-comp 时,组件 attached 排队到 `shared.__nativeCompQueue`,异步核 activate 后 flush;组件在就绪前销毁则按 compId 出队,避免僵尸挂载。

**前提**:native-components 产物**必须在共享运行时宿主内使用**(宿主需提供 `wx.__TARO_RT_ASYNC_V1__` 全局)。若要发给非共享运行时宿主,去掉 `--shared-runtime` 走 vanilla 自足产物。

> **⚠️ 接入约定:共享 native-component 不能放进宿主的 independent(独立)分包。**
> 独立分包冷启动跳过主包、且**运行时隔离**——访问不到主包/其他分包的资源。即使 native-comp 的 chunk 顶部注入了同步核,同步核要 `require.async('shared-async-v1/index')` 去拉异步核,而 `shared-async-v1` 是主包区域的普通分包 → 独立分包内拉不到 → 崩。
> 这与 pages 模式的独立分包问题同源,但 **CLI 拦不住**:`--shared-runtime` 的独立分包 fail-fast(见下方"❌ 不适用 · 4")检查的是**当前构建项目**的 `app.config.subPackages[].independent`,而 native-comp 编译产物没有 app.json、不声明业务分包;组件被放进哪种分包完全是**宿主接入方的布局决策**,构建期无从得知。故此约束只能靠接入约定保证:宿主用 `usingComponents` 引用共享 native-comp 的页面,不得位于独立分包内。

**宿主接入的两个必踩坑(与共享运行时无关,是微信 + Taro native-comp 的既有约定,但每个业务方接入都会遇到)**:

1. **宿主页 `usingComponents` 引用共享 native-comp 时必须配 `componentPlaceholder`**。共享 native-comp 位于业务分包(如 `pages/shared-native-comp/`),宿主页首次进入时该分包尚未下载,微信直接把它当作"组件未找到"报错 `Component is not found in path ...(using by "宿主页"), may be missing corresponding "componentPlaceholder" option?`——组件根本不会挂上去,自然看不到任何渲染。修法在宿主页 `.json` 加占位:
   ```json
   {
     "usingComponents": { "shared-counter": "/pages/shared-native-comp/components/counter/index" },
     "componentPlaceholder": { "shared-counter": "view" }
   }
   ```
   微信官方分包异步化机制:占位在分包下载完成前显示为普通 `view`,下载完成后自动替换为真组件。`preloadRule` 只能缩小窗口不能省略占位声明,首次访问仍需 `componentPlaceholder` 兜底。

2. **props 只能通过 `properties.props` 一个字段传,不能用顶层 attr**。Taro native-comp 的既有约定:所有 React props 打包成一个对象,通过微信 Component 的 `properties.props` 传入(共享运行时占位描述符 `properties: { props: { observer: deferred(...) } }` 就是照抄这个约定)。宿主 wxml 里:
   ```wxml
   <!-- ❌ 错:顶层 attr 不会映射进 React props,组件里 props.initial 是 undefined -->
   <shared-counter initial="{{100}}" />

   <!-- ✅ 对:所有 props 打包进单一 props 对象 -->
   <shared-counter props="{{ {initial: 100} }}" />
   ```
   现象:组件能渲染,但业务 prop 全丢(如计数器示例的 `initial=100` 变成 `initial=0`)。这个坑不共享运行时也存在,只是共享场景组件从异步分包加载,发现该问题的调试路径更绕。

> **⚠️ 分包 `pages` 数组非空要求**:宿主 `app.json` 里注册的 native-comp 业务分包 `subPackages[].pages` **不能为空数组**,否则微信认作无效分包声明,`preloadRule` 引用它时报 `pages/xxx/ not found`。native-comp 产物本身只有组件、无页面,但只要 `pages` 数组里放一个存在的路径(即使是 `component: true` 的组件 json 路径),微信就认可分包有效。例:
> ```json
> {"root": "pages/shared-native-comp", "pages": ["components/counter/index"]}
> ```


### 3. subPackageIndie(`--new-blended` 自包含分包)

Taro 自有的 `AppConfig.subPackageIndie`(4.1.x 起,`--new-blended` 混合模式下解决"微信禁止跨分包 `<import>`/`require()`"的编译期特性,**与微信原生 `independent: true` 无关**)与 `--shared-runtime` **可共存**。

**机制**:subPackageIndie 会把 runtime chunks(含 `app.js`、`app.wxss`)拷到 `mainPackageRoot`(经 `normalizeIndieRoot` 归一化——末尾 `/index` 会被砍掉:`page.name` 形如"目录/文件名",如 `pages/index/index` 归一化为页面**目录** `pages/index`),并删掉 outputDir 根级的 `app.js`。归一化后 chunks 与页面文件**同级共存**于 `dist/<归一化 root>/`(如 `dist/pages/index/{app.js, runtime.js, vendors.js, base.wxml, index.js, index.wxml, index.wxss}`),与 `sub1/` 等 subPackageRoots **平级**——与 `taro-blended-project@main` 的 `pages/order/pages/{index,sub1,...}` 结构同构。

shared-runtime 与 subPackageIndie 组合时,有三处需要适配:

1. **同步核 `taro-shared-sync.js` 随 app.js 进 mainPackageRoot**。`TaroInjectSyncCorePlugin` 按根级 chunk-id `app` 注入 `require("./taro-shared-sync")`(同级形态)。subPackageIndie 把 app.js 搬进 `mainPackageRoot/` 后,同步核也必须同目录才能让这个"同级 require"成立——这正符合 subPackageIndie"每个 root 自包含、零跨 root 引用"的设计初衷。实现:`build-shared-runtime.ts` 的 `copySyncCoreIntoMainPackageRoots` 在同步核子构建产出后,把 `outputDir/taro-shared-sync.js`(+ `.LICENSE.txt`)拷进每个 mainPackageRoot;**并删掉 outputDir 根级那份**(subPackageIndie 已删根级 app.js → 根级同步核无消费者,对齐 main 分支"businessRoot 根不含同步核")。删除双保险:仅当 `mainPackageRoots` 非空**且**根级 `app.js` 已不存在时才删,不误伤 basic/order(根级有 app.js)/native(有 native-comp PAGE chunk 消费根级同步核)。app.js 里的 require 字符串**保持原样不重算**(同级 `./taro-shared-sync` 天然正确)。
2. **页面 wxss 里 `@import` app 样式**(`modifyStyleImport` hook 注入)。这是 subPackageIndie **固有 bug**(vanilla 无 shared-runtime 也复现),原实现硬编码 `./app.wxss`,但页面 wxss 与 app.wxss 的相对深度取决于目录结构。修复:`buildMainRootAppStyleImport` 按页面 wxss 目录到 `${归一化 root}/app.wxss` 重算(复用 `utils/webpack.buildRootStyleImport`,与 MiniPlugin 默认样式注入同款 `path.posix.relative(dirname(pageStyle), ...)` 算法)。此修复不 gate 在 sharedRuntime,vanilla subPackageIndie 一并受益。Example indie 变体实测:页面与 app.wxss 同级 → `@import "./app.wxss"`(通用重算的同级分支);若页面比 app 样式深,则产出 `../` 前缀。
3. **递归组件 registrar 找 `createRecursiveComponentConfig`**(subPackageRoots 的 `comp.js` 调 `__taroRegisterRecursiveComponent`,该函数遍历本包 webpack 模块找 `@tarojs/runtime` 的 `createRecursiveComponentConfig`)。shared-runtime 下 `@tarojs/runtime` 被 external 到共享全局、**不在** webpack 模块里,遍历必然失败 → `throw`。修复:`buildRecursiveComponentRegistrarExpr` 在 sharedRuntime 下,于遍历前先查共享全局 `<globalObject>.__TARO_RT_ASYNC_V*__['@tarojs/runtime'].createRecursiveComponentConfig`;非 sharedRuntime 字节不变。与目录结构无关,是 shared-runtime × 递归组件的独立冲突(注:`mainPackageRoot` 用 `disableRecursiveComponent: true` 可让主根不生成递归组件,绕开主根这一路径,但 subPackageRoots 仍会触发,故此修复必需)。

**数据管道**:`buildSharedRuntime(combination)` 在主构建结束后跑,需要 mainPackageRoots 列表。`MiniPlugin.apply` 把 `subPackageIndiePlugin` 实例反向挂到 `combination.subPackageIndiePlugin`,`buildSharedRuntime` 读 `combination.subPackageIndiePlugin?.getAllMainPackageRoots?.()` 即可;非 subPackageIndie 场景该列表为空,拷贝/删除步骤整体跳过。

**边界**:
- `subPackageRoots`(非 mainPackageRoot 的子分包)**不含 runtime chunks / 同步核**(会被 mainPackageRoot 组件异步加载),无 app.js/app.wxss 路径需重算;但其 `comp.js` 仍走递归组件 registrar(修复 3 覆盖)。
- 多 mainPackageRoot:同步核每 root 各拷一份(~104KB/份),与 subPackageIndie 现有 app.js/runtime.js/vendors.js 每 root 一份的设计取向一致。拷贝源就是根级刚产出的同一份,版本天然一致。
- **shared-async 子包**始终只在 outputDir 根一份,不随 subPackageIndie 搬运;`require.async('shared-async-v1/index')` 是同步核自身构建时烧定的路径,与 app.js/同步核位置无关,不受影响。
- **未探索**:subPackageIndie 与 `native-components`(F6)同时启用的交叉(两者都改 chunk 落点,且 native-comp 消费根级同步核——若与 subPackageIndie 并存,根级删除逻辑需重新评估)——本次只覆盖 pages 模式下 mainPackageRoot;真用到该组合再排查。
- **Example 验证变体**:`TARO_APP_ID=indie`(`build:split:indie`),源码 `src-indie/`(`pages/index/index.jsx` 主入口页 + `pages/sub1/index.jsx` 子组件,与 main 分支 `pages/index`+`pages/sub1` 平级模式同构),产物搬入宿主 `pages/shared-indie/`,宿主 entry 页第三个按钮进入(URL `/pages/shared-indie/pages/index/index`)。宿主 businessRoot(`pages/shared-indie/`)下只有 `app.json`/`base.wxml`/`project.config.json` + `pages/` 文件夹(**无根级同步核**);runtime chunks + 同步核在 `pages/shared-indie/pages/index/`(与 main 分支 `pages/order/pages/index/` 层级一致)。

## ❌ 不适用场景(CLI 编译期直接拒)

### 1. 小程序插件(--plugin)模式


```bash
taro build --plugin weapp --shared-runtime  # ← 会 fail-fast
```

**为何不适用**:小程序插件在宿主中运行时无共享 JS 全局对象访问权;共享运行时依赖跨包 `wx.__TARO_RT_ASYNC_V*__` 全局共享,插件模式无法达成。

### 2. 非小程序端(h5 / rn / harmony)

```bash
taro build --type h5 --shared-runtime  # ← 会 fail-fast
```

**为何不适用**:h5/rn/harmony 走独立编译栈,不经过 `MiniCombination`/`externals` 层,共享运行时 flag 传入会静默失效——CLI 直接拒绝以避免开发者误用。

### 3. 非 react 框架(vue3 / solid / preact)

```bash
taro build --type weapp --shared-runtime   # 当 config.framework 非 'react' 时 ← 会 fail-fast
```

**为何不适用**:共享运行时模板(`app-shim.js`/`entry.sync.js`/`async-provider.js`)硬编码 `@tarojs/plugin-framework-react/dist/runtime`。
- **vue3 / solid**:业务产物顶层调用 `createVue3App`/对应 creator,但共享全局上只有 react 的 `createReactApp` → `undefined` 崩溃。
- **preact**:preact 支持靠主构建 webpack-chain 的 `resolve.alias`(`react`→`preact/compat`)。但共享运行时是独立 webpack 子构建,不继承该 alias,`entry.sync.js` 里 `require('react')` 会解析到真实 react(或在无 react 依赖时失败)。preact 与 react 同属 `framework: 'react'` 的 `Frameworks` 值域,故 framework 白名单(仅放行 `'react'`)天然连带拒绝 preact。

CLI 在 `build.ts` 的 sharedRuntime 守卫块内校验 `ctx.initialConfig.framework === 'react'`,否则 fail-fast。

### 4. independent(独立)分包

app.config 里业务分包声明 `independent: true` + `--shared-runtime` ← 会 fail-fast。

**为何不适用**:微信独立分包冷启动时**跳过主包下载与 `App()` 执行**,直到后续导航才加载主包。而同步核(`taro-shared-sync`)只在业务 `app.js` 顶层被同步 `require`——独立分包页面冷启动直达时,同步核从未运行,该页面 external 到共享全局的 `react`/`@tarojs/*` 全是空 → 运行时崩。CLI 在 `modifyAppConfig` 回调(app.json 解析后、分包编译前)校验 `subPackages[].independent`,命中即 fail-fast 并列出冲突 root。

## ⚠️ 已知边界

### 多业务包共享——last-writer(后加载者胜出)

多个独立编译的业务包接入同一宿主时,共享一份异步核。**后加载的业务包 App 覆盖 Current.app**——与 Taro 单份 runtime 里 framework `createReactApp` 的原生行为一致(`packages/taro-framework-react/src/runtime/connect.ts:434` `Current.app = appObj` 无守卫赋值)。

**流程**:
- 若异步核尚未激活:后到者调 `fw.createReactApp(App_B, ...)` 覆盖 `shared.__appBootstrap`,异步核激活时 `__activateReal` 用最后一包的 App 建 realAppObj。
- 若异步核已激活:后到者调用直接进 framework 真身 createReactApp,内部按原生语义覆盖 `Current.app`。

**为何选 last-writer**:非共享运行时下,每个业务包各带独立 `@tarojs/runtime` 副本,`Current` 是模块级常量,两包各自一份、完全隔离——不存在"覆盖 vs 首包"这个问题。共享运行时把多包塞进一份 `Current` 后,应选与单份 runtime **原生语义连续**的策略。last-writer 让"最后加载的包成为当前活跃 App",符合 Taro API 一贯行为与业务"就近激活"直觉。

**含义**:多包在同一时刻共用一个 App 生命周期(以最后加载者为准)。若两包各自需要独立 App 副作用(独立 `onLaunch`/`onShow`),当前架构不支持——需后续扩展多 App 表 + 按包路由分派。

**Caveat**:mount 队列错位。app-shim 的 whenReal 队列缓存了页面 mount/lifecycle,若 A 页面已入队、B 后加载成为 last-writer,`__activateReal` 用 B 的 App 建 realAppObj,A 的页面会挂到 B 的 AppWrapper 上。此矛盾根源是"多包共用一个 AppWrapper",与 first/last 无关——真正的解是多 App 隔离。

### native-components 下 `Current.app` 是占位/页面包 App(非本组件 Entry)

native-components 包**没有 app.js**,从不调 `createReactApp`。因此:

- 同步核 `__activateReal` 因无 `__appBootstrap` 早退,**`Current.app` 保持 app-shim 装的占位对象**(`{ __isTaroPlaceholder: true, ... }`);若宿主同时有页面业务包(basic/order),`Current.app` 则是最后加载页面包的 App(last-writer)。
- native-comp 的真正渲染与组件生命周期由 **`shared.__nativeComponentApps[pkgId]`**(Entry 实例)驱动,**刻意不写 `Current.app`**——否则多包共存时会覆盖页面包的 App(即多包 App 隔离修复的那个问题)。

**含义**:在 native-comp 内 `getCurrentInstance().app` 拿到的是占位或页面包 App,**不是**本组件的 Entry。这对 native-comp 无害——它不驱动 App 生命周期;真正依赖的 `Current.page` / `Current.router` 均正常(useReady/useLoad、路由参数都对)。

**对比 vanilla**:非共享 native-comp 会把 `Current.app` 设为 Entry(`connect-native.ts` `isDefaultEntryDom` 分支)。共享模式为避免跨包覆盖改用 pkgId 表,故 `Current.app` 语义不同。若业务代码在 native-comp 里读 `getCurrentInstance().app` 并依赖它是本组件 Entry,需改读 `shared.__nativeComponentApps[pkgId]`,或不依赖该字段。

### 版本一致性

- 所有业务包与共享运行时必须用**相同 Taro monorepo 版本**编译。异步核 provider 会做协议版本校验(`__rtVersion`),不一致直接 throw。
- react 全家桶(react/react-dom/react-reconciler/scheduler + @tarojs/react)版本由业务项目 node_modules 决定,产物 `runtime-manifest.json` 记录实际版本供排查。
- `sharedRuntimeExtraPackages`(如某私有 runtime 插件)版本也记入 manifest 的 `extraPackageVersions` 字段——但**仅记录供人工排查,不做编译期硬 gate**(这些包版本差异未必出错,硬 gate 易误报;只有 react 全家桶 + 协议号做硬校验)。多业务包声明不同版本的同一 extra 包时不会自动拦截,需人工比对 manifest。
- `sharedRuntimeSyncExtraPackages`(见下节)版本同样记入 manifest 的 `syncExtraPackageVersions` 字段,策略相同。

### extraPackages:同步核 vs 异步核选型(`sharedRuntimeSyncExtraPackages` vs `sharedRuntimeExtraPackages`)

**背景**:异步核加载是异步的(`entry.sync.js` 的 `require(asyncRequest).then(__activateAsync)`,`.then` 回调晚于业务 app.js 顶层同步执行、也晚于首屏页面 `onLoad` 同步触发的 `window.trigger(CONTEXT_ACTIONS.INIT)` 事件广播)。若业务方运行时依赖"在首屏 INIT 广播之前必须注册好 `window.on(INIT)` 监听器"的初始化(例如某私有插件在 INIT 回调里根据屏幕短边算 rem 根字号,写进 `<page-meta root-font-size>`),放进 `sharedRuntimeExtraPackages` 会**冷启动错过首屏 INIT**——热更新时因异步核已在内存、监听器早已注册,不复现;冷启动首屏永远错过。

**判定原则**:
- **用 `sharedRuntimeSyncExtraPackages`(同步核)**:该包顶层副作用必须在首屏 `window.on(CONTEXT_ACTIONS.INIT)` 广播、或业务 app.js 顶层其它同步调用之前完成——如根字号 INIT 回调注册、`hooks.tap` 注册某个必须首屏就位的处理器、往全局挂必须首屏可读的状态等。**代价**:每业务包各自打包一份,不共享(损失共享运行时"多业务包共享"的核心价值);同步核体积会增加,应严格控制这份清单的最小化,只放"必须首屏就位"的极小内容(如根字号相关约 3~8KB)。
- **用 `sharedRuntimeExtraPackages`(异步核)**:命令式 API 定义、异步初始化、页面级 API、任何不参与首屏时序的功能。**收益**:多业务包共享同一份,不重复打包。

**实操建议**:业务方(或其私有插件维护者)通常需要**新增一个"薄入口文件"**,把时机敏感的最小副作用拆出来单独暴露(如某私有插件若想适配共享运行时,可新增 `runtime-mini-sync-critical` 子入口,内容只有根字号 INIT 回调注册那几行,包体积小到可控);业务 config 里 `sharedRuntimeSyncExtraPackages` 指向这个薄入口,原 `runtime-mini` 继续放 `sharedRuntimeExtraPackages`。

**为何不能靠 taro 主仓兜底(如异步核激活后补发一次 INIT)**:`taroWindowProvider` 的 INIT 处理器会连带触发 `_location.trigger(INIT)`/`_history` 重建上下文,补发有副作用(重复注册、重置状态等),且 `Events` 基类不支持"注册时立即用最后一次事件数据触发一次"的语义。让业务方按需拆分同步/异步职责,是侵入面最小、副作用最可控的方案。

### 平台插件注入的 runtime(自动纳入同步核,无需手动声明)

**这是 CLI 自动处理的,与上面业务手动声明的 `sharedRuntime(Sync)ExtraPackages` 不同,业务方无需关心。**

**背景**:平台插件(`@tarojs/plugin-html`、`@tarojs/plugin-inject`、`@tarojs/plugin-http`、`@tarojs/plugin-react-devtools`、`@tarojs/plugin-vue-devtools` 等)通过 `injectRuntimePath()` 往 `platform.runtimePath` 追加自己的 side-effect runtime(如 plugin-html 的 `hooks.tap('modifyHydrateData')` 把 HTML 内联标签 `<i>`/`<span>` 等 nodeName 映射成 `view`/`text`)。`taro-loader` 把 runtimePath 每项生成 `import '<path>'` 注入业务 app.js。

**曾经的缺口**:这些 runtime 也是 `@tarojs/*`,被 `shouldShareExternal` 无差别 external 成读共享全局(`wx.__TARO_RT_ASYNC_V1__[...]`),但运行时核(同步核 `entry.sync.js` + 异步核 `async-provider.js`)只注册了固定清单(见 `SYNC_CORE_REGISTERED_RUNTIMES` + async-provider),**漏掉这些插件 runtime → 业务包读到 `undefined` → 其 `hooks.tap` 从未执行**。典型症状:plugin-html 的 `<i>` 映射失效,base.wxml 的 `xs.a` 按 `tmpl_${level}_${nodeName}` 拼出 `tmpl_0_i` 找模板,报 `Template tmpl_0_i not found`(`<i>` 本就不生成模板,靠运行时映射掉)。

**现在的处理**:`build-shared-runtime` 读 `combination.config.runtimePath`,用 `computeMissingRuntimes()`(见 `externals.ts`)挑出"被 external 却无人注册"的 `@tarojs/*` 插件 runtime——排除已被同步核 `SYNC_CORE_REGISTERED_RUNTIMES` 注册的平台 runtime、以及已被 `sharedRuntime(Sync)ExtraPackages` 显式接管的——作为**同步核额外入口**一并打包执行。这些 runtime 打进同步核后,其 `import { hooks } from '@tarojs/shared'` resolve 到同步核 bundle 的同一 `@tarojs/shared` 单例(同步核子构建除 asyncRequest 外不 external `@tarojs/shared`),`hooks.tap` 与模板消费方落在同一 hooks 上,就位生效。

**注意**:`SYNC_CORE_REGISTERED_RUNTIMES`(`constants.ts`)必须与 `entry.sync.js` 实际 `require` 的平台/运行时清单保持一致——它是 `computeMissingRuntimes` 做差集的依据,漂移会导致"已注册的被重复打包"或"未注册的仍漏掉"。有一致性守护单测(`tests/react-members-consistency.spec.ts`)防漂移。当前仅列了 weapp 平台 runtime,故非 weapp 平台的平台 runtime 会被误纳入 missing——但共享运行时本就仅 weapp 真机验证(见下"不适用/已知边界"),不构成新增边界。

### dev/watch 模式重复构建共享运行时子核

`buildSharedRuntime()` 挂在构建完成回调上,`--watch` 模式下**每次增量重编译都会重跑一遍完整生产模式子构建**(sync-core + async-provider 两个独立 webpack config)。不影响正确性(产物一致),但拖慢 watch 循环。当前无"输入未变则跳过"缓存判断——归为已知性能边界,开发期可接受。

### 分包体积预算无构建期检查

微信对单个分包(2MB)、总包(20MB,部分类目更高)有体积限制。共享运行时不做构建期体积检查——多业务子包 + shared-async 累积超限只会在**部署期**(开发者工具 / 上传 CLI)暴露。用外部工具兜底,构建期无信号。

### plugin-mv 幂等

Example 的 `plugin-mv/index.js` 在多业务包场景下对 `shared-async-v*` 做幂等处理:若宿主目标目录已存在且 async-provider.js 字节数一致(表明来自同版本 Taro 编译),跳过覆盖;不一致时告警不阻断,保留已存在版本。
