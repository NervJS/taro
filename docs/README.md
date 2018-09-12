---
title: Taro 介绍
---

## 简介

**Taro** 是一套遵循 [React](https://reactjs.org/) 语法规范的 **多端开发** 解决方案。现如今市面上端的形态多种多样，Web、React-Native、微信小程序等各种端大行其道，当业务要求同时在不同的端都要求有所表现的时候，针对不同的端去编写多套代码的成本显然非常高，这时候只编写一套代码就能够适配到多端的能力就显得极为需要。

使用 **Taro**，我们可以只书写一套代码，再通过 **Taro** 的编译工具，将源代码分别编译出可以在不同端（微信小程序、H5、RN等）运行的代码。

## 特性

#### React 语法风格

**Taro** 遵循 [React](https://reactjs.org/) 语法规范，它采用与 React 一致的组件化思想，组件生命周期与 React 保持一致，同时支持使用 JSX 语法，让代码具有更丰富的表现力，使用 **Taro** 进行开发可以获得和 React 一致的开发体验。

代码示例

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

export default class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      title: '首页',
      list: [1, 2, 3]
    }
  }
  
  componentWillMount () {}
  
  componentDidMount () {}
  
  componentWillUpdate (nextProps, nextState) {}
  
  componentDidUpdate (prevProps, prevState) {}
 
  shouldComponentUpdate (nextProps, nextState) {
    return true
  }

  add = (e) => {
    // dosth
  }

  render () {
    return (
      <View className='index'>
        <View className='title'>{this.state.title}</View>
        <View className='content'>
          {this.state.list.map(item => {
            return (
              <View className='item'>{item}</View>
            )
          })}
          <Button className='add' onClick={this.add}>添加</Button>
        </View>
      </View>
    )
  }
}
```

#### 快速开发微信小程序

Taro 立足于微信小程序开发，众所周知小程序的开发体验并不是非常友好，比如小程序中无法使用 npm 来进行第三方库的管理，无法使用一些比较新的ES规范等等，针对小程序端的开发弊端，Taro 具有以下的优秀特性

✅ 支持使用 npm/yarn 安装管理第三方依赖

✅ 支持使用 ES7/ES8 甚至更新的ES规范，一切都可自行配置

✅ 支持使用 CSS 预编译器，例如 Sass 等

✅ 支持使用 Redux进行状态管理

✅ 小程序API优化，异步API Promise化等等

#### 支持多端开发转化

Taro 方案的初心就是为了打造一个多端开发的解决方案。目前 Taro 代码可以支持转换到 **微信小程序** 以及 **H5端**。

<div align="center"><img src="http://ww1.sinaimg.cn/large/49320207gy1fr21yeoexvj20hw0tu0vg.jpg" width="320"/><br><span style="font-size: 12px; color: #999;">微信小程序</span></div>

<div align="center"><img src="http://ww1.sinaimg.cn/large/49320207gy1fr226kdgeyj20i40wcgmv.jpg" width="320"/><br><span style="font-size: 12px; color: #999;">H5端</span></div>
