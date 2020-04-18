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
      <td>callback</td>
      <td><code>BoundingClientRectCallback</code></td>
      <td>回调函数，在执行 <code>SelectorQuery.exec</code> 方法后，节点信息会在 <code>callback</code> 中返回。</td>
    </tr>
  </tbody>
</table>

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
      <td>callback</td>
      <td><code>ContextCallback</code></td>
      <td>回调函数，在执行 <code>SelectorQuery.exec</code> 方法后，返回节点信息。</td>
    </tr>
  </tbody>
</table>

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
      <td>fields</td>
      <td><code>Fields</code></td>
      <td></td>
    </tr>
    <tr>
      <td>callback</td>
      <td><code>FieldsCallback</code></td>
      <td>回调函数</td>
    </tr>
  </tbody>
</table>

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
      <td>callback</td>
      <td><code>NodeCallback</code></td>
      <td>回调函数，在执行 <code>SelectorQuery.exec</code> 方法后，返回节点信息。</td>
    </tr>
  </tbody>
</table>

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
      <td>callback</td>
      <td><code>ScrollOffsetCallback</code></td>
      <td>回调函数，在执行 <code>SelectorQuery.exec</code> 方法后，节点信息会在 <code>callback</code> 中返回。</td>
    </tr>
  </tbody>
</table>

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
      <td><code>BoundingClientRectCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### BoundingClientRectCallbackResult

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
      <td>节点的下边界坐标</td>
    </tr>
    <tr>
      <td>dataset</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>节点的 dataset</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>节点的高度</td>
    </tr>
    <tr>
      <td>id</td>
      <td><code>string</code></td>
      <td>节点的 ID</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td>节点的左边界坐标</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td>节点的右边界坐标</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td>节点的上边界坐标</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>节点的宽度</td>
    </tr>
  </tbody>
</table>

### ContextCallback

回调函数，在执行 `SelectorQuery.exec` 方法后，返回节点信息。

```tsx
(result: ContextCallbackResult) => void
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
      <td><code>ContextCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### ContextCallbackResult

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
      <td>context</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>节点对应的 Context 对象</td>
    </tr>
  </tbody>
</table>

### Fields

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
      <td>computedStyle</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">否</td>
      <td>指定样式名列表，返回节点对应样式名的当前值</td>
    </tr>
    <tr>
      <td>context</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否返回节点对应的 Context 对象</td>
    </tr>
    <tr>
      <td>dataset</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否返回节点 dataset</td>
    </tr>
    <tr>
      <td>id</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否返回节点 id</td>
    </tr>
    <tr>
      <td>mark</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否返回节点 mark</td>
    </tr>
    <tr>
      <td>node</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否返回节点对应的 Node 实例</td>
    </tr>
    <tr>
      <td>properties</td>
      <td><code>string[]</code></td>
      <td style="text-align:center">否</td>
      <td>指定属性名列表，返回节点对应属性名的当前属性值（只能获得组件文档中标注的常规属性值，id class style 和事件绑定的属性值不可获取）</td>
    </tr>
    <tr>
      <td>rect</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否返回节点布局位置（<code>left</code> <code>right</code> <code>top</code> <code>bottom</code>）</td>
    </tr>
    <tr>
      <td>scrollOffset</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>否 是否返回节点的 <code>scrollLeft</code> <code>scrollTop</code>，节点必须是 <code>scroll-view</code> 或者 <code>viewport</code></td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>boolean</code></td>
      <td style="text-align:center">否</td>
      <td>是否返回节点尺寸（<code>width</code> <code>height</code>）</td>
    </tr>
  </tbody>
</table>

### FieldsCallback

回调函数

```tsx
(res: Record<string, any>) => void
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
      <td>res</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>节点的相关信息</td>
    </tr>
  </tbody>
</table>

### NodeCallback

回调函数，在执行 `SelectorQuery.exec` 方法后，返回节点信息。

```tsx
(result: NodeCallbackResult) => void
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
      <td><code>NodeCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### NodeCallbackResult

回调函数

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
      <td>node</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>节点对应的 Node 实例</td>
    </tr>
  </tbody>
</table>

### ScrollOffsetCallback

回调函数，在执行 `SelectorQuery.exec` 方法后，节点信息会在 `callback` 中返回。

```tsx
(result: ScrollOffsetCallbackResult) => void
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
      <td><code>ScrollOffsetCallbackResult</code></td>
    </tr>
  </tbody>
</table>

### ScrollOffsetCallbackResult

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
      <td>dataset</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>节点的 dataset</td>
    </tr>
    <tr>
      <td>id</td>
      <td><code>string</code></td>
      <td>节点的 ID</td>
    </tr>
    <tr>
      <td>scrollLeft</td>
      <td><code>number</code></td>
      <td>节点的水平滚动位置</td>
    </tr>
    <tr>
      <td>scrollTop</td>
      <td><code>number</code></td>
      <td>节点的竖直滚动位置</td>
    </tr>
  </tbody>
</table>

## API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.boundingClientRect | ✔️ | ✔️ |  |
| NodesRef.context | ✔️ |  |  |
| NodesRef.fields | ✔️ | ✔️ |  |
| NodesRef.node | ✔️ |  |  |
| NodesRef.scrollOffset | ✔️ | ✔️ |  |
