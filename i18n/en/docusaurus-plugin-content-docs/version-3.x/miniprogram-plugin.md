---
title: Mini Program Plugin Development
---

## WeChat mini-program plugin development

> WeChat mini-program currently only support development using `React`.

[WeChat Mini Program plugin development overview](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/)

### Create Plugin Development Templates

WeChat Mini Program plugins are divided into **pages**, **components** and **interfaces**. Developers can use the `taro init` command and then select Generate **WeChat  Mini Program Plugin Template** to generate a Taro WeChat  Mini Program plugin project containing the above three plugin types in the current directory.

### Modify appid

After creating the template, you first need to modify the **appid** field in `project.config.json` and the **prodiver** field in `src/app.js` to the same appid.

### Project Structure

The recommended plugin project structure is as follows:

Note that the last thing published is the contents of the plugin folder. All the contents of the plugin and its dependencies except for the npm package should be written in the plugin folder. The pages in `src/pages` are just for debugging the plugin.

    ├── config                 Project compilation configuration Directory
    ├── src                    Source Directory
    |   ├── pages              Debug page Directory for debugging plugins
    |   |   └── index          
    |   ├── plugin             Plugin Directory
    |   |   ├── doc            Plugin Documentation Directory
    |   |   ├── components     Component Plugin Directory
    |   |   ├── pages          Page Plugin Directory
    |   |   ├── index.js       Interface plugin files
    |   |   └── plugin.json    Plugin configuration file
    |   ├── app.css            General project style
    |   └── app.js             Project entry file
    └── package.json
    └── package.config.json

### Compile Project

```bin
taro build --plugin weapp
taro build --plugin weapp --watch
```

### Add Mini Program Project

Add the Taro plugin project root in WeChat Developer Tools.

### Using The Plugin Page

Add the **pages** field of plugin.json to the page plugin path.

```json title="plugin.json"
{
  "pages": {
    "list": "pages/list/list"
  }
}
```

The page uses the path: **plugin://[name of registered plugin in app.js]/[name of registered page in plugin.json]** for jumping.

```jsx {1}
<Navigator url='plugin://myPlugin/list'>
  Go to pages/list!
</Navigator>
```

### Using plugin components

The **publicComponents** field of plugin.json adds the component plugin path.

```json title="plugin.json"
{
  "publicComponents": {
    "avatar": "components/avatar/avatar"
  }
}
```

Configure the plugin name and plugin path in the page configuration config.usingComponents (**plugin://[name of plugin registered in app.js]/[name of component registered in plugin.json]**).

```jsx {4}
export default class Index extends Component {
  config = {
    usingComponents: {
      'avatar': 'plugin://myPlugin/avatar'
    }
  }
}
```

#### Plugin components accept external props

If you need to pass parameters to the plugin, you need to pass them uniformly in the component's `props`.

```js
// General props passing
<Plugin title={this.state.name} desc={this.state.desc} />

// needs to be transformed to the following form when using the plugin component.
const extraProps = {
  name: this.state.name,
  desc: this.state.desc
}
<Plugin props={extraProps} />
```

### Using the plugin interface

The **main** field of plugin.json adds the path to the interface plugin.

```json title="plugin.json"
{
  "main": "index.js"
}
```

Use in the page:

```jsx
const myPluginInterface = Taro.requirePlugin('myPlugin')

export default class Index extends Component {
  componentWillMount () {
    myPluginInterface.sayHello()
    const answer = myPluginInterface.answer
    console.log('answer: ', answer)
  }
```
