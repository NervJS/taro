---
title: Taro.canvasPutImageData(option, component)
sidebar_label: canvasPutImageData
---

Draws pixel data to the canvas. In a custom component, the "this" of the custom component instance is passed as the second parameter to operate on the `canvas` component in this component.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/wx.canvasPutImageData.html)

## Type

```tsx
(option: Option, component?: Record<string, any>) => Promise<CallbackResult>
```

## Parameters

### Option

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>canvasId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The canvas ID, which is the canvas-id property passed into the <code>canvas</code> component.</td>
    </tr>
    <tr>
      <td>data</td>
      <td><code>Uint8ClampedArray</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The image pixel data, which is a one-dimensional array in which every four items express the RGBA color of one pixel.</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The height of the rectangular area of the source image.</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The width of the rectangular area of the source image.</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The position offset (x-axis offset) of the source image data on the destination canvas.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The position offset (y-axis offset) of the source image data on the destination canvas.</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function used when the API call completed (always executed whether the call succeeds or fails)</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: any) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a failed API call</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: Result) =&gt; void</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The callback function for a successful API call</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
const data = new Uint8ClampedArray([255, 0, 0, 1])
Taro.canvasPutImageData({
  canvasId: 'myCanvas',
  x: 0,
  y: 0,
  width: 1,
  data: data,
  success: function (res) {}
})
```

## API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.canvasPutImageData | ✔️ | ✔️ |  |
