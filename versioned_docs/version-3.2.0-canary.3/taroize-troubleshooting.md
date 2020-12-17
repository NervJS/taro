---
title: Troubleshooting
---

## 不支持的小程序特性

### 入口 App 对象

|属性|说明|
|:--|:--|
|onError||
|onPageNotFound||
|onUnhandledRejection||
|onThemeChange||

### 页面 Page 对象

|属性|说明|
|:--|:--|
|selectComponent|建议使用 React ref 重构|
|selectAllComponents|建议使用 React ref 重构|
|selectOwnerComponent|建议使用 React ref 重构|
|groupSetData||

### 自定义组件

|属性|说明|
|:--|:--|
|moved||
|externalClasses|Taro 3 不存在自定义组件，建议规范类名或使用 CSS Module 代替|
|relations||
|options||
|definitionFilter||

### wxml 语法

|属性|说明|
|:--|:--|
|循环|[部分语法有限制]|
|事件|[部分语法有限制](./taroize-troubleshooting#2-事件)|
|引用|[部分语法有限制](./taroize-troubleshooting#16-include-里不支持使用-template)|
|wxs|[部分语法有限制](./taroize-troubleshooting#15-不支持-wxs-里的-getregexp-方法)|

## 关键问题

### 1. 没有处理基类

原生开发中，常常会把 App、Page、Component 构造对象的公共逻辑整合到基类中。

如 **Vant-weapp** 中：

```js
// 组件
VantComponent({
  data: {}
})
// 基类
function VantComponent(vantOptions = {}) {
  // 整合组件独有配置 vantOptions 和公共配置到最终的配置对象 options 中
  // ...

  // 调用小程序的 Component 方法构造自定义组件
  Component(options);
}
```

Taro 在编译时只能识别出入口、页面、组件文件中存在的 `App()`、`Page()`、`Component()` 调用，使用基类对配置封装后就不存在这些调用。因此编译后的 `withWeapp` 获得的参数是 `{}`。

```js
VantComponent({
  data: {}
})
// withWeapp 中应该传入小程序配置对象
@withWeapp({})
class _C extends React.Component {}
```

因此我们需要手动修改：

```js
// 基类
function VantComponent(vantOptions = {}) {
  // 整合组件独有配置 vantOptions 和公共配置到最终的配置对象 options 中
  // ...

  // 调用小程序的 Component 方法构造自定义组件
  // Component(options);
  
  // 1. 基类直接返回整合后的 options
  return options
}
```


```js
// 2. 把基类创建的配置传入 withWeapp：
const options = VantComponent({
  data: {}
})
@withWeapp(options)
class _C extends React.Component {}
```

### 2. 样式作用域

微信小程序中的自定义组件，转换后会生成一个 Taro 中的 React/Vue 组件。

但是 Taro 中使用 React/Vue 开发的组件，编译到小程序平台时，并不会生成对应的小程序自定义组件。

**因此微信小程序自定义组件的样式隔离特性，在转换为 Taro 后就会丢失。**

#### 解决办法：

1. 修改冲突的选择器。
2. 使用 CSS Modules 进行改写。

## 常见问题

### 1. wxml 语法转换问题

把 `wxml` 转换为 `JSX` 是通过操作 `AST` 实现的，有一些写法可能没有考虑到，或难以适配，从而导致报错。

以下是一些已知问题，需要手动修复：

#### 1.1 组件同时使用 `wx:for` 和 `wx:if` 语句时转换错误

当组件上同时使用了 `wx:for` 和 `wx:if` 语句，并且使用了当前**循环元素 item** 或**循环下标 index** 做判断条件时，转换后会报错。

例如：

```jsx
// 转换前（注意判断条件使用了循环下标 index）：
<block wx:for="{{objectArray}}" wx:if="{{index % 2 !== 0}}">
  <view>objectArray item: {{item.id}}</view>
</block>
```

```jsx
// 转换后：
{index % 2 !== 0 && (
  <Block>
    {objectArray.map((item, index) => {
      return (
        <Block>
          <View>{'objectArray item: ' + item.id}</View>
        </Block>
      )
    })}
  </Block>
)}
```

上例可见，对于条件语句的转换，目前的处理会把条件提取到组件外部。但是如果条件使用了 `item` 或 `index` 时，这样的提取逻辑会导致**变量未定义**的报错。

暂时可以通过手动修复解决：

方法一，修改**编译前**的代码，把循环和条件语句拆开到两个组件中：

```jsx
<block wx:for="{{objectArray}}">
  <block wx:if="{{index % 2 !== 0}}">
    <view>objectArray item: {{item.id}}</view>
  </block>
</block>
```

方法二，修改**编译后**的代码,把条件判断放进循环体中：

```jsx
<Block>
  {objectArray.map((item, index) => {
    return (
      <Block>
        {index % 2 !== 0 && <View>{'objectArray item: ' + item.id}</View>}
      </Block>
    )
  })}
</Block>
```

#### 1.2 根元素不能含有 `hidden` 属性。

#### 1.3 编译时报错：SyntaxError: Unexpected token

尖括号 “<” 右侧需要留一个空格，[#4243](https://github.com/NervJS/taro/issues/4243)

##### 解决办法：

检查是否存在以下写法：

```jsx
<view>{{a <4? "1": "2"}}</view>
```

改为：

```jsx
<view>{{a < 4? "1": "2"}}</view>
```

#### 1.4 运行时报错：ReferenceError: item is not defined

查看编译后的 JSX，是否因为漏了从 `this.data` 中取出变量，如：

```
// 下面的代码没有引用 item
const { a, b, c } = this.data
```

##### 解决办法：

`this.data` 中的变量名，不要和用于指定数组当前下标的变量名，默认值为 `item`，或由 `wx:for-index` 具体指定的变量名相同。


#### 1.5 不支持 WXS 里的 GetRegExp 方法

使用 `RegExp` 构造正则表达式。

#### 1.6 `<include>` 里不支持使用 `<template>`

#### 1.7 template 里暂不支持使用 catch 事件

### 2. 事件

* 事件不支持绑定字符串。
* `catchtouchmove` 转换后只能停止回调函数的冒泡，不能阻止滚动穿透。如要阻止滚动穿透，可以手动给编译后的 `View` 组件加上 `catchMove` 属性。
* 不支持事件捕获阶段。
* 不支持使用 WXS 函数响应事件。
* 不支持互斥事件绑定 `mut-bind`。
* 不支持 `mark` 来识别具体触发事件的 target 节点。

### 3. CommonJS 和 ES 模块化语法不能混用

可能遇到的报错信息：

* Cannot assign to read only property 'exports' of object
* export '[something]' (imported as '[name]') was not found in '[somePath]'

在使用到小程序 API 的地方，Taro 会把 `wx.api()` 转换为 `Taro.api()`，同时在文件的头部加上 `import Taro from '@tarjs/taro`。

如果此文件原本是使用 **CommonJS** 组织模块，可能会出现问题，需要手动修复。

### 4. selectorQuery API 获取不到 DOM

1. 一定要在 `onReady`、`ready` 生命周期中才能调用小程序 API 获取 DOM。
2. 不需要调用 `.in(this)` 方法。

### 5. Image 没有处理动态拼接的 src

Taro 会对 `Image` 组件的 src 进行处理：

```jsx
// 转换前：
<Image src='../../img/icons/0.png' />
// 转换后：
<Image src={require('../../img/icons/0.png')} />
```

但如果 `src` 是动态拼接的字符串，则需要手动修改：

```jsx
// 转换前：
<Image src='../../img/icons/' + chart.id + '.png' />
// 转换后：
<Image src='../../img/icons/' + chart.id + '.png' />
// 手动修改，图片也需要手动拷贝到 taroConert/src 对应目录下：
<Image src={require('../../img/icons/' + chart.id + '.png')} />
```

### 6. require 的参数不能是变量

可能遇到的报错信息：

* The "path" argument must be of type string. Received type undefined

不支持转换以下写法，[#4749](https://github.com/NervJS/taro/issues/4749)：

```js
var pathTest = './test.js'
var test = require(pathTest)
```

Taro 目前只能转换 `require` 字符串的写法。

### 7. 没有处理 export from 语法

暂时手动处理，[#5131](https://github.com/NervJS/taro/issues/5131)。

### 8. Issues

反向转换的更多问题，请查阅 Taroize 相关 [Issues](https://github.com/NervJS/taro/issues?q=is%3Aopen+is%3Aissue+label%3AA-taroize)。
