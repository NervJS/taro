---
title: 页面配置
---

每一个小程序页面都可以使用 `.config.js` 文件来对本页面的窗口表现进行配置。页面中配置项在当前页面会覆盖全局配置 `app.config.json` 的 `window` 中相同的配置项。

文件需要 `export` 一个默认对象，配置项遵循**微信小程序规范**，并且对所有平台进行统一。

注意：

1. `page.config.js` 里 require 或 import 引用的 js 文件目前**没有经过 Babel 编译语法**。
2. 多端差异化逻辑可以使用 `process.env.TARO_ENV` 变量作条件判断来实现。
3. `page.config.js` 不支持多端文件的形式，如 `index.weapp.js` 这样是不起作用的。

### 配置项列表

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

其中，`usingComponents` 一般不需要配置，只有在需要与引用原生小程序组件的时候才需要配置。

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
