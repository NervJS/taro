---
title: Troubleshooting
---

## Unsupported Mini Program Features

### App Object

| Property             | Description |
|:-------------------- |:----------- |
| onError              |             |
| onPageNotFound       |             |
| onUnhandledRejection |             |
| onThemeChange        |             |

### Page Object

| Property             | Description                            |
|:-------------------- |:-------------------------------------- |
| selectComponent      | Recommended to refactor with React ref |
| selectAllComponents  | Recommended to refactor with React ref |
| selectOwnerComponent | Recommended to refactor with React ref |
| groupSetData         |                                        |

### Custom Component

| Property         | Description                                                                                                    |
|:---------------- |:-------------------------------------------------------------------------------------------------------------- |
| moved            |                                                                                                                |
| externalClasses  | Taro 3 does not have custom components, it is recommended to standardize class names or use CSS Module instead |
| relations        |                                                                                                                |
| options          |                                                                                                                |
| definitionFilter |                                                                                                                |

### Wxml Syntax

| Property    | Description                                                                             |
|:----------- |:--------------------------------------------------------------------------------------- |
| Circulation | [Some grammar restrictions apply]                                                       |
| Event       | [Some grammar restrictions apply](./taroize-troubleshooting#2-事件)                       |
| Citation    | [Some grammar restrictions apply](./taroize-troubleshooting#16-include-里不支持使用-template) |
| wxs         | [Some grammar restrictions apply](./taroize-troubleshooting#15-不支持-wxs-里的-getregexp-方法) |

## Key Questions

### 1. No base class handled

In native development, the public logic of App, Page, and Component construction objects are often integrated into base classes.

As **Vant-weapp**：

```js
// Component
VantComponent({
  data: {}
})
// Base Classes
function VantComponent(vantOptions = {}) {
  // Integrate component-specific configuration vantOptions and public configuration into the final configuration object options
  // ... // Call the Component method of the mini program to construct a custom component
  Component(options);
}
```

Taro only recognizes the `App()`, `Page()`, `Component()` calls that exist in the entry, page, and component files at compile time, and these calls do not exist when the configuration is wrapped using the base class.So the compiled `withWeapp` gets the parameter `{}`.

```js
VantComponent({
  data: {}
})
// The mini program configuration object should be passed into withWeapp
@withWeapp({})
class _C extends React.Component {}
```

Therefore we need to manually modify.

```js
// Base classes
function VantComponent(vantOptions = {}) {
  // Integrate the component-specific configuration vantOptions and the public configuration into the final configuration object options
  // ... // Call the Component method of the mini program to construct a custom component
  // Component(options);

  // 1. The base class returns the integrated options directly
  return options
}
```


```js
// 2. Pass the configuration created by the base class into withWeapp. const options = VantComponent({
  data: {}
})
@withWeapp(options)
class _C extends React.Component {}
```

### 2. Style Scopes

The custom component in WeChat mini program will generate a React/Vue component in Taro after conversion.

However, the components developed in Taro using React/Vue will not generate the corresponding mini program custom components when compiled to the mini program platform.

**** Therefore, the style isolation feature of the WeChat mini program custom component is lost after the conversion to Taro.**

#### Solution.

1. Modify the conflicting selector.
2. Use CSS Modules to rewrite.

## Frequently Asked Questions

### 1. wxml syntax conversion problem

Converting `wxml` to `JSX` is achieved by manipulating `AST`, and there are some writes that may not take into account, or may be difficult to adapt, resulting in error reporting.

The following are some known issues that need to be fixed manually.

#### 1.1 Component conversion error when using both `wx:for` and `wx:if` statements

When both `wx:for` and `wx:if` statements are used on the component, and the current **loop element item** or **loop subscript index** is used as the judgment condition, the conversion will report an error.

eg:

```jsx
// Before the conversion (note that the condition uses the circular subscript index). <block wx:for="{{objectArray}}" wx:if="{{index % 2 !== 0}}">
  <view>objectArray item: {{item.id}}</view>
</block>
```

```jsx
// After the conversion
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

As you can see in the above example, for the conversion of conditional statements, the current processing extracts the condition outside the component.However, if the condition uses `item` or `index`, such extraction logic will result in an error reporting **variable not defined**.

For the time being, this can be fixed manually by fixing.

Method 1, modify the code **before compiling** to split the loop and conditional statements into two components.

```jsx
<block wx:for="{{objectArray}}">
  <block wx:if="{{index % 2 !== 0}}">
    <view>objectArray item: {{item.id}}</view>
  </block>
</block>
```

Method two, modify the code of **post-compile** to put the conditional judgment into the loop body.

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

#### 1.2 The root element cannot contain the `hidden` attribute.

#### 1.3 Compile with an error: SyntaxError: Unexpected token

A space is required to the right of the apostrophe "<". [#4243](https://github.com/NervJS/taro/issues/4243)

##### Solution

Check for the following writing style.

```jsx
<view>{{a <4? "1": "2"}}</view>
```

Change to：

```jsx
<view>{{a < 4? "1": "2"}}</view>
```

#### 1.4 Run with the following error： ReferenceError: item is not defined

Look at the compiled JSX to see if the variable was removed from `this.data` because it was omitted, eg:

```
// The following code does not reference item
const { a, b, c } = this.data
```

##### Solution:

The variable name in `this.data` should not be the same as the variable name used to specify the current subscript of the array, which defaults to `item`, or the variable name specified by `wx:for-index`.


#### 1.5 The GetRegExp method in WXS is not supported.

Construct regular expressions using `RegExp`.

#### 1.6 The use of `<template>` is not supported in `<include>`

#### 1.7 The catch event is not supported in the template at this time

### 2. Event

* Events do not support binding strings.
* The `catchtouchmove` conversion only stops the callback function from bubbling, it does not prevent scroll-through.To prevent scroll-through, you can manually add the `catchMove` property to the compiled `View` component.
* Event capture phase is not supported.
* Responding to events with WXS functions is not supported.
* Mutually exclusive event binding `mut-bind` is not supported.
* Does not support `mark` to identify the specific target node that triggered the event.

### 3. CommonJS and ES modular syntax do not mix

Possible error messages encountered.

* Cannot assign to read only property 'exports' of object
* export '[something]' (imported as '[name]') was not found in '[somePath]'

Where the mini program API is used, Taro will convert `wx.api()` to `Taro.api()` and add `import Taro from '@tarjs/taro` to the header of the file.

If this file originally used **CommonJS** to organize the module, it may cause problems and need to be fixed manually.

### 4. The selectorQuery API does not get the DOM.

1. must be in the `onReady`, `ready` life cycle to call the mini program API to get the DOM.
2. You don't need to call `.in(this)` method.

### 5. Image does not handle dynamically stitched src

Taro will process the src of the `Image` component.

```jsx
<Image src='../../img/icons/0.png' />
// After conversion. <Image src={require('../../img/icons/0.png')} />
```

However, if `src` is a dynamically spliced string, you need to modify it manually: `src` is a dynamically spliced string.

```jsx
// Before conversion. <Image src='../../img/icons/' + chart.id + '.png' />
// After conversion. <Image src='../../img/icons/' + chart.id + '.png' />
// For manual changes, the images also need to be manually copied to the corresponding directory in taroConert/src. <Image src={require('../../img/icons/' + chart.id + '.png')} />
```

### 6. The argument to require cannot be a variable

Possible error messages encountered:

* The "path" argument must be of type string. Received type undefined

Does not support converting the following writeups.[#4749](https://github.com/NervJS/taro/issues/4749)：

```js
var pathTest = './test.js'
var test = require(pathTest)
```

Taro can currently only convert `require` strings to be written.

### 7. The export from syntax is not handled

Temporary manual handling [#5131](https://github.com/NervJS/taro/issues/5131)。

### 8. Issues

For more questions on reverse conversion, please refer to the Taroize related [Issues](https://github.com/NervJS/taro/issues?q=is%3Aopen+is%3Aissue+label%3AA-taroize)。
