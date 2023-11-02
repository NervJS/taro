# @tarojs/plugin-websocket

`Taro` 运行时扩展插件， 扩展了 `web` 开发中网络请求相关的能力,让 `taro` 可以使用 socket.io-client 等socket请求封装库。

> 本插件需搭配 taro 3.6.0 及其以上版本使用

### WebSocket

在小程序端模仿浏览器的 `WebSocket` 实现的对象，在浏览器环境中返回浏览器本身的 `WebSocket`。此对象通过 Webpack 的 [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/) 注入到全局对象以供第三方库调用。

```js
// config/index.js
config = {
  // ...
  plugins: [
    ['@tarojs/plugin-websocket']
  ],
}
```