# taro-image-core

## API

|              | 属性      | 类型        | 默认值      | 说明                                                   |
| ------------ | --------- | ----------- | ----------- | ------------------------------------------------------ |
| √            | src       | String      |             | 图片资源地址                                           |
| √            | mode      | String      | scaleToFill | 图片裁剪、缩放的模式                                   |
| √（onError） | binderror | HandleEvent |             | 当错误发生时，发布到 AppService 的事件名               |
| √ (onLoad)   | bindload  | HandleEvent |             | 当图片载入完毕时，发布到 AppService 的事件名           |
|              | lazy-load | Boolean     | false       | 图片懒加载。只针对 page 与 scroll-view 下的 image 有效 |
|              | lang      | String      |             | 语言参数，在lego模式下会传递给canvas-tag组件           |


<!-- Auto Generated Below -->


## Properties

| Property      | Attribute   | Description | Type                                                                                                                                                                                              | Default         |
| ------------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `lazyLoad`    | `lazy-load` |             | `boolean`                                                                                                                                                                                         | `false`         |
| `mode`        | `mode`      |             | `"aspectFill" \| "aspectFit" \| "bottom left" \| "bottom right" \| "bottom" \| "center" \| "heightFix" \| "left" \| "right" \| "scaleToFill" \| "top left" \| "top right" \| "top" \| "widthFix"` | `'scaleToFill'` |
| `nativeProps` | --          |             | `{}`                                                                                                                                                                                              | `{}`            |
| `src`         | `src`       |             | `string`                                                                                                                                                                                          | `undefined`     |
| `lang`        | `lang`      |             | `string`                                                                                                                                                                                          | `undefined`     |


## Events

| Event   | Description | Type               |
| ------- | ----------- | ------------------ |
| `error` |             | `CustomEvent<any>` |
| `load`  |             | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

## LEGO 模式与 CDN 配置

当 `src` 以 `lego://` 开头时，组件进入 LEGO 模式，内部不再渲染 `<img>`，而是渲染 `<canvas-tag>`：

- 解析规则：`lego://{tagId}?text=...` → 传递 `tagId`、`text`、`lang` 到 `<canvas-tag>`。
- 事件差异：不触发 `<img>` 的 `load/error`，请使用 `<canvas-tag>` 自身事件（若有）。

脚本注入：组件在 LEGO 模式下会按需为 H5 端注入 `tag.js`（type="module"），默认 CDN：

- 开发：`http://ossin.jd.com/swm-plus/h5Tag/tag.js`
- 生产：`https://storage.jd.com/static-frontend/h5-tag/1.0.0/tag.min.js`

可通过全局变量覆盖 CDN 地址（优先级从上到下）：

1. `window.__TARO_IMAGE_LEGO_CDN_URL__`
2. `Taro.__TARO_IMAGE_LEGO_CDN_URL__`

示例：

```js
// 在应用启动时设置（H5）
window.__TARO_IMAGE_LEGO_CDN_URL__ = 'https://your-cdn.com/tag.min.js'
// 或
Taro.__TARO_IMAGE_LEGO_CDN_URL__ = 'https://your-cdn.com/tag.min.js'
```

说明：

- 若未设置覆盖变量，则根据 `process.env.NODE_ENV` 在内置 dev/prod CDN 之间选择。
- 组件已做脚本重复注入检查；在 SSR 场景访问 `window/document` 前有守卫。
