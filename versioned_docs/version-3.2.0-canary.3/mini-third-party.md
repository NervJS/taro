---
title: 使用小程序原生第三方组件和插件
---

Taro 支持使用小程序的第三方组件和插件，使用方式也异常的简单。

> 注意：如果在 Taro 项目引用了小程序原生的第三方组件和插件，那么该项目将**不再具备多端转换的能力**，例如，如果使用了微信小程序的第三方组件，那么项目只能转换成微信小程序，转义成其他平台会失效，使用其他小程序原生组件同理。

## 使用第三方原生组件

首先需要将第三方组件库下载到项目的 `src` 目录下，随后在页面或者组件里通过配置 `usingComponents` 指定需要引用的第三方组件即可。

组件调用的时候需要**按照 JSX 的使用规范**来进行传参和事件绑定。

### 使用方法

1. 在页面配置文件中配置 `usingComponents` 属性。

> 注意：Taro3 中没有自定义组件，组件是没有配置文件的。usingComponents 必须配置在“页面”的配置文件中。

```js {2} title="page.config.js"
export default {
  usingComponents: {
    // 定义需要引入的第三方组件
    // 1. key 值指定第三方组件名字，以小写开头
    // 2. value 值指定第三方组件 js 文件的相对路径
    'ec-canvas': '../../components/ec-canvas/ec-canvas'
  }
}
```

2. JSX 中引用

```jsx {14} title="page.js"
import React, { Component } from 'react'
import { View } from '@tarojs/components'

export default class Index extends Component {
  this.state = {
    ec: {
      onInit: function () {}
    }
  }

  render () {
    return (
      <View>
        <ec-canvas id='mychart-dom-area' canvas-id='mychart-area' ec={this.state.ec} />
      </View>
    )
  }
}
```

### 事件

事件以 `on` 开头，取代原生绑定语法中的 `bind`。

### selectComponent

可以使用小程序页面实例的 `selectComponent` API 获取第三方原生组件的实例。

```js
import { getCurrentInstance } from '@tarojs/taro'

const { page } = getCurrentInstance()
page.selectComponent('#mychart-dom-area')
```

### 使用 Slot

在 React 中使用 `<slot name="slotName" />`（首字母小写），在 Vue 中使用 `<slot-view name="slotName" />`（由于 `slot` 在 Vue 中是内置组件）。

### 使用 vant-weapp

使用 `vant-weapp` 第三方原生组件库：[示例项目](https://github.com/NervJS/taro3-vant-sample)。

## 使用小程序插件

### 引入插件代码包

使用插件前，使用者要在 `app.confg.js` 的配置中声明需要使用的插件，例如

```jsx title="app.config.js"
export default {
  plugins: {
    myPlugin: {
      version: '1.0.0',
      provider: 'wxidxxxxxxxxxxxxxxxx'
    }
  }
}
```

如上例所示， `plugins` 定义段中可以包含多个插件声明，每个插件声明以一个使用者自定义的插件引用名作为标识，并指明插件的 `appid` 和需要使用的版本号。其中，引用名（如上例中的 myPlugin）由使用者自定义，无需和插件开发者保持一致或与开发者协调。在后续的插件使用中，该引用名将被用于表示该插件。

### 使用插件

使用插件时，插件的代码对于使用者来说是不可见的。为了正确使用插件，使用者应查看插件详情页面中的“开发文档”一节，阅读由插件开发者提供的插件开发文档，通过文档来明确插件提供的自定义组件、页面名称及提供的 js 接口规范等。

#### 自定义组件

使用插件提供的自定义组件，和上述 “引入第三方组件” 的方式相仿，在页面或组件的配置中定义需要引入的自定义组件时，使用 `plugin://` 协议指明插件的引用名和自定义组件名，例如：

```js
export default {
  // 定义需要引入的插件
  usingComponents: {
    'hello-component': 'plugin://myPlugin/hello-component'
  }
}
```

出于对插件的保护，插件提供的自定义组件在使用上有一定的限制：

- 默认情况下，页面中的 `this.$scope.selectComponent` 接口无法获得插件的自定义组件实例对象；
- `Taro.createSelectorQuery` 等接口的 `>>>` 选择器无法选入插件内部。

#### 页面

插件的页面从小程序基础库版本 2.1.0 开始支持。

需要跳转到插件页面时，url 使用 `plugin://` 前缀，形如 `plugin://PLUGIN_NAME//PLUGIN_PAGE`， 如：

```jsx
<Navigator url='plugin://myPlugin/hello-page'>
  Go to pages/hello-page!
</Navigator>
```

#### js 接口

使用插件的 `js` 接口时，可以使用 `Taro.requirePlugin` 方法。例如，插件提供一个名为 `hello` 的方法和一个名为 `world` 的变量，则可以像下面这样调用：

```js
const myPluginInterface = requirePlugin('myPlugin')
const myWorld = myPluginInterface.world

myPluginInterface.hello()
```

## 注意事项

在使用第三方组件以及插件提供的组件时，事件绑定的写法与原生写法略有不同，因为必须遵循 Taro 中事件绑定的规范，例如，原生中引入第三方组件的写法

```jsx
<calendar binddayClick='dayClickHandler' />
```

那么在 Taro 中的写法则是

```jsx
<calendar onDayClick={this.dayClickHandler} />
```

> 请参考示例项目：https://github.com/NervJS/taro-sample-weapp
