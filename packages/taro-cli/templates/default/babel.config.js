// babel-preset-taro 更多选项和默认值：
// https://docs.taro.zone/docs/next/babel-config
module.exports = {
  presets: [
    ['taro', {
      framework: '{{ to_lower_case framework }}',
      ts: {{ typescript }},
      compiler: '{{ to_lower_case compiler }}',
      {{#if buildEs5 }}
      useBuiltIns: process.env.TARO_ENV === 'h5' ? 'usage' : false
      {{/if}}
    }]
  ]
}
