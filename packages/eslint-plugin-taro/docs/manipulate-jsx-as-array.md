#  不能使用 Array#map 之外的方法操作 JSX 数组 (taro/manipulate-jsx-as-array)

Taro 在小程序端实际上把 JSX 转换成了字符串模板，而一个原生 JSX 表达式实际上是一个 React/Nerv 元素(react-element)的构造器，因此在原生 JSX 中你可以随意地一组 React 元素进行操作。但在 Taro 中你只能使用 `map` 方法，Taro 转换成小程序中 `wx:for`。

## 规则详情

以下代码会被 ESLint 提示警告，同时在 Taro（小程序端）也不会有效：

```javascript
test.push(<View />)

numbers.forEach(numbers => {
  if (someCase) {
    a = <View />
  }
})

test.shift(<View />)

components.find(component => {
  return component === <View />
})

components.some(component => component.constructor.__proto__ === <View />.constructor)
```

以下代码不会被警告，也应当在 Taro 任意端中能够运行：

```javascript
numbers.filter(Boolean).map((number) => {
  const element = <View />
  return <View />
})
```

## 解决方案

先处理好需要遍历的数组，然后再用处理好的数组调用 `map` 方法。

```javascript
numbers.filter(isOdd).map((number) => <View />)

for (let index = 0; index < array.length; index++) {
  // do you thing with array
}

const element = array.map(item => {
  return <View />
})
```

除非微信小程序开放更多能力，目前看不到能支持该特性的任何可能性。
