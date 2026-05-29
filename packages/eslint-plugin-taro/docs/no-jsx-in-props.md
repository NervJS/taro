# 不允许在 JSX 参数(props)中传入 JSX 元素(taro/no-jsx-in-props)

由于微信小程序内置的组件化的系统不能通过属性（props） 传函数，而 props 传递函数可以说 React 体系的根基之一，我们只能自己实现了一套组件化系统。而自制的组件化系统则不能使用内置组件化的 slot 功能。两权相害取其轻，我们暂时只能不支持该功能。


## 规则详情

以下代码会被 ESLint 提示警告，同时在 Taro（小程序端）也不会有效：

```javascript
<Custom child={<View />} />

<Custom child={() => <View />} />

<Custom child={function () { <View /> }} />

<Custom child={ary.map(a => <View />)} />
```

## 解决方案

通过 props 传值在 JSX 模板中预先判定显示内容。

该特性可能会在下一个 Major 版本的 Taro 中得到支持。
