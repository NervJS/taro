---
title: WeChat Mini Program Convert to Taro
---

Taro can convert **native WeChat mini program applications into Taro projects**, thus making the project a multi-terminated application.

The converted code is highly readable and can continue to be used for secondary development using **React** (conversion to **Vue** is supported in the future).


### Reverse conversion steps

1. Install the Taro command line tool.

```bash
$ npm i -g @tarojs/cli
```

2. Run the `convert` command in the root directory of the WeChat mini program project to convert.

```bash
# The converted code is stored in the `taroConvert` folder in the root directory
$ taro convert
```

3. Go to the `taroConvert` directory and install the dependencies on.

```bash
$ cd taroConvert
$ npm install
```

4. Run the `build` command to compile the project to any platform.

```bash
$ taro build --type [platform]
```
