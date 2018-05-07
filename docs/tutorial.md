# 教程

## Taro 项目目录结构

    ├── dist                   编译结果目录
    ├── config                 配置目录
    |   ├── dev.js             开发时配置
    |   ├── index.js           默认配置
    |   └── prod.js            打包时配置
    ├── src                    源码目录
    |   ├── pages              页面文件目录
    |   |   ├── index          index页面目录
    |   |   |   ├── index.js   index页面逻辑
    |   |   |   └── index.css  index页面样式
    |   ├── app.css            项目总通用样式
    |   └── app.js             项目入口文件
    └── package.json

## 入口文件

入口文件默认是 `src` 目录下的 `app.js`。

### 代码示例

一个普通的入口文件示例如下

```javascript
import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

class App extends Component {
  // 项目配置
  config = {
    pages: [
      'pages/index/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentWillMount () {}

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  render () {
    return (
      <Index />
    )
  }
}

```

可以看出入口文件也是 `React` 风格的写法，首先需要引用依赖 `@tarojs/taro`，这是 **Taro** 方案的基础框架，在这里我们继承了 `Component` 组件基类。

通常入口文件会包含一个 `config` 配置项，这里的配置主要参考微信小程序的[全局配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html)而来，在编译成小程序时，这一部分配置将会被抽离成 `app.json`，而编译成其他端，亦会有其他作用。

而且由于入口文件继承自 `Component` 组件基类，它同样拥有组件生命周期，但因为入口文件的特殊性，他的生命周期并不完整，组件生命周期具体请参考章节。

入口文件的 `render` 方法只要求返回程序的第一个页面。

## 页面

Taro 项目的页面一般都放在 `src` 中的 `pages` 目录下，如果页面包含 `js` 以及 `css`，建议页面以文件夹的形式进行组织，例如 `index` 页面包含 `index.js` 和 `index.scss`，则在 `pages` 目录下新建 `index` 目录。

### 指定页面

页面创建好后如果需要渲染展示，则需要在项目入口文件 `app.js` 中 `config` 的 `pages` 数组中进行指定，例如上面提到的 `index` 页面，需要如下进行配置，页面配置需要指定到页面具体的 `js` 文件，可以不带 `.js` 后缀

```javascript

...
class App extends Component {
  // 项目配置
  config = {
    pages: [
      'pages/index/index'
    ]
  }
  ...
}

```

### 代码示例

一个普通的页面文件示例如下

```javascript

import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmout () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View class='index'>
        <Text>1</Text>
      </View>
    )
  }
}

```
