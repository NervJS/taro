---
title: Directory Structure
---

## Project Directory Structure

    ├── dist                        编译结果目录
    |
    ├── config                      项目编译配置目录
    |   ├── index.js                默认配置
    |   ├── dev.js                  开发环境配置
    |   └── prod.js                 生产环境配置
    |
    ├── src                         源码目录
    |   ├── pages                   页面文件目录
    |   |   └── index               index 页面目录
    |   |       ├── index.js        index 页面逻辑
    |   |       ├── index.css       index 页面样式
    |   |       └── index.config.js index 页面配置
    |   |
    |   ├── app.js                  项目入口文件
    |   ├── app.css                 项目总通用样式
    |   └── app.config.js           项目入口配置
    |
    ├── project.config.json         微信小程序项目配置 project.config.json
    ├── project.tt.json             字节跳动小程序项目配置 project.config.json
    ├── project.swan.json           百度小程序项目配置 project.swan.json
    ├── project.qq.json             QQ 小程序项目配置 project.config.json
    |
    ├── babel.config.js             Babel 配置
    ├── tsconfig.json               TypeScript 配置
    ├── .eslintrc                   ESLint 配置
    |
    └── package.json

## Build Configuration

    The configuration directory for the config project compilation
        <-> index.js Default configuration
        <-> dev.js Development Environment Configuration
        -> prod.js Production Environment Config

To configure Taro project compilation, modify Webpack configurations, etc. refer to[to compile configuration](./config)and[to compile configuration details](./config-detail).

## Source Organization

Like applet specifications, Taro contains a `app that describes the overall program` and multiple pages describing the `page`.

### App

    How to put them in the directory
        to the --app.js project entry file
        - app.css items in general general style

小程序的主体由下面三个文件组成：

| Documentation | Required | Role                        |
|:------------- |:-------- |:--------------------------- |
| app.js        | Yes      | Applet Entry Logic          |
| app.css       | No       | Applet Global Style         |
| app.config.js | Yes      | Applet Global Configuration |

Code examples should be viewed on the basis of the framework you selected：[React](./react-overall), [Vue](./vue-overall), [Vue3](./vue3), [Nerv](./nerv).

#### Global configuration of applets

`app.config.js` Global profile for small program specifications `app.json`, the advantage is that it is a JS file that can write logic.Config as global configuration for**micromessaging applets**For further information, refer to[global configuration](./app-config).

#### Global style of the applet

The applet global style file can be imported via ES6 specified `import`.

```js title="app.js"
Import './app.css';
```

### page

    The directory of --src source
        can be found in the directory -- pages file directory
            should be included in the directory -- index page contents
                -> index. s Index Page Logic
                ss index page style
                -> index. onfig.js index page configuration

A applet page consists of three files below：

| Documentation  | Required | Role               |
|:-------------- |:-------- |:------------------ |
| page.js        | Yes      | Page Entry Logic   |
| page.css       | No       | Page Style         |
| page.config.js | No       | Page Configuration |

#### Page configuration

`page.config.js` Page Profile for Applet Normalization `page.json`, the advantage is that it is a JS file that can write logic.Configure the configuration of the**micromessage applet to specify**Please refer to[page configuration](./page-config) for details.

#### Page styles

Page style file can be imported via ES6 specified `import`.

```js title="pages/index/index.js"
Import '.index.css';
```

#### Page routes

页面路由与小程序规范一致，需要在小程序全局配置 `app.config.js` 中进行配置。

## Project Configuration

    Website - Project.config.json micromessaging project configuration

Each class of applet platforms has their own project profiles, and Taro supports matching them, refer to[project configurations](./project-config)

## Babel Configuration

    N/A - Babel.config.js Babel configuration

Please refer to [Babel configuration](./babel-config)

## ESLint Configuration

    Website - - .eslintrc ESLint configuration

ESLint configuration reference [Github](https://github.com/NervJS/taro/blob/next/packages/eslint-plugin-taro/index.js)
