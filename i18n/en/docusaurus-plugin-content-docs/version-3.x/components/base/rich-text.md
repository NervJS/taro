---
title: RichText
sidebar_label: RichText
---

Rich text.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/rich-text.html)

## Type

```tsx
ComponentType<RichTextProps>
```

## Examples

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">

```tsx
class App extends Components {
  state = {
    nodes: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 60px; color: red;'
      },
      children: [{
        type: 'text',
        text: 'Hello World!'
      }]
    }]
  }
  render () {
    return (
      <RichText nodes={this.state.nodes} />
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

```html
<template>
  <view class="components-page">
    <rich-text :nodes="nodes"></rich-text>
  </view>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      nodes: [{
        name: 'div',
        attrs: {
          class: 'div_class',
          style: 'line-height: 60px; color: red;'
        },
        children: [{
          type: 'text',
          text: 'Hello World!'
        }]
      }]
    }
  },
  onReady () {
    console.log('onReady')
  }
}
</script>
```
  
</TabItem>
</Tabs>

## RichTextProps

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
      <td>nodes</td>
      <td><code>Nodes</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>The node list/HTML string</td>
    </tr>
    <tr>
      <td>space</td>
      <td><code>&quot;ensp&quot; | &quot;emsp&quot; | &quot;nbsp&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Displays consecutive spaces</td>
    </tr>
  </tbody>
</table>

### API Support
| API | WeChat Mini-Program | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RichTextProps.space | ✔️ |  |  |

### TSpace

Valid values of space

<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ensp</td>
      <td>En space</td>
    </tr>
    <tr>
      <td>emsp</td>
      <td>Em space</td>
    </tr>
    <tr>
      <td>nbsp</td>
      <td>The size of the space is set according to the font setting</td>
    </tr>
  </tbody>
</table>

### Text

text node

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Default</th>
      <th>Description</th>
      <th>Remarks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td><code>&quot;text&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td>Text type</td>
      <td></td>
    </tr>
    <tr>
      <td>text</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}><code>&quot;&quot;</code></td>
      <td>Text string</td>
      <td><code>support entities</code></td>
    </tr>
  </tbody>
</table>

### HTMLElement

element node(defaulted)

The class and style properties are supported globally. **The id property is not supported.**

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th style={{ textAlign: "center"}}>Required</th>
      <th>Description</th>
      <th>Remarks</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td><code>&quot;node&quot;</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>HTML type</td>
      <td></td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td style={{ textAlign: "center"}}>Yes</td>
      <td>Tag name</td>
      <td><code>Supports some trusted HTML nodes.</code></td>
    </tr>
    <tr>
      <td>attrs</td>
      <td><code>Object</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Property</td>
      <td><code>Supports some trusted properties. The name complies with the Pascal naming convention.</code></td>
    </tr>
    <tr>
      <td>children</td>
      <td><code>Nodes</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Child node list</td>
      <td><code>The structure of child nodes is the same as that of nodes.</code></td>
    </tr>
  </tbody>
</table>

## Nodes

node type

> Currently, two nodes are supported, which are distinguished according to the type: element node and text node. It is the element node by default. HTML nodes are displayed in the rich text area. Element node: type = node*

### Type

```tsx
(Text | HTMLElement)[] | string
```

## API Support
| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| RichText | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
