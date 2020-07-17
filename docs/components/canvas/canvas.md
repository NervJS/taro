---
title: Canvas
sidebar_label: Canvas
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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>指定 canvas 类型，支持 2d 和 webgl</td>
    </tr>
    <tr>
      <td>canvasId</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>canvas 组件的唯一标识符，若指定了 type 则无需再指定该属性</td>
    </tr>
    <tr>
      <td>disableScroll</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>当在 canvas 中移动时且有绑定手势事件时，禁止屏幕滚动以及下拉刷新</td>
    </tr>
    <tr>
      <td>onTouchStart</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>手指触摸动作开始</td>
    </tr>
    <tr>
      <td>onTouchMove</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>手指触摸后移动</td>
    </tr>
    <tr>
      <td>onTouchEnd</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>手指触摸动作结束</td>
    </tr>
    <tr>
      <td>onTouchCancel</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>手指触摸动作被打断，如来电提醒，弹窗</td>
    </tr>
    <tr>
      <td>onLongTap</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当发生错误时触发 error 事件，detail = {errMsg: 'something wrong'}</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas | ✔️ |  |  |
