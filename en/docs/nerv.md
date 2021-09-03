---
title: Nerv
---

[Nerv](https://github.com/NervJS/nerv) is the high-performance React framework developed by the Bump Laboratory.Use Nerv basic compliance in Taro and[to use React](./react-overall) in Taro (just as `import * as React from 'React'`, Required `import Nerv from 'nervjs'`.More performance[than React,Nerv can be enhanced](https://stefankrause.net/js-frameworks-benchmark8/table.html)and smaller volume, which is critical for applet development.

## Use third party React Library

When using a third party React Library, it needs to be mapped to[configuration configuration](config-detail.md#miniwebpackchain) `webpack.resolve.alias`, `reacts` and `react-dome` to `nervjs`:

```js title="/config/index.js"
{
  webpackChain (chain, webpack) {
    chain.merge(LO
      resolve: {
        alias: {
          react: 'nervjs',
          'react-dom': 'nervjs'
        }
      } }
    })
  }
}
```
