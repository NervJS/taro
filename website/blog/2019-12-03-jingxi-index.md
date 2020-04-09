---
title: 京喜首页（微信购物入口）跨端开发与优化实践 
author:aNd1coder
authorURL: https://github.com/aNd1coder
authorImageURL: https://avatars2.githubusercontent.com/u/168796?s=460&v=4
---

![image](https://img13.360buyimg.com/ling/jfs/t1/103274/2/4226/201268/5de6455aEf651e021/8013f336e45fc79c.png)

作者从技术选型、开发实录再到性能优化三个维度对微信购物入口「京喜」首页改版做了简单总结。

<!--truncate-->

## 背景介绍

随着今年的双十一落下帷幕，京喜（原京东拼购）也迎来了首捷。双十一前夕微信购物一级入口切换为京喜小程序，项目顺利通过近亿级的流量考验，在此与大家分享一点自己参与的工作。

<!-- more -->

在接手项目前，京喜业务已在线上稳定运行较长时间。但经过一段时间迭代维护后，发现首页存在以下问题：

1. H5 版本首页针对不同渠道开发了多套页面，对开发者维护和内容运营来说存在较大挑战，需投入大量人力成本；
2. 项目技术栈不统一，分别有传统 H5 开发、原生小程序开发、wqVue 框架开发，严重影响项目复杂度，迭代过程苦不堪言；
3. H5、小程序以及 RN 三端存在各自构建和发布流程，涉及较多工具及复杂系统流程，影响业务交付效率。

综上所述，京喜迎来一次改版契机。

## 改版目标

从前端角度来看，本次改版要实现以下目标：

- 升级并统一项目技术栈，解决项目技术栈混乱的现状；
- 使用一套代码，适配微信入口、手 Q 入口、微信小程序、京东 APP、京喜 APP、M 站六大业务场景，减少多套页面的维护成本，提升交付效率；
- 通过让 RN 技术在业务上的落地，完善团队在 App 端的技术储备；
- 优化页面性能及体验，为下沉市场用户提供优质的产品体验；

## 技术选型

京喜业务拥有非常丰富的产品形态，涵盖了 H5、微信小程序以及独立 APP 三种不同的端，对支持多端的开发框架有着天然的需求。

![京喜丰富的产品形态](https://img14.360buyimg.com/ling/jfs/t1/99778/13/1485/65058/5dc00468E7d60a4e0/5bb82c1ec5ce3dd7.jpg)

在技术选型上，我们选择团队自研的 [Taro](https://github.com/NervJS/taro/ "Taro") 多端统一开发解决方案。

> Taro 是一套遵循 React 语法规范的多端开发解决方案。
>
> 现如今市面上端的形态多种多样，Web、React-Native、微信小程序等各种端大行其道，当业务要求同时在不同的端都要求有所表现的时候，针对不同的端去编写多套代码的成本显然非常高，这时候只编写一套代码就能够适配到多端的能力就显得极为需要。
>
> 使用 Taro，我们可以只书写一套代码，再通过 Taro 的编译工具，将源代码分别编译出可以在不同端（微信/百度/支付宝/字节跳动/QQ 小程序、快应用、H5、React-Native 等）运行的代码。

选它有两个原因，一来是 Taro 已经成熟，内部和外部都有大量实践，内部有京东 7FRESH、京东到家等，外部有淘票票、猫眼试用等多个案例，可以放心投入到业务开发；二来团队成员都拥有使用 Taro 来开发内部组件库的经验，对业务快速完成有保障。

![组件库](https://img13.360buyimg.com/ling/jfs/t1/98736/39/2685/263027/5dd3b44dE4cc40299/6e5a359d73f0ef7f.png)

## 开发实录

由于首页改版的开发排期并不充裕，因此充分地复用已有基础能力（比如像请求、上报、跳转等必不可少的公共类库），能大量减少我们重复的工作量。话虽如此，但在三端统一开发过程中，我们仍遇到不少问题同时也带来解决方案，以下我们一一阐述。

### H5 篇

我们所有的页面都依赖现有业务的全局公共头尾及搜索栏等组件，这就不可避免的需要将 Taro 开发流程融入到现有开发和发布流程中去。同时公共组件都是通过 [SSI](https://en.wikipedia.org/wiki/Server_Side_Includes "SSI") 的方式引入和维护的，为了能在运行 `npm run dev:h5` 时预览到完整的页面效果，需要对 `index.html` 模版中的 SSI 语法进行解析，`index.html` 模版文件代码结构大致如下：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>京喜</title>
  <!--#include virtual="/sinclude/common/head_inc.shtml"-->
</head>
<body>
  <div id="m_common_header" style="display:none;"></div>
  <!--S 搜索框-->
  <div id="search_block" class="search_block"></div>
  <div id="smartboxBlock" style="display:none;"></div>
  <!--E 搜索框-->
  <div id="app" class="wx_wrap"></div>
  <!--#include virtual="/sinclude/common/foot.shtml"-->
</body>
</html>
```

可以看到模版中存在很多类似 `<!--#include virtual="..." -->` 格式的代码，这些就是通过 SSI 方式引入的 H5 公共组件，它的 `virtual` 属性指向的文件不存在于本地而是存在于服务器上的，所以我们遇到的第一个问题就是在本地解析这些文件，确保能预览到完整的页面效果，不然开发调试起来就非常的低效。好在 Taro 有暴露出 webpack 的配置，我们可以通过引入自定义加载器（这里就叫 `ssi-loader`）来解析这些代码的路径，然后请求服务器上的文件内容并进行替换即可，要实现这个功能只需在项目的 `config/dev.js` 中加入如下代码即可：

```js
module.exports = {
  h5: {
    webpackChain(chain, webpack) {
      chain.merge({
        module: {
          rule: {
            ssiLoader: {
              test: /\.html/,
              use: [
                {
                  loader: 'html-loader'
                },
                {
                  loader: 'ssi-loader',
                  options: {
                    locations: {
                      include: 'https://wqs.jd.com'
                    }
                  }
                }
              ]
            }
          }
        }
      })
    }
  }
}
```

这样就解决了本地开发调试难点，然后开开心心的进行页面开发。

当页面开发完成之后，接下来遇到的问题就是如何将前端资源部署到测试和生产环境。由于现有开发和发布流程都是基于内部已有的平台，我们临时定制一套也不太现实，所以需要将它融入到 Taro 的流程中去，这里我们引入了 `gulp` 来整合各种构建和发布等操作，只要构建出符合发布平台规范的目录即可利用它的静态资源构建、版本控制及服务器发布等能力，这样我们就打通了整个开发和发布流程。

这套拼凑起来的流程还存在不少的问题，对于新接手的同学有一点小繁琐，有着不少改善的空间，这也是接下来的重点工作方向。另外 Taro 的 H5 端之前是基于 SPA 模式，对于有着多页开发需求的项目来说不太友好，当时反馈给 Taro 团队负责 H5 的同学，很快得到了响应，目前 Taro 已支持 H5 多页开发模式，支持非常迅速。

### 小程序篇

由于开发完 H5 版之后，对应的业务逻辑就已经处理完了，接下来只需要处理小程序下的一些特殊逻辑（比如分享、前端测速上报等）即可，差异比较大的就是开发和发布流程。

这里讲一下如何在一个原生小程序项目中使用 Taro 进行开发，因为我们的 Taro 项目跟已有的原生小程序项目是独立的两个项目，所以需要将 Taro 项目的小程序代码编译到已有的原生小程序项目目录下，第一步要做的就是调整 Taro 配置 `config/index.js`，指定编译输出目录以及禁用 app 文件输出防止覆盖已有文件。

```js
const config = {
  // 自定义输出根目录
  outputRoot: process.argv[3] === 'weapp' ? '../.temp' : 'dist',
  // 不输出 app.js 和 app.json 文件
  weapp: {
    appOutput: false
  }
}
```

由于京喜以前是主购小程序的一个栏目，后面独立成了独立的小程序，但是核心购物流程还是复用的主购小程序，所以这让情况变得更加复杂。这里还是通过 `gulp` 来进行繁琐的目录文件处理，比如我们的小程序页面和组件都需要继承主购小程序的 `JDPage` 和 `JDComponent` 基类，所以在进行文件复制之前需要进行代码替换，代码如下：

```js
// WEAPP
const basePath = `../.temp`
const destPaths = [`${basePath}/pages/index/`, `${basePath}/pages/components/`]
const destFiles = destPaths.map(item => `${item}**/*.js`)

/*
 * 基类替换
 */
function replaceBaseComponent (files) {
  return (
    gulp
      .src(files || destFiles, { base: basePath })
      .pipe(
        replace(
          /\b(Page|Component)(\(require\(['"](.*? "'"")\/npm\/)(.*)(createComponent.*)/,
          function(match, p1, p2, p3, p4, p5) {
            const type =
              (p5 || '').indexOf('true') != -1 ||
              (p5 || '').indexOf('!0') != -1
                ? 'Page'
                : 'Component'
            if (type == 'Page') p5 = p5.replace('))', '), true)') // 新：page.js基类要多传一个参数
            const reservedParts = p2 + p4 + p5
            // const type = p1
            // const reservedParts = p2
            const rootPath = p3

            const clsName = type == 'Page' ? 'JDPage' : 'JDComponent'
            const baseFile = type == 'Page' ? 'page.taro.js' : 'component.js'

            console.log(
              `🌝 Replace with \`${clsName}\` successfully: ${this.file.path.replace(
                /.*?wxapp\//,
                'wxapp/'
              )}`
            )
            return `new (require("${rootPath}/bases/${baseFile}").${clsName})${reservedParts}`
          }
        )
      )
      .pipe(gulp.dest(basePath))
  )
}

// 基类替换
gulp.task('replace-base-component', () => replaceBaseComponent())
```

还有很多类似这样的骚操作，虽然比较麻烦，但是只需要处理一次，后续也很少改动。

### RN 篇

对于 RN 开发，也是第一次将它落地到实际的业务项目中，所以大部分时候都是伴随着各种未知的坑不断前行，所以这里也友情提示一下，对于从未使用过的技术，还是需要一些耐心的，遇到问题勤查勤问。

由于京喜 APP 是复用京东技术中台的基础框架和 JDReact 引擎，所以整个的开发和部署都是遵循 JDReact 已有的流程，画了一张大致的流程图如下：

![京喜开发发布流程](https://img10.360buyimg.com/ling/jfs/t1/84738/19/1551/59434/5dc02754E930f59f2/ebe7b01308771a91.png)

> JDReact 平台是在 Facebook ReactNative 开源框架基础上，进行了深度二次开发和功能扩展。不仅打通了 Android/iOS/Web 三端平台，而且对京东移动端基础业务能力进行了 SDK 级别的封装，提供了统一、易于开发的 API。业务开发者可以通过 JDReact SDK 平台进行快速京东业务开发，并且不依赖发版就能无缝集成到客户端(android/iOS)或者转换成 Web 页面进行线上部署，真正实现了一次开发，快速部署三端。

由于京喜 APP 的 JDReact 模块都是独立的 git 仓库，所以需要调整我们 Taro 项目配置 `config/index.js` 的编译输出路径如下：

```js
rn: {
  outPath: '../jdreact-jsbundle-jdreactpingouindex'
}
```

这样，当我们运行 `yarn run dev:rn` 进行本地开发时，文件自动编译到了 JDReact 项目，接下来我们就可以用模拟器或者真机来进行预览调试了。当我们在进行本地开发调试的时候，最高效的方式还是推荐用 Taro 官方提供的 [`taro-native-shell`](https://github.com/NervJS/taro-native-shell "`taro-native-shell`") 原生 React Native 壳子来启动我们的项目，详细的配置参照该项目的 README 进行配置即可。

由于 React Native 官方提供的 [Remote Debugger](https://facebook.github.io/react-native/docs/debugging.html#chrome-developer-tools "Remote Debugger") 功能非常弱，推荐使用 [React Native Debugger](https://github.com/jhen0409/react-native-debugger "React Native Debugger") 来进行本地 RN 调试，提供了更为丰富的功能，基本接近 H5 和小程序的调试体验。

![React Native Debugger 界面](https://img20.360buyimg.com/ling/jfs/t1/93257/12/1534/249244/5dc0282eE862961c6/bf7b8367ac970ecf.png)

这样我们就拥有了一个正常的开发调试环境，接下来就可以进行高效的开发了，由于我们前面在 H5 和小程序版本阶段已经完成了绝大部分的业务逻辑开发，所以针对 RN 版本的主要工作集中在 iOS 和安卓不同机型的样式和交互适配上。

在样式适配这块，不得不提下 Taro 针对我们常见的场景提供了一些最佳实践，可以作为布局参考：

- 固定尺寸（按钮、文字大小、间距）：写 PX / Px / pX
- 保持宽高比（比如 banner 图片）：`Image` 组件处理
- 间距固定，内容自适应（比如产品卡片宽度）：使用 `flex` 布局
- 按屏幕等比缩放：使用 px 单位，编译时处理（`scalePx2dp` 动态计算）

#### Taro RN 最佳实践集锦

在实际开发过程中也遇到不少兼容性问题，这里整理出来以供大家参考：

- 文本要用 `<Text>` 标签包起来，因为 RN 没有 `textNode` 的概念；
- 使用 Swiper 时在外面包一个 View，否则设置 `margin` 后会导致安卓下高度异常；
- `Cannot read property 'x' of undefined`，Swiper 底层使用的 react-native-swiper 导致的问题，Disable Remote JS Debug 就不会出现。
- 图片默认尺寸不对，RN 不会自动帮助设置图片尺寸，而是交给开发者自己处理，故意这样设计的；
- Image 组件上不可以设置 onClick
- 实现基线对齐：`vertical-align: baseline`，用 `<Text>` 把需要基线对齐的组件包住即可。

  ```jsx
  <Text>
    <Text style={{ fontSize: 20 }}>abc</Text>
    <Text style={{ fontSize: 40 }}>123</Text>
  </Text>
  ```

- 尽量避免使用 `line-height` ，在安卓和 iOS 下表现不一致，而且即使设置为与 `fontSize` 相同也会导致裁剪；
- android 调试生产环境的 bundle，摇手机，选 Dev Setting，取消勾选第一项 Dev 即可；
- iOS 调试生产环境的 bundle，`AppDelegate.m` 中增加一行语句关闭 dev 即可：

  ```objc
    [[RCTBundleURLProvider sharedSettings] setEnableDev:false];
    // 找到这行，并在它的上面增加上面这行
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  ```

- `<Text>` 与 `<View>` 支持的 style 属性不相同。

      > [Text Style Props](https://facebook.github.io/react-native/docs/text-style-props "Text Style Props") & [View Style Props](https://facebook.github.io/

  react-native/docs/view-style-props)

- render 方法中不要返回空字符串

  下面的代码在 android 下会报错（empty_string 内容为空字符串）

  ```jsx
  <View>
    {empty_string && <Text></Text>}
  </View>
  ```

  因为 `empty_string && <Text></Text>` 的返回值是空字符串，RN 尝试把字符串添加到 View 的 children 时在安卓环境下会报错：

  ``` js
  Error: Cannot add a child that doesn't have a YogaNode
  ```

- `border-radius` 导致背景色异常，单独给某个角设置圆角时，没有设置圆角的边会出现一块与背景色颜色相同，但半透明的色块。

  1. 添加外层容器设置圆角与超出隐藏
  2. 全部角都设置圆角然后使用 `transform:tanslate()` 藏起不想要的圆角

- 透明 View 无法点击的问题，给设置了 onClick 的元素添加透明背景色即可：

``` js
style={{ backgroundColor: "transparent" }}
```
不可以用 scss 写，只有写在 JSX 上的才有效，Taro 编译时可能把透明背景色忽略了。

- 一像素缝隙问题

  可能是 RN 布局引擎的问题，或单位转换以及浏览器渲染中的精度损失问题。可以调整页面结构来绕过。
  或者简单粗暴一点，设置负 margin 值盖住缝隙。

### 跨平台开发

#### JS 文件

##### 1、文件拆分的方式

要"完美"的编译出三端代码，首先要解决的是公共类库的适配问题，好在兄弟业务团队已经沉淀有完成度较高的三端公共类库，利用 Taro 提供的跨平台开发能力，抹平三端方法名和参数不统一的情况，即可很好的解决公共类库的适配问题，如下所示：

```bash
.
├── goto.h5.js
├── goto.rn.js
├── goto.weapp.js
├── request.h5.js
├── request.rn.js
├── request.weapp.js
└── ...
```

以 `request` 公共组件为例，三端代码如下：

request.h5.js

```js
import request from '@legos/request'
export { request }
```

request.rn.js

```js
import request from '@wqvue/jdreact-request'
export { request }
```

request.weapp.js（由于小程序的公共组件没有发布至 npm，这里引用的本地项目源文件）

```js
import { request } from '../../../common/request/request.js'
export { request }
```

如遇到需要适配的方法参数不一致或者增加额外处理的情况，可进行再包装确保最终输出的接口一致，如下：

goto.rn.js

```js
import jump from '@wqvue/jdreact-jump'

function goto(url, params = {}, options = {}) {
  jump(url, options.des || 'm', options.source || 'JDPingou', params)
}

export default goto
```

文件引入的时候我们正常使用就好，Taro 在编译的时候为我们编译对应的平台的文件

```js
import goto from './goto.js'
```

##### 2、条件编译的方式

解决了公共类库适配之后，接下来就可以专注于业务代码开发了，同样业务代码在三端也可能存差异的情况，可以用 Taro 提供的环境变量来达到目的，示例代码如下：

```js
if (process.env.TARO_ENV === 'h5') {
  this.speedReport(8) // [测速上报] 首屏渲染完成
} else if (process.env.TARO_ENV === 'weapp') {
  speed.mark(6).report() // [测速上报] 首屏渲染完成
} else if (process.env.TARO_ENV === 'rn') {
  speed.mark(7).report() // [测速上报] 首屏渲染完成
}
```

#### CSS 文件

以上是 js 的代码处理方式，对于 css 文件及代码，同样也有类似的处理。

##### 1、文件拆分的方式

比如 RN 相对于 H5 和小程序的样式就存在比较大的差异，RN 支持的样式是 CSS 的子集，所以很多看起来很常见的样式是不支持的，可以通过以下方式进行差异化处理：

```bash
├── index.base.scss
├── index.rn.scss
├── index.scss
```

这里以 `index.base.scss` 作为三端都能兼容的公共样式（名字可以任取，不一定为 xxx.base.scss），`index.rn.scss` 则为 RN 端独特的样式，`index.scss` 则为 H5 和小程序独特的样式，因为 H5 和小程序样式基本上没有什么差异，这里合为一个文件处理。

##### 2、条件编译的方式

Taro 也支持样式文件内的条件编译，语法如下：

```scss
/* #ifdef %PLATFORM% */
// 指定平台保留
/* #endif */

/* #ifndef %PLATFORM% */
// 指定平台剔除
/* #endif */
```

`%PLATFORM%` 的取值请参考 [Taro 内置环境变量](https://nervjs.github.io/taro/docs/envs.html "Taro 内置环境变量")

以下为示例代码：

```scss
.selector {
  color: #fff;
  /* #ifndef RN */
  box-shadow: 1px 1px 1px rgba(0, 0, 0, .1);
  /* #endif */
}
```

编译为 H5 和小程序的样式为：

```scss
.selector {
  color: #fff;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, .1);
}
```

RN 的样式为：

```scss
.selector {
  color: #fff;
}
```

两种方式选其一即可，这样就能开开心心的编写业务代码了。

有些许遗憾的是产品经理对这次新版首页有着明确的上线优先级：先 H5 版，再微信小程序版，最后是 RN 版，这就为后续 RN 版本跟 H5 和 小程序版本分道扬镳埋下了伏笔，条件允许的话建议优先以 RN 版本为基准进行开发，以免开发完成 H5 和小程序之后发现对结构和样式进行大的调整，因为 RN 对样式确实会弱一些。

### 性能优化

#### 图片优化

电商性质的网站，会存在大量的素材或商品图片， 往往这些会对页面造成较大的性能影响。得益于京东图床服务，提供强大的图片定制功能，让我们在图片优化方面省去大量工作。以引入商品图片 `"https://img10.360buyimg.com/mobilecms/s355x355_jfs/t1/55430/24/116/143859/5cd27c99E71cc323f/0e8da8810fb49796.jpg!q70.dpg.webp"` 为样本，我们对图片应用做了部分优化：

- 根据容器大小适当裁剪图片尺寸：s355x355_jfs
- 根据网络环境设置图片品质参数：0e8da8810fb49796.jpg!q70
- 根据浏览器环境合理选择图片类型：0e8da8810fb49796.jpg!q70.dpg.webp

为 Image 标签设置 lazyload 属性，这样可以在 H5 和小程序下获得懒加载功能。

#### 接口聚合直出

起初京喜首页的首屏数据涉及的后端接口多达 20 余个，导致整体数据返回时间较长；为了解决此项痛点，我们联合后端团队，独立开发首屏专用的**聚合直出接口**。一方面，将众多接口请求合并成一个，减少接口联动请求带来的性能损耗；另一方面，将复杂的业务逻辑挪到后端处理，前端只负责视图渲染和交互即可，减少前端代码复杂度；通过此项优化，页面性能和体验得到极大改善。

#### 缓存优先策略

由于京喜业务主要围绕下沉市场，其用户群体的网络环境会更加复杂，要保障页面的性能，减少网络延时是一项重要措施。

为了提升用户二次访问的加载性能，我们决定采用**缓存优先策略**。即用户每次访问页面时所请求的主接口数据写入本地缓存，同时用户每次访问都优先加载缓存数据，形成一套规范的数据读取机制。通过优先读取本地缓存数据，可让页面内容在极短时间内完成渲染；另外，本地缓存数据亦可作为页面兜底数据，在用户网络超时或故障时使用，可避免页面空窗的情景出现。

![缓存优先策略](https://img20.360buyimg.com/ling/jfs/t1/50956/35/15492/42652/5dc2eaecE30ebcffd/c7e8c52679a3f2fe.jpg)

#### 高性能瀑布流长列表

首页紧接着首屏区域的是一个支持下滑加载的瀑布流长列表，每次滑到底部都会异步拉取 20 条数据，总计会拉取将近 500 条数据，这在 iOS 下交互体验还比较正常。但是在配置较低的安卓机型下，当滑动到 2 到 3 屏之后就开始出现严重卡顿，甚至会闪退。

针对这种场景也尝试过用 FlatList 和 SectionList 组件来优化，但是它们都要求规则等高的列表条目，于是不得不自己来实现不规则的瀑布流无限滚动加载。其核心思路是通过判断列表的条目是否在视窗内来决定图片是否渲染，要优化得更彻底些得话，甚至可以移除条目内所有内容只保留容器，以达到减少内容节点以及内存占用，不过在快速进行滑动时比较容易出现一片白框，算是为了性能损失一些体验，整体上来说是可以接受得。

由于 RN 下在获取元素坐标偏移等数据相对 H5 和小程序要麻烦得到，具体的实现细节可以查看抽离出来的简单实现[Taro 高性能瀑布流组件（for RN）](https://github.com/aNd1coder/taro-waterfall "Taro 高性能瀑布流组件（for RN）")。

## 写在最后

![三端达到像素级别的还原](https://img14.360buyimg.com/ling/jfs/t1/105266/16/1522/210358/5dc18d19E6401cb7a/ad1ab2372f08e6c4.jpg)

这篇文章从技术选型、开发实录再到性能优化三个维度对京喜首页改版做了简单总结。整个项目实践下来，证实 Taro 开发框架 已完全具备投入大型商业项目的条件。虽在多端开发适配上耗费了一些时间，但仍比各端独立开发维护工作量要少；在前端资源匮乏的今天，选择成熟的开发工具来控制成本、提升效率，已是各团队的首要工作目标。 同时，京喜作为京东战略级业务，拥有千万级别的流量入口，我们对页面的体验优化和性能改进远不止于此，希望每一次微小的改动能为用户带来愉悦的感受，始终为用户提供优质的产品体验。
