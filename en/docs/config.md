---
title: Compile Configuration
---

The compile configuration is in the `config` directory in the project root directory and contains three files.

- `index.js` Common configuration
- `dev.js`  Development environment configuration
- `prod.js` Production environment configuration

Detailed compilation and configuration documentation: [Compile configuration details](./config-detail)

### Default Configuration

```js title="config/index.js"
const config = {
  projectName: 'Awesome Next',
  date: '2020-6-2',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  // frameworks, react, nerv, vue, vue3, etc.
  framework: 'react',
  mini: {
    postcss: {
      autoprefixer: {
        enable: true
      },
      url: {
        enable: true,
        config: {
          limit: 10240
        }
      },
      cssModules: {
        enable: false, 
        config: {
          namingPattern: 'module', // Conversion mode
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    // Custom Webpack Configuration
    webpackChain (chain, webpack) {}
  },
  // 
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true
      },
      cssModules: {
        enable: false, 
        config: {
          namingPattern: 'module', 
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
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
