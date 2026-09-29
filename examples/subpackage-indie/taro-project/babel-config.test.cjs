const assert = require('node:assert/strict')
const path = require('node:path')
const { test } = require('node:test')
const { transformSync } = require('@babel/core')

test('runtime helper imports do not expose local filesystem paths', (t) => {
  const previous = { NODE_ENV: process.env.NODE_ENV, TARO_ENV: process.env.TARO_ENV }
  process.env.NODE_ENV = 'development'
  process.env.TARO_ENV = 'weapp'
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  })
  const result = transformSync('export class Example { value () { return 1 } }', {
    cwd: __dirname,
    filename: path.join(__dirname, 'src/example.js'),
    configFile: path.join(__dirname, 'babel.config.js'),
    babelrc: false,
    ast: true,
  })
  const helpers = result.ast.program.body
    .filter((node) => node.type === 'ImportDeclaration' && node.source.value.includes('runtime'))
    .map((node) => node.source.value)
  assert.ok(helpers.length > 0, 'the fixture must exercise runtime helper imports')
  assert.ok(helpers.every((request) => request.startsWith('@babel/runtime/')), 'runtime helpers must use package names, not local paths')
})
