---
title: Taro.canvasToTempFilePath(option, component)
sidebar_label: canvasToTempFilePath
id: version-2.1.1-canvasToTempFilePath
original_id: canvasToTempFilePath
---

把当前画布指定区域的内容导出生成指定大小的图片。在 `draw()` 回调里调用该方法才能保证图片导出成功。

**Bug & Tip：**

1.  `tip`: 在 `draw` 回调里调用该方法才能保证图片导出成功。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasToTempFilePath.html)

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
      <th style="text-align:center">默认值</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>canvas</td>
      <td><code>CanvasProps</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>画布标识，传入 <a href="https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html">canvas</a> 组件实例 （canvas type=&quot;2d&quot; 时使用该属性）。</td>
    </tr>
    <tr>
      <td>canvasId</td>
      <td><code>string</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">是</td>
      <td>画布标识，传入 <a href="https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html">canvas</a> 组件的 canvas-id</td>
    </tr>
    <tr>
      <td>quality</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。</td>
    </tr>
    <tr>
      <td>complete</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>接口调用结束的回调函数（调用成功、失败都会执行）</td>
    </tr>
    <tr>
      <td>destHeight</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>输出的图片的高度</td>
    </tr>
    <tr>
      <td>destWidth</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>输出的图片的宽度</td>
    </tr>
    <tr>
      <td>fail</td>
      <td><code>(res: CallbackResult) =&gt; void</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>接口调用失败的回调函数</td>
    </tr>
    <tr>
      <td>fileType</td>
      <td><code>&quot;jpg&quot; | &quot;png&quot;</code></td>
      <td style="text-align:center"><code>&quot;png&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>目标文件的类型</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>指定的画布区域的高度</td>
    </tr>
    <tr>
      <td>success</td>
      <td><code>(result: SuccessCallbackResult) =&gt; void</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>接口调用成功的回调函数</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>指定的画布区域的宽度</td>
    </tr>
    <tr>
      <td>x</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>指定的画布区域的左上角横坐标</td>
    </tr>
    <tr>
      <td>y</td>
      <td><code>number</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>指定的画布区域的左上角纵坐标</td>
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
      <td>tempFilePath</td>
      <td><code>string</code></td>
      <td>生成文件的临时路径</td>
    </tr>
    <tr>
      <td>errMsg</td>
      <td><code>string</code></td>
      <td>调用结果</td>
    </tr>
  </tbody>
</table>

### fileType

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>jpg</td>
      <td>jpg 图片</td>
    </tr>
    <tr>
      <td>png</td>
      <td>png 图片</td>
    </tr>
  </tbody>
</table>

### CanvasProps

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
      <td><code>CommonEventFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>手指触摸动作开始</td>
    </tr>
    <tr>
      <td>onTouchMove</td>
      <td><code>CommonEventFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>手指触摸后移动</td>
    </tr>
    <tr>
      <td>onTouchEnd</td>
      <td><code>CommonEventFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>手指触摸动作结束</td>
    </tr>
    <tr>
      <td>onTouchCancel</td>
      <td><code>CommonEventFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>手指触摸动作被打断，如来电提醒，弹窗</td>
    </tr>
    <tr>
      <td>onLongTap</td>
      <td><code>CommonEventFunction&lt;any&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>手指长按 500ms 之后触发，触发了长按事件后进行移动不会触发屏幕的滚动</td>
    </tr>
    <tr>
      <td>onError</td>
      <td><code>CommonEventFunction&lt;onErrorEventDetail&gt;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>当发生错误时触发 error 事件，detail = {errMsg: 'something wrong'}</td>
    </tr>
  </tbody>
</table>

#### onErrorEventDetail

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

## 示例代码

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

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| Taro.canvasToTempFilePath | ✔️ | ✔️ |  |
