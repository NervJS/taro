---
title: Text
sidebar_label: Text
---

##### 文本

> 属性

| 属性名 | 类型 | 默认值 | 说明 |
| :- | :- | :- | :- |
| selectable | Boolean | false  | 文本是否可选 |
| space      | Boolean | false  | 显示连续空格 |
| decode     | Boolean | false  | 是否解码     |

>各端支持度

| 属性 | 微信小程序 | H5 | ReactNative | 百度小程序 | 支付宝小程序 | 字节跳动小程序 |
| :-: | :-: | :-: | :- | :- | :- | :- |
| selectable | ✔ | ✔ |  ✔| ✔ | ✔ | ✔ |
| space | ✔ |  |  | ✔ |  | ✔ |
| decode | ✔ |  | ✔ |  |  | ✔ |


###### 示例：
```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class PageView extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      contents = []
    }
  }

  add = e => {
    const cot = this.state.contents
    cot.push({text: 'hello world'})

    this.setState(() => {
      return {contents: cot}
    })
  }

  remove = e => {
    const cot = this.state.contents
    cot.pop()
    this.setState(() => {
      return {contents: cot}
    })
  }

  render () {
    return (
      <View className='container'>
        {this.state.contents.map(item => {
          return (
            <Text>{item.text}</Text>
          )
        })}
        <Button className='btn-max-w button_style' plain type='default' onClick={this.add}>add line</Button>
        <Button className='btn-max-w button_style' plain type='default' disabled={this.state.contents.length ? false:true} onClick={this.remove}>remove line</Button>
      </View>
    )
  }
}
```
