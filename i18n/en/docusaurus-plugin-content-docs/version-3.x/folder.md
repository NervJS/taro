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

For configuring the build configuration of Taro projects, modifying Webpack configuration, etc., please refer to[compile configuration](./config)和[compile configuration details](./config-detail)。

## Source Code

Like the mini program specification, Taro contains an `app` that describes the overall application and multiple `page`s that describe their respective pages.

### app

The mini program contains the following files:

| File | Required | Funtions |
| :-- | :-- | :-- |
| app.js | yes | mini program entry |
| app.css | no | mini program global style |
| app.config.js | yes | mini program global configuration |

Eamples are available for viewing according to the framework of your choice：[React](./react), [Vue](./vue), [Vue3](./vue3), [Nerv](./nerv)。

#### 1. Mini Program Global Configuration

`app.config.js` Global configuration file corresponding to the mini program specification `app.json`，The advantage is that it is JS files that can write logic. The configuration starts with ** global configuration of WeChat Mini Progam**。Detail reference [Global Configuration](./app-config)。

#### 2. Mini Program Global Style

Mini Program global style files can be introduced via the ES6 specification's `import`.

```js title="app.js"
import './app.css';
```

### page

A mini program page consists of four files:

| File | Required | Funtions |
| :-- | :-- | :-- |
| page.js | yes | page entry |
| page.css | no | page style |
| page.config.js | no | page configuration |

#### 1. Page Configuration

`page.config.js` The page configuration file corresponding to the mini program specification `page.json`The advantage is that it is js configuration to ** Wechat Mini Program page configuration** as specification。Detail reference [page configuration](./page-config)。

#### 2. Page Style

Page style files can be introduced via the ES6 specification `import`.

```js title="pages/index/index.js"
import './index.css';
```

#### 3. Page Routing

Page routing is consistent with the mini program  specification and needs to be configured in the mini program global configuration `app.config.js`.

## Project Configuration

Each mini program platform has its own project profile, and Taro supports adapting them. For details, please refer to[project configuration](./project-config)。

## Babel Configuration

Babel configuration reference [Github](https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/index.js)

## ESLint Configuration

ESLint configuration reference [Github](https://github.com/NervJS/taro/blob/next/packages/eslint-plugin-taro/index.js)
