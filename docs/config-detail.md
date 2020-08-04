---
title: 编译配置详情
---

## sourceRoot

`string`

默认值：`'src'`

源码存放目录。

## outputRoot

`string`

默认值：`'dist'`

代码编译后的生产目录。


## designWidth

`number`

默认值：`750`

设计稿尺寸，详情请见[设计稿及尺寸单位](./size.md)。

## defineConstants

`object`

用于配置一些全局变量供代码中进行使用。

配置方式可参考 [Webpack DefinePlugin](https://webpack.js.org/plugins/define-plugin/)，例如：

```js
module.exports = {
  // ...
  defineConstants: {
    A: '"a"' // JSON.stringify('a')
  }
}
```

## alias

`object`

用于配置目录别名，从而方便书写代码引用路径。

例如，使用相对路径书写文件引用如下：

```js
import A from '../../componnets/A'
import Utils from '../../utils'
import packageJson from '../../package.json'
import projectConfig from '../../project.config.json'
```

为了避免书写多级相对路径，我们可以如下配置 `alias`：

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

> 建议别名使用 `@/` 开头而非仅用 `@` 开头，因为有小概率会与某些 `scoped` 形式的 `npm` 包（形如：[@tarojs/taro](https://npm.im/@tarojs/taro), [@babel/core](https://npm.im/@babel/core)）产生命名冲突。

## env

`object`

用于设置环境变量，如 `process.env.NODE_ENV`。

假设我们需要区分开发环境和生产环境，可以如下配置：

**config/dev.js**：

```jsx
module.exports = {
  // ...
  env: {
    NODE_ENV: '"development"' // JSON.stringify('development')
  }
}
```

**config/prod.js**：

```jsx
module.exports = {
  // ...
  env: {
    NODE_ENV: '"production"' // JSON.stringify('production')
  }
}
```

这样就能在代码中通过 `process.env.NODE_ENV === 'development'` 来判断环境。


## copy

`object`

用于把文件从源码目录直接拷贝到编译后的生产目录。

### copy.patterns

`array`

用于指定需要拷贝的文件或者目录，每一项都必须包含 `from` 、`to` 配置，分别代表来源和需要拷贝到的目录。同时可以设置 `ignore` 配置来指定需要忽略的文件， `ignore` 是指定的 [glob](https://github.com/isaacs/node-glob) 类型字符串，或者 glob 字符串数组。

> 注意，`from` 必须指定存在的文件或者目录，暂不支持 glob 格式。`from` 和 `to` 直接置顶项目根目录下的文件目录，建议 `from` 以 `src` 目录开头，`to` 以 `dist` 目录开头。

一般有如下的使用形式：

```js
module.exports = {
  // ...
  copy: {
    patterns: [
      { from: 'src/asset/tt/', to: 'dist/asset/tt/', ignore: '*.js' }, // 指定需要 copy 的目录
      { from: 'src/asset/tt/sd.jpg', to: 'dist/asset/tt/sd.jpg' } // 指定需要 copy 的文件
    ]
  }
}
```

### copy.options

`object`

拷贝配置，可以指定全局的 ignore：

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

`array`

配置 Taro 插件。

当不需要传入参数给插件时，以下写法等价：

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
    // 引入 npm 安装的插件，并传入插件参数
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

一个 preset 是一系列 Taro 插件的集合，配置语法同 [plugins](./config-detail.md#plugins)。

```js
module.exports = {
  // ...
  presets: [
    // 引入 npm 安装的插件集
    '@tarojs/preset-sth', 
    // 引入 npm 安装的插件集，并传入插件参数
    ['@tarojs/plugin-sth', {
      arg0: 'xxx'
    }],
    // 从本地绝对路径引入插件集，同样如果需要传入参数也是如上
    '/absulute/path/preset/filename',
  ]
}
```

## terser

`object`

配置 [terser](https://github.com/terser/terser) 工具以压缩 JS 代码。

### terser.enable

`boolean`

默认值 `true`

是否开启 JS 代码压缩。

### terser.config

`object`

terser 的具体配置。

```js
module.exports = {
  // ...
  terser: {
    enable: true,
    config: {
      // 配置项同 https://github.com/terser/terser#minify-options
    }
  }
}
```

> terser 配置只在**生产模式**下生效。如果你正在使用 **watch** 模式，又希望启用 terser，那么则需要设置 `process.env.NODE_ENV` 为 `'production'`。

## csso

`object`

配置 [csso](https://github.com/css/csso) 工具以压缩 CSS 代码。

### csso.enable

`boolean`

默认值 `true`

是否开启 CSS 代码压缩。

### csso.config

`object`

csso 的具体配置。

```js
module.exports = {
  // ...
  csso: {
    enable: true,
    config: {
      // 配置项同 https://github.com/css/csso#minifysource-options
    }
  }
}
```

> csso 配置只在**生产模式**下生效。如果你正在使用 **watch** 模式，又希望启用 csso，那么则需要设置 `process.env.NODE_ENV` 为 `'production'`。

## sass

`object`

用于控制对 scss 代码的编译行为，具体配置可以参考 [node-sass](https://www.npmjs.com/package/node-sass)。

当需要往所有 scss 文件头部插入 scss 代码时，可以通过以下三个额外参数设置：

### sass.resource

`string | array`

需要全局注入的 scss 文件的绝对路径。如果要引入多个文件，支持以数组形式传入。

当存在 [projectDirectory](./config-detail#sassprojectdirectory) 配置时，才支持传入相对路径。

### sass.projectDirectory

`string`

项目根目录的绝对地址(若为小程序云开发模板，则应该是client目录)。

### sass.data

`string`

全局 scss 变量，若 data 与 resource 中设置了同样的变量，则 data 的优先级高于 resource。

### 全局注入 scss 的例子

#### 单文件路径形式

当只有 `resource` 字段时，可以传入 scss 文件的绝对路径。

```js
module.exports = {
  // ...
  sass: {
    resource: path.resolve(__dirname, '..', 'src/styles/variable.scss')
  }
}
```

#### 多文件路径形式

此外，当只有 `resource` 字段时，也可以传入一个路径数组。

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

#### 指定项目根目录路径形式

你可以额外配置 `projectDirectory` 字段，这样你就可以在 `resource` 里写相对路径了。

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

#### 传入 scss 变量字符串

data 中声明的 $nav-height 变量优先级最高。

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

专属于小程序的配置。

### mini.baseLevel

`number`

默认值：`16`

对于 `template` 模板不支持递归的小程序（如：微信、QQ、京东），Taro 会对所有模板**循环 baseLevel 次**，以支持同类模板的循环调用。

但是循环太多次也会导致生成的 `base` 模板体积相当大，因此当你的嵌套层级并不太深时可以使用 `baseLevel` 配置项配置较少的循环层数。

当然在嵌套层级较深时，也可以增大 baseLevel。以避免到达循环上限后，Taro 会调用一个自定义组件重新开始循环所带来一些问题。

### mini.compile

`object`

小程序编译过程的相关配置。

#### mini.compile.exclude

`array`

配置小程序编译过程中**排除不需要经过 Taro 编译的文件**，数组里面可以包含具体文件路径，也可以是判断函数，同 [Rule.exclude](https://webpack.js.org/configuration/module/#ruleexclude)。

假设要排除某个文件，可以配置要排除的文件的具体路径：

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

也可以配置判断函数：

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

#### mini.compile.incldue

`array`

配置额外**需要经过 Taro 编译的文件**，使用方式与 [mini.compile.exclude](./config-detail#minicompileexclude) 一致，同 [Rule.include](https://webpack.js.org/configuration/module/#ruleinclude)。

例如 Taro 默认不编译 `node_modules` 中的文件，可以通过这个配置让 Taro 编译  `node_modules` 中的文件。

### mini.webpackChain

`function`

自定义 Webpack 配置。

这个函数会收到**三个参数**。第一个参数是 webpackChain 对象，可参考 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 的 API 进行修改，第二个参数是 `webpack` 实例，第三个参数 `PARSE_AST_TYPE` 是小程序编译时的文件类型集合。

第三个参数的取值如下：

```typescript
export enum PARSE_AST_TYPE {
  ENTRY = 'ENTRY',
  PAGE = 'PAGE',
  COMPONENT = 'COMPONENT',
  NORMAL = 'NORMAL',
  STATIC = 'STATIC'
}
```

**例子：**

```js
// 这是一个添加 raw-loader 的例子，用于在项目中直接引用 md 文件
module.exports = {
  // ...
  mini: {
    // ...
    webpackChain (chain, webpack) {
      chain.merge({
        module: {
          rules: {
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

`object`

可用于修改、拓展 Webpack 的 **output** 选项，配置项参考[官方文档](https://webpack.js.org/configuration/output/)。

### mini.enableSourceMap

`boolean`

默认值：watch 模式下为 `true`，否则为 `false`。

用于控制是否生成 js、css 对应的 sourceMap。

### mini.sourceMapType

`string`

默认值：`'cheap-module-eval-source-map'`

具体配置请参考 [Webpack devtool 配置](https://webpack.js.org/configuration/devtool/#devtool)。

### mini.postcss

`object`

配置 `postcss` 相关插件。

```js
module.exports = {
  // ...
  mini: {
    // ...
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
  }
}
```

### mini.commonChunks

`array | function`

用于告诉 Taro 编译器需要抽取的公共文件，支持两种配置方式。

`commonChunks` 的配置值必须依据于 webpack 配置 [optimization.runtimeChunk](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk) 和 [optimization.splitChunks](https://webpack.js.org/plugins/split-chunks-plugin/) 中的公共 chunks 的名称。Taro 中 webpack.optimization 配置的默认值：[源码位置](https://github.com/NervJS/taro/blob/bc6af68bda2cbc9163fbda36c15878fc96aec8f1/packages/taro-mini-runner/src/webpack/build.conf.ts#L220-L254)。

> 如果有自行拆分公共文件的需求，请先通过 [webpackChain 配置](./config-detail#miniwebpackchain) 覆盖`optimization.runtimeChunk` 与 `optimization.splitChunks` 配置。再通过此 `commonChunks` 配置指定公共入口文件。

#### 字符串数组方式

普通编译时的默认值：`['runtime', 'vendors', 'taro', 'common']`

编译为微信小程序插件时的默认值： `['plugin/runtime', 'plugin/vendors', 'plugin/taro', 'plugin/common']`

可以传入需要抽取的公共文件的名称数组。

例子：

```js
module.exports = {
  // ...
  mini: {
    // ...
    commonChunks: ['runtime', 'vendors', 'taro', 'common']
  }
}
```

这几个公共文件分别表示：

* `runtime`: webpack 运行时入口
* `taro`: node_modules 中 Taro 相关依赖
* `vendors`: node_modules 除 Taro 外的公共依赖
* `common`: 项目中业务代码公共逻辑

#### 函数方式

通过对入参的默认公共文件数组进行操作，返回新的数组来进行配置，如下

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

`function`

为某些页面单独指定需要引用的公共文件。

例如在使用小程序分包的时候，为了减少主包大小，分包的页面希望引入自己的公共文件，而不希望直接放在主包内。那么我们首先可以通过 [webpackChain 配置](./config-detail#miniwebpackchain) 来单独抽离分包的公共文件，然后通过 `mini.addChunkPages` 为分包页面配置引入分包的公共文件，其使用方式如下：

`mini.addChunkPages` 配置为一个函数，接受两个参数

* `pages` 参数为 Map 类型，用于为页面添加公共文件
* `pagesNames` 参数为当前应用的所有页面标识列表，可以通过打印的方式进行查看页面的标识

例如，为 `pages/index/index` 页面添加 `eating` 和 `morning` 两个抽离的公共文件：

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

### mini.styleLoaderOption

`object`

`style-loader` 的附加配置。配置项参考[官方文档](https://github.com/webpack-contrib/style-loader)，例如：

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

`css-loader` 的附加配置。配置项参考[官方文档](https://github.com/webpack-contrib/css-loader)，例如：

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

`sass-loader` 的附加配置。配置项参考[官方文档](https://github.com/webpack-contrib/sass-loader)，例如：

```js
module.exports = {
  // ...
  mini: {
    // ...
    sassLoaderOption: {
      implementation: require("dart-sass")
    }
  }
}
```

### mini.lessLoaderOption

`object`

`less-loader` 的附加配置。配置项参考[官方文档](https://github.com/webpack-contrib/less-loader)，例如：

```js
module.exports = {
  // ...
  mini: {
    // ...
    lessLoaderOption: {
      strictMath: true,
      noIeCompat: true
    }
  }
}
```

### mini.stylusLoaderOption

`object`

`stylus-loader` 的附加配置。配置项参考[官方文档](https://github.com/shama/stylus-loader)。

### mini.miniCssExtractPluginOption

`object`

`mini-css-extract-plugin` 的附加配置，配置项参考[官方文档](https://github.com/webpack-contrib/mini-css-extract-plugin)。

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

针对 `png | jpg | jpeg | gif | bpm | svg` 文件的 `url-loader` 配置。配置项参考[官方文档](https://github.com/webpack-contrib/url-loader)。

### mini.mediaUrlLoaderOption

`object`

针对 `mp4 | webm | ogg | mp3 | wav | flac | aac` 文件的 `url-loader` 配置。配置项参考[官方文档](https://github.com/webpack-contrib/url-loader)，例如：

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

针对 `woff | woff2 | eot | ttf | otf` 文件的 `url-loader` 配置。配置项参考[官方文档](https://github.com/webpack-contrib/url-loader)。

## h5

专属于 H5 的配置。

### h5.entry

`object`

可用于修改、拓展 Webpack 的 **input** 选项，配置项参考 [官方文档](https://webpack.js.org/configuration/entry-context/#entry)。

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

可用于修改、拓展 Webpack 的 **output** 选项，配置项参考[官方文档](https://webpack.js.org/configuration/output/)。

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

默认值：`'/'`

设置输出解析文件的目录。

### h5.staticDirectory

`string`

默认值：`'static'`

h5 编译后的静态文件目录。

### h5.chunkDirectory

`string`

默认值：`'chunk'`

编译后非 entry 的 js 文件的存放目录，主要影响动态引入的 `pages` 的存放路径。

### h5.devServer

`object`

预览服务的配置，可以更改端口等参数。具体配置参考 [webpack-dev-server](https://webpack.js.org/configuration/dev-server)。

例子：

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

**开启 https 服务：**

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

自定义 Webpack 配置。

这个函数会收到**两个参数**，第一个参数是 webpackChain 对象，可参考 [webpack-chain](https://github.com/neutrinojs/webpack-chain) 的 API 进行修改，第二个参数是 `webpack` 实例。

**例子：**

```js
// 这是一个添加 raw-loader 的例子，用于在项目中直接引用 md 文件
module.exports = {
  // ...
  h5: {
    // ...
    webpackChain (chain, webpack) {
      chain.merge({
        module: {
          rules: {
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

`object`

路由相关的配置。

#### h5.router.mode

`'hash' | 'browser'`

默认值：`'hash'`

配置路由模式。'hash' 与 'browser' 分别对应 hash 路由模式和浏览器 history 路由模式。

**例子：**

```js
module.exports = {
  // ...
  h5: {
    // ...
    router: {
      mode: 'hash' // 或者是 'browser'
    }
  }
}
```

针对上面的配置，调用 `Taro.navigateTo({ url: '/pages/index/index' })` 后，浏览器地址栏将被变为：

* `https://{{domain}}/#/pages/index/index`（**hash** 模式）
* `https://{{domain}}/pages/index/index`（**browser** 模式）

#### h5.router.basename

`string`

配置路由基准路径。

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

针对上面的配置，调用 `Taro.navigateTo({ url: '/pages/index/index' })` 后，浏览器地址栏将被变为：

* `https://{{domain}}/#/myapp/pages/index/index`（**hash** 模式）
* `https://{{domain}}/myapp/pages/index/index`（**browser** 模式）

#### h5.router.customRoutes

`object`

配置自定义路由。

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

针对上面的配置，调用 `Taro.navigateTo({ url: '/pages/index/index' })` 后，浏览器地址栏将被变为：

* `https://{{domain}}/#/index`（**hash** 模式）
* `https://{{domain}}/myapp/index`（**browser** 模式）


### h5.enableSourceMap

`boolean`

默认值：watch 模式下为 `true`，否则为 `false`。

用于控制是否生成 js、css 对应的 sourceMap。


### h5.sourceMapType

`string`

默认值：`'cheap-module-eval-source-map'`

具体配置请参考 [Webpack devtool 配置](https://webpack.js.org/configuration/devtool/#devtool)。

### h5.enableExtract

`boolean`

默认值：watch 模式下为 `false`，否则为 `true`。

extract 功能开关，开启后将使用 `mini-css-extract-plugin` 分离 css 文件，可通过 [h5.miniCssExtractPluginOption](./config-detail#h5minicssextractpluginoption) 对插件进行配置。

### h5.esnextModules

`array`

配置需要额外的经由 Taro 预设的 postcss 编译的模块。

假设需要对 [taro-ui](https://github.com/NervJS/taro-ui) 里的样式单位进行转换适配：

```js
module.exports = {
  // ...
  h5: {
    // ...
    // 经过这一配置之后，代码中引入的处于 `node_modules/taro-ui/` 路径下的样式文件均会经过 postcss 的编译处理。
    esnextModules: ['taro-ui']
  }
}
```

### h5.postcss

`object`

配置 `postcss` 相关插件。

#### h5.postcss.autoprefixer

`object`

可以进行 `autoprefixer` 的配置。配置项参考[官方文档](https://github.com/postcss/autoprefixer)，例如：

```js
module.exports = {
  // ...
  h5: {
    // ...
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          /* autoprefixer 配置项 */
        }
      }
    }
  }
}
```

#### h5.postcss.pxtransform

`object`

可以进行 `pxtransform` 的配置。配置项参考[官方文档](https://github.com/Pines-Cheng/postcss-pxtransform/)，例如：

```js
module.exports = {
  // ...
  h5: {
    // ...
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          /* pxtransform 配置项 */
        }
      }
    }
  }
}
```

#### h5.postcss.cssModules

`object`

可以进行 CSS Modules 配置，配置如下：

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

`object`

`style-loader` 的附加配置。配置项参考[官方文档](https://github.com/webpack-contrib/style-loader)，例如：

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

`css-loader` 的附加配置。配置项参考[官方文档](https://github.com/webpack-contrib/css-loader)，例如：

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

`sass-loader` 的附加配置。配置项参考[官方文档](https://github.com/webpack-contrib/sass-loader)，例如：

```js
module.exports = {
  // ...
  h5: {
    // ...
    sassLoaderOption: {
      implementation: require("dart-sass")
    }
  }
}
```

### h5.lessLoaderOption

`object`

`less-loader` 的附加配置。配置项参考[官方文档](https://github.com/webpack-contrib/less-loader)，例如：

```js
module.exports = {
  // ...
  h5: {
    // ...
    lessLoaderOption: {
      strictMath: true,
      noIeCompat: true
    }
  }
}
```

### h5.stylusLoaderOption

`object`

`stylus-loader` 的附加配置。配置项参考[官方文档](https://github.com/shama/stylus-loader)。

### h5.miniCssExtractPluginOption

`object`

`mini-css-extract-plugin` 的附加配置，在 [h5.enableExtract 配置](./config-detail#h5enableextract) 为 `true` 的情况下生效。

配置项参考[官方文档](https://github.com/webpack-contrib/mini-css-extract-plugin)，例如：

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

针对 `png | jpg | jpeg | gif | bpm | svg` 文件的 `url-loader` 配置。配置项参考[官方文档](https://github.com/webpack-contrib/url-loader)。

### h5.mediaUrlLoaderOption

`object`

针对 `mp4 | webm | ogg | mp3 | wav | flac | aac` 文件的 `url-loader` 配置。配置项参考[官方文档](https://github.com/webpack-contrib/url-loader)，例如：

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

针对 `woff | woff2 | eot | ttf | otf` 文件的 `url-loader` 配置。配置项参考[官方文档](https://github.com/webpack-contrib/url-loader)。
