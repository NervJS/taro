---
title: Text
sidebar_label: Text
---

文本

> [参考文档](https://developers.weixin.qq.com/miniprogram/dev/component/text.html)

## 类型

```tsx
ComponentType<TextProps>
```

## 示例代码

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

## TextProps

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
      <td>selectable</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>文本是否可选</td>
    </tr>
    <tr>
      <td>space</td>
      <td><code>&quot;ensp&quot; | &quot;emsp&quot; | &quot;nbsp&quot;</code></td>
      <td style="text-align:center"></td>
      <td style="text-align:center">否</td>
      <td>显示连续空格</td>
    </tr>
    <tr>
      <td>decode</td>
      <td><code>boolean</code></td>
      <td style="text-align:center"><code>false</code></td>
      <td style="text-align:center">否</td>
      <td>是否解码</td>
    </tr>
  </tbody>
</table>

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| TextProps.selectable | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| TextProps.space | ✔️ | ✔️ |  | ✔️ |  |  |
| TextProps.decode | ✔️ |  |  | ✔️ |  |  |

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

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Text | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
