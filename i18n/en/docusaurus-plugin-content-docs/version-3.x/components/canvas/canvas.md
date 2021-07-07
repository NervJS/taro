---
title: Canvas
sidebar_label: Canvas
---

Canvas.

**Note:** Not supported for use in RN at this time.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/canvas.html)

## Type

```tsx
ComponentType<CanvasProps>
```

## Examples

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">

```tsx
class App extends Components {
  render () {
    return (
      <Canvas style='width: 300px; height: 200px;' canvasId='canvas' />
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <canvas style="width: 300px; height: 200px;" canvas-id="canvas" />
</template>
```
  
</TabItem>
</Tabs>

## CanvasProps

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The type of the canvas. Only webGL is supported.</td>
    </tr>
    <tr>
      <td>canvasId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The unique identifier of the canvas component. This property can be ignored if a type is specified.</td>
    </tr>
    <tr>
      <td>disableScroll</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Disables screen scrolling and swipe-down-to-refresh features when the a finger taps to move on the canvas and a gesture event is bound.</td>
    </tr>
    <tr>
      <td>onTouchStart</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Finger touch starts</td>
    </tr>
    <tr>
      <td>onTouchMove</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Finger moves after touch</td>
    </tr>
    <tr>
      <td>onTouchEnd</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Finger touch ends</td>
    </tr>
    <tr>
      <td>onTouchCancel</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Finger touch is interrupted by call reminder, pop-up window, etc.</td>
    </tr>
    <tr>
      <td>onLongTap</td>
      <td><code>BaseEventOrigFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when a finger taps and holds on the screen for 500 ms. After this event is triggered, moving on the screen does not trigger screen scrolling.</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>BaseEventOrigFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggers the error event when an error occurs. {`detail = {errMsg: 'something wrong'}`}</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | H5 | React Native |
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
      <th>Property</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
    </tr>
  </tbody>
</table>

## API Support

| Property | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Canvas | ✔️ |  |  |
