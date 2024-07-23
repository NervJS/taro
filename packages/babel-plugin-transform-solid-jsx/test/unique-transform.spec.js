const path = require('path')
const pluginTester = require('babel-plugin-tester').default
const plugin = require('../dist')

pluginTester({
  plugin,
  title: 'Convert JSX',
  fixtures: path.join(__dirname, '__unique_transform_fixtures__'),
  snapshot: true
})
