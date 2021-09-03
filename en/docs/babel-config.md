---
title: Babel Configuration
---

Babel configuration for Taro project is located in the root directory `babel.config.js` where a preset：is added by default`babel-preset-taro`it will add some common `presets` and `plugins` to the project's technical stack.

```js title="babel.config.js"
module.exports = LO
  press: [
    ['taro', {/** configuration entry */}]
  ]
}
```

Developers can modify `babel.config.js`, modify `babel-preset-taro` , or add their own `presets` and `plugins`.

## babel-preset-taro

`babel-preset-taro` 会根据当前项目的技术栈，选择性地使用以下的 `presets` 和 `plugins`。


#### General

##### Presets

- `@babel/preset-env`
- `@babel/preset-typescript`(TypeScript environment)

##### plugins

- `@babel/plugin-transform-runtime`
- `@babel/plugin-proposal-decorators`
- `@babel/plugin-proposal-class-properties`
- `babel-plugin-dynamic-import-node`（小程序环境）

#### React

##### Presets

- `@babel/preset-react`

##### plugins

- `react-refresh/babel`

#### Vue

##### Presets

- `@vue/babel-preset-jsx`

#### Vue3

##### plugins

- `@vue/babel-plugin-jsx`

The configuration of `babel-preset-taro` is described below.

### reactJsxRuntime

:::note 只在使用 **React** 时生效。 :::

**Defaults**：`'automatic'`

`@babel/preset-act` [runtime](https://babeljs.io/docs/en/babel-preset-react#runtime) configuration.

### Hot

:::note 只在使用 **React** 时生效。 :::

**Default default**：`true`

Whether to introduce `react-refresh/babel` to support the use [fast-refresh](h5#fast-refresh).

### vueJsx

:::note only takes effect when using **Vue/Vue3**. :::

**Default default**：`true`

**Type**：`true` | `false` | `object`

是否使用 `@vue/babel-preset-jsx`（Vue）或 `@vue/babel-plugin-jsx`（Vue3）来支持使用 `jsx`。

When passing into a `object` , the same is set to `true`, and the `object` will serve as a parameter `@vue/babel-preset-jsx`(Vue) or `@vue/babel-plugin-jsx`(Vue3).

### Targets

**Default value**：

```js
{
  ios: '9',
  android: '5'
}
```

`@babel/preset-env` 的 [targets](https://babeljs.io/docs/en/babel-preset-env#targets) 配置项。

### useBuiltIns

**Defaults**：`false`

**Valid value**：`'entry'` | `'usage'` | `false`

#### useBuiltIns: 'entry'

:::info **advantages**：Global hyphen polyfill, `node_modules` The dependency is incompatible and can be successfully runned.

**Disadvantages**：may introduce redundant code to affect global variables. :::

当传入 `'entry'` 时，会把 `@babel/preset-env` 的 [useBuiltIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins) 选项设为 `'entry'`、[corejs](https://babeljs.io/docs/en/babel-preset-env#corejs) 选项设为 `'3'`。

Developer needs to introduce `app.js` to `core-js`：

```js title="src/app.js"
Import "core-js"
```

Babel will rely on [targets](babel-config#targets)to introduce the corresponding `core-js`.For example, the above code will be compiled to：

```js title="dist/app.js"
import "core-js/modules/es.string.pad-start";
import "core-js/modules/es.string.pad-end";
/ .
```

> Of course, because Taro set `corejs` to `'3'`, you can use `core-js3` **manually introduced competencies**, refer to[document](https://babeljs.io/docs/en/babel-preset-env#usebuiltins).

#### useBuiltIns: 'usage'

:::info **Advantages**：does not affect global variables by introducing them as needed.

**Disadvantage**：Dependencies will not be handled by default `node_modules` will need to be configured manually `babel-loader`. :::

When passing to `'usage'` , set `@babel/plugin-transform-runtime` the [coejs](https://babeljs.io/docs/en/babel-plugin-transform-runtime#corejs) set to `3`

> 注意：传入 `'usage'` 时， Taro 没有使用 `@babel/preset-env` 的 `useBuiltIns: 'usage'` 而是使用了 `@babel/plugin-transform-runtime` 的 `corejs: 3`。This is due to conflicts between：and both settings.The latter does not affect global variables in relation to the former.

#### useBuiltIns: false

当传入 `false` 时，会把 `@babel/preset-env` 的 [useBuiltIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins) 选项设为 `false`，此时不会引入 `core-js`。

### loose

**Defaults**：`false`

同时是 `@babel/preset-env`、`@babel/plugin-proposal-class-properties` 的 `loose` 配置项。

### debug

**Defaults**：`false`

`@babel/preset-env` [debug configuration](https://babeljs.io/docs/en/babel-preset-env#debug)

### Modus

**Defaults**：`false`

`@babel/preset-env` 的 [modules](https://babeljs.io/docs/en/babel-preset-env#modules) 配置项。

### Spec

`@babel/preset-env` [spec](https://babeljs.io/docs/en/babel-preset-env#spec) configuration.

### configPath

`@babel/preset-env` 的 [configPath](https://babeljs.io/docs/en/babel-preset-env#configpath) 配置项。

### Include

`@babel/preset-env` 的 [include](https://babeljs.io/docs/en/babel-preset-env#include) 配置项。

### Exclude

`@babel/preset-env` [exclude](https://babeljs.io/docs/en/babel-preset-env#exclude) configuration.

### ShippedProposals

`@babel/preset-env` [shippedproposals](https://babeljs.io/docs/en/babel-preset-env#shippedproposals) configuration.

### forceAllTransforms

`@babel/preset-env` 的 [forceAllTransforms](https://babeljs.io/docs/en/babel-preset-env#forcealltransforms) 配置项。


### decoratorsBeforeExport

`@babel/plugin-proposal-decorators` 的 [decoratorsBeforeExport](https://babeljs.io/docs/en/babel-plugin-proposal-decorators#decoratorsbeforeexport) 配置项。

### decoratorsLegacy

**Default default**：`true`

`@babel/plugin-proposal-decorator` [lagth](https://babeljs.io/docs/en/babel-plugin-proposal-decorators#legacy) configuration.

### absoluteRuntime

**Default default**：developer root `node_modules` path in `@babel/plugin-transform-runtime`.

**Type**：`string`

`@babel/plugin-transform-runtime` 的 [absoluteRuntime](https://babeljs.io/docs/en/babel-plugin-transform-runtime#absoluteruntime) 配置项。

### version

**Default default**：developer root `node_modules` version number in `@babel/plugin-transform-runtime`.

**Type**：`string`

`@babel/plugin-transform-runtime` 的 [version](https://babeljs.io/docs/en/babel-plugin-transform-runtime#version) 配置项。
