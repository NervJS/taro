# eslint-config-taro

Taro ESLint 插件，只有当 ESLint 规则全部都通过时，Taro 小程序端才可能正常运行。

## 安装/设置

通过 NPM 安装：

```bash
$ npm install eslint babel-eslint eslint-config-taro eslint-plugin-taro eslint-plugin-react eslint-plugin-import --save-dev
```

在 `.eslintrc` 中设置：

```json
"extends": [
  "taro"
]
```

或者使用 `taro-cli` 创建模板自动设置。

## 规则

插件包含了四个方面的规则：

1. 自定义规则 (通过 eslint-plugin-taro 提供)
2. 变量定义规则
3. import 规则 (通过 eslint-plugin-import 提供)
4. JSX 规则 (通过 eslint-plugin-react 提供)

