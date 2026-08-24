# 共享运行时（split 模式）接入指南

面向业务接入方的使用文档。只讲怎么用，不涉及内部实现。

## 一、这是什么

开启后，Taro / React 运行时不再打进每个业务包，而是由一个独立的异步核分包 `shared-async-v1` 统一提供；业务包内只保留一个体积很小的同步核 `taro-shared-sync.js`。

**收益**：多个独立编译的业务包接入同一个宿主小程序时，共享同一份运行时，业务包体积各减约 200KB（Taro + React 运行时）。

**适用**：微信小程序（weapp）、React 框架。其它平台 / 框架见下方「四、限制与报错」。

## 二、开启命令

在业务包的构建命令后加两个 flag：

```bash
taro build --type weapp --shared-runtime --shared-runtime-mode split
```

- `--shared-runtime`：开启共享运行时。
- `--shared-runtime-mode split`：模式，当前仅支持 `split`（可省略，默认即 `split`）。
- 两个 flag 必须一起用：单独给 `--shared-runtime-mode` 会报错。

通常与 `--new-blended` 一起用（业务包作为分包接入原生宿主）：

```bash
taro build --type weapp --new-blended --shared-runtime --shared-runtime-mode split
```

## 三、配置项（`config` 的 `mini` 段）

全部可选。按需配置：

| 字段 | 类型 | 作用 |
|------|------|------|
| `sharedRuntimeAsyncRequest` | `string` | 异步核分包的加载路径。默认 `shared-async-v1/index`；业务包搬进原生宿主后通常需按实际布局覆盖。**详见下方「配置项详解」。** |
| `sharedRuntimeExtraPackages` | `string[]` | 额外纳入共享的包名（随异步核加载）。用于把接入方自己的运行时插件（如私有 API 注入插件的 mini runtime）一起 external 到共享核。适合命令式 API 定义、异步初始化等**不参与首屏时序**的功能。多业务包共享同一份。 |
| `sharedRuntimeSyncExtraPackages` | `string[]` | 与上一个平行，但随**同步核**加载（执行更早）。适合**必须在首屏之前就位**的副作用（如需在页面首屏渲染前注册好的监听器、写全局状态）。代价：每个业务包各打包一份，不共享。 |

配置示例：

```ts
// config/index.ts
export default {
  mini: {
    sharedRuntimeAsyncRequest: '../shared-async-v1/index',
    sharedRuntimeExtraPackages: ['@your-scope/your-plugin/runtime-mini'],
    sharedRuntimeSyncExtraPackages: ['@your-scope/your-plugin/runtime-mini-sync-critical'],
  },
}
```

> `ExtraPackages` vs `SyncExtraPackages` 怎么选：默认放 `ExtraPackages`（共享、省体积）；只有当某段副作用**必须先于首屏就位**、放异步核会导致首屏拿不到时，才拆一个薄入口放 `SyncExtraPackages`。

### 配置项详解：`sharedRuntimeAsyncRequest`

**作用**：业务包的同步核 `taro-shared-sync.js` 在运行时用 `require.async('<此值>')` 去加载异步核分包 `shared-async-v1`。这个值就是「从同步核所在位置，到异步核分包入口 `shared-async-v1/index` 的相对路径」，会在编译时烧进产物。

**默认值**：`shared-async-v1/index`。它假设同步核与 `shared-async-v1/` 目录**同级**（业务包 `dist/` 直接打开的场景就是如此：`dist/taro-shared-sync.js` 与 `dist/shared-async-v1/` 同级），因此可直接预览、无需配置。

**为什么常需要覆盖**：业务包编译时并不知道自己会被搬到宿主的哪个目录。一旦产物被搬进原生宿主，同步核和异步核在宿主里的**相对层级会变**，默认值就不再指向正确位置，必须按宿主实际布局覆盖。

**怎么算这个路径**（两条约束）：

1. 相对基准是「同步核 `taro-shared-sync.js` 在宿主里的所在目录」，终点是「异步核分包入口 `shared-async-v1/index`」。用 `path.relative(同步核目录, 'shared-async-v1')` + `/index` 即得。
2. 微信 `require.async` 只能加载**已在宿主 `app.json` 注册过的分包页面入口**，所以 `shared-async-v1` 必须先注册为宿主分包（见「四、产物结构与宿主接线」），这个路径才生效。

**常见布局对照**：

| 宿主布局 | 同步核位置 | 异步核分包位置 | `sharedRuntimeAsyncRequest` |
|----------|-----------|---------------|------------------------------|
| 业务包 `dist/` 直接预览（不搬宿主） | `dist/taro-shared-sync.js` | `dist/shared-async-v1/` | `shared-async-v1/index`（默认，不用配） |
| 业务分包与异步核平级同在宿主 `pages/` 下 | `pages/<业务分包>/taro-shared-sync.js` | `pages/shared-async-v1/` | `../shared-async-v1/index` |
| 同步核在宿主 `components/` 下、异步核在 `pages/` 下（native-components 场景） | `components/<xxx>/taro-shared-sync.js` | `pages/shared-async-v1/` | `../../pages/shared-async-v1/index` |

**配错的症状**：路径不对时，同步核 `require.async` 找不到异步核分包，运行时核加载失败，页面白屏或运行时报错（如找不到 `@tarojs/runtime`）。改对相对路径 + 确认宿主 `app.json` 已注册 `shared-async-v1` 分包即可。

## 四、产物结构与宿主接线

构建产物（`dist/`）：

- `app.js`：头部会自动 `require('./taro-shared-sync')`。
- `taro-shared-sync.js`：同步核，随业务包。
- `shared-async-v1/`：异步核分包，含 `async-provider.js`、`index.js/json/wxml`、`runtime-manifest.json`。
- `app.json`：已自动注册 `shared-async-v1` 分包与 `preloadRule`，因此 **`dist/` 本身即可直接用开发者工具打开预览**。

**接入原生宿主时**（blended 场景），需要把产物搬进宿主并在宿主 `app.json` 里注册：

1. 业务包产物（含 `taro-shared-sync.js`）搬进宿主一个业务分包目录（如 `pages/xxx/`）。
2. `shared-async-v1/` 搬进宿主，作为一个独立分包（与业务分包平级，如宿主 `pages/shared-async-v1/`）。
3. 宿主 `app.json` 的 `subPackages` 里注册这两个分包；`preloadRule` 里对业务页预下载 `shared-async-v1`，缩小首屏异步窗口。
4. 按业务分包与异步核在宿主里的实际层级，配好 `sharedRuntimeAsyncRequest`（见上表）。

多个业务包接入同一宿主时，`shared-async-v1` 只需搬一份、共用。**要求所有业务包与该异步核用同一 Taro 版本编译**（版本记录在 `runtime-manifest.json`，运行时也有版本校验，不一致会报错）。

完整可运行示例见 `examples/shared-runtime`。

## 五、限制与报错（fail-fast）

以下组合构建时会**直接报错退出**，请避免：

| 组合 | 报错信息（节选） |
|------|------|
| `--shared-runtime-mode` 未配 `--shared-runtime` | `--shared-runtime-mode 必须与 --shared-runtime 一起使用。` |
| `--shared-runtime-mode` 非 `split` | `--shared-runtime-mode 仅支持 "split"，收到 "xxx"。` |
| 小程序插件（`--plugin`）模式 | `小程序插件（--plugin）模式不适用共享运行时（split 模式）…` |
| 非小程序端（h5 / rn / harmony） | `--shared-runtime 当前仅支持小程序端…` |
| 非 React 框架（vue3 / solid） | `--shared-runtime 当前仅支持 framework: 'react'…` |

另：共享 native-component **不能放进宿主的 independent（独立）分包**（独立分包运行时隔离，拉不到异步核），构建期无法拦截，需接入方自行保证。

## 六、注意事项：不要在模块顶层同步调用命令式 API

**这是接入共享运行时后最需要注意的一点。**

命令式 API（如 `Taro.getSystemInfoSync()`、`Taro.showToast()`、`Taro.getStorageSync()` 等）在运行时核加载完成前不可用。**在模块顶层（import 时即执行）同步调用它们，会拿到空操作、静默失效**——例如某个开关判断为 `false`、某个值取到 `undefined`，导致功能异常且不报错。

构建时会有编译期告警提示这类调用：

```
[taro-shared][shared-runtime] 检测到【模块顶层】同步调用 Taro 命令式 API，
运行时核加载完成前调用会告警/静默失效。请挪到组件函数体内 / useReady / useEffect / 事件回调，
或改用异步版 API：
  src/xxx.ts:12  Taro.getSystemInfoSync  →  Taro.getSystemInfoSync()
```

**如何适配**：把命令式 API 调用从模块顶层挪到「运行时已就位」的时机：

- 组件函数体内、`useReady` / `useEffect` / `useLoad` 等 hooks 里；
- 事件回调、请求发起时等运行时调用点；
- 或改用异步版 API（如 `Taro.getSystemInfo` 代替 `Taro.getSystemInfoSync`）。

**典型错误示例**：

```ts
// ❌ 模块顶层同步调用——运行时未就位，拿到空值
const systemInfo = Taro.getSystemInfoSync()
export const isSmallScreen = systemInfo.screenWidth < 375

// ✅ 改为读取时才求值（此时运行时已就位）
export function getIsSmallScreen() {
  return Taro.getSystemInfoSync().screenWidth < 375
}
```

> 告警只是「粗筛」提示，不阻断构建；但请认真对待——顶层同步调用在共享运行时下大概率行为不符预期。若某模块级常量依赖命令式 API，改成惰性求值（首次读取时才算）。
