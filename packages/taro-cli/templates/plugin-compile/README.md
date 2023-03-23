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
const config = {
  plugins: [
    [ "<%= pluginName %>", {<% if (['plugin-template'].includes(type)) { %> installPath:'/xxx/xx/x' <% } %>} ]
  ]
}
```
