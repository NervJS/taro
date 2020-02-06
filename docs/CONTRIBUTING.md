我们非常欢迎社区的开发者向 Taro 做出贡献。在提交贡献之前，请花一些时间阅读以下内容，保证贡献是符合规范并且能帮助到社区。

## Taro 组成

| NPM 包                                                                             | 描述                             |
| ---------------------------------------------------------------------------------- | :------------------------------- |
| [`@tarojs/taro`](https://www.npmjs.com/package/@tarojs/taro)                       | Taro 运行时框架                  |
| [`@tarojs/taro-h5`](https://www.npmjs.com/package/@tarojs/taro-h5)                 | Taro H5 运行时框架               |
| [`@tarojs/taro-rn`](https://www.npmjs.com/package/@tarojs/taro-rn)                 | Taro React Native 运行时框架     |
| [`@tarojs/taro-weapp`](https://www.npmjs.com/package/@tarojs/taro-weapp)           | Taro 微信小程序运行时框架        |
| [`@tarojs/taro-swan`](https://www.npmjs.com/package/@tarojs/taro-swan)             | Taro 百度智能小程序运行时框架    |
| [`@tarojs/taro-tt`](https://www.npmjs.com/package/@tarojs/taro-tt)                 | Taro 字节跳动小程序运行时框架    |
| [`@tarojs/taro-alipay`](https://www.npmjs.com/package/@tarojs/taro-alipay)         | Taro 支付宝小程序运行时框架      |
| [`@tarojs/taro-qq`](https://www.npmjs.com/package/@tarojs/taro-qq)                 | Taro QQ 小程序运行时框架         |
| [`@tarojs/taro-jd`](https://www.npmjs.com/package/@tarojs/taro-jd)                 | Taro 京东小程序运行时框架        |
| [`@tarojs/taro-quickapp`](https://www.npmjs.com/package/@tarojs/taro-quiciapp)     | Taro 快应用 运行时框架           |
| [`@tarojs/redux`](https://www.npmjs.com/package/@tarojs/redux)                     | Taro 小程序 Redux 支持           |
| [`@tarojs/redux-h5`](https://www.npmjs.com/package/@tarojs/redux-h5)               | Taro H5 Redux 支持               |
| [`@tarojs/redux-rn`](https://www.npmjs.com/package/@tarojs/redux-rn)               | Taro React Native Redux 支持     |
| [`@tarojs/mobx-common`](https://www.npmjs.com/package/@tarojs/mobx-common)         | Taro MobX 公共模块               |
| [`@tarojs/mobx`](https://www.npmjs.com/package/@tarojs/mobx)                       | Taro 小程序 MobX 支持            |
| [`@tarojs/mobx-h5`](https://www.npmjs.com/package/@tarojs/mobx-h5)                 | Taro H5 MobX 支持                |
| [`@tarojs/mobx-rn`](https://www.npmjs.com/package/@tarojs/mobx-rn)                 | Taro React Native MobX 支持      |
| [`@tarojs/router`](https://www.npmjs.com/package/@tarojs/router)                   | Taro H5 路由                     |
| [`@tarojs/async-await`](https://www.npmjs.com/package/@tarojs/async-await)         | 支持使用 async/await 语法        |
| [`@tarojs/cli`](https://www.npmjs.com/package/@tarojs/cli)                         | Taro 开发工具                    |
| [`@tarojs/transformer-wx`](https://www.npmjs.com/package/@tarojs/transformer-wx)   | Taro 小程序转换器                |
| [`@tarojs/taroize`](https://www.npmjs.com/package/@tarojs/taroize)                 | Taro 小程序编译器                |
| [`@tarojs/taro-rn-runner`](https://www.npmjs.com/package/@tarojs/rn-runner)        | Taro React Native 打包编译工具   |
| [`@tarojs/webpack-runner`](https://www.npmjs.com/package/@tarojs/webpack-runner)   | Taro H5 端 Webpack 打包编译工具  |
| [`@tarojs/components`](https://www.npmjs.com/package/@tarojs/components)           | Taro 标准组件库，H5 版           |
| [`@tarojs/components-rn`](https://www.npmjs.com/package/@tarojs/components-rn)     | Taro 标准组件库，React Native 版 |
| [`@tarojs/components-qa`](https://www.npmjs.com/package/@tarojs/components-qa)     | Taro 标准组件库，快应用 版       |
| [`@tarojs/plugin-babel`](https://www.npmjs.com/package/@tarojs/plugin-babel)       | Taro Babel 编译插件              |
| [`@tarojs/plugin-sass`](https://www.npmjs.com/package/@tarojs/plugin-sass)         | Taro Sass 编译插件               |
| [`@tarojs/plugin-less`](https://www.npmjs.com/package/@tarojs/plugin-less)         | Taro Less 编译插件               |
| [`@tarojs/plugin-stylus`](https://www.npmjs.com/package/@tarojs/plugin-stylus)     | Taro Stylus 编译插件             |
| [`@tarojs/plugin-csso`](https://www.npmjs.com/package/@tarojs/plugin-csso)         | Taro CSS 压缩插件                |
| [`@tarojs/plugin-uglifyjs`](https://www.npmjs.com/package/@tarojs/plugin-uglifyjs) | Taro JS 压缩插件                 |
| [`eslint-config-taro`](https://www.npmjs.com/package/eslint-config-taro)           | Taro ESLint 规则                 |
| [`eslint-plugin-taro`](https://www.npmjs.com/package/eslint-plugin-taro)           | Taro ESLint 插件                 |

## Issue 报告指南

如果提交的是 Bug 报告，请务必遵守 [`Bug report`](https://github.com/NervJS/taro/blob/master/.github/ISSUE_TEMPLATE/bug_report.md) 模板。

如果提交的是功能需求，请在 issue 的标题的起始处增加 `[Feature request]` 字符。

## 开发配置

你需要保证你的 Node.js 版本大于 8，把仓库 Clone 到本地。运行以下命令：

```bash
$ npm install # or yarn
$ npm run bootstrap
```

## 提交 commit

整个 Taro 仓库遵从 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)，在输入 commit message 的时候请务必遵从此规范。

## 代码风格

- `JavaScript`：JavaScript 风格遵从 [JavaScript Standard Style](https://github.com/standard/standard)。
- `TypeScript`：TypeScript 风格也是 [JavaScript Standard Style](https://github.com/standard/standard) 的变种，详情请看相关包目录下的 `tslint.json` 和 `tsconfig.json`。
- 样式：遵循相关包目录下的 `.stylelintrc` 风格。

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
