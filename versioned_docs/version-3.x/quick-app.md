---
title: 快应用端开发流程
---

> 从 **1.3 beta** 版本开始支持快应用开发<br/>
> 本章节主要讲解快应用端 环境安装-开发-调试-打包-发布 原理及流程

## 简介

Taro 支持快应用端开发

## 安装

### 搭建快应用环境

#### 手机安装调试器

调试器是一个 Android 应用程序，下载调试器 APK 详见[资源下载](https://www.quickapp.cn/docCenter/post/69)

在手机上安装并打开调试器，按钮功能如下：

* **扫码安装**：配置 HTTP 服务器地址，下载 rpk 包，并唤起平台运行 rpk 包
* **本地安装**：选择手机文件系统中的 rpk 包，并唤起平台运行 rpk 包
* **在线更新**：重新发送 HTTP 请求，更新 rpk 包，并唤起平台运行 rpk 包
* **开始调试**：唤起平台运行 rpk 包，并启动远程调试
**注意**：若打开调试器无法点击按钮，请升级手机系统到最新版本或安装平台预览版

安装成功后如下图所示：

![img](https://doc.quickapp.cn/tutorial/overview/images/img2.png)

#### 手机安装平台预览版

较新的系统版本中内置平台正式版，开发调试平台新功能可使用平台预览版

平台预览版存在以下优缺点：

* 优点：迭代速度快，可立即体验平台新功能
* 缺点：实现与真实的运行环境存在差异，对厂商服务和第三方服务的支持存在缺陷
平台预览版是一个 Android 应用程序，下载平台预览版 APK 详见[资源下载](https://www.quickapp.cn/docCenter/post/69)

下载安装成功后，在手机调试器中点击切换运行平台至org.hapjs.mockup，即可在平台预览版上安装运行 rpk 包

### 开发调试

在手机上安装完调试器后，就可以执行 Taro 的快应用编译命令开始编译了

```bash
$ taro build --type quickapp --watch
```

在编译完成后会遇到如下输出结果

![](https://img11.360buyimg.com/ling/jfs/t1/133888/5/12321/688893/5f89398bE0ac357d2/066a38b5f13dc2fd.jpg)

Taro 在将代码编译完后，会自动下载快应用的容器模板，同时安装好相关的依赖，随后就会自动启动快应用的服务，此时，只需要使用手机上安装的调试器扫码就能直接在手机上进行调试了。

### 使用 IDE

https://doc.quickapp.cn/tutorial/ide/overview.html

### 快应用配置

在 Taro 编译适配快应用需要进行一些配置，适配的具体原因可以参考[Taro和快应用配置差异](./taro-quickapp-manifest.md#Taro和快应用配置差异)，通过在项目根目录下添加 `project.quickapp.json` 大体的配置项可以参考快应用官方文档的 [manifest 配置](https://doc.quickapp.cn/framework/manifest.html)，而 Taro 中支持以下配置：

|属性|类型|默认值|必填|描述|
| :-----| :---- | :---- | :---- | :---- |
|package|String|-|是|应用包名，确认与原生应用的包名不一致，推荐采用 com.company.module 的格式，如：com.example.demo|
|name|String|-|是|应用名称，6 个汉字以内，与应用商店保存的名称一致，用于在桌面图标、弹窗等处显示应用名称|
|icon|String|-|是|应用图标，提供 192x192 大小的即可|
|versionName|String|-|否|应用版本名称，如："1.0"|
|versionCode|Integer|-|是|应用版本号，从1自增，推荐每次重新上传包时versionCode+1|
|minPlatformVersion|Integer|-|否|支持的最小平台版本号，兼容性检查，避免上线后在低版本平台运行并导致不兼容；如果不填按照内测版本处理|
|features|Array|-|否|接口列表，绝大部分接口都需要在这里声明，否则不能调用，详见每个接口的文档说明|
|config|Object|-|是|系统配置信息，详见[说明](https://doc.quickapp.cn/framework/manifest.html#config)|
|subpackages `1040+`|Object|-|否|定义并启用分包加载，详见[说明](https://doc.quickapp.cn/framework/manifest.html#subpackages)|

可以看出，相比于快应用官方的配置项，Taro 中支持的配置项缺少了 [router](https://doc.quickapp.cn/framework/manifest.html#router) 与 [display](https://doc.quickapp.cn/framework/manifest.html#display) 配置，这是因为这两项配置在 Taro 编译时会根据用户代码直接生成，不再需要额外配置。

而为了让用户更加方便进行快应用相关配置，Taro 增加了一些额外的配置项，例如：

`customPageConfig` 是为了让用户可以为每个页面配置快应用独有的 `filter` 与 `launchMode` 它直接配置在 `project.quickapp.json` 中，它是一个对象的类型，其 key 值即为页面路径，与 **入口文件** 中 `config` 下 `pages` 数组中配置的页面路径保持一致，常见例子如下

```json
{
  "customPageConfig": {
    "pages/index/index": {
      "filter": {
        "<action>": {
          "uri": "<pattern>"
        }
      },
      "launchMode": "standard"
    }
  }
}
```

一个典型的 `project.quickapp.json` 配置参考[例子](https://github.com/NervJS/taro/blob/master/packages/taro-cli/src/config/manifest.default.json)

### Taro组件和快应用组件差异剖析

​       Taro已经可以编译出可在微信/百度/支付宝/字节跳动小程序、H5、React-Native运行的代码，近期也增加了快应用的支持，那必不可少的一步就是组件库的转换，众所周知小程序开发离不开三大要素——界面表现（结构、外观）层、逻辑处理层与系统接口层（网络、存储与媒体等），其中界面结构指的就是组件库，那立足于微信小程序的Taro组件和快应用组件有何异同？Taro是如何处理这些差异的？且看下文.

​      小程序官网放出来了一个[体验小程序](https://github.com/wechat-miniprogram/miniprogram-demo)用来展示它的组件 / API / 云开发能力，快应用官方也出了一个能力展示的开源项目[sample](https://github.com/quickappcn/sample),乍看好像差不多，其实两者之间的差异还是很多的，由于Taro组件基本上是微信小程序组件变为首字母大写之后形成的，下面以微信小程序组件为基准，看看快应用的组件能力如何，首先看视图容器：

## 视图容器

| 微信小程序组件                                               | 功能说明                                                     | 对应快应用组件                                        | Taro如何模拟                                                 |
| :----------------------------------------------------------- | :----------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| [cover-image](https://developers.weixin.qq.com/miniprogram/dev/component/cover-image.html) | 覆盖在原生组件之上的图片视图                                 | 无                                                    | 用image模拟，丢失bindload和binderror事件                     |
| [cover-view](https://developers.weixin.qq.com/miniprogram/dev/component/cover-view.html) | 覆盖在原生组件之上的文本视图                                 | 无                                                    | 用div模拟，丢失scroll-top属性                                |
| [movable-area](https://developers.weixin.qq.com/miniprogram/dev/component/movable-area.html) | [movable-view](https://developers.weixin.qq.com/miniprogram/dev/component/movable-view.html)的可移动区域 | 无                                                    | 用div模拟，丢失scale-area属性                                |
| [movable-view](https://developers.weixin.qq.com/miniprogram/dev/component/movable-view.html) | 可移动的视图容器，在页面中可以拖拽滑动                       | 无                                                    | 用div模拟，丢失所有属性                                      |
| [scroll-view](https://developers.weixin.qq.com/miniprogram/dev/component/scroll-view.html) | 可滚动视图区域                                               | 无                                                    | 用div模拟，丢失所有属性                                      |
| [swiper](https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html) | 滑块视图容器                                                 | [swiper](https://doc.quickapp.cn/widgets/swiper.html) | 指示点颜色可通过样式补齐、丢失previous-margin、easing-function等属性， |
| [swiper-item](https://developers.weixin.qq.com/miniprogram/dev/component/swiper-item.html) | 仅可放置在[swiper](https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html)组件中，宽高自动设置为100% | 无                                                    | 用text或image模拟，丢失item-id属性                           |
| [view](https://developers.weixin.qq.com/miniprogram/dev/component/view.html) | 视图容器                                                     | 无                                                    | 用div模拟，丢失所有属性                                      |

再来看基础组件和表单组件：

## 基础组件

| 微信小程序组件                                               | 功能说明 | 对应快应用组件                                            | Taro如何模拟                                  |
| :----------------------------------------------------------- | :------- | --------------------------------------------------------- | --------------------------------------------- |
| [icon](https://developers.weixin.qq.com/miniprogram/dev/component/icon.html) | 图标     | 无                                                        | 用div模拟，丢失type\size\color属性            |
| [progress](https://developers.weixin.qq.com/miniprogram/dev/component/progress.html) | 进度条   | [progress](https://doc.quickapp.cn/widgets/progress.html) | 只保留了percent属性                           |
| [rich-text](https://developers.weixin.qq.com/miniprogram/dev/component/rich-text.html) | 富文本   | [richtext](https://doc.quickapp.cn/widgets/richtext.html) | nodes属性做一次AST映射到变量中，丢失space属性 |
| [text](https://developers.weixin.qq.com/miniprogram/dev/component/text.html) | 文本     | [text](https://doc.quickapp.cn/widgets/text.html)         | 少有的比微信丰富的组件，模拟之后丢失所有属性  |

## 表单组件

| 名称                                                         | 功能说明                                                     | 对应快应用组件                                            | Taro如何模拟                                     |
| :----------------------------------------------------------- | :----------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------ |
| [button](https://developers.weixin.qq.com/miniprogram/dev/component/button.html) | 按钮                                                         | 无                                                        | 用div模拟，丢失所有属性                          |
| [checkbox](https://developers.weixin.qq.com/miniprogram/dev/component/checkbox.html) | 多选项目                                                     | 无                                                        | 用input模拟，丢失color属性，仿真度高             |
| [checkbox-group](https://developers.weixin.qq.com/miniprogram/dev/component/checkbox-group.html) | 多项选择器，内部由多个[checkbox](https://developers.weixin.qq.com/miniprogram/dev/component/checkbox.html)组成 | 无                                                        | 用div模拟，丢失所有属性                          |
| [editor](https://developers.weixin.qq.com/miniprogram/dev/component/editor.html) | 富文本编辑器，可以对图片、文字进行编辑                       | 无                                                        | 用richtext模拟，丢失所有属性                     |
| [form](https://developers.weixin.qq.com/miniprogram/dev/component/form.html) | 表单                                                         | 无                                                        | 用div模拟，丢失所有属性                          |
| [input](https://developers.weixin.qq.com/miniprogram/dev/component/input.html) | 输入框                                                       | [input](https://doc.quickapp.cn/widgets/input.html)       | 丢失passwd、bindinput等属性                      |
| [label](https://developers.weixin.qq.com/miniprogram/dev/component/label.html) | 用来改进表单组件的可用性                                     | [label](https://doc.quickapp.cn/widgets/label.html)       | for属性对应target，但不支持子组件模拟            |
| [picker](https://developers.weixin.qq.com/miniprogram/dev/component/picker.html) | 从底部弹起的滚动选择器                                       | [picker](https://doc.quickapp.cn/widgets/picker.html)     | 丢失省市选择器类型，转换规则随type变化，模拟复杂 |
| [picker-view](https://developers.weixin.qq.com/miniprogram/dev/component/picker-view.html) | 嵌入页面的滚动选择器                                         | 无                                                        | 用div模拟，丢失所有属性                          |
| [picker-view-column](https://developers.weixin.qq.com/miniprogram/dev/component/picker-view-column.html) | 滚动选择器子项                                               | 无                                                        | 用div模拟，丢失所有属性                          |
| [radio](https://developers.weixin.qq.com/miniprogram/dev/component/radio.html) | 单选项目                                                     | 无                                                        | 用input模拟，丢失color属性，仿真度高             |
| [radio-group](https://developers.weixin.qq.com/miniprogram/dev/component/radio-group.html) | 单项选择器，内部由多个 [radio](https://developers.weixin.qq.com/miniprogram/dev/component/radio.html) 组成 | 无                                                        | 用div模拟，丢失所有属性                          |
| [slider](https://developers.weixin.qq.com/miniprogram/dev/component/slider.html) | 滑动选择器                                                   | [slider](https://doc.quickapp.cn/widgets/slider.html)     | 丢失color、block-size等属性                      |
| [switch](https://developers.weixin.qq.com/miniprogram/dev/component/switch.html) | 开关选择器                                                   | [switch](https://doc.quickapp.cn/widgets/switch.html)     | 丢失color、disabled等属性                        |
| [textarea](https://developers.weixin.qq.com/miniprogram/dev/component/textarea.html) | 多行输入框                                                   | [textarea](https://doc.quickapp.cn/widgets/textarea.html) | 只保留了placeholder、maxlength属性               |

最后是不常用到的导航、媒体、地图和画布组件对比

## 导航

| 名称                                                         | 功能说明                             | 对应快应用组件 | Taro如何模拟            |
| :----------------------------------------------------------- | :----------------------------------- | -------------- | ----------------------- |
| [functional-page-navigator](https://developers.weixin.qq.com/miniprogram/dev/component/functional-page-navigator.html) | 仅在插件中有效，用于跳转到插件功能页 | 无             | 用div模拟，丢失所有属性 |
| [navigator](https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html) | 页面链接                             | 无             | 用div模拟，丢失所有属性 |

## 媒体组件

| 名称                                                         | 功能说明       | 对应快应用组件                                        | Taro如何模拟                                     |
| :----------------------------------------------------------- | :------------- | ----------------------------------------------------- | ------------------------------------------------ |
| [audio](https://developers.weixin.qq.com/miniprogram/dev/component/audio.html) | 音频           | 无                                                    | div+slider+接口方式模拟，仅保留基本功能          |
| [camera](https://developers.weixin.qq.com/miniprogram/dev/component/camera.html) | 系统相机       | [camera](https://doc.quickapp.cn/widgets/camera.html) | 仅保留device-position、flash、binderror属性      |
| [image](https://developers.weixin.qq.com/miniprogram/dev/component/image.html) | 图片           | [image](https://doc.quickapp.cn/widgets/image.html)   | 仅保留src属性                                    |
| [live-player](https://developers.weixin.qq.com/miniprogram/dev/component/live-player.html) | 实时音视频播放 | 无                                                    | 用div模拟，丢失所有属性                          |
| [live-pusher](https://developers.weixin.qq.com/miniprogram/dev/component/live-pusher.html) | 实时音视频录制 | 无                                                    | 用div模拟，丢失所有属性                          |
| [video](https://developers.weixin.qq.com/miniprogram/dev/component/video.html) | 视频           | [video](https://doc.quickapp.cn/widgets/video.html)   | 只保留src、autoplay、poster、controls和muted属性 |

## 地图

| 名称                                                         | 功能说明 | 对应快应用组件                                  | Taro如何模拟                     |
| :----------------------------------------------------------- | :------- | ----------------------------------------------- | -------------------------------- |
| [map](https://developers.weixin.qq.com/miniprogram/dev/component/map.html) | 地图     | [map](https://doc.quickapp.cn/widgets/map.html) | 仿真度较高，属性可以做到一一映射 |

## 画布

| 名称                                                         | 功能说明 | 对应快应用组件                                        | Taro如何模拟                                         |
| :----------------------------------------------------------- | :------- | ----------------------------------------------------- | ---------------------------------------------------- |
| [canvas](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html) | 画布     | [canvas](https://doc.quickapp.cn/widgets/canvas.html) | 同名但一个是组件，一个是通过API模拟的，只能用div模拟 |

## 开放能力

| 名称                                                         | 功能说明               | 对应快应用组件 | Taro如何模拟            |
| :----------------------------------------------------------- | :--------------------- | -------------- | ----------------------- |
| [web-view](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html) | 承载网页的容器         | 无             | 通过web组件仿真         |
| [ad](https://developers.weixin.qq.com/miniprogram/dev/component/ad.html) | Banner 广告            | 无             | 用div模拟，丢失所有属性 |
| [official-account](https://developers.weixin.qq.com/miniprogram/dev/component/official-account.html) | 公众号关注组件         | 无             | 用div模拟，丢失所有属性 |
| [open-data](https://developers.weixin.qq.com/miniprogram/dev/component/open-data.html) | 用于展示微信开放的数据 | 无             | 用div模拟，丢失所有属性 |

从上面的数据来看，快应用支持的组件还很不完善，如果之前使用Taro开发微信小程序的话，想直接转到快应用是很难的（还有样式的严格限制），看到这里你可能会对快应用有点失望，但是快应用在手机端的原生渲染性能是微信小程序不能比的，下面的快应用特色组件会让你刮目相看：

1.使用list+list-item实现[流畅的滚动列表](https://doc.quickapp.cn/tutorial/widgets/list-tutorial.html)

2.新鲜的气泡组件[popup](https://doc.quickapp.cn/widgets/popup.html)

3.想实现盖楼功能? 看看这个堆叠组件[stack](https://doc.quickapp.cn/widgets/stack.html)

4.快应用也有tabbar，[tabs](https://doc.quickapp.cn/widgets/tabs.html) / tab-bar/tab-content三剑客

5.外卖应用必不可少的星级评分组件[rating](https://doc.quickapp.cn/widgets/rating.html)

------

以上就是Taro组件和快应用组件的一个概览对比，总结来说，如果想实现多端一致，请尽量在Taro里面使用仿真度高的组件，比如Swiper、Image、Text、Input、Label、Picker、Video、Map、Camera、Canvas、Slider、Textarea等，随着快应用不断完善，相信这些差异会逐渐补齐的。