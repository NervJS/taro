---
title: Compile configuration Details
---

## sourceRoot

`string`

Default: `'src'`

Source code directory.

## outputRoot

`string`

Default: `'dist'`

The production directory after the code is compiled.


## designWidth

`number`

Defalut value: `750`

Design size, please see for details[Design and size unit](./size.md)。

## defineConstants

`object`

Used to configure some global variables for use in the code.

The configuration method can be referred to [Webpack DefinePlugin](https://webpack.js.org/plugins/define-plugin/)，for eaxmple:

```js title="/config/index.js"
module.exports = {
  // ...
  defineConstants: {
    A: '"a"' // JSON.stringify('a')
  }
}
```

## alias

`object`

Used to configure directory aliases, thus facilitating the writing of code reference paths.

Use relative paths to write file references as follows.

```js
import A from '../../componnets/A'
import Utils from '../../utils'
import packageJson from '../../package.json'
import projectConfig from '../../project.config.json'
```

To avoid writing multi-level relative paths, we can configure `alias` as follows.

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

With the above configuration, the `src/components` and `src/utils` directories can be configured as aliases, and the `package.json` and `project.config.json` files in the root directory can be configured as aliases, so that the references in the code are rewritten as follows.


```js
import A from '@/components/A'
import Utils from '@/utils'
import packageJson from '@/package'
import projectConfig from '@/project'
```

In order for the editor (VS Code) to not report errors and continue to use the automatic path completion feature, you need to configure `paths` in `jsconfig.json` or `tsconfig.json` in the root of the project for the editor to recognize our alias in the following form.


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


> It is recommended that aliases start with `@/` rather than just `@`,as there is a small chance of naming conflicts with some `npm` packages of the `scoped` form.（eg：[@tarojs/taro](https://npm.im/@tarojs/taro), [@babel/core](https://npm.im/@babel/core)）

## env

`object`

Used to set environment variables such as `process.env.NODE_ENV`.

Suppose we need to distinguish between development and production environments, which can be configured as follows.

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

This allows the environment to be determined in the code by `process.env.NODE_ENV === 'development'`.

## copy

`object`

Used to copy files directly from the source code directory to the compiled production directory.

### copy.patterns

`array`

This is used to specify the files or directories to be copied, each of which must contain the `from` and `to` configurations, representing the source and the directory to be copied to, respectively. You can also set the `ignore` configuration to specify the files to be ignored. `ignore` is a string of type [glob](https://github.com/isaacs/node-glob), or an array of glob strings.

> Note that `from` must specify a file or directory that exists, glob format is not supported. `from` and `to` directly top the file directories in the project root, it is recommended that `from` starts with the `src` directory and `to` starts with the `dist` directory.

They are generally used in the following forms.

```js
module.exports = {
  // ...
  copy: {
    patterns: [
      { from: 'src/asset/tt/', to: 'dist/asset/tt/', ignore: ['*.js'] }, // Specify the directory to be copied
      { from: 'src/asset/tt/sd.jpg', to: 'dist/asset/tt/sd.jpg' } // Specify the files to be copied
    ]
  }
}
```

### copy.options

`object`

Copy the configuration, you can specify the global ignore.

```js
module.exports = {
  // ...
  copy: {
    options: {
      ignore: ['*.js', '*.css'] // global ignore
    }
  }
}
```

## plugins

`array`

Configure the Taro plugin.

When no parameters need to be passed to the plugin, the following writeup is equivalent.

```js
module.exports = {
  // ...
  plugins: [
    // 从本地绝对路径引入插件
    '/absulute/path/plugin/filename',
    // 引入 npm 安装的插件
    '@tarojs/plugin-mock',
    ['@tarojs/plugin-mock'],
    ['@tarojs/plugin-mock', {}]
  ]
}
```

给插件传参：

```js
module.exports = {
  // ...
  plugins: [
    ['@tarojs/plugin-mock', {
      mocks: {
        '/api/user/1': {
          name: 'judy',
          desc: 'Mental guy'
        }
      }
    }]
  ]
}
```

## presets

`array`

A preset is a collection of Taro plugins with the same configuration syntax as [plugins](./config-detail.md#plugins)。

```js
module.exports = {
  // ...
  presets: [
    // The set of plugins installed by npm
    '@tarojs/preset-sth', 
    // The set of plugins installed by npm, and pass in the plugin parameters
    ['@tarojs/plugin-sth', {
      arg0: 'xxx'
    }],
    // The plugin set is brought in from the local absolute path, and also if parameters need to be passed in as above
    '/absulute/path/preset/filename',
  ]
}
```

## terser

`object`

Configure the [terser](https://github.com/terser/terser) tool to compress JS code.

### terser.enable

`boolean`

Default value `true`

Indicates if JS code compression is enabled.

### terser.config

`object`

The specific configuration of the terser.

```js
module.exports = {
  // ...
  terser: {
    enable: true,
    config: {
      // The configuration items are the same as https://github.com/terser/terser#minify-options
    }
  }
}
```

> The terser configuration only works in **production mode**. If you are using **watch** mode and want to enable terser, then you need to set `process.env.NODE_ENV` to `'production'`.

## csso

`object`

Configure the [csso](https://github.com/css/csso) tool to compress CSS code.

### csso.enable

`boolean`

Default value `true`.

Indicates if CSS code compression is enabled.

### csso.config

`object`

The specific configuration of csso.

```js
module.exports = {
  // ...
  csso: {
    enable: true,
    config: {
      // The configuration items are the same as https://github.com/css/csso#minifysource-options
    }
  }
}
```

> The csso configuration only works in **production mode**. If you are using **watch** mode and want to enable csso, then you need to set `process.env.NODE_ENV` to `'production'`.

## sass

`object`

Used to control the compilation behavior of scss code, by default `dart-sass` is used, the specific configuration can be found in [sass](https://www.npmjs.com/package/sass).

When it is necessary to insert scss code into the headers of all scss files, this can be set with three additional parameters.

### sass.resource

`string | array`

The absolute path to the scss file that needs to be globally injected. If multiple files are to be introduced, passing in an array is supported.

Passing in relative paths is supported when there is a [projectDirectory](./config-detail#sassprojectdirectory) configuration exists, relative paths are only supported.

### sass.projectDirectory

`string`

The absolute address of the project root directory (if it is an mini-program cloud development template, it should be the client directory).

### sass.data

`string`

Global scss variables, if the same variables are set in data and resource, then data takes precedence over resource.

### Example of global injection of scss

#### Single file path form

When only the `resource` field is available, the absolute path to the scss file can be passed.

```js
module.exports = {
  // ...
  sass: {
    resource: path.resolve(__dirname, '..', 'src/styles/variable.scss')
  }
}
```

#### Multiple file path form

In addition, when only the `resource` field is available, an array of paths can be passed in.

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

#### Specify the project root path form

You can additionally configure the `projectDirectory` field so that you can write relative paths in `resource`.

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

####  Pass in the scss variable string

The $nav-height variable declared in data has the highest priority.

```js
module.exports = {
  // ...
  sass: {
    resource: [
      'src/styles/variable.scss',
      'src/styles/mixins.scss'
    ],
    projectDirectory: path.resolve(__dirname, '..'),
    data: '$nav-height: 48px;'
  }
}
```


## mini

`object`

Dedicated mini program configuration.

### mini.baseLevel

`number`


Default value: `16`

For mini-program where `template` templates do not support recursion (e.g. WeChat, QQ, Jingdong), Taro will **loop baseLevel times** for all templates to support recursive calls to similar templates.

However, looping too many times can result in a rather large `base` template, so you can use the `baseLevel` configuration item to configure fewer loop levels when your nesting level is not too deep.

Of course, when the nesting level is deep, you can also increase the baseLevel to avoid some problems when you reach the loop limit and Taro calls a custom component to restart the loop.

### mini.compile

`object`

The configuration related to the compilation process of the mini program

#### mini.compile.exclude

`array`

Configure the mini program compilation process to **exclude files that do not need to be compiled by Taro**, the array can contain specific file paths or can be a judgment function, same as [Rule.exclude](https://webpack.js.org/configuration/module/#ruleexclude).

Assuming that a file is to be excluded, the specific path of the file to be excluded can be configured as follows.

```js
module.exports = {
  // ...
  mini: {
    // ...
    compile: {
      exclude: [
        path.resolve(__dirname, '..', 'src/pages/index/vod-wx-sdk-v2.js')
      ]
    }
  }
}
```

It is also possible to configure the judgment function.

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

`array`

Configure additional ** files that need to be compiled by Taro** in the same way as [mini.compile.exclude](. /config-detail#minicompileexclude) in the same way as [Rule.include](https://webpack.js.org/configuration/module/#ruleinclude).

For example, Taro does not compile files in `node_modules` by default, you can use this configuration to make Taro compile files in `node_modules`.

### mini.webpackChain

`function`

Customize the Webpack configuration.

This function receives **three arguments**. The first argument is the webpackChain object, which can be modified by referring to the [webpack-chain](https://github.com/neutrinojs/webpack-chain) API, the second argument is the `webpack` instance, and the third argument `PARSE_AST_ TYPE` is the set of file types that the mini program is compiled with.

The third parameter takes the following values:

```typescript
export enum PARSE_AST_TYPE {
  ENTRY = 'ENTRY',
  PAGE = 'PAGE',
  COMPONENT = 'COMPONENT',
  NORMAL = 'NORMAL',
  STATIC = 'STATIC'
}
```

**Example:**

```js
// This is an example of adding a raw-loader to directly reference an md file in a project
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
// This is an example of adding a plugin
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

`object`

The **output** option that can be used to modify and extend Webpack, the configuration items refer to [documentation](https://webpack.js.org/configuration/output/)。

### mini.enableSourceMap

`boolean`

Default value: `true` in watch mode, otherwise `false`.

Used to control whether to generate sourceMap corresponding to js, css.

### mini.sourceMapType

`string`

Default value: `'cheap-module-source-map'`

Detail configuration refer to [Webpack devtool configuration](https://webpack.js.org/configuration/devtool/#devtool)。

### mini.debugReact

> Supported since v3.0.8

`boolean`

Default value: `false`.

Specifies whether the code related to the React framework uses the development environment (uncompressed) code, the default is to use the production environment (compressed) code.

### mini.minifyXML

> Supported since v3.0.8

`object`

About the configuration related to compressing mini program xml files.

#### mini.minifyXML.collapseWhitespace

`boolean`

Default value: `false`.

If or not to merge spaces in the xml file.

### mini.postcss

`object`

Configure `postcss` related plugins.

```js
module.exports = {
  // ...
  mini: {
    // ...
    postcss: {
      // The autoprefixer configuration can be performed. configuration items  refer to documentation https://github.com/postcss/autoprefixer
      autoprefixer: {
        enable: true,
        config: {
          // autoprefixer configuration items 
        }
      },
      pxtransform: {
        enable: true,
        config: {
          // pxtransform configuration items 
          selectorBlackList: ['body']
        }
      },
      // mini program styles referencing local resources inline
      url: {
        enable: true,
        config: {
          limit: 10240 // Set upper limit of conversion size
        }
      },
      // css modules function switches and related configuration
      cssModules: {
        enable: false, // Default is false, if you want to use the css modules function, set it to true
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

Used to tell the Taro compiler which public files it needs to extract, supports two types of configuration.

The configuration value of `commonChunks` based on the name of the common chunks in the webpack configuration [optimization.runtimeChunk](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk) and [optimization.splitChunks](https://webpack.js.org/plugins/split-chunks-plugin/) . Default value of webpack.optimization configuration in Taro [Source Code](https://github.com/NervJS/taro/blob/bc6af68bda2cbc9163fbda36c15878fc96aec8f1/packages/taro-mini-runner/src/webpack/build.conf.ts#L220-L254)。

> If you need to split public files by yourself, please override the `optimization.runtimeChunk` and `optimization.splitChunks` via [webpackChain configuration](./config-detail#miniwebpackchain) to override the `optimization.runtimeChunk` and `optimization.splitChunks` configurations. Then specify the public entry file with this `commonChunks` configuration.

#### String Array Approach

Default values for common compilation: `['runtime', 'vendors', 'taro', 'common']`

Default values when compiling as a WeChat mini program plugin: `['plugin/runtime', 'plugin/vendors', 'plugin/taro', 'plugin/common']`

You can pass in an array of names of public files that need to be extracted.

Example:

```js
module.exports = {
  // ...
  mini: {
    // ...
    commonChunks: ['runtime', 'vendors', 'taro', 'common']
  }
}
```

These public files represent.

* `runtime`: webpack runtime entry
* `taro`: Taro-related dependencies in node_modules
* `vendors`: public dependencies of node_modules other than Taro
* `common`: common logic for business code in the project

#### Function method

The configuration is performed by manipulating the default public file array of the input parameters and returning a new array as follows:

```js
module.exports = {
  // ...
  mini: {
    // ...
    commonChunks (commonChunks) {
      // The value of commonChunks is the default array of public filenames
      commonChunks.push('yourCustomCommonChunkName')
      return commonChunks
    }
  }
}
```

### mini.addChunkPages

`function`

Specify the public files that need to be referenced separately for certain pages.

For example, when using mini program sub-packaging, in order to reduce the size of the main package, the sub-packaged pages want to introduce their own public files and don't want to put them directly inside the main package. Then we can first use the [webpackChain configuration](./config-detail#miniwebpackchain) to abstract the public files of the sub-package separately, and then configure the introduction of the public files of the sub-package via `mini.addChunkPages` for the sub-package page, which is used in the following way.

`mini.addChunkPages` is configured as a function that accepts two parameters

* `pages` parameter is of type Map, which is used to add public files to the page
* the `pagesNames` parameter is a list of all page identifiers for the current application, which can be printed to see the page identifiers

For example, to add `eating` and `morning` to the `pages/index/index` page, the following two public files are extracted.

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

`object`

Optimize the size of the main package

After a simple configuration like the following, you can avoid that modules not introduced in the main package are not extracted into `commonChunks`, this function will analyze the dependencies of modules and chunks during packaging, filter out the modules not referenced in the main package to extract it into the sub-package, the following are the two types of `sub-package public modules` extracted.

* `sub-package root/sub-vendors.(js|wxss)`
  * If the module is only referenced by multiple pages within a `single subpackage`, it is extracted to the sub-vendors file in the root of that subpackage.

* ` sub-package root/sub-common/*. (js|wxss)`
  * If the module is referenced by pages in `multiple sub-packages`, it will normally be extracted to the public module of the main package, but here, to ensure the optimal size of the main package, it will first be extracted to a public module, and then copied to the sub-common folder of the corresponding sub-package (because the mini program cannot introduce files across sub-packages, so here you need to make a copy of each sub-package) It is important to note that this will result in a larger size of the total package.

```js
module.exports = {
  // ...
  mini: {
    // ...
    optimizeMainPackage: {
      enable: true
    }
  }
}
```

If there is a module that does not want to go through the sub-package extraction rules, you can configure it in exclude so that the module will go through the original extraction scheme and be extracted into the main package, like the following (absolute paths and functions are supported).

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

`object`

Additional configuration of `style-loader`, configuration items refer to [documentation](https://github.com/webpack-contrib/style-loader)，eg:

```js
module.exports = {
  // ...
  mini: {
    // ...
    styleLoaderOption: {
      insertAt: 'top'
    }
  }
}
```

### mini.cssLoaderOption

`object`

Additional configuration of `css-loader`, configuration items refer to [documentation](https://github.com/webpack-contrib/css-loader)，eg:

```js
module.exports = {
  // ...
  mini: {
    // ...
    cssLoaderOption: {
      localIdentName: '[hash:base64]'
    }
  }
}
```

### mini.sassLoaderOption

`object`

Additional configuration of `sass-loader`, configuration items refer to [documentation](https://github.com/webpack-contrib/sass-loader), eg:

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

> Supported since v3.0.26

`object`

Additional configuration of `less-loader`, configuration items refer to [documentation](https://github.com/webpack-contrib/less-loader)，eg:

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

`object`

Additional configuration of `stylus-loader`, configuration items refer to [documentation](https://github.com/shama/stylus-loader)。

### mini.miniCssExtractPluginOption

`object`

Additional configuration of `mini-css-extract-plugin`, configuration items refer to [documentation](https://github.com/webpack-contrib/mini-css-extract-plugin)。

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

`object`

The `url-loader` configuration for `png | jpg | jpeg | gif | bpm | svg` files. The configuration items refer to [documentation](https://github.com/webpack-contrib/url-loader)。

### mini.mediaUrlLoaderOption

`object`

The `url-loader` configuration for `mp4 | webm | ogg | mp3 | wav | flac | aac` files. The configuration items refer to [documentation](https://github.com/webpack-contrib/url-loader)，eg:

```js
module.exports = {
  // ...
  mini: {
    // ...
    mediaUrlLoaderOption: {
      limit: 8192
    }
  }
}
```

### mini.fontUrlLoaderOption

`object`

The `url-loader` configuration for `woff | woff2 | eot | ttf | otf` files. The configuration items refer to [documentation](https://github.com/webpack-contrib/url-loader)。

## h5

H5-specific configuration.

### h5.entry

`object`

The **input** option can be used to modify and extend Webpack [documentation](https://webpack.js.org/configuration/entry-context/#entry)。

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

`object`

The **output** option that can be used to modify and extend Webpack, the configuration items refer to [documentation](https://webpack.js.org/configuration/output/)。

```js
module.exports = {
  // ...
  h5: {
    // ...
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js'
    }
  }
}
```

### h5.publicPath

`string`

Defalut value: `'/'`

Set the directory where the output parsed files are to be sent.

### h5.staticDirectory

`string`

Defalut value: `'static'`

h5 Compiled static files directory.

### h5.chunkDirectory

`string`

Defalut value: `'chunk'`

The directory where the non-entry js files are stored after compilation, mainly affecting the path to dynamically introduced `pages`.

### h5.devServer

`object`

Preview the configuration of the service, you can change parameters such as ports. Specific configuration reference [webpack-dev-server](https://webpack.js.org/configuration/dev-server)。

Example:

**修改端口：**

```js
module.exports = {
  // ...
  h5: {
    // ...
    devServer: {
      port: 10086
    }
  }
}
```

**Enable https service**

```js
module.exports = {
  // ...
  h5: {
    // ...
    devServer: {
      https: true
    }
  }
}
```

### h5.webpackChain

`function`

Customize the Webpack configuration.

This function receives **two arguments**, the first one is the webpackChain object, which can be modified by referring to the [webpack-chain](https://github.com/neutrinojs/webpack-chain) API, and the second argument is the `webpack` instance.

**例子：**

```js
// This is an example of adding a raw-loader to directly reference an md file in a project
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
// This is an example of adding a plugin
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

`object`

Routing related configuration.

#### h5.router.mode

`'hash' | 'browser'`

Default value: `'hash'`

Configure the routing mode.' hash' and 'browser' correspond to hash routing mode and browser history routing mode, respectively.

**Example:**

```js
module.exports = {
  // ...
  h5: {
    // ...
    router: {
      mode: 'hash' // or 'browser'
    }
  }
}
```

For the above configuration, after calling `Taro.navigateTo({ url: '/pages/index/index' })`, the browser address bar will be changed to: 

* `https://{{domain}}/#/pages/index/index`（**hash** mode）
* `https://{{domain}}/pages/index/index`（**browser** mode）

#### h5.router.basename

`string`

Configure the routing base path.

**例子：**

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

For the above configuration, after calling `Taro.navigateTo({ url: '/pages/index/index' })`, the browser address bar will be changed to:

* `https://{{domain}}/#/myapp/pages/index/index`（**hash** mode）
* `https://{{domain}}/myapp/pages/index/index`（**browser** mode）

#### h5.router.customRoutes

`object`

Configure custom routes.

**例子：**

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

For the above configuration, after calling `Taro.navigateTo({ url: '/pages/index/index' })`, the browser address bar will be changed to

* `https://{{domain}}/#/index`（**hash** mode）
* `https://{{domain}}/myapp/index`（**browser** mode)


### h5.enableSourceMap

`boolean`

Default value: `true` in watch mode, otherwise `false`.

Used to control whether to generate sourceMap corresponding to js, css.


### h5.sourceMapType

`string`

Default value: `'cheap-module-eval-source-map'`

Detail configuration refer to [Webpack devtool configuration](https://webpack.js.org/configuration/devtool/#devtool)。


### h5.useHtmlComponents

> Taro 3.2.4 started to support

`boolean`

Default value: `false`

Used to control whether to use the compatibility component library on the H5 side, for details see [React Compatibility Component Library](./h5#React Compatibility Component Library)。


### h5.enableExtract

`boolean`

Default value: `false` in watch mode, otherwise `true`.

The extract function switch, when turned on, will use `mini-css-extract-plugin` to separate css files, which can be configured via [h5.miniCssExtractPluginOption](./config-detail#h5minicssextractpluginoption) to configure the plugin.

### h5.esnextModules

`array`

The configuration requires additional modules compiled via Taro's preset postcss.

Suppose that the style units in [taro-ui](https://github.com/NervJS/taro-ui) need to be adapted for conversion.

```js
module.exports = {
  // ...
  h5: {
    // ...
    // After this configuration, the style files introduced in the code under the `node_modules/taro-ui/` path will be compiled by postcss.
    esnextModules: ['taro-ui']
  }
}
```

### h5.postcss

`object`

configure `postcss` related plugins.

#### h5.postcss.autoprefixer

`object`

The `autoprefixer` configuration can be performed. The configuration items refer to the [documentation](https://github.com/postcss/autoprefixer), eg:

```js
module.exports = {
  // ...
  h5: {
    // ...
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          /* autoprefixer configuration item  */
        }
      }
    }
  }
}
```

#### h5.postcss.pxtransform

`object`

Configuration of `pxtransform` can be done. Configuration items refer to [documentation](https://github.com/Pines-Cheng/postcss-pxtransform/), eg:

```js
module.exports = {
  // ...
  h5: {
    // ...
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          /* pxtransform configuration item */
        }
      }
    }
  }
}
```

#### h5.postcss.cssModules

`object`

CSS Modules can be configured as follows.

```js
module.exports = {
  // ...
  h5: {
    // ...
    postcss: {
      // css modules function switches and related configuration
      cssModules: {
        enable: false, // default is false, if you want to use the css modules function, set it to true
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

`object`

Additional configuration for `style-loader`. configuration item reference [documentation](https://github.com/webpack-contrib/style-loader), eg: 

```js
module.exports = {
  // ...
  h5: {
    // ...
    styleLoaderOption: {
      insertAt: 'top'
    }
  }
}
```

### h5.cssLoaderOption

`object`

Additional configuration for `css-loader`. configuration item reference [documentation](https://github.com/webpack-contrib/css-loader), eg: 

```js
module.exports = {
  // ...
  h5: {
    // ...
    cssLoaderOption: {
      localIdentName: '[hash:base64]'
    }
  }
}
```


### h5.sassLoaderOption

`object`

Additional configuration for `sass-loader`. configuration item reference [documentation](https://github.com/webpack-contrib/sass-loader), eg: 

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

> Supported since v3.0.26

`object`

Additional configuration for `less-loader`.  configuration item reference [documentation](https://github.com/webpack-contrib/less-loader), eg: 

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

`object`

Additional configuration for `stylus-loader`. configuration item reference [documentation](https://github.com/shama/stylus-loader)。

### h5.miniCssExtractPluginOption

`object`

Additional configuration for `mini-css-extract-plugin`, effective if [h5.enableExtract configuration](./config-detail#h5enableextract) is `true`.

configuration item reference [documentation](https://github.com/webpack-contrib/mini-css-extract-plugin), eg: 

```js
module.exports = {
  // ...
  h5: {
    // ...
    miniCssExtractPluginOption: {
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    }
  }
}
```

### h5.imageUrlLoaderOption

`object`

The `url-loader` configuration for `png | jpg | jpeg | gif | bpm | svg` files. configuration item reference [documentation], eg:

### h5.mediaUrlLoaderOption

`object`

The `url-loader` configuration for `mp4 | webm | ogg | mp3 | wav | flac | aac` files.configuration item reference [documentation], eg:

```js
module.exports = {
  // ...
  h5: {
    // ...
    mediaUrlLoaderOption: {
      limit: 8192
    }
  }
}
```

### h5.fontUrlLoaderOption

`object`

The `url-loader` configuration for `woff | woff2 | eot | ttf | otf` files. Refer to the [ documentation](https://github.com/webpack-contrib/url-loader) for the configuration items.

## rn

Configure exclusively for RN.

### rn.appName

`string`

Set the name of the registered application in the RN bundle

```js
module.exports = {
  // ...
  rn: {
    // ...
    appName: 'TaroDemo'
  }
}
```

### rn.entry

`string`

Entry uses the module lookup rule {name}. {platform}. {ext} to automatically distinguish between platforms

```js
module.exports = {
  // ...
  rn: {
    // ...
    entry: 'index.android.tsx'
  }
}
```

### rn.output

`object`

Set the output path of the bundle generated by Metro packaging, the default dist directory

```js
module.exports = {
  // ...
  rn: {
    // ...
    output: {
      iosSourceMapUrl: '', // sourcemap file url
      iosSourcemapOutput: '../taro-native-shell/ios/main.map', // sourcemap file output path
      iosSourcemapSourcesRoot: '', // The root directory when converting sourcemap resource paths to relative paths
      androidSourceMapUrl: '',
      androidSourcemapOutput: '../taro-native-shell/android/app/src/main/assets/index.android.map',
      androidSourcemapSourcesRoot: '',
      ios: '../taro-native-shell/ios/main.jsbundle',
      iosAssetsDest: '../taro-native-shell/ios',
      android: '../taro-native-shell/android/app/src/main/assets/index.android.bundle',
      androidAssetsDest: '../taro-native-shell/android/app/src/main/res'
    },
  }
}
```

### rn.postcss

`object`

`postcss` related configuration, other style languages preprocessed after this configuration.

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

### rn.sass

`object`

 `sass`related configurations. `options` configuration item reference [documentation](https://github.com/sass/node-sass#options)。

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

`object`

`less` related configurations. `options` configuration item reference [documentation](https://lesscss.org/usage/#less-options)。

```js
module.exports = {
  // ...
  rn: {
    // ...
    less: {
      options: { /* ... */ },
      additionalData: '', // {String|Function}
    }
  }
}
```

### rn.stylus

`object`

 `stylus` related configurations. `stylus.options` configuration item reference [documentation](https://github.com/NervJS/taro/tree/next/packages/taro-rn-style-transformer/README.md#rnstylus)。

```js
module.exports = {
  // ...
  rn: {
    // ...
    stylus: {
      options: { /* ... */ },
      additionalData: '', // {String|Function}
    }
  }
}
```
### rn.resolve

`object`

`resolve` handles the configuration of dependency files.
`resolve.include` can be configured with multiple arrays of `npm` package names, treating `npm` packages as project files, supporting `node_modules` platform priority file access and global styles.

```js
module.exports = {
  // ...
  rn: {
    // ...
    resolve: {
      // ...
      include: ['taro-ui'] // Handles cross-platform handling of references to node_modules/test files.
    }
  }
}
```
### rn.enableMultipleClassName
`boolean`

Support multiple `className` conversions, end with `classname` or `style`, extract the prefix, and then generate the corresponding xxxStyle according to the prefix. e.g. `barClassName -> barStyle`. Default value `false`, not enabled.

```js
module.exports = {
  rn: {
    enableMultipleClassName: false
  }
}
```

### rn.enableMergeStyle
`boolean`

Convert to object when the tag `style` property value is an array. Default value `false`, not enabled.

```js
module.exports = {
  rn: {
    enableMergeStyle: false // https://github.com/shinken008/babel-plugin-jsx-attributes-array-to-object#example
  }
}
```