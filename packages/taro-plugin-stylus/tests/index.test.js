const compile = require('../index')
const assert = require('assert')
const path = require('path')

const file = path.join(__dirname, 'fixtures', 'test.styl')
// eslint-disable-next-line no-debugger

compile(null, file, {
  paths: [path.join(__dirname, 'fixtures', 'base')]
}).then(({ css }) => {
  assert.equal(css, 'body {\n  color: #fff;\n}\n', 'ok')
})
