---
title: Text
sidebar_label: Text
---

Text.

> [Reference](https://developers.weixin.qq.com/miniprogram/en/dev/component/text.html)

## Type

```tsx
ComponentType<TextProps>
```

## Examples

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="React"
  values={[
    {label: 'React', value: 'React'},
    {label: 'Vue', value: 'Vue'}
  ]}>
<TabItem value="React">

```tsx
export default class PageView extends Component {
  state = {
    contents: [],
    contentsLen: 0
  }

  add = () => {
    this.setState(prev => {
      const cot = prev.contents.slice()
      cot.push({ text: 'hello world' })
      return {
        contents: cot,
        contentsLen: cot.length
      }
    })
  }

  remove = () => {
    this.setState(prev => {
      const cot = prev.contents.slice()
      cot.pop()
      return {
        contents: cot,
        contentsLen: cot.length
      }
    })
  }

  render () {
    return (
      <View className='container'>
        {this.state.contents.map((item, index) => (
          <Text key={index}>{item.text}</Text>
        ))}
        <Button className='btn-max-w button_style' plain type='default' onClick={this.add}>add line</Button>
        <Button className='btn-max-w button_style' plain type='default' disabled={this.state.contentsLen ? false : true} onClick={this.remove}>remove line</Button>
      </View>
    )
  }
}
```
</TabItem>

<TabItem value="Vue">

``` html
<template>
  <view class="container">
    <view v-for="(item, index) in contents">
      <text>{{item.text}} line {{index + 1}}</text>
    </view>
    <button class="btn-max-w button_style" :plain="true" type="default" @tap="add">add line</button>
    <button class="btn-max-w button_style" :plain="true" type="default" :disabled="contentsLen ? false : true" @tap="remove">remove line</button>
</template>

<script>
export default {
  data() {
    return {
      contents: [],
      contentsLen: 0
    }
  },
  methods: {
    add () {
      const cot = this.contents.slice()
      cot.push({ text: 'hello world' })
      this.contents = cot
      this.contentsLen = cot.length
    },

    remove () {
      const cot = this.contents.slice()
      cot.pop()
      this.contents = cot
      this.contentsLen = cot.length
    }
  }
}
</script>
```
</TabItem>
</Tabs>

## TextProps

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
      <td>selectable</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether the text is selectable</td>
    </tr>
    <tr>
      <td>space</td>
      <td><code>&quot;ensp&quot; | &quot;emsp&quot; | &quot;nbsp&quot;</code></td>
      <td style={{ textAlign: "center"}}></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Displays consecutive spaces</td>
    </tr>
    <tr>
      <td>decode</td>
      <td><code>boolean</code></td>
      <td style={{ textAlign: "center"}}><code>false</code></td>
      <td style={{ textAlign: "center"}}>No</td>
      <td>Specifies whether to decode component</td>
    </tr>
  </tbody>
</table>

### Property Support

| Property | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| TextProps.selectable | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| TextProps.space | ✔️ | ✔️ |  | ✔️ |  |  |
| TextProps.decode | ✔️ |  |  | ✔️ |  |  |

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

## API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Micro-App | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Text | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
