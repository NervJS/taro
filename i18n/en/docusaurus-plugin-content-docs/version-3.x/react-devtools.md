---
title: React DevTools
---

:::note
Taro v3.3.1 started support.
:::

When developing mini program you can use [React DevTools](https://github.com/facebook/react/blob/main/packages/react-devtools/README.md)。

## Usage

### 1. Installation

Install the Taro plugin in your project `@tarojs/plugin-react-devtools`：

```sh
$ yarn add --dev @tarojs/plugin-react-devtools
```

### 2. Configuring the Taro Plugin

Configure the Taro compile configuration to use `@tarojs/plugin-react-devtools`：

```js title="config/dev.js"
config = {
  plugins: [
    '@tarojs/plugin-react-devtools'
  ],
  // ...
}
```

### 3. Compile project

```sh
$ taro build --type weapp --watch
```

## Plugin Parameters

The plugin `@tarojs/plugin-react-devtools` has the following parameters.

### enabled

`boolean`

Default value: `true`.

Controls whether to connect to `react-devtools`, which will inject backend code into the developer's app when enabled.

### port

`number`

Default value: `8097`

The Websocket port used by React DevTools.

## Caution

- The version of `react-devtools` is forcibly locked, and updating it requires modifying the code of the `@tarojs/plugin-react-devtools` plugin.
- [To identify custom hooks](https://github.com/facebook/react/blob/main/packages/react-devtools/OVERVIEW.md#inspecting-hooks), backend performs a function on some developers need to be aware of any side effects of the code.

In addition, the current support for devtools is not comprehensive enough, some features need to be modified for the applet environment magic backend to achieve, welcome to build ~

- Support element highlighting.
- Record `filters` changes in the `storage` of the mini program.

## Detail Design

For detailed design, see [RFC](https://github.com/NervJS/taro-rfcs/blob/master/rfcs/0005-react-devtools.md)。
