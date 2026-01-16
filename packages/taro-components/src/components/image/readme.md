# taro-image-core

## API

|              | 属性      | 类型        | 默认值      | 说明                                                   |
| ------------ | --------- | ----------- | ----------- | ------------------------------------------------------ |
| √            | src       | String      |             | 图片资源地址                                           |
| √            | mode      | String      | scaleToFill | 图片裁剪、缩放的模式                                   |
| √（onError） | binderror | HandleEvent |             | 当错误发生时，发布到 AppService 的事件名               |
| √ (onLoad)   | bindload  | HandleEvent |             | 当图片载入完毕时，发布到 AppService 的事件名           |
|              | lazy-load | Boolean     | false       | 图片懒加载。只针对 page 与 scroll-view 下的 image 有效 |


<!-- Auto Generated Below -->


## Properties

| Property      | Attribute   | Description | Type                                                                                                                                                                                              | Default         |
| ------------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `lazyLoad`    | `lazy-load` |             | `boolean`                                                                                                                                                                                         | `false`         |
| `mode`        | `mode`      |             | `"aspectFill" \| "aspectFit" \| "bottom left" \| "bottom right" \| "bottom" \| "center" \| "heightFix" \| "left" \| "right" \| "scaleToFill" \| "top left" \| "top right" \| "top" \| "widthFix"` | `'scaleToFill'` |
| `nativeProps` | --          |             | `{}`                                                                                                                                                                                              | `{}`            |
| `src`         | `src`       |             | `string`                                                                                                                                                                                          | `undefined`     |


## Events

| Event   | Description | Type               |
| ------- | ----------- | ------------------ |
| `error` |             | `CustomEvent<any>` |
| `load`  |             | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
