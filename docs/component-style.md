---
title: 组件的外部样式和全局样式
---

自定义组件对应的样式文件，只对该组件内的节点生效。编写组件样式时，需要注意以下几点：

- 组件和引用组件的页面不能使用 id 选择器（`#a`）、属性选择器（`[a]`）和标签名选择器，请改用 class 选择器。
- 组件和引用组件的页面中使用后代选择器（`.a .b`）在一些极端情况下会有非预期的表现，如遇，请避免使用。
- 子元素选择器（`.a > .b`）只能用于 `View` 组件与其子节点之间，用于其他组件可能导致非预期的情况。
- **继承样式，如 `font` 、 `color` ，会从组件外（父组件）继承到组件内。但是引用组件时在组件节点上书写的 `className` 无效。** *（具体解决方案请参见下面的外部和全局样式介绍。）*
- 除继承样式外， `app.scss` 中的样式、组件所在页面的样式，均对自定义组件无效。

```css
#a { } /* 在组件中不能使用 */
[a] { } /* 在组件中不能使用 */
button { } /* 在组件中不能使用 */
.a > .b { } /* 除非 .a 是 view 组件节点，否则不一定会生效 */
```

除此以外，组件可以指定它所在节点的默认样式，使用 `:host` 选择器（需要包含基础库 [1.7.2](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 或更高版本的开发者工具支持）。

```css
/* 该自定义组件的默认样式 */
:host {
  color: yellow;
}
```

## 外部样式类

如果想传递样式给引用的自定义组件，以下写法（直接传递 `className`）**不可行**：

```jsx
/* CustomComp.js */
export default class CustomComp extends Component {
  static defaultProps = {
    className: ''
  }

  render () {
    return <View className={this.props.className}>这段文本的颜色不会由组件外的 class 决定</View>
  }
}
```

```jsx
/* MyPage.js */
export default class MyPage extends Component {
  render () {
    return <CustomComp className="red-text" />
  }
}
```

```scss
/* MyPage.scss */
.red-text {
  color: red;
}
```

取而代之的，需要利用 `externalClasses` 定义段定义若干个外部样式类。这个特性从小程序基础库版本 [1.9.90](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 开始支持。

```jsx
/* CustomComp.js */
export default class CustomComp extends Component {
  static externalClasses = ['my-class']

  render () {
    return <View className="my-class">这段文本的颜色由组件外的 class 决定</View>
  }
}
```

```jsx
/* MyPage.js */
export default class MyPage extends Component {
  render () {
    return <CustomComp my-class="red-text" />
  }
}
```

```scss
/* MyPage.scss */
.red-text {
  color: red;
}
```

> 注意：`externalClasses` 需要使用 **短横线命名法 (kebab-case)**，而不是 React 惯用的 驼峰命名法 (camelCase)。否则无效。

## 全局样式类

使用外部样式类可以让组件使用指定的组件外样式类，如果希望组件外样式类能够完全影响组件内部，可以将组件构造器中的 `options.addGlobalClass` 字段置为 `true`。这个特性从小程序基础库版本 [2.2.3](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) 开始支持。

```jsx
/* CustomComp.js */
export default class CustomComp extends Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    return <View className="red-text">这段文本的颜色由组件外的 class 决定</View>
  }
}
```

```scss
/* 组件外的样式定义 */
.red-text {
  color: red;
}
```

