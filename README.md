# Taro

[![](https://img.shields.io/node/v/@tarojs/cli.svg?style=flat-square)](https://www.npmjs.com/package/@tarojs/cli)
[![](https://img.shields.io/npm/v/@tarojs/taro.svg?style=flat-square)](https://www.npmjs.com/package/@tarojs/taro)
[![](https://img.shields.io/npm/l/@tarojs/taro.svg?style=flat-square)](https://www.npmjs.com/package/@tarojs/taro)
[![](https://img.shields.io/npm/dt/@tarojs/taro.svg?style=flat-square)](https://www.npmjs.com/package/@tarojs/taro)
[![](https://img.shields.io/travis/nervjs/taro/master?style=flat-square)](https://travis-ci.org/NervJS/taro)

> 👽 Taro['tɑ:roʊ]，泰罗·奥特曼，宇宙警备队总教官，实力最强的奥特曼。

## 简介

**Taro** 是一套遵循 [React](https://reactjs.org/) 语法规范的 **多端开发** 解决方案。现如今市面上端的形态多种多样，Web、React-Native、微信小程序等各种端大行其道，当业务同时在不同的端都要求有所表现的时候，针对不同的端编写多套代码的成本显然非常高，这时只编写一套代码就能适配到多端的能力就显得极为重要。

使用 **Taro**，我们只需书写一套代码，再通过 **Taro** 的编译工具，即可将源代码分别编译出在不同端（微信/百度/支付宝/字节跳动小程序、快应用、H5、React-Native 等）运行的代码。

## 学习资源

[awesome-taro](https://github.com/NervJS/awesome-taro)

掘金小册：[Taro 多端开发实现原理与实战](https://juejin.im/book/5b73a131f265da28065fb1cd?referrer=5ba228f16fb9a05d3251492d)

## 加入社区共建

[Taro 邀你加入社区共建](https://github.com/NervJS/taro/issues/4714)

## 社区共享

[Taro 交流社区——让每一次交流都被沉淀](http://taro-club.jd.com/)

[Taro 物料市场——让每一个轮子产生价值](http://taro-ext.jd.com/)

## 使用案例

Taro 已经投入了我们的生产环境中使用，业界也在广泛地使用 Taro 开发多端应用。

<a href="https://nervjs.github.io/taro-user-cases/"><img src="https://raw.githubusercontent.com/NervJS/taro-user-cases/master/user-cases.jpg" /></a>

[征集更多优秀案例](https://github.com/NervJS/taro/issues/244)

## Taro 特性

#### React 语法风格

Taro 的语法规则基于 React 规范，它采用与 React 一致的组件化思想，组件生命周期与 React 保持一致，同时在书写体验上也尽量与 React 类似，支持使用 JSX 语法，让代码具有更丰富的表现力。

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

Taro 立足于微信小程序开发，众所周知小程序的开发体验并不是非常友好，比如小程序中无法使用 npm 来进行第三方库的管理，无法使用一些比较新的 ES 规范等等，针对小程序端的开发弊端，Taro 具有以下的优秀特性：

✅ 支持使用 npm/yarn 安装管理第三方依赖。

✅ 支持使用 ES7/ES8 甚至更加新的 ES 规范，一切都可自行配置。

✅ 支持使用 CSS 预编译器，例如 Sass 等。

✅ 支持使用 Redux 进行状态管理。

✅ 支持使用 Mobx 进行状态管理。

✅ 小程序 API 优化，异步 API Promise 化等等。

#### 支持多端开发转化

Taro 方案的初心就是为了打造一个多端开发的解决方案。目前 Taro 代码可以支持转换到 **微信/百度/支付宝/字节跳动小程序** 、**快应用**、 **H5 端** 以及 **移动端（React-Native）**。

<div align="center"><img src="https://storage.360buyimg.com/taro-resource/platforms.jpg?v=1"/></div>

## 更多功能
如果你还想 Taro 支持新的特性，请使用 [FeatHub](https://feathub.com/NervJS/taro) 进行投票，我们将综合考虑投票结果等因素来确定开发的优先级。

[![Feature Requests](https://cloud.githubusercontent.com/assets/390379/10127973/045b3a96-6560-11e5-9b20-31a2032956b2.png)](http://feathub.com/NervJS/taro)

[![Feature Requests](http://feathub.com/NervJS/taro?format=svg)](http://feathub.com/NervJS/taro)

## 🤝 参与共建 [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

请参考[贡献指南](https://nervjs.github.io/taro/docs/CONTRIBUTING.html).

> 强烈推荐阅读 [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)、[《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545) 和 [《如何有效地报告 Bug》](http://www.chiark.greenend.org.uk/%7Esgtatham/bugs-cn.html)、[《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)，更好的问题更容易获得帮助。

[![Let's fund issues in this repository](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/repos/128624453)

## 特别鸣谢

[![nanjingboy](https://avatars1.githubusercontent.com/u/1390888?s=100&v=4)](https://github.com/nanjingboy/) | [![jsNewbee](https://avatars3.githubusercontent.com/u/20449400?s=100&v=4)](https://github.com/js-newbee/) | [![Qiyu8](https://avatars2.githubusercontent.com/u/15245051?s=100&v=4)](https://github.com/Qiyu8/)
:---:|:---:|:---:
[nanjingboy](https://github.com/nanjingboy/) | [jsNewbee](https://github.com/js-newbee/) |  [Qiyu8](https://github.com/Qiyu8/)

## 贡献者们

<a href="https://github.com/NervJS/taro/graphs/contributors"><img src="https://opencollective.com/taro/contributors.svg?width=890&button=false" /></a>

## 开发计划

[开发计划](./PLANS.md)

## 更新日志

本项目遵从 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)，更新日志由 `conventional-changelog` 自动生成。完整日志请点击 [CHANGELOG.md](./CHANGELOG.md)。

## 开发交流

[官方交流微信群](https://github.com/NervJS/taro/issues/198)

## License

MIT License

Copyright (c) O2Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
