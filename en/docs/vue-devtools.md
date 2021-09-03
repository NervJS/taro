---
title: Vue DevTools
---

:::note Taro v3.3.2 is supported.

Vue2 is not supported at this time. :::

When developing mini program you can use [Vue DevTools](https://devtools.vuejs.org/guide/installation.html)。

## Usage

### 1. Installation

Install the Taro plugin in your project `@tarojs/plugin-vue-devtools`：

```sh
$ yarn add --dev @tarojs/plugin-vue-devtools
```

### 2. Configuring the Taro Plugin

Configure the Taro compile configuration to use `@tarojs/plugin-vue-devtools`：

```js title="config/dev.js"
config = {
  plugins: [
    '@tarojs/plugin-vue-devtools'
  ],
  // ... }
```

### 3. Compile project

```sh
$ taro build --type weapp --watch
```

## Plugin Parameters

The plugin `@tarojs/plugin-vue-devtools` has the following parameters.

### enabled

`boolean`

Default value: `true`

Controls whether to connect to `vue-devtools`, which will inject backend code into the developer's app when turned on.

### port

`number`

Default value: `8098`

The Websocket port used by Vue DevTools.

## Caution

- The version of `vue-devtools` is forcibly locked, and the code of the `@tarojs/plugin-vue-devtools` plugin needs to be modified to update the version.

In addition, the current support for devtools is not comprehensive enough, some features need to be magic backend for the mini program environment to achieve, welcome to build ~

- Support element highlighting.

## Detailed Design

For detailed design, see [RFC](https://github.com/NervJS/taro-rfcs/blob/master/rfcs/0006-vue-devtools.md)。
