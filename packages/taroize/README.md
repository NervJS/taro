# `@tarojs/taroize`

暴露给 `@tarojs/cli/convert` 的原生小程序转 Taro 转换器。

## 核心 API

### parse(options)

解析小程序源文件为 React/Vue 组件、

#### options

```typescript
interface Option {
  json?: string, // 小程序配置文件
  script?: string, // 小程序的 JavaScript 文件
  wxml?: string, // wxml 文件
  path: string, // 当前页面路径
  rootPath: string // 根目录路径
}
```
