---
title: Babel Configuration
---

The Babel configuration for the Taro project is located in the `babel.config.js` file in the root directory, where a preset is added by default: `babel-preset-taro`, which adds some common `presets` and `plugins` depending on the project's technology stack.

```js title="babel.config.js"
module.exports = {
  presets: [
    ['taro', {/** Babel configuration items */}]
  ]
}
```

Developers can modify `babel.config.js`, change the configuration items of `babel-preset-taro`, or add `presets` and `plugins` that they want.

## babel-preset-taro

`babel-preset-taro` will optionally use the following `presets` and `plugins` depending on the current project's technology stack.


#### 1. 通用

##### presets

- `@babel/preset-env`
- `@babel/preset-typescript`（TypeScript Environment）

##### plugins

- `@babel/plugin-transform-runtime`
- `@babel/plugin-proposal-decorators`
- `@babel/plugin-proposal-class-properties`
- `babel-plugin-dynamic-import-node`（Mini  Program Environment）

#### 2. React

##### presets

- `@babel/preset-react`

##### plugins

- `react-refresh/babel`

#### 3. Vue

##### presetes

- `@vue/babel-preset-jsx`

#### 4. Vue3

##### plugins

- `@vue/babel-plugin-jsx`

The configuration items for `babel-preset-taro` are described in detail below.

### reactJsxRuntime

:::note
Effective only when using **React**.
:::

**Default value**:`'automatic'`

`@babel/preset-react` [runtime](https://babeljs.io/docs/en/babel-preset-react#runtime) configuration items.

### hot

:::note
Effective only when using **React**.
:::

**Default value**:`true`

Whether to introduce `react-refresh/babel` to support the use of [fast-refresh](h5#fast-refresh)。

### vueJsx

:::note
Effective only when using **Vue/Vue 3**.
:::

**Default value**: `true`

**Type**: `true` | `false` | `object`

Whether to use `@vue/babel-preset-jsx` (Vue) or `@vue/babel-plugin-jsx` (Vue3) to support the use of `jsx`.

When an `object` is passed in, it is equivalent to setting it to `true` and the `object` will be used as an argument to `@vue/babel-preset-jsx` (Vue) or `@vue/babel-plugin-jsx` (Vue3).

### targets

**Default value**:

```js
{
  ios: '9',
  android: '5'
}
```

`@babel/preset-env` [targets](https://babeljs.io/docs/en/babel-preset-env#targets)configuration items.

### useBuiltIns

**Default value**: `false`

**Valid values**: `'entry'` | `'usage'` | `false`

#### useBuiltIns: 'entry'

:::info
**Advantages**: global complete polyfill, even if there is incompatible code in the dependencies in `node_modules`, it will run successfully.

**Disadvantages**: May introduce redundant code and affect global variables.
:::

When `'entry'` is passed, it sets the [useBuiltIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins) option of `@babel/preset-env` to `'entry'`, the [corejs]( https://babeljs.io/docs/en/babel-preset-env#corejs) option is set to `'3'`.

Developers need to introduce `core-js` in the entry file `app.js`.

```js title="src/app.js"
import "core-js"
```

Babel will introduce the corresponding `core-js` dependencies according to [targets](babel-config#targets). For example, the above code will be compiled as:

```js title="dist/app.js"
import "core-js/modules/es.string.pad-start";
import "core-js/modules/es.string.pad-end";
// ...
```

> Of course, since Taro sets `corejs` to `'3'` at this point, you can use `core-js@3` **the ability to manually bring in on-demand**, see [documentation](https://babeljs.io/docs/en/babel-preset-env#usebuiltins) for details

#### useBuiltIns: 'usage'

:::info
**Advantages**: Introduces on-demand and does not affect global variables.

**Disadvantages**: By default, dependencies in `node_modules` are not handled and you need to configure `babel-loader` manually.
:::

When passed in `'usage'`, it sets the [corejs](https://babeljs.io/docs/en/babel-plugin-transform-runtime#corejs) option of `@babel/plugin-transform-runtime` to `3 `.

> Note: When passing in `'usage'`, Taro does not use `@babel/preset-env`'s `useBuiltIns: 'usage'` but `@babel/plugin-transform-runtime`'s `corejs: 3`. The reason for this is: First, there is a conflict when both are set at the same time. Second, the latter does not affect global variables as opposed to the former.

#### useBuiltIns: false

When passed `false`, the [useBuiltIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins) option of `@babel/preset-env` will be set to `false`, which will not introduce the `core-js `.

### loose

**Default value**: `false`

Also the `loose` configuration item for `@babel/preset-env`, `@babel/plugin-proposal-class-properties`.

### debug

**Default value**: `false`

`@babel/preset-env` [debug](https://babeljs.io/docs/en/babel-preset-env#debug) configuration item.

### modules

**Default value**: `false`

`@babel/preset-env` [modules](https://babeljs.io/docs/en/babel-preset-env#modules) configuration item。

### spec

`@babel/preset-env` [spec](https://babeljs.io/docs/en/babel-preset-env#spec) configuration item。
  
### configPath

`@babel/preset-env` [configPath](https://babeljs.io/docs/en/babel-preset-env#configpath) configuration item。
  
### include

`@babel/preset-env` [include](https://babeljs.io/docs/en/babel-preset-env#include) configuration item。
  
### exclude

`@babel/preset-env` [exclude](https://babeljs.io/docs/en/babel-preset-env#exclude) configuration item。
  
### shippedProposals

`@babel/preset-env` [shippedProposals](https://babeljs.io/docs/en/babel-preset-env#shippedproposals) configuration item。
  
### forceAllTransforms

`@babel/preset-env` [forceAllTransforms](https://babeljs.io/docs/en/babel-preset-env#forcealltransforms) configuration item。


### decoratorsBeforeExport

`@babel/plugin-proposal-decorators` [decoratorsBeforeExport](https://babeljs.io/docs/en/babel-plugin-proposal-decorators#decoratorsbeforeexport) configuration item。

### decoratorsLegacy

**Default value**: `true`

`@babel/plugin-proposal-decorators` [lagacy](https://babeljs.io/docs/en/babel-plugin-proposal-decorators#legacy) configuration item。

### absoluteRuntime

**Default value**: Path to `@babel/plugin-transform-runtime` in the developer root `node_modules`.

**Type**:`string` 

`@babel/plugin-transform-runtime` [absoluteRuntime](https://babeljs.io/docs/en/babel-plugin-transform-runtime#absoluteruntime) configuration item。

### version

**Default value**: Version number of `@babel/plugin-transform-runtime` in `node_modules` in the developer's root directory.

**Type**:`string` 

`@babel/plugin-transform-runtime` [version](https://babeljs.io/docs/en/babel-plugin-transform-runtime#version) configuration item。
