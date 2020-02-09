---
title: 编译配置详情
id: version-1.3.37-config-detail
original_id: config-detail
---

## designWidth

`designWidth` 用来设置设计稿尺寸，关于这一部分的配置说明请见[设计稿及尺寸单位](./size.md)这一章节。

## sourceRoot

`sourceRoot` 用来设置源码存放目录，通过 Taro 开发工具初始化后的项目源码目录都是 `src`，你可以通过修改这一配置来重新指定源码目录。

## outputRoot

`outputRoot` 用来设置代码编译后的生产目录，通过 Taro 开发工具初始化后的生产目录都是 `dist`，你可以通过修改这一配置来重新指定生产目录。

## plugins

`plugins` 用来设置一些各个端通用的编译过程配置，例如 `babel` 配置，JS/CSS 压缩配置等。

### plugins.babel

用来配置 `babel`，默认配置如下，可以自行添加自己需要的额外的 `presets` 及 `plugins`。

```jsx
babel: {
  sourceMap: true,
  presets: [
    'env'
  ],
  plugins: [
    'transform-class-properties',
    'transform-decorators-legacy',
    'transform-object-rest-spread'
  ]
}
```

### plugins.uglify

用来配置 `UgligyJS` 工具，设置打包过程中的 JS 代码压缩。可以通过 `plugins.uglify.enable` 来设置是否开启压缩，若设置开启，则可以通过 `plugins.uglify.config` 来设置 `UgligyJS` 的配置项，具体配置方式如下：

```jsx
uglify: {
  enable: true,
  config: {
    // 配置项同 https://github.com/mishoo/UglifyJS2#minify-options
  }
}
```

### plugins.csso

用来配置 `csso` 工具，设置打包过程中的 CSS 代码压缩。可以通过 `plugins.csso.enable` 来设置是否开启压缩，若设置开启，则可以通过 `plugins.csso.config` 来设置 `csso` 的配置项，具体配置方式如下：

```jsx
csso: {
  enable: true,
  config: {
    // 配置项同 https://github.com/css/csso#minifysource-options
  }
}
```

### plugins.sass
用来配置 `sass` 工具，设置打包过程中的 SCSS 代码编译。  
具体配置可以参考[node-sass](https://www.npmjs.com/package/node-sass)  
当需要全局注入scss文件时，可以添加三个额外参数：`resource` 、 `projectDirectory` (v1.2.25开始支持)、`data`（v1.3.0开始支持），具体配置方式如下：

#### 单文件路径形式

当只有 `resource` 字段时，可以传入 scss 文件的绝对路径。

```js
sass: {
  resource: path.resolve(__dirname, '..', 'src/styles/variable.scss')
}
```

#### 多文件路径形式

此外，当只有 `resource` 字段时，也可以传入一个路径数组。

```js
sass: {
  resource: [
    path.resolve(__dirname, '..', 'src/styles/variable.scss'),
    path.resolve(__dirname, '..', 'src/styles/mixins.scss')
  ]
}
```

#### 指定项目根目录路径形式

你可以额外配置 `projectDirectory` 字段，这样你就可以在 `resource` 里写相对路径了。

```js
sass: {
  resource: [
    'src/styles/variable.scss',
    'src/styles/mixins.scss'
  ],
  projectDirectory: path.resolve(__dirname, '..')
}
```

#### 传入 scss 变量字符串

```js
sass: {
  resource: [
    'src/styles/variable.scss',
    'src/styles/mixins.scss'
  ],
  projectDirectory: path.resolve(__dirname, '..'),
  data: '$nav-height: 48px;'
}
```

* resource: 如果要引入多个文件，支持数组形式传入
* projectDirectory: 项目根目录的绝对地址(若为小程序云开发模板，则应该是client目录)
* data: 全局 scss 变量，若 data 与 resource 中设置了同样的变量，则 data 的优先级高于 resource

## env

用来设置一些环境变量如 `process.env.NODE_ENV`，例如我们想设置区分预览、打包来做些不同的操作，可以如下配置：

在 `config/dev.js` 中：

```jsx
env: {
  NODE_ENV: '"development"' // JSON.stringify('development')
}
```

在 `config/prod.js` 中：

```jsx
env: {
  NODE_ENV: '"production"' // JSON.stringify('production')
}
```

这样就能在代码中通过 `process.env.NODE_ENV === 'development'` 来判断环境。

## defineConstants

用来配置一些全局变量供代码中进行使用，例如：

```js
defineConstants: {
  A: '"a"' // JSON.stringify('a')
}
```

## alias

> `1.2.0` 开始支持。

用来配置目录别名，从而方便书写代码引用路径。例如，使用相对路径书写文件引用如下：

```js
import A from '../../componnets/A'
import Utils from '../../utils'
import packageJson from '../../package.json'
import projectConfig from '../../project.config.json'
```

为了避免书写多级相对路径，我们可以如下配置 `alias`：

```js
alias: {
  '@/components': path.resolve(__dirname, '..', 'src/components'),
  '@/utils': path.resolve(__dirname, '..', 'src/utils'),
  '@/package': path.resolve(__dirname, '..', 'package.json'),
  '@/project': path.resolve(__dirname, '..', 'project.config.json'),
}
```

通过上述配置，可以将 `src/components` 和 `src/utils` 目录配置成别名，将根目录下的 `package.json` 和 `project.config.json` 文件配置成别名，则代码中的引用改写如下：

```js
import A from '@/components/A'
import Utils from '@/utils'
import packageJson from '@/package'
import projectConfig from '@/project'
```

为了让编辑器（VS Code）不报错，并继续使用自动路径补全的功能，需要在项目根目录下的 `jsconfig.json` 或者 `tsconfig.json` 中配置 `paths` 让编辑器认得我们的别名，形式如下：

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

*建议别名使用 `@/` 开头而非仅用 `@` 开头，因为有小概率会与某些 `scoped` 形式的 `npm` 包（行如：[@tarojs/taro](https://npm.im/@tarojs/taro), [@babel/core](https://npm.im/@babel/core)）产生命名冲突。*

## copy

文件 copy 配置，包含两个配置项 `patterns` 和 `options`。

### copy.patterns

用来指定需要拷贝的文件或者目录，**数组类型**，每一项都必须包含 `from` 、`to` 的配置，分别代表来源和需要拷贝到的目录，同时可以设置 `ignore` 配置来指定需要忽略的文件， `ignore` 是指定的 [glob](https://github.com/isaacs/node-glob) 类型字符串，或者 glob 字符串数组。

值得注意的是，目前 `from` 必须指定存在的文件或者目录，暂不支持 glob 格式， `from` 和 `to` 直接置顶项目根目录下的文件目录，建议 `from` 以 `src` 目录开头，`to` 以 `dist` 目录开头。

一般有如下的使用形式：

```jsx
copy: {
  patterns: [
    { from: 'src/asset/tt/', to: 'dist/asset/tt/', ignore: '*.js' }, // 指定需要 copy 的目录
    { from: 'src/asset/tt/sd.jpg', to: 'dist/asset/tt/sd.jpg' } // 指定需要 copy 的文件
  ]
},
```

### copy.options

拷贝配置，目前可以指定全局的 ignore：

```jsx
copy: {
  options: {
    ignore: ['*.js', '*.css'] // 全局的 ignore
  }
}
```

## weapp

专属于小程序的配置。

### weapp.compile

小程序编译过程的相关配置。

#### weapp.compile.compressTemplate

决定小程序打包时是否需要压缩 wxml

#### weapp.compile.exclude

配置小程序编译过程中排除不需要经过 Taro 编译的文件，数组类型，写文件路径，文件路径必须以源码所在 `src` 目录开头：

```jsx
weapp: {
  compile: {
    exclude: ['src/components/ec-canvas/echarts.js']
  }
}
```

### weapp.module

配置一些小程序端用到的插件模块配置，例如 `postcss` 等。

#### weapp.module.postcss

配置 `postcss` 相关插件：

```jsx
postcss: {
  // 可以进行 autoprefixer 的配置。配置项参考官方文档 https://github.com/postcss/autoprefixer
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
```

## h5

专属于 H5 的配置。

### h5.devServer

预览服务的配置，可以更改端口等参数。具体配置参考 [webpack-dev-server](https://webpack.js.org/configuration/dev-server)。

```js
devServer: {
  port: 10086
}
```

默认是 `http` 服务，如果想开启 `https` 服务需要做如下配置。

```js
devServer: {
  https: true
}
```

### h5.output

输出配置

```js
output: {
  filename: 'js/[name].[hash:8].js',
  chunkFilename: 'js/[name].[chunkhash:8].js'
}
```

### h5.publicPath

设置输出解析文件的目录。

### h5.staticDirectory

h5 编译后的静态文件目录。

### h5.chunkDirectory

编译后非 entry 的 js 文件的存放目录，主要影响动态引入的 `pages` 的存放路径。

### h5.webpackChain

自定义 Webpack 配置，接受函数形式的配置。

这个函数会收到两个参数，第一个参数是 webpackChain 对象，可参考 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 的 api 进行修改；第二个参数是 `webpack` 实例。例如：

```jsx
// 这是一个添加 ts-loader 的例子，但事实上 taro 是默认支持 ts 的，并不需要这样做。
{
  webpackChain (chain, webpack) {
    chain.merge({
      module: {
        rule: {
          myloader: {
            test: /.tsx?/,
            use: [{
              loader: 'ts-loader',
              options: {}
            }]
          }
        }
      }
    })
  }
}
```

```jsx
// 这是一个添加插件的例子
{
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
```

### [DEPRECATED]h5.webpack

自定义 Webpack 配置。这个配置项支持两种形式的配置：

1. 如果该配置项以**对象**的形态呈现，Taro 将会使用 `webpack-merge` 将这个对象合并到默认的配置项中。
例子：

```jsx
webpack: {
  resolve: {
    alias: {
      'test': './test'
    }
  }
}
```

2. 如果该配置以**函数**的形态呈现，那这个函数将会接收到两个参数：默认配置（defaultConfig）和 Webpack 实例（webpack）。Taro 将会以该函数的返回值作为最终的 Webpack 配置。

例子：

```jsx
webpack (defaultConfig, webpack) {
  defaultConfig.plugins.push(
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  )
  return defaultConfig
}
```

### h5.router

路由相关的配置，支持路由模式、路由基准路径以及自定义路由的配置。

#### h5.router.mode

路由模式配置。配置值为 `hash`（默认值）或 `browser`，分别对应 hash 路由模式和浏览器 history 路由模式。例子：

```js
h5: {
  /* 其他配置 */
  ... ,
  router: {
    mode: 'hash' // 或者是 'browser'
  }
}
```

针对上面的配置，调用 `Taro.navigateTo({ url: '/pages/index/index' })` 后，浏览器地址栏将被变为 `http://{{domain}}/#/pages/index/index`（hash 模式）或者 `http://{{domain}}/pages/index/index`（browser 模式）。

#### h5.router.basename

路由基准路径的配置，配置值为 `string` 类型。例子：

```js
h5: {
  /* 其他配置 */
  ... ,
  router: {
    basename: '/myapp'
  }
}
```

针对上面的配置，调用 `Taro.navigateTo({ url: '/pages/index/index' })` 后，浏览器地址栏将被变为 `http://{{domain}}/#/myapp/pages/index/index`（hash 模式）或者 `http://{{domain}}/myapp/pages/index/index`（browser 模式）。

#### h5.router.customRoutes

自定义路由的配置，配置值为 `{ [key: string]: string }` 类型。例子：

```js
h5: {
  /* 其他配置 */
  ... ,
  router: {
    customRoutes: {
      '/pages/index/index': '/index'
    }
  }
}
```

针对上面的配置，调用 `Taro.navigateTo({ url: '/pages/index/index' })` 后，浏览器地址栏将被变为 `http://{{domain}}/#/index`（hash 模式）或者 `http://{{domain}}/myapp/index`（browser 模式）。

### h5.entry

Taro app 的入口，同 [webpack.entry](https://webpack.js.org/configuration/entry-context/#entry)。

```jsx
{
  entry: {
    home: ['./home.js'],
    about: ['./about.js'],
    contact: ['./contact.js']
  }
}
```

### h5.enableSourceMap

sourceMap 开关，影响 js、css 的 sourceMap 配置。
dev 状态默认 **开**，prod 状态默认 **关**。

### h5.sourceMapType
sourceMap格式, 默认cheap-module-eval-source-map。[具体配置](https://webpack.js.org/configuration/devtool/#devtool)

### h5.enableExtract

extract 功能开关，开启后将使用 `mini-css-extract-plugin` 分离 css 文件，
可通过 `h5.miniCssExtractPluginOption` 对插件进行配置。
dev 状态默认 **关**，prod 状态默认 **开**。

### h5.esnextModules

配置需要额外的编译的源码模块，比如 [taro-ui](https://github.com/NervJS/taro-ui)：

```javascript
h5: {
  // 经过这一配置之后，代码中引入的处于 `node_modules/taro-ui/` 路径下的源码文件均会经过taro的编译处理。
  esnextModules: ['taro-ui'],
  ...
}
```

### h5.cssLoaderOption

css-loader 的附加配置。配置项参考[官方文档](https://github.com/webpack-contrib/css-loader)，例如：

```jsx
{
  cssLoaderOption: {
    localIdentName: '[hash:base64]'
  }
}
```

### h5.styleLoaderOption

style-loader 的附加配置。配置项参考[官方文档](https://github.com/webpack-contrib/style-loader)，例如：

```jsx
{
  styleLoaderOption: {
    insertAt: 'top'
  }
}
```

### h5.sassLoaderOption

sass-loader 的附加配置。配置项参考[官方文档](https://github.com/webpack-contrib/sass-loader)，例如：

```jsx
{
  sassLoaderOption: {
    implementation: require("dart-sass")
  }
}
```

### h5.lessLoaderOption

less-loader 的附加配置。配置项参考[官方文档](https://github.com/webpack-contrib/less-loader)，例如：

```jsx
{
  lessLoaderOption: {
    strictMath: true,
    noIeCompat: true
  }
}
```

### h5.stylusLoaderOption

stylus-loader 的附加配置。配置项参考[官方文档](https://github.com/shama/stylus-loader)。

### h5.mediaUrlLoaderOption

针对 `mp4 | webm | ogg | mp3 | wav | flac | aac` 文件的 url-loader 配置。配置项参考[官方文档](https://github.com/webpack-contrib/url-loader)，例如：

```jsx
{
  mediaUrlLoaderOption: {
    limit: 8192
  }
}
```

### h5.fontUrlLoaderOption

针对 `woff | woff2 | eot | ttf | otf` 文件的 url-loader 配置。配置项参考[官方文档](https://github.com/webpack-contrib/url-loader)。

### h5.imageUrlLoaderOption

针对 `png | jpg | jpeg | gif | bpm | svg` 文件的 url-loader 配置。配置项参考[官方文档](https://github.com/webpack-contrib/url-loader)。

### h5.miniCssExtractPluginOption

`mini-css-extract-plugin` 的附加配置，在 `enableExtract` 为 `true` 的情况下生效。
配置项参考[官方文档](https://github.com/webpack-contrib/mini-css-extract-plugin)，例如：

```jsx
{
  miniCssExtractPluginOption: {
    filename: 'css/[name].css',
    chunkFilename: 'css/[id].css'
  }
}
```

### h5.module

配置一些 H5 端用到的插件模块配置，暂时只有 `postcss`。

#### h5.module.postcss.autoprefixer

可以进行 `autoprefixer` 的配置。配置项参考[官方文档](https://github.com/postcss/autoprefixer)，例如：

```jsx
postcss: {
  autoprefixer: {
    enable: true,
    config: {
      /* autoprefixer 配置项 */
    }
  }
}
```

#### h5.module.postcss.pxtransform

可以进行 `pxtransform` 的配置。配置项参考[官方文档](https://github.com/Pines-Cheng/postcss-pxtransform/)，例如：

```jsx
postcss: {
  pxtransform: {
    enable: true,
    config: {
      /* pxtransform 配置项 */
    }
  }
}
```

#### h5.module.postcss.cssModules

可以进行 H5 端 CSS Modules 配置，配置如下：

```js
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
```
