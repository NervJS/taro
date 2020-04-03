---
title: IntersectionObserver
sidebar_label: IntersectionObserver
---

`IntersectionObserver` 对象，用于推断某些节点是否可以被用户看见、有多大比例可以被用户看见。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.html)

## 方法

### disconnect

停止监听。回调函数将不再触发

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.disconnect.html)

```tsx
() => void
```

### observe

指定目标节点并开始监听相交状态变化情况

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.observe.html)

```tsx
(targetSelector: string, callback: ObserveCallback) => void
```

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
      <td>targetSelector</td>
      <td><code>string</code></td>
      <td>选择器</td>
    </tr>
    <tr>
      <td>callback</td>
      <td><code>ObserveCallback</code></td>
      <td>监听相交状态变化的回调函数</td>
    </tr>
  </tbody>
</table>

### relativeTo

使用选择器指定一个节点，作为参照区域之一。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.relativeTo.html)

```tsx
(selector: string, margins?: RelativeToMargins) => IntersectionObserver
```

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
      <td>selector</td>
      <td><code>string</code></td>
      <td>选择器</td>
    </tr>
    <tr>
      <td>margins</td>
      <td><code>RelativeToMargins</code></td>
      <td>用来扩展（或收缩）参照节点布局区域的边界</td>
    </tr>
  </tbody>
</table>

### relativeToViewport

指定页面显示区域作为参照区域之一

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.relativeToViewport.html)

```tsx
(margins?: RelativeToViewportMargins) => IntersectionObserver
```

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
      <td>margins</td>
      <td><code>RelativeToViewportMargins</code></td>
      <td>用来扩展（或收缩）参照节点布局区域的边界</td>
    </tr>
  </tbody>
</table>

#### 示例代码

下面的示例代码中，如果目标节点（用选择器 .target-class 指定）进入显示区域以下 100px 时，就会触发回调函数。

```tsx
Taro.createIntersectionObserver().relativeToViewport({bottom: 100}).observe('.target-class', (res) => {
  res.intersectionRatio // 相交区域占目标节点的布局区域的比例
  res.intersectionRect // 相交区域
  res.intersectionRect.left // 相交区域的左边界坐标
  res.intersectionRect.top // 相交区域的上边界坐标
  res.intersectionRect.width // 相交区域的宽度
  res.intersectionRect.height // 相交区域的高度
})
```

## 参数

### ObserveCallback

监听相交状态变化的回调函数

```tsx
(result: ObserveCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>result</td>
      <td><code>ObserveCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### ObserveCallbackResult

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
      <td>boundingClientRect</td>
      <td><code>BoundingClientRectResult</code></td>
      <td>目标边界</td>
    </tr>
    <tr>
      <td>intersectionRatio</td>
      <td><code>number</code></td>
      <td>相交比例</td>
    </tr>
    <tr>
      <td>intersectionRect</td>
      <td><code>IntersectionRectResult</code></td>
      <td>相交区域的边界</td>
    </tr>
    <tr>
      <td>relativeRect</td>
      <td><code>RelativeRectResult</code></td>
      <td>参照区域的边界</td>
    </tr>
    <tr>
      <td>time</td>
      <td><code>number</code></td>
      <td>相交检测时的时间戳</td>
    </tr>
  </tbody>
</table>

### RelativeRectResult

参照区域的边界

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
      <td>bottom</td>
      <td><code>number</code></td>
      <td>下边界</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td>左边界</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td>右边界</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td>上边界</td>
    </tr>
  </tbody>
</table>

### IntersectionRectResult

相交区域的边界

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
      <td>bottom</td>
      <td><code>number</code></td>
      <td>下边界</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>高度</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td>左边界</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td>右边界</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td>上边界</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>宽度</td>
    </tr>
  </tbody>
</table>

### BoundingClientRectResult

目标边界

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
      <td>bottom</td>
      <td><code>number</code></td>
      <td>下边界</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>高度</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td>左边界</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td>右边界</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td>上边界</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>宽度</td>
    </tr>
  </tbody>
</table>

### RelativeToMargins

用来扩展（或收缩）参照节点布局区域的边界

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
      <td>bottom</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>节点布局区域的下边界</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>节点布局区域的左边界</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>节点布局区域的右边界</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>节点布局区域的上边界</td>
    </tr>
  </tbody>
</table>

### RelativeToViewportMargins

用来扩展（或收缩）参照节点布局区域的边界

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
      <td>bottom</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>节点布局区域的下边界</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>节点布局区域的左边界</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>节点布局区域的右边界</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td style="text-align:center">否</td>
      <td>节点布局区域的上边界</td>
    </tr>
  </tbody>
</table>
