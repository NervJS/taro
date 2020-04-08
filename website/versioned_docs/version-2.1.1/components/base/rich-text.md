---
title: RichText
sidebar_label: RichText
id: version-2.1.1-rich-text
original_id: rich-text
---

富文本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html)

## 类型

```tsx
ComponentType<RichTextProps>
```

## 示例代码

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

## RichTextProps

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
      <td>nodes</td>
      <td><code>Nodes</code></td>
      <td style="text-align:center">否</td>
      <td>节点列表/ HTML String</td>
    </tr>
    <tr>
      <td>space</td>
      <td><code>&quot;ensp&quot; | &quot;emsp&quot; | &quot;nbsp&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>显示连续空格</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: |
| RichTextProps.space | ✔️ |  |  |

### TSpace

space 的合法值

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ensp</td>
      <td>中文字符空格一半大小</td>
    </tr>
    <tr>
      <td>emsp</td>
      <td>中文字符空格大小</td>
    </tr>
    <tr>
      <td>nbsp</td>
      <td>根据字体设置的空格大小</td>
    </tr>
  </tbody>
</table>

### Text

文本节点

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">默认值</th>
      <th>说明</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td><code>&quot;text&quot;</code></td>
      <td style="text-align:center"></td>
      <td>文本类型</td>
      <td></td>
    </tr>
    <tr>
      <td>text</td>
      <td><code>string</code></td>
      <td style="text-align:center"><code>&quot;&quot;</code></td>
      <td>文本字符串</td>
      <td><code>支持 entities</code></td>
    </tr>
  </tbody>
</table>

### HTMLElement

元素节点，默认为元素节点
全局支持class和style属性，不支持 id 属性。

<table>
  <thead>
    <tr>
      <th>参数</th>
      <th>类型</th>
      <th style="text-align:center">必填</th>
      <th>说明</th>
      <th>备注</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>type</td>
      <td><code>&quot;node&quot;</code></td>
      <td style="text-align:center">否</td>
      <td>HTML 类型</td>
      <td></td>
    </tr>
    <tr>
      <td>name</td>
      <td><code>string</code></td>
      <td style="text-align:center">是</td>
      <td>标签名</td>
      <td><code>支持部分受信任的 HTML 节点</code></td>
    </tr>
    <tr>
      <td>attrs</td>
      <td><code>Object</code></td>
      <td style="text-align:center">否</td>
      <td>属性</td>
      <td><code>支持部分受信任的属性，遵循 Pascal 命名法</code></td>
    </tr>
    <tr>
      <td>children</td>
      <td><code>Nodes</code></td>
      <td style="text-align:center">否</td>
      <td>子节点列表</td>
      <td><code>结构和 nodes 一致</code></td>
    </tr>
  </tbody>
</table>

## Nodes

节点类型
> 现支持两种节点，通过type来区分，分别是元素节点和文本节点，默认是元素节点，在富文本区域里显示的HTML节点 元素节点：type = node*

### 类型

```tsx
(Text | HTMLElement)[] | string
```

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| RichText | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
