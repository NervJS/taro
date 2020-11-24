### Taro和快应用配置差异
如果希望自己现在写的Taro程序日后能更平滑的转换到快应用，在十大厂商的多个入口(搜索、语音、浏览器、负一屏)快速上线，就需要了解Taro和快应用的配置差异，由于Taro是立足于微信小程序的开发框架，因此只需要比较微信小程序和快应用的官方文档即可了解差异，以生态更完善的微信小程序为基础整理出如下表格：

| 微信小程序属性                                               | 类型     | 必填 | 描述                                                         | 对应快应用属性  |
| :----------------------------------------------------------- | :------- | :--- | :----------------------------------------------------------- | :-------------- |
| [pages](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#pages) | string[] | 是   | 页面路径列表                                                 | router.pages    |
| [window](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#window) | Object   | 否   | 全局的默认窗口表现                                           | display         |
| [tabBar](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#tabBar) | Object   | 否   | 底部 `tab` 栏的表现                                          | 无              |
| [networkTimeout](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#networkTimeout) | Object   | 否   | 网络超时时间                                                 | 无              |
| [functionalPages](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#functionalPages) | boolean  | 否   | 是否启用插件功能页，默认关闭                                 | 无              |
| [subpackages](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#subpackages) | Object[] | 否   | 分包结构配置                                                 | subpackages     |
| [workers](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#workers) | string   | 否   | `Worker` 代码放置的目录                                      | 无              |
| [requiredBackgroundModes](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#requiredBackgroundModes) | string[] | 否   | 需要在后台使用的能力，如「音乐播放」                         | features        |
| [plugins](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#plugins) | Object   | 否   | 使用到的插件                                                 | 无              |
| [preloadRule](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#preloadRule) | Object   | 否   | 分包预下载规则                                               | 无              |
| [resizable](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#resizable) | boolean  | 否   | iPad 小程序是否支持屏幕旋转，默认关闭                        | 无              |
| [navigateToMiniProgramAppIdList](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#navigateToMiniProgramAppIdList) | string[] | 否   | 需要跳转的小程序列表，详见 [wx.navigateToMiniProgram](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/miniprogram-navigate/wx.navigateToMiniProgram.html) | 无              |
| [usingComponents](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#usingComponents) | Object   | 否   | 全局[自定义组件](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/(custom-component/README))配置 | 无              |
| [permission](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#permission) | Object   | 否   | 小程序接口权限相关设置                                       | 无              |
| [sitemapLocation](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#sitemapLocation) | String   | 是   | 指明 sitemap.json 的位置                                     | 无              |
| [style](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#style) | String   | 否   | 指定使用升级后的weui样式                                     | 无              |

以上是全局配置的差异，从表中可以看到微信小程序有非常多的定制属性，比如tabBar\plugins\sitemapLocation等，当然快应用也有很多定制属性，如下表加粗所示：

| 属性                   | 类型        | 默认值 | 必填   | 描述                                                         |
| :--------------------- | :---------- | :----- | :----- | :----------------------------------------------------------- |
| **package**            | **String**  | **-**  | **是** | **应用包名，确认与原生应用的包名不一致，推荐采用 com.company.module 的格式，如：com.example.demo** |
| **name**               | **String**  | **-**  | **是** | **应用名称，6 个汉字以内，与应用商店保存的名称一致，用于在桌面图标、弹窗等处显示应用名称** |
| **icon**               | **String**  | **-**  | **是** | **应用图标，提供 192x192 大小的即可**                        |
| **versionName**        | **String**  | **-**  | **否** | **应用版本名称，如：`"1.0"**`                                |
| **versionCode**        | **Integer** | **-**  | **是** | **应用版本号，从`1`自增，推荐每次重新上传包时versionCode+1**** |
| **minPlatformVersion** | **Integer** | **-**  | **否** | **支持的最小平台版本号，兼容性检查，避免上线后在低版本平台运行并导致不兼容；如果不填按照内测版本处理** |
| features               | Array       | -      | 否     | 接口列表，绝大部分接口都需要在这里声明，否则不能调用，详见每个接口的文档说明 |
| config                 | Object      | -      | 是     | 系统配置信息                                                 |
| router                 | Object      | -      | 是     | 路由信息                                                     |
| display                | Object      | -      | 否     | UI 显示相关配置                                              |
| subpackages `1040+`    | Object      | -      | 否     | 定义并启用分包加载                                           |

微信小程序还支持每个页面定制自己的页面配置json(大部分属性继承自[window](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#window))，而快应用的页面配置则统一由display.pages管理，从宏观上可以看到两类轻应用的配置差别，微观上我们也来分析一下：

- pages **VS** router.pages

微信的pages只是一个路径字符串数组，没有额外的信息，而快应用的pages有很多细腻的属性，比如filter属性，声明该属性之后，页面中可以使用$page获取打开页面的参数，还有launchMode可以指定启动模式，Taro为了兼容这一差异，使用customPageConfig属性进行适配，参考 https://docs.taro.zone/docs/quick-app。

- window **VS** display

| 微信小程序属性               | 描述                                                         | 快应用属性              |
| :--------------------------- | :----------------------------------------------------------- | :---------------------- |
| navigationBarBackgroundColor | 导航栏背景颜色，如 `#000000`                                 | titleBarBackgroundColor |
| navigationBarTextStyle       | 导航栏标题颜色，仅支持 `black` / `white`                     | titleBarTextColor       |
| navigationBarTitleText       | 导航栏标题文字内容                                           | titleBarText            |
| navigationStyle              | 导航栏样式，仅支持以下值： `default` 默认样式 `custom` 自定义导航栏，只保留右上角胶囊按钮。参见注 2。 | 无                      |
| backgroundColor              | 窗口的背景色                                                 | backgroundColor         |
| backgroundTextStyle          | 下拉 loading 的样式，仅支持 `dark` / `light`                 | 无                      |
| backgroundColorTop           | 顶部窗口的背景色，仅 iOS 支持                                | 无                      |
| backgroundColorBottom        | 底部窗口的背景色，仅 iOS 支持                                | 无                      |
| enablePullDownRefresh        | 是否开启全局的下拉刷新。 详见 [Page.onPullDownRefresh](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onpulldownrefresh) | 无                      |
| onReachBottomDistance        | 页面上拉触底事件触发时距页面底部距离，单位为 px。 详见 [Page.onReachBottom](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onreachbottom) | 无                      |
| pageOrientation              | 屏幕旋转设置，支持 `auto` / `portrait` / `landscape`  详见 [响应显示区域变化](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html) | orientation             |

微信小程序对背景和导航栏的样式配置更加细腻，快应用则新增了对沉浸式状态栏的管理。

| 属性                               | 类型                  | 默认值 | 描述                                                         |
| :--------------------------------- | :-------------------- | :----- | :----------------------------------------------------------- |
| statusBarImmersive `1050+`         | Boolean               | false  | 是否显示沉浸式状态栏                                         |
| statusBarTextStyle `1050+`         | light \| dark \| auto | auto   | 状态栏文字样式，有亮,暗和自动 当为自动时会根据状态栏背景色调整 |
| statusBarBackgroundColor `1050+`   | String                | -      | 状态栏背景色，默认值同标题栏背景色                           |
| statusBarBackgroundOpacity `1050+` | float(0-1.0)          | false  | 状态栏背景色不透明度，默认值同标题栏背景色不透明度           |

至于啥是沉浸式状态栏，[参考经验](https://jingyan.baidu.com/article/3d69c55122cd57f0cf02d728.html)

- subPackages **VS** subPackages

  既然是轻应用自然少不了分包机制，微信的subPackages 支持root\name\pages\independent字段，当independent字段为true时为独立分包，此时可以不需下载主包即可运行，否则为普通分包，当用户进入普通分包或主包内页面时，主包会被下载，快应用则支持name\resource字段，resource就是包名，运行时，快应用将优先加载基础包和页面所在分包，其余分包会自动在后台进行预加载。

  ------

  

以上就是Taro和快应用的配置对比啦。

参考链接：

[https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#全局配置)

[https://doc.quickapp.cn/framework/manifest.html](https://doc.quickapp.cn/framework/manifest.html)

