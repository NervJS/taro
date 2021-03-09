---
title: 框架
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

代码示例请根据你选择的框架进行查看：[React](./react.md), [Nerv](./nerv.md), [Vue](./vue.md), [Vue3](./vue3.md)。

### 全局配置


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

```jsx title="app.config.js"
export default {
  pages: [
    'pages/index/index',
    'pages/logs/logs'
  ]
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
| navigationStyle | ✔️（微信客户端 6.6.0） | ✔️（百度 App 版本 11.1.0）|✔️|  ✘ | ✘| ✔️ |
| backgroundColor | ✔️ | ✔️|✔️| ✘ |✘|✔️|
| backgroundTextStyle | ✔️ | ✔️|✔️| ✘ |✘|✘|
| backgroundColorTop |✔️（微信客户端 6.5.16） | ✘|✔️| ✘ |✘|✘|
| backgroundColorBottom | ✔️（微信客户端 6.5.16） | ✘|✔️| ✘ |✘|✘|
| enablePullDownRefresh | ✔️ | ✔️|✔️| ✔️ |✘|✔️|
| onReachBottomDistance | ✔️ | ✔️|✔️| ✘ |✘|✔️|
|pageOrientation | ✔️2.4.0 (auto) / 2.5.0 (landscape) | ✘|✘| ✘ |✘|✘|

> 微信小程序中，关于navigationStyle
> - 客户端 7.0.0 以下版本，navigationStyle 只在 app.json 中生效。
> - 客户端 6.7.2 版本开始，navigationStyle: custom 对 `<web-view>` 组件无效
> - 开启 custom 后，低版本客户端需要做好兼容。开发者工具基础库版本切到 1.7.0（不代表最低版本，只供调试用）可方便切到旧视觉

配置示例如下：

```jsx title="app.config.js"
export default {
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
| custom |✔️（基础库 2.5.0 以上） | ✘|✘| ✘ |✘|✔️|


其中 list 接受一个数组，只能配置最少 2 个、最多 5 个 tab。tab 按数组的顺序排序，每个项都是一个对象，其属性值如下：

| 属性 | 类型 |  必填 |  描述	 |
| - | - | - | - |
| pagePath | String | 是 |  页面路径，必须在 pages 中先定义 |
| text | String | 是 |  tab 上按钮文字 |
| iconPath | String | 否 |  图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，不支持网络图片。<br/>当 position 为 top 时，不显示 icon。 |
| selectedIconPath | String | 否 |  选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，不支持网络图片。<br/>当 position 为 top 时，不显示 icon。 |

> - 在React Native端，tabbar的 iconPath,selectedIconPath 不支持本地图片，支持网络图片或者 base64

#### networkTimeout

> 只在微信小程序上支持

各类网络请求的超时时间，单位均为毫秒。

| 属性 | 类型 |  必填 | 默认值 | 描述 |
| - | - | - | - | - |
| request | Number | 否 | 60000 | [Taro.request](./apis/network/request/request.md) 的超时时间，单位：毫秒 |
| connectSocket | Number | 否 | 60000 | [Taro.connectSocket](./apis/network/webSocket/connectSocket.md) 的超时时间，单位：毫秒 |
| uploadFile | Number | 否 | 60000 | [Taro.uploadFile](./apis/network/upload/uploadFile.md) 的超时时间，单位：毫秒 |
| downloadFile | Number | 否 | 60000 | [Taro.downloadFile](./apis/network/download/downloadFile.md) 的超时时间，单位：毫秒 |

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
export default {
  pages: [
    'pages/index/index',
    'pages/logs/logs'
  ],
  requiredBackgroundModes: ['audio']
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
export default {
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
```

![image](https://img10.360buyimg.com/ling/jfs/t1/132830/23/12399/20429/5f893793Ebafa6939/b5f6a390ac9bfd79.jpg)


### Taro.getApp(Object)

可以用来获取到程序 App 实例，在各个端均有实现

微信小程序端可以传入一个 Object 参数，格式如下

| 属性 | 类型 |  说明 | 基础库最低版本
| - | - | - | - |
| allowDefault | Boolean | 在 App 未定义时返回默认实现。当App被调用时，默认实现中定义的属性会被覆盖合并到App中。一般用于[独立分包](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html) | 2.2.4 |

## 页面

Taro 项目的页面一般都放在 `src` 中的 `pages` 目录下，如果页面包含 `js` 以及 `css`，建议页面以文件夹的形式进行组织，例如 `index` 页面包含 `index.js` 和 `index.scss`，则在 `pages` 目录下新建 `index` 目录。

### 指定页面

页面创建好后如果需要渲染展示，则需要在项目入口文件 `app.config.js` 的 `pages` 数组中进行指定，例如上面提到的 `index` 页面，需要如下进行配置，页面配置需要指定到页面具体的 `js` 文件，可以不带 `.js` 后缀

```jsx
// ...
export default  {
  pages: [
    'pages/index/index'
  ]
}
```

### 页面配置

页面的配置只能设置 [全局配置](#全局配置) 中部分 `window` 配置项的内容，页面中配置项会覆盖 [全局配置](#全局配置) 的 window 中相同的配置项。

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
| enablePullDownRefresh | ✔️ | ✔️|✔️| ✔️ |✘|✔️|
| onReachBottomDistance | ✔️ | ✔️|✔️| ✘ |✘|✔️|
|pageOrientation | ✔️2.4.0 (auto) / 2.5.0 (landscape) | ✘|✘| ✘ |✘|✘|
| disableScroll | ✔️ | ✘|✘| ✘ |✘|✔️|
| disableSwipeBack | ✔️ | ✘|✘| ✘ |✘|✘|
| usingComponents | ✔️ | ✔️|✔️| ✔️ |✘|✘|

其中，`usingComponents` 一般不需要配置，只有在需要与引用原生小程序组件的时候才需要配置。

### 页面说明

页面的样式文件建议放在与页面 JS 的同级目录下，然后通过 ES6 规范 `import` 进行引入，支持使用 CSS 预编译处理器，目前提供了 `sass` 预编译插件 `@tarojs/plugin-sass`，需要自行在本地进行安装。
