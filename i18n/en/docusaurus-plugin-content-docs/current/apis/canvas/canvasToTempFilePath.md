---
title: Taro.canvasToTempFilePath(option, component)
sidebar_label: canvasToTempFilePath
---

Exports the content of the specified area of the current canvas to generate an image of the specified size. This method is called in the `draw()` callback to ensure the image is exported successfully.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/wx.canvasToTempFilePath.html)

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
      <th style={{ textAlign: "center"}}>Default</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>canvas</td>
      <td><code>CanvasProps</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The canvas identifier, used when passing in <code>canvas</code> component instances (canvas type=&quot;2d&quot;)</td>
    </tr>
    <tr>
      <td>canvasId</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>The canvas ID, which is the canvas-id passed into the <code>canvas</code> component.</td>
    </tr>
    <tr>
      <td>quality</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The image quality. This is only valid for .jpg images. Value range: (0, 1]. Values not in the range are processed as 1.</td>
    </tr>
    <tr>
      <td>destHeight</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The height of the output image.</td>
    </tr>
    <tr>
      <td>destWidth</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The width of the output image.</td>
    </tr>
    <tr>
      <td>fileType</td>
      <td><code>&quot;jpg&quot; | &quot;png&quot;</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;png&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The type of the destination file.</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The height of the specified canvas area.</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The width of the specified canvas area.</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The x-coordinate of the top-left corner of the specified canvas area.</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The y-coordinate of the top-left the corner of the specified canvas area.</td>
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
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>The temporary path of the generated file</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>Call result</td>
    </tr>
  </tbody>
</table>

### fileType

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>jpg</td>
      <td>A .jpg image</td>
    </tr>
    <tr>
      <td>png</td>
      <td>A .png image</td>
    </tr>
  </tbody>
</table>

### CanvasProps

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
      <td><code>CommonEventFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Finger touch starts</td>
    </tr>
    <tr>
      <td>onTouchMove</td>
      <td><code>CommonEventFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Finger moves after touch</td>
    </tr>
    <tr>
      <td>onTouchEnd</td>
      <td><code>CommonEventFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Finger touch ends</td>
    </tr>
    <tr>
      <td>onTouchCancel</td>
      <td><code>CommonEventFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Finger touch is interrupted by call reminder, pop-up window, etc.</td>
    </tr>
    <tr>
      <td>onLongTap</td>
      <td><code>CommonEventFunction&lt;any&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggered when a finger taps and holds on the screen for 500 ms. After this event is triggered, moving on the screen does not trigger screen scrolling.</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>CommonEventFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Triggers the error event when an error occurs. detail = {`{errMsg}`}</td>
    </tr>
  </tbody>
</table>

#### onErrorEventDetail

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

## Sample Code

```tsx
Taro.canvasToTempFilePath({
  x: 100,
  y: 200,
  width: 50,
  height: 50,
  destWidth: 100,
  destHeight: 100,
  canvasId: 'myCanvas',
  success: function (res) {
    console.log(res.tempFilePath)
  }
})
```

## API Support

| API |  WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.canvasToTempFilePath | ✔️ | ✔️ |  |
