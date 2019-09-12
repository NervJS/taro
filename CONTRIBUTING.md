# Taro Contributing Guide

我们非常欢迎社区的开发者向 Taro 做出贡献。在提交贡献之前，请花一些时间阅读以下内容，保证贡献是符合规范并且能帮助到社区。

## Issue 报告指南

如果提交的是 Bug 报告，请务必遵守 [`Bug report`](https://github.com/NervJS/taro/blob/master/.github/ISSUE_TEMPLATE/bug_report.md) 模板。

如果提交的是功能需求，请在 issue 的标题的起始处增加 `[Feature request]` 字符。

## 开发配置

你需要保证你的 Node.js 版本大于 8，把仓库 clone 到本地，并运行以下命令：

```bash
$ npm install # or yarn
$ npm run bootstrap
```

## 提交 commit

整个 Taro 仓库遵从 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)，在输入 commit message 的时候请务必遵从此规范。

## 代码风格

* `JavaScript`：JavaScript 风格遵从 [JavaScript Standard Style](https://github.com/standard/standard)。
* `TypeScript`：TypeScript 风格也是 [JavaScript Standard Style](https://github.com/standard/standard) 的变种，详情请看相关包目录下的 `tslint.json` 和 `tsconfig.json`。
* 样式：遵循相关包目录下的 `.stylelintrc` 风格。

## Pull Request 指南

1. 务必保证 `npm run build` 能够编译成功；
2. 务必保证提交的代码遵循相关包中的 `.eslintrc`, `.tslintrc`, `.stylelintrc` 所规定的规范；
3. 当相关包的 `package.json` 含有 `npm test` 命令时，必须保证所有测试用例都需要通过；
4. 当相关包有测试用例时，请给你提交的代码也添加相应的测试用例；
5. 提交代码 commit 时，commit 信息需要遵循 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)。
6. 如果提交的代码非常多或功能复杂，可以把 PR 分成几个 commit 一起提交。我们在合并时会根据情况 squash。
 
 ## Credits

感谢以下所有给 Taro 贡献过代码的开发者：

<a href="https://github.com/NervJS/taro/graphs/contributors"><img src="https://opencollective.com/taro/contributors.svg?width=890&button=false" /></a>
