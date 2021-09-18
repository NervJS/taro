---
title: SelectorQuery
sidebar_label: SelectorQuery
---

The object for querying the node information

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/SelectorQuery.html)

## Methods

### exec

Executes all requests. The request results form an array in the order of the requests and are returned in the first callback parameter.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/SelectorQuery.exec.html)

```tsx
(callback?: (...args: any[]) => any) => NodesRef
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
      <td><code>(...args: any[]) =&gt; any</code></td>
      <td>Callback function</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| SelectorQuery.exec | ✔️ | ✔️ |  |

### select

Selects the first node in the current page that matches the selector `selector`. A `NodesRef` object instance is returned to obtain the node information.

**selector Syntax**

The selector is similar to the CSS selector, but only supports the following syntax.

- ID selector:#the-id
- class selector (more than one class selector can be specified in succession): .a-class.another-class
- Child selector: .the-parent > .the-child
- Descendant selector: .the-ancestor .the-descendant
- Descendant selector across custom components: .the-ancestor >>> .the-descendant
- Union of multiple selectors: #a-node, .some-other-nodes

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/SelectorQuery.select.html)

```tsx
(selector: string) => NodesRef
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
      <td>selector</td>
      <td><code>string</code></td>
      <td>Selector</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
Taro.createSelectorQuery().select('#the-id').fields({
  dataset: true,
  size: true,
  scrollOffset: true,
  properties: ['scrollX', 'scrollY']
}, function (res){
  res.dataset
  res.width
  res.height
  res.scrollLeft
  res.scrollTop
  res.scrollX
  res.scrollY
}).exec()
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| SelectorQuery.select | ✔️ | ✔️ |  |

### selectAll

Selects all nodes that match the selector "selector" in the current page.

**selector Syntax**

The selector is similar to the CSS selector, but only supports the following syntax.

- ID selector:#the-id
- class selector (more than one class selector can be specified in succession): .a-class.another-class
- Child selector: .the-parent > .the-child
- Descendant selector: .the-ancestor .the-descendant
- Descendant selector across custom components: .the-ancestor >>> .the-descendant
- Union of multiple selectors: #a-node, .some-other-nodes

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/SelectorQuery.selectAll.html)

```tsx
(selector: string) => NodesRef
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
      <td>selector</td>
      <td><code>string</code></td>
      <td>Selector</td>
    </tr>
  </tbody>
</table>

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| SelectorQuery.selectAll | ✔️ | ✔️ |  |

### selectViewport

Selects the display area. It can be used to get the display area size, scroll position, etc.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/SelectorQuery.selectViewport.html)

```tsx
() => NodesRef
```

#### Sample Code

```tsx
Taro.createSelectorQuery().selectViewport().scrollOffset(function (res) {
  res.id
  res.dataset
  res.scrollLeft
  res.scrollTop
}).exec()
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| SelectorQuery.selectViewport | ✔️ | ✔️ |  |

### in

Changes the selector's selection range to the nodes within the custom component `component`. (Initially, the selector only selects nodes within the page and does not select any nodes in the custom component.)

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/api/wxml/SelectorQuery.in.html)

```tsx
(component: Record<string, any>) => SelectorQuery
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
      <td>component</td>
      <td><code>Record&lt;string, any&gt;</code></td>
      <td>Custom component instance</td>
    </tr>
  </tbody>
</table>

#### Sample Code

```tsx
Component({
  queryMultipleNodes () {
    const query = Taro.createSelectorQuery().in(this)
    query.select('#the-id').boundingClientRect(function(res){
      res.top // The upper boundary coordinate of the #the-id node within this component
    }).exec()
  }
})
```

#### API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| SelectorQuery.in | ✔️ | ✔️ |  |

## API Support

| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| SelectorQuery.exec | ✔️ | ✔️ |  |
| SelectorQuery.select | ✔️ | ✔️ |  |
| SelectorQuery.selectAll | ✔️ | ✔️ |  |
| SelectorQuery.selectViewport | ✔️ | ✔️ |  |
| SelectorQuery.in | ✔️ | ✔️ |  |
