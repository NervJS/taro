# Taro Contributing Guide

我们非常欢迎社区的开发者向 Taro 做出贡献。在提交贡献之前，请花一些时间阅读以下内容，保证贡献是符合规范并且能帮助到社区。

## 一、Issue 报告指南

请遵循 [`Taro Issue Template`](https://taro-issue-pro.pf.jd.com/) 的指引创建 Bug Report 或 Feature Request 类 Issues。

## 二、Pull Request 贡献指南

### 1. 环境准备

> 需要安装 [Node.js 16](https://nodejs.org/en/)（建议安装 `16.20.0` 及以上版本）及 [pnpm 7](https://pnpm.io/zh/installation)

首先把 Taro 仓库 fork 一份到自己的 Github，然后从个人仓库把项目 clone 到本地，项目默认是 `main` 分支。

然后依次在项目根目录运行以下命令：

```bash
# 安装依赖
$ pnpm i
# 编译构建
$ pnpm build
```

运行完上述命令后，环境已经准备好，此时可以新拉一条分支进行开发。

### 2. 开发与调试

Taro 由一系列子 npm 包组成，整体项目组织基于 **pnpm workspace**。

开发者可以单独修改、编译某个子包：

```bash
# 编译某个子包，[package-name] 为该子包的 package.json 里的 name 字段
$ pnpm --filter [package-name] run dev
```

开发过程中，一般会使用 **link** 的方式把需要调试的包软链到一个测试项目中，然后便可进行断点调试。开发者可以根据测试项目的包管理器以及自己的喜好选择使用 [npm link](https://docs.npmjs.com/cli/v7/commands/npm-link) 或 [yarn link](https://yarnpkg.com/cli/link)（推荐）或 [pnpm link](https://pnpm.io/zh/cli/link) 。

**使用 `yarn link` 的具体示例如下：**

1. 进入需要调试的子包的根目录，然后执行 `yarn link`。
2. 进入测试项目的根目录，然后执行 `yarn link`。（注意被调试的子包的版本要和测试项目中该依赖的版本保持一致）

**使用 `pnpm link` 的具体示例如下：**

情况一、测试项目 `package.json` 中有声明对该包的依赖

1. 进入需要调试的子包的根目录，然后执行 `pnpm link --global`。
2. 进入测试项目的根目录，然后执行 `pnpm link --global [package-name]`。

情况二、测试项目 `package.json` 中没有声明对该包的依赖，该依赖包是被某个 Taro 包间接依赖的，如 `@tarojs/runner-utils`。

1. 测试项目的 `package.json` 中新增 pnpm 配置并配置该依赖包的具体链接路径

```json
"pnpm": {
  "overrides": {
    "@tarojs/runner-utils": "/Users/.../taro/packages/taro-runner-utils"
  }
},
```
2. 执行 `pnpm i` 重新安装测试项目的依赖

在测试项目中创建好链接后，接下来就可以启动项目编译。注意如果是编译 H5 或小程序时，请提前关闭依赖预编译配置：

```json
// /demo/config/dev.js
compiler: {
  type: "webpack5",
  prebundle: {
    enable: false,
  }
}
```

接下来在需要被调试的包中加入断点，**运行时代码**可以在各端的开发工具（小程序开发者工具、Chrome...）中断点调试，而**编译时**的代码需要使用 VSCode debugger 进行断点调试，请参考 Taro 文档中《单步调测》章节。

> 以上是通用的开发/调试步骤，部分子包可能会有额外需要注意的地方，开发前请查阅对应子包的 README。

### 3. 新增/删除依赖

推荐遵循的依赖治理规范：

- 尽量把子包用到的 `dependencies` 和 `devDependencies` 安装在子包。
- TypeScript、各种 Lint 工具、Rollup 等用于治理 Taro 项目的依赖推荐安装在主包。
- 如果子包是插件类项目，使用 `peerDependencies` 声明实际项目中肯定会安装的依赖。

```bash
# 在根目录新增依赖
$ pnpm add -wD <dependency>
# 在根目录删除依赖
$ pnpm remove -wD <dependency>
# 为某个子包（如 @tarojs/cli）新增一个依赖
$ pnpm --filter @tarojs/cli add <dependency>
# 为某个子包（如 @tarojs/cli）删除一个依赖
$ pnpm --filter @tarojs/cli remove <dependency>
# 为所有子包新增一个依赖
$ pnpm -r --filter=./packages/* add <dependency>
# 为所有子包删除一个依赖
$ pnpm -r --filter=./packages/* remove <dependency>
# 删除根目录的 node_modules 和所有 workspace 里的 node_modules
$ npm run clear-all
```

### 4. 单元测试

`package.json` 中设置了 `test:ci` 命令的子包都配备了单元测试。

开发者在修改这些包后，请运行 `pnpm --filter [package-name] run test:ci`，检查测试用例是否都能通过。

同时，在开发一些重要功能后，也请抽时间补上对应的测试用例。

**注意：**

`@tarojs/mini-runner`、`@tarojs/webpack-runner`、`@tarojs/webpack5-runner` 使用了 `snapshot`（测试结果快照）。在修改这两个包或其它一些包时，有可能导致这些快照失效，从而通过不了测试。当你修改了这两个包、或 Github CI 提示这些包的测试用例出错时，请运行 `pnpm --filter [package-name] runupdateSnapshot` 更新 snapshot 后重新提交。

### 5. 代码风格

* `JavaScript`：JavaScript 风格遵从 [JavaScript Standard Style](https://github.com/standard/standard)。
* `TypeScript`：TypeScript 风格也是 [JavaScript Standard Style](https://github.com/standard/standard) 的变种，详情请看相关包目录下的 `eslint.json` 和 `tsconfig.json`。
* 样式：遵循相关包目录下的 `.stylelintrc` 风格。

### 6. 提交 commit

整个 Taro 仓库遵从 [Angular Style Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)，在输入 commit message 的时候请务必遵从此规范。

### 7. 提交 Pull Request

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

### 8. 发布测试版本

提交 PR 后，开发者可以在开发分支上发布测试版本到 npm。部分难以在本地验证的功能可以使用这种方式进行验证。

1. 确保分支名以 `feat/` 或 `chore/` 开头。
2. 在 Taro 项目根目录执行命令：

```bash
# 更新 workspace 内所有子包的版本号，如 pnpm version 3.6.22-alpha.0
$ pnpm version <version>
```

3. 执行 `git commit --amend` 命令，手动修改最新一个 commit 的 commit message，加上 `--tag=<tag>`（此 tag 代表发布的 npm tag）。如发布 alpha 版本：`chore(release): publish 3.6.22-alpha.0 --tag=alpha`。
4. 提交修改到远程仓库，将会触发 Github CI 的发布流程。

### 9. 文档

当提交涉及新增特性、Breaking Changes 或重要修改时，请及时新增、修改对应的文档。

关于文档的开发请阅读下一章节：《贡献文档》。

### 10. Rust 部分

Taro 仓库里有部分使用 Rust 开发的子包，在开发、调试、测试这些包时有不一样的流程。

Rust 代码存放在 `crates` 文件夹下，使用 Cargo workspace 管理，目前包括 NAPI bindings 和若干 SWC 插件。

开发前请使用 `rustup` 安装 Rust 工具链。

#### NAPI bindings

在根目录执行 `pnpm build:binding:debug` 或 `pnpm build:binding:release` 命令，会在 `crates/native-binding` 文件夹中编译出 binding 文件 `taro.[os-platform].node`。

然后可以执行单元测试：

```bash
$ pnpm --filter @tarojs/binding run test
```

或结合调用方执行集成测试。

#### SWC 插件

首先在项目根目录执行 `rustup target add wasm32-wasi` 命令安装 `wasm32-wasi` 的 `target`。

开发过程中可以使用 SWC 测试套件进行单元测试：

```bash
# 执行所有 SWC 插件的单元测试
$ cargo test-swc-plugins
# 执行某个 SWC 插件的单元测试
$ cargo test -p [package-name]
```

功能完成后可以编译出 `.wasm` 文件，联合调用方进行集成测试：

```bash
# 编译所有 SWC 插件
$ cargo build-swc-plugins
# 编译某个 SWC 插件
$ cargo build -p [package-name]
```

Cargo workspace 会把编译产物输出到根目录的 `target` 文件夹中。进行集成测试时，需要手动把 `.wasm` 产物软链到目标文件夹，而 Github CI 在正式发布时会自动拷贝产物到正确的文件夹中。

如对 `@taorjs/helper` 进行集成测试时，会把 `target/wasm32-wasi/release/swc_plugin_xxx.wasm` 文件的软链到 `packages/taro-helper/swc/swc_plugin_xxx.wasm`。

#### 

## Credits

感谢以下所有给 Taro 贡献过代码的开发者：

[![contributors](https://opencollective.com/taro/contributors.svg?width=890&button=false)](https://github.com/NervJS/taro/graphs/contributors)

同时欢迎各位贡献者加入 [Taro 开发者社区](http://storage.jd.com/taro-jd-com/static/contact_taro_devlop_qr.png)
