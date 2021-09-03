---
title: 编译配置
---

编译配置存放于项目根目录下的 `config` 目录中，包含三个文件：

- `index.js` 是通用配置
- `dev.js` 是项目预览时的配置
- `prod.js` 是项目打包时的配置

详细的编译配置文档请查阅：[编译配置详情](./config-detail)

### 默认配置

```js title="config/index.js"
const config = {
  // 项目名称
  projectName: 'Awesome Next',
  // 项目创建日期
  date: '2020-6-2',
  // 设计稿尺寸
  designWidth: 750,
  // 设计稿尺寸换算规则
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  // 项目源码目录
  sourceRoot: 'src',
  // 项目产出目录
  outputRoot: 'dist',
  // Taro 插件配置
  plugins: [],
  // 全局变量设置
  defineConstants: {},
  // 文件 copy 配置
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  // 框架，react，nerv，vue, vue3 等
  framework: 'react',
  // 小程序端专用配置
  mini: {
    postcss: {
      autoprefixer: {
        enable: true
      },
      // 小程序端样式引用本地资源内联配置
      url: {
        enable: true,
        config: {
          limit: 10240
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    // 自定义 Webpack 配置
    webpackChain (chain, webpack) {}
  },
  // H5 端专用配置
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    // 自定义 Webpack 配置
    webpackChain (chain, webpack) {},
    devServer: {}
  }
};

module.exports = function(merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
```
