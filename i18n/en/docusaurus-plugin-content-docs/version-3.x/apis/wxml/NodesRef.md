---
title: NodesRef
sidebar_label: NodesRef
---

The object for obtaining the `WXML` node information.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/NodesRef.html)

## Methods

### boundingClientRect

Adds the request for querying the node layout position (in pixels) relative to the display area. This feature is similar to `getBoundingClientRect` of DOM. It returns `SelectorQuery` of `NodesRef`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/NodesRef.boundingClientRect.html)

```tsx
(callback?: BoundingClientRectCallback) => SelectorQuery
```

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
      <td>callback</td>
      <td><code>BoundingClientRectCallback</code></td>
      <td>The callback function. After the <code>SelectorQuery.exec</code> method is executed, the node information will be returned in<code>callback</code>.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

##### Example 1

```tsx
Taro.createSelectorQuery().select('#the-id').boundingClientRect(function(rect){
  rect.id      // The ID of the node
  rect.dataset // The dataset of the node
  rect.left    // The left boundary coordinate of the node
  rect.right   // The right boundary coordinate of the node
  rect.top     // The upper boundary coordinate of the node
  rect.bottom  // The lower boundary coordinate of the node
  rect.width   // The width of the node
  rect.height  // The height of the node
}).exec()
```

##### Example 2

```tsx
Taro.createSelectorQuery().selectAll('.a-class').boundingClientRect(function(rects){
  rects.forEach(function(rect){
    rect.id      // The ID of the node
    rect.dataset // The dataset of the node
    rect.left    // The left boundary coordinate of the node
    rect.right   // The right boundary coordinate of the node
    rect.top     // The upper boundary coordinate of the node
    rect.bottom  // The lower boundary coordinate of the node
    rect.width   // The width of the node
    rect.height  // The height of the node
  })
}).exec()
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.boundingClientRect | ✔️ | ✔️ |  |

### context

Adds the request for querying the node Context object. [VideoContext](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/video/VideoContext.html), [CanvasContext](https://developers.weixin.qq.com/miniprogram/en/dev/api/canvas/CanvasContext.html), [LivePlayerContext](https://developers.weixin.qq.com/miniprogram/en/dev/api/media/live/LivePlayerContext.html), and [MapContext](https://developers.weixin.qq.com/miniprogram/en/dev/api/map/MapContext.html) can be obtained.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/NodesRef.context.html)

```tsx
(callback?: ContextCallback) => SelectorQuery
```

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
      <td>callback</td>
      <td><code>ContextCallback</code></td>
      <td>The callback function. After the <code>SelectorQuery.exec</code> method is executed, the node information will be returned.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
Taro.createSelectorQuery().select('.the-video-class').context(function (res) {
  console.log(res.context) // The Context object of the node. If the selected node is a <video> component, the VideoContext object is returned.
}).exec()
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.context | ✔️ |  |  |

### fields

Obtains the information about the node. The fields to be obtained are specified in fields. The `selectorQuery` of `nodesRef` is returned.

**Note**
computedStyle has a higher priority than size. When width/height is specified and "size: true" is passed in computedStyle, the width/height obtained by computedStyle is returned first.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/NodesRef.fields.html)

```tsx
(fields: Fields, callback?: FieldsCallback) => SelectorQuery
```

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
      <td>fields</td>
      <td><code>Fields</code></td>
      <td></td>
    </tr>
    <tr>
      <td>callback</td>
      <td><code>FieldsCallback</code></td>
      <td>Callback function</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
Taro.createSelectorQuery().select('#the-id').fields({
  dataset: true,
  size: true,
  scrollOffset: true,
  properties: ['scrollX', 'scrollY'],
  computedStyle: ['margin', 'backgroundColor'],
  context: true,
}, function (res) {
  res.dataset    // The dataset of the node
  res.width      // The width of the node
  res.height     // The height of the node
  res.scrollLeft // The horizontal scroll position of the node
  res.scrollTop  // The vertical scroll position of the node
  res.scrollX    // The current value of the node's scroll-x property
  res.scrollY    // The current value of the node's scroll-y property
  // Return the specified style name
  res.margin
  res.backgroundColor
  res.context    // The Context object of the node
}).exec()
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.fields | ✔️ | ✔️ |  |

### node

Gets the Node node instance. Currently [Canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) is supported for fetching.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/NodesRef.node.html)

```tsx
(callback?: NodeCallback) => SelectorQuery
```

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
      <td>callback</td>
      <td><code>NodeCallback</code></td>
      <td>The callback function. After the <code>SelectorQuery.exec</code> method is executed, the node information will be returned in callback.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
Taro.createSelectorQuery().select('.canvas').node(function(res){
  console.log(res.node)
}).exec()
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.node | ✔️ |  |  |

### scrollOffset

Adds the request for querying the node scroll position (in pixels). The node must be `scroll-view` or `viewport`. It returns `SelectorQuery` of `NodesRef`.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/NodesRef.scrollOffset.html)

```tsx
(callback?: ScrollOffsetCallback) => SelectorQuery
```

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
      <td>callback</td>
      <td><code>ScrollOffsetCallback</code></td>
      <td>The callback function. After the <code>SelectorQuery.exec</code> method is executed, the node information will be returned in callback.</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
Taro.createSelectorQuery().selectViewport().scrollOffset(function(res){
  res.id      // The id of the node
  res.dataset // The dataset of the node
  res.scrollLeft // The horizontal scroll position of the node
  res.scrollTop  // The vertical scroll position of the node
}).exec()
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.scrollOffset | ✔️ | ✔️ |  |

## Parameters

### BoundingClientRectCallback

The callback function. After the `SelectorQuery.exec` method is executed, the node information will be returned in callback.

```tsx
(result: BoundingClientRectCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dataset</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The dataset of the node</td>
    </tr>
    <tr>
      <td>id</td>
      <td><code>string</code></td>
      <td>The ID of the node</td>
    </tr>
    <tr>
      <td>bottom</td>
      <td><code>number</code></td>
      <td>The lower boundary coordinate of the node</td>
    </tr>
    <tr>
      <td>left</td>
      <td><code>number</code></td>
      <td>The left boundary coordinate of the node</td>
    </tr>
    <tr>
      <td>right</td>
      <td><code>number</code></td>
      <td>The right boundary coordinate of the node</td>
    </tr>
    <tr>
      <td>top</td>
      <td><code>number</code></td>
      <td>The upper boundary coordinate of the node</td>
    </tr>
    <tr>
      <td>height</td>
      <td><code>number</code></td>
      <td>The height of the node</td>
    </tr>
    <tr>
      <td>width</td>
      <td><code>number</code></td>
      <td>The width of the node</td>
    </tr>
  </tbody>
</table>

### ContextCallback

The callback function. After the `SelectorQuery.exec` method is executed, the node information will be returned.

```tsx
(result: ContextCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>context</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The Context object of the node</td>
    </tr>
  </tbody>
</table>

### Fields

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
      <td>computedStyle</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the style name list and returns the current value of the node style name</td>
    </tr>
    <tr>
      <td>context</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to return the Context object of the node</td>
    </tr>
    <tr>
      <td>dataset</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to return the node dataset</td>
    </tr>
    <tr>
      <td>id</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to return the node ID</td>
    </tr>
    <tr>
      <td>mark</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to return the node mark</td>
    </tr>
    <tr>
      <td>node</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to return the Node instance corresponding to the node.</td>
    </tr>
    <tr>
      <td>properties</td>
      <td><code>string[]</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies the property name list and returns the current property value of the node property name (only the general property values listed in the component document can be obtained, and "id class style" and the property values bound to events cannot be obtained)</td>
    </tr>
    <tr>
      <td>rect</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to return the node layout position (<code>left</code> <code>right</code> <code>top</code> <code>bottom</code>)</td>
    </tr>
    <tr>
      <td>scrollOffset</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to return the node's <code>scrollLeft</code> and <code>scrollTop</code>. The node must be <code>scroll-view</code> or <code>viewport</code>.</td>
    </tr>
    <tr>
      <td>size</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Indicates whether to return the node size (<code>width</code> and <code>height</code>)</td>
    </tr>
  </tbody>
</table>

### FieldsCallback

```tsx
(res: Record<string, any>) => void
```

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
      <td>res</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>Information about nodes</td>
    </tr>
  </tbody>
</table>

### NodeCallback

The callback function. After the `SelectorQuery.exec` method is executed, the node information will be returned.

```tsx
(result: NodeCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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
      <td>node</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>Node instances corresponding to nodes</td>
    </tr>
  </tbody>
</table>

### ScrollOffsetCallback

The callback function. After the `SelectorQuery.exec` method is executed, the node information will be returned in callback.

```tsx
(result: ScrollOffsetCallbackResult) => void
```

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
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
      <th>Property</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dataset</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>The dataset of the node</td>
    </tr>
    <tr>
      <td>id</td>
      <td><code>string</code></td>
      <td>The ID of the node</td>
    </tr>
    <tr>
      <td>scrollLeft</td>
      <td><code>number</code></td>
      <td>The horizontal scroll position of the node</td>
    </tr>
    <tr>
      <td>scrollTop</td>
      <td><code>number</code></td>
      <td>The vertical scroll position of the node</td>
    </tr>
  </tbody>
</table>

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| NodesRef.boundingClientRect | ✔️ | ✔️ |  |
| NodesRef.context | ✔️ |  |  |
| NodesRef.fields | ✔️ | ✔️ |  |
| NodesRef.node | ✔️ |  |  |
| NodesRef.scrollOffset | ✔️ | ✔️ |  |
