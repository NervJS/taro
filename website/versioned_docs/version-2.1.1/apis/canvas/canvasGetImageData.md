---
title: Taro.canvasGetImageData(option, component)
sidebar_label: canvasGetImageData
id: version-2.1.1-canvasGetImageData
original_id: canvasGetImageData
---

获取 canvas 区域隐含的像素数据。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasGetImageData.html)

## 类型

```tsx
(option: Option, component?: Record<string, any>) => Promise<SuccessCallbackResult>
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
      <td>画布标识，传入 <a href="https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html">canvas</a> 组件的 <code>canvas-id</code> 属性。</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>将要被提取的图像数据矩形区域的高度</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>将要被提取的图像数据矩形区域的宽度</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>将要被提取的图像数据矩形区域的左上角横坐标</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td style="text-align:center">是</td>
      <td>将要被提取的图像数据矩形区域的左上角纵坐标</td>
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
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
  </tbody>
</table>

### SuccessCallbackResult

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>data</td>
      <td><code>Uint8ClampedArray</code></td>
      <td>图像像素点数据，一维数组，每四项表示一个像素点的 rgba</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>图像数据矩形的高度</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>图像数据矩形的宽度</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

## 示例代码

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

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.canvasGetImageData | ✔️ | ✔️ |  |
