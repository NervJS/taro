---
title: Taro.canvasGetImageData(option, component)
sidebar_label: canvasGetImageData
---

Obtains the implied pixel data for the canvas area.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/wx.canvasGetImageData.html)

## Type

```tsx
(option: Option, component?: Record<string, any>) => Promise<SuccessCallbackResult>
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
      <td>height</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The height of the rectangular area containing the image data to be extracted.</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The width of the rectangular area containing the image data to be extracted.</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The x-coordinate of the top-left corner of the rectangular area containing the image data to be extracted.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The y-coordinate of the top-left corner of the rectangular area containing the image data to be extracted.</td>
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

### SuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><code>Uint8ClampedArray</code></td>
      <td>The image pixel data, which is a one-dimensional array in which every four items express the RGBA color of one pixel.</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>The height of the image data rectangle</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>The width of the image data rectangle</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

## Sample Code

```tsx
Taro.canvasGetImageData({
  canvasId: 'myCanvas',
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  success: function (res) {
    console.log(res.width) // 100
    console.log(res.height) // 100
    console.log(res.data instanceof Uint8ClampedArray) // true
    console.log(res.data.length) // 100 * 100 * 4
  }
})
```

## API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.canvasGetImageData | ✔️ | ✔️ |  |
