# eslint-plugin-taro

Taro ESLint 插件，只有当 ESLint 规则全部都通过时，Taro 小程序端才可能正常运行。

## 安装/设置

通过 NPM 安装：

```bash
$ npm install eslint-plugin-react --save-dev
```

在 `.eslintrc` 中设置：

```json
"extends": [
  "plugin:taro"
]
```

或者使用 `taro-cli` 创建模板自动设置。

## 规则

插件包含了四个方面的规则：

1. 自定义规则
2. 变量定义规则
3. import 规则 (通过 eslint-plugin-import 提供)
4. JSX 规则 (通过 eslint-plugin-react 提供)

其中自定义规则包括：

* [taro/custom-component-children](./docs/custom-component-children.md)
* [taro/if-statement-in-map-loop](./docs/if-statement-in-map-loop.md)
* [taro/manipulate-jsx-as-array](./docs/manipulate-jsx-as-array.md)
* [taro/no-anonymous-function-in-props](./docs/manipulate-jsx-as-array.md)
* [taro/no-jsx-in-class-method](./docs/no-jsx-in-class-method.md)
* [taro/no-jsx-in-props](./docs/no-jsx-in-props.md)
* [taro/no-ref](./docs/no-ref.md)
* [taro/no-spread-in-props](./docs/no-ref.md)
* [taro/no-stateless-component](./docs/no-stateless-component.md)


