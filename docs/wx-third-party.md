---
title: 使用微信小程序第三方组件
---

Taro 支持使用使用微信小程序的第三方组件，例如 [echarts-for-weixin](https://github.com/ecomfe/echarts-for-weixin)，使用方式也异常的简单。

首先需要将第三方组件库下载到项目的 `src` 目录下，随后在页面或者组件里通过配置 `usingComponents` 指定需要引用的第三方组件即可，组件调用的时候需要按照 JSX 的使用规范来进行传参和事件绑定

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

function initChart () {
  // ....
}

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
      ec: {
        onInit: initChart
      }
    }
  }

  componentWillMount () {
    console.log(this) // this -> 组件 Menu 的实例
  }

  render () {
    return (
      <View>
        <ec-canvas id='mychart-dom-area' canvas-id='mychart-area' ec={this.state.ec}></ec-canvas>
      </View>
    )
  }
}
```
