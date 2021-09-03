---
title: Directory Structure
---

## Directory Structure

    ├── dist                        Compilation results directory
    |
    ├── config                      Project compilation configuration directory
    |   ├── index.js                Default Configuration
    |   ├── dev.js                  Development environment configuration
    |   └── prod.js                 Production environment configuration
    |
    ├── src                         Source directory
    |   ├── pages                   Page file directory
    |   |   └── index               index Page directory
    |   |       ├── index.js        index page
    |   |       ├── index.css       index page style
    |   |       └── index.config.js index page configuration
    |   |
    |   ├── app.js                  Project entry
    |   ├── app.css                 Project general style
    |   └── app.config.js           Project entry configuration
    |
    ├── project.config.json         Wechat mini program configuration   
    ├── project.tt.json             ByteDance  Mini Program configuration 
    ├── project.swan.json           Baidu smart program 
    ├── project.qq.json             QQ Mini Program
    |
    ├── babel.config.js             Babel configuration
    ├── tsconfig.json               TypeScript configuration
    ├── .eslintrc                   ESLint configuration
    |
    └── package.json

## Compile Configuration

    └── config                      项目编译配置目录
        ├── index.js                默认配置
        ├── dev.js                  开发环境配置
        └── prod.js                 生产环境配置

For configuring the build configuration of Taro projects, modifying Webpack configuration, etc., please refer to[compile configuration](./config)和[compile configuration details](./config-detail)。

## Source Code

Like the mini program specification, Taro contains an `app` that describes the overall application and multiple `page`s that describe their respective pages.

### app

    └── src                         源码目录
        ├── app.js                  项目入口文件
        ├── app.css                 项目总通用样式
        └── app.config.js           项目入口配置

The mini program contains the following files:

| File          | Required | Funtions                          |
|:------------- |:-------- |:--------------------------------- |
| app.js        | yes      | mini program entry                |
| app.css       | no       | mini program global style         |
| app.config.js | yes      | mini program global configuration |

Eamples are available for viewing according to the framework of your choice：[React](./react-overall), [Vue](./vue-overall), [Vue3](./vue3), [Nerv](./nerv)。

#### 1. Mini Program Global Configuration

`app.config.js` Global configuration file corresponding to the mini program specification `app.json`，The advantage is that it is JS files that can write logic.配置以**微信小程序的全局配置**为规范。详情请参考[全局配置](./app-config)。

#### 2. Mini Program Global Style

Mini Program global style files can be introduced via the ES6 specification's `import`.

```js title="app.js"
import './app.css';
```

### page

    └── src                         源码目录
        └── pages                   页面文件目录
            └── index               index 页面目录
                ├── index.js        index 页面逻辑
                ├── index.css       index 页面样式
                └── index.config.js index 页面配置

A mini program page consists of three files:

| File           | Required | Funtions           |
|:-------------- |:-------- |:------------------ |
| page.js        | yes      | page entry         |
| page.css       | no       | page style         |
| page.config.js | no       | page configuration |

#### 1. Page Configuration

`page.config.js` 对应小程序规范的页面配置文件 `page.json`，优势在于它是 JS 文件可以编写逻辑。配置以**微信小程序的页面配置**为规范。详情请参考[页面配置](./page-config)。

#### 2. Page Style

Page style files can be introduced via the ES6 specification `import`.

```js title="pages/index/index.js"
import './index.css';
```

#### 3. Page Routing

Page routing is consistent with the mini program  specification and needs to be configured in the mini program global configuration `app.config.js`.

## Project Configuration

    <code>page.config.js The page configuration file corresponding to the mini program specification page.jsonThe advantage is that it is js configuration to ** Wechat Mini Program page configuration** as specification。Detail reference [page configuration](./page-config)。
    </code>

Each mini program platform has its own project profile, and Taro supports adapting them. For details, please refer to[project configuration](./project-config)。

## Babel Configuration

    └── babel.config.js             Babel 配置

Babel configuration reference [Github](https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/index.js)

## ESLint Configuration

    └── .eslintrc                   ESLint 配置

ESLint configuration reference [Github](https://github.com/NervJS/taro/blob/next/packages/eslint-plugin-taro/index.js)
