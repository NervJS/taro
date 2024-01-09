# Taro Helper

Taro 编译时工具库，主要供 CLI、编译器插件使用

tips:

执行 `build` 命令时，会把 swc-backup 文件夹里的 `.wasm` 文件移动到 swc 文件夹中，目的是为了不关注 SWC 插件的开发者无需配置 Rust 环境。但如何开发者需要修改 SWC 插件，请参考 CONTRIBUTING.md 文档中的 Rust 部分进行开发调试。

## 项目结构

``` plaintext
.
├── __tests__           # 单测
├── babelRegister.ts    # babel register，已过时
├── constants.ts        # 编译时常量
├── esbuild             # esbuild 相关工具
│   ├── index.ts
│   ├── swc-plugin.ts
│   └── utils.ts
├── index.ts
├── npm.ts              # 依赖项管理工具
├── swcRegister.ts      # swc register，通常用于加载项目的配置文件，如 app.config.js
├── terminal.ts         # 终端 Terminal 工具集
└── utils.ts            # 工具集
```
