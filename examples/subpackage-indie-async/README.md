# 微信混合开发：顶层 asyncSubPackages 异步分包与动态 import

本示例演示微信 `new-blended` 混合开发下的源码级异步分包：通过顶层 `AppConfig.asyncSubPackages` 将 `import()` 延迟加载的模块显式指定到独立的物理目录。相比旧的 `subPackageIndie` 消费页面规则，这里的 `test` 直接匹配 `taro-project/src/` 相对路径下的源码模块，`root` 表示 `dist/` 内的输出目录。

与 [subpackage-indie](../subpackage-indie) 相比，本例不配置 `mainPackageRoot`，使用普通根级业务 runtime，让 `pages/sub1`、`pages/sub2` 作为已声明分包页面。

构建使用 Webpack 5 和 `--type weapp --new-blended`。配置见 [app.config.js](taro-project/src/app.config.js)。规则解析见 [asyncSubPackageConfig.ts](../../packages/taro-webpack5-runner/src/utils/asyncSubPackageConfig.ts)。

本示例只面向微信小程序；未接入共享运行时，也不演示 `experimental.compileMode`。共享运行时对该能力是可选项。

### 构建与预览

前提：已在 Taro 仓库中安装依赖并编译本地框架包。本例使用 `workspace:*` 依赖，不能将示例目录单独复制出去安装。以下命令均在仓库根目录执行：

```bash
pnpm --filter @tarojs/webpack5-runner run build
pnpm --filter subpackage-indie-async-example run build
```

构建成功后，[复制插件](taro-project/plugin-mv/index.js) 将 `taro-project/dist/` 的运行文件同步到 `miniapp/pages/order/`。插件先检查平台、`newBlended`、编译结果及 sub1/sub2 两个页面入口组；编译失败或入口不完整时保留已有宿主产物。同步会替换整个目标目录，请勿在该目录手工维护代码。

监听构建：

```bash
pnpm --filter subpackage-indie-async-example run dev
```

### 配置与产物对应

`asyncSubPackages` 规则决定动态 import chunk 的物理目录，`test` 匹配 `taro-project/src/` 相对路径（省略扩展名），`root` 为 `dist/` 相对目录：

| test | 源码文件 | 产物目录 | 说明 |
| --- | --- | --- | --- |
| `pages/sub1/OnlySub1` | `pages/sub1/OnlySub1.jsx` | `pages/sub1-async/` | 私有异步组件 |
| `pages/sub2/OnlySub2` | `pages/sub2/OnlySub2.jsx` | `pages/sub2-async/` | 私有异步组件 |
| `components/SharedBySub1Sub2` | `components/SharedBySub1Sub2.jsx` | `pages/shared-async/` | 两页共享模块 |
| `components/heavy-content/index` | `components/heavy-content/index.jsx` | `pages/heavy-async/` | 单独指定重组件，priority 10 |

`HeavyContent` 还带有一个私有 helper 与 `logo.png`：helper 随组件进入同一目标，图片仍按已有静态资源策略输出。

每个异步目录包含编译器生成的加载入口三件套：`index.js` 同步 require 真实 chunk、`index.json` 为 `{}`、`index.wxml` 为 `<view />`。宿主的 [app.json](miniapp/app.json) 已注册 `pages/order/pages/{sub1-async,sub2-async,shared-async,heavy-async}`，`independent` 必须为 `false`。修改 `test` 或 `root` 后需同步更新宿主注册。

### 微信开发者工具验证

Node 测试不覆盖真实渲染、分包加载和样式命中，需在微信开发者工具中完成下列验收：

1. 导入 `examples/subpackage-indie-async/miniapp/`，不要导入 `dist/`。
2. 从原生首页分别打开 Sub1、Sub2。
3. 在 Sub1 依次点击"动态导入 OnlySub1"、"动态导入 SharedBySub1Sub2"、"动态导入 HeavyContent"，确认组件渲染、图片显示，且调试器无加载错误。
4. 在 Sub2 同样点击三个按钮，确认共享模块和 heavy 组件不重复、状态一致。
5. 打开 `pages/order/pages/heavy-async/`，确认 heavy 的真实异步 chunk 与加载入口三件套都在该目录，且没有把 `OnlySub1`、`OnlySub2` 等模块连带搬入。
6. 打开 Sub1/Sub2 页面 WXSS，确认 `.heavy`、`.only1`、`.only2`、`.shared` 样式实际命中；如未命中，检查异步 chunk 对应的 WXSS 是否已按 `import()` 语义注入消费页面。
7. 通过调试器/真机确认动态 import 失败时进入业务 `catch`，不永久 pending。

异步组件样式已由编译器回填到消费页面的 `index.wxss`（`only`、`shared`、`heavy` 深层后代选择器均命中），不再残留根级散落 WXSS。函数级 byte 校验不代替微信最终包体积检查。

### 验证命令

复制插件自动化测试覆盖平台隔离、编译失败、入口缺失、成功复制及重复构建：

```bash
pnpm --filter subpackage-indie-async-example run test
```

### 接入方能复用的动态 import 模式

```jsx
const [Comp, setComp] = useState(null)

const load = useCallback(async () => {
  const module = await import('../../components/heavy-content/index')
  setComp(() => module.default)
}, [])

return <View>{Comp && <Comp />}</View>
```

要求：

- 通过真实 `import()` 延后加载，静态 import 的模块不进入异步目标。
- `test` 匹配实际源码模块，不按目录推断归属；目录前缀用正则 `/^components\/editor\//`。
- 指定目标必须存在合法异步加载边界。若模块同时被入口静态引用，构建会报错而不是自动改写为异步加载。
