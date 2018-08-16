# 最佳实践

## 关于 JSX 支持程度补充说明

由于 JSX 中的写法千变万化，我们不能支持到所有的 JSX 写法，同时由于微信小程序端的限制，也有部分 JSX 的优秀用法暂时不能得到很好地支持，特在此补充说明一下对于 JSX 的支持程度

* [不能在自定义组件中写 children](https://github.com/NervJS/taro/blob/master/packages/eslint-plugin-taro/docs/custom-component-children.md)
* [不能在包含 JSX 元素的 map 循环中使用 if 表达式](https://github.com/NervJS/taro/blob/master/packages/eslint-plugin-taro/docs/if-statement-in-map-loop.md)
* [不能使用 Array#map 之外的方法操作 JSX 数组](https://github.com/NervJS/taro/blob/master/packages/eslint-plugin-taro/docs/manipulate-jsx-as-array.md)
* [不能在 JSX 参数中使用匿名函数](https://github.com/NervJS/taro/blob/master/packages/eslint-plugin-taro/docs/no-anonymous-function-in-props.md)
* [暂不支持在 render() 之外的方法定义 JSX](https://github.com/NervJS/taro/blob/master/packages/eslint-plugin-taro/docs/no-jsx-in-class-method.md)
* [不允许在 JSX 参数(props)中传入 JSX 元素](https://github.com/NervJS/taro/blob/master/packages/eslint-plugin-taro/docs/no-jsx-in-props.md)
* [不能在 JSX 参数中使用对象展开符](https://github.com/NervJS/taro/blob/master/packages/eslint-plugin-taro/docs/no-spread-in-props.md)
* [不支持无状态组件](https://github.com/NervJS/taro/blob/master/packages/eslint-plugin-taro/docs/no-stateless-function.md)

## 全局变量

在 Taro 中推荐使用 `Redux` 来进行全局变量的管理，但是对于一些小型的应用， `Redux` 就可能显得比较重了，这时候如果想使用全局变量，推荐如下使用。

新增一个自行命名的 `JS` 文件，例如 `global_data.js`，示例代码如下

```javascript
const globalData = {}

export function set (key, val) {
  globalData[key] = val
}

export function get (key) {
  return globalData[key]
}
```

随后就可以在任意位置进行使用啦

```javascript
import { set as setGlobalData, get as getGlobalData } from './path/name/global_data'

setGlobalData('test', 1)

getGlobalData('test')
```
