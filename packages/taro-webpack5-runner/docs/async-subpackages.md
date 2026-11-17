# Taro 微信小程序顶层异步分包 (asyncSubPackages) 用户指南

`asyncSubPackages` 是 Taro 提供的一项面向微信小程序的源码级异步分包路由与优化能力。它允许开发者在 `app.config.ts` 中通过直观的规则配置，将特定的重型业务组件、第三方复杂库或独立功能模块在构建期自动打包到指定的独立异步分包中，并在运行时利用微信小程序的 `require.async` 机制按需加载。

---

## 目录
- [一、背景与核心痛点](#一背景与核心痛点)
- [二、运作原理](#二运作原理)
- [三、使用前置条件](#三使用前置条件)
- [四、配置参考](#四配置参考)
  - [4.1 类型定义](#41-类型定义)
  - [4.2 规则配置项详解](#42-规则配置项详解)
  - [4.3 典型场景示例](#43-典型场景示例)
- [五、业务代码编写规范](#五业务代码编写规范)
- [六、示例工程与体验](#六示例工程与体验)
- [七、常见问题与排错 (FAQ)](#七常见问题与排错-faq)

---

## 一、背景与核心痛点

在微信小程序开发中，包体积大小受到微信官方平台的严格限制（单个主包不超过 2MB，单个普通分包不超过 2MB，整包总体积通常上限 20MB）。随着业务复杂度提升，经常面临以下痛点：

1. **重组件挂载导致分包超限**：
   页面内部某些极低频触发的重度功能（如数据大屏、富文本编辑器、三维模型渲染、复杂图表），一旦被某个分包页面静态或动态引用，默认会被打包进该分包的主 chunk 中，极易导致分包直接突破 2MB 限制。
2. **多页面共用重组件导致主包膨胀**：
   如果多个普通分包共同引用一个大型基础组件，常规构建工具往往会将其提升到主包公共 chunk（如 `common.js`），间接挤占极其宝贵的主包体积。
3. **传统异步分包侵入性高**：
   传统方式需要为每个异步组件手工单独建页面或维护复杂的微信独立分包配置，开发体验与代码维护成本极高。

通过顶层配置 `asyncSubPackages`，业务方无需重构页面结构，仅需像配置 Webpack 规则一样指定源码匹配条件与目标异步分包目录，构建工具会自动完成**代码拆分、私有依赖收敛、样式回填与分包注册**全流程。

---

## 二、运作原理

顶层异步分包在编译阶段全自动执行以下流程：

```text
源码模块 (Source Modules)
   │
   ├─ 命中 asyncSubPackages[i].test 规则
   │       ↓
   │  沿 Module Graph 追踪私有依赖 (helpers / 本地依赖 / 私有样式)
   │       ↓
   │  SplitChunks 生成独立异步分包 JS Chunk
   │       ↓
   │  提取组件样式，构建期自动回填至对应消费页样式文件 (保留相对引用)
   │       ↓
   │  生成微信占位三件套 (index.js / index.json / index.wxml) 并注册至 app.json
   │       ↓
运行时消费端通过 require.async (动态 import) 按需加载该异步分包
```

1. **源码路径匹配**：
   规则的 `test`、`include`、`exclude` 是相对于工程源码目录（`sourceDir`，通常为 `src/`）的文件相对路径。
2. **私有依赖与样式自动跟随**：
   命中的重型组件所私有引用的辅助函数文件（如 `helper.js`）、内部子组件和本地图片资源，会自动跟随该组件一并收敛归属到目标异步分包，不会发生文件碎裂或遗漏。
   组件引用的样式（SCSS/CSS）会被抽取并在构建期搬迁并合并到所有实际调用该组件的消费页面样式产物中，且相对路径引用（如 `@import` 或 `url()`）会被自动 rebase 重写。
3. **微信协议与占位入口集成**：
   Taro 编译器会自动在每个生成或使用的异步分包根目录下生成符合微信规范的占位入口，并自动将其注入到微信小程序的 `app.json` 的 `subPackages` 字段中。在开发过程中业务开发者**无需**手动在 `app.json` 中定义这些异步子包。
4. **多候选 Root 自动预算装箱 (`maxSize`)**：
   当一个或多个规则的产物可能很大、超出单个分包 2MB 上限时，可以配置一组候选目录池（`root: ['pages/async-1', 'pages/async-2']`）并指定单包上限 `maxSize`。编译器会基于确定性贪心算法进行跨规则装箱拆分，优先填满前序目录，超出时平滑溢出到后续候选目录。

---

## 三、使用前置条件

- **平台要求**：微信小程序（`weapp`）。
- **编译参数**：需启用新版混合开发构建模式（添加 `--new-blended` 参数）。
- **跨平台兼容行为**：
  若在其他平台（如 H5、支付宝小程序、京东小程序等）或非 `--new-blended` 构建中，Taro 会在读取配置阶段安全忽略该字段，并在终端输出友好提示，不会影响其他平台的正常打包。

---

## 四、配置参考

### 4.1 类型定义

在 `src/app.config.ts` 中配置顶层属性 `asyncSubPackages`：

```typescript
import { defineAppConfig } from '@tarojs/taro'

export default defineAppConfig({
  pages: [
    'pages/index/index'
  ],
  // 顶层异步分包路由规则列表
  asyncSubPackages: [
    {
      test: string | RegExp | ((resource: string) => boolean) | Array<...>,
      include?: string | RegExp | ((resource: string) => boolean) | Array<...>,
      exclude?: string | RegExp | ((resource: string) => boolean) | Array<...>,
      root: string | string[],
      priority?: number,
      maxSize?: number,
    }
  ],
  // 建议配合微信组件按需注入开启
  lazyCodeLoading: 'requiredComponents'
})
```

### 4.2 规则配置项详解

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
| :--- | :--- | :---: | :---: | :--- |
| `test` | `AsyncResourceCondition` | 是 | - | 匹配源码相对路径（相对于 `src/`，统一使用 `/` 正斜杠）。支持字符串精确/前缀匹配、正则表达式、自定义断言函数或上述类型的数组。 |
| `include` | `AsyncResourceCondition` | 否 | - | 白名单范围收窄条件。 |
| `exclude` | `AsyncResourceCondition` | 否 | - | 黑名单排除条件。 |
| `root` | `string \| string[]` | 是 | - | 产物输出的目标分包路径（相对于构建输出目录 `dist/`）。传入单个路径表示固定输出；传入数组表示候选分包池（必须配合 `maxSize` 使用）。 |
| `priority` | `number` | 否 | `0` | 规则优先级。当多个规则同时命中某个源码模块时，数值较高者胜出。 |
| `maxSize` | `number` | 否 | - | 目标分包的容量上限预算（单位：**字节 Bytes**）。当 `root` 为数组时**必填**。此预算按模块未压缩代码体积估算，并在构建最终产物时复核。 |

> [!NOTE]
> `root` 路径为业务自定义的存放分包路径（如 `pages/heavy-async`），但不可使用 Taro 框架底层保留字 `shared-async-v1`。

### 4.3 典型场景示例

#### 场景 1：提取单个重型组件（精确文件匹配）
业务中有一个复杂的图表或渲染大组件 `src/components/heavy-content/index.jsx`：

```typescript
export default defineAppConfig({
  asyncSubPackages: [
    {
      // 匹配 components/heavy-content/index (可省略脚本扩展名)
      test: 'components/heavy-content/index',
      root: 'pages/heavy-async',
      priority: 10,
    }
  ]
})
```
*构建效果*：`heavy-content` 及其私有引入的 `helper.js`、样式文件将统一打包进 `dist/pages/heavy-async/` 目录，并在消费页面中按需加载。

#### 场景 2：按业务目录整体隔离异步分包（正则匹配）
将整套报表相关组件自动拆分为一个异步分包：

```typescript
export default defineAppConfig({
  asyncSubPackages: [
    {
      test: /^components\/reports\//,
      root: 'pages/reports-async'
    }
  ]
})
```

#### 场景 3：多目录聚合与多候选分包动态预算装箱 (`maxSize`)
将图表库与富文本编辑器组合归集，若总代码量超出单个分包 1.5MB 限制，自动溢出到第二个分包：

```typescript
export default defineAppConfig({
  asyncSubPackages: [
    {
      // 条件数组实现多目录并集
      test: [/^components\/charts\//, /^components\/editor\//],
      root: ['pages/visualization-async-1', 'pages/visualization-async-2'],
      maxSize: 1_500_000 // 1.5MB 预算装箱
    }
  ]
})
```

---

## 五、业务代码编写规范

### 1. 动态按需加载规范
在业务页面或组件中使用标准的 ES 动态 `import()` 或 `React.lazy`：

```tsx
import React, { Suspense, useState } from 'react'
import { View, Button } from '@tarojs/components'

// 使用 React.lazy 动态加载异步分包组件
const HeavyContent = React.lazy(() => import('../../components/heavy-content'))

export default function OrderPage () {
  const [showHeavy, setShowHeavy] = useState(false)

  return (
    <View className="order-page">
      <Button onClick={() => setShowHeavy(true)}>加载重型功能</Button>
      {showHeavy && (
        <Suspense fallback={<View>加载中...</View>}>
          <HeavyContent />
        </Suspense>
      )}
    </View>
  )
}
```

### 2. 依赖隔离守卫原则
在业务代码中，**避免在一个动态 import() 的同一个入口容器文件中同时引入未受管模块与已受管模块**。
例如，不要编写如下混杂容器：
```javascript
// ❌ 反模式：container.js
import './heavy-content' // 命中了 asyncSubPackages 规则
import './light-content' // 未命中任何规则的项目源码组件
```
*原因*：Webpack 会默认将同一个动态加载入口内的所有静态依赖打包在同一个 chunk 内。当编译器检测到一个 chunk 混杂了“需移入异步分包的受管代码”与“未声明的源码模块”时，为了防止轻量模块被错误连带搬迁，编译器会**主动报错阻断**：
> `[taro asyncSubPackage] 异步 chunk 同时包含已归属与未归属的源码模块，无法安全拆分...`

*正例*：请分别对独立功能模块进行独立的 `import()` 调用。

---

## 六、示例工程与体验

Taro 仓库内附带了开箱即用的完整示例工程：
* **示例目录**：[`examples/subpackage-indie-async`](file:///Users/fengshimin5/Projects/Taro/taro-weapp-runtime-union/examples/subpackage-indie-async)

### 运行体验步骤：
1. **安装依赖并编译 Taro Runner**：
   ```bash
   pnpm install
   pnpm --filter @tarojs/webpack5-runner build
   ```
2. **构建示例小程序**：
   ```bash
   pnpm --filter subpackage-indie-async-example run build
   ```
3. **在微信开发者工具中预览**：
   使用微信开发者工具导入 `examples/subpackage-indie-async/miniapp` 目录，在模拟器中进入页面点击体验动态加载，可以在调试器 Network / Console 面板中观察到对应的异步子包通过 `require.async` 顺畅拉取与渲染。

---

## 七、常见问题与排错 (FAQ)

### Q1: 报错 `[taro asyncSubPackage] 不允许同时使用旧的 subPackageIndie 异步配置与顶层 asyncSubPackages`
- **原因**：项目同时配置了老旧的 `subPackageIndie[].subPackageRoots[].asyncSubPackage` 与新的顶层 `asyncSubPackages`。
- **解决方法**：两者互斥，请统一迁移至顶层 `asyncSubPackages` 配置。

### Q2: 报错 `[taro asyncSubPackage] 异步 chunk 同时包含已归属与未归属的源码模块，无法安全拆分`
- **原因**：如[业务代码编写规范](#2-依赖隔离守卫原则)所述，某次动态 `import` 的依赖链中同时混杂了命中规则的模块和无规则的未受管项目代码。
- **解决方法**：为相关未受管代码补充 `test` 匹配规则，或拆开两者的动态引入边界。

### Q3: 为什么构建警告 `async root "xxx" 最终产物超出预算`？
- **原因**：编译期的装箱算法是基于模块未压缩体积进行的估算，当最终编译、摇树（Tree-shaking）及代码生成后的最终 JS 产物体积依然大于 `maxSize` 时，编译器会给出 Warning。
- **解决方法**：检查该分包是否引入了额外的公共库，或在配置中适当调整 `maxSize` 数值或增加备选 `root` 候选目录。

### Q4: 样式文件被搬迁后，图片或相对路径样式会 404 吗？
- **解答**：不会。Taro 异步分包插件在搬迁样式到消费页面时，会自动比对源文件目录与消费页面目录。当跨目录搬迁时，内部的 `@import "./xxx.wxss"` 和 `url("./xxx.png")` 相对引用均会被自动重写计算（Rebase），确保加载正常。
