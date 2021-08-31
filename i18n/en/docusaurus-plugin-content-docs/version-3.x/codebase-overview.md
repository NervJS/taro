---
title: Taro Repository Overview
---

## Repository Composition

The following list describes which NPM packages Taro consists of and what each package does.

###  Base

| Path | Description |
| ------------- |:------------- |
| `@tarojs/cli` | CLI tool |
| `@tarojs/service` | Pluginized Kernel  |
| `@tarojs/taro-loader` | Webpack loaders |
| `@tarojs/helper` | Tool library, mainly for CLI, compile-time use |
| `@tarojs/runner-utils` | Tool library, mainly for compilation tools for applets and H5 |
| `@tarojs/shared` | Tool library, mainly for runtime use |
| `@tarojs/taro` | Expose the Taro objects needed on each end |
| `@tarojs/api` | Taro API independent of each platform |
| `babel-preset-taro` | Babel preset |
| `eslint-config-taro` | ESLint rules |
| `postcss-pxtransform` | PostCSS plugin that converts `px` to adaptive size units on each platform |

### Mini Program

| Path | Description |
| ------------- |:------------- |
| `@tarojs/mini-runner` | Mini program compiler tool, mainly used for setting up and calling Webpack |
| `@tarojs/react` | Mini program specific React renderer based on `react-reconciler` |
| `@tarojs/runtime` | Mini program Runtime Adapter Core |
| `@tarojs/plugin-platform-weapp` | Wechat mini program  plugin |
| `@tarojs/plugin-platform-alipay` | Alipay mini program  plugin |
| `@tarojs/plugin-platform-swan` | Baidu smart program  plugin |
| `@tarojs/plugin-platform-tt` | ByteDance mini program plugin|
| `@tarojs/plugin-platform-qq` | QQ mini program  plugin |
| `@tarojs/plugin-platform-jd` | Jingdong mini program  plugin |
| `@taojs/plugin-html` | Support for plugins that use HTML tags |
| `postcss-html-transform` | PostCSS plugin, class name for handling HTML tags |
| `@taojs/plugin-react-devtools` | Support for plugins using React DevTools |
| `@tarojs/extend` | jQuery-like libraries |

### H5

| Path | Description |
| ------------- |:------------- |
| `@tarojs/webpack-runner` | H5 compiler tool, mainly used for setting up and calling Webpack |
| `@tarojs/router` | H5 Router |
| `@tarojs/taro-h5` | H5 API implemented according to the WeChat mini program specification |
| `@tarojs/components` | H5 Component Library（Web Components version） |
| `@tarojs/components-react` | H5 Component Library (React version) |
| `babel-plugin-transform-taroapi` |Babel plugin that allows the API to be used by `tree-shaking` |
| `postcss-plugin-constparse` | PostCSS plugin for handling the height of the `tabbar` |

### RN

| Path | Description |
| ------------- |:------------- |
| `@tarojs/components-rn` | RN Component Library |
| `@tarojs/rn-runner` |RN compiler tool, mainly used to set up and call metro |
| `@tarojs/rn-style-transformer` | RN style conversion tool to make RN support sass、less、stylus、postcss |
| `@tarojs/rn-supporter` | RN Basic metro configuration |
| `@tarojs/rn-transformer` | RN application portal and page conversion tool that allows RN to support Taro-defined app and page config |
| `@tarojs/router-rn` | RN router |
| `@tarojs/runtime-rn` | RN Runtime Packaging |
| `@tarojs/taro-rn` | The API implemented on the RN side according to the WeChat mini program specification |
| `babel-plugin-transform-react-jsx-to-rn-stylesheet` | Babel plugin for jsx to support className attribute |
| `taro-css-to-react-native` | Converting css to RN stylesheet |

### Other

| Path | Description |
| ------------- |:------------- |
| `@tarojs/taroize` | Mini program to Taro compiler  |
| `@tarojs/with-weapp` | Runtime adapter for mini program to Taro  |

## How to develop

### Environment Preparation

:::note
Need to make sure your Node.js version is greater than `8` (it is recommended to install `10.5` or higher)
:::

First fork a copy of the Taro repository to your Github, then clone the project locally and switch to the `next` branch.

Then run the following commands in sequence.

```bash
$ yarn
$ yarn run bootstrap
$ yarn build
```

After running the above command, the environment is ready and you can pull a new branch for development.

### Code Style

* `JavaScript`：Follow [JavaScript Standard Style](https://github.com/standard/standard)，For details, see the root directory `.eslintrc.js`。
* `TypeScript`: Follow variants based on [JavaScript Standard Style](https://github.com/standard/standard), see `.eslintrc.js` in the root directory and `tsconfig.json` in the relevant package directory for details.
* Styles: follow the `.stylelintrc` style in the relevant package directory.

### Debug

During debugging, the [npm link](https://docs.npmjs.com/cli/v7/commands/npm-link/) command is typically used to softlink the package to be debugged to a test project.

To debug **compile-time** code, please refer to ["Single-step debugging"](./debug-config).

Debug **Runtime** code, you can breakpoint debug directly.

### Unit tests

The packages are currently equipped with unit tests for.

- `babel-preset-taro`
- `@tarojs/cli`
- `@tarojs/components`
- `@tarojs/react`
- `@tarojs/webpack-runner`
- `@tarojs/mini-runner`
- `@tarojs/runtime`
- `@tarojs/taro-rn`
- `@tarojs/components-rn`

After modifying the above packages, developers should make sure to run `lerna run test:ci --scope [package name]` to check if the test cases all pass.

Also, after developing some important features, please take time to fill in the corresponding test cases.

:::note
Note: `@tarojs/mini-runner` and `@tarojs/webpack-runner` use `snapshot` (snapshot of test results), and modifying these two packages or some other packages may cause these snapshots to fail, and thus fail the tests. When you modify these two packages, or if CI prompts you with a test case error for these two packages, run `lerna run updateSnapshot --scope [package name]` to update the snapshot and resubmit.
:::

### commit Specifications

When entering the `commit message`, please make sure to follow the [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153) Specifications.

### Documentation

When a commit involves new features, Breaking Changes or important modifications, please add or modify the corresponding documentation.

Please read [Modifying Documentation](./CONTRIBUTING) for more information about the development of documentation。

## Commit Pull Request

> If you are not familiar with PR (Pull Request), please read
 [《About Pull Requests》](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)

After completing the development and pushing it to your own Taro repository, you are ready to submit the Pull Request.

Before submitting a PR, please read the following notes.

1. make sure `npm run build` compiles successfully.
2. Make sure the code passes the ESLint test.
3. ensure that all test cases pass when the package in question has the `npm test:ci` command.
4. when the related package has test cases, add the corresponding test cases to your commit code as well.
5. ensure that the commit message needs to follow the [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153).
6. If the commit code is very large or complex, you can divide the PR into several commits together. We will squash as appropriate when merging.
7. PR authors can choose to join Taro Developer WeChat group for merging PRs and technical communication.
