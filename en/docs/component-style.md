---
title: Component external and global styles
---

Customize the style file of the component only for the nodes in that component.When writing component style, care needs to be taken to expert sex：

- Components and referencing components cannot use id selectors (`#a`), attribute selectors (`[a]`) and label selectors, use class selectors.
- Using the next generation selector (`.a b`) on the pages of components and referencing components has unanticipated performance in some extreme cases, if encountered, please avoid using.
- Child element selector (`.a > .b`) can only be used between `Views` for other components that may cause unexpectedness.
- **Inherit style, e.g. `font` and `color` will inherit from outside of the component (parent component).But the `className` written on the component nodes when referencing the component.** *(For specific solutions see external and global style presentations below)*
- With the exception of inheritance style, `app.scss` style, the style of the component page, is not valid for custom components.

```css
#a { } /* 在组件中不能使用 */
[a] { } /* 在组件中不能使用 */
button { } /* 在组件中不能使用 */
.a > .b { } /* 除非 .a 是 view 组件节点，否则不一定会生效 */
```

In addition to this, the component can specify the default style of its node, using `:host` selectors (needs to include base library [1.7.2](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html) or more developer tools).

```css
/* Default style for this custom component */
:host LO
  color: yellow;
}
```

## External Style Class

如果想传递样式给引用的自定义组件，以下写法（直接传递 `className`）**不可行**：

```jsx
/* CustomCompd. s */
export default class CustomComp extends Component U
  static defaultProps = {
    className: ''
  }

  render ()
    return <View className={this.props.className}>The color of this text is not determined by class outside the component</View>
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
.red-text LO
  color: red;
}
```

Instead, use`externalClasses`to define segments to define several external style classes.This feature is supported from base version[1.9.90](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)

```jsx
/* CustomCompd. s */
export default class CustomComp extends Component {
  static externalClasses = ['my-class']

  render () ()
    return <View className="my-class">the color of this text is determined by class outside of the component</View>
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
.red-text LO
  color: red;
}
```

> Note that：`externalClasses` needs to be named with **Short Landscape (kebab-case)**, not the React customary camel peak naming method.Otherwise it is invalid.

## Global Style Class

使用外部样式类可以让组件使用指定的组件外样式类，如果希望组件外样式类能够完全影响组件内部，可以将组件构造器中的 `options.addGlobalClass` 字段置为 `true`。This feature is supported from base version[2.2.3](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html).

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
/* Style definition */
.red-text {
  color: red;
}
```

