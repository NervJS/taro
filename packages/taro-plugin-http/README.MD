# @tarojs/plugin-http

`Taro` 运行时扩展插件， 扩展了 `web` 开发中网络请求相关的能力,让 `taro` 可以使用 [axios](https://github.com/axios/axios) 等网络请求封装库。

> 本插件需搭配 taro 3.6.0 及其以上版本使用

### XMLHttpRequest

在小程序端模仿浏览器的 `XMLHttpRequest` 实现的对象，在浏览器环境中返回浏览器本身的 `XMLHttpRequest`。此对象通过 Webpack 的 [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/) 注入到全局对象以供第三方库调用。

### document.cookie

在小程序端通过本地存储模仿浏览器的 `document.cookie` 实现的对象，在浏览器环境中返回浏览器本身的 `document.cookie`。

### 其他影响

1.为了能正常使用 [axios](https://github.com/axios/axios) 库， 本插件会通过 Webpack 的 [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/)功能，在编译小程序时将全局的 `FormData`、 `Blob` 对象替换成 `undefined`，这样使用 `axios` 时不会有 `FormData is not defined` 这类异常，相应的代价是 `axios` 的上传文件的功能也将不可用， 考虑到小程序有自己的独特上传API，这是可以接受的。

如果需要改变上述行为，可以通过传入选项 `disabledFormData` 、 `disabledBlob`：
```js
// config/index.js
config = {
  // ...
  plugins: [
    ['@tarojs/plugin-http', {
        disabledFormData: false,
        disabledBlob: false
    }]
  ],
}
```

2.[axios](https://github.com/axios/axios) 中使用了`document.createElement("a")` 动态创建 `a` 标签设置 `href` 属性，然后读取 `protocol`、`host` 等属性来判断是否同源跨域；@tarojs/runtime 3.6.0 版本中支持了动态创建 `a` 标签， 并导出了一些公共函数，因此本插件需要配合 `taro 3.6.0及其以上版本` 使用  

### 安装

```
npm i @tarojs/plugin-http
```

### 使用

```js
// config/index.js
config = {
  // ...
  plugins: ['@tarojs/plugin-http'],
}
```

插件提供了3个参数：


| 参数名 | 默认值 | 说明 |
| :--- | :--- | :--- |
| enableCookie | false | (是否)注入相关代码，支持 `document.cookie` 、 通过后端返回 `Set-Cookie` 响应头来设置 `cookie`  |
| disabledFormData | true | (是否)禁用掉 FormData 全局对象 |
| disabledBlob | true | (是否)禁用掉 Blob 全局对象 |

