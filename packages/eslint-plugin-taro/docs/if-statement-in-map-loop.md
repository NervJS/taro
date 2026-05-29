# 不能在包含 JSX 元素的 map 循环中使用 if 表达式(taro/if-statement-in-map-loop)

## 规则详情

以下代码会被 ESLint 提示警告，同时在 Taro（小程序端）也不会有效：

```javascript
numbers.map((number) => {
  let element = null
  const isOdd = number % 2
  if (isOdd) {
    element = <Custom />
  }
  return element
})
```

以下代码不会被警告，也应当在 Taro 任意端中能够运行：

```javascript
numbers.map((number) => {
  let isOdd = false
  if (number % 2) {
    isOdd = true
  }
  return isOdd && <Custom />
})
```

## 解决方案

尽量在 map 循环中使用条件表达式或逻辑表达式。

```javascript
numbers.map((number) => {
  const isOdd = number % 2
  return isOdd ? <Custom /> : null
})

numbers.map((number) => {
  const isOdd = number % 2
  return isOdd && <Custom />
})
```

当测试用例和线上项目都检测通过时，Taro 将很快（下一个 Minor 版本）支持这一特性。
