---
title: Plugin
---

Taro introduced a plugin mechanism to enable developers to write plugins to extend the functionality of Taro or to customize it for their own business.

## Official Plugin

Taro offers a number of official plugins

- [@tarojs/plugin-mock](https://github.com/NervJS/taro-plugin-mock), A simple data mock plugin

## How to Add plugins

You can bring in plugins from npm or locally, mainly through the `plugins` and `presets` in [compile configuration](./config-detail.md) with `plugins` and `presets`, using the following

### plugins

Plugins are generally introduced in Taro via the [compile configuration](./config-detail.md) with the `plugins` field.

The `plugins` field takes the value of an array and is configured as follows.

```js title="/config/index.js"
const config = {
  plugins: [
    // Introducing the npm installed plugins
    '@tarojs/plugin-mock', 
    // Introduce the npm installed plugin and pass in the plugin parameters
    ['@tarojs/plugin-mock', {
      mocks: {
        '/api/user/1': {
          name: 'judy',
          desc: 'Mental guy'
        }
      }
    }],
    // The plugin is introduced from the local absolute path, and also if you need to pass in parameters as above
    '/absulute/path/plugin/filename',
  ]
}
```

### presets



If you have a series of plugins that need to be configured, and they are usually combined to do a specific thing, then you can configure them via the **plugin set** `presets`.

Configure [compile configuration](./config-detail.md) with the `presets` field, as follows.

```js title="/config/index.js"
const config = {
  presets: [
    '@tarojs/preset-sth', 
    ['@tarojs/plugin-sth', {
      arg0: 'xxx'
    }],
    '/absulute/path/preset/filename',
  ]
}
```

After understanding how to introduce a plugin, let's learn how to write a plugin.

## How to write a plugin

A Taro plugin has a fixed code structure, usually consisting of a function, for example.

```typescript
export default (ctx, options) => {
  // plugin main content
  ctx.onBuildStart(() => {
    console.log('compile start')
  })
  ctx.onBuildFinish(() => {
    console.log('compile end')
  })
  ctx.onBuildComplete(() => {
    console.log('Taro build complete')
  })
}
```

The plugin function can accept two parameters.

- ctx: information about the current running environment of the plug-in, including the plug-in related API, current running parameters, auxiliary methods, etc.
- options: the parameters passed in for the plugin call

In the body of the plugin code part can be written according to their own needs of the corresponding code, you can usually achieve the following functions.

### Typings

It is recommended to use typescript to write the plugin so you get great smart tips, using the following:

```typescript
import { IPluginContext } from '@tarojs/service'
export default (ctx: IPluginContext, pluginOpts) => {
  ctx.onBuildStart(() => {
    console.log('complie start')
  })
}
```

### Main Functions

#### Command Line Extensions

You can write plugins to extend the command line commands for Taro. In previous versions of Taro, the command line commands were fixed, and if you wanted to extend them, you had to modify the Taro source code directly, but now you can extend the Taro command line as much as you want with the plugin feature.

This functionality is mainly implemented through the `ctx.registerCommand` API, for example, by adding an upload command to upload the compiled code to the server

```typescript
export default (ctx) => {
  ctx.registerCommand({
    // Command Name
    name: 'upload',
    // The options information output when executing taro upload --help
    optionsMap: {
      '--remote': 'server address'
    },
    // Example of usage output when executing taro upload --help
    synopsisList: [
      'taro upload --remote xxx.xxx.xxx.xxx'
    ],
    async fn () {
      const { remote } = ctx.runOpts
      await uploadDist()
    }
  })
}
```

After configuring this plugin to the medium project, you can upload the compiled code to the target server with the `taro upload --remote xxx.xxx.xxx.xxx` command.

#### Compilation Process Extensions

You can also extend the code build process through plugins.

As mentioned earlier, there are `onBuildStart`, `onBuildFinish` and `onBuildComplete` hooks for the build process to indicate the start, finish and complete of the build respectively, and there are more APIs to modify the build process as follows.


- `ctx.onBuildStart(() => void)`, compile start, receive a callback function
- `ctx.modifyWebpackChain(args: { chain: any }) => void)`, In this hook, you can make the desired adjustments to the webpackChain, which is equivalent to configuring [`webpackChain`](./config-detail.md#miniwebpackchain)
- `ctx.modifyBuildAssets(args: { assets: any }) => void)`, Modify the compiled result
- `ctx.modifyBuildTempFileContent(args: { tempFiles: any }) => void)`, Modify intermediate files during the compilation process, such as the configuration of an app or page
- `ctx.onBuildFinish(() => void)`, the compilation ends and a callback function is received. It is triggered after every Webpack compilation. So in watch mode, it will trigger this callback function on every detected file change, which implies there may be multiple calls to this callback function.
- `ctx.onBuildComplete(() => void)`, build complete and a callback function is received. It is only triggered when the Taro build process is fully completed. So it differs from `onBuildFinish` in that it is triggered only once.

#### Compiler Platform Expansion

You can also extend the compilation platform with plugin functionality.

Use the API `ctx.registerPlatform`, the platform support built into Taro is implemented through this API.


> Note: This is an unfinished feature that relies on the code compiler `@tarojs/transform-wx` to complete the transformation
## API

With the above, we have a general idea of what features the Taro plugin can implement and can write a simple Taro plugin, but in order to be able to write more complex and standard plugins, we need to understand the specific API usage in the Taro plugin mechanism.

### Plugin environment variables

#### ctx.paths

Contains the paths associated with the currently executing command, all of which are as follows (not all commands will have all of the following paths):

- `ctx.paths.appPath`, The directory where the current command is executed, or the current project path if it is a `build` command
- `ctx.paths.configPath`, The current project configuration directory, or no path if the `init` command
- `ctx.paths.sourcePath`, The current project source code path
- `ctx.paths.outputPath`, Current project output code path
- `ctx.paths.nodeModulesPath`,The path to the node_modules used by the current project

#### ctx.runOpts

Gets the parameters of the currently executed command, eg. for the command `taro upload --remote xxx.xxx.xxx`, the value of `ctx.runOpts`:

```js
{
  _: ['upload'],
  options: {
    remote: 'xxx.xxx.xxx.xxx'
  },
  isHelp: false
}
```

#### ctx.helper

A shortcut to the package `@tarojs/helper`, including all its APIs.

#### ctx.initialConfig

Get the project configuration.

#### ctx.plugins

Get all currently mounted plugins.

### Plugin Method

Taro's plugin architecture is based on [Tapable](https://github.com/webpack/tapable)。

#### ctx.register(hook: IHook)

Register a hook that can be called by other plugins, receiving one parameter, the Hook object.

A Hook object is of the following type.

```typescript
interface IHook {
  // Hook name, which will also be used as Hook identifier
  name: string
  // The plugin id of the Hook, you don't need to specify it, it will be recognized automatically when the Hook is mounted.
  plugin: string
  // Hook callback
  fn: Function
  before?: string
  stage?: number
}
```

Hooks registered by `ctx.register` need to be triggered by method `ctx.applyPlugins`.

We agree to distinguish Hook types according to the `name` of the incoming Hook object, which are mainly of the following three types: 


- Hook of event type, Hook name starts with `on`, e.g. `onStart`, this type of Hook only cares about triggering but not the value of Hook callback fn, Hook's callback fn receives a parameter `opts`, which is the parameter passed in when triggering the hook
- Hook name starts with `modify`, e.g. `modifyBuildAssets`, this type of Hook will return the value after making a modification after triggering, Hook's callback fn receives two parameters `opts` and `arg`, which are the parameters passed in when triggering the hook and the result of the previous callback respectively.
- Add type Hook, Hook name starts with `add`, such as `addConfig`, this type Hook will combine the results of all callbacks into an array and finally return, Hook's callback fn receives two parameters `opts` and `arg`, which are the parameters passed in when triggering the hook and the result of the last callback execution respectively.

If the `name` of the Hook object does not belong to the above three categories, then the Hook behaves like an event type Hook.

Hook callbacks can be asynchronous or synchronous, and a series of callbacks under the same Hook identifier will be organized as asynchronous serial tasks executed sequentially with the help of Tapable's AsyncSeriesWaterfallHook.

#### ctx.registerMethod(arg: string | { name: string, fn?: Function }, fn?: Function)

Mount a method on `ctx` that can be called directly by other plugins.

Main call method:

```typescript
ctx.registerMethod('methodName')
ctx.registerMethod('methodName', () => {
  // callback
})
ctx.registerMethod({
  name: 'methodName'
})
ctx.registerMethod({
  name: 'methodName',
  fn: () => {
    // callback
  }
})
```

where the method name must be specified, and there are two cases for callback functions.

##### Specify the callback function

methodName` will execute the callback function specified in `registerMethod` when it is called.

##### No callback function specified

The specific hook callback to be executed is specified by `ctx.methodName`, which can specify multiple callbacks to be executed, and will be executed in the order of the registered which will be executed in order of registration.

The built-in build process APIs such as `ctx.onBuildStart` are registered in this way.

#### ctx.registerCommand(hook: ICommand)

Register a custom command:

```typescript
interface ICommand {
  // Command alias
  alias?: string,
    [key: string]: string
  },
  // Example usage information when executing taro <command> --help
  synopsisList?: string[]
}
```

Usage : 

```typescript
ctx.registerCommand({
  name: 'create',
  fn () {
    const {
      type,
      name,
      description
    } = ctx.runOpts
    const { chalk } = ctx.helper
    const { appPath } = ctx.paths
    if (typeof name !== 'string') {
      return console.log(chalk.red('Please enter the name of the page to be created'))
    }
    if (type === 'page') {
      const Page = require('../../create/page').default
      const page = new Page({
        pageName: name,
        projectDir: appPath,
        description
      })
      page.create()
    }
  }
})
```

#### ctx.registerPlatform(hook: IPlatform)

Register a compilation platform.

```typescript
interface IFileType {
  templ: string
  style: string
  script: string
  config: string
}
interface IPlatform extends IHook {
  // Compiled file type
  fileType: IFileType
  // Name of the configuration parameter used at compile time
  useConfigName: String
}
```

Usage : 

```typescript
ctx.registerPlatform({
  name: 'alipay',
  useConfigName: 'mini',
  async fn ({ config }) {
    const { appPath, nodeModulesPath, outputPath } = ctx.paths
    const { npm, emptyDirectory } = ctx.helper
    emptyDirectory(outputPath)
    // prepare miniRunner param
    const miniRunnerOpts = {
      ...config,
      nodeModulesPath,
      buildAdapter: config.platform,
      isBuildPlugin: false,
      globalObject: 'my',
      fileType: {
        templ: '.awml',
        style: '.acss',
        config: '.json',
        script: '.js'
      },
      isUseComponentBuildPage: false
    }
    ctx.modifyBuildTempFileContent(({ tempFiles }) => {
      const replaceKeyMap = {
        navigationBarTitleText: 'defaultTitle',
        navigationBarBackgroundColor: 'titleBarColor',
        enablePullDownRefresh: 'pullRefresh',
        list: 'items',
        text: 'name',
        iconPath: 'icon',
        selectedIconPath: 'activeIcon',
        color: 'textColor'
      }
      Object.keys(tempFiles).forEach(key => {
        const item = tempFiles[key]
        if (item.config) {
          recursiveReplaceObjectKeys(item.config, replaceKeyMap)
        }
      })
    })
    // build with webpack
    const miniRunner = await npm.getNpmPkg('@tarojs/mini-runner', appPath)
    await miniRunner(appPath, miniRunnerOpts)
  }
})
```

#### ctx.applyPlugins(args: string | { name: string, initialVal?: any, opts?: any })

Triggers the registered hooks.

The hook name passed in is the name specified by `ctx.register` and `ctx.registerMethod`.

It is worth noting here that if it is a **modify type** and **add type** hook, it has the return result, otherwise don't care about its return result.

Usage:

```typescript
ctx.applyPlugins('onStart')
const assets = await ctx.applyPlugins({
  name: 'modifyBuildAssets',
  initialVal: assets,
  opts: {
    assets
  }
})
```

#### ctx.addPluginOptsSchema(schema: Function)

Adds a checksum to the plugin input, accepting a function type parameter, the function input is a joi object, and the return value is a joi schema.

Usage :

```typescript
ctx.addPluginOptsSchema(joi => {
  return joi.object().keys({
    mocks: joi.object().pattern(
      joi.string(), joi.object()
    ),
    port: joi.number(),
    host: joi.string()
  })
})
```

#### ctx.writeFileToDist({ filePath: string, content: string })

Writes a file to the compile result directory, with the following parameters:

- filePath: the path where the file is placed in the compilation result directory
- content: the content of the file

#### ctx.generateFrameworkInfo({ platform: string })

Generate the compilation information file .frameworkinfo, with the following parameters

- platform: Platform name

#### ctx.generateProjectConfig({ srcConfigName: string, distConfigName: string })

Generate the final project configuration based on the current project configuration with the following parameters.


- srcConfigName: the name of the configuration in the source code
- distConfigName:  the name of the final generated configuration
