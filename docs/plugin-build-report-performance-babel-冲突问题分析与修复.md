# plugin-build-report-performance 导致 babel-plugin-transform-taroapi 失效问题

## 问题现象

H5 端首次编译后，`@tarojs/taro` 的扩展 API（由 `@jdtaro/plugin-inject-jdapi` 注入）调用**无法正常工作**。

表现为：API 调用没有被正确替换为平台实现，功能异常。

奇特的是，**同一个项目第二次编译（30 分钟内）却完全正常**，呈现出首次/再次编译行为不一致的现象。

---

## 根因分析

### 涉及组件

| 组件 | 作用 |
|------|------|
| `@tarojs/platform-h5` (`program.ts`) | 将 `babel-plugin-transform-taroapi` 包装成 `transformTaroApiPreset`，注入到 webpack 的 `script` rule 中 |
| `@jdtaro/plugin-inject-jdapi` | 向 `transformTaroApiPreset` 注入额外的 JD 扩展 API 列表 |
| `@jdtaro/plugin-build-report-performance` | 效能统计插件，统计组件使用量 |

### 问题根源：两条 webpack rule 同时处理同一个源码文件

`plugin-build-report-performance` 的 `CollectStatisticsPlugin` 在 `apply()` 时调用 `insertExtraBabelLoader()`，**直接向 `compiler.options.module.rules` 追加了一条新规则**，绕过了 webpack-chain：

```javascript
// plugin-build-report-performance/src/plugins/plugin.webpack.ts（修复前）
insertExtraBabelLoader(compiler) {
    compiler.options.module.rules.push({
        test: REG_SCRIPTS,
        exclude: /node_modules/,
        use: [{
            loader: require.resolve('babel-loader'),
            options: {
                // ❌ 没有 configFile: false！
                plugins: [['./babel/babel-plugin-count-target-schema.js', { config: dynamicConfig }]]
            }
        }]
    })
}
```

关键问题：**这个 babel-loader 没有设置 `configFile: false`**，导致它会自动读取项目的 `babel.config.js`，其中包含 `babel-preset-taro` → `@babel/preset-env`。

### 双重编译链路（导致 Bug 的执行顺序）

webpack 规则按**数组末尾优先**执行，所以处理 `src/pages/api/test/index.tsx` 时：

```
第 1 次（效能插件注入的新 rule，最后加入 → 最先执行）：
  babel-loader
  ├── 读取 babel.config.js → babel-preset-taro → @babel/preset-env
  ├── @babel/preset-env 将 ES Modules 转为 CommonJS
  └── import Taro from '@tarojs/taro'  →  const Taro = require('@tarojs/taro')
                                              ↑ import 语句消失了！

第 2 次（taro 主 script rule）：
  babel-loader
  ├── transformTaroApiPreset（含 babel-plugin-transform-taro-api）
  ├── babel-plugin-transform-taro-api 查找 import ... from '@tarojs/taro'
  └── ❌ 找不到！import 已被第 1 次转成 require，插件失效
```

对比：**`platform-h5.js`（node_modules 文件）** 有 `exclude: /node_modules/`，不受新 rule 影响，只走主 rule，所以它的 `babel-plugin-transform-taro-api` 正常工作。

这就是为什么日志里看到：
- `platform-h5.js` 的 `Program.enter` 正常（有 transform-taro-api）
- `test/index.tsx` 紧随其后打印两次 `Final Babel Config`——一次是新 rule（无 transform-taro-api），一次是主 rule（有 transform-taro-api）

### 首次 vs 再次编译行为不一致的原因

效能插件内置了**熔断机制**：30 分钟内同一项目同一平台只上报一次数据。

```javascript
const isCircuitBreakerActive = shouldSkipReporting(sourceProjectPath, process.env.TARO_ENV)
if (isCircuitBreakerActive) {
    return  // 直接返回，CollectStatisticsPlugin 不会被注册！
}
```

- **首次编译**：熔断未激活 → `CollectStatisticsPlugin` 注册 → `insertExtraBabelLoader` 执行 → 第二条 rule 出现 → bug 触发
- **再次编译（30 分钟内）**：熔断激活 → 插件直接 return → 没有额外 rule → 只有主 rule → 正常工作

---

## 修复方案

在效能插件的额外 babel-loader 中加上 `configFile: false` + `babelrc: false`，切断它与项目 `babel.config.js` 的关联，同时加上 `@babel/plugin-syntax-typescript` 的 `isTSX: true` 选项，让解析器能识别 TSX 语法。

```javascript
// plugin-build-report-performance/src/plugins/plugin.webpack.ts（修复后）
insertExtraBabelLoader(compiler) {
    compiler.options.module.rules.push({
        test: REG_SCRIPTS,
        exclude: /node_modules/,
        use: [{
            loader: require.resolve('babel-loader'),
            options: {
                configFile: false,   // ✅ 不读项目 babel.config.js
                babelrc: false,      // ✅ 不读 .babelrc
                plugins: [
                    [require.resolve('@babel/plugin-syntax-typescript'), { isTSX: true }],
                    // ↑ 只开启解析能力，不做代码转换；isTSX: true 同时支持 TS 和 JSX 语法
                    ['./babel/babel-plugin-count-target-schema.js', { config: dynamicConfig }]
                ]
            }
        }]
    })
}
```

### 修复效果

| 步骤 | 修复前 | 修复后 |
|------|--------|--------|
| 效能插件处理 `test/index.tsx` | `@babel/preset-env` 将 import 转为 require | 只扫描组件，代码原封不动输出 |
| 主 rule 处理 `test/index.tsx` | import 已消失，transform-taro-api 失效 | import 完整，transform-taro-api 正常工作 |
| 首次/再次编译一致性 | 首次 bug，再次正常 | 始终正常 |

### 为什么需要 `{ isTSX: true }`

`@babel/plugin-syntax-typescript` 默认按 `.ts` 文件处理，不支持 JSX。对 `.tsx` 文件，不加此选项时 Babel 解析器看到 `<View className=...>` 会尝试将 `<View` 解析为 TypeScript 泛型参数列表，导致 `Unexpected token, expected ","` 错误。加上 `{ isTSX: true }` 后，TypeScript 解析器同时开启 JSX 解析能力，两者共存。

---

## 涉及修改文件

- `packages/plugin-build-report-performance/src/plugins/plugin.webpack.ts`

---

## 排查过程关键线索

1. 在 `babel.config.js` 加 `debugPrintConfigPlugin` 打印每个文件的 Final Babel Config
2. 发现 `test/index.tsx` 每次编译打印**两次** Babel 配置，且配置不同
3. 发现奇数次打印紧跟在 `platform-h5.js` 的 `Program.enter` 之后，说明两者相邻处理且属于不同 rule
4. 奇数次配置有 `babel-plugin-count-target-schema`，偶数次有 `babel-plugin-transform-taro-api`，两套配置互斥
5. 全局搜索 `babel-plugin-count-target-schema` 字符串，在 `plugin-build-report-performance` 中定位到该插件文件及 `insertExtraBabelLoader` 注入逻辑
6. 确认 `insertExtraBabelLoader` 缺少 `configFile: false`，导致 `@babel/preset-env` 被意外引入
