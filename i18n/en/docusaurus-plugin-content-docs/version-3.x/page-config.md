---
title: Page Configuration
---

Each mini-program page can use the `.config.js` file to configure the window presentation of this page. The configuration items in the page will override the same configuration items in `window` of the global configuration `app.config.json` on the current page.

The file requires `export` a default object, and the configuration items follow the **WeChat mini-program specification** and are unified for all platforms.

Notes:

1. js files referenced by require or import in `page.config.js` are currently **not compiled by Babel compilation syntax**. 
2. The platform diff logic can be implemented using the `process.env.TARO_ENV` variable for conditional judgments. 
3. `page.config.js` does not support multi-terminated files like `index.weapp.js`, which does not work.

### Configuration Item List

| Property | Type | Defalut | Description |
| - | - | - | - |
| navigationBarBackgroundColor | HexColor | #000000 | Navigation bar background color,such as #000000|
| navigationBarTextStyle | String | white | Navigation bar header color, supported only black / white |
| navigationBarTitleText | String |  | Navigation bar title text |
| navigationStyle | String | default | Navigation bar style, only the following values are supported: default: defalut style, custom: Customize the navigation bar, keeping only the top-right corner button |
| backgroundColor | String |  | Background color of the window |
| backgroundTextStyle | String | dark | The drop-down loading style,  only  supported  dark / light  |
| backgroundColorTop | String | #ffffff | 顶Background color for top window, supported on iOS only  |
| backgroundColorBottom | String | #ffffff | Background color for the bottom window, supported on iOS only |
| enablePullDownRefresh | boolean | false | Whether to enable drop-down refresh of the current page |
| onReachBottomDistance | Number | 50 | The distance from the bottom of the page when the page pull-up bottom event is triggered, the unit is px |
|pageOrientation | String | portrait | Screen rotation settings, support auto / portrait / landscape |
| disableScroll | Boolean | false | Set to true and the page will not scroll up or down. <br />only works in the page configuration, and cannot be set in app.json |
| disableSwipeBack | Boolean | false | Disable page right swipe gesture to return  |
| usingComponents | Object | false | Page customization component configuration |

`usingComponents` generally does not need to be configured, but only when it needs to be configured with reference to native applet components.

 Support as follows

| Property | WeChat Mini-Program | Baidu Smart-Program | ByteDance Mini-Program | Alipay Mini-Program | H5 | React Native |
| - | - | - | - | - | - | - |
| navigationBarBackgroundColor | ✔️ | ✔️|✔️|✔️|✔️|✔️|
| navigationBarTextStyle | ✔️ | ✔️|✔️|  ✘ |✔️|✔️|
| navigationBarTitleText | ✔️ | ✔️|✔️| ✔️ |✔️|✔️|
| navigationStyle | ✔️ (WeChat App 6.6.0) | ✔️（Baidu App 11.1.0）|✔️|  ✘ | ✘| ✔️|
| backgroundColor | ✔️ | ✔️|✔️| ✘ |✘|✔️|
| backgroundTextStyle | ✔️ | ✔️|✔️| ✘ |✘|✔️|
| backgroundColorTop |✔️（WeChat App 6.5.16） | ✘|✔️| ✘ |✘|✘|
| backgroundColorBottom | ✔️（WeChat App 6.5.16） | ✘|✔️| ✘ |✘|✘|
| enablePullDownRefresh | ✔️ | ✔️|✔️| ✔️ |✘|✘|
| onReachBottomDistance | ✔️ | ✔️|✔️| ✘ |✘|✘|
|pageOrientation | ✔️2.4.0 (auto) / 2.5.0 (landscape) | ✘|✘| ✘ |✘|✘|
| disableScroll | ✔️ | ✘|✘| ✘ |✘|✔️|
| disableSwipeBack | ✔️ | ✘|✘| ✘ |✘|✘|
| usingComponents | ✔️ | ✔️|✔️| ✔️ |✘|✘|
