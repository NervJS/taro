我们非常欢迎社区的开发者向 Taro 做出贡献，我们的共建倡议[《Taro 邀你加入社区共建》](https://github.com/NervJS/taro/issues/4714)。

- 分享你的案例，只需提交小程序码、二维码，你可以提交到 [taro-user-cases](https://github.com/NervJS/taro-user-cases)
- 分享你的 “轮子” （SDK、组件、UI、项目）你可以提交到 [物料市场](https://taro-ext.jd.com)
- 分享你的经验（开源项目、教程、文章）你可以提交到 [wesome-taro](https://github.com/NervJS/awesome-taro) 或者给 「Taro社区」公众号投稿


在代码提交贡献之前，你需要花一些时间阅读以下内容，保证贡献是符合规范并且能帮助到社区。

## Taro 组成
| NPM 包           |   描述 |
| ------------- |:------------- |
| [`babel-preset-taro`](https://www.npmjs.com/package/babel-preset-taro)      |  给 Taro 项目使用的 babel preset |
| [`@tarojs/taro`](https://www.npmjs.com/package/@tarojs/taro)      |  暴露给应用开发者的 Taro 核心 API  |
| [`@tarojs/shared`](https://www.npmjs.com/package/@tarojs/shared)      |  Taro 内部使用的 utils  |
| [`@tarojs/api`](https://www.npmjs.com/package/@tarojs/api)      |  暴露给 @tarojs/taro 的所有端的公有 API  |
| [`@tarojs/taro-h5`](https://www.npmjs.com/package/@tarojs/taro-h5) |  暴露给 @tarojs/taro 的 H5 端 API  |
| [`@tarojs/router`](https://www.npmjs.com/package/@tarojs/router) |  Taro H5 路由  |
| [`@tarojs/react`](https://www.npmjs.com/package/@tarojs/react) | 基于 react-reconciler 的小程序专用 React 渲染器  |
| [`@tarojs/cli`](https://www.npmjs.com/package/@tarojs/cli) | Taro 开发工具   |
| [`@tarojs/extend`](https://www.npmjs.com/package/@tarojs/extend) | Taro 扩展，包含 jQuery API 等   |
| [`@tarojs/helper`](https://www.npmjs.com/package/@tarojs/helper) | 内部给 CLI 和 runner 使用辅助方法集  |
| [`@tarojs/service`](https://www.npmjs.com/package/@tarojs/service) | Taro 插件化内核  |
| [`@tarojs/taro-loader`](https://www.npmjs.com/package/@tarojs/taro-loader) | 露给 @tarojs/mini-runner 和 @tarojs/webpack-runner 使用的 Webpack loader  |
| [`@tarojs/runner-utils`](https://www.npmjs.com/package/@tarojs/runner-utils) | 暴露给 @tarojs/mini-runner 和 @tarojs/webpack-runner 的公用工具函数  |
| [`@tarojs/webpack-runner`](https://www.npmjs.com/package/@tarojs/webpack-runner) |  Taro H5 端 Webpack 打包编译工具  |
| [`@tarojs/mini-runner`](https://www.npmjs.com/package/@tarojs/mini-runner) |  Taro 小程序 端 Webpack 打包编译工具  |
| [`@tarojs/components`](https://www.npmjs.com/package/@tarojs/components) | Taro 标准组件库，H5 版 |
| [`@tarojs/taroize`](https://www.npmjs.com/package/@tarojs/taroize) | Taro 小程序反向编译器  |
| [`@tarojs/with-weapp`](https://www.npmjs.com/package/@tarojs/with-weapp) | 反向转换的运行时适配器  |
| [`eslint-config-taro`](https://www.npmjs.com/package/eslint-config-taro)      |  Taro ESLint 规则  |
| [`eslint-plugin-taro`](https://www.npmjs.com/package/eslint-plugin-taro)      |  Taro ESLint 插件  |


## Issue 报告指南

如果提交的是 Bug 报告，请点击 [`New issue`](https://nervjs.github.io/taro-issue-helper/) 。

如果你想为 Taro 实现一个重要功能，需要先撰写 RFC 文档，按照 Taro 的[ RFC 机制](https://github.com/NervJS/taro-rfcs)进行操作，在经过社区讨论完善后才可以进行代码的提交。

## 开发配置

你需要保证你的 Node.js 版本大于 8，把仓库 Clone 到本地。运行以下命令：

```bash
$ npm install # or yarn
$ npm run bootstrap
$ npm run build
```

## 提交 commit

整个 Taro 仓库遵从 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)，在输入 commit message 的时候请务必遵从此规范。

## 代码风格

* `JavaScript`：JavaScript 风格遵从 [JavaScript Standard Style](https://github.com/standard/standard)。
* `TypeScript`：TypeScript 风格也是 [JavaScript Standard Style](https://github.com/standard/standard) 的变种，详情请看相关包目录下的 `tslint.json` 和 `tsconfig.json`。
* 样式：遵循相关包目录下的 `.stylelintrc` 风格。

## Pull Request 指南

1. 务必保证 `npm run build` 能够编译成功；
2. 务必保证提交到代码遵循相关包中的 `.eslintrc`, `.tslintrc`, `.stylelintrc` 所规定的规范；
3. 当相关包的 `package.json` 含有 `npm test` 命令时，必须保证所有测试用例都需要通过；
4. 当相关包有测试用例时，请给你提交的代码也添加相应的测试用例；
5. 提交代码 commit 时，commit 信息需要遵循 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)。
6. 如果提交到代码非常多或功能复杂，可以把 PR 分成几个 commit 一起提交。我们在合并时会会根据情况 squash。

## Credits

感谢以下所有给 Taro 贡献过代码的开发者：

<a href="https://github.com/NervJS/taro/graphs/contributors"><img src="https://opencollective.com/taro/contributors.svg?width=890&button=false" /></a>