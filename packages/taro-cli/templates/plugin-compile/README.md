# <%= pluginName %>

> <%= description %>

## 使用

### 安装
```
npm i <%= pluginName %> -D
```

### 使用插件
`/config/index.js`

```js
<% if (['plugin-template'].includes(type)) { %> 
/**插件参数为 IPluginOpts {
 *  installPath: string 安装的路径
 *  css?: 'none' | 'sass' | 'stylus' | 'less'
 *  typescript?: boolean
 *  compiler?: 'webpack4' | 'webpack5' | 'vite'
 * }
 * 这些参数后续会被模版文件解析所用
 * 如果不传，会从 package.json 的 templateInfo
 */
<% } %>
const config = {
  plugins: [
    [ "<%= pluginName %>", {<% if (['plugin-template'].includes(type)) { %> installPath:'/xxx/xx/x' <% } %>} ]
  ]
}
```
