# H5 Swiper 生命周期手工复现

用于验证 PR #19353 / Issue #19522。直接使用编译后的 Stencil 组件和真实 Swiper，不修改实例内部字段。

## 准备

按仓库贡献指南安装依赖，构建 `@tarojs/components`。随后在仓库根目录执行：

```sh
pnpm --filter @tarojs/components exec esbuild ../../examples/swiper-lifecycle/index.js --bundle --format=iife --outfile=../../examples/swiper-lifecycle/bundle.js
```

使用 Chrome 打开本目录的 `index.html`，或通过已有静态服务访问。`bundle.js` 是本地产物，不提交。

## 操作顺序

1. 点击「挂载三图」，等待轮播开始。
2. 点击「卸载保留节点」。宿主从文档移除，仍保留引用。
3. 点击「切换 circular」，将其改为 false；等待页面状态更新。
4. 再次点击「切换 circular」，改回 true；等待页面状态更新。
5. 点击「追加一图」。
6. 在修复分支中继续点击「重新挂载」。

## 已观察结果

基线：main `4a1ea09a1b0`，Taro 4.3.0 / Swiper 11.1.15 / Stencil 2.22.3，Chrome。

- 卸载后旧实例仍自动播放。
- 断开期间切换 circular 会触发 reset，以全局选择器重建实例；节点不在文档中，构造出的实例没有有效 wrapper。
- 追加节点时抛出 `TypeError: Cannot read properties of undefined (reading 'children')`，堆栈为 `elementChildren → recalcSlides → loopDestroy → beforeDomOperation → appendChild`。

PR 分支：同一操作顺序没有捕获到异常；旧实例被销毁，重新挂载后四张图和 autoplay 恢复。

这是 H5 自定义元素脱离文档后仍被更新的复现，未证明 React 页面所有卸载方式都会执行后续操作，也不是线上 Taro 3.5.7 / Swiper 6 的完整用户操作还原。`getSwiperTranslate → loopFix → autoplay` 原始堆栈尚未复现。

## 自动化回归

`packages/taro-components/__tests__/swiper-lifecycle.spec.tsx` 使用现有 `newSpecPage` 和 Swiper mock 覆盖 8 个生命周期场景。最初 5 个场景在 main 基线失败；本轮新增索引覆盖回归，并将失效节点用例对齐真实 slidesEl 路径，两个针对用例在本轮修复前失败、修复后通过。当前 15 个 Swiper 用例及 7 个快照通过，新增旧实例事件隔离和子节点更新期间事件抑制回归。mock 场景与上面的真实浏览器结果分别记录。

当前实现仅在属性更新、外部子节点更新及连接/断开入口管理实例；不依赖 componentDidRender 重建。实例初始化成功后才保存引用，current 恢复索引显式传入 reset，不再维护额外 pending 标志。
