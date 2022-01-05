---
title: Taro 仓库概览
---

## 仓库组成

以下列表介绍了 Taro 由哪些 NPM 包所组成，以及每个包的功能。

### 基础

| 路径 | 描述 |
| ------------- |:------------- |
| `@tarojs/cli` | CLI 工具 |
| `@tarojs/service` | 插件化内核  |
| `@tarojs/taro-loader` | Webpack loaders |
| `@tarojs/helper` | 工具库，主要供 CLI、编译时使用 |
| `@tarojs/runner-utils` | 工具库，主要供小程序、H5 的编译工具使用 |
| `@tarojs/shared` |  工具库，主要供运行时使用 |
| `@tarojs/taro` | 暴露各端所需要的 Taro 对象 |
| `@tarojs/api` | 和各端相关的 Taro API |
| `babel-preset-taro` | Babel preset |
| `eslint-config-taro` | ESLint 规则 |
| `postcss-pxtransform` | PostCSS 插件，转换 `px` 为各端的自适应尺寸单位 |

### 小程序

| 路径 | 描述 |
| ------------- |:------------- |
| `@tarojs/mini-runner` | 小程序编译工具，主要用于设置、调用 Webpack |
| `@tarojs/react` | 基于 `react-reconciler` 的小程序专用 React 渲染器 |
| `@tarojs/runtime` | 小程序运行时适配器核心 |
| `@tarojs/plugin-platform-weapp` | 微信小程序插件 |
| `@tarojs/plugin-platform-alipay` | 支付宝小程序插件 |
| `@tarojs/plugin-platform-swan` | 百度小程序插件 |
| `@tarojs/plugin-platform-tt` | 字节跳动小程序插件 |
| `@tarojs/plugin-platform-qq` | qq 小程序插件 |
| `@tarojs/plugin-platform-jd` | 京东小程序插件 |
| `@tarojs/plugin-html` | 支持使用 HTML 标签的插件 |
| `postcss-html-transform` | PostCSS 插件，用于处理 HTML 标签的类名 |
| `@tarojs/plugin-react-devtools` | 支持使用 React DevTools 的插件 |
| `@tarojs/extend` | 类似 jQuery 的库 |

### H5

| 路径 | 描述 |
| ------------- |:------------- |
| `@tarojs/webpack-runner` | H5 编译工具，主要用于设置、调用 Webpack |
| `@tarojs/router` | H5 路由 |
| `@tarojs/taro-h5` | H5 端根据微信小程序规范实现的 API |
| `@tarojs/components` | H5 组件库（Web Components 版本） |
| `@tarojs/components-react` | H5 组件库（React 版本） |
| `babel-plugin-transform-taroapi` | Babel 插件，让 API 可以被 `tree-shaking` |
| `postcss-plugin-constparse` | PostCSS 插件，用于处理 `tabbar` 的高度 |

### RN

| 路径 | 描述 |
| ------------- |:------------- |
| `@tarojs/components-rn` | RN 组件库 |
| `@tarojs/rn-runner` | RN 编译工具，主要用于设置、调用 metro |
| `@tarojs/rn-style-transformer` | RN 样式转换工具，让 RN 支持sass、less、stylus、postcss |
| `@tarojs/rn-supporter` | RN 基础 metro 配置 |
| `@tarojs/rn-transformer` | RN 应用入口及页面转换工具，让 RN 支持 Taro 定义的 app 及 page config |
| `@tarojs/router-rn` | RN 路由 |
| `@tarojs/runtime-rn` | RN 运行时封装 |
| `@tarojs/taro-rn` | RN 端根据微信小程序规范实现的 API |
| `babel-plugin-transform-react-jsx-to-rn-stylesheet` | Babel 插件，让 jsx 支持 className 属性 |
| `taro-css-to-react-native` | 将 css 转为 RN 的 stylesheet |

### 其它

| 路径 | 描述 |
| ------------- |:------------- |
| `@tarojs/taroize` | 小程序转 Taro 的编译器  |
| `@tarojs/with-weapp` | 小程序转 Taro 的运行时适配器  |

## 如何开发

### 环境准备

:::note
需要保证你的 Node.js 版本大于 `8`（建议安装 `10.5` 以上版本）
:::

首先把 Taro 仓库 fork 一份到自己的 Github，然后把项目 clone 到本地，并切换到 `next` 分支。

然后依次运行以下命令：

```bash
$ yarn
$ yarn run bootstrap
$ yarn build
```

运行完上述命令后，环境已经准备好，此时可以新拉一条分支进行开发。

### 代码风格

* `JavaScript`：遵从 [JavaScript Standard Style](https://github.com/standard/standard)，详情请看根目录的 `.eslintrc.js`。
* `TypeScript`：遵从基于 [JavaScript Standard Style](https://github.com/standard/standard) 的变种，详情请看根目录的 `.eslintrc.js` 和相关包目录下的 `tsconfig.json`。
* 样式：遵循相关包目录下的 `.stylelintrc` 风格。

### 调试

调试过程中，一般会使用 [npm link](https://docs.npmjs.com/cli/v7/commands/npm-link/) 命令，把需要调试的包软链到一个测试项目中。

调试**编译时**的代码，请参考 [《单步调测》](./debug-config)。

调试**运行时**的代码，可以直接断点调试。

### 单元测试

目前这些包配备了单元测试：

- `babel-preset-taro`
- `@tarojs/cli`
- `@tarojs/components`
- `@tarojs/react`
- `@tarojs/webpack-runner`
- `@tarojs/mini-runner`
- `@tarojs/runtime`
- `@tarojs/taro-rn`
- `@tarojs/components-rn`

开发者在修改上述包后，请务必运行 `lerna run test:ci --scope [包名]`，检查测试用例是否都能通过。

同时，在开发一些重要功能后，也请抽时间补上对应的测试用例。

:::note
注意：`@tarojs/mini-runner`、`@tarojs/webpack-runner` 使用了 `snapshot`（测试结果快照），在修改这两个包或其它一些包时，有可能导致这些快照失效，从而通过不了测试。当你修改了这两个包、或 CI 提示这两个包的测试用例出错时，请运行 `lerna run updateSnapshot --scope [包名]` 更新 snapshot 后重新提交。
:::

### commit 规范

在输入 `commit message` 的时候请务必遵从 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153) 规范。

### 文档

当提交涉及新增特性、Breaking Changes 或重要修改时，请新增、修改对应的文档。

关于文档的开发请阅读[《修改文档》](./CONTRIBUTING#修改文档)。

## 提交 Pull Request

> 如果对 PR（Pull Request）不了解，请阅读 [《About Pull Requests》](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)

完成开发后，推送到自己的 Taro 仓库，就可以准备提交 Pull Request 了。

提交 PR 前请阅读以下注意事项：

1. 保证 `npm run build` 能够编译成功。
2. 保证代码能通过 ESLint 测试。
3. 当相关包含有 `npm test:ci` 命令时，必须保证所有测试用例都能够通过；
4. 当相关包有测试用例时，请给你提交的代码也添加相应的测试用例；
5. 保证 commit 信息需要遵循 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)。
6. 如果提交到代码非常多或功能复杂，可以把 PR 分成几个 commit 一起提交。我们在合并时会会根据情况 squash。
7. PR 作者可以选择加入到 Taro 开发者微信群，方便合并 PR 和技术交流。
