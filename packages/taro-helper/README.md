# `@tarojs/helper`

Taro 编译时工具库，主要供 CLI、编译器插件使用


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
