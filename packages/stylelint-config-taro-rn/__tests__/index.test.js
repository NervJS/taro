const stylelint = require('stylelint')

describe('stylelint-config-react-native-css-modules', () => {
  async function runStylelint (css) {
    return stylelint.lint({
      code: css,
      formatter: 'string',
      config: {
        extends: './index.js'
      },
    })
  }

  it('does not allow vendor prefixes in values', async () => {
    const css = '.test { display: -webkit-flex; }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(true)
    expect(result.report.includes('value-no-vendor-prefix')).toBe(true)
  })

  it('does not allow vendor prefixes in properties', async () => {
    const css = '.test { -webkit-transform: scale(1); }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(true)
    expect(result.report.includes('property-no-vendor-prefix')).toBe(true)
  })

  it('does not allow vendor prefixes in at-rules', async () => {
    const css =
      '.test { @-webkit-keyframes() { 0% { color: blue } 100% { color: red; } }  }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(true)
    expect(result.report.includes('at-rule-no-vendor-prefix')).toBe(true)
  })

  it('does not allow vendor prefixes in media features', async () => {
    const css =
      '@media (-webkit-min-device-pixel-ratio: 1) { .foo { color: blue; } }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(true)
    expect(result.report.includes('media-feature-name-no-vendor-prefix')).toBe(true)
  })

  it('does not allow unknown properties', async () => {
    const css = '.test { word-wrap: break-word; }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(true)
    expect(result.report.includes('taro-rn/css-property-no-unknown')).toBe(true)
  })

  it('warns for id selectors', async () => {
    const css = '#test { flex: 1 }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.report.includes('selector-max-id')).toBe(true)
  })

  it('warns for type selectors', async () => {
    const css = 'input { flex: 1 }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.output.includes('selector-max-type')).toBe(true)
  })

  it('warns for universal selectors', async () => {
    const css = '* { flex: 1 }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.output.includes('selector-max-universal')).toBe(true)
  })

  it('warns for combinator selectors', async () => {
    const css = '.foo + .bar { flex: 1 }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.output.includes('selector-max-combinators')).toBe(true)
  })

  it('warns for attribute selectors', async () => {
    const css = '[type=\'text\'] { flex: 1 }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.output.includes('selector-max-attribute')).toBe(true)
  })

  it('warns for qualifying type selectors', async () => {
    const css = 'a.link { flex: 1 }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.output.includes('selector-max-type')).toBe(true)
  })

  it('warns for pseudo classes', async () => {
    const css = '.foo:before { flex: 1 }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.output.includes('selector-pseudo-class-allowed-list')).toBe(true)
  })

  it('does not warn for ICSS :export pseudo-selector', async () => {
    const css = ':export { color: red; }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.output).toBe('')
  })

  it('does not warn for :root pseudo-selector', async () => {
    const css = ':root { --my-color: red; }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.output).toBe('')
  })

  it('warns for font-weights that are not compatible with Android', async () => {
    const css = '.foo { font-weight: 300 }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.output.includes('taro-rn/font-weight-no-ignored-values')).toBe(true)
  })

  it('does not allow for line-heights that are invalid', async () => {
    const css = '.foo { line-height: 1 }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(true)
    expect(result.output.includes('line-height "1"')).toBe(true)
  })

  it('warns for incompatible @-rules', async () => {
    const css = '.foo { @keyframes() { 0% { color: blue } 100% { color: red; } } }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.output.includes('at-rule-disallowed-list')).toBe(true)
  })

  it('warns for @charset', async () => {
    const css = '@charset "utf-8";'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.output.includes('at-rule-disallowed-list')).toBe(true)
  })

  it('warns for incompatible units', async () => {
    const css = '.foo { font-size: 1ch; }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
    expect(result.output.includes('unit-allowed-list')).toBe(true)
  })

  it('allows pseudo and type selectors (ignored by React Native CSS modules, but can be used for web when creating hybrid apps)', async () => {
    const css = '.test:hover { color: blue; } .test input[type=text] { color: red; }'
    const result = await runStylelint(css)

    expect(result.errored).toBe(false)
  })
})
