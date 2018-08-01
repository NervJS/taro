# 使用微信小程序第三方组件

Taro 支持使用使用微信小程序的第三方组件，例如 [echarts-for-weixin](https://github.com/ecomfe/echarts-for-weixin)，使用方式也异常的简单。

首先需要将第三方组件库下载到项目的 `src` 目录下，随后在页面或者组件里通过配置 `usingComponents` 指定需要引用的第三方组件即可

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

export default class Menu extends Component {
  static defaultProps = {
    data: []
  }

  config = {
    // 定义需要引入的第三方组件
    usingComponents: {
      'ec-canvas': '../../components/ec-canvas/ec-canvas' // 书写第三方组件的相对路径
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: props.checked
    }
  }

  componentWillMount () {
    console.log(this) // this -> 组件 Menu 的实例
  }

  render () {
    return <View />
  }
}
```
