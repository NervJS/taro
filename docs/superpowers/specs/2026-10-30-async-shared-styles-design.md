# subPackageIndie 共享异步样式上提

拟将多个 sourceRoot 共用的异步样式合并到所属 subPackageIndie 组的 `mainPackageRoot/common.wxss`，每组保留一份。JS 保持异步分包，模板归属保持不变。本文规定拟实现的行为，尚不代表编译器已具备该行为。

## 范围与归属

“共享”指同一个异步样式产物对应多个 sourceRoot。属于同一组的 sourceRoot 共用该组的公共样式；跨组使用时，各组的 mainPackageRoot 分别保留一份。

单一 sourceRoot 使用的异步样式维持原归属。未启用 subPackageIndie，或无法从已有配置确定组归属的 sourceRoot，维持当前回迁策略。

实现不新增配置项，不检查 `isolated` 或 `:host`，不保证这两类场景的兼容性。接受公共 CSS 提前加载、入口所在包体积增加，以及跨组保留多份样式的成本。

## 公共样式加载

在现有异步样式回迁阶段处理最终样式产物。将共享规则追加到对应组的公共样式，不通过调整 JS splitChunks 实现 CSS 上提。

公共样式不存在时，创建目标文件，并确保该组入口的样式导入链能够到达它。已有公共样式和导入语句必须保留，重复编译不能重复追加同一导入或积累旧规则。涉及相对资源引用时，检查迁移后的路径。

当前导入链由 `MiniPlugin.injectCommonStyles()` 生成，随后调用 `afterGenerateFiles`；异步样式回迁单独挂在 `processAssets`。实现必须处理两者的时序，不能假定新公共文件会被此前生成的导入链自动发现。依据见 [MiniPlugin.ts](../../../packages/taro-webpack5-runner/src/plugins/MiniPlugin.ts) 的 `injectCommonStyles`、[AsyncSubPackagePlugin.ts](../../../packages/taro-webpack5-runner/src/plugins/AsyncSubPackagePlugin.ts) 的 `setupAsyncChunkAssetExtraction`。

## 轻量跨组 warning

复用现有 `getSubPackageIndieMatch(sourceRoot)` 取得 `config.mainPackageRoot`。该方法已有匹配缓存，依据见 [SubPackageIndiePlugin.ts](../../../packages/taro-webpack5-runner/src/plugins/SubPackageIndiePlugin.ts)。

同一共享异步样式对应多个 mainPackageRoot 时发出编译 warning，说明异步产物、所属组，以及各组公共样式保留一份的行为。按编译轮次和 asyncRoot、目标组集合去重，避免同一组组合重复刷屏。

检测仅使用现有 sourceRoot 集合和配置匹配结果。无法确定归属时不增加组件树遍历、CSS 解析或新的模块图回溯来生成 warning。warning 不阻断构建，也不承诺检测原生宿主中的实际渲染归属。

## 验收条件

- 同组多个 sourceRoot 共用的异步样式只在该组公共样式中出现一份，原 sourceRoot 样式不再重复携带这些规则。
- asyncRoot 中不残留已上提的样式，JS 仍保留异步加载行为。
- 没有原始 common 样式时，新增公共样式仍被入口导入。
- 单一 sourceRoot、无 subPackageIndie 配置及无法确定组归属的场景保持原行为。
- 跨组复用在能够确定归属时产生去重后的 warning，各组产物完整；同组复用不产生跨组 warning。
- dev、production 和 watch 重编译保留规则与导入，不重复积累内容。
- 原异步样式回归测试与 webpack5-runner 邻近测试通过。
- 使用包含 CSS Modules 懒加载 Demo 的业务复现工程，在微信开发者工具分别查看两个消费者，确认颜色和字号生效；产物断言不能替代渲染验证。

## 确认记录

- 2026-10-30 用户：确认不考虑 isolated、:host，接受公共 CSS 提前加载和跨组成本；跨组 warning 仅在能够低成本检测时增加。
