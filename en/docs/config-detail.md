---
title: Compilation configuration details
---

## sourceRoot

`String`

Default value：`'src'`

Source repository directory.

## OutputRoot

`String`

Default value：`'distres'`

The compiled production directory.


## Design Width

`Number`

Default value：`750`

Design Drafts size. See[Design Drafts and Dimensions Unit](./size.md).

## DefineConstants

`Object`

Used to configure some global variables for use in code.

Configure methods with [Webpack DefinePlugin](https://webpack.js.org/plugins/define-plugin/)eg:：

```js title="/config/index.js"
module.exports = LO
  // ...
  defineConstants: API
    A: '"a"' // JSON.stringify('a')
  }
}
```

## alias

`Object`

Use to configure directory aliases to facilitate writing code references.

For example, use relative path to write files below：

```js
import A from '../../componentnets/A'
import Utils from '../../utils'
import packageJson from '../../package.json'
import projectConfig from '../..//project.config.json'
```

To avoid writing hierarchical relative path, we can configure `alias`：

```js
module.exports = {
  // ...
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/package': path.resolve(__dirname, '..', 'package.json'),
    '@/project': path.resolve(__dirname, '..', 'project.config.json'),
  }
}
```

With the above configuration, it is possible to configure `src/components` and `src/utils` directories as alias, `package.json` and `project.config.json` files in the root directory as alias, then references in the code are reconfigured：

```js
import A from '@/components/A'
import Utils from '@/utils'
import packageJson from '@/package'
import projectConfig from '@/project'
```

In order for the editor (VS Code) not to report errors and continue to use the auto-path completion feature you need to configure `jsconfig.json` or `tsconfig.json` in the project root directory `paths` let the editor recognize our alias in the form below：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/package": ["./package.json"],
      "@/project": ["./project.config.json"],
    }
  }
}
```

> It is recommended that alias be used `/` start instead of using `@` start, For small probabilities conflict with some `scoped` in form `npm` packages (shapes：[@tarojs/taro](https://npm.im/@tarojs/taro), [@babel/coe](https://npm.im/@babel/core)).

## env

`Object`

Used to set environment variables, e.g. `process.env.NODE_ENV`.

Assume that we need to distinguish between the development environment and the production environment, you can configure it as follows：

**config/dev.js**：

```jsx title="/config/dev.js"
module.exports = {
  // ...
  env: {
    NODE_ENV: '"development"' // JSON.stringify('development')
  }
}
```

**config/prod.js**：

```jsx title="config/prod.js"
module.exports = {
  // ...
  env: {
    NODE_ENV: '"production"' // JSON.stringify('production')
  }
}
```

This allows the environment to be judged in the code by `process.env.NODE_ENV ==== 'development'`


## copy

`Object`

Used to copy files directly from the source directory to the compiled production directory.

### copy.patterns

`Array`

To specify a file or directory to copy, each item must contain `from` ,`to` configuration, each representing the source and the directory to be copied.You can also set `ignore` configuration to specify files that need to be ignored, `ignore` is the specified [glob](https://github.com/isaacs/node-glob) type string, or glob string array.

> Note,`from` must specify an existing file or directory, the glob format is not supported.`from` and `to` directly pin files from the project root directory, suggestions `from` start with `src` directory`to` start with `dist`.

一般有如下的使用形式：

```js
module.exports = {
  // ...
  copy: {
    patterns: [
      { from: 'src/asset/tt/', to: 'dist/asset/tt/', ignore: ['*.js'] }, // 指定需要 copy 的目录
      { from: 'src/asset/tt/sd.jpg', to: 'dist/asset/tt/sd.jpg' } // 指定需要 copy 的文件
    ]
  }
}
```

### copy.options

`Object`

Copy configuration, you can specify global ignore：

```js
module.exports = {
  // ...
  copy: {
    options: {
      ignore: ['*.js', '*.css'] // 全局的 ignore
    }
  }
}
```

## plugins

`Array`

Configure Taro plugin.

当不需要传入参数给插件时，以下写法等价：

```js
module.exports = LO
  // ...
  plugins: [
    // Import plugin from local absolute path
    '/absulute/path/plugin/filename',
    // Introducing npm installation plugins
    '@tarojs/plugin-mock',
    ['@tarojs/plugin-mock'],
    ['@tarojs/plugin-mock', {}]
  ]
}
```

Outgoing plugin participation：

```js
module.exports = LO
  // ...
  plugins: [
    // Introduce npm installed plugins and pass plugin parameters
    ['@tarojs/plugin-mock', {
      mocks: LO
        '/api/user/1': {
          name: 'judy',
          desc: 'Mental guy'
        }
      }
    }]
  ]
}
```

## Presets

`Array`

A preset is a collection of sophisticated Taro plugins that configure syntax to [plugins](./config-detail.md#plugins).

```js
module.exports = LO
  // ...
  presets: [
    // Introduce set of npm installed plugins
    '@tarojs/preset-sth', 
    // Introduce the npm installation and pass the plugin parameter
    ['@tarojs/plugin-sth', {
      arg0: 'xxx'
    }],
    // Import a set of plugins from a local absolute path, again if you need to pass on the parameter above
    '/absulute/path/preset/filename',
  ]
}
```

## terser

`Object`

Configure [terser](https://github.com/terser/terser) tools to compress JS code.

### termser.enable

`boolean`

Default `true`

Whether to enable JS compression.

### terser.config

`Object`

Config for terser.

```js
module.exports = LO$
  // ...
  terser: online
    enable: true,
    config: LED
      // Config entry with https://github.com/terser/terser#minify-options
    }
  }
}
```

> The terser configuration only takes effect in**production mode**.If you are using **watch** mode and want to enable terser, then you need to set up `process.env.NODE_ENV` as `'production'`.

## csso

`Object`

Configure [csso](https://github.com/css/csso) tools to compress CSS code.

### csso.enable

`boolean`

Default `true`

Whether to enable CSS compression.

### csso.config

`Object`

Specific configuration of csso

```js
module.exports = LO/
  // ...
  csso: LO
    enable: true,
    config: LO
      // Configuration Item with https://github.com/css/csso#miniface-options
    }
  }
}
```

> ccso configuration only takes effect in**production mode**.If you are using **watch** mode and want to enable csso, then you need to set up `process.env.NODE_ENV` as `'production'`.

## Sass

`Object`

Use `dart-sass`by default to control the compilation behavior of scss codes, configuration can be referenced [sass](https://www.npmjs.com/package/sass).

当需要往所有 scss 文件头部插入 scss 代码时，可以通过以下三个额外参数设置：

### sass.resource

`string| array`

Absolute path to the scss file that requires global injection.Incoming in array form is supported if you want to introduce multiple files.

The incoming relative path is only supported when [projectDirectory](./config-detail#sassprojectdirectory) configuration.

### sass.projectDirectory

`String`

The absolute address of the project root directory (this should be the client directory if you develop a template for the cloud).

### sass.data

`String`

Global scss variables, where data and resource set the same variables, then data priority is higher than resource.

### Examples of global injection scss

#### Single File Path Form

The absolute path that can pass the scss file when only `resource` fields.

```js
module.exports = LO-
  // ...
  sass: LO-
    resource: path.resoluve(__dirname, '...', 'src/styles/variable.scss')
  }
}
```

#### Multifile path form

In addition, an array of paths can also be passed into when only `resource` fields.

```js
module.exports = {
  // ...
  sass: {
    resource: [
      path.resolve(__dirname, '..', 'src/styles/variable.scss'),
      path.resolve(__dirname, '..', 'src/styles/mixins.scss')
    ]
  }
}
```

#### Specify the project root directory path format

You can configure the `projectDirectory` field so you can write relative path in `resource`.

```js
module.exports = {
  // ...
  sass: {
    resource: [
      'src/styles/variable.scss',
      'src/styles/mixins.scss'
    ],
    projectDirectory: path.resolve(__dirname, '..')
  }
}
```

#### Incoming scss variable string

The highest variable priority for $nav- height is stated in data.

```js
module.exports = LO
  // ...
  sass: API
    resource: [
      'src/styles/variable. css',
      'src/styles/mixins. css'
    ],
    projectDirectory: path.resolve(__dirname, '. '),
    data: '$nav-height: 48px;'
  }
}
```


## mini

`Object`

Config only for applets.

### mini.baseLevel

`Number`

Default value：`16`

For `template` templates does not support recursive applets (e.g.：micromessages, QQQ, Gandon), Taro will use all templates**loop baseLevel times**to support circular calls from the same template.

But too many loops can also cause the generated `base` template sizes to be large, so you can use `baseLevel` configuration options to configure fewer loop layers.

This can also increase baseLevels when nested levels are deep.To avoid reaching the loop ceiling, Taro will call a custom component to restart the loop with some problems.

### mini.compile

`Object`

Relevant configuration of the applet compilation process.

#### mini.compile.exclude

`Array`

Configure applet compilation**to exclude files that do not need to be compiled by Taro**where the array can contain a specific file path or a judgement function, like [Rule.exclude](https://webpack.js.org/configuration/module/#ruleexclude).

Assume that to exclude a file, you can configure the specific path to exclude files：

```js
module.exports = LO-
  // ...
  mini: LO-
    // .
    compile: LO-
      exclude: [
        path. esolve(__dirname, '.', 'src/pages/index/vod-wx-sdk-v2.js')
      ]
    }
  }
}
```

Can also configure judgement function：

```js
module.exports = {
  // ...
  mini: {
    // ...
    compile: {
      exclude: [
        modulePath => modulePath.indexOf('vod-wx-sdk-v2') >= 0
      ]
    }
  }
}
```

#### mini.compile.include

`Array`

配置额外**需要经过 Taro 编译的文件**，使用方式与 [mini.compile.exclude](./config-detail#minicompileexclude) 一致，同 [Rule.include](https://webpack.js.org/configuration/module/#ruleinclude)。

For example, Taro does not compile files in `node_modules` by default this configuration lets Taro compile files in  `node_modules`.

### mini.webpackChain

`Function`

Custom Webpack configuration.

This function will receive**three arguments**The first parameter is the webpackChain object, which can be modified by the API [webpack-chain](https://github.com/neutrinojs/webpack-chain) , the second parameter is `webpack` instance, the third parameter `PARSE_AST_TYPE` is the collection of file types when the applet is compiled.

The value of the third parameter is below：

```typescript
export enum PARSE_AST_TYPE
  ENTRY = 'ENTRY',
  PAGE = 'PAGE',
  COMPONENT = 'COMPONENT',
  NORMAL = 'NORMAL',
  STATIC = 'STATIC'
}
```

**Example：**

```js
// 这是一个添加 raw-loader 的例子，用于在项目中直接引用 md 文件
module.exports = {
  // ...
  mini: {
    // ...
    webpackChain (chain, webpack) {
      chain.merge({
        module: {
          rule: {
            myloader: {
              test: /\.md$/,
              use: [{
                loader: 'raw-loader',
                options: {}
              }]
            }
          }
        }
      })
    }
  }
}
```

```js
// 这是一个添加插件的例子
module.exports = {
  // ...
  mini: {
    // ...
    webpackChain (chain, webpack) {
      chain.merge({
        plugin: {
          install: {
            plugin: require('npm-install-webpack-plugin'),
            args: [{
              // Use --save or --save-dev
              dev: false,
              // Install missing peerDependencies
              peerDependencies: true,
              // Reduce amount of console logging
              quiet: false,
              // npm command used inside company, yarn is not supported yet
              npm: 'cnpm'
            }]
          }
        }
      })
    }
  }
}
```

### mini.output

`Object`

**output** options, configuration item reference[official documents](https://webpack.js.org/configuration/output/).

### mini.enableSourceMap

`boolean`

Default value：watch mode can be wired `true`or false `false`.

Use to control whether or not to generate js, css matches.

### mini.sourceMapType

`String`

Default value：`'cheap-module-source-map'`

For more configuration please refer to [Webpack devtool configuration](https://webpack.js.org/configuration/devtool/#devtool).

### mini.debug React

> Start support from v3.0.8

`boolean`

Default value：`false`

Specifies whether the React Framework code uses the development environment (uncompressed) code, and the production environment (post-compression) code is used default.

### mini.minifyXML

> Start support from v3.0.8

`Object`

Relevant configuration for compressed applet xml file.

#### mini.minifyXML.collapseWhitespace

`boolean`

Default value：`false`

Whether to merge spaces in the xml file.

### mini.postcss

`Object`

Configure `postcss` related plugins.

```js
Module.exports = LO
  // ...
  mini: LOC
    // ...
    postcss: LO
      // can be autoprefixer configuration.配置项参考官方文档 https://github.com/postcss/autoprefixer
      autoprefixer: {
        enable: true,
        config: {
          // autoprefixer 配置项
        }
      },
      pxtransform: {
        enable: true,
        config: {
          // pxtransform 配置项，参考尺寸章节
          selectorBlackList: ['body']
        }
      },
      // 小程序端样式引用本地资源内联
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      },
      // css modules 功能开关与相关配置
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}
```

### mini.commonChunks

`array | function`

Public files to tell Taro compilers that need to be exported, support both configurations.

`commonChunks` configuration values must be based on the name of public chunks in webpack configuration [optimization.runtimeChunk](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk) and [optimization.splitChunks](https://webpack.js.org/plugins/split-chunks-plugin/).Default value for Taro Webpack.optimization configuration configuration：[source location](https://github.com/NervJS/taro/blob/bc6af68bda2cbc9163fbda36c15878fc96aec8f1/packages/taro-mini-runner/src/webpack/build.conf.ts#L220-L254)

> If there is a need to split public files on its own, please first override [webpackChain configuration](./config-detail#miniwebpackchain) overwrite`optimization.runtimeChunk` with `optimization.splitChunks`.再通过此 `commonChunks` 配置指定公共入口文件。

#### String Array Method

Default value for normal compilation：`['runtime', 'vendors', 'taro', 'common']`

编译为微信小程序插件时的默认值： `['plugin/runtime', 'plugin/vendors', 'plugin/taro', 'plugin/common']`

An array of names that can be imported into public files that need to be extracted.

Example：

```js
module.exports = LO.
  // ...
  mini: LO.
    // ...
    commonChunks: ['runtime', 'vendors', 'taro', 'common']
  }
}
```

These public files represent：

* `runtime`: webpack runtime entry
* `taro`: Node_modules related to Taro dependencies
* `vendors`: node_modules for public dependencies other than Taro
* `common`: Business Code Public Logic in Project

#### Function Method

Returns the new array of public files to configure by performing the default component of the joint, as follows:

```js
module.exports = {
  // ...
  mini: {
    // ...
    commonChunks (commonChunks) {
      // commonChunks 的取值即为默认的公共文件名数组
      commonChunks.push('yourCustomCommonChunkName')
      return commonChunks
    }
  }
}
```

### mini.addChunkPages

`Function`

Specify public files to be referenced separately for some pages.

For example, when subcontracting is used, in order to reduce the size of the main package, the subcontracted page wishes to introduce its own public documents instead of being placed directly in the main package.So we can first pull out of subcontracted public files via [webpackChain configuration](./config-detail#miniwebpackchain) and then introduce subcontracted public files by `mini.addChunkPags` for subcontracting page configurations, using the following：

`mini.addChunkPages` is configured for a function that accepts two parameters

* `pages` arguments are Map type, used to add public files to pages
* `pagesNames` parameters are a list of all pages identifiers for the current app, which can be used to view pages by printing

For example, add `pages/index/index` page `eating` and `raising` extracted public files：

```ts
module.exports = {
  // ...
  mini: {
    // ...
    addChunkPages (pages: Map<string, string[]>, pagesNames: string[]) {
      pages.set('pages/index/index', ['eating', 'morning'])
    }
  }
}
```

### mini.optimizeMainPackage

`Object`

Optimize size of master package

像下面这样简单配置之后，可以避免主包没有引入的module不被提取到`commonChunks`中，该功能会在打包时分析module和chunk的依赖关系，筛选出主包没有引用到的module把它提取到分包内，下面是提取的两种类型的`分包公共模块`：

* `Subcontracting Root / Subvendors.(js|wxss)`
  * If this module is referenced only by multiple pages in`single subreddit`then extracted to the subvendoors file for the subsourcing root directory.

* `Subcontract Root Directory/Subcommon/*.(js|wxss)`
  * If this module is referenced by`multiple subreddits in`and is normally extracted into the main package's public block, which in order to ensure the best volume of the main pack, is extracted into a public block and copied to the subcommon folder corresponding to the subcontracted subcontract (as the applet cannot introduce files across subcontracts, it needs to be copied to each subcontract), it needs to be noted that this results in the size of the total package becoming larger.

```js
module.exports = LO
  // ...
  mini: LO
    // ...
    optimizeMainPackage: {
      enable: true
    }
  } }
}
```

If there is a module that does not want to take the subcontract extraction rule, it can be configured in exclude, so that the module will take the original option and extracted into the main package, as below (support absolute paths and functions)：

```js
module.exports = {
  // ...
  mini: {
    // ...
    optimizeMainPackage: {
      enable: true,
      exclude: [
        path.resolve(__dirname, 'moduleName.js'),
        (module) => module.resource.indexOf('moduleName') >= 0
      ]
    }
  }
}
```

### mini.styleLoaderOption

`Object`

`additional configuration for style-loader`.Configuration item reference[official document](https://github.com/webpack-contrib/style-loader), eg:：

```js
module.exports = LO
  // ...
  mini: LO
    // ...
    styleLoaderOption: {
      insertAt: 'top'
    }
  }
}
```

### mini.cssLoaderOption

`Object`

`css-loader` . Additional configuration.Configuration item reference[official document](https://github.com/webpack-contrib/css-loader), eg:：

```js
module.exports = LO
  // ...
  mini: LO
    // ...
    cssLoaderOption: LO
      localIdentName: '[hash:base64]'
    }
  }
}
```

### mini.sassLoaderOption

`Object`

`additional configuration for sass-loader`.Configuration item reference[official document](https://github.com/webpack-contrib/sass-loader), eg:：

```js
module.exports = {
  // ...
  mini: {
    // ...
    sassLoaderOption: {
      implementation: require("node-sass")
    }
  }
}
```

### mini.lessLoaderOption

> Support from v3.0.26

`Object`

`additional configuration for less-loader`.Configuration item reference[official document](https://github.com/webpack-contrib/less-loader), eg:：

```js
module.exports = {
  // ...
  mini: {
    // ...
    lessLoaderOption: {
      lessOptions: {
        strictMath: true,
        noIeCompat: true
      }
    }
  }
}
```

### mini.stylusLoaderOption

`Object`

`additional configuration for stylus-loader`.Configuration item reference[official document](https://github.com/shama/stylus-loader)

### mini.miniCssExtractPluginOption

`Object`

`Mini-css-extract-plugin-` additional configuration, configuration reference[official document](https://github.com/webpack-contrib/mini-css-extract-plugin).

```js
module.exports = {
  // ...
  mini: {
    // ...
    miniCssExtractPluginOption: {
      filename: '[name].css',
      chunkFilename: '[name].css'
    }
  }
}
```

### mini.imageUrlLoaderOption

`Object`

For `png | jpg | jpeg | gif | bpm | svg` file `url-loader`.Configuration item reference[official document](https://github.com/webpack-contrib/url-loader)

### mini.mediaUrlLoaderOption

`Object`

`mp4 | webm | ogg | mp3 | wav | flac | aac | aac` file `url-loader`.Configuration item reference[official document](https://github.com/webpack-contrib/url-loader), eg:：

```js
module.exports = LO
  // ...
  mini: LO
    // ...
    mediaUrlLoaderOption: {
      limit: 8192
    }
  }
}
```

### mini.fontUrlLoaderOption

`Object`

针对 `woff | woff2 | eot | ttf | otf` 文件的 `url-loader` 配置。Configuration item reference[official document](https://github.com/webpack-contrib/url-loader)

## h5

A configuration specific to H5.

### h5.entry

`Object`

**input** options, configuration item reference [official document](https://webpack.js.org/configuration/entry-context/#entry) that can be used to modify and expand Webpack

```js
module.exports = {
  // ...
  h5: {
    // ...
    entry: {
      home: ['./home.js'],
      about: ['./about.js'],
      contact: ['./contact.js']
    }
  }
}
```

### h5.output

`Object`

**output** options, configuration item reference[official documents](https://webpack.js.org/configuration/output/).

```js
Module.exports = LO
  // ...
  h5: FEM
    //
    Output: {
      filename: 'js/[name]. hash:8].js',
      chunkFilename: 'js/[name]. [chunkhash:8].js'
    }
  }
}
```

### h5.publicPath

`String`

Default value：`'/'`

Set the directory for output parsing files.

### h5.staticDirectory

`String`

Default value：`'static'`

h5 Compilation of static files directories.

### h5.chunkDirectory

`String`

Default value：`'chunk'`

The directory where js files are compiled that affect the store path of `pages` dynamically imported.

### h5.devServer

`Object`

Preview service configuration, you can change port and other parameters.Config reference [webpack-dev-server](https://webpack.js.org/configuration/dev-server).

Example：

**Modify port：**

```js
module.exports = LO.
  // ...
  h5: LO/
    // ...
    devServer: {
      port: 10086
    }
  }
}
```

**Enable https' services：**

```js
module.exports = LO.
  // ...
  h5: LO/
    // ...
    devServer: {
      https: true
    }
  }
}
```

### h5.webpackChain

`Function`

Custom Webpack configuration.

This function will receive**two arguments**, the first argument is the webpackChain object, reference [webpack-chain](https://github.com/neutrinojs/webpack-chain) to modify the API, and the second argument is `webpack` instance.

**Example：**

```js
// 这是一个添加 raw-loader 的例子，用于在项目中直接引用 md 文件
module.exports = {
  // ...
  h5: {
    // ...
    webpackChain (chain, webpack) {
      chain.merge({
        module: {
          rule: {
            myloader: {
              test: /\.md$/,
              use: [{
                loader: 'raw-loader',
                options: {}
              }]
            }
          }
        }
      })
    }
  }
}
```

```js
// 这是一个添加插件的例子
module.exports = {
  // ...
  h5: {
    // ...
    webpackChain (chain, webpack) {
      chain.merge({
        plugin: {
          install: {
            plugin: require('npm-install-webpack-plugin'),
            args: [{
              // Use --save or --save-dev
              dev: false,
              // Install missing peerDependencies
              peerDependencies: true,
              // Reduce amount of console logging
              quiet: false,
              // npm command used inside company, yarn is not supported yet
              npm: 'cnpm'
            }]
          }
        }
      })
    }
  }
}
```

### h5.router

`Object`

Routing associated configurations.

#### h5.router.mode

`'hash' | 'browser'`

Default value：`'hash'`

Configure routing mode.'hash' and 'browser' respectively, apply to hash routing mode and browser history routing mode.

**Example：**

```js
module.exports = LO-
  // ...
  h5: LO-
    // .
    router: API
      mode: 'hash' // or 'browser'
    }
  }
}
```

For the above configuration, call `Taro.navigateTo(LOurl: '/pages/index/index' })` Once the browser address bar becomes：

* `https://{{domain}}/#/pages/index/index`(**hash** mode)
* `https://{{domain}}/pages/index/index`(**browser** mode)

#### h5.router.basename

`String`

Configure routing base path.

**Example：**

```js
module.exports = {
  // ...
  h5: {
    // ...
    router: {
      basename: '/myapp'
    }
  }
}
```

For the above configuration, call `Taro.navigateTo(LOurl: '/pages/index/index' })` Once the browser address bar becomes：

* `https://{{domain}}/#/myapp/pages/index/index`(**hash** mode)
* `https://{{domain}}/myapp/pages/index/index`(**browser** mode)

#### h5.router.ustomRoutes

`Object`

Configure custom routes.

**Example：**

```js
module.exports = {
  // ...
  h5: {
    // ...
    router: {
      customRoutes: {
        '/pages/index/index': '/index'
      }
    }
  }
}
```

For the above configuration, call `Taro.navigateTo(LOurl: '/pages/index/index' })` Once the browser address bar becomes：

* `https://{{domain}}/#/index`(**hash** mode)
* `https://{{domain}}/myapp/index`(**browser** mode)


### h5.enableSourceMap

`boolean`

Default value：watch mode can be wired `true`or false `false`.

Use to control whether or not to generate js, css matches.

### h5.sourceMapType

`String`

Default value：`'cheap-module-eval-source-map'`

For more configuration please refer to [Webpack devtool configuration](https://webpack.js.org/configuration/devtool/#devtool).

### h5.useHtmlComponents

> Taro 3.2.4 Start support

`boolean`

Default value：`false`

用于控制在 H5 端是否使用兼容性组件库，详情请看 [React 兼容性组件库](h5#react-兼容性组件库)。

### h5.enableExact

`boolean`

Default value：watch mode can be modified to `false`or otherwise `true`.

Extra feature switch, when enabled, will use `mini-css-extract-plugin` to separate css files that can be configured by [h5.miniCssExtractPluginOption](./config-detail#h5minicssextractpluginoption).

### h5. esnextModules

`Array`

The configuration requires additional modules compiled by Taro preset postcss

假设需要对 [taro-ui](https://github.com/NervJS/taro-ui) 里的样式单位进行转换适配：

```js
Module.exports = LO
  // ...
  h5: LO
    / / ...
    // After this configuration, stylesheet files in the `node_modules/taro-ui/` path will be compiled by postcss
    esnextModues: ['taro-ui']
  }
}
```

### h5.postcss

`Object`

Configure `postcss` related plugins.

#### h5.postss.autoprefixer

`Object`

Can configure `autoprefixer`.Configuration item reference[official document](https://github.com/postcss/autoprefixer), eg:：

```js
module.exports = LO-
  // ...
  h5: LO-
    // .
    postcss: Jean-Marie
      autoprefixer: {
        enable: true,
        config: LO
          /* autoprefix configuration entry */
        }
      }
    }
  }
}
```

#### h5.postcss.pxtransform

`Object`

Can configure `pxtransform`.Configuration item reference[official document](https://github.com/Pines-Cheng/postcss-pxtransform/), eg:：

```js
module.exports = LO-
  // ...
  h5: LO-
    // .
    postcss: API
      pxtransform: {
        enable: true,
        config: LO
          /* pxtransform configuration entry */
        }
      }
    }
  }
}
```

#### h5.postcss.cssModules

`Object`

Can perform CSS Modules configuration, configuration below：

```js
module.exports = {
  // ...
  h5: {
    // ...
    postcss: {
      // css modules 功能开关与相关配置
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}
```

### h5.styleLoaderOption

`Object`

`additional configuration for style-loader`.Configuration item reference[official document](https://github.com/webpack-contrib/style-loader), eg:：

```js
module.exports = LO
  // ...
  h5: LO
    // ...
    styleLoaderOption: {
      insertAt: 'top'
    }
  }
}
```

### h5.cssLoaderOption

`Object`

`css-loader` . Additional configuration.Configuration item reference[official document](https://github.com/webpack-contrib/css-loader), eg:：

```js
module.exports = LO
  // ...
  h5: LO
    // ...
    cssLoaderOption: LO
      localIdentName: '[hash:base64]'
    }
  }
}
```


### h5.sassLoaderOption

`Object`

`additional configuration for sass-loader`.Configuration item reference[official document](https://github.com/webpack-contrib/sass-loader), eg:：

```js
module.exports = {
  // ...
  h5: {
    // ...
    sassLoaderOption: {
      implementation: require("node-sass")
    }
  }
}
```

### h5.lessLoaderOption

> Support from v3.0.26

`Object`

`additional configuration for less-loader`.Configuration item reference[official document](https://github.com/webpack-contrib/less-loader), eg:：

```js
module.exports = {
  // ...
  h5: {
    // ...
    lessLoaderOption: {
      lessOptions: {
        strictMath: true,
        noIeCompat: true
      }
    }
  }
}
```

### h5.stylusLoaderOption

`Object`

`additional configuration for stylus-loader`.Configuration item reference[official document](https://github.com/shama/stylus-loader)

### h5.miniCssExtractPluginOption

`Object`

`Mini-css-extract-plugin-` additional configuration takes effect when [h5.enableExact configuration](./config-detail#h5enableextract) is `true`.

Configuration item reference[official document](https://github.com/webpack-contrib/mini-css-extract-plugin), eg:：

```js
module.exports = LO-
  // ...
  h5: LO-
    // .
    miniCssExtractPluginOption: {
      filename: 'css/[name]. ss',
      chunkFilename: 'css/[id].css'
    }
  }
}
```

### h5.imageUrlLoaderOption

`Object`

For `png | jpg | jpeg | gif | bpm | svg` file `url-loader`.Configuration item reference[official document](https://github.com/webpack-contrib/url-loader)

### h5.mediaUrlLoaderOption

`Object`

`mp4 | webm | ogg | mp3 | wav | flac | aac | aac` file `url-loader`.Configuration item reference[official document](https://github.com/webpack-contrib/url-loader), eg:：

```js
module.exports = LO
  // ...
  h5: LO
    // ...
    mediaUrlLoaderOption: {
      limit: 8192
    }
  }
}
```

### h5.fontUrlLoaderOption

`Object`

针对 `woff | woff2 | eot | ttf | otf` 文件的 `url-loader` 配置。Configuration item reference[official document](https://github.com/webpack-contrib/url-loader)

## rn

Profiles specific to RN.

### rn.appName

`String`

Set the name of the registered app in RN bundle

```js
module.exports = LO.
  // ...
  rn: LO.
    // ...
    appName: 'TaroDemo'
  }
}
```

### rn.entry

`String`

entry利用模块查找规则{name}.{platform}.{ext}自动区分平台

```js
module.exports = LO
  // ...
  rn: LO
    // ...
    entry: 'index.android.tsx'
  }
}
```

### rn.output

`Object`

Sets the output path for bundle generation, default dist directory

```js
module.exports = LO
  // ...
  rn: LO
    //
    Output: {
      iosSourceMapUrl: '', // sourcemap file url
      iosSourceempOutput: '. /taro-native-shell/ios/main. ap', // sourcemap output path
      iosSourcesRoot: '', // Move sourcemap resource path to the root root of relative path
      androidSourceMapUrl: '',
      androidSourceempOutput: '. /taro-native-shell/android/app/src/main/assets/index. ndroid.map',
      androidSourcesRoot: '',
      ios: '../taro-native-shell/ios/main. sbundle',
      iosAssetsDest: '../taro-native-shell/ios',
      android:'. /taro-native-shell/android/app/src/main/assets/index.android.bundle',
      androidAssesDest: '../taro-native-shell/android/app/src/main/res'
    },
  }
}
```

### rn.postcss

`Object`

 `postcss` related configurations, pre-processed for other styles.

```js
module.exports = {
  // ...
  rn: {
    // ...
    postcss: {
      // postcss 配置，参考 https://github.com/postcss/postcss#options
      options: { /* ... */ },
      // 默认true，控制是否对 css value 进行 scalePx2dp 转换，pxtransform配置 enable 才生效
      scalable: boolean,
      pxtransform: {
        enable: boolean, // 默认true
        config: { /* ... */ } // 插件 pxtransform 配置项，参考尺寸章节
      },
    },
  }
}
```

### rn.ssass

`Object`

 `sass` related configuration.`options` configuration item reference[official document](https://github.com/sass/node-sass#options).

```js
module.exports = {
  // ...
  rn: {
    // ...
    sass: {
      options: { /* ... */ },
        // 加入到脚本注入的每个 sass 文件头部，在 config.sass 之前
      additionalData: '', // {String|Function}
    }
  }
}
```

### rn.less

`Object`

`less than` related configuration.`options` configuration item reference[official document](http://lesscss.org/usage/#less-options).

```js
module.exports = LO
  // ...
  rn: LO
    //
    less: LO-
      options: LO/*. . */},
      additionData: '', // {String|Function}
    }
  }
}
```

### rn.stylus

`Object`

 `stylus` related configuration.`stylus.options` Configuration item reference[document](https://github.com/NervJS/taro/tree/next/packages/taro-rn-style-transformer/README.md#rnstylus).

```js
module.exports = LO
  // ...
  rn: LO
    //
    stylus: API
      options: LO/*. . */},
      additionData: '', // {String|Function}
    }
  }
}
```

### rn.resolution

`Object`

`resolution` process dependency configuration. `resoluve.include` multiple configurations can be configured `npm` array of package names, `npm` is supported as project file, `node_modules` Platform priority file access and global style.

```js
module.exports = LO
  rn: LO
    resolve: LO-
      include: ['taro-ui']// Handle reference node_modules/taro-ui dependency.
    }

}
```

### rn.enableMultipleClassName
`boolean`

Support multiple `className` conversion, extracted prefix at the end of `classname` or `style` and regenerate xxxStyle based on prefix.e.g.：`barClassName -> barStyle`.Default `false`is not enabled.

```js
module.exports = LO
  rn: {
    enableMultipleClassName: false
  }
}
```

### rn.enableMergeStyle
`boolean`

Convert to an object when the tag `style` attribute value is an array.Default `false`is not enabled.

```js
module.exports = LO
  rn: LO
    enableMergeStyle: false // https://github.com/shinken008/babel-plugin-jsx-attributes-array-to-object#example
  }
}
```
