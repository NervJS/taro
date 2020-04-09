---
title: 路由功能
id: version-2.1.3-router
original_id: router
---

## 路由 API 说明

在 **Taro** 中，路由功能是默认自带的，不需要开发者进行额外的路由配置。

我们只需要在入口文件的 `config` 配置中指定好 `pages`，然后就可以在代码中通过 **Taro** 提供的 API 来跳转到目的页面，例如：

```jsx
// 跳转到目的页面，打开新页面
Taro.navigateTo({
  url: '/pages/page/path/name'
})

// 跳转到目的页面，在当前页面打开
Taro.redirectTo({
  url: '/pages/page/path/name'
})
```

具体 API 说明，请查看[导航](./apis/interface/navigation/navigateTo.html)部分说明。

## 路由传参

我们可以通过在所有跳转的 `url` 后面添加查询字符串参数进行跳转传参，例如

```jsx
// 传入参数 id=2&type=test
Taro.navigateTo({
  url: '/pages/page/path/name?id=2&type=test'
})

```

这样的话，在跳转成功的目标页的**生命周期**方法里就能通过 `this.$router.params` 获取到传入的参数，例如上述跳转，在目标页的 `componentWillMount` 生命周期里获取入参

```jsx
class C extends Taro.Component {
  componentWillMount () {
    console.log(this.$router.params) // 输出 { id: '2', type: 'test' }
  }
}
```
