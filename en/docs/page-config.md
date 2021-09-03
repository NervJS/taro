---
title: Page Configuration
---

Each applet page can be configured for window performance using `.config.js`.The configuration item in the page will override the global configuration `app.config.json` in `window`.

The file requires `export` a default object, configuration item follows**micromessage applet norms**and unify all platforms.

Note：

1. `page.config.js` in required or import referenced js file is currently**not compiled syntax with Babel**.
2. Multiplexing logic can be implemented using `process.env.TARO_ENV` variable to make conditional judgements.
3. `page.config.js` does not support multi-end file format, such as `index.weapp.js` is not working.

### Configuration Item List

| Properties                   | Type                 | Default value | Description                                                                                                                 |
| ---------------------------- | -------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| navigationBarBackgroundColor | HexColor (hex color) | #000000       | Navigation bar background color, eg. #000000                                                                                |
| navigationBarTextStyle       | String               | White:        | Navigation bar header color, black / white only                                                                             |
| navigationBarTitleText       | String               |               | Navigation bar title text                                                                                                   |
| navigationStyle              | String               | default       | 导航栏样式，仅支持以下值：default 默认样式；custom 自定义导航栏，只保留右上角胶囊按钮                                                                          |
| backgroundColor              | String               |               | Background color of windows                                                                                                 |
| backgroundTextStyle          | String               | dark          | Drop loading style, only dark / light support                                                                               |
| backgroundColorTop           | String               | #ffffff       | Background color for top windows, only iOS supports                                                                         |
| backgroundColorBottom        | String               | #ffffff       | Background color of the bottom window, only iOS supports                                                                    |
| enablePullDownRefresh        | boolean              | false         | Whether or not to turn on the current page pull.                                                                            |
| onReachBottomDistance        | Number               | 50            | Pull up to bottom when triggering event                                                                                     |
| pageOrientation              | String               | Trait         | Screen rotation settings, support auto /portrait/landscape for regional changes                                             |
| disableScroll                | Boolean              | false         | Set true to allow the page to scroll up and down.<br />is valid only in page configuration, cannot be set in app.json |
| DisableSwipeBack             | Boolean              | false         | Disable page swipe right to return                                                                                          |
| usingComponent               | Object               | No            | Page Custom Component Configuration                                                                                         |

Of these,`usingComponents` generally does not require configuration, only if you need to use native applet components.

The level of support at each end is as follows:

| Properties                   | Micromessage applet                | Bracket applet             | Byte jump applet | PayPal applet | H5 | RN |
| ---------------------------- | ---------------------------------- | -------------------------- | ---------------- | ------------- | -- | -- |
| navigationBarBackgroundColor | ✔️                                 | ✔️                         | ✔️               | ✔️            | ✔️ | ✔️ |
| navigationBarTextStyle       | ✔️                                 | ✔️                         | ✔️               | ✘             | ✔️ | ✔️ |
| navigationBarTitleText       | ✔️                                 | ✔️                         | ✔️               | ✔️            | ✔️ | ✔️ |
| navigationStyle              | ✔️(Microletter client 6.6.0)       | ✔️(100 App version 11.1.0) | ✔️               | ✘             | ✘  | ✔️ |
| backgroundColor              | ✔️                                 | ✔️                         | ✔️               | ✘             | ✘  | ✔️ |
| backgroundTextStyle          | ✔️                                 | ✔️                         | ✔️               | ✘             | ✘  | ✔️ |
| backgroundColorTop           | ✔️(Microletter client 6.5.16)      | ✘                          | ✔️               | ✘             | ✘  | ✘  |
| backgroundColorBottom        | ✔️(Microletter client 6.5.16)      | ✘                          | ✔️               | ✘             | ✘  | ✘  |
| enablePullDownRefresh        | ✔️                                 | ✔️                         | ✔️               | ✔️            | ✘  | ✘  |
| onReachBottomDistance        | ✔️                                 | ✔️                         | ✔️               | ✘             | ✘  | ✘  |
| pageOrientation              | ✔️2.4.0 (auto) / 2.5.0 (landscape) | ✘                          | ✘                | ✘             | ✘  | ✘  |
| disableScroll                | ✔️                                 | ✘                          | ✘                | ✘             | ✘  | ✔️ |
| DisableSwipeBack             | ✔️                                 | ✘                          | ✘                | ✘             | ✘  | ✘  |
| usingComponent               | ✔️                                 | ✔️                         | ✔️               | ✔️            | ✘  | ✘  |
