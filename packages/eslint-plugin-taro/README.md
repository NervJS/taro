# eslint-plugin-taro

Taro ESLint 插件，只有当 ESLint 规则全部都通过时，Taro 小程序端才可能正常运行。

## 安装/设置

通过 NPM 安装：

```bash
$ npm install eslint-plugin-taro --save-dev
```

在 `.eslintrc` 中设置：

```json
"extends": [
  "plugin:taro/all"
]
```

或者使用 `taro-cli` 创建模板自动设置。

## 规则

* [taro/custom-component-children](./docs/custom-component-children.md)
* [taro/if-statement-in-map-loop](./docs/if-statement-in-map-loop.md)
* [taro/manipulate-jsx-as-array](./docs/manipulate-jsx-as-array.md)
* [taro/no-anonymous-function-in-props](./docs/no-anonymous-function-in-props.md)
* [taro/no-jsx-in-class-method](./docs/no-jsx-in-class-method.md)
* [taro/no-jsx-in-props](./docs/no-jsx-in-props.md)
* [taro/no-ref](./docs/no-ref.md)
* [taro/no-spread-in-props](./docs/no-ref.md)
* [taro/no-stateless-component](./docs/no-stateless-component.md)


