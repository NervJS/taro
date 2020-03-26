---
title: 框架
id: version-1.3.39-tutorial
original_id: tutorial
---

## 项目目录结构

    ├── dist                   编译结果目录
    ├── config                 配置目录
    |   ├── dev.js             开发时配置
    |   ├── index.js           默认配置
    |   └── prod.js            打包时配置
    ├── src                    源码目录
    |   ├── pages              页面文件目录
    |   |   ├── index          index 页面目录
    |   |   |   ├── index.js   index 页面逻辑
    |   |   |   └── index.css  index 页面样式
    |   ├── app.css            项目总通用样式
    |   └── app.js             项目入口文件
    └── package.json

## 入口文件

入口文件默认是 `src` 目录下的 `app.js`。

### 代码示例

一个普通的入口文件示例如下

```jsx
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

### 全局配置

通常入口文件会包含一个 `config` 配置项，这个配置是整个应用的全局的配置，配置规范基于微信小程序的[全局配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE)进行制定，所有平台进行统一。

入口文件中的全局配置，在编译后将生成全局配置文件 `app.json`。

#### 配置项列表

Taro 中全局配置所包含的配置项及各端支持程度如下

| 属性 | 类型 | 必填 | 描述 | 微信小程序 | 百度小程序 | 字节跳动小程序 | 支付宝小程序 | H5 | RN
| - | - | - | - | - | - | - | - | - | - |
| [pages](#pages) | String Array | 是 | 页面路径列表 | ✔️ | ✔️|✔️|✔️|✔️|✔️|
| [window](#window) | Object | 否 | 全局的默认窗口表现 |具体支持程度见下方 |具体支持程度见下方|具体支持程度见下方|具体支持程度见下方|具体支持程度见下方|具体支持程度见下方|
| [tabBar](#tabbar) | Object | 否 | 底部 tab 栏的表现 | 具体支持程度见下方 |具体支持程度见下方|具体支持程度见下方|具体支持程度见下方|具体支持程度见下方|具体支持程度见下方|
| [networkTimeout](#networktimeout) | Object | 否 | 网络超时时间 | ✔️ | ✘ | ✘ | ✘ | ✘ | ✘ |
| [debug](#debug) | Boolean | 否 | 是否开启 debug 模式，默认关闭 | ✔️ | ✘ | ✔️ | ✘ | ✘ | ✘ |
| [functionalPages](#functionalpages) | Boolean | 否 | 是否启用插件功能页，默认关闭 | ✔️（基础库 2.1.0 以上） | ✘ | ✘ | ✘ | ✘ | ✘ |
| [subPackages](#subpackages) | Object Array | 否 | 分包结构配置 | ✔️（基础库 1.7.3 以上） | ✔️ | ✘ | ✘ | ✔️ | ✔️ |
| [workers](#workers) | String | 否 | Worker 代码放置的目录 | ✔️（基础库 1.9.90 以上） | ✘ | ✘ | ✘ | ✘ | ✘ |
| [requiredBackgroundModes](#requiredbackgroundmodes) | String Array | 否 | 需要在后台使用的能力，如「音乐播放」 | ✔️ | ✘ | ✘ | ✘ | ✘ | ✘ |
| [plugins](#plugins) | Object | 否 | 使用到的插件 | ✔️（基础库 1.9.6 以上） | ✘ | ✘ | ✘ | ✘ | ✘ |
| [preloadRule](#preloadrule) | Object | 否 | 分包预下载规则 | ✔️（基础库 2.3.0 以上） | ✔️ | ✘ | ✘ | ✘ | ✘ |
| [resizable](#resizable) | Boolean | 否 | iPad 小程序是否支持屏幕旋转，默认关闭 | ✔️（基础库 2.3.0 以上） | ✘ | ✘ | ✘ | ✘ | ✘ |
| [navigateToMiniProgramAppIdList](#navigatetominiprogramappidlist) | String Array | 否 | 需要跳转的小程序列表，详见 wx.navigateToMiniProgram | ✔️（基础库 2.4.0 以上） | ✘ | ✘ | ✘ | ✘ | ✘ |
| [usingComponents](#usingcomponents) | Object | 否 | 全局自定义组件配置 | ✔️（开发者工具 1.02.1810190） | ✘ | ✘ | ✘ | ✘ | ✘ |
| [permission](#permission) | Object | 否 | 小程序接口权限相关设置 | ✔️ 微信客户端 7.0.0 | ✘ | ✘ | ✘ | ✘ | ✘ |

#### pages

用于指定小程序由哪些页面组成，每一项都对应一个页面的 `路径 + 文件名` 信息。文件名不需要写文件后缀，框架会自动去寻找对应位置的文件进行处理。

**数组的第一项代表小程序的初始页面（首页）。小程序中新增/减少页面，都需要对 pages 数组进行修改。**

如开发目录为：

    ├── app.js
    ├── app.json
    ├── app.wxss
    ├── pages
    │   │── index
    │   │   ├── index.wxml
    │   │   ├── index.js
    │   │   ├── index.json
    │   │   └── index.wxss
    │   └── logs
    │       ├── logs.wxml
    │       └── logs.js
    └── utils

则需要在入口文件配置中写

```jsx
class App extends Component {
  // 项目配置
  config = {
    pages: [
      'pages/index/index',
      'pages/logs/logs'
    ]
  }
  ...
}
```

#### window

用于设置小程序的状态栏、导航条、标题、窗口背景色，其配置项如下。

| 属性 | 类型 | 默认值 | 描述 |
| - | - | - | - |
| navigationBarBackgroundColor | HexColor（十六进制颜色值） | #000000 | 导航栏背景颜色，如 #000000 |
| navigationBarTextStyle | String | white | 导航栏标题颜色，仅支持 black / white |
| navigationBarTitleText | String |  | 导航栏标题文字内容 |
| navigationStyle | String | default | 导航栏样式，仅支持以下值：default 默认样式；custom 自定义导航栏，只保留右上角胶囊按钮 |
| backgroundColor | String |  | 窗口的背景色 |
| backgroundTextStyle | String | dark | 下拉 loading 的样式，仅支持 dark / light |
| backgroundColorTop | String | #ffffff | 顶部窗口的背景色，仅 iOS 支持 |
| backgroundColorBottom | String | #ffffff | 底部窗口的背景色，仅 iOS 支持 |
| enablePullDownRefresh | boolean | false | 是否开启当前页面的下拉刷新。 |
| onReachBottomDistance | Number | 50 | 页面上拉触底事件触发时距页面底部距离，单位为 px |
|pageOrientation | String | portrait | 屏幕旋转设置，支持 auto / portrait / landscape 详见 响应显示区域变化 |

各端支持程度如下

| 属性 | 微信小程序 | 百度小程序 | 字节跳动小程序 | 支付宝小程序 | H5 | RN |
| - | - | - | - | - | - | - |
| navigationBarBackgroundColor | ✔️ | ✔️|✔️|✔️|✔️|✔️|
| navigationBarTextStyle | ✔️ | ✔️|✔️|  ✘ |✔️|✔️|
| navigationBarTitleText | ✔️ | ✔️|✔️| ✔️ |✔️|✔️|
| navigationStyle | ✔️（微信客户端 6.6.0） | ✔️（百度 App 版本 11.1.0）|✔️|  ✘ | ✘| ✘|
| backgroundColor | ✔️ | ✔️|✔️| ✘ |✘|✔️|
| backgroundTextStyle | ✔️ | ✔️|✔️| ✘ |✘|✘|
| backgroundColorTop |✔️（微信客户端 6.5.16） | ✘|✔️| ✘ |✘|✘|
| backgroundColorBottom | ✔️（微信客户端 6.5.16） | ✘|✔️| ✘ |✘|✘|
| enablePullDownRefresh | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onReachBottomDistance | ✔️ | ✔️|✔️| ✘ |✘|✘|
|pageOrientation | ✔️2.4.0 (auto) / 2.5.0 (landscape) | ✘|✘| ✘ |✘|✘|

> 微信小程序中，关于navigationStyle</br>
> - 客户端 7.0.0 以下版本，navigationStyle 只在 app.json 中生效。</br>
> - 客户端 6.7.2 版本开始，navigationStyle: custom 对 <web-view> 组件无效</br>
> - 开启 custom 后，低版本客户端需要做好兼容。开发者工具基础库版本切到 1.7.0（不代表最低版本，只供调试用）可方便切到旧视觉

配置示例如下：

```jsx
class App extends Component {
  // 项目配置
  config = {
    pages: [
      'pages/index/index',
      'pages/logs/logs'
    ],
    window: {
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextStyle: 'black',
      navigationBarTitleText: '微信接口功能演示',
      backgroundColor: '#eeeeee',
      backgroundTextStyle: 'light'
    }
  }
  ...
}
```

#### tabBar

如果小程序是一个多 tab 应用（客户端窗口的底部或顶部有 tab 栏可以切换页面），可以通过 tabBar 配置项指定 tab 栏的表现，以及 tab 切换时显示的对应页面。

其配置项如下

| 属性 | 类型 |  必填 | 默认值 | 描述 |
| - | - | - | - | - |
| color | HexColor（十六进制颜色值） | 是 |  | tab 上的文字默认颜色，仅支持十六进制颜色 |
| selectedColor | HexColor（十六进制颜色值） | 是 |  | tab 上的文字选中时的颜色，仅支持十六进制颜色 |
| backgroundColor | HexColor（十六进制颜色值） | 是 |  | tab 的背景色，仅支持十六进制颜色 |
| borderStyle | String | 是 | black | tabbar 上边框的颜色， 仅支持 black / white |
| list | Array | 是 |  | tab 的列表，详见 list 属性说明，最少 2 个、最多 5 个 tab |
| position | String | 否 | bottom | tabBar的位置，仅支持 bottom / top |
| custom | Boolean | 否 | false | 自定义 tabBar |

各端支持程度如下

| 属性 | 微信小程序 | 百度小程序 | 字节跳动小程序 | 支付宝小程序 | H5 | RN |
| - | - | - | - | - | - | - |
| color | ✔️ | ✔️|✔️|✔️|✔️|✔️|
| selectedColor | ✔️ | ✔️|✔️|  ✔️ |✔️|✔️|
| backgroundColor | ✔️ | ✔️|✔️| ✔️ |✔️|✔️|
| borderStyle | ✔️ | ✔️|✔️|  ✘ | ✔️| ✔️|
| list | ✔️ | ✔️|✔️| ✔️ |✔️|✔️|
| position | ✔️ | ✘|✔️| ✘ |✘|✘|
| custom |✔️（基础库 2.5.0 以上） | ✘|✘| ✘ |✘|✘|

其中 list 接受一个数组，只能配置最少 2 个、最多 5 个 tab。tab 按数组的顺序排序，每个项都是一个对象，其属性值如下：

| 属性 | 类型 |  必填 |  描述	 |
| - | - | - | - |
| pagePath | String | 是 |  页面路径，必须在 pages 中先定义 |
| text | String | 是 |  tab 上按钮文字 |
| iconPath | String | 否 |  图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，不支持网络图片。<br/>当 position 为 top 时，不显示 icon。 |
| selectedIconPath | String | 否 |  选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，不支持网络图片。<br/>当 position 为 top 时，不显示 icon。 |

#### networkTimeout

> 只在微信小程序上支持

各类网络请求的超时时间，单位均为毫秒。

| 属性 | 类型 |  必填 | 默认值 | 描述 |
| - | - | - | - | - |
| request | Number | 否 | 60000 | [Taro.request](apis/network/request/request.md) 的超时时间，单位：毫秒 |
| connectSocket | Number | 否 | 60000 | [Taro.connectSocket](apis/network/webSocket/connectSocket.md) 的超时时间，单位：毫秒 |
| uploadFile | Number | 否 | 60000 | [Taro.uploadFile](apis/network/upload/uploadFile.md) 的超时时间，单位：毫秒 |
| downloadFile | Number | 否 | 60000 | [Taro.downloadFile](apis/network/download/downloadFile.md) 的超时时间，单位：毫秒 |

#### debug

可以在开发者工具中开启 debug 模式，在开发者工具的控制台面板，调试信息以 info 的形式给出，其信息有 Page 的注册，页面路由，数据更新，事件触发等。可以帮助开发者快速定位一些常见的问题。

#### functionalPages

> 微信小程序基础库 2.1.0 开始支持

启用[插件功能页](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages.html)时，插件所有者小程序需要设置其 `functionalPages` 为 `true`

#### subPackages

> 微信客户端 6.6.0 ，基础库 1.7.3 及以上版本支持<br />
> 百度小程序支持<br />
> H5 和 RN 会把 `subPackages` 合入 `pages`

启用[分包加载](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages.html)时，声明项目分包结构

#### workers

> 微信小程序基础库 1.9.90 开始支持

使用 [Worker](https://developers.weixin.qq.com/miniprogram/dev/framework/workers.html) 处理多线程任务时，设置 [Worker](https://developers.weixin.qq.com/miniprogram/dev/framework/workers.html) 代码放置的目录

#### requiredBackgroundModes

> 微信客户端 6.7.2 及以上版本支持

申明需要后台运行的能力，类型为数组。目前支持以下项目：

- `audio`: 后台音乐播放

```jsx
class App extends Component {
  // 项目配置
  config = {
    pages: [
      'pages/index/index',
      'pages/logs/logs'
    ],
    requiredBackgroundModes: ['audio']
  }
  ...
}
```

注：在此处申明了后台运行的接口，开发版和体验版上可以直接生效，正式版还需通过审核。

#### plugins

> 微信小程序基础库 1.9.6 开始支持

声明小程序需要使用的 [插件](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html)

#### preloadRule

> 微信小程序基础库 2.3.0 开始支持

声明分包预下载的规则

[微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/preload.html)  [百度小程序文档](https://smartprogram.baidu.com/docs/develop/framework/subpackages/#%E5%88%86%E5%8C%85%E9%A2%84%E4%B8%8B%E8%BD%BD%E8%A7%84%E5%88%99)

#### resizable

> 微信小程序基础库 2.3.0 开始支持

在 iPad 上运行的小程序可以设置支持[屏幕旋转](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html)

#### navigateToMiniProgramAppIdList

> 微信小程序基础库 2.4.0 开始支持

当小程序需要使用 [Taro.navigateToMiniProgram](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateToMiniProgram.html) 接口跳转到其他小程序时，需要先在配置文件中声明需要跳转的小程序 appId 列表，最多允许填写 10 个

#### usingComponents

> 微信开发者工具 1.02.1810190 及以上版本支持

在此处声明的自定义组件视为全局自定义组件，在小程序内的页面或自定义组件中可以直接使用而无需再声明

#### permission

> 微信客户端 7.0.0 及以上版本支持

微信小程序接口权限相关设置。字段类型为 Object，结构为：

| 属性 | 类型 |  必填 | 默认值 | 描述 |
| - | - | - | - | - |
| scope.userLocation | PermissionObject | 否 |  | 位置相关权限声明 |

PermissionObject 结构

| 属性 | 类型 |  必填 | 默认值 | 描述 |
| - | - | - | - | - |
| desc | string | 是 |  | 小程序获取权限时展示的接口用途说明。最长 30 个字符 |

```jsx
class App extends Component {
  // 项目配置
  config = {
    pages: [
      'pages/index/index',
      'pages/logs/logs'
    ],
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示'
      }
    }
  }
  ...
}
```

![image](http://ww1.sinaimg.cn/large/49320207gy1g0uiageahij20gf08dwer.jpg)

### 生命周期

而且由于入口文件继承自 `Component` 组件基类，它同样拥有组件生命周期，但因为入口文件的特殊性，他的生命周期并不完整，具体如下

#### componentWillMount()

> 在微信/百度/字节跳动/支付宝小程序中这一生命周期方法对应 app 的 `onLaunch`

监听程序初始化，初始化完成时触发（全局只触发一次）

在此生命周期中通过 `this.$router.params`，可以访问到程序初始化参数

参数格式如下

| 属性 | 类型 |  说明 | 微信小程序 | 百度小程序 | 字节跳动小程序 | 支付宝小程序 | H5 | RN |
| - | - | - | - | - | - | - | - | - |
| path | string | 启动小程序的路径 | ✔️| ✔️| ✔️| ✔️|  ✘ |  ✘ |
| scene | number | 启动小程序的场景值 | ✔️| ✔️| ✔️|  ✘ |  ✘ |  ✘ |
| query | Object | 启动小程序的 query 参数 | ✔️| ✔️| ✔️| ✔️|  ✘ |  ✘ |
| shareTicket | string | shareTicket，详见获取更多转发信息 | ✔️| ✔️| ✔️|  ✘ |  ✘ | ✘ |
| referrerInfo | Object | 来源信息。从另一个小程序、公众号或 App 进入小程序时返回。否则返回 {} | ✔️| ✔️| ✔️| ✔️ |  ✘ | ✘ |

其中，场景值 scene，在微信小程序和百度小程序中存在区别，请分别参考 [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html) 和 [百度小程序文档](http://smartprogram.baidu.com/docs/data/scene/)

来源信息 referrerInfo 的数据结构如下

| 属性 | 类型 |  说明 | 微信小程序 | 百度小程序 | 字节跳动小程序 | 支付宝小程序 |
| - | - | - | - | - | - | - |
| appId | string | 来源小程序，或者公众号（微信中） | ✔️| ✔️| ✔️| ✔️|
| extraData | Object | 来源小程序传过来的数据，微信和百度小程序在scene=1037或1038时支持 | ✔️| ✔️| ✔️| ✔️|
| sourceServiceId | string | 来源插件，当处于插件运行模式时可见 | ✘ | ✘ | ✘| ✔️（基础库版本 1.11.0）|

#### componentDidMount()

> 在微信/百度/字节跳动/支付宝小程序中这一生命周期方法对应 app 的 `onLaunch`，在 `componentWillMount` 后执行

监听程序初始化，初始化完成时触发（全局只触发一次）

在此生命周期中也可以通过 `this.$router.params`，访问到程序初始化参数，与 `componentWillMount` 中一致

#### componentDidShow()

> 在微信/百度/字节跳动/支付宝小程序中这一生命周期方法对应 `onShow`，在 H5/RN 中同步实现

程序启动，或从后台进入前台显示时触发，微信小程序中也可以使用 `Taro.onAppShow` 绑定监听

在此生命周期中通过 `this.$router.params`，可以访问到程序初始化参数

参数与 `componentWillMount` 中获取的基本一致，但**百度小程序**中补充两个参数如下

| 属性 | 类型 |  说明 | 最低版本 |
| - | - | - | - |
| entryType | string | 展现的来源标识，取值为 user/ schema /sys :<br />user：表示通过home前后<br/>切换或解锁屏幕等方式调起；<br/>schema：表示通过协议调起;<br />sys：其它 | 2.10.7 |
| appURL | string | 展现时的调起协议，仅当entryType值为 schema 时存在| 2.10.7 |

#### componentDidHide()

> 在微信/百度/字节跳动/支付宝小程序中这一生命周期方法对应 `onHide`，在 H5/RN 中同步实现

程序从前台进入后台时触发，微信小程序中也可以使用 `Taro.onAppHide` 绑定监听

#### componentDidCatchError(String error)

> 在微信/百度/字节跳动/支付宝小程序中这一生命周期方法对应 `onError`，H5/RN 中尚未实现

程序发生脚本错误或 API 调用报错时触发，微信小程序中也可以使用 `Taro.onError` 绑定监听

#### componentDidNotFound(Object)

> 在微信/字节跳动小程序中这一生命周期方法对应 `onPageNotFound`，其他端尚未实现<br/>
> 微信小程序中，基础库 1.9.90 开始支持

程序要打开的页面不存在时触发，微信小程序中也可以使用 `Taro.onPageNotFound` 绑定监听

参数如下

| 属性 | 类型 |  说明 |
| - | - | - |
| path | string | 不存在页面的路径 |
| query | Object | 打开不存在页面的 query 参数 |
| isEntryPage | boolean | 是否本次启动的首个页面（例如从分享等入口进来，首个页面是开发者配置的分享页面） |

### Taro.getApp(Object)

可以用来获取到程序 App 实例，在各个端均有实现

微信小程序端可以传入一个 Object 参数，格式如下

| 属性 | 类型 |  说明 | 基础库最低版本
| - | - | - | - |
| allowDefault | Boolean | 在 App 未定义时返回默认实现。当App被调用时，默认实现中定义的属性会被覆盖合并到App中。一般用于[独立分包](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html) | 2.2.4 |

### 入口文件 render 方法说明

入口文件需要包含一个 `render` 方法，一般返回程序的第一个页面，但值得注意的是不要在入口文件中的 `render` 方法里写逻辑及引用其他页面、组件，因为编译时 `render` 方法的内容会被直接替换掉，你的逻辑代码不会起作用。

## 页面

Taro 项目的页面一般都放在 `src` 中的 `pages` 目录下，如果页面包含 `js` 以及 `css`，建议页面以文件夹的形式进行组织，例如 `index` 页面包含 `index.js` 和 `index.scss`，则在 `pages` 目录下新建 `index` 目录。

### 指定页面

页面创建好后如果需要渲染展示，则需要在项目入口文件 `app.js` 中 `config` 的 `pages` 数组中进行指定，例如上面提到的 `index` 页面，需要如下进行配置，页面配置需要指定到页面具体的 `js` 文件，可以不带 `.js` 后缀

```jsx
// ...
class App extends Component {
  // 项目配置
  config = {
    pages: [
      'pages/index/index'
    ]
  }
  // ...
}
```

### 代码示例

一个普通的页面文件示例如下

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

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

### 页面配置

Taro 的页面同样是继承自 `Component` 组件基类，每一个页面都拥有自己配置 `config`，这个配置是针对当前页面配置，配置规范基于微信小程序的[页面配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#%E9%A1%B5%E9%9D%A2%E9%85%8D%E7%BD%AE)进行制定，所有平台进行统一。

页面文件中的 `config` 配置，在编译后将生成全局配置文件 `app.json`。

页面的配置只能设置 [全局配置](#全局配置) 中部分 `window` 配置项的内容，页面中配置项会覆盖 [全局配置](#全局配置) 的 window 中相同的配置项。

配置示例：

```jsx
export default class Index extends Component {
  config = {
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '首页',
    backgroundColor: '#eeeeee',
    backgroundTextStyle: 'light'
  }

  render () {
    return (
      <View className='index'>
        <Text>1</Text>
      </View>
    )
  }
}
```

#### 配置项列表

| 属性 | 类型 | 默认值 | 描述 |
| - | - | - | - |
| navigationBarBackgroundColor | HexColor（十六进制颜色值） | #000000 | 导航栏背景颜色，如 #000000 |
| navigationBarTextStyle | String | white | 导航栏标题颜色，仅支持 black / white |
| navigationBarTitleText | String |  | 导航栏标题文字内容 |
| navigationStyle | String | default | 导航栏样式，仅支持以下值：default 默认样式；custom 自定义导航栏，只保留右上角胶囊按钮 |
| backgroundColor | String |  | 窗口的背景色 |
| backgroundTextStyle | String | dark | 下拉 loading 的样式，仅支持 dark / light |
| backgroundColorTop | String | #ffffff | 顶部窗口的背景色，仅 iOS 支持 |
| backgroundColorBottom | String | #ffffff | 底部窗口的背景色，仅 iOS 支持 |
| enablePullDownRefresh | boolean | false | 是否开启当前页面的下拉刷新。 |
| onReachBottomDistance | Number | 50 | 页面上拉触底事件触发时距页面底部距离，单位为 px |
|pageOrientation | String | portrait | 屏幕旋转设置，支持 auto / portrait / landscape 详见 响应显示区域变化 |
| disableScroll | Boolean | false | 设置为 true 则页面整体不能上下滚动。<br />只在页面配置中有效，无法在 app.json 中设置 |
| disableSwipeBack | Boolean | false | 禁止页面右滑手势返回 |
| usingComponents | Object | 否 | 页面自定义组件配置 |

各端支持程度如下

| 属性 | 微信小程序 | 百度小程序 | 字节跳动小程序 | 支付宝小程序 | H5 | RN |
| - | - | - | - | - | - | - |
| navigationBarBackgroundColor | ✔️ | ✔️|✔️|✔️|✔️|✔️|
| navigationBarTextStyle | ✔️ | ✔️|✔️|  ✘ |✔️|✔️|
| navigationBarTitleText | ✔️ | ✔️|✔️| ✔️ |✔️|✔️|
| navigationStyle | ✔️（微信客户端 6.6.0） | ✔️（百度 App 版本 11.1.0）|✔️|  ✘ | ✘| ✔️|
| backgroundColor | ✔️ | ✔️|✔️| ✘ |✘|✔️|
| backgroundTextStyle | ✔️ | ✔️|✔️| ✘ |✘|✔️|
| backgroundColorTop |✔️（微信客户端 6.5.16） | ✘|✔️| ✘ |✘|✘|
| backgroundColorBottom | ✔️（微信客户端 6.5.16） | ✘|✔️| ✘ |✘|✘|
| enablePullDownRefresh | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onReachBottomDistance | ✔️ | ✔️|✔️| ✘ |✘|✘|
|pageOrientation | ✔️2.4.0 (auto) / 2.5.0 (landscape) | ✘|✘| ✘ |✘|✘|
| disableScroll | ✔️ | ✘|✘| ✘ |✘|✔️|
| disableSwipeBack | ✔️ | ✘|✘| ✘ |✘|✘|
| usingComponents | ✔️ | ✔️|✔️| ✔️ |✘|✘|

其中，`usingComponents` 一般不需要配置，只有在需要与引用原生小程序组件的时候才需要配置。

### 页面说明

页面的样式文件建议放在与页面 JS 的同级目录下，然后通过 ES6 规范 `import` 进行引入，支持使用 CSS 预编译处理器，目前提供了 `sass` 预编译插件 `@tarojs/plugin-sass`，需要自行在本地进行安装。

页面 JS 要求必须有一个 `render` 函数，函数返回 JSX 代码，具体 JSX 代码的写法请参考 [JSX 章节](./jsx.md)。

### 生命周期

由于页面 JS 也继承自 `Component` 组件基类，所以页面同样拥有生命周期，页面的生命周期方法如下：

#### componentWillMount()

页面加载时触发，一个页面只会调用一次，此时页面 DOM 尚未准备好，还不能和视图层进行交互

#### componentDidMount()

页面初次渲染完成时触发，一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互

#### shouldComponentUpdate(nextProps, nextState)

页面是否需要更新，返回 false 不继续更新，否则继续走更新流程

#### componentWillUpdate(nextProps, nextState)

页面即将更新

#### componentDidUpdate(prevProps, prevState)

页面更新完毕

#### componentWillUnmount()

页面卸载时触发，如 redirectTo 或 navigateBack 到其他页面时

#### componentDidShow()

页面显示/切入前台时触发

#### componentDidHide()

页面隐藏/切入后台时触发， 如 navigateTo 或底部 tab 切换到其他页面，小程序切入后台等

**在以上所有的生命周期方法中，都可以通过 `this.$router.params` 获取打开当前页面路径中的参数**。

### 页面事件处理函数

在小程序中，页面还有在一些专属的事件处理函数，如下

#### onPullDownRefresh()

监听用户下拉刷新事件

- 需要在全局配置的 window 选项中或页面配置中开启 enablePullDownRefresh
- 可以通过 [Taro.startPullDownRefresh](apis/ui/pull-down-refresh/startPullDownRefresh.md) 触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
- 当处理完数据刷新后，[Taro.stopPullDownRefresh](apis/ui/pull-down-refresh/stopPullDownRefresh.md) 可以停止当前页面的下拉刷新

#### onReachBottom()

监听用户上拉触底事件

- 可以在全局配置的 window 选项中或页面配置中设置触发距离 onReachBottomDistance
- 在触发距离内滑动期间，本事件只会被触发一次

#### onPageScroll(Object)

监听用户滑动页面事件

Object 参数说明：

| 参数 | 类型 | 说明 |
| - | - | - |
| scrollTop | Number | 页面在垂直方向已滚动的距离（单位px）|

**注意：请只在需要的时候才在 page 中定义此方法，不要定义空方法。以减少不必要的事件派发对渲染层-逻辑层通信的影响。注意：请避免在 onPageScroll 中过于频繁的执行 this.setState() 等引起逻辑层-渲染层通信的操作。尤其是每次传输大量数据，会影响通信耗时。**

#### onShareAppMessage(Object)

监听用户点击页面内转发按钮（Button 组件 openType='share'）或右上角菜单“转发”按钮的行为，并自定义转发内容。

注意：只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮

Object 参数说明：

| 参数 | 类型 | 说明 |
| - | - | - |
| from | String | 转发事件来源。<br />button：页面内转发按钮；<br />menu：右上角转发菜单 |
| target | Object | 如果 `from` 值是 `button`，则 `target` 是触发这次转发事件的 `button`，否则为 `undefined` |
| webViewUrl | String | 页面中包含 <WebView> 组件时，返回当前 <WebView> 的url |

此事件需要 return 一个 Object，用于自定义转发内容，返回内容如下：

自定义转发内容

| 字段 | 类型 | 说明 |
| - | - | - |
| title | 转发标题 | 当前小程序名称 |
| path | 转发路径 | 当前页面 path ，必须是以 / 开头的完整路径 |
| imageUrl | 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持 PNG 及 JPG 。显示图片长宽比是 5:4 | 使用默认截图 |

示例代码

```jsx
export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  }

  render () {
    return (
      <View className='index'>
        <Text>1</Text>
      </View>
    )
  }
}
```

#### onResize(object)

> 只有微信小程序支持<br />
> 基础库 2.4.0 开始支持

小程序屏幕旋转时触发。详见 [响应显示区域变化](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%90%AF%E7%94%A8%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E6%94%AF%E6%8C%81)

#### onTabItemTap(Object)

> 微信小程序中，基础库 1.9.0 开始支持

点击 tab 时触发

Object 参数说明：

| 参数 | 类型 | 说明 |
| - | - | - |
| index | String | 被点击 tabItem 的序号，从 0 开始 |
| pagePath | String | 被点击 tabItem 的页面路径 |
| text | String | 被点击 tabItem 的按钮文字 |

#### componentWillPreload()

> 目前只有微信小程序支持

[预加载](best-practice.md#预加载)钩子

#### onTitleClick()

> 只有支付宝小程序支持，基础库 1.3.0 开始支持

点击标题触发

#### onOptionMenuClick()

> 只有支付宝小程序支持，基础库 1.3.0 开始支持

点击导航栏额外图标触发

#### onPopMenuClick()

> 只有支付宝小程序支持，基础库 1.11.0 开始支持

暂无说明

#### onPullIntercept()

> 只有支付宝小程序支持，基础库 1.3.0 开始支持

下拉截断时触发

> H5 暂时没有同步实现 `onReachBottom` 、 `onPageScroll` 这两个事件函数，可以通过给 window 绑定 scroll 事件来进行模拟，而 `onPullDownRefresh` 下拉刷新则暂时只能用 `ScrollView` 组件来代替了。

页面事件函数各端支持程度如下

| 方法 | 作用 | 微信小程序 | 百度小程序 | 字节跳动小程序 | 支付宝小程序 | H5 | RN |
| - | - | - | - | - | - | - | - |
| onPullDownRefresh | 页面相关事件处理函数--监听用户下拉动作 | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onReachBottom | 页面上拉触底事件的处理函数 | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onShareAppMessage | 用户点击右上角转发 | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onPageScroll | 页面滚动触发事件的处理函数 | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onTabItemTap | 当前是 tab 页时，点击 tab 时触发 | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onResize | 页面尺寸改变时触发，详见 [响应显示区域变化](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%90%AF%E7%94%A8%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E6%94%AF%E6%8C%81) | ✔️ | ✘|✘| ✘ |✘|✘|
| componentWillPreload | [预加载](best-practice.md#预加载) | ✔️ | ✘|✘| ✘ |✘|✘|
| onTitleClick | 点击标题触发 | ✘ | ✘|✘| ✔️|✘|✘|
| onOptionMenuClick | 点击导航栏额外图标触发 | ✘ | ✘|✘| ✔️（基础库 1.3.0）|✘|✘|
| onPopMenuClick |  | ✘ | ✘|✘| ✔️（基础库 1.3.0）|✘|✘|
| onPullIntercept | 下拉截断时触发 | ✘ | ✘|✘| ✔️（基础库 1.11.0）|✘|✘|

以上成员方法在 Taro 的页面中同样可以使用，书写同名方法即可，不过需要注意的，目前暂时只有小程序端支持（支持程度如上）这些方法，编译到 H5/RN 端后这些方法均会失效。

## 组件

Taro 支持组件化开发，组件代码可以放在任意位置，不过建议放在 `src` 下的 `components` 目录中。一个组件通常包含组件 JS 文件以及组件样式文件，组织方式与页面类似。

### 组件配置

一般来说，Taro 组件不需要任何配置，但当你在 Taro 组件中引用原生小程序组件代码时，则需要通过配置 `config` 来实现。

配置项如下

| 属性 | 类型 | 必填 | 描述	 |
| - | - | - | - |
| usingComponents | Object | 否 | 组件自定义组件配置 |

`usingComponents` 中通过 `组件名: 组件相对路径` 这种 key/value 的方式定义引用的组件。

### 代码示例

```jsx
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import './tab.scss'

class Tab extends Component {

  onNewTodo = () => {
    // dosth
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

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

### 组件说明

组件的样式文件可以需要在组件中通过 `import` 语法进行引入。

Taro 的组件同样是继承自 `Component` 组件基类，与页面类似，组件也必须包含一个 `render` 函数，返回 JSX 代码。

### 生命周期

由于组件 JS 也继承自 `Component` 组件基类，所以页面同样拥有生命周期，页面的生命周期方法如下：

#### componentWillMount()

组件加载时触发，一个组件只会调用一次，此时组件 DOM 尚未准备好，还不能和视图层进行交互

#### componentDidMount()

组件初次渲染完成时触发，一个组件只会调用一次，代表组件已经准备妥当，可以和视图层进行交互

#### componentWillReceiveProps(nextProps)

已经装载的组件接收到新属性前调用

#### shouldComponentUpdate(nextProps, nextState)

组件是否需要更新，返回 false 不继续更新，否则继续走更新流程

#### componentWillUpdate(nextProps, nextState)

组件即将更新

#### componentDidUpdate(prevProps, prevState)

组件更新完毕

#### componentWillUnmount()

组件卸载时触发

> 具体生命周期的使用以及组件类的说明可以查看[组件说明章节](components-desc.md)。
