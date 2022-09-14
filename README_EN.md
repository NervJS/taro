<div align="center">
  <h1>Taro</h1>
  <p>An cross-platform and -framework solution for easily developing applications across mini-programs, Web, APP, etc.</p>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
  </a>
  <a href="https://www.npmjs.com/package/@tarojs/cli">
    <img src="https://img.shields.io/node/v/@tarojs/cli.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/@tarojs/taro">
    <img src="https://img.shields.io/npm/v/@tarojs/taro.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/@tarojs/taro">
    <img src="https://img.shields.io/npm/l/@tarojs/taro.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/@tarojs/taro">
    <img src="https://img.shields.io/npm/dt/@tarojs/taro.svg?style=flat-square">
  </a>
  <a href="https://travis-ci.org/NervJS/taro">
    <img src="https://img.shields.io/travis/NervJS/taro.svg?style=flat-square">
  </a>
  <a href="https://github.com/NervJS/taro">
    <img src="https://img.shields.io/github/contributors/NervJS/taro" alt="GitHub contributors">
  </a>
  <a href="https://github.com/NervJS/taro">
    <img src="https://img.shields.io/github/commit-activity/w/NervJS/taro" alt="GitHub commit activity">
  </a>
  <a href="https://github.com/NervJS/taro">
    <img src="https://img.shields.io/github/issues-closed/NervJS/taro" alt="GitHub closed issues">
  </a>
  <a href="https://github.com/NervJS/taro">
    <img src="https://img.shields.io/github/commits-since/NervJS/taro/latest/next" alt="GitHub commits since latest release (by date)">
  </a>
  <a href="https://github.com/NervJS/taro">
    <img src="https://img.shields.io/github/release-date/NervJS/taro" alt="GitHub Release Date">
  </a>
</div>

[简体中文](./README.md) | [English](./README_EN.md)

> 👽 Taro['tɑ:roʊ], Ultraman Taro, the chief instructor of the Space Guard, the strongest Ultraman.

## Contents

1. [Introduction](#Introduction)
2. [Resources](#Resources)
3. [Community](#Community)
4. [Cases](#Cases)
5. [Feature](#Feature)
6. [Join us](#join-us)
7. [Issues](#Issues)
8. [Acknowledgements](#Acknowledgements)
9. [Contributors](#Contributors)
10. [Milestones](#Milestones)
11. [Release Notes](#release-notes)
12. [Communication](#Communication)

## Introduction

**Taro** is an open style cross-platform and -framework solution that supports users to develop WeChat/JD/Baidu/Alipay/ByteDance/QQ mini-programs/H5 and React Native applications with React/Vue/Nerv and other frameworks. Nowdays, there are various types of mini-programs on the market. Multiple platforms such as Web, React Native, and WeChat mini-programs are widely used by the developers. Different codes are written while we require to show features on different platforms. The ability to be compatible with multiple platforms within one code is extremely needed.

### Version

To migrate from Taro 1/2 to Taro 3, please refer to [The definitive guide to Taro version upgrades](https://taro-docs.jd.com/taro/blog/2020-09-01-taro-versions).

## Resources

[5 Minute Tutorial](https://taro-docs.jd.com/taro/docs/guide)

[Awesome-taro](https://github.com/NervJS/awesome-taro)

Juejin book: [Taro Cross-platform Development in Action](https://juejin.im/book/5b73a131f265da28065fb1cd?referrer=5ba228f16fb9a05d3251492d)

## Community

[Taro market](http://taro-ext.jd.com/)


### UI Library

|  Name   | Link  | Intro | Framework  | Taro Version |
|  ----  | ----  | ----  | ----  | ----  |
| [taro-ui](https://github.com/NervJS/taro-ui)  | https://taro-ui.jd.com/#/ | A cross-platform UI library based on Taro | React | Taro 1/2/3 (Alpha-version needed for Taro 3） |
| [NutUI](https://github.com/jdf2e/nutui)  | https://nutui.jd.com/#/ | A JD-style light-weighted Vue library | Vue3 | Taro 3 |
| [taroify](https://github.com/mallfoundry/taroify)  | https://taroify.gitee.io/taroify.com/introduce/ | A light-weighted and reliable Taro library for mini-programs (Vant's Taro version) | React | Taro 3 |
| [@antmjs/vantui](https://github.com/AntmJS/vantui)  | https://antmjs.github.io/vantui/#/home | A UI library that supports Taro and React, based on Youzan VantWeapp | React | Taro 3 |


## Cases

Taro has been used in our production environment, and widely used in the industry for cross-platform development.

<a href="https://nervjs.github.io/taro-user-cases/"><img src="https://raw.githubusercontent.com/NervJS/taro-user-cases/master/user-cases.jpg" /></a>

[Call for more cases](https://github.com/NervJS/taro/issues/244)

## Feature

### Framework support

#### React/Nerv

Taro 3 has full-featured development experience with React/Nerv, please refer to [Basic tutorial for React](https://nervjs.github.io/taro/docs/react).

Example:

```javascript
import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'

export default class Index extends Component {
  state = {
    msg: 'Hello World！ '
  }
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>{this.state.msg}</Text>
      </View>
    )
  }
}
```

#### Vue

Taro 3 has full-featured development experience with Vue, please refer to [Basic tutorial for Vue](https://nervjs.github.io/taro/docs/vue).

Example:

```vue
<template>
  <view class="index">
    <text>{{msg}}</text>
  </view>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello World!'
    }
  },
  created () {},
  onShow () {},
  onHide () {}
}
</script>
```

### Cross-platform support

Taro's ultimate goal is to provide a solution for cross-platform development.

Taro supports converting code to WeChat/JD/Baidu/Alipay/ByteDance/QQ mini-programs and H5 applications.

## Join us

#### Taro community

[Welcome to the Taro community](https://github.com/NervJS/taro/issues/4714)

#### Contribute to Taro

You are very welcome to contribute your code for Taro, before submitting your code, please read [CONTRIBUTING](https://nervjs.github.io/taro/docs/CONTRIBUTING.html).

If you want to implement a feature for Taro, you need to write an RFC document first. Follow the [RFC](https://github.com/NervJS/taro-rfcs) and submit your code after the discussion in the community.

## Issues

[Report issues to Taro](https://nervjs.github.io/taro-issue-helper/)

> Highly recommend reading these books before reporting issues [*How to Ask Questions The Smart Way*(Chinese)](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way), [*How to Ask Questions in an open-source community*](https://github.com/seajs/seajs/issues/545), [*How to Report Bugs Effectively*](https://www.chiark.greenend.org.uk/~sgtatham/bugs.html), [*How to Ask Bad Questions to Open Source Projects*(Chinese)](https://zhuanlan.zhihu.com/p/25795393). Good questions can be answered quickly.

[![Let's fund issues in this repository](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/repos/128624453)

## Acknowledgements

[![nanjingboy](https://avatars1.githubusercontent.com/u/1390888?s=100&v=4)](https://github.com/nanjingboy/) | [![jsNewbee](https://avatars3.githubusercontent.com/u/20449400?s=100&v=4)](https://github.com/js-newbee/) | [![Qiyu8](https://avatars2.githubusercontent.com/u/15245051?s=100&v=4)](https://github.com/Qiyu8/) | [![Garfield550](https://avatars2.githubusercontent.com/u/3471836?s=100&v=4)](https://github.com/Garfield550/)
:---:|:---:|:---:|:---:
[nanjingboy](https://github.com/nanjingboy/) | [jsNewbee](https://github.com/js-newbee/) |  [Qiyu8](https://github.com/Qiyu8/) |  [Garfield Lee](https://github.com/Garfield550/)

## Contributors

<a href="https://github.com/NervJS/taro/graphs/contributors"><img src="https://opencollective.com/taro/contributors.svg?width=890&button=false" /></a>

## Milestones

[Milestones](https://github.com/NervJS/taro/milestones)

## Release Notes

Taro follows [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153), please read [Release Notes](https://github.com/NervJS/taro/releases).

## Communication

[Official Wechat group](https://github.com/NervJS/taro/issues/198)

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
