## Demo - 共享运行时（split 模式）

把 Taro / React 运行时从业务包中 external 出去，由一个独立的 `shared-async-v1` 异步核分包统一提供；业务包内只保留一个体积很小的同步核 `taro-shared-sync.js`。多个独立编译的业务包接入同一宿主时，可共享同一份运行时，业务包自身不再各带 ~200KB 的 Taro + React 运行时。

### 开发环境

推荐在 Taro 项目中进行开发调试，在生产环境下再在原生小程序中进行预览。

#### 1. 编译运行

```bash
$ npm run dev
```

#### 2. 预览

小程序开发者工具导入项目，项目路径请指向 `shared-runtime/taro-project`。

> Taro 业务包的产物 `dist/app.json` 已自动注册 `shared-async-v1` 分包与 `preloadRule`，`taro-project/dist` 本身即是一个可直接打开预览的完整小程序。

### 生产环境

#### 1. 编译运行

```bash
$ npm run build
```

`plugin-mv` 会在编译结束后把 `taro-project/dist` 整体拷贝到原生宿主 `miniapp/taro/`（含同步核 `taro-shared-sync.js` 与 `shared-async-v1/` 异步核分包）。

#### 2. 预览

小程序开发者工具导入项目：

- 指向 `shared-runtime/taro-project`：直接预览 Taro 业务包。
- 指向 `shared-runtime/miniapp`：预览「原生宿主集成 Taro 业务包」的混合场景（宿主入口页点击按钮跳进 Taro 页面）。宿主 `app.json` 已手工注册 Taro 业务页 `taro/pages/index/index` 与异步核分包 `taro/shared-async-v1`。

### 介绍

本示例演示了共享运行时（split 模式）的以下特性：

- 业务包产物不再打包 Taro / React 运行时本体（被 external 到共享全局）。
- 业务包 `app.js` 头部同步 `require('./taro-shared-sync')` 加载同步核；同步核再异步加载 `shared-async-v1` 异步核分包，注册运行时真身。
- 异步核分包 `shared-async-v1/` 内含 `async-provider.js` 与 `runtime-manifest.json`（记录 react 全家桶精确版本 + 运行时协议版本，供多包版本一致性排查）。
- 多个独立编译的业务包接入同一宿主时，可共享同一份异步核分包。
