---
title: 项目说明
---

## 项目目录结构

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

而且由于入口文件继承自 `Component` 组件基类，它同样拥有组件生命周期，但因为入口文件的特殊性，他的生命周期并不完整，如下

| 生命周期方法 | 作用 | 说明 |
| - | - | - |
| componentWillMount | 程序被载入 | 在微信小程序中这一生命周期方法对应 app 的 `onLaunch` |
| componentDidMount | 程序被载入 | 在微信小程序中这一生命周期方法对应 app 的 `onLaunch`，在 `componentWillMount` 后执行 |
| componentDidShow | 程序展示出来 | 在微信小程序中这一生命周期方法对应 `onShow`，在H5中同样实现 |
| componentDidHide | 程序被隐藏 | 在微信小程序中这一生命周期方法对应 `onHide`，在H5中同样实现 |

> 微信小程序中 `onLaunch` 通常带有一个参数 `options`，在 Taro 中你可以在所有生命周期方法中通过 `this.$router.params` 访问到，在其他端也适用

入口文件需要包含一个 `render` 方法，一般返回程序的第一个页面，但值得注意的是不要在入口文件中的 `render` 方法里写逻辑及引用其他页面、组件，因为编译时 `render` 方法的内容会被直接替换掉，你的逻辑代码不会起作用。

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
      <View className='index'>
        <Text>1</Text>
      </View>
    )
  }
}

```

Taro 的页面同样是继承自 `Component` 组件基类，每一个页面都拥有自己配置 `config`，这个配置参考自微信小程序的[页面配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html)，在编译成小程序时，将会生成跟页面JS文件同名的 `json` 配置文件；在编译成 H5 时，`config` 配置中 `navigationBarTitleText` 将会被用来设置当前页面的标题。

页面的样式文件建议放在与页面JS的同级目录下，然后通过ES6规范 `import` 进行引入，支持使用 CSS 预编译处理器，目前提供了 `sass` 预编译插件 `@tarojs/plugin-sass`，需要自行在本地进行安装。

页面JS要求必须有一个 `render` 函数，函数返回 JSX 代码，具体 JSX 代码的写法请参考 [JSX章节](./jsx.md)。

由于页面JS也继承自 `Component` 组件基类，所以页面同样拥有生命周期，页面的生命周期方法如下：

| 生命周期方法 | 作用 | 说明 |
| - | - | - |
| componentWillMount | 页面被载入 | 在微信小程序中这一生命周期方法对应 `onLoad` |
| componentDidMount | 页面渲染完成 | 在微信小程序中这一生命周期方法对应 `onReady` |
| shouldComponentUpdate | 页面是否需要更新 |  |
| componentWillUpdate | 页面即将更新 |  |
| componentDidUpdate | 页面更新完毕 |  |
| componentWillUnmount | 页面退出 | 在微信小程序中这一生命周期方法对应 `onUnload` |
| componentDidShow | 页面展示出来 | 在微信小程序中这一生命周期方法对应 `onShow`，在H5中同样实现 |
| componentDidHide | 页面被隐藏 | 在微信小程序中这一生命周期方法对应 `onHide`，在H5中同样实现 |

> 微信小程序中 `onLoad` 通常带有一个参数 `options`，在 Taro 中你可以在所有生命周期方法中通过 `this.$router.params` 访问到，在其他端也适用

在小程序中，页面还有在一些专属的方法成员，如下

| 方法 | 作用 |
| - | - |
| onPullDownRefresh | 页面相关事件处理函数--监听用户下拉动作 |
| onReachBottom | 页面上拉触底事件的处理函数 |
| onShareAppMessage | 用户点击右上角转发 |
| onPageScroll | 页面滚动触发事件的处理函数 |
| onTabItemTap | 当前是 tab 页时，点击 tab 时触发 |

以上成员方案在 Taro 的页面中同样可以使用，书写同名方法即可，不过需要注意的，目前暂时只有微信小程序端支持这些方法，编译到H5端后这些方法均会失效。

## 组件

Taro 支持组件化开发，组件代码可以放在任意位置，不过建议放在 `src` 下的 `components` 目录中。一个组件通常包含组件 JS 文件以及组件样式文件，组织方式与页面类似。

### 代码示例

```javascript
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import './tab.scss'

class Tab extends Component {

  onNewTodo = () => {
    // dosth
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmout () { }

  componentWillReceiveProps () { }

  render () {
    return (
      <View className='tab'>
        tab
      </View>
    )
  }
}
```

组件的样式文件可以直接在组件中通过 `import` 语法进行引入。

Taro 的组件同样是继承自 `Component` 组件基类，与页面类似，组件也必须包含一个 `render` 函数，返回 JSX 代码。

与页面相比，组件没有自己的 `config`，同时组件的生命相比页面来说多了一个 `componentWillReceiveProps` ，表示当父组件（或页面）发生更新时将带动子组件进行更新时调用的方法。

> 具体生命周期的使用以及组件类的说明请查看[组件说明章节](./component.md)。
