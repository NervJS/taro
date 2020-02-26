---
title: NodesRef
sidebar_label: NodesRef
---

用于获取 `WXML` 节点信息的对象

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.html)

## 方法

### boundingClientRect

添加节点的布局位置的查询请求。相对于显示区域，以像素为单位。其功能类似于 DOM 的 `getBoundingClientRect`。返回 `NodesRef` 对应的 `SelectorQuery`。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.boundingClientRect.html)

```tsx
(callback?: BoundingClientRectCallback) => SelectorQuery
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `BoundingClientRectCallback` | 回调函数，在执行 `SelectorQuery.exec` 方法后，节点信息会在 `callback` 中返回。 |

#### 示例代码

##### 示例 1

```tsx
Taro.createSelectorQuery().select('#the-id').boundingClientRect(function(rect){
  rect.id      // 节点的ID
  rect.dataset // 节点的dataset
  rect.left    // 节点的左边界坐标
  rect.right   // 节点的右边界坐标
  rect.top     // 节点的上边界坐标
  rect.bottom  // 节点的下边界坐标
  rect.width   // 节点的宽度
  rect.height  // 节点的高度
}).exec()

##### 示例 2

```
```tsx
Taro.createSelectorQuery().selectAll('.a-class').boundingClientRect(function(rects){
  rects.forEach(function(rect){
    rect.id      // 节点的ID
    rect.dataset // 节点的dataset
    rect.left    // 节点的左边界坐标
    rect.right   // 节点的右边界坐标
    rect.top     // 节点的上边界坐标
    rect.bottom  // 节点的下边界坐标
    rect.width   // 节点的宽度
    rect.height  // 节点的高度
  })
}).exec()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.boundingClientRect | ✔️ | ✔️ |  |

### context

添加节点的 Context 对象查询请求。目前支持 [VideoContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.html)、[CanvasContext](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.html)、[LivePlayerContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/live/LivePlayerContext.html)、[EditorContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.html)和 [MapContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/map/MapContext.html) 的获取。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.context.html)

```tsx
(callback?: ContextCallback) => SelectorQuery
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `ContextCallback` | 回调函数，在执行 `SelectorQuery.exec` 方法后，返回节点信息。 |

#### 示例代码

```tsx
Taro.createSelectorQuery().select('.the-video-class').context(function (res) {
  console.log(res.context) // 节点对应的 Context 对象。如：选中的节点是 <video> 组件，那么此处即返回 VideoContext 对象
}).exec()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.context | ✔️ |  |  |

### fields

获取节点的相关信息。需要获取的字段在fields中指定。返回值是 `nodesRef` 对应的 `selectorQuery`

**注意**
computedStyle 的优先级高于 size，当同时在 computedStyle 里指定了 width/height 和传入了 size: true，则优先返回 computedStyle 获取到的 width/height。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.fields.html)

```tsx
(fields: Fields, callback?: FieldsCallback) => SelectorQuery
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| fields | `Fields` |  |
| callback | `FieldsCallback` | 回调函数 |

#### 示例代码

```tsx
Taro.createSelectorQuery().select('#the-id').fields({
  dataset: true,
  size: true,
  scrollOffset: true,
  properties: ['scrollX', 'scrollY'],
  computedStyle: ['margin', 'backgroundColor'],
  context: true,
}, function (res) {
  res.dataset    // 节点的dataset
  res.width      // 节点的宽度
  res.height     // 节点的高度
  res.scrollLeft // 节点的水平滚动位置
  res.scrollTop  // 节点的竖直滚动位置
  res.scrollX    // 节点 scroll-x 属性的当前值
  res.scrollY    // 节点 scroll-y 属性的当前值
  // 此处返回指定要返回的样式名
  res.margin
  res.backgroundColor
  res.context    // 节点对应的 Context 对象
}).exec()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.fields | ✔️ | ✔️ |  |

### node

获取 Node 节点实例。目前支持 [Canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) 的获取。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.node.html)

```tsx
(callback?: NodeCallback) => SelectorQuery
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `NodeCallback` | 回调函数，在执行 `SelectorQuery.exec` 方法后，返回节点信息。 |

#### 示例代码

```tsx
Taro.createSelectorQuery().select('.canvas').node(function(res){
  console.log(res.node) // 节点对应的 Canvas 实例。
}).exec()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.node | ✔️ |  |  |

### scrollOffset

添加节点的滚动位置查询请求。以像素为单位。节点必须是 `scroll-view` 或者 `viewport`，返回 `NodesRef` 对应的 `SelectorQuery`。

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/NodesRef.scrollOffset.html)

```tsx
(callback?: ScrollOffsetCallback) => SelectorQuery
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| callback | `ScrollOffsetCallback` | 回调函数，在执行 `SelectorQuery.exec` 方法后，节点信息会在 `callback` 中返回。 |

#### 示例代码

```tsx
Taro.createSelectorQuery().selectViewport().scrollOffset(function(res){
  res.id      // 节点的ID
  res.dataset // 节点的dataset
  res.scrollLeft // 节点的水平滚动位置
  res.scrollTop  // 节点的竖直滚动位置
}).exec()
```

#### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.scrollOffset | ✔️ | ✔️ |  |

## 参数

### BoundingClientRectCallback

回调函数，在执行 `SelectorQuery.exec` 方法后，节点信息会在 `callback` 中返回。

```tsx
(result: BoundingClientRectCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `BoundingClientRectCallbackResult` |

### BoundingClientRectCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| bottom | `number` | 节点的下边界坐标 |
| dataset | `Record<string, any>` | 节点的 dataset |
| height | `number` | 节点的高度 |
| id | `string` | 节点的 ID |
| left | `number` | 节点的左边界坐标 |
| right | `number` | 节点的右边界坐标 |
| top | `number` | 节点的上边界坐标 |
| width | `number` | 节点的宽度 |

### ContextCallback

回调函数，在执行 `SelectorQuery.exec` 方法后，返回节点信息。

```tsx
(result: ContextCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `ContextCallbackResult` |

### ContextCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| context | `Record<string, any>` | 节点对应的 Context 对象 |

### Fields

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | :---: | --- |
| computedStyle | `string[]` | 否 | 指定样式名列表，返回节点对应样式名的当前值 |
| context | `boolean` | 否 | 是否返回节点对应的 Context 对象 |
| dataset | `boolean` | 否 | 是否返回节点 dataset |
| id | `boolean` | 否 | 是否返回节点 id |
| mark | `boolean` | 否 | 是否返回节点 mark |
| node | `boolean` | 否 | 是否返回节点对应的 Node 实例 |
| properties | `string[]` | 否 | 指定属性名列表，返回节点对应属性名的当前属性值（只能获得组件文档中标注的常规属性值，id class style 和事件绑定的属性值不可获取） |
| rect | `boolean` | 否 | 是否返回节点布局位置（`left` `right` `top` `bottom`） |
| scrollOffset | `boolean` | 否 | 否 是否返回节点的 `scrollLeft` `scrollTop`，节点必须是 `scroll-view` 或者 `viewport` |
| size | `boolean` | 否 | 是否返回节点尺寸（`width` `height`） |

### FieldsCallback

回调函数

```tsx
(res: Record<string, any>) => void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| res | `Record<string, any>` | 节点的相关信息 |

### NodeCallback

回调函数，在执行 `SelectorQuery.exec` 方法后，返回节点信息。

```tsx
(result: NodeCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `NodeCallbackResult` |

### NodeCallbackResult

回调函数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| node | `Record<string, any>` | 节点对应的 Node 实例 |

### ScrollOffsetCallback

回调函数，在执行 `SelectorQuery.exec` 方法后，节点信息会在 `callback` 中返回。

```tsx
(result: ScrollOffsetCallbackResult) => void
```

| 参数 | 类型 |
| --- | --- |
| result | `ScrollOffsetCallbackResult` |

### ScrollOffsetCallbackResult

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| dataset | `Record<string, any>` | 节点的 dataset |
| id | `string` | 节点的 ID |
| scrollLeft | `number` | 节点的水平滚动位置 |
| scrollTop | `number` | 节点的竖直滚动位置 |

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.boundingClientRect | ✔️ | ✔️ |  |
| NodesRef.context | ✔️ |  |  |
| NodesRef.fields | ✔️ | ✔️ |  |
| NodesRef.node | ✔️ |  |  |
| NodesRef.scrollOffset | ✔️ | ✔️ |  |
