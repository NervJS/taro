# 不能在 JSX 参数中使用对象展开符(Object spread)(taro/no-spread-in-props)

微信小程序组件要求每一个传入组件的参数都必须预先设定好，而对象展开符则是动态传入不固定数量的参数。所以 Taro 没有办法支持该功能。

## 规则详情

以下代码会被 ESLint 提示警告，同时在 Taro（小程序端）也不会有效：

```javascript
<View {...this.props} />

<View {...props} />

<Custom {...props} />
```

以下代码不会被警告，也应当在 Taro 任意端中能够运行：

```javascript
const { id, ...rest } = obj

const [ head, ...tail]  = array

const obj = { id, ...rest }
```

## 解决方案

除非微信小程序开放更多能力，目前看不到能支持该特性的可能性。
