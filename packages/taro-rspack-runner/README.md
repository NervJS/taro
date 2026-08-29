# `@tarojs/rspack-runner`

暴露给 `@tarojs/cli` 的 H5 端 Rspack 构建器（experimental）。

在 H5 项目的 Taro 编译配置中将 `compiler` 设置为 `rspack` 即可启用：

```js
// config/index.ts
export default {
  compiler: 'rspack',
  // ...
}
```

当前仅支持 production build，不含 dev/HMR/prebundle，API 可能随后续迭代调整。
