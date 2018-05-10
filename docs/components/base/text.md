##### text
##### 文本。

|     | 属性       | 类型    | 默认值 | 说明         |
| --- | ---------- | ------- | ------ | ------------ |
| √   | selectable | Boolean | false  | 文本是否可选 |
|     | space      | Boolean | false  | 显示连续空格 |
|     | decode     | Boolean | false  | 是否解码     |

###### 示例：
```
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class PageView extends Component {
  constructor () {
    super(...arguments)

    this.contents = []
  }

  add = e => {
    const cot = this.contents
    cot.push({text: 'hello world'})

    this.setState(() => {
      return {contents: cot}
    })
  }

  remove = e => {
    const cot = this.contents
    cot.pop()
    this.setState(() => {
      return {contents: cot}
    })
  }

  render () {
    return (
      <View className="container">
              {this.contents.map(item => {
                return (
                  <Text>{item.text}</Text>
                )
              })}
              <Button className="btn-max-w button_style" plain type="default" onClick={this.add}>add line</Button>
              <Button className="btn-max-w button_style" plain type="default" disabled={this.contents.length ? false:true} onClick={this.remove}>remove line</Button>
      </View>
    )
  }
}
```