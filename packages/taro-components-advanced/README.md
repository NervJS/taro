# @tarojs/components-advanced

> Taro 高阶组件库

- 虚拟列表 [VirtualList](./src/components/virtual-list/index.ts)
- 虚拟瀑布流 [VirtualWaterfall](./src/components/virtual-waterfall/index.ts)

> Note: @tarojs/components-advanced 不能依赖 @tarojs/components
> 因为 @tarojs/components 依赖 @tarojs/components-advanced 导出虚拟列表组件，
> 且仅通过 peerDependencies 引用依赖会在 pnpm publish 时抛出错误
