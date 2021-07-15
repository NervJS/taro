---
title: Nerv
---

[Nerv](https://github.com/NervJS/nerv) Nerv is a high-performance React-like framework developed by Au Lab. Using Nerv in Taro basically follows the same usage as[Using React in Taro](./react.md) （except that you need to `import Nerv from 'nervjs'` instead of `import * as React from 'React'`）。Compared to React, Nerv improves[higher performance](https://stefankrause.net/js-frameworks-benchmark8/table.html)and is smaller in size, which is critical in mini-program development.

## Using third-party React libraries

When using a third-party React library, you need to add the[configuration file](config-detail.md#miniwebpackchain) `webpack.resolve.alias`，Mapping `react` and `react-dom` to `nervjs`:

```js title="/config/index.js"
{
  webpackChain (chain, webpack) {
    chain.merge({
      resolve: {
        alias: {
          react: 'nervjs',
          'react-dom': 'nervjs'
        }
      }
    })
  }
}
```
