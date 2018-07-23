## designWidth

`designWidth` 用来设置设计稿尺寸，关于这一部分的配置说明请见[设计稿及尺寸单位](../size.md)这一章节

## sourceRoot

`sourceRoot` 用来设置源码存放目录，通过 Taro 开发工具初始化后的项目源码目录都是 `src`，你可以通过修改这一配置来重新指定源码目录。

## outputRoot

`outputRoot` 用来设置代码编译后的生产目录，通过 Taro 开发工具初始化后的生产目录都是 `dist`，你可以通过修改这一配置来重新指定生产目录。

## plugins

`plugins` 用来设置一些各个端通用的编译过程配置，例如 `babel` 配置，JS/CSS 压缩配置等。

### plugins.babel

用来配置 `babel`，默认配置如下，可以自行添加自己需要的额外的 `presets` 及 `plugins`

```javascript
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

```javascript
uglify: {
  enable: true,
  config: {
    // 配置项同 https://github.com/mishoo/UglifyJS2#minify-options
  }
}
```

### plugins.csso

用来配置 `csso` 工具，设置打包过程中的 CSS 代码压缩。可以通过 `plugins.csso.enable` 来设置是否开启压缩，若设置开启，则可以通过 `plugins.csso.config` 来设置 `csso` 的配置项，具体配置方式如下：

```javascript
uglify: {
  enable: true,
  config: {
    // 配置项同 https://github.com/css/csso#minifysource-options
  }
}
```
## env

用来设置一些环境变量如 `process.env.NODE_ENV`，例如我们想设置区分预览、打包来做些不同的操作，可以如下配置：

在 `config/dev.js` 中

```javascript
env: {
  NODE_ENV: '"development"' // JSON.stringify('development')
}
```

在 `config/prod.js` 中

```javascript
env: {
  NODE_ENV: '"production"' // JSON.stringify('production')
}
```

这样就能在代码中通过 `process.env.NODE_ENV === 'development'` 来判断环境

## defineConstants

用来配置一些全局变量供代码中进行使用，例如

```javascript
defineConstants: {
  A: '"a"' // JSON.stringify('a')
}
```

## weapp

专属于小程序的配置

### weapp.module

配置一些小程序端用到的插件模块配置，例如 `postcss` 等

#### weapp.module.postcss

配置 `postcss` 相关插件

```javascript
postcss: {
  autoprefixer: {
    enable: true
  },
  pxtransform: {
    selectorBlackList: ['body']
  }
}
```

## h5

专属于 H5 的配置

### h5.devServer
预览服务的配置，可以更改端口等参数。具体配置参考[webpack-dev-server](https://webpack.js.org/configuration/dev-server)。
```
devServer: {
  port: 10086
}
```
默认是`http`服务，如果想开启`https`服务需要做如下配置。
```
devServer: {
  https: true
}
```

### h5.publicPath

设置输出解析文件的目录

### h5.staticDirectory

h5 编译后的静态文件目录

### h5.webpack
自定义webpack配置。这个配置项支持两种形式的配置。

1. 如果该配置项以**对象**的形态呈现，taro将会使用 `webpack-merge` 将这个对象合并到默认的配置项中。
例子：
```javascript
webpack: {
  resolve: {
    alias: {
      'test': './test'
    }
  }
}
```

2. 如果该配置以**函数**的形态呈现，那这个函数将会接收到两个参数：默认配置（defaultConfig）和webpack实例（webpack）。taro将会以该函数的返回值作为最终的webpack配置。
例子：

```javascript
webpack (defaultConfig, webpack) {
  defaultConfig.plugins.push(
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  )
  return defaultConfig
}
```

### h5.module

配置一些 H5 端用到的插件模块配置，例如 `postcss` 等

#### h5.module.postcss

配置 `postcss` 相关插件

```javascript
postcss: {
  autoprefixer: {
    enable: true
  },
  pxtransform: {
    selectorBlackList: ['body']
  }
}
```
