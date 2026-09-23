## 微信混合开发：子分包独立模板

本示例将 Taro 页面和两个组件接入原生微信小程序，演示 `subPackageIndie` 的分包模板布局。构建使用 Webpack 5 和 `--type weapp --new-blended`。配置见 [app.config.js](taro-project/src/app.config.js)，平台开关见 [platform.ts](../../packages/taro-webpack5-runner/src/utils/platform.ts)。

本示例只面向微信小程序。`tt`、支付宝等其他平台不会启用这项能力，复制插件也不会改写微信宿主。本例没有配置 `asyncSubPackage`，不演示业务代码的 `require.async` 加载；`subPackageIndie` 也不等同于原生分包的 `independent: true`。

### 构建与预览

前提：已在 Taro 仓库中安装依赖并编译本地框架包。本例使用 `workspace:*` 依赖，不能将示例目录单独复制出去安装。以下命令均在仓库根目录执行：

```bash
pnpm --filter subpackage-indie-example run build
```

构建成功后，[复制插件](taro-project/plugin-mv/index.js) 将 `taro-project/dist/` 的运行文件同步到 `miniapp/pages/order/`。插件先检查平台、`newBlended`、编译结果及三个入口文件组；编译失败或入口不完整时保留已有宿主产物。同步会替换整个目标目录，请勿在该目录手工维护代码。

使用微信开发者工具导入 `examples/subpackage-indie/miniapp/`，不要导入 `dist/`。项目配置中的 `touristappid` 是占位值；如果调试需要自己的 AppID，仅在本地设置，提交前恢复占位值。不要提交开发者工具生成的 `project.private.config.json`。

监听构建：

```bash
pnpm --filter subpackage-indie-example run dev
```

构建产物、开发者工具私有配置由 [.gitignore](.gitignore) 忽略。宿主所需的运行文件需要通过构建生成；复制时排除 `app.json`、项目配置和 source map，宿主使用自己的 [app.json](miniapp/app.json)。

### 配置与产物对应

三个路径均相对于 `taro-project/src/`，配置值包含入口文件名。原生宿主的分包根目录不包含入口文件名。

| Taro 配置 | 入口 | 复制后的宿主目录 |
| --- | --- | --- |
| `mainPackageRoot` | `pages/index/index` | `miniapp/pages/order/pages/index/` |
| `subPackageRoots[0]` | `pages/sub1/index` | `miniapp/pages/order/pages/sub1/` |
| `subPackageRoots[1]` | `pages/sub2/index` | `miniapp/pages/order/pages/sub2/` |

`pages/index` 保存运行时和全局样式；三个目录分别使用本地的 `base.wxml`、`utils.wxs` 和 `comp` 文件。跨分包组件引用及占位组件配置见 [index.config.js](taro-project/src/pages/index/index.config.js)。修改入口路径时，需同步更新上述配置、原生导航路径及复制插件的入口检查列表。

### 验证

自动化测试覆盖复制插件的平台隔离、编译失败、入口缺失、成功复制及重复构建，并检查 Babel helper 使用包名引用以避免暴露本地路径：

```bash
pnpm --filter subpackage-indie-example run test
```

下列项目需在微信开发者工具或真机上手工检查，Node 测试不覆盖渲染和真实分包加载：

1. 从原生首页点击“打开 Taro 订单组件”，确认能够进入 Taro 页面。
2. 分别显示、隐藏 List 和 Detail 组件，检查组件内容与样式。
3. 检查三个产物目录中的模板和 `comp` 引用，确认没有跨分包引用其他目录的 `base.wxml`。
4. 检查调试器是否出现缺失模板、组件或样式错误。

订单内容均为本地模拟数据。示例源码不需要登录、用户信息采集或业务服务地址；添加自己的调试配置时，应避免提交账号标识、凭据、内部地址及含本地路径的日志。
