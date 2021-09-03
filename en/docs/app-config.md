---
title: Global Configuration
---

The `app.config.js` files in the root directory are used to global configuration of applets, configuration entries follow**micromessage applet specification**and unify all platforms.

Note：

1. `App.config.js` in required or import referenced js file is currently**not compiled syntax with Babel**.
2. Multiplexing logic can be implemented using `process.env.TARO_ENV` variable to make conditional judgements.
3. `app.config.js` does not support multi-end file format, such as `app.weapp.js` is ineffective.

## Generic Configuration Item

Configurations supported on H5, React Nate, all small programs.

| Properties                  | Type         | Required | Description                            |
|:--------------------------- |:------------ |:-------- |:-------------------------------------- |
| [pages](#pages)             | String Array | Yes      | Page Path List                         |
| [windowow](#window)         | Object       | No       | Global default window performance      |
| [tabar](#tabbar)            | Object       | No       | Bottom tab                             |
| [Subpackages](#subpackages) | Object Array | No       | Subcontracting Structure Configuration |

### pages

The `path + filename` information used to specify which pages the applet will compose.File name does not need to write a file suffix. The frame will automatically search for files to be processed at the appropriate location.

**The first item in an array represents the initial page of the applet (homepage).Add/Decrease pages in the applet, all need to modify the array of pages.**

For development directory is：

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

They need to be written in the access profile

```jsx title="app.config.js"
export default LOR
  pages: [
    'pages/index/index/index',
    'pages/logs/logs'
  ]
}
```

### windowow

Used to set the status bar, navigation, title, window background color for the applet, which is set out below.

| Properties                   | Type                 | Default value | Description                                                                     |
| ---------------------------- | -------------------- | ------------- | ------------------------------------------------------------------------------- |
| navigationBarBackgroundColor | HexColor (hex color) | #000000       | Navigation bar background color, eg. #000000                                    |
| navigationBarTextStyle       | String               | White:        | Navigation bar header color, black / white only                                 |
| navigationBarTitleText       | String               |               | Navigation bar title text                                                       |
| navigationStyle              | String               | default       | 导航栏样式，仅支持以下值：default 默认样式；custom 自定义导航栏，只保留右上角胶囊按钮                              |
| backgroundColor              | String               |               | Background color of windows                                                     |
| backgroundTextStyle          | String               | dark          | Drop loading style, only dark / light support                                   |
| backgroundColorTop           | String               | #ffffff       | Background color for top windows, only iOS supports                             |
| backgroundColorBottom        | String               | #ffffff       | Background color of the bottom window, only iOS supports                        |
| enablePullDownRefresh        | boolean              | false         | Whether or not to turn on the current page pull.                                |
| onReachBottomDistance        | Number               | 50            | Pull up to bottom when triggering event                                         |
| pageOrientation              | String               | Trait         | Screen rotation settings, support auto /portrait/landscape for regional changes |

#### The level of support at each end is as follows:

| Properties                   | Micromessages                       | 100 degrees                | Byte Jump | PayPal | H5 | RN |
| ---------------------------- | ----------------------------------- | -------------------------- | --------- | ------ | -- | -- |
| navigationBarBackgroundColor | ✔️                                  | ✔️                         | ✔️        | ✔️     | ✔️ | ✔️ |
| navigationBarTextStyle       | ✔️                                  | ✔️                         | ✔️        | ✘      | ✔️ | ✔️ |
| navigationBarTitleText       | ✔️                                  | ✔️                         | ✔️        | ✔️     | ✔️ | ✔️ |
| navigationStyle              | ✔️(Microletter client 6.6.0)        | ✔️(100 App version 11.1.0) | ✔️        | ✘      | ✘  | ✘  |
| backgroundColor              | ✔️                                  | ✔️                         | ✔️        | ✘      | ✘  | ✘  |
| backgroundTextStyle          | ✔️                                  | ✔️                         | ✔️        | ✘      | ✘  | ✘  |
| backgroundColorTop           | ✔️(Microletter client 6.5.16)       | ✘                          | ✔️        | ✘      | ✘  | ✘  |
| backgroundColorBottom        | ✔️(Microletter client 6.5.16)       | ✘                          | ✔️        | ✘      | ✘  | ✘  |
| enablePullDownRefresh        | ✔️                                  | ✔️                         | ✔️        | ✔️     | ✘  | ✘  |
| onReachBottomDistance        | ✔️                                  | ✔️                         | ✔️        | ✘      | ✘  | ✘  |
| pageOrientation              | ✔️ 2.4.0 (auto) / 2.5.0 (landscape) | ✘                          | ✘         | ✘      | ✘  | ✘  |

#### Code Example

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

### tabar

If the applet is a primary tab app (there is a tab bar at the bottom or top of the client window that can switch pages), the tab bar performance can be specified through the tabbar configuration, and the corresponding page displayed when tab is switched.

Its configuration is as follows:

| Properties      | Type                 | Required | Default value | Description                                                           |
| --------------- | -------------------- | -------- | ------------- | --------------------------------------------------------------------- |
| color           | HexColor (hex color) | Yes      |               | The default text color on tab, only hex color is supported            |
| Selected Color  | HexColor (hex color) | Yes      |               | Color of selected text on tab only supports hexadecimal color         |
| backgroundColor | HexColor (hex color) | Yes      |               | Tab background color, only hex color is supported                     |
| BorderStyle     | String               | Yes      | black         | Color of the border above tabar, only for black / white.              |
| list            | Array                | Yes      |               | Tab list, see list attribute description, minimum 2 and maximum 5 tab |
| position        | String               | No       | Bottom        | Position of tabar, only supports bottom/top                           |
| cusom           | Boolean              | No       | false         | Custom tabBar                                                         |

Where a list accepts an array, it can only be configured with minimum 2 and maximum 5 tabs.tab 按数组的顺序排序，每个项都是一个对象，其属性值如下：

| Properties       | Type   | Required | Description                                                                                                                                                          |
| ---------------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pagePath         | String | Yes      | Page Paths, must be defined first in pages                                                                                                                           |
| Text             | String | Yes      | Tab button text                                                                                                                                                      |
| iconPath         | String | No       | Image path,icon size is 40 kb, recommended size 81px * 81px and does not support network images.<br/>Do not show icon when position is top.                    |
| selectedIconPath | String | No       | The selected image path,icon size is limited to 40kb, 81px * 81px is recommended. Network images are not supported.<br/>Do not show icon when position is top. |

#### The level of support at each end is as follows:

| Properties      | Micromessages                  | 100 degrees | Byte Jump | PayPal | H5 | RN |
| --------------- | ------------------------------ | ----------- | --------- | ------ | -- | -- |
| color           | ✔️                             | ✔️          | ✔️        | ✔️     | ✔️ | ✔️ |
| Selected Color  | ✔️                             | ✔️          | ✔️        | ✔️     | ✔️ | ✔️ |
| backgroundColor | ✔️                             | ✔️          | ✔️        | ✔️     | ✔️ | ✔️ |
| BorderStyle     | ✔️                             | ✔️          | ✔️        | ✘      | ✔️ | ✔️ |
| list            | ✔️                             | ✔️          | ✔️        | ✔️     | ✔️ | ✔️ |
| position        | ✔️                             | ✘           | ✔️        | ✘      | ✘  | ✘  |
| cusom           | ✔️(base library 2.5.0 or more) | ✘           | ✘         | ✘      | ✘  | ✘  |

### Subpackages

> H5 and RN will merge `subPackages` into `pages`

Enable the[subcontracting load](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages.html)to declare the project subcontracting structure

## Applet specific properties

Properties supported only in some applets, neither H5 nor RN support.

| Properties                                                        | Type         | Description                                           |
|:----------------------------------------------------------------- |:------------ |:----------------------------------------------------- |
| [networkTimeout](#networktimeout)                                 | Object       | Network timeout                                       |
| [debug](#debug)                                                   | Boolean      | Whether to turn on debug mode or close by default     |
| [Permissions](#permission)                                        | Object       | Applet Interface Permissions                          |
| [RequiredBackgroundModes](#requiredbackgroundmodes)               | String Array | Capabilities to use in background like 'Music Play'   |
| [Preload Rule](#preloadrule)                                      | Object       | Subcontracting Predownload Rules                      |
| [entryPagePath](#entrypagepath)                                   | String       | Applet Default Start Home                             |
| [Workers](#workers)                                               | String       | Directory where worker code is placed                 |
| [navigateToMiniProgramAppIdList](#navigatetominiprogramappidlist) | String Array | List of applets to jump, see wx.navigateToMiniProgram |

### networkTimeout

Support：<img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E7%99%BE%E5%BA%A6%E8%BD%BB%E5%BA%94%E7%94%A8.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%AD%97%E8%8A%82.png" width="25px" style={{verticalAlign: 'middle' }} />  <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

Timeout in milliseconds for all types of network requests.

| Properties    | Type   | Required | Default value | Description                                                                      |
| ------------- | ------ | -------- | ------------- | -------------------------------------------------------------------------------- |
| Request       | Number | No       | 60000         | [Taro.request](./apis/network/request/request.md) timeout, unit：ms               |
| connectSocket | Number | No       | 60000         | [Timeout for Taro.connectSocke](./apis/network/webSocket/connectSocket.md) in：ms |
| Upload File   | Number | No       | 60000         | [Timeout for Taro.uploadFile](./apis/network/upload/uploadFile.md) , unit：ms     |
| Download File | Number | No       | 60000         | [Timeout for Taro.downloadFile](./apis/network/download/downloadFile.md) in：ms   |

### debug

Support：<img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />  <img src="http://storage.jd.com/cjj-pub-images/icon_%E4%BA%AC%E4%B8%9C%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />  <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

可以在开发者工具中开启 `debug` 模式，在开发者工具的控制台面板，调试信息以 `info` 的形式给出，其信息有 `Page` 的注册，页面路由，数据更新，事件触发等。Can help developers quickly locate some common problems.

### Permissions

Support： <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E7%99%BE%E5%BA%A6%E8%BD%BB%E5%BA%94%E7%94%A8.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%AD%97%E8%8A%82.png" width="25px" style={{verticalAlign: 'middle' }} />  <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

Applet[interface permissions](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)related settings.Field type is `Object`and structure is：

| Properties         | Type             | Required | Default value | Description                              |
| ------------------ | ---------------- | -------- | ------------- | ---------------------------------------- |
| scope.userLocation | PermissionObject | No       |               | Location Related Permissions Declaration |

`PermissionObject` 结构：

| Properties | Type   | Required | Default value | Description                                                                            |
| ---------- | ------ | -------- | ------------- | -------------------------------------------------------------------------------------- |
| desc       | String | Yes      |               | Descriptions of the interface used when the applet gets permission.Up to 30 characters |

#### Code Example

```js title="app.config.js"
export default LOR
  pages: [
    'pages/index/index/index',
    'pages/logs/logs'
  ],
  permission: LO
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示'
    }
  }
}
```

![Image](https://img10.360buyimg.com/ling/jfs/t1/132830/23/12399/20429/5f893793Ebafa6939/b5f6a390ac9bfd79.jpg)

### RequiredBackgroundModes

Support：<img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E7%99%BE%E5%BA%A6%E8%BD%BB%E5%BA%94%E7%94%A8.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

Describe the ability to run in the back-office and the types in groups.The following projects are currently supported：

- `audio`: music playing in background
- `location`: background location

#### Code Example

```js title="app.config.js"
export default has
  "pages": ["pages/index/index/index"],
  "requiredBackgroundModes": ["audio", "location"]
}
```

Note：confirms the interface running in the background and is directly valid on the development and experience versions, which need to be reviewed and reviewed.

### Preload Rule

Support：<img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E7%99%BE%E5%BA%A6%E8%BD%BB%E5%BA%94%E7%94%A8.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%AD%97%E8%8A%82.png" width="25px" style={{verticalAlign: 'middle' }} />

Declares the rules for pre-downloading subcontracts.

- [Micromessage applet documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/preload.html)
- [100 Applet Documentation](https://smartprogram.baidu.com/docs/develop/framework/subpackages/#%E5%88%86%E5%8C%85%E9%A2%84%E4%B8%8B%E8%BD%BD%E8%A7%84%E5%88%99)
- [Byte jump applet document](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/basic-reference/general-configuration#preloadrule)

### entryPagePath

Support：<img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />  <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%AD%97%E8%8A%82.png" width="25px" style={{verticalAlign: 'middle' }} />

Specifies the default start path of the applet (homepage), common scenarios are dropping down from the micromessage chat list, starting the applet, etc.If not entered, the first entry of the `pages` list will be defaulted.Page path arguments are not supported.

#### Code Example

```js title="app.config.js"
export default {
  "entryPagePath": "pages/index/index"
}
```


### Workers

Support：<img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

Set the directory where worker code is placed when worker handles multi-thread tasks.

- [MicroMessage Applet Document - Worker](https://developers.weixin.qq.com/miniprogram/dev/framework/workers.html)
- [QQ Applet Document - Worker](https://q.qq.com/wiki/develop/miniprogram/frame/basic_ability/basic_multiworker.html)

### navigateToMiniProgramAppIdList

Support：<img src="http://storage.jd.com/cjj-pub-images/icon_%E5%AD%97%E8%8A%82.png" width="25px" style={{verticalAlign: 'middle' }} />  <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

When the applet needs to use [Taro.navigateToMiniProgram](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateToMiniProgram.html) to jump to another applet, a list of applets that need to jump in the configuration file is required and up to 10 characters are allowed to fill in

## Micromessage applet unique properties

Properties only supported in the micromessage app.<img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

| Properties                          | Type    | Description                                                  |
|:----------------------------------- |:------- |:------------------------------------------------------------ |
| [FunctionalPages](#functionalpages) | Boolean | Enable plugin feature page, disabled by default              |
| [plugins](#plugins)                 | Object  | Plugins to use                                               |
| [resizable](#resizable)             | Boolean | Whether the iPad applet supports screen rotation, by default |
| [usingComponent](#usingcomponents)  | Object  | Global Custom Component Configuration                        |
| [siteapLocation](#sitemaplocation)  | String  | Specify sitemap.json position                                |
| [Style](#style)                     | String  | Specify how to use an upgraded weui style                    |
| [useExtendedLib](#useextendedlib)   | Object  | Specify the extension to refer to                            |
| [entranceDeclare](#entrancedeclare) | Object  | Micromessage opened with applet                              |
| [darkmod](#darkmode)                | boolean | DarkMode is supported by applet                              |
| [themeLocation](#themelocation)     | String  | Specify the theme .json position                             |
| [lazyCodeLoading](#lazycodeloading) | String  | Configure custom component code as required                  |
| [single Page](#singlepage)          | Object  | Single Page Mode Related Configuration                       |

### FunctionalPages

> Base library 2.1.0 started support

The plugin owner applet needs to set this item to enable the[plugin feature page](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages.html)

### plugins

> Base library 1.9.6 Start support

The[plugin to declare that the applet needs to use](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html)

### resizable

> Base library 2.3.0 started support

Running applets on iPad can set support for[screen rotation](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html). The applet running on PC allows users to drag windows in any scale or to maximize windows in the applet menu.

### usingComponent

> Microletter developer tool 1.02.1810190 and above

The custom component declared here is considered a global custom component, which can be used directly in the widget's pages or custom components without the need for further declaration.

### siteapLocation

指明 [sitemap.json](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/sitemap.html) 的位置；默认为 `sitemap.json` 即在根目录下名字的 `sitemap.json` 文件。

### Style

> Base library 2.8.0 started support

Micromessage client 7.0 started, and UI interfaces significantly modified.The applet also updates the style of the base component.`app.json` 中配置 `"style": "v2"` 可表明启用新版的组件样式。

The components involved in this change are `button` `icon` `radio` `checkbox` `twitch` `slider`.You can go to the applet example to experience it.

### useExtendedLib

> Base library 2.2.1 Start support

Specifies the extension library that needs to be referenced.The following projects are currently supported：

- weui: WeUI component library

Specified, equivalent to the npm package that introduces the latest version of the corresponding extension library and does not take up the package volume of the applet.The rc tool version supports subcontracting references.Usage below：

#### Code Example

```js title="app.config.js"
export default LOR
  "useExtendedLib": {
    "weui": true
  }
}
```

### entranceDeclare

> version 7.0.9 and above. iOS isn't supporting

Chat location is opened with car class applet,[for details](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/location-message.html)

#### Code Example

```js title="app.config.js"
export default {
  "entranceDeclare": {
    "locationMessage": {
        "path": "pages/index/index",
        "query": "foo=bar"
    }
  }
}
```

### darkmod

> Developer tool 1.03.2004271 and above, base library 2.11.0 and above support

iOS client `7.0.12` version, Android client `7.0. 3` Version is officially supported `DarkMode`, available through configuration `"darkmode": true` indicates that the current applet can match `DarkMode`, Basic components will display different default styles based on system themes,`navigation bar` and `tab bar` will also be automatically switched based on developer's configuration.

When configured, please do your own adaptive work other than the base style according to [DarkMode guide](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/darkmode.html).

#### Code Example

```js title="app.config.js"
export default LOR
  "darkmode": true
}
```

### themeLocation

Custom [path to theme.json](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/darkmode.html#%E5%8F%98%E9%87%8F%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6-theme-json) , when configuring `"darkmode":true` , the current configuration file is required.

#### Code Example

```js title="app.config.js"
export default LOR
  "themeLocation": "/path/to/theme.json"
}
```

### lazyCodeLoading

> Base library version 2.11.1 and above, version 2.11.1 is supported but not optimized

Normally, all pages and custom components will be injected during the startup of the applet. Custom components and pages that are not used in the current page are not actually used after injection.

Since base library version `2.11.1` the applet supports selective injection of the necessary code to reduce the startup and running memory of the applet.

#### Code Example

```js title="app.config.js"
export default LOR
  "lazyCodeLoading": "requiredComponents"
}
```

### single Page

> Base library version 2.11.3 and above. Currently shared to network (Beta) and meeting into single page mode

Single Page Mode associated with configuration：

| Properties       | Type   | Required | Default value                                                                                        | Description                                                                                                                                                                                                                                            |
|:---------------- |:------ |:-------- |:---------------------------------------------------------------------------------------------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| navigationBarFit | String | No       | Default auto-adjust if the original page is customized navigation bar: `float`, otherwise `squeezed` | The navigation bar interfaces with the page, with a value `float` as the navigation bar floats on the page, interacts with the page; value `squeezed` indicates that the page is squeezed by the navigation bar and is not intersected with the pages. |

## Baidu Applet Specific Properties

Properties are only supported in the 100 applet.<img src="http://storage.jd.com/cjj-pub-images/icon_%E7%99%BE%E5%BA%A6%E8%BD%BB%E5%BA%94%E7%94%A8.png" width="25px" style={{verticalAlign: 'middle' }} />

| Properties                | Type         | Description                    |
|:------------------------- |:------------ |:------------------------------ |
| [Rotes](#routes)          | Array Object | Applet Custom Routing Settings |
| [dynamicLib](#dynamiclib) | Object       | Import Dynamic Library         |

### Rotes

> Base library 3.160.3 and above support

See more[Custom Route](https://smartprogram.baidu.com/docs/develop/framework/app_service_customroute/)

Roots are an array, each of them represents a set of routing rules, specifically containing fields as：

| Properties | Type   | Required | Description                                                             | Example            |
|:---------- |:------ |:-------- |:----------------------------------------------------------------------- |:------------------ |
| Path       | String | Yes      | Access path                                                             | "Home"             |
| page       | String | Yes      | Path to page source file, file path from the base of the applet package | "pages/home/index" |

#### Code Example

```js title="app.config.js"
export default {
  "pages": [
      "pages/home/home",
      "pages/list/list",
      "pages/detail/detail"
  ],
  "subPackage": [
      {
          "root": "packageA",
          "pages": [
              "pages/home/home",
              "pages/list/list",
              "pages/detail/detail"
          ]
      }
  ],
  "routes": [
      {
          // 投放入口，scheme中的path
          "path": "home", 
          // 真实的物理存储路径
          "page": "pages/home/home" 
      },
      {
          "path": "list",
          "page": "pages/list/list"
      },
      {
          "path": "foo/bar",
          "page": "pages/list/list"
      }
  ]
}
```

### dynamicLib

For further information, please refer to[to the Dynamic Library](https://smartprogram.baidu.com/docs/develop/framework/dynamiclib_use/)

## QQ Applet Specific Properties

Properties only supported in QQ applets.<img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

| Properties                  | Type          | Description                             |
|:--------------------------- |:------------- |:--------------------------------------- |
| [groupIdList](#groupidlist) | String Object | List of group number to open group card |

### groupIdList

For further information, please refer to [Button](https://q.qq.com/wiki/develop/miniprogram/component/form/button.html)

## Kyoto East Applet Specific Properties

Properties are only supported in the Gingong app.<img src="http://storage.jd.com/cjj-pub-images/icon_%E4%BA%AC%E4%B8%9C%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

| Properties              | Type   | Description                         |
|:----------------------- |:------ |:----------------------------------- |
| [pageAlias](#pagealias) | Object | Page Page Alias                     |
| [QuickMenu](#quickmenu) | Object | Buy Button Inner Menu Configuration |

### pageAlias

The page aliase, available to `pages` and configure an alias for opening the applet,`path` unknown or `path` too long, needs to work with the applet calling protocol `openapp`.

#### Code Example

```js title="app.config.js"
export default {
  "pages": [
    "pages/index/index",
    "pages/my/my"
  ],
  "window": {
    "navigationBarTitleText": "京东小程序 Demo"
  },
  "tabBar": {
    "list": [{
      "pagePath": "pages/index/index",
      "text": "首页"
    }, {
      "pagePath": "pages/my/my",
      "text": "个人中心"
    }]
  },
  "debug": true,
  "pageAlias":{
    "index":"pages/index/index",
    "my":"pages/my/my"
  }
}
```

`openapp` Examples:

```
openap.jdmobile://virtual?params="{"category":"jump", "des":"jdmp", "appId":"ao123", "vapptype":1", "path":"","pageAlias":"my", "param":{}}
```

The above example will open `appId` for ao123, `pages/my/my`.

Note: Page path in `pageAlias` must exist in `pages` ; multiple individual names can correspond to the same page address, alias cannot be repeated. More `openapp` protocol details, refer to**open applet**This feature requires the Kyoto East `app` version `9.3.4` and applet engine `1.10.13` and above.

### QuickMenu

Some of the menus in the capsule buttons can be hidden by configuring the switch, default is `true` to show status. Configurable menu has：

| Properties    | Type    | Required | Default value | Note                                            |
|:------------- |:------- |:-------- |:------------- |:----------------------------------------------- |
| Shares        | Boolean | No       | true          | Show or hide push to friend (share) menu        |
| favorite      | Boolean | No       | true          | Show or hide watchmenu                          |
| sendToDesktop | Boolean | No       | true          | Show or hide send to desktop menu, Android only |

In the example below, sent to friends, follows, and sent to desktops will be hidden and will not be shown, the following example is：

#### Code Example

```js title="app.config.js"
export default {
  "pages": [
    "pages/index/index",
    "pages/my/my"
  ],
  "window": {
    "navigationBarTitleText": "京东小程序 Demo"
  },
  "quickMenu":{
    "share":false,
    "favorite":false,
    "sendToDesktop":false
  }
}
```

`QuickMenu` menu, can be hidden only if a boolean value is configured `false` and if there is an API that controls some menu concealment, then the API priority is greater than the configuration here, which is global and is only supported in `app.json`.
