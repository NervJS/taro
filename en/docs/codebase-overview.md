---
title: Taro Repository Overview
---

## Repository composition

The following list describes which NPM packages consist of Taro and the functionality of each package.

### Basis

| Path                   | Description                                                 |
| ---------------------- |:----------------------------------------------------------- |
| `@tarojs/cli`          | CLI Tools                                                   |
| `@tarojs/service`      | Plugin kernel                                               |
| `@tarojs/taro-loader`  | Webpack loads                                               |
| `@tarojs/helper`       | Tools library primarily for CLI use in compilation.         |
| `@tarojs/runner-utils` | Tools library, primarily for applets, H5 compilers          |
| `@tarojs/shared`       | Toolbase,primarily for runtime                              |
| `@tarojs/taro`         | Taro objects needed to expose all ends                      |
| `@tarojs/api`          | Taro API unrelated to each side                             |
| `babel-preset-taro`    | Babel preset                                                |
| `eslint-config-taro`   | ESLint Rules                                                |
| `postcss-pxtransform`  | PostCSS plugin, convert `px` for adaptive units at all ends |

### Applet

| Path                             | Description                                                                  |
| -------------------------------- |:---------------------------------------------------------------------------- |
| `@tarojs/mini-runner`            | Applet compiler, mainly for setting up and calling Webpack                   |
| `@tarojs/react`                  | Only React-reconciliation applet React renderer based on `react-conciliator` |
| `@tarojs/runtime`                | applet core while running                                                    |
| `@tarojs/plugin-platform-weapp`  | MicroMessage Applet Plugin                                                   |
| `@tarojs/plugin-platform-alipay` | PayPal Applet Plugin                                                         |
| `@tarojs/plugin-platform-swan`   | Baidu Applet Plugin                                                          |
| `@tarojs/plugin-platform-tt`     | Byte jump applet plugin                                                      |
| `@tarojs/plugin-platform-qq`     | qq Applet Plugin                                                             |
| `@tarojs/plugin-platform-jd`     | Gydong Applet Plugin                                                         |
| `@tajs/plugin-html`              | Plugins that support HTML tags                                               |
| `postcss-html-transform`         | PostCSS plugin, used to handle class names of HTML tags                      |
| `@tajs/plugin-react-devtools`    | Plugins that support React DevTools                                          |
| `@tarojs/extend`                 | Libraries like jQuery                                                        |

### H5

| Path                             | Description                                                     |
| -------------------------------- |:--------------------------------------------------------------- |
| `@tarojs/webpack-runner`         | H5 Compilation Tools, mainly for setting up and calling Webpack |
| `@tarojs/router`                 | H5 Routes                                                       |
| `@tarojs/taro-h5`                | API for H5 ends based on micromessage applet                    |
| `@tarojs/components`             | H5 Component Library (Web Component Version)                    |
| `@tarojs/components-react`       | H5 Component Library (React version)                            |
| `babel-plugin-transform-taroapi` | Babel plugin, make the API accessible `tree-shating`            |
| `postcss-plugin-constparse`      | PostCSS plugin, used to handle the height of `tabbar`           |

### RN

| Path                                                | Description                                                                          |
| --------------------------------------------------- |:------------------------------------------------------------------------------------ |
| `@tarojs/components: rn`                            | RN Component Library                                                                 |
| `@tarojs/rn-runner`                                 | RN compiler, mainly for setting up and calling metro                                 |
| `@tarojs/rn-style-transformer`                      | RN Style Transformation Tool, let RN support sass, lesss, stylus, postcss            |
| `@tarojs/rn-support`                                | RN Base metro Configuration                                                          |
| `@tarojs/rn-transformer`                            | RN App Entry and Page Config to allow RN to support Taro defined app and page config |
| `@tarojs/router-rn`                                 | RN Routes                                                                            |
| `@tarojs/runtime-rn`                                | RN Runtime Package                                                                   |
| `@tarojs/taro-rn`                                   | API for RN end based on Micromessage applet                                          |
| `babel-plugin-transform-react-jsx-to-rn-stylesheet` | Babel plugin, make jsx support className properties                                  |
| `taro-css-to-react-native`                          | Stylesheet to RN                                                                     |

### Other

| Path                 | Description                          |
| -------------------- |:------------------------------------ |
| `@tarojs/taroize`    | The compiler of the applet turn Taro |
| `@tarojs/with-weapp` | Adapter when the applet turns Taro   |

## How to develop

### Environmental preparation

:::note to make sure your Node.js version larger than `8`(it is recommended to install `10.5` above) :::

Start with Taro repository fork to your own Github, then move the project clone to the local and switch to `next`.

然后依次运行以下命令：

```bash
$yarn
$yarn run bootstrap
$yarn build
```

When you run the command, the environment is ready and you can pull a new branch for development.

### Code Style

* `JavaScript`：defaults to [JavaScript Standard Style](https://github.com/standard/standard), see the root directory `.eslintrc.js`.
* `TypeScript`：follow a variant based on [JavaScript Standard Style](https://github.com/standard/standard) , see `.eslintrc.js` and the related package directory `tsconfig.json`.
* 样式：遵循相关包目录下的 `.stylelintrc` 风格。

### Debug

During the debugging process, usually using [npm link](https://docs.npmjs.com/cli/v7/commands/npm-link/) commands to link packages to a test project.

调试**编译时**的代码，请参考 [《单步调测》](./debug-config)。

Debugging**code from**when running, can be debugged directly.

### Unit Test

These packages are currently equipped with unit tests：

- `babel-preset-taro`
- `@tarojs/cli`
- `@tarojs/components`
- `@tarojs/react`
- `@tarojs/webpack-runner`
- `@tarojs/mini-runner`
- `@tarojs/runtime`
- `@tarojs/taro-rn`
- `@tarojs/components: rn`

When the developer modifies the above packages, make sure to run `lerna run test:ci --scope [包名]`to check if test usage can be passed.

At the same time, following the development of a number of important functions, time is also requested to supplement the corresponding test examples.

::note Note：`@tarojs/mini-runner`,`@tarojs/webpack-runner` used `snapshot`(test results snapshot), and may cause these snapshots to expire when modifying these or other packages, thus failing to pass the test.When you modify the test case for these two packages, or CI prompts, run `lerna run updateSnapshot --scope [包名]` update snapshot and resubmit. :::

### Commit specification

在输入 `commit message` 的时候请务必遵从 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153) 规范。

### Documentation

Please add or modify the corresponding documentation when it comes to adding new features, Breaking Changes or significant modifications.

For document development, read[Modify Documents](./CONTRIBUTING#修改文档)

## Submit Full Request

> If you don't know about PR(Pull Request), read [About Full Requests](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)

Once developed, push to your own Taro warehouse, you can prepare to submit a full request.

提交 PR 前请阅读以下注意事项：

1. Guarantee `npm run build` to compile successfully.
2. Guarantee code can be tested via ESLint
3. When the package contains `npm test:ci` command, it must be guaranteed that all test cases can pass;
4. Please add a test case to the code you have submitted when the package has a test user;
5. Assure to commit information requires following [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153).
6. If you submit code to a very large number or functionality, you can submit PR along with several commits.We will follow the case when we merge.
7. PR authors can choose to join the Taro developer micromessenger to facilitate merging PR and technology exchanges.
