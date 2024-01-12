# Taro Helper

编译时工具库。

tips:

执行 `build` 命令时，会把 swc-backup 文件夹里的 `.wasm` 文件移动到 swc 文件夹中，目的是为了不关注 SWC 插件的开发者无需配置 Rust 环境。但如何开发者需要修改 SWC 插件，请参考 CONTRIBUTING.md 文档中的 Rust 部分进行开发调试。
