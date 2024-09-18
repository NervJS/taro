# {{ projectName }}

> {{ description }}

## 使用

### 安装
```
npm i {{ projectName }} -D
```

### 使用插件
`/config/index.js`

```js
{{#if (eq pluginType "plugin-template") }}
/**插件参数为 IPluginOpts {
 *  installPath: string 安装的路径
 *  css?: 'none' | 'sass' | 'stylus' | 'less'
 *  typescript?: boolean
 *  compiler?: 'webpack5' | 'vite'
 * }
 * 这些参数后续会被模版文件解析所用
 * 如果不传，会从 package.json 的 templateInfo
 */
{{/if}}
const config = {
  plugins: [
    ["{{ projectName }}"{{#if (eq pluginType "plugin-template") }}, { installPath:'/xxx/xx/x' }{{/if}}]
  ]
}
```
