let Style

describe('style', () => {
  const runtime = require('../../dist/runtime.esm')
  Style = runtime.Style
  const document = runtime.document

  afterAll(() => {
    process.env.FRAMEWORK = ''
  })

  it('works', () => {
    const root = document.createElement('root')
    const style = new Style(root)
    style.color = 'red'
    expect(style._usedStyleProp.size).toBe(1)
    expect(style.getPropertyValue('color')).toBe('red')
    style.fontSize = '16'
    expect(style._usedStyleProp.size).toBe(2)
    expect(style.getPropertyValue('font-size')).toBe('16')
    style.removeProperty('font-size')
    expect(style._usedStyleProp.size).toBe(1)
    expect(style.fontSize).toBe('')
    style.setProperty('font-weight', 'bold')
    expect(style._usedStyleProp.size).toBe(2)
    expect(style.fontWeight).toBe('bold')
    expect(style.cssText).toBe('color: red; font-weight: bold;')
    style.cssText = ''
    expect(style.cssText).toBe('')
    expect(style._usedStyleProp.size).toBe(0)
    expect(style.color).toBe('')
    expect(style.fontWeight).toBe('')
    style.textAlign = 'center'
    expect(style.cssText).toBe('text-align: center;')
    style.cssText = 'color: red; font-weight: bold;'
    expect(style._usedStyleProp.size).toBe(2)
    expect(style.fontWeight).toBe('bold')
    expect(style.color).toBe('red')
  })
})
