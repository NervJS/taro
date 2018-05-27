# 不能在自定义组件中写 children (taro/custom-component-children)

在 Nerv/React 中，自定义组件嵌套实际上也是通过 props 来实现的，只是 `children` 是一个特殊的 prop 。而对于 Taro，文档已阐述过不能通过 props 来传递 JSX 元素。

更多详情请查看文档 [JSX 简介](https://nervjs.github.io/taro/jsx.html)。


## 规则详情

以下代码会被 ESLint 提示警告，同时在 Taro（小程序端）也不会有效：

```javascript
<CustomComponent>test</CustomComponent>

<CustomComponent>{'test'}</CustomComponent>

<CustomComponent>
  <Other />
</CustomComponent>

<Typo>{}</Typo>
```

以下代码不会被警告，也应当在 Taro 任意端中能够运行：

```javascript
<CustomComponent />

<CustomComponent> </CustomComponent>

<ScrollView>test</ScrollView>

<View>test</View>

<View>
  <CustomComponent />
</View>
```

## 解决方案

请查看文档 [JSX 简介](https://nervjs.github.io/taro/jsx.html)。

该特性可能会在下一个 Major 版本的 Taro 中得到支持。