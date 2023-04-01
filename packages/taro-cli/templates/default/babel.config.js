// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: '<% if (compiler === 'vite') { %>\0<%}%><%= framework %>',
      ts: <% if (compiler === 'vite') { %>false<% } else { %><%= typescript %><% } %>
    }]
  ]
}
