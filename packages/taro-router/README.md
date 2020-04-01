# `@tarojs/router`

H5 端路由系统。

## 核心 API

### createRouter(app, config, type, framework, reactdom)

暴露给 `@tarojs/taro-loader/h5` 调用，在应用入口文件中调用，创建一个兼容小程序路由规范的应用。

#### 参数

#### `app`

入口文件默认导出的组件

#### `config`

应用全局配置及页面配置。对应 `app.config.js` 及 `page.config.js` 的返回内容。

#### `type`

框架类型，`react` | `vue` | `nerv` 三选一。

#### `framework`

框架的 default import 对象。

### `reactdom`

可选，`react-dom` 的 default import 对象。

