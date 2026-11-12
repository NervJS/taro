# 微信混合开发：async-only 异步分包与动态 import

本示例演示微信 `new-blended` 混合开发的 async-only 异步分包模式：省略 `mainPackageRoot`，让 sub1、sub2 直接成为已声明分包页面，业务代码通过动态 `import()` 延迟加载组件，编译器按消费页面集合把异步 chunk 分配进私有或共享的异步分包目录。与 [subpackage-indie](../subpackage-indie) 相比，本例不使用主包入口组件承载业务页面，也不为业务页面生成独立运行时。

构建使用 Webpack 5 和 `--type weapp --new-blended`。配置见 [app.config.js](taro-project/src/app.config.js)，规则的运行时语义见 [asyncSubPackageRules.ts](../../packages/taro-webpack5-runner/src/utils/asyncSubPackageRules.ts)。

本示例只面向微信小程序；未接入共享运行时，也不演示 `experimental.compileMode`。共享运行时对该能力是可选项，业务异步分包不依赖它。

### 构建与预览

前提：已在 Taro 仓库中安装依赖并编译本地框架包。本例使用 `workspace:*` 依赖，不能将示例目录单独复制出去安装。以下命令均在仓库根目录执行：

```bash
pnpm --filter subpackage-indie-async-example run build
```

构建成功后，[复制插件](taro-project/plugin-mv/index.js) 将 `taro-project/dist/` 的运行文件同步到 `miniapp/pages/order/`。插件先检查平台、`newBlended`、编译结果及 sub1/sub2 两个页面入口组；编译失败或入口不完整时保留已有宿主产物。同步会替换整个目标目录，请勿在该目录手工维护代码。

使用微信开发者工具导入 `examples/subpackage-indie-async/miniapp/`，不要导入 `dist/`。项目配置中的 `touristappid` 是占位值；如果调试需要自己的 AppID，仅在本地设置，提交前恢复占位值。不要提交开发者工具生成的 `project.private.config.json`。

监听构建：

```bash
pnpm --filter subpackage-indie-async-example run dev
```

构建产物、开发者工具私有配置由 [.gitignore](.gitignore) 忽略。宿主所需的运行文件需要通过构建生成；复制时排除 `app.json`、项目配置和 source map，宿主使用自己的 [app.json](miniapp/app.json)。

### 配置与产物对应

`subPackageRoots` 的三条规则决定动态 import 的 chunk 归属，路径均相对于 `taro-project/src/`：

| 规则的消费者页面 | 归属示例 | 异步分包目录（宿主内） | 预算行为 |
| --- | --- | --- | --- |
| 仅 `pages/sub1/index` | `sub1/OnlySub1` | `miniapp/pages/order/pages/sub1-async/` | 单目标不执行容量限制 |
| 仅 `pages/sub2/index` | `sub2/OnlySub2` | `miniapp/pages/order/pages/sub2-async/` | 单目标不执行容量限制 |
| sub1 与 sub2 共同消费 | `components/SharedBySub1Sub2` | `miniapp/pages/order/pages/shared-async/`（超预算继续装箱到 `shared-async-2`） | 每目标上限 1,500,000 字节 |

每个异步目录包含编译器生成的加载入口三件套（`index.js` 同步 require 真实 chunk、`index.json` 为 `{}`、`index.wxml` 为 `<view />`）。宿主的 [app.json](miniapp/app.json) 需要注册实际使用的异步根目录，`independent` 必须为 `false`；`shared-async-2` 未被使用时不会生成，也不用注册。修改页面或异步目录路径时，需同步更新规则配置、宿主 app.json 及复制插件的入口检查列表。

异步样式合并进消费者页面的 WXSS，多消费方共享的样式进入 `common.wxss`；异步目录下不会残留 WXSS 或模板文件。

### 验证

复制插件的自动化测试覆盖平台隔离、编译失败、入口缺失、成功复制及重复构建，并检查 Babel helper 使用包名引用以避免暴露本地路径：

```bash
pnpm --filter subpackage-indie-async-example run test
```

下列项目需在微信开发者工具或真机上手工检查，Node 测试不覆盖渲染和真实分包加载：

1. 从原生首页分别打开 Sub1、Sub2 页面。
2. 在 Sub1 点击"动态导入 OnlySub1"，确认组件渲染且调试器无加载错误；点击"动态导入 SharedBySub1Sub2"再次确认。
3. 在 Sub2 点击"动态导入 OnlySub2"与"动态导入 SharedBySub1Sub2"，确认渲染成功。
4. 检查 `pages/order/pages/sub1-async`、`pages/sub2-async`、`pages/shared-async/`：确认 chunk 分布、加载入口三件套齐全且无样式/模板残留。
5. 检查调试器没有出现缺失模板、组件或样式错误。

### 接入方能复用的动态 import 模式

```jsx
const [Comp, setComp] = useState(null)

const load = useCallback(async () => {
  const module = await import('./OnlySub1')
  setComp(() => module.default)
}, [])

return <View>{Comp && <Comp />}</View>
```

要求：

- 通过真实 `import()` 延后加载：babel caller 为当前编译器保留原生动态 import，静态引用的模块不参与异步分包。
- 消费页面必须是已声明页面（`pages` 或 `subPackages` 中声明），规则按页面路径匹配；组件源码所在目录不影响归属。
- 单一消费者时选择覆盖范围更小的规则；跨页面消费时必须有一条规则覆盖全部消费者，否则构建报错。
