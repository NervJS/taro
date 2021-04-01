---
title: React Native 端开发前注意
---

:::tip Taro 3 需要使用 3.1 以上版本
:::

React Native 的样式基于开源的跨平台布局引擎 [Yoga](https://github.com/facebook/yoga) ，样式基本上是实现了 CSS 的一个子集，并且属性名不完全一致，所以当你开始在考虑兼容 React Native 端之前，可以先简要了解一下 React Native 的样式：[React Native Layout Props](https://facebook.github.io/react-native/docs/layout-props)

样式布局上 H5 最为灵活，小程序次之，RN 最弱，统一多端样式即是对齐短板，也就是要以 RN 的约束来管理样式，同时兼顾小程序的限制，核心可以用三点来概括：

- 使用 Flex 布局
- 基于 BEM 写样式
- 采用 style 属性覆盖组件样式


## 一、布局

### flex

在 React Native 中使用 Flexbox 规则来指定某个组件的子元素的布局。Flexbox 可以在不同屏幕尺寸上提供一致的布局结构。因此，如果你要考虑 React Native 端，那你的样式布局就得采用 Flex 布局。

Flex 布局入门，可以查看阮一峰的 [Flex 布局教程：语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

注意：**RN 中 View 标签默认主轴方向是 column**，如果不将其他端改成与 RN 一致，就需要在所有用到 display: flex 的地方都显式声明主轴方向。

### position

在 React Native 中 position 仅支持两种属性，即 `relative`（默认）和 `absolute`。可[参考文档](https://reactnative.dev/docs/0.60/layout-props#position)


## 二、样式

### 选择器

> React Native 端仅支持类选择器，且不支持 **组合器** [Combinators and groups of selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Combinators_and_multiple_selectors)。

以下选择器的写法都是不支持的，在样式转换时会自动忽略。

```css
.button.button_theme_islands {
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

div span {
  background-color: DodgerBlue;
}
```

若我们基于 `scss` 等预编译语言开发，则可基于 [BEM](http://getbem.com/) 写样式，如：

```jsx
<View className="block">
    <Text className="block__elem">文本</Text>
</View>
```

```css
.block: {
    background-color: DodgerBlue;
    &__elem {
        color: yellow;
    }
}
```

### 样式的条件编译

> 1.3+ 版本支持

#### 样式文件条件编译

假设目录中同时存在以下文件：

```
- index.scss
- index.rn.scss
```

当在 JS 文件中引用样式文件：`import './index.scss'` 时，RN 平台会找到并引入 `index.rn.scss`，其他平台会引入：`index.scss`，方便大家书写跨端样式，更好地兼容 RN。

#### 样式代码的条件编译

为了方便大家书写样式跨端的样式代码，添加了样式条件编译的特性。

指定平台保留：

```scss
/*  #ifdef  %PLATFORM%  */
样式代码
/*  #endif  */
```

指定平台剔除：

```scss
/*  #ifndef  %PLATFORM%  */
样式代码
/*  #endif  */
```

多个平台之间可以使用空格隔开。

### 样式的全局引入

- 方式一：入口文件 app.js 里面引入的样式就是全局样式，本地样式会覆盖全局样式。
- 方式二：通过配置全局注入 
```js
// config/index.js
...
const config = {
    ...
    sass: {
        resource: [
            'src/styles/common.scss'
        ]
    }
}

```

# 三、导航

React Native 导航是封装的 React-Navigation 5.x，为了更好的方便业务自定义，支持全局与页面配置中透传React Navigation的配置，但注意以下导航相关设置Taro 3.x 生效。
### 全局配置 

在全局配置app.config.js 中可增加rn导航的独立配置

```js
//为了对其他端产生影响，最好加上环境判断

let rnConfig = {}

if(process.env.TARO_ENV === 'rn'){
  rnConfig = {
  //deep Linking前缀,https://reactnavigation.org/docs/deep-linking
  linking:[],
  //tabBar页面的设置，https://reactnavigation.org/docs/bottom-tab-navigator/#tabbar 对应options的配置，支持以下属性透传，不支持返回react.Node节点设置的方案
   options:{
      title，
      tabBarVisible，
      tabBarBadge，
      tabBarBadgeStyle，
      tabBarTestID
   },
   tabBarOptions:{//tabbarOptions的配置，其他参考https://reactnavigation.org/docs/bottom-tab-navigator/#tabbar tabBarOptions
       
   },
   screenOptions:{//全局screenOptions，作用于非所有页面，注意不支持返回React.Node的属性，参考https://reactnavigation.org/docs/stack-navigator/#options
       
   }
  }
}

export default {
  pages:[
    'pages/index/index',
  ],
  rn:rnConfig
}
```

### 页面配置

除了全局设置页面，也可单独对某个页面进行设置。
```js
// 页面config
rn:{
  screenOptions:{// 设置当前页面的options，参考https://reactnavigation.org/docs/stack-navigator/#options
        
    }
}
```
>  关于透传react navigation的配置有需要注意：
>  - 不支持直接传入React.Node节点的参数
>  - 传入的样式对象为 React Native 的样式对比，比如 tabStyle:{ backgroundColor :'#ff0000'}
> - rn的配置优先于其他配置，比如统一的tabBar里配置了selectedColor ，rn配置里的 activeTintColor ，那么生效的是 activeTintColor

 
## 常见问题

### 1、box-shadow 能实现吗？

> React Native 这方面支持得并不好（仅 ios 支持且支持程度有限）,android 端仅可通过 `elevation` 设置灰色阴影。
```css
{
    /* 阴影相关属性 */
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: Color.CMHeaderBgColor,
    /* android 灰色阴影 */
    elevation: 4,
}
```

### 2、border{Top,Right,Bottom,Left} 不支持？

border{Top,Right,Bottom,Left} 的简写（shorthands）不支持，因为 `borderStyle` 不能应用于单个边框。

使用 sass：

```scss
/**
 * // NOTE Taro 编译成 RN 时对 border 的处理有问题
 * RN 不支持针对某一边设置 style，即 border-bottom-style 会报错
 * 那么 border-bottom: 1px 就需要写成如下形式：
 * border: 0 style color; border-bottom-width: 1px;
 */
@mixin border($dir, $width, $style, $color) {
  border: 0 $style $color;
  @each $d in $dir {
    #{border-#{$d}-width}: $width;
  }
}
```

### 3、React Native 不支持 background-image ，有什么解决办法吗？
使用 `Image 组件`，配合 Flex/Position 布局，基本可以实现你的大部分需求。阅读一下这篇文章：[Background Images in React Native](https://thekevinscott.com/background-images-in-react-native/)，有助于你理解。


## 附：各属性支持度

React Native 的样式基于开源的跨平台布局引擎 [Yoga](https://github.com/facebook/yoga) ，样式基本上是实现了 CSS 的一个子集，但是属性名不完全一致，具体的内容及相关差异可以查看文档 [React Native Layout Props](https://facebook.github.io/react-native/docs/layout-props)。

### Text 文本（18）

| 属性名                                       | 取值                                                                                                     | 描述                                                                                                                                                                                                                                                                   |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| color                                        | [&lt;color&gt;](#user-content-color)                                                                     | 对应 `CSS` [color](https://css.doyoe.com/properties/color/color.htm) 属性                                                                                                                                                                                               |
| fontFamily                                   | string                                                                                                   | 对应 `CSS` [font-family](https://css.doyoe.com/properties/font/font-family.htm) 属性                                                                                                                                                                                    |
| fontSize                                     | [&lt;number&gt;](#user-content-number)                                                                   | 对应 `CSS` [font-size](https://css.doyoe.com/properties/font/font-size.htm) 属性                                                                                                                                                                                        |
| fontStyle                                    | `normal`, `italic`                                                                                       | 对应 `CSS` [font-style](https://css.doyoe.com/properties/font/font-style.htm) 属性，但阉割了 `oblique` 取值                                                                                                                                                             |
| fontWeight                                   | `normal`, `bold` `100~900`                                                                               | 对应 `CSS` [font-weight](https://css.doyoe.com/properties/font/font-weight.htm) 属性，但阉割了 `bolder, lighter` 取值                                                                                                                                                   |
| lineHeight                                   | [&lt;number&gt;](#user-content-number)                                                                   | 对应 `CSS` [line-height](https://css.doyoe.com/properties/text/line-height.htm) 属性                                                                                                                                                                                    |
| textAlign                                    | `auto`, `left`, `right`, `center`, `justify`<sup>`iOS`</sup>                                             | 对应 `CSS` [text-align](https://css.doyoe.com/properties/text/text-align.htm) 属性，但增加了 `auto` 取值。当取值为 `justify` 时，在 `Android` 上会变为 `left`                                                                                                           |
| textDecorationLine                           | `none`, `underline`, `line-through`, `underline line-through`                                            | 对应 `CSS` [text-decoration-line](https://css.doyoe.com/properties/text-decoration/text-decoration-line.htm) 属性，但阉割了 `overline`, `blink` 取值                                                                                                                    |
| textShadowColor                              | [&lt;color&gt;](#user-content-color)                                                                     | 对应 `CSS` [text-shadow](https://css.doyoe.com/properties/text-decoration/text-shadow.htm) 属性中的颜色定义                                                                                                                                                             |
| textShadowOffset                             | {<br />width:[&lt;number&gt;](#user-content-number),<br />height:[&lt;number&gt;](#user-content-number)<br />} | 对应 `CSS` [text-shadow](https://css.doyoe.com/properties/text-decoration/text-shadow.htm) 属性中的阴影偏移定义                                                                                                                                                         |
| textShadowRadius                             | [&lt;number&gt;](#user-content-number)                                                                   | 在 `CSS` 中，阴影的圆角大小取决于元素的圆角定义，不需要额外定义                                                                                                                                                                                                        |
| includeFontPadding<br /><sup>`Android`</sup> | [&lt;bool&gt;](#user-content-bool)                                                                       | Android 在默认情况下会为文字额外保留一些 padding，以便留出空间摆放上标或是下标的文字。对于某些字体来说，这些额外的 padding 可能会导致文字难以垂直居中。如果你把 `textAlignVertical` 设置为 `center` 之后，文字看起来依然不在正中间，那么可以尝试将本属性设置为 `false` |
| textAlignVertical<br /><sup>`Android`</sup>  | `auto`, `top`, `bottom`, `center`                                                                        | 对应 `CSS` [vertical-align](https://css.doyoe.com/properties/text/vertical-align.htm) 属性，增加了 `auto` 取值，`center` 取代了 `middle`，并阉割了 `baseline, sub` 等值                                                                                                 |
| fontVariant<br /><sup>`iOS`</sup>            | `small-caps`, `oldstyle-nums`, `lining-nums`, `tabular-nums`, `proportional-nums`                        | 对应 `CSS` [font-variant](https://css.doyoe.com/properties/font/font-variant.htm) 属性，但取值更丰富                                                                                                                                                                    |
| letterSpacing<br /><sup>`iOS`</sup>          | [&lt;number&gt;](#user-content-number)                                                                   | 对应 `CSS` [letter-spacing](https://css.doyoe.com/properties/text/letter-spacing.htm) 属性                                                                                                                                                                              |
| textDecorationColor<br /><sup>`iOS`</sup>    | [&lt;color&gt;](#user-content-color)                                                                     | 对应 `CSS` [text-decoration-color](https://css.doyoe.com/properties/text-decoration/text-decoration-color.htm) 属性                                                                                                                                                     |
| textDecorationStyle<br /><sup>`iOS`</sup>    | `solid`, `double`, `dotted`, `dashed`                                                                    | 对应 `CSS` [text-decoration-style](https://css.doyoe.com/properties/text-decoration/text-decoration-style.htm) 属性，但阉割了 `wavy` 取值                                                                                                                               |
| writingDirection<br /><sup>`iOS`</sup>       | `auto`, `ltr`, `rtl`                                                                                     | 对应 `CSS` [direction](https://css.doyoe.com/properties/writing-modes/direction.htm) 属性，增加了 `auto` 取值                                                                                                                                                           |

<a name="dimension"></a>


### Dimension 尺寸（6）

| 属性名    | 取值                                   | 描述                                                                                   |
| --------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| width     | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [width](https://css.doyoe.com/properties/dimension/width.htm) 属性           |
| minWidth  | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [min-width](https://css.doyoe.com/properties/dimension/min-width.htm) 属性   |
| maxWidth  | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [max-width](https://css.doyoe.com/properties/dimension/max-width.htm) 属性   |
| height    | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [height](https://css.doyoe.com/properties/dimension/height.htm) 属性         |
| minHeight | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [min-height](https://css.doyoe.com/properties/dimension/min-height.htm) 属性 |
| maxHeight | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [max-height](https://css.doyoe.com/properties/dimension/max-height.htm) 属性 |

<a name="positioning"></a>

### Positioning 定位（6）

| 属性名   | 取值                                   | 描述                                                                                                                |
| -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| position | `absolute`, `relative`                 | 对应 `CSS` [position](https://css.doyoe.com/properties/positioning/position.htm) 属性，但阉割了 `static, fixed` 取值 |
| top      | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [top](https://css.doyoe.com/properties/positioning/top.htm) 属性                                          |
| right    | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [right](https://css.doyoe.com/properties/positioning/right.htm) 属性                                      |
| bottom   | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [bottom](https://css.doyoe.com/properties/positioning/bottom.htm) 属性                                    |
| left     | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [left](https://css.doyoe.com/properties/positioning/left.htm) 属性                                        |
| zIndex   | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [z-index](https://css.doyoe.com/properties/positioning/z-index.htm) 属性                                  |

<a name="margin"></a>

### Margin 外部白（7）

| 属性名           | 取值                                   | 描述                                                                                                                                                                                  |
| ---------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| margin           | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [margin](https://css.doyoe.com/properties/margin/margin.htm) 属性，不同的是，它只能定义一个参数，如需分别定义`上、右、下、左`4 个方位的外补白，可以通过下面的单向外部白属性 |
| marginHorizontal | [&lt;number&gt;](#user-content-number) | 无对应的 `CSS` 属性。其效果相当于同时设置 `marginRight` 和 `marginLeft`                                                                                                               |
| marginVertical   | [&lt;number&gt;](#user-content-number) | 无对应的 `CSS` 属性。其效果相当于同时设置 `marginTop` 和 `marginBottom`                                                                                                               |
| marginTop        | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [margin-top](https://css.doyoe.com/properties/margin/margin-top.htm) 属性                                                                                                   |
| marginRight      | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [margin-right](https://css.doyoe.com/properties/margin/margin-right.htm) 属性                                                                                               |
| marginBottom     | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [margin-bottom](https://css.doyoe.com/properties/margin/margin-bottom.htm) 属性                                                                                             |
| marginLeft       | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [margin-left](https://css.doyoe.com/properties/margin/margin-left.htm) 属性                                                                                                 |

<a name="padding"></a>

### Padding 内部白（7）

| 属性名            | 取值                                   | 描述                                                                                                                                                                                     |
| ----------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| padding           | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [padding](https://css.doyoe.com/properties/padding/padding.htm) 属性，不同的是，它只能定义一个参数，如需分别定义`上、右、下、左`4 个方位的内补白，可以通过下面的单向内部白属性 |
| paddingHorizontal | [&lt;number&gt;](#user-content-number) | 无对应的 `CSS` 属性。其效果相当于同时设置 `paddingRight` 和 `paddingLeft`                                                                                                                |
| paddingVertical   | [&lt;number&gt;](#user-content-number) | 无对应的 `CSS` 属性。其效果相当于同时设置 `paddingTop` 和 `paddingBottom`                                                                                                                |
| paddingTop        | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [padding-top](https://css.doyoe.com/properties/padding/padding-top.htm) 属性                                                                                                   |
| paddingRight      | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [padding-right](https://css.doyoe.com/properties/padding/padding-right.htm) 属性                                                                                               |
| paddingBottom     | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [padding-bottom](https://css.doyoe.com/properties/padding/padding-bottom.htm) 属性                                                                                             |
| paddingLeft       | [&lt;number&gt;](#user-content-number) | 对应 `CSS` [padding-left](https://css.doyoe.com/properties/padding/padding-left.htm) 属性                                                                                                 |

### Border 边框（20）

| 属性名                  | 取值                                                                                                        | 描述                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| borderStyle             | `solid`, `dotted`, `dashed`                                                                                 | 对应 `CSS` `border-style` 属性，但阉割了 `none, hidden, double, groove, ridge, inset, outset` 取值，且无方向分拆属性 |
| borderWidth             | [&lt;number&gt;](#user-content-number)                                                                      | 对应 `CSS` `border-width` 属性                                                                                       |
| borderTopWidth          | [&lt;number&gt;](#user-content-number)                                                                      | 对应 `CSS` `border-top-width` 属性                                                                                   |
| borderRightWidth        | [&lt;number&gt;](#user-content-number)                                                                      | 对应 `CSS` `border-right-width` 属性                                                                                 |
| borderBottomWidth       | [&lt;number&gt;](#user-content-number)                                                                      | 对应 `CSS` `border-bottom-width` 属性                                                                                |
| borderLeftWidth         | [&lt;number&gt;](#user-content-number)                                                                      | 对应 `CSS` `border-left-width` 属性                                                                                  |
| borderColor             | [&lt;color&gt;](#user-content-color)                                                                        | 对应 `CSS` `border-color` 属性                                                                                       |
| borderTopColor          | [&lt;color&gt;](#user-content-color)                                                                        | 对应 `CSS` `border-top-color` 属性                                                                                   |
| borderRightColor        | [&lt;color&gt;](#user-content-color)                                                                        | 对应 `CSS` `border-right-color` 属性                                                                                 |
| borderBottomColor       | [&lt;color&gt;](#user-content-color)                                                                        | 对应 `CSS` `border-bottom-color` 属性                                                                                |
| borderLeftColor         | [&lt;color&gt;](#user-content-color)                                                                        | 对应 `CSS` `border-left-color` 属性                                                                                  |
| borderRadius            | [&lt;number&gt;](#user-content-number)                                                                      | 对应 `CSS` `border-radius` 属性                                                                                      |
| borderTopLeftRadius     | [&lt;number&gt;](#user-content-number)                                                                      | 对应 `CSS` `border-top-left-radius` 属性                                                                             |
| borderTopRightRadius    | [&lt;number&gt;](#user-content-number)                                                                      | 对应 `CSS` `border-top-right-radius` 属性                                                                            |
| borderBottomLeftRadius  | [&lt;number&gt;](#user-content-number)                                                                      | 对应 `CSS` `border-bottom-left-radius` 属性                                                                          |
| borderBottomRightRadius | [&lt;number&gt;](#user-content-number)                                                                      | 对应 `CSS` `border-bottom-right-radius` 属性                                                                         |
| shadowColor             | [&lt;color&gt;](#user-content-color)                                                                        | 对应 `CSS` [box-shadow](https://css.doyoe.com/properties/border/box-shadow.htm) 属性中的颜色定义                      |
| shadowOffset            | {<br />width: [&lt;number&gt;](#user-content-number), <br />height: [&lt;number&gt;](#user-content-number)<br />} | 对应 `CSS` [box-shadow](https://css.doyoe.com/properties/border/box-shadow.htm) 属性中的阴影偏移定义                  |
| shadowRadius            | [&lt;number&gt;](#user-content-number)                                                                      | 在 `CSS` 中，阴影的圆角大小取决于元素的圆角定义，不需要额外定义                                                      |
| shadowOpacity           | [&lt;number&gt;](#user-content-number)                                                                      | 对应 `CSS` [box-shadow](https://css.doyoe.com/properties/border/box-shadow.htm) 属性中的阴影透明度定义                |

<a name="background"></a>

### Background 背景（1）

| 属性名          | 取值                                 | 描述                               |
| --------------- | ------------------------------------ | ---------------------------------- |
| backgroundColor | [&lt;color&gt;](#user-content-color) | 对应 `CSS` `background-color` 属性 |

<a name="transform"></a>

### Transform 转换（3）

| 属性名             | 取值                                                                                                                                                                                                                                    | 描述                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| transform          | `[{perspective: number}, {rotate: string}, {rotateX: string}, {rotateY: string}, {rotateZ: string}, {scale: number}, {scaleX: number}, {scaleY: number}, {translateX: number}, {translateY: number}, {skewX: string}, {skewY: string}]` | 对应 `CSS` `transform` 属性                                        |
| transformMatrix    | `TransformMatrixPropType`                                                                                                                                                                                                               | 类似于 `CSS` 中 `transform` 属性的 `matrix()` 和 `matrix3d()` 函数 |
| backfaceVisibility | `visible`, `hidden`                                                                                                                                                                                                                     | 对应 `CSS` `backface-visibility` 属性                              |

<a name="flexbox"></a>

### Flexbox 弹性盒（9）

我们在 React Native 中使用 Flexbox 规则来指定某个组件的子元素的布局。Flexbox 可以在不同屏幕尺寸上提供一致的布局结构。

一般来说，使用 `flexDirection`、`alignItems` 和 `justifyContent` 三个样式属性就已经能满足大多数布局需求。

#### Flex number

在 React Native 中 flex 的表现和 CSS 有些区别。 flex 在 RN 中只能为整数值，其具体表现请参考 [yoga 引擎](https://github.com/facebook/yoga) 的文档，

| 条件                              | 表现                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| flex 设置为正整数时，如 `flex: 1` | 组件是弹性的，尺寸和 flex 的值成正比                         |
| `flex:0`                          | 组件没有弹性，且尺寸和 width ，height 一致                   |
| `flex: -1`                        | 在空间足够的情况下，组件的尺寸和 width ，height 一致；但是在空间不足时，组件会被压缩至 minWidth 和 minHeight |



#### Flex Direction

在组件的 style 中指定 flexDirection 可以决定布局的主轴。子元素是应该沿着 `水平轴(row)`方向排列，还是沿着 `竖直轴(column)` 方向排列呢？**默认值是 `竖直轴(column)` 方向**，这点和 CSS 不一样，想要注意。

#### Justify Content

在组件的 style 中指定 justifyContent 可以决定其子元素沿着主轴的排列方式。子元素是应该靠近主轴的起始端还是末尾段分布呢？亦或应该均匀分布？对应的这些可选项有：`flex-start`、`center`、`flex-end`、`space-around` 以及 `space-between`。

#### Align Items

在组件的 style 中指定 alignItems 可以决定其子元素沿着次轴（与主轴垂直的轴，比如若主轴方向为 row，则次轴方向为 column ）的排列方式。子元素是应该靠近次轴的起始端还是末尾段分布呢？亦或应该均匀分布？对应的这些可选项有：`flex-start`、`center`、`flex-end` 以及 `stretch`。

| 属性名         | 取值                                                                | 描述                                                         |
| -------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| flex           | [&lt;number&gt;](#user-content-number)                              | 对应 `CSS` `flex` 属性，但只能为整数值                       |
| flexGrow       | [&lt;number&gt;](#user-content-number)                              | 对应 `CSS` `flex-grow` 属性                                  |
| flexShrink     | [&lt;number&gt;](#user-content-number)                              | 对应 `CSS` `flex-shrink` 属性                                |
| flexBasis      | [&lt;number&gt;](#user-content-number)                              | 对应 `CSS` `flex-basis` 属性                                 |
| flexDirection  | `row`, `row-reverse`, `column`, `column-reverse`                    | 对应 `CSS` `flex-direction` 属性                             |
| flexWrap       | `wrap`, `nowrap`                                                    | 对应 `CSS` `flex-wrap` 属性，但阉割了 `wrap-reverse` 取值    |
| justifyContent | `flex-start`, `flex-end`, `center`, `space-between`, `space-around` | 对应 `CSS` `justify-content` 属性，但阉割了 `stretch` 取值。 |
| alignItems     | `flex-start`, `flex-end`, `center`, `stretch`                       | 对应 `CSS` `align-items` 属性，但阉割了 `baseline` 取值。    |
| alignSelf      | `auto`, `flex-start`, `flex-end`, `center`, `stretch`               | 对应 `CSS` `align-self` 属性，但阉割了 `baseline` 取值       |

### Other 其他

| 属性名                                 | 取值                                   | 描述                                                                 |
| -------------------------------------- | -------------------------------------- | -------------------------------------------------------------------- |
| opacity                                | [&lt;number&gt;](#user-content-number) | 对应 `CSS` `opacity` 属性                                            |
| overflow                               | `visible`, `hidden`, `scroll`          | 对应 `CSS` `overflow` 属性，但阉割了 `auto` 取值                     |
| elevation<br /><sup>`Android`</sup>    | [&lt;number&gt;](#user-content-number) | `CSS` 中没有对应的属性，只在 `Android5.0+` 上有效                    |
| resizeMode                             | `cover`, `contain`, `stretch`          | `CSS` 中没有对应的属性，可以参考 `background-size` 属性              |
| overlayColor<br /><sup>`Android`</sup> | string                                 | `CSS` 中没有对应的属性，当图像有圆角时，将角落都充满一种颜色         |
| tintColor<br /><sup>`iOS`</sup>        | [&lt;color&gt;](#user-content-color)   | `CSS` 中没有对应的属性，`iOS` 图像上特殊的色彩，改变不透明像素的颜色 |

#### Color 颜色

`React Native` 支持了 `CSS` 中大部分的颜色类型：

- `#f00` (#rgb)
- `#f00c` (#rgba)：`CSS` 中无对应的值
- `#ff0000` (#rrggbb)
- `#ff0000cc` (#rrggbbaa)：`CSS` 中无对应的值
- `rgb(255, 0, 0)`
- `rgba(255, 0, 0, 0.9)`
- `hsl(360, 100%, 100%)`
- `hsla(360, 100%, 100%, 0.9)`
- `transparent`
- `0xff00ff00` (0xrrggbbaa)：`CSS` 中无对应的值
- `Color Name`：支持了 [基本颜色关键字](https://css.doyoe.com/appendix/color-keywords.htm#basic) 和 [拓展颜色关键字](https://css.doyoe.com/appendix/color-keywords.htm#extended)，但不支持 [28 个系统颜色](https://css.doyoe.com/appendix/color-keywords.htm#system)；

#### 优先级与继承（Specificity and inheritance）

组件的引入样式的优先级高于全局样式的优先级。

#### 选择器

1. 基本选择器只支持类选择器
2. 不支持组合选择器的写法
3. 不支持伪类及伪元素

#### CSS 的简写属性（Shorthand properties）

仅接受 React Native 支持的值。例如 background 只接受一种颜色 `backgroundColor`，因为 React Native 的 Background 仅支持 `backgroundColor` 属性。React Native 支持的属性可见上述 React Native 样式表。

#### 单位

Taro 使用 [PostCSS](https://github.com/ai/postcss) 单位转换插件 [postcss-pxtransform](https://github.com/NervJS/taro/blob/master/packages/postcss-pxtransform/README.md) 会将 px 转换为 React Native 的 `pt`，具体配置方法可以查看文档。


