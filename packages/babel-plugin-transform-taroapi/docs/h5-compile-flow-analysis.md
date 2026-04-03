# H5 端编译流程与 transform-taroapi 执行顺序分析

## 1. 相关插件与调用顺序

### 1.1 modifyWebpackChain 注册顺序

| 插件 | 注册时机 | 作用 |
|-----|---------|-----|
| **taro-framework-react** | 框架插件 | `modifyH5WebpackChain`：设置 alias、process-import-taro-h5 loader（仅匹配 `taro-h5/dist/`）、fast-refresh |
| **taro-platform-h5** | 平台插件，`setupTransaction.addWrapper` | 追加 `transform-taroapi` 到 babel-loader 的 `plugins` |
| **plugin-inject-jdapi** | 业务插件，`onSetupClose` | 修改 transform-taroapi 配置（apis）、可将其移到 preset |

### 1.2 taro-platform-h5 的 Babel 修改

```ts
// taro-platform-h5/src/program.ts:98-111
const options = babelLoader.get('options')
babelLoader.set('options', {
  ...options,
  plugins: [
    ...(options.plugins || []),
    [require('babel-plugin-transform-taroapi'), { packageName, definition }],
  ],
})
```

**关键**：`transform-taroapi` 被 **追加** 到 `options.plugins` 末尾。

### 1.3 初始 Babel 配置来源

- **script rule**：`WebpackModule.getScriptRule()` 仅设置 `babel-loader` 且 `options: { compact: false }`
- **完整配置**：babel-loader 运行时从项目根目录加载 `babel.config.js`
- **babel.config.js** 典型内容：`presets: ['babel-preset-taro']`

## 2. babel-preset-taro 的配置结构

```js
// babel-preset-taro/index.js
return {
  sourceType: 'unambiguous',
  overrides: [{
    exclude: [/@babel[/|\\\\]runtime/, /core-js/, /\bwebpack\/buildin\b/],
    presets: [preset-env, preset-ts, preset-react, ...],
    plugins: [decorators, class-props, transform-runtime, dynamic-import-node, ...],
  }],
}
```

- 对 **未** 命中 `exclude` 的文件（如 `list/index.tsx`），使用 override 的 `presets` 和 `plugins`
- `preset-env` 内含 `@babel/plugin-transform-optional-chaining`
- `transform-runtime` 会注入 `_slicedToArray` 等 helper

## 3. 最终 Babel 配置的合并方式

loader 传入的 `options` 会与 `babel.config.js` 合并，大致为：

```
babel.config.js:  presets: [babel-preset-taro]
loader options:   plugins: [..., transform-taroapi]  // taro-platform-h5 追加
```

Babel 对 **overrides** 的处理：

- 命中 override 时，会应用 override 的 `presets` 和 `plugins`
- 顶层 `plugins`（含 `transform-taroapi`）与 override 的合并顺序依赖 Babel 内部实现
- 若 override 的 plugins 先于顶层 plugins 执行，则 `optional-chaining`、`transform-runtime` 会先跑，预扫描时 AST 已被改写

## 4. order10 日志的结论

预扫描时 AST 已包含：

- 第一个 import：`_slicedToArray`（来自 transform-runtime）
- `Taro.JDMTA.isTrafficMapEnable?.()` 已被展开为三元表达式

说明在 `transform-taroapi` 的 `Program.enter` 执行前，`optional-chaining` 和 `transform-runtime` 已经处理过该文件。

## 5. 可选修复方案

### 方案 A：在 plugin-inject-jdapi 中移到 preset（已实现）

将 `transform-taroapi` 从 `plugins` 中移除，放入独立 preset，并 `presets.push()`，利用 presets 倒序执行，使其在 preset-env 之前运行。

### 方案 B：在 taro-platform-h5 中调整注入方式

在 `taro-platform-h5` 中不再简单追加到 `plugins`，而是：

- 使用 `presets.unshift({ plugins: [transform-taroapi] })`，或
- 通过其他方式保证其在 preset-env 之前执行

这样不依赖 plugin-inject-jdapi，所有 H5 项目都能受益。

### 方案 C：在 babel-preset-taro 中内置

在 `babel-preset-taro` 的 override 中，将 `transform-taroapi` 放在 `plugins` 数组最前面，确保先于 `optional-chaining` 执行。
