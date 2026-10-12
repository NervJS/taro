const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')
const vm = require('node:vm')

function fixture (t, options = { platform: 'weapp', newBlended: true }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'subpackage-copy-test-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const appPath = path.join(root, 'taro-project')
  const outputPath = path.join(appPath, 'dist')
  const target = path.join(root, 'miniapp/pages/order')
  fs.mkdirSync(target, { recursive: true })
  fs.writeFileSync(path.join(target, 'previous.js'), 'previous build')
  const hooks = []
  const logs = []
  const pluginModule = { exports: {} }
  // Keep plugin filesystem operations inside the temporary example.
  const source = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8')
  vm.runInNewContext(source, {
    require,
    module: pluginModule,
    __dirname: path.join(appPath, 'plugin-mv'),
    console: { log: (...args) => logs.push(args.join(' ')) },
  })
  pluginModule.exports({
    paths: { appPath, outputPath },
    runOpts: { options },
    onBuildFinish: (hook) => hooks.push(hook),
  })
  const write = (name, content = '{}') => {
    const file = path.join(outputPath, name)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }
  const build = (result = { stats: { hasErrors: () => false } }) => {
    for (const hook of hooks) hook(result)
  }
  const validOutput = () => {
    write('pages/index/index.js', 'entry')
    write('pages/index/index.json')
    write('pages/index/index.wxml', '<view />')
    write('pages/sub1/index.js', 'list')
    write('pages/sub1/index.json', '{"component":true}')
    write('pages/sub1/index.wxml', '<view />')
    write('pages/sub2/index.js', 'detail')
    write('pages/sub2/index.json', '{"component":true}')
    write('pages/sub2/index.wxml', '<view />')
  }
  return { root, outputPath, target, logs, write, build, validOutput }
}

for (const platform of ['tt', 'alipay', 'swan', 'qq', 'jd', 'h5']) {
  test(`${platform} builds leave the WeChat host unchanged`, (t) => {
    const f = fixture(t, { platform, newBlended: true })
    f.validOutput()
    f.build()
    assert.deepEqual(fs.readdirSync(f.target), ['previous.js'])
  })
}

test('ordinary WeChat builds leave the mixed-development host unchanged', (t) => {
  const f = fixture(t, { platform: 'weapp', newBlended: false })
  f.validOutput()
  f.build()
  assert.deepEqual(fs.readdirSync(f.target), ['previous.js'])
})

for (const [name, result] of [
  ['compiler error', { error: new Error('build failed'), stats: { hasErrors: () => false } }],
  ['compilation errors', { stats: { hasErrors: () => true } }],
  ['missing build result', undefined],
]) {
  test(`${name} preserves the last host build`, (t) => {
    const f = fixture(t)
    f.validOutput()
    f.build(result === undefined ? {} : result)
    assert.deepEqual(fs.readdirSync(f.target), ['previous.js'])
  })
}

test('missing output preserves the last host build', (t) => {
  const f = fixture(t)
  f.build()
  assert.deepEqual(fs.readdirSync(f.target), ['previous.js'])
})

for (const entry of ['pages/index/index', 'pages/sub1/index', 'pages/sub2/index']) {
  for (const extension of ['.js', '.json', '.wxml']) {
    test(`missing ${entry}${extension} preserves the last host build`, (t) => {
      const f = fixture(t)
      f.validOutput()
      fs.unlinkSync(path.join(f.outputPath, entry + extension))
      f.build()
      assert.deepEqual(fs.readdirSync(f.target), ['previous.js'])
    })
  }
}

test('successful WeChat builds copy only runtime files and refresh on watch', (t) => {
  const f = fixture(t)
  f.validOutput()
  f.write('app.json')
  f.write('project.config.json')
  f.write('project.private.config.json')
  f.write('pages/index/index.js.map')
  f.write('common.js', 'shared')
  f.build()
  assert.equal(fs.readFileSync(path.join(f.target, 'pages/index/index.js'), 'utf8'), 'entry')
  assert.equal(fs.readFileSync(path.join(f.target, 'common.js'), 'utf8'), 'shared')
  for (const name of ['previous.js', 'app.json', 'project.config.json', 'project.private.config.json', 'pages/index/index.js.map']) {
    assert.equal(fs.existsSync(path.join(f.target, name)), false, name)
  }
  f.write('pages/index/index.js', 'updated entry')
  fs.unlinkSync(path.join(f.outputPath, 'common.js'))
  f.build()
  assert.equal(fs.readFileSync(path.join(f.target, 'pages/index/index.js'), 'utf8'), 'updated entry')
  assert.equal(fs.existsSync(path.join(f.target, 'common.js')), false)
  assert.equal(f.logs.some((line) => line.includes(f.root)), false, 'logs must not expose local paths')
})
