---
title: 开发前注意
---

## 小程序

* 若使用 **微信小程序预览模式** ，则需下载并使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)添加项目进行预览，此时需要注意微信开发者工具的项目设置
  * 需要设置关闭 ES6 转 ES5 功能，开启可能报错
  * 需要设置关闭上传代码时样式自动补全，开启可能报错
  * 需要设置关闭代码压缩上传，开启可能报错

## React Native
> Note：如果要支持 React Native 端，必须采用 Flex 布局，并且样式选择器仅支持类选择器，且不支持 **组合器** [Combinators and groups of selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Combinators_and_multiple_selectors)。

以下选择器的写法都是不支持的，在样式转换时会自动忽略。

```css
.button.button_theme_islands{
  font-style: bold;
}

img + p {
  font-style: bold;
}

p ~ span {
  color: red;
}

div > span {
  background-color: DodgerBlue;
}

div span { background-color: DodgerBlue; }

```

### 常见问题
#### 样式和 CSS 一致吗？
React Native 的样式基于开源的跨平台布局引擎 [Yoga](https://github.com/facebook/yoga) ，样式基本上是实现了 CSS 的一个子集，并且属性名不完全一致，所以当你开始在考虑兼容 React Native 端之前，可以先简要了解一下 React Native 的样式：[React Native Layout Props](https://facebook.github.io/react-native/docs/layout-props)

我们在 React Native 中使用 Flexbox 规则来指定某个组件的子元素的布局。Flexbox 可以在不同屏幕尺寸上提供一致的布局结构。因此，如果你要考虑 React Native 端，那你的样式布局就得采用 Flex 布局。

Flex 布局入门，可以查看阮一峰的 [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

#### 是否支持全局样式？
入口文件 app.js 里面引入的样式就是全局样式，本地样式会覆盖全局样式。

#### 是否支持引入 React Native 的第三方库？
由于 Taro RN 端是基于 Expo，因此不支持 **需要自定义原生组件** 的第三方库。

#### 某些样式代码仅供 H5 端使用，如样式重置类的代码，怎么处理？
`/*postcss-pxtransform rn eject enable*/` 与 `/*postcss-pxtransform rn eject disable*/` 中间的代码， 在编译成 RN 端的样式的时候，会被删除。建议将 RN 不支持的但 H5 端又必不可少的样式放到这里面。如：样式重制相关的代码。

```css
/*postcss-pxtransform rn eject enable*/

.test {
  color: black;
}

/*postcss-pxtransform rn eject disable*/
```
#### box-shadow 能实现吗？
很遗憾，React Native 这方面支持得并不好（仅 ios 支持且支持程度有限），建议你不要报太大希望。

#### CSS 属性简写（Shorthands）支持吗？
仅接受 React Native 支持的值。例如 background 只接受一种颜色 `backgroundColor`，因为 React Native 的 Background 仅支持 `backgroundColor` 属性。React Native 支持的属性可见下面的 React Native 样式表。

#### border{Top,Right,Bottom,Left} 不支持？
border{Top,Right,Bottom,Left} 的简写（shorthands）不支持，因为 `borderStyle` 不能应用于单个边框。

#### React Native 不支持 background-image ，有什么解决办法吗？
使用 `Image 组件`，配合 Flex 布局，基本可以实现你的大部分需求。阅读一下这篇文章：[Background Images in React Native](https://thekevinscott.com/background-images-in-react-native/)，有助于你理解。

### 页面怎样设置高度 100%
RN 端页面默认 `disableScroll` 为 `true`，和微信小程序保持一致。要想设置高度 100% ，得先在页面配置：`disableScroll :false`，然后配合 `height: 100%;` 即可。

### 可以使用微信/支付宝支付吗？
由于 Expo 不支持原生的 SDK，所以无法通过集成原生的 SDK 的方式使用微信/支付宝支付。不过 RN 端提供了 `Taro.openUrl({url:''})`的 API 打开手机浏览器，然后走 [手机网站支付](https://docs.open.alipay.com/203/105288/) 的流程。


### 其他注意事项
1. **运行时** 报缺少包，需要要在 `.rn_temp` 目录里面安装。
2. 文字要包在 `Text` 组件里面，否则不显示。
3. `display:fixed` React Native 不支持
4. Animation 和 transform React Native 动画不支持
5. React Native 与 H5/小程序 的Flex 布局相关属性的默认值有差异

## 样式
React Native 的样式基于开源的跨平台布局引擎 [Yoga](https://github.com/facebook/yoga)  ，样式基本上是实现了 CSS 的一个子集，但是属性名不完全一致，具体的内容及相关差异可以查看文档 [React Native Layout Props](https://facebook.github.io/react-native/docs/layout-props)。Taro React Native 端样式文件的处理，主要可以分为以下几步：

![image](http://on-img.com/chart_image/5b8b8896e4b0d4d65bf1ddc7.png)

我们首先使用于处理器将 Scss/Less 样式文件转换为 CSS，这里我们借助 [css-to-react-native](https://github.com/styled-components/css-to-react-native)将 CSS 样式转换为 React Native Stylesheet objects。

下面的样式代码

```css
.myClass {
  font-size: 18px;
  line-height: 24px;
  color: red;
}

.other {
  padding: 1rem;
}
```

将被转换为

```js
{
  myClass: {
    fontSize: 18,
    lineHeight: 24,
    color: "red"
  },
  other: {
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16
  }
}
```
同时，为了保证样式开发的友好度，我们还实现了 StyleSheet 的错误校验，如果你写的样式 RN 不支持，会在编译时在终端报错。

下面是 React Native 样式表供大家参考，列出了 React Native 支持的所有样式属性，不熟悉 React Native样式的同学，在开发前，可以快速过一下：

### Properties 属性
#### Text 文本（18）
属性名 | 取值 | 描述
---|---|---
color | [&lt;color&gt;](#user-content-color) | 对应 `CSS` [color](http://css.doyoe.com/properties/color/color.htm) 属性
fontFamily | string | 对应 `CSS` [font-family](http://css.doyoe.com/properties/font/font-family.htm) 属性
fontSize | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [font-size](http://css.doyoe.com/properties/font/font-size.htm) 属性
fontStyle | `normal`, `italic` | 对应 `CSS` [font-style](http://css.doyoe.com/properties/font/font-style.htm) 属性，但阉割了 `oblique` 取值
fontWeight | `normal`, `bold` `100~900` | 对应 `CSS` [font-weight](http://css.doyoe.com/properties/font/font-weight.htm) 属性，但阉割了 `bolder, lighter` 取值
lineHeight | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [line-height](http://css.doyoe.com/properties/text/line-height.htm) 属性
textAlign | `auto`, `left`, `right`, `center`, `justify`<sup>`iOS`</sup> | 对应 `CSS` [text-align](http://css.doyoe.com/properties/text/text-align.htm) 属性，但增加了 `auto` 取值。当取值为 `justify` 时，在 `Android` 上会变为 `left`
textDecorationLine | `none`, `underline`, `line-through`, `underline line-through` | 对应 `CSS` [text-decoration-line](http://css.doyoe.com/properties/text-decoration/text-decoration-line.htm) 属性，但阉割了 `overline`, `blink` 取值
textShadowColor | [&lt;color&gt;](#user-content-color) | 对应 `CSS` [text-shadow](http://css.doyoe.com/properties/text-decoration/text-shadow.htm) 属性中的颜色定义
textShadowOffset | {<br>width:[&lt;number&gt;](#user-content-number),<br>height:[&lt;number&gt;](#user-content-number)<br>} | 对应 `CSS` [text-shadow](http://css.doyoe.com/properties/text-decoration/text-shadow.htm) 属性中的阴影偏移定义
textShadowRadius | [&lt;number&gt;](#user-content-number) | 在 `CSS` 中，阴影的圆角大小取决于元素的圆角定义，不需要额外定义
includeFontPadding<br /><sup>`Android`</sup> | [&lt;bool&gt;](#user-content-bool) | Android在默认情况下会为文字额外保留一些padding，以便留出空间摆放上标或是下标的文字。对于某些字体来说，这些额外的padding可能会导致文字难以垂直居中。如果你把textAlignVertical设置为center之后，文字看起来依然不在正中间，那么可以尝试将本属性设置为false
textAlignVertical<br /><sup>`Android`</sup> | `auto`, `top`, `bottom`, `center` | 对应 `CSS` [vertical-align](http://css.doyoe.com/properties/text/vertical-align.htm) 属性，增加了 `auto` 取值，`center` 取代了 `middle`，并阉割了 `baseline, sub` 等值
fontVariant<br /><sup>`iOS`</sup> | `small-caps`, `oldstyle-nums`, `lining-nums`, `tabular-nums`, `proportional-nums` | 对应 `CSS` [font-variant](http://css.doyoe.com/properties/font/font-variant.htm) 属性，但取值更丰富
letterSpacing<br /><sup>`iOS`</sup> | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [letter-spacing](http://css.doyoe.com/properties/text/letter-spacing.htm) 属性
textDecorationColor<br /><sup>`iOS`</sup> | [&lt;color&gt;](#user-content-color) | 对应 `CSS` [text-decoration-color](http://css.doyoe.com/properties/text-decoration/text-decoration-color.htm) 属性
textDecorationStyle<br /><sup>`iOS`</sup> | `solid`, `double`, `dotted`, `dashed` | 对应 `CSS` [text-decoration-style](http://css.doyoe.com/properties/text-decoration/text-decoration-style.htm) 属性，但阉割了 `wavy` 取值
writingDirection<br /><sup>`iOS`</sup> | `auto`, `ltr`, `rtl` | 对应 `CSS` [direction](http://css.doyoe.com/properties/writing-modes/direction.htm) 属性，增加了 `auto` 取值

<a name="dimension"></a>
#### Dimension 尺寸（6）
属性名 | 取值 | 描述
---|---|---
width | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [width](http://css.doyoe.com/properties/dimension/width.htm) 属性
minWidth | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [min-width](http://css.doyoe.com/properties/dimension/min-width.htm) 属性
maxWidth | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [max-width](http://css.doyoe.com/properties/dimension/max-width.htm) 属性
height | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [height](http://css.doyoe.com/properties/dimension/height.htm) 属性
minHeight | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [min-height](http://css.doyoe.com/properties/dimension/min-height.htm) 属性
maxHeight | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [max-height](http://css.doyoe.com/properties/dimension/max-height.htm) 属性

<a name="positioning"></a>
#### Positioning 定位（6）
属性名 | 取值 | 描述
---|---|---
position | `absolute`, `relative` | 对应 `CSS` [position](http://css.doyoe.com/properties/positioning/position.htm) 属性，但阉割了 `static, fixed` 取值
top | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [top](http://css.doyoe.com/properties/positioning/top.htm) 属性
right | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [right](http://css.doyoe.com/properties/positioning/right.htm) 属性
bottom | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [bottom](http://css.doyoe.com/properties/positioning/bottom.htm) 属性
left | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [left](http://css.doyoe.com/properties/positioning/left.htm) 属性
zIndex | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [z-index](http://css.doyoe.com/properties/positioning/z-index.htm) 属性

<a name="margin"></a>
#### Margin 外部白（7）
属性名 | 取值 | 描述
---|---|---
margin | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [margin](http://css.doyoe.com/properties/margin/margin.htm) 属性，不同的是，它只能定义一个参数，如需分别定义`上、右、下、左`4个方位的外补白，可以通过下面的单向外部白属性
marginHorizontal | [&lt;number&gt;](#user-content-number) | 无对应的 `CSS` 属性。其效果相当于同时设置 `marginRight` 和 `marginLeft`
marginVertical | [&lt;number&gt;](#user-content-number) | 无对应的 `CSS` 属性。其效果相当于同时设置 `marginTop` 和 `marginBottom`
marginTop | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [margin-top](http://css.doyoe.com/properties/margin/margin-top.htm) 属性
marginRight | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [margin-right](http://css.doyoe.com/properties/margin/margin-right.htm) 属性
marginBottom | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [margin-bottom](http://css.doyoe.com/properties/margin/margin-bottom.htm) 属性
marginLeft | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [margin-left](http://css.doyoe.com/properties/margin/margin-left.htm) 属性

<a name="padding"></a>
#### Padding 内部白（7）
属性名 | 取值 | 描述
---|---|---
padding | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [padding](http://css.doyoe.com/properties/padding/padding.htm) 属性，不同的是，它只能定义一个参数，如需分别定义`上、右、下、左`4个方位的内补白，可以通过下面的单向内部白属性
paddingHorizontal | [&lt;number&gt;](#user-content-number) | 无对应的 `CSS` 属性。其效果相当于同时设置 `paddingRight` 和 `paddingLeft`
paddingVertical | [&lt;number&gt;](#user-content-number) | 无对应的 `CSS` 属性。其效果相当于同时设置 `paddingTop` 和 `paddingBottom`
paddingTop | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [padding-top](http://css.doyoe.com/properties/padding/padding-top.htm) 属性
paddingRight | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [padding-right](http://css.doyoe.com/properties/padding/padding-right.htm) 属性
paddingBottom | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [padding-bottom](http://css.doyoe.com/properties/padding/padding-bottom.htm) 属性
paddingLeft | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [padding-left](http://css.doyoe.com/properties/padding/padding-left.htm) 属性

<a name="border"></a>
#### Border 边框（20）
属性名 | 取值 | 描述
---|---|---
borderStyle | `solid`, `dotted`, `dashed` | 对应 `CSS` `border-style` 属性，但阉割了 `none, hidden, double, groove, ridge, inset, outset` 取值，且无方向分拆属性
borderWidth | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `border-width` 属性
borderTopWidth | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `border-top-width` 属性
borderRightWidth | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `border-right-width` 属性
borderBottomWidth | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `border-bottom-width` 属性
borderLeftWidth | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `border-left-width` 属性
borderColor | [&lt;color&gt;](#user-content-color) | 对应 `CSS` `border-color` 属性
borderTopColor | [&lt;color&gt;](#user-content-color) | 对应 `CSS` `border-top-color` 属性
borderRightColor | [&lt;color&gt;](#user-content-color) | 对应 `CSS` `border-right-color` 属性
borderBottomColor | [&lt;color&gt;](#user-content-color) | 对应 `CSS` `border-bottom-color` 属性
borderLeftColor | [&lt;color&gt;](#user-content-color) | 对应 `CSS` `border-left-color` 属性
borderRadius | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `border-radius` 属性
borderTopLeftRadius | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `border-top-left-radius` 属性
borderTopRightRadius | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `border-top-right-radius` 属性
borderBottomLeftRadius | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `border-bottom-left-radius` 属性
borderBottomRightRadius | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `border-bottom-right-radius` 属性
shadowColor | [&lt;color&gt;](#user-content-color) | 对应 `CSS` [box-shadow](http://css.doyoe.com/properties/border/box-shadow.htm) 属性中的颜色定义
shadowOffset | {<br>width: [&lt;number&gt;](#user-content-number), <br>height: [&lt;number&gt;](#user-content-number)<br>} | 对应 `CSS` [box-shadow](http://css.doyoe.com/properties/border/box-shadow.htm) 属性中的阴影偏移定义
shadowRadius | [&lt;number&gt;](#user-content-number) | 在 `CSS` 中，阴影的圆角大小取决于元素的圆角定义，不需要额外定义
shadowOpacity | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [box-shadow](http://css.doyoe.com/properties/border/box-shadow.htm) 属性中的阴影透明度定义

<a name="background"></a>
#### Background 背景（1）
属性名 | 取值 | 描述
---|---|---
backgroundColor | [&lt;color&gt;](#user-content-color) | 对应 `CSS` `background-color` 属性

<a name="transform"></a>
#### Transform 转换（3）
属性名 | 取值 | 描述
---|---|---
transform | `[{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}, {skewX: string}, {skewY: string}]` | 对应 `CSS` `transform` 属性
transformMatrix | `TransformMatrixPropType` | 类似于 `CSS` 中 `transform` 属性的 `matrix()` 和 `matrix3d()` 函数
backfaceVisibility | `visible`, `hidden` | 对应 `CSS` `backface-visibility` 属性

<a name="flexbox"></a>
#### Flexbox 弹性盒（9）

我们在 React Native 中使用 Flexbox 规则来指定某个组件的子元素的布局。Flexbox 可以在不同屏幕尺寸上提供一致的布局结构。

一般来说，使用 `flexDirection`、`alignItems` 和 `justifyContent` 三个样式属性就已经能满足大多数布局需求。

##### Flex number
在 React Native 中 flex 的表现和 CSS 有些区别。 flex 在 RN 中只能为整数值，其具体表现请参考 [yoga 引擎](https://github.com/facebook/yoga) 的文档，

当 flex 为正整数时，组件是弹性的，尺寸和 flex 的值成正比。

当 flex 为 0 时，组件没有弹性，且尺寸和 width ，height 一致。

当 flex 为 -1 时，在空间足够的情况下，组件的尺寸和 width ，height 一致；但是在空间不足时，组件会被压缩至 minWidth 和 minHeight

##### Flex Direction
在组件的 style 中指定 flexDirection 可以决定布局的主轴。子元素是应该沿着 `水平轴(row)`方向排列，还是沿着 `竖直轴(column)` 方向排列呢？**默认值是 `竖直轴(column)` 方向**，这点和 CSS 不一样，想要注意。

##### Justify Content
在组件的 style 中指定 justifyContent 可以决定其子元素沿着主轴的排列方式。子元素是应该靠近主轴的起始端还是末尾段分布呢？亦或应该均匀分布？对应的这些可选项有：`flex-start`、`center`、`flex-end`、`space-around` 以及 `space-between`。

##### Align Items
在组件的 style 中指定 alignItems 可以决定其子元素沿着次轴（与主轴垂直的轴，比如若主轴方向为 row，则次轴方向为 column ）的排列方式。子元素是应该靠近次轴的起始端还是末尾段分布呢？亦或应该均匀分布？对应的这些可选项有：`flex-start`、`center`、`flex-end` 以及 `stretch`。

属性名 | 取值 | 描述
---|---|---
flex | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `flex` 属性，但只能为整数值
flexGrow | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `flex-grow` 属性
flexShrink | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `flex-shrink` 属性
flexBasis | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `flex-basis` 属性
flexDirection | `row`, `row-reverse`, `column`, `column-reverse` | 对应 `CSS` `flex-direction` 属性
flexWrap | `wrap`, `nowrap` | 对应 `CSS` `flex-wrap` 属性，但阉割了 `wrap-reverse` 取值
justifyContent | `flex-start`, `flex-end`, `center`, `space-between`, `space-around` | 对应 `CSS` `justify-content` 属性，但阉割了 `stretch` 取值。
alignItems | `flex-start`, `flex-end`, `center`, `stretch` | 对应 `CSS` `align-items` 属性，但阉割了 `baseline` 取值。
alignSelf | `auto`, `flex-start`, `flex-end`, `center`, `stretch` | 对应 `CSS` `align-self` 属性，但阉割了 `baseline` 取值


#### Other 其他
属性名 | 取值 | 描述
---|---|---
opacity | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `opacity` 属性
overflow | `visible`, `hidden`, `scroll` | 对应 `CSS` `overflow` 属性，但阉割了 `auto` 取值
elevation<br /><sup>`Android`</sup> | [&lt;number&gt;](#user-content-number) | `CSS`中没有对应的属性，只在 `Android5.0+` 上有效
resizeMode | `cover`, `contain`, `stretch` | `CSS`中没有对应的属性，可以参考 `background-size` 属性
overlayColor<br /><sup>`Android`</sup> | string | `CSS`中没有对应的属性，当图像有圆角时，将角落都充满一种颜色
tintColor<br /><sup>`iOS`</sup> | [&lt;color&gt;](#user-content-color) | `CSS`中没有对应的属性，`iOS` 图像上特殊的色彩，改变不透明像素的颜色

#### Color 颜色

`React Native` 支持了 `CSS` 中大部分的颜色类型：

* `#f00` (#rgb)
* `#f00c` (#rgba)：`CSS` 中无对应的值
* `#ff0000` (#rrggbb)
* `#ff0000cc` (#rrggbbaa)：`CSS` 中无对应的值
* `rgb(255, 0, 0)`
* `rgba(255, 0, 0, 0.9)`
* `hsl(360, 100%, 100%)`
* `hsla(360, 100%, 100%, 0.9)`
* `transparent`
* `0xff00ff00` (0xrrggbbaa)：`CSS` 中无对应的值
* `Color Name`：支持了 [基本颜色关键字](http://css.doyoe.com/appendix/color-keywords.htm#basic) 和 [拓展颜色关键字](http://css.doyoe.com/appendix/color-keywords.htm#extended)，但不支持 [28个系统颜色](http://css.doyoe.com/appendix/color-keywords.htm#system)；

#### 优先级与继承（Specificity and inheritance）
组件的引入样式的优先级高于全局样式的优先级。

#### 选择器
1. 基本选择器只支持类选择器
2. 不支持组合选择器的写法
3. 不支持伪类及伪元素

#### CSS 的简写属性（Shorthand properties）

#### 单位
Taro 使用 [PostCSS](https://github.com/ai/postcss) 单位转换插件 [postcss-pxtransform](https://github.com/NervJS/taro/blob/master/packages/postcss-pxtransform/README.md) 会将 px 转换为 React Native 的 `pt`，具体配置方法可以查看文档。

### 参考
- [CSS Flexible Box Layout Module Level 1](https://www.w3.org/TR/css-flexbox-1/)
- [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
