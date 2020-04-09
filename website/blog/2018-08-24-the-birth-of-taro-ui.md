---
title: 首个多端 UI 组件库 - Taro UI 发布
author:jimczj
authorURL: https://github.com/jimczj
authorImageURL: https://avatars3.githubusercontent.com/u/13499146?s=460&u=a5a6d4c6bcc746b3b6353c245346d7a832f4649b&v=4
---

![image](https://misc.aotu.io/jimczj/2018-08-27taro-ui.jpg)

[Taro](https://github.com/NervJS/taro) 是由凹凸实验室倾力打造的多端开发解决方案，旨在让一套代码在多端运行。为了进一步丰富 Taro 的开发生态，让开发者有更好的开发体验和更快的开发速度，凹凸实验室自主设计了一套 UI 组件库，经过两个多月的精雕细琢，终于跟随 Taro 1.0 版本正式发布。

<!--truncate-->

## Taro UI
Taro UI 是一款由凹凸实验室打造、基于 Taro 编写的多端 UI 组件库。除了高颜值，Taro UI 最大的亮点就是支持多端运行。Taro UI 借助 Taro 支持多端运行的特点，只需解决不同平台 CSS 的表现差异问题，就可以在微信小程序/ H5 / ReactNative 等多端适配运行。

**Github**：https://github.com/NervJS/taro-ui

**文档**：https://taro-ui.aotu.io/

**H5 版本预览**： 

![image](https://user-images.githubusercontent.com/13499146/44632148-8a054080-a9a8-11e8-85a8-dfafd073dfdf.png)


**微信小程序预览**：

![image](https://user-images.githubusercontent.com/13499146/44643836-8e5f4700-aa04-11e8-87bd-d930eb04e87c.png)


第一版组件共有六个模块、三十三个组件，未来还将继续丰富组件，增加一些常用业务组件。

![image](https://user-images.githubusercontent.com/13499146/44502719-6d75b980-a6c5-11e8-8491-b6b47d87ee3d.png)

## 特性
- **简单易用**：支持 npm 安装，自动处理 npm 资源之间的依赖关系
- **框架支持**：基于 Taro 开发组件，与 Taro 无缝衔接
- **多端适配**：一套组件可以在微信小程序/ H5 / ReactNative 等多端适配运行
- **样式美观**：小明哥([AT-UI](https://github.com/at-ui/at-ui) 设计者、主程)亲自设计，细节把关，符合现代扁平化设计审美
- **组件丰富**：提供丰富的基础组件，覆盖大部分使用场景，满足各种功能需求
- **按需引用**：可按需使用独立的组件，不必引入所有文件，可最小化注入到项目中
- **多套主题**：内置多套主题颜色，任君选择（将在 1.1 版本开放此特性）

## 快速开始

### 安装 Taro
安装 Taro 开发工具 @tarojs/cli

使用 npm 或者 yarn 全局安装，或者直接使用 [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)

```bash
$ npm install -g @tarojs/cli
$ yarn global add @tarojs/cli
```

### 初始化项目

使用命令创建模板项目
```bash
$ taro init myApp
```
### 安装 Taro UI

```bash
$ cd myApp
$ npm i taro-ui
```

### 使用
在代码中 `import` 组件并按照文档说明进行使用

`import { AtButton } from 'taro-ui'`

### 示例
在 `/myApp/src/pages/index/index.jsx` 文件添加以下代码
```jsx
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './index.scss'

export default class Index extends Component {
  config: Config = {
    navigationBarTitleText: '首页'
  }
  render () {
    return (
      <View className='index'>
         <AtButton type='primary'>按钮文案</AtButton>
      </View>
    )
  }
}

```

### 编译并预览

进入项目目录开始开发，可以选择小程序预览模式，或者 H5 预览模式，若使用微信小程序预览模式，则需要自行下载并打开微信开发者工具，选择预览项目根目录。

**微信小程序编译预览模式**

```bash
# npm script
$ npm run dev:weapp
# 仅限全局安装
$ taro build --type weapp --watch
# npx用户也可以使用
$ npx taro build --type weapp --watch
```

**H5编译预览模式**

```bash
# npm script
$ npm run dev:h5
# 仅限全局安装
$ taro build --type h5 --watch
# npx用户也可以使用
$ npx taro build --type h5 --watch
```

## 意见反馈
如果有任何的意见或者建议，欢迎在 [Github](https://github.com/NervJS/taro-ui) 创建 issue，感谢你的支持和贡献。
