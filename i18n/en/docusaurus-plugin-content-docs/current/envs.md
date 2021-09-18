---
title: Cross-platform Development
---

Taro was originally designed to unify cross-platform development and has tried its best to smooth out the differences between multiple ends through runtime frameworks, components, and APIs, but there are still some differences between different platforms that cannot be eliminated, so in order to better realize cross-platform development, Taro provides the following solutions

## Built-in environment variables

> Note: The way environment variables are used in the code, [reference](./best-practice.md#最佳编码方式)

Taro provides some built-in environment variables at compile time to help the user do some special handling

### process.env.TARO_ENV

Used to determine the current compilation type, currently there are `weapp` / `swan` / `alipay` / `h5` / `rn` / `tt` / `qq` / `quickapp` eight values, This variable can be used to write code for different environments, and when compiling the code that does not belong to the current compile type will be removed  and only the code under the current compile type will be kept, for example, if you want to refer to different resources in the WeChat mini-program and H5 respectively

```jsx
if (process.env.TARO_ENV === 'weapp') {
  require('path/to/weapp/name')
} else if (process.env.TARO_ENV === 'h5') {
  require('path/to/h5/name')
}
```

It can also be used in JSX to determine which components to load on different ends.

```jsx
render () {
  return (
    <View>
      {process.env.TARO_ENV === 'weapp' && <ScrollViewWeapp />}
      {process.env.TARO_ENV === 'h5' && <ScrollViewH5 />}
    </View>
  )
}
```

## Uniform interface for multi-terminal files

> 1.2.17 start support

The built-in environment variables can solve most of the cross-end problems, but it will fill the code with logic judgment code, which affects the maintainability of the code, and also makes the code more and more ugly. To solve this problem, since `1.2.17`, Taro provides another way of cross-end development as a supplement.

Developers can address features that differ across ends by using multiple platform files with a unified interface. For a feature, if there are differences between multiple ends, developers can modify the file into the naming form of `original file name + end type`, so that the file code of different ends keeps a unified interface to the outside world, while the reference is still `import` the file with the original file name. Taro will change the loaded file to a file with the file name of the corresponding end type at compilation time, so as to achieve the purpose of loading the corresponding file for different ends.

The end type corresponds to the value of `process.env.TARO_ENV`.

There are usually two usage scenarios.

### Multiple platform components

If there is a `Test` component that exists in three different versions - WeChat mini-program, Baidu smart-program and H5 - then the code can be organized like this

The `test.js` file, which is the default form of the `Test` component, is compiled to a version that is used outside of the  WeChat mini-program, Baidu smart-program and H5

The `test.h5.js` file, which is the H5 version of the `Test` component

The `test.weapp.js` file, which is the WeChat mini-program version of the `Test` component

The `test.swan.js` file, which is the Baidu smart-program version of the `Test` component

The `test.qq.js` file, which is the QQ mini-program version of the `Test` component

The `test.quickapp.js` file, which is the quick app version of the `Test` component

The four files, which expose a unified interface to the outside world, accept consistent parameters, but only have internal code implementations for their respective platforms

When we use the `Test` component, the reference remains the same as before, the `import` is a file name without the end type, and the end type suffix is automatically recognized and added at compile time

```jsx
import Test from '../../components/test'

<Test argA={1} argA={2} />
```

### Multiple platform scripting

Similar to the multiple platform component, if there is a need to write different script logic code for different ends, we can handle it similarly, the only principle to follow is to keep the external interface of the multiple platform file consistent.

For example, we use `Taro.setNavigationBarTitle` to set the page title on WeChat mini-program, and H5 uses `document.title`, then you can encapsulate a `setTitle` method to smooth out the difference between the two platforms.

 `set_title.h5.js`,with the following code

```js title="set_title.h5.js"
export default function setTitle (title) {
  document.title = title
}
```

`set_title.weapp.js`，with the following code

```js title="set_title.weapp.js"
import Taro from '@tarojs/taro'
export default function setTitle (title) {
  Taro.setNavigationBarTitle({
    title
  })
}
```

When called, the following is used

```js
import setTitle from '../utils/set_title'

setTitle('page title')
```

### Usage points


There are three key points of use for this cross-platform compatible writeup of the unified interface's multi-terminal files

- The corresponding files on different ends must have a unified interface and a unified call method
- It is better to have a platform-independent default file, so that there will be no error when using ts
- When referring to a file, only the default file name should be written, not the file suffix.

### Use different pages in app.js

> 1.3.11 Start of support

Depending on the environment, different `pages` are returned, which can be written like this

```js
let pages = []
if (process.env.TARO_ENV === 'weapp') {
  pages = [
    '/pages/index/index'
  ]
}
if (process.env.TARO_ENV === 'swan') {
  pages = [
    '/pages/indexswan/indexswan'
  ]
}
export default {
  pages
}
```

### Make dependencies in node_modules parse multiple files as well

The multiple platform files in Taro 3 are parsed by the  [MultiPlatformPlugin](https://github.com/NervJS/taro/blob/next/packages/taro-runner-utils/src/resolve/MultiPlatformPlugin.ts) plugin.

It is an [enhanced-resolve](https://github.com/webpack/enhanced-resolve) plugin, which is loaded internally by taro by default. However, the plugin does not resolve files in node_modules by default.

If we have an npm package called @taro-mobile and we need to parse the multiple platform files  in it, we can change the configuration of the MultiPlatformPlugin in the taro configuration file like this:

```js title="/config/index.js"
// mini can also be changed to h5, corresponding to the mini-program and h5 end configuration respectively
mini: {
  webpackChain (chain) {
    chain.resolve.plugin('MultiPlatformPlugin')
      .tap(args => {
        return [...args, {
          include: ['@taro-mobile']
        }]
      })
  }
}
```
The Taro 3 RN side does not use webpack, so it can't be consistent with the other side, so a configuration support has to be added here.

```js title="/config/index.js"
rn: {
  resolve: {
    include: ['@taro-mobile'],
  }
}
```
