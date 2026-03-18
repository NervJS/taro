# 子分包独立模板功能 (subPackageIndie)

## 功能目的

在 `--new-blended` 模式下，解决微信小程序跨分包引用的三大限制：

### 问题背景

当使用 Taro 开发混合小程序（原生 + Taro 组件混合）时，如果 Taro 组件被配置为分包，会遇到以下问题：

1. **模板限制**: packageA 无法 import packageB 的 template，但可以 require 主包、packageA 内的 template
2. **JS 限制**: 子分包不能 require 主分包的 JS 文件（如 `require("../../../app")`）
3. **样式隔离**: 需要正确处理组件样式继承

### 典型场景

```
原生小程序项目/
├── pages/
│   ├── index/              # 原生页面
│   └── order/              # Taro 组件目录
│       ├── index/          # 主入口组件（配置为分包）
│       ├── sub1/           # 子组件1（配置为独立分包）
│       └── sub2/           # 子组件2（配置为独立分包）
└── app.json                # 配置 subPackages
```

当 sub1/sub2 作为独立分包时，无法引用 index/ 下的 base.wxml 和 app.js。

## 解决方案

`subPackageIndie` 功能为每个分包生成独立的运行时文件，使其可以独立运行：

### 为 mainPackageRoot 生成：
- `app.js` - 运行时入口
- `runtime.js` - Webpack 运行时
- `taro.js` - Taro 框架代码
- `vendors.js` - 第三方依赖
- `common.js` - 公共代码（如果存在）
- `base.wxml` - 完整模板 (~60KB)
- `utils.wxs` - WXS 辅助脚本
- `comp.wxml/json` - 组件模板
- `custom-wrapper.wxml/json` - 自定义包装器（如需要）

### 为 subPackageRoots 生成：
- `base.wxml` - 完整模板
- `utils.wxs` - WXS 辅助脚本
- `comp.wxml/json` - 组件模板
- `custom-wrapper.wxml/json` - 自定义包装器（如需要）

子分包不需要 runtime chunks（app.js 等），因为它们会被 mainPackageRoot 的组件异步加载。

## 配置方式

```javascript
// src/app.config.js
export default {
  pages: ['pages/order/index/index'],
  components: [
    'pages/order/sub1/index',
    'pages/order/sub2/index',
  ],
  // ★ 子分包独立模板配置（与 subPackages 同级）
  subPackageIndie: {
    // 主包入口组件路径（包含所有 runtime chunks）
    mainPackageRoot: 'pages/order/index',
    // 子分包组件路径（只需要模板文件）
    subPackageRoots: ['pages/order/sub1', 'pages/order/sub2']
  }
}
```

> **注意**：`subPackageIndie` 配置放在 `app.config.js` 中（而不是 `config/index.js`），与 `subPackages` 配置保持一致的语义。
```

## 产物结构

配置 `subPackageIndie` 后，构建产物结构如下：

```
dist/
├── app.json                      # 仅保留配置文件
├── project.config.json
└── pages/order/
    ├── index/                    # mainPackageRoot ★
    │   ├── app.js                # 运行时入口
    │   ├── runtime.js            # Webpack 运行时
    │   ├── taro.js               # Taro 框架
    │   ├── vendors.js            # 第三方依赖
    │   ├── base.wxml             # 完整模板
    │   ├── utils.wxs             # WXS 辅助
    │   ├── comp.js/json/wxml     # 组件模板
    │   ├── custom-wrapper.js     # 包装器
    │   ├── index.js              # require("./app") ★ 本地路径
    │   ├── index.json            # "comp": "./comp" ★ 本地路径
    │   ├── index.wxml            # <import src="./base.wxml"/> ★
    │   └── index.wxss
    │
    ├── sub1/                     # subPackageRoot ★
    │   ├── base.wxml             # 独立模板
    │   ├── utils.wxs             # 独立 WXS
    │   ├── comp.js/json/wxml     # 组件模板
    │   ├── custom-wrapper.js
    │   ├── index.js              # 无 require 注入 ★
    │   ├── index.json            # "comp": "./comp"
    │   ├── index.wxml            # <import src="./base.wxml"/>
    │   └── index.wxss
    │
    └── sub2/                     # subPackageRoot
        └── (同 sub1 结构)
```

**关键变化**：
- dist 根目录**不再**有 app.js、base.wxml 等文件
- 所有 runtime chunks 都在 `mainPackageRoot` 目录下
- 所有路径都是相对于当前目录的（`./app`、`./base.wxml`、`./comp`）
- 构建产物可以**直接复制**到原生小程序项目，无需任何路径处理

## 核心改动

### 修改的文件和方法

| 文件 | 方法/位置 | 修改内容 |
|------|----------|----------|
| `@tarojs/taro/types/taro.config.d.ts` | `AppConfig.subPackageIndie` | 类型定义：`mainPackageRoot` + `subPackageRoots` |
| `MiniPlugin.ts` | `isInSubPackageIndieRoot` | 增加 `mainPackageRoot` 判断，从 `appConfig` 读取配置 |
| `MiniPlugin.ts` | `addEntries` | 跳过根目录入口；为 mainPackageRoot + subPackageRoots 添加 comp/custom-wrapper |
| `MiniPlugin.ts` | `addLoadChunksPlugin` | mainPackageRoot/subPackageRoots 下的页面使用本地 `app.js` 路径 |
| `MiniPlugin.ts` | `generateSubPackageIndieFiles` | 合并 mainPackageRoot + subPackageRoots 生成独立模板 |
| `MiniPlugin.ts` | `generateMainPackageRuntimeFiles` | **新增**：复制 runtime chunks 到 mainPackageRoot |
| `MiniPlugin.ts` | `generateMiniFiles` | 跳过根目录模板文件生成 |
| `MiniPlugin.ts` | `optimizeMiniFiles` | 删除根目录冗余的 runtime/comp 文件 |
| `MiniPlugin.ts` | `generateConfigFile` | 注入 `styleIsolation`/`isNewBlended` |

### 关键方法说明

#### isInSubPackageIndieRoot(pageName: string): string | null

判断给定路径是否属于独立分包（mainPackageRoot 或 subPackageRoots），返回匹配的根路径或 null。

```typescript
isInSubPackageIndieRoot (pageName: string): string | null {
  const { subPackageIndie, newBlended } = this.options
  if (!subPackageIndie || !newBlended) return null

  const { subPackageRoots, mainPackageRoot } = subPackageIndie

  // 检查 mainPackageRoot
  if (mainPackageRoot && (pageName.startsWith(mainPackageRoot) || pageName === mainPackageRoot)) {
    return mainPackageRoot
  }

  // 检查 subPackageRoots
  for (const root of subPackageRoots) {
    if (pageName.startsWith(root) || pageName === root) {
      return root
    }
  }
  return null
}
```

#### generateMainPackageRuntimeFiles(compilation, compiler)

将 runtime chunks 复制到 mainPackageRoot 目录：

```typescript
generateMainPackageRuntimeFiles (compilation: Compilation, _compiler: Compiler) {
  const { subPackageIndie, commonChunks, fileType } = this.options
  if (!subPackageIndie?.mainPackageRoot) return

  const { mainPackageRoot } = subPackageIndie
  const runtimeChunks = ['app', ...commonChunks]  // app, runtime, taro, vendors, common

  runtimeChunks.forEach(chunkName => {
    // 复制 JS 和 wxss 文件到 mainPackageRoot
    if (compilation.assets[`${chunkName}.js`]) {
      compilation.assets[`${mainPackageRoot}/${chunkName}.js`] = compilation.assets[`${chunkName}.js`]
    }
    // ...
  })
}
```

#### addLoadChunksPlugin 修改

对于 mainPackageRoot/subPackageRoots 下的页面，使用本地 app.js：

```typescript
} else if (miniType === META_TYPE.PAGE) {
  const subPackageIndieRoot = this.isInSubPackageIndieRoot(id)
  if (subPackageIndieRoot) {
    // 使用本地 app.js: require("./app") 而非 require("../../../app")
    const localAppChunk = [{ name: `${subPackageIndieRoot}/app` }]
    return addRequireToSource(id, modules, localAppChunk)
  }
  return addRequireToSource(id, modules, entryChunk)
}
```

## 使用示例

### 1. Taro 项目结构

```
taro-project/
├── src/
│   ├── app.js
│   └── pages/order/
│       ├── index/
│       │   ├── index.jsx      # 主入口组件
│       │   └── index.config.js
│       ├── sub1/
│       │   ├── index.jsx      # 子组件1
│       │   └── index.config.js
│       └── sub2/
│           ├── index.jsx      # 子组件2
│           └── index.config.js
└── config/
    └── index.js
```

### 2. Taro 配置 (config/index.js)

```javascript
const config = {
  mini: {
    subPackageIndie: {
      mainPackageRoot: 'pages/order/index',
      subPackageRoots: ['pages/order/sub1', 'pages/order/sub2']
    }
  }
}
```

### 3. 构建命令

```bash
taro build --type weapp --new-blended
```

### 4. 复制到原生小程序项目

构建后，只需简单复制目录：

```javascript
// plugin-mv/index.js (Taro 插件)
export default (ctx) => {
  ctx.onBuildFinish(() => {
    const srcPath = path.join(outputPath, 'pages/order')
    const destPath = path.join(miniappPath, 'pages/order')
    fs.copySync(srcPath, destPath)  // 直接复制，无需路径处理！
  })
}
```

### 5. 原生小程序 app.json 配置

```json
{
  "pages": ["pages/index/index"],
  "subPackages": [
    {
      "root": "pages/order/index",
      "pages": ["index"]
    },
    {
      "root": "pages/order/sub1",
      "pages": ["index"]
    },
    {
      "root": "pages/order/sub2",
      "pages": ["index"]
    }
  ],
  "lazyCodeLoading": "requiredComponents"
}
```

### 6. 原生页面引用组件

```json
// pages/index/index.json
{
  "usingComponents": {
    "order-entry": "../order/index/index",
    "order-list": "../order/sub1/index",
    "order-detail": "../order/sub2/index"
  },
  "componentPlaceholder": {
    "order-list": "view",
    "order-detail": "view"
  }
}
```

## 体积影响

| 文件 | 大小（压缩前） | 说明 |
|------|---------------|------|
| base.wxml | ~60-80KB | 每个分包独立一份 |
| utils.wxs | ~1KB | 每个分包独立一份 |
| comp.js/wxml/json | ~0.5KB | 每个分包独立一份 |
| runtime chunks | ~250KB | 仅 mainPackageRoot 包含 |

**总体影响**：每个 subPackageRoot 增加约 **80KB**（base.wxml + utils.wxs + comp.*）

## 验证方式

### 1. 构建产物检查

```bash
# 检查 mainPackageRoot 包含 runtime chunks
ls dist/pages/order/index/
# 应该看到: app.js, runtime.js, taro.js, vendors.js, base.wxml, comp.*, index.*

# 检查 subPackageRoot 只有模板文件
ls dist/pages/order/sub1/
# 应该看到: base.wxml, utils.wxs, comp.*, index.* (无 app.js/runtime.js)

# 检查根目录无冗余文件
ls dist/
# 应该只有: app.json, project.config.json, pages/
```

### 2. 路径检查

```bash
# index.wxml 引用本地 base.wxml
head -1 dist/pages/order/index/index.wxml
# <import src="./base.wxml"/>

# index.js require 本地 app
head -1 dist/pages/order/index/index.js
# require("./app")

# index.json comp 路径
cat dist/pages/order/index/index.json
# "comp": "./comp"

# comp.json 无自引用
cat dist/pages/order/sub1/comp.json
# {"component":true,"styleIsolation":"apply-shared","usingComponents":{}}
```

### 3. 微信开发者工具测试

1. 打开原生小程序项目
2. 确认无 template/require 相关错误
3. 跨分包组件正常加载和渲染
4. 样式正确继承（styleIsolation: apply-shared）

## 注意事项

1. **仅限微信小程序**: 当前实现针对微信小程序，其他平台需额外适配
2. **路径一致性**: `mainPackageRoot` 和 `subPackageRoots` 应与实际组件路径对应
3. **分包配置**: 原生小程序 app.json 的 subPackages 需要正确配置
4. **lazyCodeLoading**: 建议启用 `"lazyCodeLoading": "requiredComponents"` 以支持异步加载
5. **componentPlaceholder**: 跨分包组件引用需要配置占位组件

## 相关文档

- [微信小程序分包异步化](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/async.html)
- [Taro new-blended 模式文档](https://docs.taro.zone/docs/hybrid)
- [微信小程序 lazyCodeLoading](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#lazyCodeLoading)
