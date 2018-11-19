---
title: Image
sidebar_label: Image
---

##### 图片

> 属性及支持度

| 微信小程序 | H5 | ReactNative| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| √ | √ | √ | src       | String      |             | 图片资源地址    |
| √ | √ | x (部分支持：scaleToFill, aspectFit, aspectFill, widthFix) | mode      | String      | scaleToFill | 图片裁剪、缩放的模式   |
| √ | √ | √ | onError | HandleEvent |             | 当错误发生时，发布到 AppService 的事件名  |
| √ | √ | √ | onLoad  | HandleEvent |             | 当图片载入完毕时，发布到 AppService 的事件名 |
| √ |   | x | lazyLoad | Boolean     | false       | 图片懒加载。只针对 page 与 scroll-view 下的 image 有效 |


> 注意

为实现小程序的 `mode` 特性，在 H5 组件中使用一个 `div` 容器来对内部的 `img` 进行展示区域的裁剪，因此请勿使用元素选择器来重置 `img` 的样式！

###### 示例：
```jsx
<Image
  style='width: 300px;height: 100px;background: #fff;'
  src='nerv_logo.png'
/>
<Image
  style='width: 300px;height: 100px;background: #fff;'
  src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'
/>
```
