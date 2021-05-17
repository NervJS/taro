We are happy to welcome developers from the community to contribute to Taro [《Taro invites you to join in community building》](https://github.com/NervJS/taro/issues/4714)。

- Submit an RFC or view the relevant RFC, you can view [taro-rfcs repository](https://github.com/NervJS/taro-rfcs)
- Share your case, just submit the mini program QR code, you can submit to [taro-user-cases](https://github.com/NervJS/taro-user-cases)
- Share your SDK, components , UI libary, project, you can submit to [Examples](https://taro-ext.jd.com)
- Share your experience (open source projects, tutorials, articles) you can submit to [awesome-taro](https://github.com/NervJS/awesome-taro) Or contribute to the 「Taro Community」Official Accounts


Before submitting your code for contribution, you need to spend some time reading the following to ensure that the contribution is in compliance with the specification and will help the community.

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
| [`@tarojs/helper`](https://www.npmjs.com/package/@tarojs/helper) | Internal use of auxiliary method sets for CLI and runner  |
| [`@tarojs/service`](https://www.npmjs.com/package/@tarojs/service) | Taro Plugin Kernel  |
| [`@tarojs/taro-loader`](https://www.npmjs.com/package/@tarojs/taro-loader) | Webpack loader exposed for use by @tarojs/mini-runner and @tarojs/webpack-runner |
| [`@tarojs/runner-utils`](https://www.npmjs.com/package/@tarojs/runner-utils) | Common tool functions exposed to @tarojs/mini-runner and @tarojs/webpack-runner  |
| [`@tarojs/webpack-runner`](https://www.npmjs.com/package/@tarojs/webpack-runner) |  Taro H5 Webpack package builder |
| [`@tarojs/mini-runner`](https://www.npmjs.com/package/@tarojs/mini-runner) |  Taro mini program Webpack package tools  |
| [`@tarojs/components`](https://www.npmjs.com/package/@tarojs/components) | Taro H5 Standard  component library |
| [`@tarojs/taroize`](https://www.npmjs.com/package/@tarojs/taroize) | Taro Mini Program Reverse compiler  |
| [`@tarojs/with-weapp`](https://www.npmjs.com/package/@tarojs/with-weapp) | Runtime adapter for reverse conversion  |
| [`eslint-config-taro`](https://www.npmjs.com/package/eslint-config-taro)      |  Taro ESLint Rules  |
| [`eslint-plugin-taro`](https://www.npmjs.com/package/eslint-plugin-taro)      |  Taro ESLint Plugin  |


## Issue Guides

If you are submitting a bug report, please click [`New issue`](https://nervjs.github.io/taro-issue-helper/) 。

If you want to implement an important feature for Taro, you need to write an RFC document first, following Taro's[ RFC System](https://github.com/NervJS/taro-rfcs)，The code can be submitted only after it has been discussed and refined by the community.

## Develop Configuration

You need to make sure your Node.js version is greater than 8 to clone the repository locally. Run the following command.

```bash
$ npm install # or yarn
$ npm run bootstrap
$ npm run build
```

## Submit Code

Taro repository adheres to the [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)，So be sure to follow this when entering your commit message, please make sure to follow this convention when publish.

## Code Style

* `JavaScript`：JavaScript style Follow [JavaScript Standard Style](https://github.com/standard/standard)。
* `TypeScript`：TypeScript style Follow [JavaScript Standard Style](https://github.com/standard/See `tslint.json` and `tsconfig.json` in the relevant package directory for details.
* Styles：follow the `.stylelintrc` style in the relevant package directory.

## Pull Request Guides

1. Make sure that `npm run build` compiles successfully;
2. Be sure to submit code that follows the specifications specified in `.eslintrc`, `.tslintrc`, `.stylelintrc` in the relevant package;
3. When the `package.json` of the package in question contains the `npm test` command, it must be ensured that all test cases are required to pass;
4. When a test case is available for the package in question, add the corresponding test case to your submitted code as well;
5. When contribute Code, the commit message needs to follow [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)。
6. If the contribute code is very complex, you can split the PR into several commits. We will squash when merging.

## Credits

Thanks to all the developers who have contributed code to Taro：

<a href="https://github.com/NervJS/taro/graphs/contributors"><img src="https://opencollective.com/taro/contributors.svg?width=890&button=false" /></a>
