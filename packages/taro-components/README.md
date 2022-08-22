# @tarojs/components

Taro 组件库。

在小程序端，React/Nerv 指向 `mini/index.js`，Vue 无需使用此包。

在 H5 端，React/Nerv 指向 `h5/react/index.js`，Vue 指向 `h5/vue/index.js`。H5 端使用 [stencil](https://stenciljs.com/) 把组件编译为 Web Components 以提供跨框架调用。

> NOTE: stencil v2.14+ 引入 import.meta 特性，使用 webpack4 打包时会抛出问题，需要解决后再升级。
