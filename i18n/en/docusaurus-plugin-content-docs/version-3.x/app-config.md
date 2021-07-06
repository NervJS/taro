---
title: Global Configuration
---

The `app.config.js` file in the root directory is used for global configuration of the  mini-program. The configuration items follow the **WeChat mini-program specification** and are unified for all platforms.

Attention.

1. The js file referenced by require or import in `app.config.js` currently **does not go through the Babel compilation syntax**. 
2. Differentiation logic can be implemented using the `process.env.TARO_ENV` variable as a conditional judgment.
3. `app.config.js` does not support multi-terminated files like `app.weapp.js`, which does not work.

## Common Configuration

Configurations supported in H5, React Native, and all Mini-program.

| Propery | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| [pages](#pages) | String Array | yes | List of page paths |
| [window](#window) | Object | no | Global default window |
| [tabBar](#tabbar) | Object | no | Bottom tab bar |
| [subPackages](#subpackages) | Object Array | no | Subcontract  configuration |

### pages

Used to specify which pages the applet consists of, each corresponding to a page ` path + file name ` information. The file name does not need to write the file suffix, the framework will automatically go to find the corresponding location of the file for processing.

**The first item of the array represents the initial page of the mini-program (home page). If you add/drop pages in the mini-program, you need to modify the pages array.**

Development Directory：

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

you need to write in the entry file configuration

```jsx title="app.config.js"
export default {
  pages: [
    'pages/index/index',
    'pages/logs/logs'
  ]
}
```

### window

Set the status bar, navigation bar, title, and window background color of the mini-program with the following configuration items:

| Proerty | Type | Defalut | Description |
| - | - | - | - |
| navigationBarBackgroundColor | HexColor | #000000 | Navigation bar background color,eg: #000000 |
| navigationBarTextStyle | String | white | Navigation bar header color, supported only black / white |
| navigationBarTitleText | String |  | Navigation bar title text |
| navigationStyle | String | default | Navigation bar style, only the following values are supported: default: defalut style, custom: Customize the navigation bar, keeping only the top-right corner button |
| backgroundColor | String |  | Background color of the window |
| backgroundTextStyle | String | dark | The drop-down loading style,  only  supported  dark / light |
| backgroundColorTop | String | #ffffff | Background color for top window, supported on iOS only |
| backgroundColorBottom | String | #ffffff | Background color for the bottom window, supported on iOS only |
| enablePullDownRefresh | boolean | false | Whether to enable drop-down refresh of the current page |
| onReachBottomDistance | Number | 50 | The distance from the bottom of the page when the page pull-up bottom event is triggered, the unit is px |
|pageOrientation | String | portrait | Screen rotation settings, support auto / portrait / landscape |

#### Support as follows

| Property | WeChat Mini-Program | Baidu Smart-Program | ByteDance Mini-Program | Alipay Mini-Program | H5 | React Native |
| - | - | - | - | - | - | - |
| navigationBarBackgroundColor | ✔️ | ✔️|✔️|✔️|✔️|✔️|
| navigationBarTextStyle | ✔️ | ✔️|✔️|  ✘ |✔️|✔️|
| navigationBarTitleText | ✔️ | ✔️|✔️| ✔️ |✔️|✔️|
| navigationStyle | ✔️ (WeChat App 6.6.0) | ✔️（Baidu App 11.1.0）|✔️|  ✘ | ✘| ✘|
| backgroundColor | ✔️ | ✔️|✔️| ✘ |✘|✘|
| backgroundTextStyle | ✔️ | ✔️|✔️| ✘ |✘|✘|
| backgroundColorTop |✔️ (WeChat App 6.5.16） | ✘|✔️| ✘ |✘|✘|
| backgroundColorBottom |✔️ (WeChat App 6.5.16） | ✘|✔️| ✘ |✘|✘|
| enablePullDownRefresh | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onReachBottomDistance | ✔️ | ✔️|✔️| ✘ |✘|✘|
|pageOrientation | ✔️ 2.4.0 (auto) / 2.5.0 (landscape) | ✘|✘| ✘ |✘|✘|

#### Code example

```jsx title="app.config.js"
export default {
  pages: [
    'pages/index/index',
    'pages/logs/logs'
  ],
  window: {
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'WeChat interface function demo',
    backgroundColor: '#eeeeee',
    backgroundTextStyle: 'light'
  }
}
```

### tabBar

If the mini-program is a multi-tab application, The tabBar configuration item allows you to specify how the tab bar should behave and the corresponding page to be displayed when the tab is switched. 

The configuration items are as follows:

| Property | Type |  Required | Default | Description |
| - | - | - | - | - |
| color | HexColor(Hexadecimal color values) | Yes |  | Default color for text on tab, only support  Hexadecimal color value|
| selectedColor | HexColor | Yes |  | Text selection color on tab, only support  Hexadecimal color value |
| backgroundColor | HexColor | Yes |  | tab backgroundColor , only support  Hexadecimal color value |
| borderStyle | String | Yes | black | tabbar border color， only support black / white |
| list | Array | Yes |  | tab list of at least 2 and at most 5 tabs |
| position | String | No | bottom | tabBar position, only support bottom / top |
| custom | Boolean | No | false | custom tabBar |

where list accepts an array of at least 2 and at most 5 tabs.
The tabs are sorted in the order of the array and each item is an object with the following Property values.

| Property | Type |  Required |  Description	 |
| - | - | - | - |
| pagePath | String | Yes |  The page path, must be defined first in the pages |
| text | String | Yes |  Button text on tab |
| iconPath | String | No |   Image path, icon size limit is 40kb, recommended size is 81px * 81px, web images are not supported. <br/>When position is top, the icon is not displayed. |
| selectedIconPath | String | No |  Image path when selected, icon size limit is 40kb, recommended size is 81px * 81px, web images are not supported.<br/>When position is top, the icon is not displayed.  |

#### Support as follows

| Property | WeChat Mini-Program |  Baidu Smart-Program  | ByteDance Mini-Program |  Alipay Mini-Program  | H5 | RN |
| - | - | - | - | - | - | - |
| color | ✔️ | ✔️|✔️|✔️|✔️|✔️|
| selectedColor | ✔️ | ✔️|✔️|  ✔️ |✔️|✔️|
| backgroundColor | ✔️ | ✔️|✔️| ✔️ |✔️|✔️|
| borderStyle | ✔️ | ✔️|✔️|  ✘ | ✔️| ✔️|
| list | ✔️ | ✔️|✔️| ✔️ |✔️|✔️|
| position | ✔️ | ✘|✔️| ✘ |✘|✘|
| custom |✔ (Base library 2.5.0 or higher) | ✘|✘| ✘ |✘|✘|

### subPackages

> H5 and RN can merge  `subPackages` into  `pages`

When enable [Subpackage Loading](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages.html), declare the project subcontract structure

## Mini-program specific property

Property is only supported in Mini-program, H5 and RN are not supported.

| Property | Type | Description |
| :--- | :--- | :--- |
| [networkTimeout](#networktimeout) | Object | Network timeout time |
| [debug](#debug) | Boolean | Whether to enable debug mode, default off |
| [permission](#permission) | Object | Mini-program interface permission-related settings |
| [requiredBackgroundModes](#requiredbackgroundmodes) | String Array | Capabilities that need to be used in the background, such as "Music Play" |
| [preloadRule](#preloadrule) | Object | Subpackage pre-download rules |
| [entryPagePath](#entrypagepath) | String | Default Launch Home |
| [workers](#workers) | String | Worker code directory |
| [navigateToMiniProgramAppIdList](#navigatetominiprogramappidlist) | String Array | For a list of jumping mini-program, see wx.navigateToMiniProgram |

### networkTimeout

<img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E7%99%BE%E5%BA%A6%E8%BD%BB%E5%BA%94%E7%94%A8.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%AD%97%E8%8A%82.png" width="25px" style={{verticalAlign: 'middle' }} />  <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

Timeout time for each type of network request, All units are in milliseconds.

| Property | Type |  Required | Default | Description |
| - | - | - | - | - |
| request | Number | No | 60000 | Timeout for [Taro.request](./apis/network/request/request.md) , unit: milliseconds |
| connectSocket | Number | No | 60000 | Timeout for [Taro.connectSocket](./apis/network/webSocket/connectSocket.md) , unit: milliseconds |
| uploadFile | Number | No | 60000 | Timeout for [Taro.uploadFile](./apis/network/upload/uploadFile.md) , unit: milliseconds |
| downloadFile | Number | No | 60000 | Timeout for [Taro.downloadFile](./apis/network/download/downloadFile.md) , unit: milliseconds |

### debug

Support situation： <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />  <img src="http://storage.jd.com/cjj-pub-images/icon_%E4%BA%AC%E4%B8%9C%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />  <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} /> 

You can enable `debug` mode in developer tools. In the console panel of developer tools, debug information is given in the form of `info`, which includes `Page` registration, page routing, data update, event triggering, etc. It can help developers to quickly locate some common problems.

### permission

Support situation:  <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E7%99%BE%E5%BA%A6%E8%BD%BB%E5%BA%94%E7%94%A8.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%AD%97%E8%8A%82.png" width="25px" style={{verticalAlign: 'middle' }} />  <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} /> 

Mini-program[Interface Permissions](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html)related settings. The field type is `Object` and the structure as follow: 

| Property | Type |  Required | Defalut | Description |
| - | - | - | - | - |
| scope.userLocation | PermissionObject | No |  | Location-related permission statement |

`PermissionObject` structure:

| Property | Type |  Required | Defalut | Description |
| - | - | - | - | - |
| desc | string | Yes |  | Description of the interface usage displayed when obtaining permissions. Maximum 30 characters |

#### Code Examples

```js title="app.config.js"
export default {
  pages: [
    'pages/index/index',
    'pages/logs/logs'
  ],
  permission: {
    'scope.userLocation': {
      desc: 'Your location information will be used to show the effect of the mini-program location interface'
    }
  }
}
```

![image](https://img10.360buyimg.com/ling/jfs/t1/132830/23/12399/20429/5f893793Ebafa6939/b5f6a390ac9bfd79.jpg)

### requiredBackgroundModes

Support situation: <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E7%99%BE%E5%BA%A6%E8%BD%BB%E5%BA%94%E7%94%A8.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

Declare the ability to require background operation, of type array. The following projects are currently supported.

- `audio`: Background music playback
- `location`: Background Location

#### Code Example

```js title="app.config.js"
export default {
  "pages": ["pages/index/index"],
  "requiredBackgroundModes": ["audio", "location"]
}
```

Note: The interface running in the background is affirmed here, and it can take effect directly on the development version and experience version, while the official version still needs to pass the audit.

### preloadRule

Support situation: <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E7%99%BE%E5%BA%A6%E8%BD%BB%E5%BA%94%E7%94%A8.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%AD%97%E8%8A%82.png" width="25px" style={{verticalAlign: 'middle' }} />

Declare the rules for subcontracting pre-downloads.

- [Wechat Mini-program Documents](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/preload.html)
- [Baidu Smart-Program Documents](https://smartprogram.baidu.com/docs/develop/framework/subpackages/#%E5%88%86%E5%8C%85%E9%A2%84%E4%B8%8B%E8%BD%BD%E8%A7%84%E5%88%99)
- [ByteDance Mini-Program Documents](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/basic-reference/general-configuration#preloadrule)

### entryPagePath

Support situation: <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />  <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%AD%97%E8%8A%82.png" width="25px" style={{verticalAlign: 'middle' }} />

Set the default launch path (home page) of the mini-program, common scenario is to launch from WeChat list page dropdown,  mini-program list launch, etc.  If not filled, it will default to the first item in the `pages` list. The parameter with page path is not supported.

#### Code Examples

```js title="app.config.js"
export default {
  "entryPagePath": "pages/index/index"
}
```


### workers

Support situation: <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} /> <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

Set the directory where Worker code is placed when using Worker to handle multi-threaded tasks.

- [Wechat Mini-program Documents - Worker](https://developers.weixin.qq.com/miniprogram/dev/framework/workers.html)
- [QQ Mini-program Documents - Worker](https://q.qq.com/wiki/develop/miniprogram/frame/basic_ability/basic_multiworker.html)

### navigateToMiniProgramAppIdList

Support situation: <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%AD%97%E8%8A%82.png" width="25px" style={{verticalAlign: 'middle' }} />  <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

When the mini-program needs to jump to other mini-program using the  [Taro.navigateToMiniProgram](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateToMiniProgram.html) interface, 
you need to declare the list of appId of the mini-program you want to jump to in the configuration file, you can fill in up to 10

## WeChat Mini-program specific Property

Property that is only supported in WeChat mini-program. <img src="http://storage.jd.com/cjj-pub-images/icon_%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

| Property | Type | Description |
| :--- | :--- | :--- |
| [functionalPages](#functionalpages) | Boolean | Whether to enable the plugin function page, default off |
| [plugins](#plugins) | Object | Plugins used |
| [resizable](#resizable) | Boolean | Whether the iPad mini-program supports screen rotation, the default is off |
| [usingComponents](#usingcomponents) | Object | Global custom component configuration |
| [sitemapLocation](#sitemaplocation) |	String |  Specify the location of sitemap.json  |
| [style](#style) |	String | Specify the use of the upgraded weui style |
| [useExtendedLib](#useextendedlib) |	Object | Specify the extension library to be referenced |
| [entranceDeclare](#entrancedeclare) |	Object |  WeChat messages open with mini-program |
| [darkmode](#darkmode) |	boolean | Mini-program support DarkMode |
| [themeLocation](#themelocation) |	String | Specify the location of theme.json |
| [lazyCodeLoading](#lazycodeloading) |	String | Configure custom component code for on-demand injection |
| [singlePage](#singlepage) |	Object | Single page mode related configuration |

### functionalPages

> Base library 2.1.0 and above support

Plugin owner mini-program needs to set this item to enable [Plugin Features Page](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/functional-pages.html)。

### plugins

> Base library 1.9.6 and above support

Declare the [plugin](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html) use by the mini-program。

### resizable

> Base library 2.3.0 and above support

Mini-program running on iPad can be set to support[Screen Rotation](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html)。
For mini-program running on PC, users can drag the window size in any proportion, and can also maximize the window in the applet menu.

### usingComponents

> WeChat Developer Tools version 1.02.1810190 and above support

The custom components declared here are considered global custom components and can be used directly in pages or custom components within the applet without further declaration.

### sitemapLocation

Specify the location of the [sitemap.json](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/sitemap.html) , The default is `sitemap.json`, which is the `sitemap.json` file named in the root directory.

### style

> Base library 2.8.0 and above support

WeChat App client 7.0 started with a major UI revamp. The mini-program has also undergone a style upgrade of the basic components. Configuring `"style": "v2"` in `app.json` indicates that the new version of the component style is enabled.

The components involved in this change are `button` `icon` `radio` `checkbox` `switch` `slider`. You can go to the sample applet to experience it.

### useExtendedLib

> Base library 2.2.1 and above support

Specify the extension library to be referenced. The following projects are currently supported.

- weui: WeUI Component Library

It is equivalent to introducing the latest version of the npm package associated with the corresponding extension library, without taking up the package size of the mini-program.
The rc tools version supports subpackage references. The usage is as follows.

#### Code example

```js title="app.config.js"
export default {
  "useExtendedLib": {
    "weui": true
  }
}
```

### entranceDeclare

> Supported by WeChat App version 7.0.9 and above, iOS is not supported yet

Chat location messages are opened with taxi-like mini-program,[refer to details](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/location-message.html)。

#### Code example

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

### darkmode

> Developer Tools 1.03.2004271 and above supported, Base Library 2.11.0 and above supported

WeChat iOS App `7.0.12` version and Android App `7.0.13` version officially support `DarkMode`.You can configure `"darkmode": true` to indicate the current mini-program can be adapted to `DarkMode`, all basic components will display different default styles according to the system theme, `navigation bar` and `tab bar` will also be automatically switched according to the developer's configuration.

After the configuration, please follow the [DarkMode Adaptation Guide](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/darkmode.html) to do the adaptation work other than the basic style by yourself.

#### Code Example

```js title="app.config.js"
export default {
  "darkmode": true
}
```

### themeLocation

Customize the path to [theme.json](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/darkmode.html#%E5%8F%98%E9%87%8F%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6-theme-json), When `"darkmode":true` is configured, the current profile is a Required item.

#### Code Example

```js title="app.config.js"
export default {
  "themeLocation": "/path/to/theme.json"
}
```

### lazyCodeLoading

> Base library 2.11.1 and above support, below 2.11.1 compatible but no optimization effect

Normally, during the launch of the mini-program, the code of all pages and custom components are injected, and custom components and pages that are not used in the current page are not actually used after the injection.

Since the base library version `2.11.1`, mini-program support selective injection of code necessary to reduce the mini-program  startup time and runtime memory.

#### Code Example

```js title="app.config.js"
export default {
  "lazyCodeLoading": "requiredComponents"
}
```

### singlePage

> Supported by Base Library 2.11.3 and above, currently opens in single page mode after sharing to friends (Beta)

Single page mode related configuration:

| Property | Type | Required | Defalult | Description |
| :--- | :--- | :--- | :--- | :--- |
| navigationBarFit | String | No | Automatic adjustment by default, `float` if the original page is a custom navigation bar, `squeezed` for No | The intersection status of the navigation bar with the page. A value of `float` means that the navigation bar floats on the page and intersects with the page; a value of `squeezed` means that the page is squeezed by the navigation bar and does not intersect with the page. |

## Baidu Smart-program specific Property

Properties that are only supported in Baidu smart-program. <img src="http://storage.jd.com/cjj-pub-images/icon_%E7%99%BE%E5%BA%A6%E8%BD%BB%E5%BA%94%E7%94%A8.png" width="25px" style={{verticalAlign: 'middle' }} />

| Property | Type | Description |
| :--- | :--- | :--- |
| [routes](#routes) | Array Object | Custom routing-related settings |
| [dynamicLib](#dynamiclib) | Object | Introducing dynamic libraries |

### routes

> Base Library 3.160.3 and above support

For more details, see [Custom Routes](https://smartprogram.baidu.com/docs/develop/framework/app_service_customroute/)

routes is an array, each item in the array represents a set of routing rules, specifically containing the following fields.

| Property | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| path | String | Yes | Access Path | "home" |
| page | String | Yes | Page source code file paths, starting from the root of the mini-program package | "pages/home/index" |

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
          
          "path": "home", 
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

For more information, please refer to [Using dynamic libraries](https://smartprogram.baidu.com/docs/develop/framework/dynamiclib_use/)

## QQ mini-program specific Property

Properties that are only supported in QQ mini-program. <img src="http://storage.jd.com/cjj-pub-images/icon_QQ%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

| Property | Type | Description |
| :--- | :--- | :--- |
| [groupIdList](#groupidlist) | String Object | You need to open the list of group numbers for the group profile card |

### groupIdList

For more information, please refer to [Button](https://q.qq.com/wiki/develop/miniprogram/component/form/button.html)

## Jingdong mini-program specific Property

Properties that are only supported in Jingdong mini-program.<img src="http://storage.jd.com/cjj-pub-images/icon_%E4%BA%AC%E4%B8%9C%E5%B0%8F%E7%A8%8B%E5%BA%8F.png" width="25px" style={{verticalAlign: 'middle' }} />

| Property | Type | Description |
| :--- | :--- | :--- |
| [pageAlias](#pagealias) | Object | Page alias |
| [quickMenu](#quickmenu) | Object | In-button menu configuration |

### pageAlias

Page alias, you can configure an alias for pages inside `pages`, which can be used when opening mini-programs, if the `path` path is unknown or the `path` path is too long, you need to use it with the mini-program calling protocol `openapp` protocol.

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

`openapp` expample as follow:

```
openapp.jdmobile://virtual?params={"category":"jump","des":"jdmp","appId":"ao123","vapptype":"1","path":"","pageAlias":"my","param":{}}
```

The above example will open the `pages/my/my` page with `appId` of ao123.

Note: The page path in `pageAlias` must exist in `pages`; multiple aliases can correspond to the same page address, and aliases cannot be repeated. For more details of `openapp` protocol, please refer to **Open Mini-program** This feature requires Jingdong `app` version `9.3.4` and mini-program engine `1.10.13` and above.

### quickMenu

Some of the menus inside the buttons can be shown and hidden by configuring switches, the default is `true` display state. The configurable menus as follow:

| Property | Type | Required | Defalut | Description |
| :--- | :--- | :--- | :--- | :--- |
| share | Boolean | No | true | Whether to show the push to friends (share) menu |
| favorite | Boolean | No | true | Whether to show the focus menu |
| sendToDesktop | Boolean | No | true | Whether to show send to desktop menu, only available for Android |

In the following example, the Send to Friends, Follow and Send to Desktop menus will all be hidden and will not be displayed, as follows.

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

The menu inside `quickMenu` can only be hidden if the boolean `false` is configured, and if there is an API that can control the hiding of certain menus, the priority of the API is greater than the configuration here, which is a global configuration and is only supported in `app.json`.
