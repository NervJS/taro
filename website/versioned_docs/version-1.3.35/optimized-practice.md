---
title: 性能优化实践
id: version-1.3.35-optimized-practice
original_id: optimized-practice
---

## 开发者手动优化

开发者可以借助 Taro 提供的各种工具对程序性能进行优化。

### 预加载

在**微信小程序**、**支付宝小程序**和**QQ轻应用**中，从调用 `Taro.navigateTo` 或 `Taro.redirectTo` 后，到页面触发 componentWillMount 会有一定延时。因此一些网络请求可以提前到发起跳转前一刻去请求。

Taro 提供了 `componentWillPreload` 钩子，它接收页面跳转的参数作为参数。可以把需要预加载的内容通过 `return` 返回，然后在页面触发 componentWillMount 后即可通过 `this.$preloadData` 获取到预加载的内容。

注意：调用跳转方法时需要使用**绝对路径**，相对路径不会触发此钩子。

```jsx
class Index extends Component {
  componentWillMount () {
    console.log('isFetching: ', this.isFetching)
    this.$preloadData
      .then(res => {
        console.log('res: ', res)
        this.isFetching = false
      })
  }

  componentWillPreload (params) {
    return this.fetchData(params.url)
  }

  fetchData () {
    this.isFetching = true
    ...
  }
}
```

### 在小程序中，可以使用 this.$preload 函数进行页面跳转传参

用法：`this.$preload(key: String | Object, [ value: Any ])`

之所以命名为 $preload，因为它也有一点预加载数据的意味。

如果觉得每次页面跳转传参时，需要先把参数 stringify 后加到 url 的查询字符串中很繁琐，可以利用 `this.$preload` 进行传参。

另外如果传入的是下一个页面的数据请求 promise，也有上一点提到的“预加载”功能，也能够绕过 componentWillMount 延时。不同点主要在于代码管理，开发者可酌情使用。

例子:

```js
// 传入单个参数

// A 页面
// 调用跳转方法前使用 this.$preload
this.$preload('key', 'val')
Taro.navigateTo({ url: '/pages/B/B' })

// B 页面
// 可以于 this.$router.preload 中访问到 this.$preload 传入的参数
componentWillMount () {
  console.log('preload: ', this.$router.preload.key)
}
```

```js
// 传入多个参数

// A 页面
this.$preload({
  x: 1,
  y: 2
})
Taro.navigateTo({ url: '/pages/B/B' })

// B 页面
componentWillMount () {
  console.log('preload: ', this.$router.preload)
}
```

### shouldComponentUpdate

当你清楚在某些情况下组件不需要被重新渲染时，可以通过在 `shouldComponentUpdate` 钩子里返回 **false** 来跳过本次渲染流程。

```js
shouldComponentUpdate (nextProps, nextState) {
  if (this.props.color !== nextProps.color) {
    return true
  }
  if (this.state.count !== nextState.count) {
    return true
  }
  return false
}
```

### Taro.PureComponent

在大多数情况下，开发者可以让组件继承于 `Taro.PureComponent` 类，而无需手动实现 `shouldComponentUpdate`。`Taro.PureComponent` 里实现了 `shouldComponentUpdate`，它会把新旧 props 和新旧 state 分别做一次浅对比，以避免不必要的渲染。

### Taro.memo

> 自 v1.3.0 可用

`Taro.memo` 是一个高阶组件，它和 `PureComponent` 非常相似。但它适用于函数式组件，而非 Class 组件。

如果你的函数组件在给定相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 Taro.memo 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，Taro 将跳过渲染组件的操作并直接复用最近一次渲染的结果。

默认情况下其只会对复杂对象做浅层对比（和 `PureComponent` 行为一致），如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

```jsx
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default Taro.memo(MyComponent, areEqual);
```

> 注意
> 与 class 组件中 `shouldComponentUpdate()` 方法不同的是，如果 props 相等，`areEqual` 会返回 `true`；如果 props 不相等，则返回 `false`。这与 `shouldComponentUpdate` 方法的返回值相反。

## Taro 框架层面优化

Taro 框架做了一些性能优化方面的工作，这部分毋需开发者手动处理，开发者可稍做了解。

### 小程序数据 diff

在真正调用小程序的 setData 方法之前，Taro 会把页面或组件的 state 和当前页面或组件的 data 做一次 diff，只对必要更新的数据做 setData，开发者无需手动优化。

##### diff 逻辑：

1. 全等 => 跳过
2. 新增字段 => 使用新值
3. 类型不同 => 使用新值
4. 类型相同、基础数据类型 => 使用新值
5. 其中一方为数组，另一方不是 => 使用新值
6. 都为数组、新数组比旧数组短 => 使用新值
7. 都为数组、新数组长度大于等于旧数组的长度 => 逐项 diff、按路径更新
8. 其中一方为 null，另一方不是 => 使用新值
9. 都为对象，新对象缺少旧对象某些属性 => 使用新值
10. 都为对象，新对象拥有旧对象所有的属性 => 逐项 diff、按路径更新

例子：

```js
// 新值
const state = {
  a: 1,
  b: 22,
  d: 4,
  list: [1],
  arr: [1, 'a', true, null, 66],
  obj: {
    x: 5
  },
  foo: {
    x: 8,
    y: 10,
    z: 0
  }
}

// 旧值
const data = {
  a: 1,
  b: 2,
  c: 3,
  list: [1, 2, 3],
  arr: [1, 2, 3],
  obj: {
    x: 10,
    y: 8
  },
  foo: {
    x: 'xxx',
    y: 10
  }
}

diff(data, state)
/**
 * diff 结果
{
  b: 22,
  d: 4,
  list: [ 1 ],
  'arr[1]': 'a',
  'arr[2]': true,
  'arr[3]': null,
  'arr[4]': 66,
  obj: { x: 5 },
  'foo.x': 8,
  'foo.z': 0
}
*/
```
