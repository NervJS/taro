---
title: 小程序插件开发
---

## 微信小程序插件开发

> 目前微信小程序仅支持使用 `React` 来进行开发

[微信小程序插件开发概述](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/)

### 创建插件开发模版

微信小程序插件分为**页面**、**组件**、**接口**三种。开发者可以使用 `taro init` 命令，然后选择生成**微信小程序插件模版**，即可在当前目录生成包含上述三种插件类型的 Taro 微信小程序插件项目。

### 修改 appid

创建完模版后，首先需要修改 `project.config.json` 的 **appid** 字段和 `src/app.js` 的 **prodiver** 字段为同一 appid。

### 项目结构

推荐的插件项目结构如下：

注意，最后发布的是 plugin 文件夹内的内容，插件的所有内容及除了 npm 包以外的依赖都应写在 plugin 文件夹内。`src/pages` 内的页面只是用于调试插件。

    ├── config                 配置目录
    ├── src                    源码目录
    |   ├── pages              调试页面目录，用于调试插件
    |   |   └── index          
    |   ├── plugin             插件目录
    |   |   ├── doc            插件文档目录
    |   |   ├── components     组件插件目录
    |   |   ├── pages          页面插件目录
    |   |   ├── index.js       接口插件文件
    |   |   └── plugin.json    插件配置文件
    |   ├── app.css            项目总通用样式
    |   └── app.js             项目入口文件
    └── package.json
    └── package.config.json

### 编译项目

```bin
taro build --plugin weapp
taro build --plugin weapp --watch
```

### 添加小程序项目

在微信开发者工具中添加 Taro 插件项目根目录。

### 使用插件页面

plugin.json 的 **pages** 字段加入页面插件路径：

```json title="plugin.json"
{
  "pages": {
    "list": "pages/list/list"
  }
}
```

页面使用路径： **plugin://[app.js 中注册的插件名]/[plugin.json 中注册的页面名]** 进行跳转。

```jsx {1}
<Navigator url='plugin://myPlugin/list'>
  Go to pages/list!
</Navigator>
```

### 使用插件组件

plugin.json 的 **publicComponents** 字段加入组件插件路径：

```json title="plugin.json"
{
  "publicComponents": {
    "avatar": "components/avatar/avatar"
  }
}
```

在页面配置 config.usingComponents 中配置好插件名和插件路径（**plugin://[app.js 中注册的插件名]/[plugin.json 中注册的组件名]**）：

```jsx {4}
export default class Index extends Component {
  config = {
    usingComponents: {
      'avatar': 'plugin://myPlugin/avatar'
    }
  }
}
```

#### 插件组件接受外部 props

如果需要给插件传入参数，需要将参数统一放在组件的 `props` 中进行传入。

```js
// 常规 props 传递
<Plugin title={this.state.name} desc={this.state.desc} />

// 在使用插件组件时需要改造成以下形式：
const extraProps = {
  name: this.state.name,
  desc: this.state.desc
}
<Plugin props={extraProps} />
```

### 使用插件接口

plugin.json 的 **main** 字段加入接口插件路径：

```json title="plugin.json"
{
  "main": "index.js"
}
```

页面中使用：

```jsx
const myPluginInterface = Taro.requirePlugin('myPlugin')

export default class Index extends Component {
  componentWillMount () {
    myPluginInterface.sayHello()
    const answer = myPluginInterface.answer
    console.log('answer: ', answer)
  }
```
