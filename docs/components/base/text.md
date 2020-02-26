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

| 参数 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | :---: | :---: | --- |
| selectable | `boolean` | `false` | 否 | 文本是否可选 |
| space | "ensp" or "emsp" or "nbsp" |  | 否 | 显示连续空格 |
| decode | `boolean` | `false` | 否 | 是否解码 |

### API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| TextProps.selectable | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| TextProps.space | ✔️ | ✔️ |  | ✔️ |  |  |
| TextProps.decode | ✔️ |  |  | ✔️ |  |  |

### TSpace

space 的合法值

| 参数 | 说明 |
| --- | --- |
| ensp | 中文字符空格一半大小 |
| emsp | 中文字符空格大小 |
| nbsp | 根据字体设置的空格大小 |

## API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 字节跳动小程序 | H5 | React Native |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Text | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
