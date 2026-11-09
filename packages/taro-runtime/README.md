# `@tarojs/runtime`

Taro 运行时。在小程序端连接框架（DSL）渲染机制到小程序渲染机制，连接小程序路由和生命周期到框架对应的生命周期。在 H5/RN 端连接小程序生命周期**规范**到框架生命周期。

## 核心 API

### createReactApp()

暴露给 `@tarojs/taro-loader/app` 调用，在小程序入口文件中调用，创建一个小程序 `App` 构造函数接受的小程序应用规范对象。


### createVueApp()

暴露给 `@tarojs/taro-loader/app` 调用，在小程序入口文件中调用，创建一个小程序 `App` 构造函数接受的小程序应用规范对象。

### createPageConfig()

暴露给 `@tarojs/taro-loader/page` 调用，在小程序页面文件中调用，创建一个小程序 `Page` 构造函数接受的小程序页面规范对象。

### window

在小程序端模仿浏览器的 `window` 实现的对象，在浏览器环境中返回浏览器本身的 `window`。此对象通过 Webpack 的 [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/) 注入到全局对象以供第三方库调用。

### navigator

在小程序端模仿浏览器的 `navigator` 实现的对象，在浏览器环境中返回浏览器本身的 `navigator`。此对象通过 Webpack 的 [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/) 注入到全局对象以供第三方库调用。

### document

在小程序端模仿浏览器的 `document` 实现的对象，在浏览器环境中返回浏览器本身的 `document`。此对象通过 Webpack 的 [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/) 注入到全局对象以供第三方库调用。

### Current

暴露给开发者的 Taro 全局变量，目前有三个属性：

* `Current.app`，返回当前小程序应用实例，非小程序端返回小程序规范应用实例，可通过此实例调用小程序规范生命周期。
* `Current.page`，返回当前小程序页面实例，非小程序端返回小程序规范页面实例，可通过此实例调用小程序规范生命周期。
* `Current.router`，返回当前小程序路由信息，非小程序端返回小程序规范路由信息

### options

Taro 配置：

* `html`: [渲染 HTML](https://taro-docs.jd.com/taro/next/docs/html.html)
* `debug`: 开启之后会打印渲染时间
* `prerender`: 暴露给 `@tarojs/cli` 的内部参数

### Events

[Taro 消息机制](https://docs.taro.zone/docs/apis/about/events)。

## React 节点作用域参数（weapp）

微信小程序中，以下现有作用域参数接受已挂载的真实 Taro 节点，因此业务可以直接传 `ref.current`，不必读取私有 `_scope`：

- `createSelectorQuery().in(node)`
- `createIntersectionObserver(node, options)`
- `createCanvasContext(canvasId, node)`
- `canvasToTempFilePath(options, node)`、`canvasPutImageData(options, node)`、`canvasGetImageData(options, node)`
- `createAudioContext(id, node)`、`createVideoContext(id, node)`、`createMapContext(id, node)`、`createLivePlayerContext(id, node)`

**统一传 `ref.current` 不会自动创建原生作用域。** 显式 `CustomWrapper` 要在原生 `attached` 后完成实例绑定；需要递归壳 `comp` 的额外绑定时，可按实际定位需求配置页面的 `forceCustomWrapper: true`。当前 Webpack/Vite 构建只在非递归模板平台处理该配置，同一编译 root 内任一页开启会使该 root 的 `comp` 生效，独立分包按各自 root 计算。适配依赖这些已完成的原生实例绑定，并不意味着所有 `View` 都有独立作用域；已有 Page 绑定、只需要页面范围的场景无需一律开启。

```tsx
import { useRef } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import type { TaroElement } from '@tarojs/runtime'

export default function ScopeExample () {
  const scopeRef = useRef<TaroElement | null>(null)

  // 在组件挂载、原生作用域 attach 后的事件/渲染完成回调中调用。
  const queryTarget = () => {
    const node = scopeRef.current
    if (!node) return
    Taro.createSelectorQuery().in(node).select('#target').boundingClientRect().exec(console.log)
  }

  return <View ref={scopeRef} onClick={queryTarget}><View id='target' /></View>
}
```

这里传入的是**作用域节点**：可以是目标自身，也可以是目标所在的容器，但解析结果是最近已绑定的原生 Component/Page，**不是任意 View 的 DOM 子树**。选择器或 id 必须落在该原生范围内；IO 的 `relativeTo` 与 `observe` 两个选择器也必须由同一原生范围覆盖。创建完成的原生 query/observer/context 固定作用域，节点移动后需要重新创建，不会自动重定位。

真实 Taro 节点未挂载、已卸载、缺少原生 ctx，或位于尚未 attach 的 CustomWrapper 中时，同步入口抛错；Canvas Promise 入口调用 `fail`/`complete` 并拒绝 Promise，不会把节点直接交给原生或退回整页查询。`ref.current` 自身可能为 `null`，业务应先判空：原生 Page/Component、旧的省略参数及显式 `null`/`undefined` 行为不变，不会把 ref 对象或类 DOM 对象自动识别为节点，也不修改输入对象。

此次转换仅启用 **weapp**。JD 尚无逐 API 原生契约验证，维持原样；H5/RN/tt/qq/swan/alipay/Harmony 等端的输入、返回和支持状态不变。可在原本支持对应节点参数的平台继续使用 `ref.current`，但这不是所有平台具备相同作用域语义的承诺：H5 Canvas/Video 主要查找容器后代，Map 仍按全局 mapId 注册表查找，本次不修复自身匹配差异，也不调整 Vue ref 行为。

RealtimeLogManager 的 `.in()`、路由/Page/原生实例 receiver 方法、MediaQueryObserver、权限 `scope`、数据库/缓动的 `.in()` 均不转换。OffscreenCanvas 的 `compInst` owner 及 Canvas `options.canvas` 原生资源也不转换。上述本地回归使用原生接口 mock；微信开发者工具/真机上的真实组件层级及 Canvas/媒体能力仍需独立验收。
