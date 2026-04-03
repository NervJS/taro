# H5 端命名空间 API 可选链问题修复方案

## 问题描述

在 Taro H5 端，使用可选链语法调用命名空间 API 时，编译产物中会保留对 `Taro.JDMTA` 等不存在对象的引用，导致运行时报错：

```
TypeError: Cannot read properties of undefined (reading 'isTrafficMapEnable')
```

受影响的写法包括：

```ts
// 以下可选链写法在 H5 端均会出错
Taro?.JDMTA.isTrafficMapEnable()
Taro.JDMTA?.isTrafficMapEnable()
Taro.JDMTA.isTrafficMapEnable?.()           // 最常见
Taro?.JDMTA?.isTrafficMapEnable()
Taro?.JDMTA.isTrafficMapEnable?.()
Taro.JDMTA?.isTrafficMapEnable?.()
Taro?.JDMTA?.isTrafficMapEnable?.()
```

而不带可选链的写法 `Taro.JDMTA.isTrafficMapEnable()` 一直是正常的。

## 根因分析

### Babel 的遍历模型

Babel 将所有插件的 visitor **合并到一次遍历**中，逐节点推进，对同一节点按插件顺序依次触发 visitor。这意味着：

- `transform-taroapi` 和 `@babel/plugin-transform-optional-chaining`（来自 `preset-env`）共享同一次遍历
- "插件 A 先于插件 B"只意味着**同一节点**上 A 的 visitor 先触发，而非 A 完整跑完再轮到 B

### 具体失败场景

以 `Taro.JDMTA.isTrafficMapEnable?.().then(res => {...})` 为例，AST 结构如下：

```
CallExpression (.then)                              ← 主遍历先访问这里
  └─ MemberExpression (.then)
       └─ OptionalCallExpression { optional: true }  ← 我们想处理的节点
            └─ MemberExpression (Taro.JDMTA.isTrafficMapEnable)
```

主遍历是自顶向下（enter）的：

1. **进入 `.then()` CallExpression** — `transform-taroapi` 先触发，callee 是 `.then`，不匹配，跳过
2. **紧接着** `@babel/plugin-transform-optional-chaining` 触发 — 检测到 callee 链中存在 `?.()` 可选链，**一次性展开整条链**，生成：
   ```js
   (_Taro$JDMTA = Taro.JDMTA) === null || _Taro$JDMTA === void 0
     ? void 0
     : _Taro$JDMTA.isTrafficMapEnable().then(res => {...})
   ```
3. 内层 `OptionalCallExpression` 节点**已经被替换**，`transform-taroapi` 永远无法访问到它

关键在于：外层节点先被访问，`optional-chaining` 在外层就把整棵子树改写了，内层节点在被任何插件处理前就已消失。

## 解决方案

### 核心思路：`Program.enter` 预扫描

在 `transform-taroapi` 的 `Program.enter` 中，通过 `ast.traverse()` 发起一次**独立的子遍历**。这次子遍历：

- 只有 `transform-taroapi` 自己的逻辑参与，没有其他插件
- **同步执行完毕**后，主遍历才继续
- 在所有插件开始处理具体节点之前，就把可选链降级完成

### 执行流程

```
┌─────────────────────────────────────────────────────┐
│ Program.enter 触发                                   │
│                                                     │
│ 子遍历 1：找到 import，确定 taroName                  │
│   import Taro from '@tarojs/taro'                   │
│   → preScanTaroName = 'Taro'                        │
│                                                     │
│ 子遍历 2：遍历所有 OptionalCallExpression             │
│   Taro.JDMTA.isTrafficMapEnable?.()                 │
│   → 匹配 namespace API（JDMTA_isTrafficMapEnable）   │
│   → replaceWith(CallExpression)                     │
│   → 变成 Taro.JDMTA.isTrafficMapEnable()            │
│                                                     │
│ ─── 子遍历完成，AST 已修改 ───                        │
└─────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────┐
│ 主遍历继续（所有插件共享）                              │
│                                                     │
│ @babel/plugin-transform-optional-chaining            │
│   → 已经没有 Taro API 的可选链了，不会介入              │
│                                                     │
│ transform-taroapi 的 CallExpression visitor           │
│   → 匹配 Taro.JDMTA.isTrafficMapEnable()            │
│   → 替换为 _JDMTA_isTrafficMapEnable()              │
│                                                     │
│ Program.exit                                        │
│   → 生成 import { JDMTA_isTrafficMapEnable as       │
│     _JDMTA_isTrafficMapEnable } from '@tarojs/taro' │
└─────────────────────────────────────────────────────┘
```

### 代码改动说明

#### 1. `getTaroNamespaceCall` 辅助函数

统一识别各种可选链和 TS 包裹形态下的命名空间 API 调用：

```ts
function getTaroNamespaceCall(t, callee, taroName, file)
  : { namespaceName: string, methodName: string } | null
```

处理的 callee 形态包括：
- `MemberExpression`：`Taro.JDMTA.isTrafficMapEnable`
- `OptionalMemberExpression`：`Taro?.JDMTA?.isTrafficMapEnable`
- `OptionalCallExpression` 包裹：`Taro.JDMTA.isTrafficMapEnable?.()`
- `AssignmentExpression` 包裹：`(_tmp = Taro.JDMTA).isTrafficMapEnable`
- `TSAsExpression` / `TSNonNullExpression` 等 TS 类型包裹

#### 2. `Program.enter` 预扫描（核心）

```ts
Program: {
  enter(ast) {
    // ... 状态重置 ...

    // 子遍历 1：找到 taroName
    ast.traverse({
      ImportDeclaration(importPath) { /* 从 import 中提取 taroName */ }
    })

    // 子遍历 2：降级可选链
    if (preScanTaroName) {
      ast.traverse({
        OptionalCallExpression(optPath) {
          const nsInfo = getTaroNamespaceCall(...)
          if (nsInfo && apis.has(flatName)) {
            optPath.replaceWith(t.callExpression(
              optPath.node.callee,
              optPath.node.arguments
            ))
          }
        }
      })
    }
  }
}
```

#### 3. `CallExpression|OptionalCallExpression` visitor

主遍历中的兜底处理，使用 `getTaroNamespaceCall` 识别命名空间 API 调用并替换为扁平标识符：

```ts
'CallExpression|OptionalCallExpression'(ast) {
  const nsInfo = getTaroNamespaceCall(t, callee, taroName, this.file)
  if (nsInfo && this.apis.has(flatName)) {
    // 替换为扁平标识符，如 _JDMTA_isTrafficMapEnable
    if (t.isOptionalCallExpression(ast.node)) {
      ast.replaceWith(t.callExpression(identifier, ast.node.arguments))
    } else {
      ast.node.callee = identifier
    }
  }
}
```

#### 4. `MemberExpression|OptionalMemberExpression` visitor

处理非调用场景下的命名空间属性访问（如 `const fn = Taro.JDMTA.isTrafficMapEnable`）。

### 编译结果

```ts
// 编译前（任意可选链组合）
import Taro from '@tarojs/taro'
Taro.JDMTA.isTrafficMapEnable?.()
  .then(res => console.log(res))
  .catch(err => console.log(err))

// 编译后
import { JDMTA_isTrafficMapEnable as _JDMTA_isTrafficMapEnable } from '@tarojs/taro-h5'
_JDMTA_isTrafficMapEnable()
  .then(res => console.log(res))
  .catch(err => console.log(err))
```

## 为什么不能靠调整插件执行顺序解决

`transform-taroapi` 本身就在 `@babel/plugin-transform-optional-chaining` 之前执行（plugins 在 presets 之前）。但由于 Babel 的合并遍历模型：

- **同节点竞争**：插件顺序靠前的先触发 → `transform-taroapi` 赢
- **父子节点竞争**：父节点先被访问 → `optional-chaining` 在父节点上改写整棵子树 → `transform-taroapi` 输

可选链的链式调用（`.then()/.catch()`）恰好触发了"父子节点竞争"场景。`Program.enter` 中的独立子遍历绕过了这个问题——在主遍历开始前就完成了可选链降级，无需和其他插件竞争。

## 调试方法

设置环境变量 `JDAPI_DEBUG_TAROAPI=true` 可以开启调试日志，观察预扫描和命名空间 API 匹配的情况：

```bash
JDAPI_DEBUG_TAROAPI=true npm run dev:h5
```

输出示例：
```
[jdapi-core-taroapi] pre-transform: strip optional call for JDMTA_isTrafficMapEnable in file: /src/pages/index.tsx
[jdapi-core-taroapi] getTaroNamespaceCall hit: JDMTA_isTrafficMapEnable file = /src/pages/index.tsx
```
