---
title: 开发前注意
---

## 小程序

* 若使用 **微信小程序预览模式** ，则需下载并使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)添加项目进行预览，此时需要注意微信开发者工具的项目设置
  * 需要设置关闭ES6转ES5功能，开启可能报错
  * 需要设置关闭上传代码时样式自动补全，开启可能报错
  * 需要设置关闭代码压缩上传，开启可能报错

## React Native
> Note：如果要支持 React Native 端，必须采用 Flex 布局，并且样式选择器仅支持类选择器的写法。

### 常见问题
#### 样式和 CSS 一致吗？
React Native 的样式基于开源的跨平台布局引擎 [Yaga](https://github.com/facebook/yoga) ，样式基本上是实现了 CSS 的一个子集，并且属性名不完全一致，所以当你开始在考虑兼容 React Native 端之前，可以先简要了解一下 React Native 的样式：[React Native Layout Props](https://facebook.github.io/react-native/docs/layout-props)

我们在React Native中使用 Flexbox 规则来指定某个组件的子元素的布局。Flexbox可以在不同屏幕尺寸上提供一致的布局结构。因此，如果你要考虑 React Native 端，那你的样式布局就得采用 Flex 布局。

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
很遗憾，React Native 这方面支持得并不好，建议你不要报太大希望。

### 其他注意事项
1. **运行时** 报缺少包，要在 `.rn_temp` 里面安装。
2. 文字要包在 `Text` 组件里面，否则不显示。

### 样式

#### 属性
可以参考 [React-Native 样式指南](https://github.com/doyoe/react-native-stylesheet-guide)

#### 布局（Flexible Box Layout)）
我们在 React Native 中使用 Flexbox 规则来指定某个组件的子元素的布局。Flexbox 可以在不同屏幕尺寸上提供一致的布局结构。

一般来说，使用 `flexDirection`、`alignItems` 和 `justifyContent` 三个样式属性就已经能满足大多数布局需求。

##### flex number
在 React Native 中 flex 的表现和 CSS 有些区别。 flex 在 RN 中只能为整数值，其具体表现请参考 [yoga 引擎](https://github.com/facebook/yoga) 的文档，

当 flex 为正整数时，组件是弹性的，尺寸和 flex 的值成正比。

当 flex 为 0 时，组件没有弹性，且尺寸和 width ，height 一致。

当 flex 为 -1 时，在空间足够的情况下，组件的尺寸和 width ，height 一致；但是在空间不足时，组件会被压缩至 minWidth 和 minHeight

##### Flex Direction
在组件的 style 中指定 flexDirection 可以决定布局的主轴。子元素是应该沿着 `水平轴(row)`方向排列，还是沿着 `竖直轴(column)` 方向排列呢？**默认值是 `竖直轴(column)` 方向**，这点和 CSS 不一样，想要注意。

#### Justify Content
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
