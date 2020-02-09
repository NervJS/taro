---
title: IntersectionObserver
sidebar_label: IntersectionObserver
id: version-1.3.37-IntersectionObserver
original_id: IntersectionObserver
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

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| targetSelector | `string` | 选择器 |
| callback | `ObserveCallback` | 监听相交状态变化的回调函数 |

### relativeTo

使用选择器指定一个节点，作为参照区域之一。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.relativeTo.html)

```tsx
(selector: string, margins?: RelativeToMargins) => IntersectionObserver
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| selector | `string` | 选择器 |
| margins | `RelativeToMargins` | 用来扩展（或收缩）参照节点布局区域的边界 |

### relativeToViewport

指定页面显示区域作为参照区域之一

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/IntersectionObserver.relativeToViewport.html)

```tsx
(margins?: RelativeToViewportMargins) => IntersectionObserver
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| margins | `RelativeToViewportMargins` | 用来扩展（或收缩）参照节点布局区域的边界 |

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

| 参数 | 类型 |
| --- | --- |
| result | `ObserveCallbackResult` |

### ObserveCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| boundingClientRect | `BoundingClientRectResult` | 目标边界 |
| intersectionRatio | `number` | 相交比例 |
| intersectionRect | `IntersectionRectResult` | 相交区域的边界 |
| relativeRect | `RelativeRectResult` | 参照区域的边界 |
| time | `number` | 相交检测时的时间戳 |

### RelativeRectResult

参照区域的边界

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| bottom | `number` | 下边界 |
| left | `number` | 左边界 |
| right | `number` | 右边界 |
| top | `number` | 上边界 |

### IntersectionRectResult

相交区域的边界

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| bottom | `number` | 下边界 |
| height | `number` | 高度 |
| left | `number` | 左边界 |
| right | `number` | 右边界 |
| top | `number` | 上边界 |
| width | `number` | 宽度 |

### BoundingClientRectResult

目标边界

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| bottom | `number` | 下边界 |
| height | `number` | 高度 |
| left | `number` | 左边界 |
| right | `number` | 右边界 |
| top | `number` | 上边界 |
| width | `number` | 宽度 |

### RelativeToMargins

用来扩展（或收缩）参照节点布局区域的边界

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| bottom | `number` | 否 | 节点布局区域的下边界 |
| left | `number` | 否 | 节点布局区域的左边界 |
| right | `number` | 否 | 节点布局区域的右边界 |
| top | `number` | 否 | 节点布局区域的上边界 |

### RelativeToViewportMargins

用来扩展（或收缩）参照节点布局区域的边界

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| bottom | `number` | 否 | 节点布局区域的下边界 |
| left | `number` | 否 | 节点布局区域的左边界 |
| right | `number` | 否 | 节点布局区域的右边界 |
| top | `number` | 否 | 节点布局区域的上边界 |
