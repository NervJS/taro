---
title: Canvas
sidebar_label: Canvas
id: version-2.1.0-canvas
original_id: canvas
---

画布

`<Canvas />` 组件的 RN 版本尚未实现。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html)

## 类型

```tsx
ComponentType<CanvasProps>
```

## 示例代码

```tsx
class App extends Components {
  render () {
    return (
      <Canvas style='width: 300px; height: 200px;' canvasId='canvas' />
    )
  }
}
```

## CanvasProps

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| type | `string` |  | 否 | 指定 canvas 类型，支持 2d 和 webgl |
| canvasId | `string` |  | 否 | canvas 组件的唯一标识符，若指定了 type 则无需再指定该属性 |
| disableScroll | `boolean` | `false` | 否 | 当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新 |
| onTouchStart | `BaseEventOrigFunction<any>` |  | 否 | 手指触摸动作开始 |
| onTouchMove | `BaseEventOrigFunction<any>` |  | 否 | 手指触摸后移动 |
| onTouchEnd | `BaseEventOrigFunction<any>` |  | 否 | 手指触摸动作结束 |
| onTouchCancel | `BaseEventOrigFunction<any>` |  | 否 | 手指触摸动作被打断，如来电提醒，弹窗 |
| onLongTap | `BaseEventOrigFunction<any>` |  | 否 | 手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动 |
| onError | `BaseEventOrigFunction<onErrorEventDetail>` |  | 否 | 当发生错误时触发 error 事件，detail = {errMsg: 'something wrong'} |

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| CanvasProps.type | ✔️ |  |  |
| CanvasProps.canvasId | ✔️ |  |  |
| CanvasProps.disableScroll | ✔️ |  |  |
| CanvasProps.onTouchStart | ✔️ |  |  |
| CanvasProps.onTouchMove | ✔️ |  |  |
| CanvasProps.onTouchEnd | ✔️ |  |  |
| CanvasProps.onTouchCancel | ✔️ |  |  |
| CanvasProps.onLongTap | ✔️ |  |  |
| CanvasProps.onError | ✔️ |  |  |

### onErrorEventDetail

| 参数 | 类型 |
| --- | --- |
| errMsg | `string` |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas | ✔️ |  |  |
