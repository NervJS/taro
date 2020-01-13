module.exports = {
  presets: [
    ['@babel/env', {
      framework: '<%= framework %>',
      ts: <%= typescript %>
    }]
  ]
}
