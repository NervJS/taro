---
title: Applet Plugin Development
---

## Micromessage applet development

> The micromessage applet is currently only supported using `React` for development

[Micromessage applet development overview](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/)

### Create Plugin Development Template

The micromessage applet plugin is to**pages**,**components**,**interfaces**interfaces.Developers can use `taro init` command, then choose to generate**micromessage applet plugins**to generate Taro micromessp plugin items that include the three plugin types above in the current directory.

### Edit appid

After creating a template, you first need to modify `project.config.json` the **appid** fields and `src/app.js` the **prodiver** fields are the same as apps.

### Project Structure

Recommended plugin project structure below：

Note that the contents of the plugin folder are finally published, all plugin content and dependencies other than npm packages should be written in the plugin folder.The page in `src/pages` is only used to debug plugins.

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

### Compilation project

```bin
taro build --plugin app
taro build --plugin weapp --watch
```

### Add applet item

Add the project root of Taro plugin in the microletter developer tool.

### Use Plugin Page

Plugin.json **pages** to add page plugin path to page plugins：

```json title="plugin.json"
{
  "pages": {
    "list": "pages/list/list"
  }
}
```

The page uses path： **plugin:/[plugin name registered in app.js]/[page name registered in plugin.json]** to jump.

```jsx {1}
<Navigator url='plugin://myPlugin/list'>
  Go to pages/list!
</Navigator>
```

### Use Plugins

plugin.json's **publicComponents** field to join component plugin path：

```json title="plugin.json"
{
  "public Companies": LO
    "avatar": "components/avatar/avatar"
  }
}
```

Configure plugin names and plugin paths in config.usingCompounds(**plugin://[plugin names registered in app.js]/[component names registered in plugin.js]**)：

```jsx {4}
export default class index extends Compound {
  config = {
    usingComponents: LO
      'avatar': 'plugin:/myPlugin/avatar'
    } }
  }
}
```

#### Plugin component accepts external props

If you want to pass the plugin into the parameter, you need to place the parameter uniformly in the component `props` for imported.

```js
// General props pass
<Plugin title={this.state.name} desc={this.state.desc} />

// needs to be changed to the following forms when using plugin components：
const extraProps = {
  name: this.state.name,
  desc: this.state.desc
}
<Plugin props={extraProps} />
```

### Use Plugin Interface

plugin.json 的 **main** 字段加入接口插件路径：

```json title="plugin.json"
{
  "main": "index.js"
}
```

Use： on page

```jsx
const myPluginInterface = Taro.requirePlugin ('myPlugin')

export default class index extends Component
  componentWillMount () LO
    myPluginInterface. ayHello()
    const answer = myPluginInterface.answer
    console.log('answer: ', answe)
}
```
