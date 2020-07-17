---
title: Taro.canvasPutImageData(option, component)
sidebar_label: canvasPutImageData
---

将像素数据绘制到画布。在自定义组件下，第二个参数传入自定义组件实例 this，以操作组件内 <canvas> 组件

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasPutImageData.html)

## 类型

```tsx
(option: Option, component?: Record<string, any>) => Promise<CallbackResult>
```

## 参数

### Option

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>canvasId</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>画布标识，传入 <a href="https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html">canvas</a> 组件的 canvas-id 属性。</td>
    </tr>
    <tr>
      <td>data</td>
      <td><code>Uint8ClampedArray</code></td>
      <td style="text-align:center">是</td>
      <td>图像像素点数据，一维数组，每四项表示一个像素点的 rgba</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>源图像数据矩形区域的高度</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>源图像数据矩形区域的宽度</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>源图像数据在目标画布中的位置偏移量（x 轴方向的偏移量）</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>源图像数据在目标画布中的位置偏移量（y 轴方向的偏移量）</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

## 示例代码

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

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.canvasPutImageData | ✔️ | ✔️ |  |
