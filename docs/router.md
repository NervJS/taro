# 路由功能

在 **Taro** 中，路由功能是默认自带的，不需要开发者进行额外的路由配置。

我们只需要在入口文件的 `config` 配置中指定好 `pages`，然后就可以在代码中通过 **Taro** 提供的 API 来跳转到目的页面，例如：

```javascript
// 跳转到目的页面，打开新页面
Taro.navigateTo({
  url: '/pages/page/path/name'
})

// 跳转到目的页面，在当前页面打开
Taro.redirectTo({
  url: '/pages/page/path/name'
})
```

具体 API 说明，请查看[导航](./native-api.md#导航)部分说明。
